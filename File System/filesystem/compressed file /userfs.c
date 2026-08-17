
#define _FILE_OFFSET_BITS 64
#define _POSIX_C_SOURCE 200809L

#include "userfs.h"

#include <errno.h>
#include <fcntl.h>
#include <inttypes.h>
#include <limits.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/types.h>

/*
 * UserFS Z-Node filesystem
 *
 * Architecture implemented here:
 *   - user-space disk-image filesystem
 *   - fixed 4 KiB I/O pages
 *   - variable physical allocation granularities: 512 B, 4 KiB, 16 KiB
 *   - zone-oriented layout
 *   - Z-Nodes live in their home zone
 *   - compound object IDs: (zone_id, local_id)
 *   - variable-granularity extents
 *   - global zone summaries + per-zone bitmap at 512 B resolution
 *   - small in-memory adaptive hot directory cache
 *   - delta journal for metadata/allocation transactions
 *   - inline extents with chained overflow extent pages
 *   - contiguous-first allocation with fragmentation fallback
 *   - in-place extension when a one-extent file has adjacent free space
 *
 * This is a project baseline: the data path and on-disk format are
 * intentionally compact and readable rather than optimized.
 */

#define UFS_MAGIC 0x55465332u
#define UFS_VERSION 2u

#define UFS_MIN_IMAGE (8u * 1024u * 1024u)
#define UFS_MAX_ZONES 32u
#define UFS_MIN_ZONES 4u
#define UFS_ZNODE_SLOTS 32u
#define UFS_EXTENTS 16u

#define UFS_UNIT 512u
#define UFS_SMALL_GRAN 512u
#define UFS_MEDIUM_GRAN 4096u
#define UFS_LARGE_GRAN 16384u

#define UFS_ZONE_MAGIC 0x5A4F4E45u /* ZONE */
#define UFS_ZNODE_MAGIC 0x5A4E4F44u /* ZNOD */

#define UFS_JOURNAL_MAGIC 0x4A524E31u /* JRN1 */
#define UFS_JOURNAL_RECORDS 512u

#define UFS_HOT_ENTRIES 128u
#define UFS_TX_MAX_OPS 64u

#define UFS_ALIGN_UP(x, a) (((x) + ((a) - 1u)) / (a) * (a))

typedef struct __attribute__((packed)) {
    uint64_t logical_start;
    uint64_t logical_length;
    uint16_t zone_id;
    uint16_t granularity;
    uint32_t physical_unit;
    uint32_t physical_units;
} ufs_extent_disk_t;

#define UFS_EXTENT_PAGE_MAGIC 0x45585047u /* EXPG */

typedef struct __attribute__((packed)) {
    uint32_t magic;
    uint16_t version;
    uint16_t size_class;
    uint32_t local_id;
    uint16_t type;
    uint16_t flags;
    uint64_t size;
    uint64_t parent_id;
    uint16_t preferred_granularity;
    uint16_t extent_count;
    uint32_t generation;
    uint64_t extent_overflow_id;
    ufs_extent_disk_t extents[UFS_EXTENTS];
    uint8_t reserved[
        512 - (4 + 2 + 2 + 4 + 2 + 2 + 8 + 8 + 2 + 2 + 4 + 8 +
               (UFS_EXTENTS * sizeof(ufs_extent_disk_t)))
    ];
} znode_disk_t;

#define UFS_EXTENTS_PER_PAGE     ((512u - 16u) / sizeof(ufs_extent_disk_t))

typedef struct __attribute__((packed)) {
    uint32_t magic;
    uint16_t version;
    uint16_t count;
    uint64_t next_id;
    ufs_extent_disk_t extents[UFS_EXTENTS_PER_PAGE];
    uint8_t reserved[
        512u -
        (16u + UFS_EXTENTS_PER_PAGE * sizeof(ufs_extent_disk_t))
    ];
} extent_page_disk_t;

typedef struct __attribute__((packed)) {
    char name[UFS_MAX_NAME + 1];
    uint8_t type;
    uint8_t active;
    uint16_t reserved;
    uint64_t object_id;
    uint32_t generation;
} dir_disk_t;

typedef struct __attribute__((packed)) {
    uint32_t zone_id;
    uint32_t free_units;
    uint32_t largest_free_run;
    uint32_t total_units;
    uint32_t znode_used;
    uint32_t reserved;
} zone_summary_disk_t;

typedef struct __attribute__((packed)) {
    uint32_t magic;
    uint32_t version;
    uint32_t image_size;
    uint32_t total_pages;
    uint32_t zone_count;
    uint32_t zone_size;
    uint32_t zone_header_pages;
    uint32_t znode_table_pages;
    uint32_t bitmap_pages;
    uint32_t journal_start_page;
    uint32_t journal_pages;
    uint32_t zones_start_page;
    uint64_t root_id;
    uint64_t next_txid;
    uint32_t journal_head;
    uint32_t clean;
    uint32_t checksum;
    zone_summary_disk_t zones[UFS_MAX_ZONES];
    uint8_t padding[UFS_BLOCK_SIZE -
                    (12 * 4 + 8 + 8 + 4 + 4 + 4 +
                     (UFS_MAX_ZONES * sizeof(zone_summary_disk_t)))];
} superblock_disk_t;

typedef struct __attribute__((packed)) {
    uint32_t magic;
    uint32_t version;
    uint32_t zone_id;
    uint32_t total_units;
    uint32_t data_first_unit;
    uint32_t bitmap_bytes;
    uint32_t znode_slots;
    uint32_t flags;
    uint8_t padding[UFS_BLOCK_SIZE - 32];
} zone_header_disk_t;

typedef enum {
    JOP_NONE = 0,
    JOP_BEGIN = 1,
    JOP_SET_ZNODE = 2,
    JOP_DIR_SLOT = 3,
    JOP_SET_BITMAP = 4,
    JOP_COMMIT = 5,
    JOP_FREE_ZNODE = 6
} journal_type_t;

typedef struct __attribute__((packed)) {
    uint32_t magic;
    uint16_t version;
    uint16_t type;
    uint16_t size;
    uint16_t reserved0;
    uint64_t txid;
    uint64_t object_id;
    uint32_t zone_id;
    uint32_t aux;
    uint32_t bitmap_unit;
    uint32_t bitmap_value;
    znode_disk_t znode;
    dir_disk_t dirent;
    uint8_t reserved[UFS_BLOCK_SIZE -
                     (4 + 2 + 2 + 2 + 2 + 8 + 8 + 4 + 4 + 4 + 4 +
                      sizeof(znode_disk_t) + sizeof(dir_disk_t))];
} journal_record_disk_t;

_Static_assert(sizeof(ufs_extent_disk_t) == 28, "extent size");
_Static_assert(sizeof(znode_disk_t) == 512, "znode must be 512 bytes");
_Static_assert(sizeof(extent_page_disk_t) == 512,
               "extent page must be 512 bytes");
_Static_assert(sizeof(dir_disk_t) == 64, "dir entry must be 64 bytes");
_Static_assert(sizeof(zone_summary_disk_t) == 24, "zone summary size");
_Static_assert(sizeof(superblock_disk_t) == UFS_BLOCK_SIZE, "superblock size");
_Static_assert(sizeof(zone_header_disk_t) == UFS_BLOCK_SIZE, "zone header size");
_Static_assert(sizeof(journal_record_disk_t) == UFS_BLOCK_SIZE, "journal record size");

typedef struct {
    int used;
    uint64_t znode_id;
    int flags;
    off_t offset;
} open_file_t;

typedef struct {
    int valid;
    uint64_t dir_id;
    uint64_t name_hash;
    uint64_t object_id;
    uint64_t last_used;
    char name[UFS_MAX_NAME + 1];
} hot_entry_t;

typedef struct {
    uint64_t txid;
    int active;
    int op_count;
} transaction_t;

typedef struct {
    int fd;
    superblock_disk_t sb;
    uint8_t *zone_bitmaps[UFS_MAX_ZONES];
    znode_disk_t znode_cache[UFS_MAX_ZONES][UFS_ZNODE_SLOTS];
    unsigned char znode_loaded[UFS_MAX_ZONES][UFS_ZNODE_SLOTS];
    open_file_t fds[UFS_MAX_OPEN_FILES];
    hot_entry_t hot[UFS_HOT_ENTRIES];
    uint64_t hot_clock;
} fs_state_t;

static fs_state_t g_fs = {.fd = -1};

static int fs_mounted(void) {
    if (g_fs.fd < 0) {
        errno = EINVAL;
        return 0;
    }
    return 1;
}

static uint32_t fnv1a32(const void *data, size_t len) {
    const unsigned char *p = (const unsigned char *)data;
    uint32_t h = 2166136261u;
    for (size_t i = 0; i < len; ++i) {
        h ^= p[i];
        h *= 16777619u;
    }
    return h;
}

static uint64_t fnv1a64_str(const char *s) {
    const unsigned char *p = (const unsigned char *)s;
    uint64_t h = 1469598103934665603ULL;
    while (*p) {
        h ^= *p++;
        h *= 1099511628211ULL;
    }
    return h;
}

static uint32_t checksum_superblock(const superblock_disk_t *sb) {
    superblock_disk_t tmp = *sb;
    tmp.checksum = 0;
    return fnv1a32(&tmp, sizeof(tmp));
}

static int disk_read_page(uint32_t page, void *buf) {
    off_t off = (off_t)page * UFS_BLOCK_SIZE;
    if (lseek(g_fs.fd, off, SEEK_SET) < 0) return -1;
    ssize_t got = read(g_fs.fd, buf, UFS_BLOCK_SIZE);
    return got == (ssize_t)UFS_BLOCK_SIZE ? 0 : -1;
}

static int disk_write_page(uint32_t page, const void *buf) {
    off_t off = (off_t)page * UFS_BLOCK_SIZE;
    if (lseek(g_fs.fd, off, SEEK_SET) < 0) return -1;
    ssize_t wr = write(g_fs.fd, buf, UFS_BLOCK_SIZE);
    return wr == (ssize_t)UFS_BLOCK_SIZE ? 0 : -1;
}

static int disk_flush(void) {
    return fsync(g_fs.fd);
}

static uint32_t zone_start_page(uint32_t zone_id) {
    return g_fs.sb.zones_start_page + zone_id *
           (g_fs.sb.zone_size / UFS_BLOCK_SIZE);
}

static int read_zone_header(uint32_t zone_id, zone_header_disk_t *zh) {
    if (zone_id >= g_fs.sb.zone_count) {
        errno = EINVAL;
        return -1;
    }
    return disk_read_page(zone_start_page(zone_id), zh);
}

static uint32_t zone_data_units(const zone_header_disk_t *zh) {
    return zh->total_units - zh->data_first_unit;
}

static uint32_t zone_bitmap_page(uint32_t zone_id) {
    zone_header_disk_t zh;
    if (read_zone_header(zone_id, &zh) < 0) return UINT32_MAX;
    uint32_t pages = g_fs.sb.zone_size / UFS_BLOCK_SIZE;
    uint32_t zsp = zone_start_page(zone_id);
    uint32_t znode_pages = g_fs.sb.znode_table_pages;
    (void)pages;
    return zsp + 1 + znode_pages;
}

static uint32_t zone_znode_page(uint32_t zone_id, uint32_t local_id) {
    uint32_t start = zone_start_page(zone_id);
    return start + 1 + (local_id * sizeof(znode_disk_t)) / UFS_BLOCK_SIZE;
}

static uint32_t zone_znode_offset(uint32_t local_id) {
    return (local_id * sizeof(znode_disk_t)) % UFS_BLOCK_SIZE;
}

static int read_znode(uint64_t id, znode_disk_t *out) {
    uint32_t zone = (uint32_t)(id >> 32);
    uint32_t local = (uint32_t)(id & 0xffffffffu);
    if (zone >= g_fs.sb.zone_count || local >= UFS_ZNODE_SLOTS) {
        errno = ENOENT;
        return -1;
    }
    if (g_fs.znode_loaded[zone][local]) {
        *out = g_fs.znode_cache[zone][local];
        return 0;
    }

    unsigned char page[UFS_BLOCK_SIZE];
    if (disk_read_page(zone_znode_page(zone, local), page) < 0) {
        errno = EIO;
        return -1;
    }
    memcpy(out, page + zone_znode_offset(local), sizeof(*out));
    g_fs.znode_cache[zone][local] = *out;
    g_fs.znode_loaded[zone][local] = 1;
    return 0;
}

static int write_znode(uint64_t id, const znode_disk_t *zn) {
    uint32_t zone = (uint32_t)(id >> 32);
    uint32_t local = (uint32_t)(id & 0xffffffffu);
    if (zone >= g_fs.sb.zone_count || local >= UFS_ZNODE_SLOTS) {
        errno = EINVAL;
        return -1;
    }

    unsigned char page[UFS_BLOCK_SIZE];
    if (disk_read_page(zone_znode_page(zone, local), page) < 0) {
        errno = EIO;
        return -1;
    }
    memcpy(page + zone_znode_offset(local), zn, sizeof(*zn));
    if (disk_write_page(zone_znode_page(zone, local), page) < 0) {
        errno = EIO;
        return -1;
    }
    g_fs.znode_cache[zone][local] = *zn;
    g_fs.znode_loaded[zone][local] = 1;
    return 0;
}

static int load_zone_bitmap(uint32_t zone_id) {
    if (g_fs.zone_bitmaps[zone_id]) return 0;

    zone_header_disk_t zh;
    if (read_zone_header(zone_id, &zh) < 0) {
        errno = EIO;
        return -1;
    }
    size_t bytes = zh.bitmap_bytes;
    g_fs.zone_bitmaps[zone_id] = calloc(1, bytes);
    if (!g_fs.zone_bitmaps[zone_id]) {
        errno = ENOMEM;
        return -1;
    }

    uint32_t pages = (uint32_t)((bytes + UFS_BLOCK_SIZE - 1) / UFS_BLOCK_SIZE);
    unsigned char buf[UFS_BLOCK_SIZE];

    for (uint32_t i = 0; i < pages; ++i) {
        if (disk_read_page(zone_bitmap_page(zone_id) + i, buf) < 0) {
            free(g_fs.zone_bitmaps[zone_id]);
            g_fs.zone_bitmaps[zone_id] = NULL;
            errno = EIO;
            return -1;
        }
        size_t left = bytes - (size_t)i * UFS_BLOCK_SIZE;
        size_t take = left < UFS_BLOCK_SIZE ? left : UFS_BLOCK_SIZE;
        memcpy(g_fs.zone_bitmaps[zone_id] + (size_t)i * UFS_BLOCK_SIZE,
               buf, take);
    }
    return 0;
}

static int flush_zone_bitmap(uint32_t zone_id) {
    if (load_zone_bitmap(zone_id) < 0) return -1;

    zone_header_disk_t zh;
    if (read_zone_header(zone_id, &zh) < 0) return -1;

    uint32_t pages = (uint32_t)((zh.bitmap_bytes + UFS_BLOCK_SIZE - 1) / UFS_BLOCK_SIZE);
    unsigned char buf[UFS_BLOCK_SIZE];
    for (uint32_t i = 0; i < pages; ++i) {
        memset(buf, 0, sizeof(buf));
        size_t left = zh.bitmap_bytes - (size_t)i * UFS_BLOCK_SIZE;
        size_t take = left < UFS_BLOCK_SIZE ? left : UFS_BLOCK_SIZE;
        memcpy(buf, g_fs.zone_bitmaps[zone_id] + (size_t)i * UFS_BLOCK_SIZE, take);
        if (disk_write_page(zone_bitmap_page(zone_id) + i, buf) < 0) {
            errno = EIO;
            return -1;
        }
    }
    return 0;
}

static int bit_get(uint8_t *bm, uint32_t bit) {
    return (bm[bit / 8u] >> (bit % 8u)) & 1u;
}

static void bit_set(uint8_t *bm, uint32_t bit) {
    bm[bit / 8u] |= (uint8_t)(1u << (bit % 8u));
}

static void bit_clear(uint8_t *bm, uint32_t bit) {
    bm[bit / 8u] &= (uint8_t)~(1u << (bit % 8u));
}

static uint16_t choose_granularity(uint64_t bytes) {
    if (bytes <= UFS_SMALL_GRAN) return UFS_SMALL_GRAN;
    if (bytes <= UFS_MEDIUM_GRAN) return UFS_MEDIUM_GRAN;
    return UFS_LARGE_GRAN;
}

static uint32_t round_units_to_gran(uint64_t bytes, uint16_t gran) {
    uint64_t rounded = UFS_ALIGN_UP(bytes, gran);
    return (uint32_t)(rounded / UFS_UNIT);
}

static uint64_t make_object_id(uint32_t zone, uint32_t local) {
    return ((uint64_t)zone << 32) | (uint64_t)local;
}

static uint32_t object_zone(uint64_t id) {
    return (uint32_t)(id >> 32);
}

static int read_extent_page(uint64_t id, extent_page_disk_t *out) {
    uint32_t zone = (uint32_t)(id >> 32);
    uint32_t local = (uint32_t)(id & 0xffffffffu);

    if (zone >= g_fs.sb.zone_count || local >= UFS_ZNODE_SLOTS) {
        errno = EINVAL;
        return -1;
    }

    unsigned char page[UFS_BLOCK_SIZE];

    if (disk_read_page(zone_znode_page(zone, local), page) < 0) {
        errno = EIO;
        return -1;
    }

    memcpy(out,
           page + zone_znode_offset(local),
           sizeof(*out));

    if (out->magic != UFS_EXTENT_PAGE_MAGIC ||
        out->version != UFS_VERSION ||
        out->count > UFS_EXTENTS_PER_PAGE) {
        errno = EIO;
        return -1;
    }

    return 0;
}

static int write_extent_page(uint64_t id,
                             const extent_page_disk_t *ep) {
    uint32_t zone = (uint32_t)(id >> 32);
    uint32_t local = (uint32_t)(id & 0xffffffffu);

    if (zone >= g_fs.sb.zone_count || local >= UFS_ZNODE_SLOTS) {
        errno = EINVAL;
        return -1;
    }

    unsigned char page[UFS_BLOCK_SIZE];

    if (disk_read_page(zone_znode_page(zone, local), page) < 0) {
        errno = EIO;
        return -1;
    }

    memcpy(page + zone_znode_offset(local),
           ep,
           sizeof(*ep));

    if (disk_write_page(zone_znode_page(zone, local), page) < 0) {
        errno = EIO;
        return -1;
    }

    g_fs.znode_loaded[zone][local] = 0;
    return 0;
}

static int allocate_extent_page(int preferred_zone,
                                uint64_t *out_id) {
    uint32_t first =
        preferred_zone >= 0 ? (uint32_t)preferred_zone : 0;

    for (uint32_t pass = 0; pass < 2; ++pass) {
        for (uint32_t i = 0; i < g_fs.sb.zone_count; ++i) {
            uint32_t z =
                (pass == 0)
                    ? (first + i) % g_fs.sb.zone_count
                    : i;

            for (uint32_t local = 1;
                 local < UFS_ZNODE_SLOTS;
                 ++local) {

                unsigned char page[UFS_BLOCK_SIZE];

                if (disk_read_page(
                        zone_znode_page(z, local),
                        page) < 0) {
                    continue;
                }

                uint32_t magic = 0;
                memcpy(&magic,
                       page + zone_znode_offset(local),
                       sizeof(magic));

                if (magic == UFS_ZNODE_MAGIC ||
                    magic == UFS_EXTENT_PAGE_MAGIC) {
                    continue;
                }

                extent_page_disk_t ep;
                memset(&ep, 0, sizeof(ep));
                ep.magic = UFS_EXTENT_PAGE_MAGIC;
                ep.version = UFS_VERSION;

                memcpy(page + zone_znode_offset(local),
                       &ep,
                       sizeof(ep));

                if (disk_write_page(
                        zone_znode_page(z, local),
                        page) < 0) {
                    errno = EIO;
                    return -1;
                }

                g_fs.znode_loaded[z][local] = 0;
                ++g_fs.sb.zones[z].znode_used;

                *out_id = make_object_id(z, local);
                return 0;
            }
        }
    }

    errno = ENOSPC;
    return -1;
}

static int free_extent_page(uint64_t id) {
    uint32_t zone = (uint32_t)(id >> 32);
    uint32_t local = (uint32_t)(id & 0xffffffffu);

    if (zone >= g_fs.sb.zone_count ||
        local >= UFS_ZNODE_SLOTS) {
        errno = EINVAL;
        return -1;
    }

    unsigned char blank[UFS_BLOCK_SIZE];
    memset(blank, 0, sizeof(blank));

    if (disk_write_page(
            zone_znode_page(zone, local),
            blank) < 0) {
        errno = EIO;
        return -1;
    }

    g_fs.znode_loaded[zone][local] = 0;

    if (g_fs.sb.zones[zone].znode_used > 0)
        --g_fs.sb.zones[zone].znode_used;

    return 0;
}

static int update_zone_summary(uint32_t zone_id) {
    zone_header_disk_t zh;
    if (read_zone_header(zone_id, &zh) < 0) return -1;
    if (load_zone_bitmap(zone_id) < 0) return -1;

    uint32_t units = zone_data_units(&zh);
    uint32_t free_units = 0;
    uint32_t largest = 0;
    uint32_t run = 0;

    for (uint32_t i = zh.data_first_unit; i < zh.total_units; ++i) {
        int used = bit_get(g_fs.zone_bitmaps[zone_id], i);
        if (!used) {
            ++free_units;
            ++run;
            if (run > largest) largest = run;
        } else {
            run = 0;
        }
    }

    g_fs.sb.zones[zone_id].zone_id = zone_id;
    g_fs.sb.zones[zone_id].free_units = free_units;
    g_fs.sb.zones[zone_id].largest_free_run = largest;
    g_fs.sb.zones[zone_id].total_units = units;
    return 0;
}

static int append_journal_record(const journal_record_disk_t *rec) {
    uint32_t idx = g_fs.sb.journal_head % UFS_JOURNAL_RECORDS;
    uint32_t page = g_fs.sb.journal_start_page + idx;
    if (disk_write_page(page, rec) < 0) {
        errno = EIO;
        return -1;
    }
    g_fs.sb.journal_head = (idx + 1u) % UFS_JOURNAL_RECORDS;
    return 0;
}

static void journal_init_record(journal_record_disk_t *r, uint16_t type,
                                uint64_t txid) {
    memset(r, 0, sizeof(*r));
    r->magic = UFS_JOURNAL_MAGIC;
    r->version = 1;
    r->type = type;
    r->size = sizeof(*r);
    r->txid = txid;
}

static int journal_begin(transaction_t *tx) {
    if (tx->active) {
        errno = EBUSY;
        return -1;
    }
    tx->txid = ++g_fs.sb.next_txid;
    tx->active = 1;
    tx->op_count = 0;

    journal_record_disk_t r;
    journal_init_record(&r, JOP_BEGIN, tx->txid);
    return append_journal_record(&r);
}

static int journal_commit(transaction_t *tx) {
    if (!tx->active) return 0;
    journal_record_disk_t r;
    journal_init_record(&r, JOP_COMMIT, tx->txid);
    if (append_journal_record(&r) < 0) return -1;
    if (disk_flush() < 0) {
        errno = EIO;
        return -1;
    }
    tx->active = 0;
    return 0;
}

static int journal_znode(transaction_t *tx, uint64_t object_id,
                         const znode_disk_t *zn) {
    if (!tx->active) return 0;
    if ((unsigned)tx->op_count >= UFS_TX_MAX_OPS) {
        errno = ENOSPC;
        return -1;
    }
    journal_record_disk_t r;
    journal_init_record(&r, JOP_SET_ZNODE, tx->txid);
    r.object_id = object_id;
    r.znode = *zn;
    if (append_journal_record(&r) < 0) return -1;
    tx->op_count++;
    return 0;
}

static int journal_dir_slot(transaction_t *tx, uint64_t dir_id,
                            uint32_t slot, const dir_disk_t *de) {
    if (!tx->active) return 0;
    if ((unsigned)tx->op_count >= UFS_TX_MAX_OPS) {
        errno = ENOSPC;
        return -1;
    }
    journal_record_disk_t r;
    journal_init_record(&r, JOP_DIR_SLOT, tx->txid);
    r.object_id = dir_id;
    r.aux = slot;
    r.dirent = *de;
    if (append_journal_record(&r) < 0) return -1;
    tx->op_count++;
    return 0;
}

/*
 * Recovery replays only committed transactions.
 * Because bitmap changes are also journaled, an incomplete transaction that
 * never reached COMMIT is ignored and its in-memory changes were never flushed.
 */
static int replay_journal(void) {
    uint64_t active_tx = 0;
    int committed = 0;

    typedef struct {
        journal_record_disk_t recs[UFS_TX_MAX_OPS];
        size_t count;
    } replay_tx_t;

    replay_tx_t tx = {0};

    for (uint32_t i = 0; i < UFS_JOURNAL_RECORDS; ++i) {
        journal_record_disk_t r;
        if (disk_read_page(g_fs.sb.journal_start_page + i, &r) < 0) {
            errno = EIO;
            return -1;
        }
        if (r.magic != UFS_JOURNAL_MAGIC) continue;

        if (r.type == JOP_BEGIN) {
            active_tx = r.txid;
            committed = 0;
            tx.count = 0;
        } else if (r.type == JOP_SET_ZNODE || r.type == JOP_DIR_SLOT ||
                   r.type == JOP_SET_BITMAP) {
            if (active_tx == r.txid && tx.count < UFS_TX_MAX_OPS) {
                tx.recs[tx.count++] = r;
            }
        } else if (r.type == JOP_COMMIT && active_tx == r.txid) {
            committed = 1;
            if (committed) {
                for (size_t j = 0; j < tx.count; ++j) {
                    journal_record_disk_t *op = &tx.recs[j];
                    if (op->type == JOP_SET_ZNODE) {
                        if (write_znode(op->object_id, &op->znode) < 0) return -1;
                    } else if (op->type == JOP_DIR_SLOT) {
                        znode_disk_t dir;
                        if (read_znode(op->object_id, &dir) < 0) return -1;
                        ufs_extent_disk_t *dummy = dir.extents;
                        (void)dummy;

                        /* Directory content is a normal file; locate slot. */
                        size_t off = (size_t)op->aux * sizeof(dir_disk_t);
                        size_t extent_pos = 0;
                        uint8_t page[UFS_BLOCK_SIZE];
                        int applied = 0;
                        while (extent_pos < dir.extent_count) {
                            ufs_extent_disk_t *ex = &dir.extents[extent_pos];
                            if (off < ex->logical_length) {
                                uint64_t phys_byte =
                                    (uint64_t)ex->physical_unit * UFS_UNIT +
                                    off;
                                uint32_t zp = zone_start_page(ex->zone_id);
                                uint32_t unit = (uint32_t)(phys_byte / UFS_UNIT);
                                uint32_t within = (uint32_t)(phys_byte % UFS_UNIT);
                                off_t abs = (off_t)zp * UFS_BLOCK_SIZE +
                                            (off_t)unit * UFS_UNIT;
                                if (lseek(g_fs.fd, abs, SEEK_SET) < 0) return -1;
                                if (read(g_fs.fd, page, sizeof(dir_disk_t)) != sizeof(dir_disk_t))
                                    return -1;
                                if (lseek(g_fs.fd, abs, SEEK_SET) < 0) return -1;
                                memcpy(page, &op->dirent, sizeof(op->dirent));
                                if (write(g_fs.fd, page, sizeof(op->dirent)) != sizeof(op->dirent))
                                    return -1;
                                (void)within;
                                applied = 1;
                                break;
                            }
                            off -= (size_t)ex->logical_length;
                            ++extent_pos;
                        }
                        if (!applied) return -1;
                    } else if (op->type == JOP_SET_BITMAP) {
                        if (load_zone_bitmap(op->zone_id) < 0) return -1;
                        if (op->bitmap_value) bit_set(g_fs.zone_bitmaps[op->zone_id], op->bitmap_unit);
                        else bit_clear(g_fs.zone_bitmaps[op->zone_id], op->bitmap_unit);
                    }
                }
                for (uint32_t z = 0; z < g_fs.sb.zone_count; ++z) {
                    if (g_fs.zone_bitmaps[z]) {
                        if (flush_zone_bitmap(z) < 0) return -1;
                        if (update_zone_summary(z) < 0) return -1;
                    }
                }
                g_fs.sb.checksum = checksum_superblock(&g_fs.sb);
                if (disk_write_page(0, &g_fs.sb) < 0) return -1;
                if (disk_flush() < 0) return -1;
            }
            active_tx = 0;
            tx.count = 0;
            committed = 0;
        }
    }
    return 0;
}

static int choose_zone_for_allocation(uint32_t need_units, uint32_t preferred_zone) {
    int best = -1;
    uint32_t best_largest = 0;

    for (uint32_t pass = 0; pass < 2; ++pass) {
        for (uint32_t z = 0; z < g_fs.sb.zone_count; ++z) {
            uint32_t zone = (pass == 0) ? (preferred_zone + z) % g_fs.sb.zone_count : z;
            if (zone == 0 && preferred_zone != 0) {
                /* zone 0 is still valid; don't exclude it */
            }
            zone_header_disk_t zh;
            if (read_zone_header(zone, &zh) < 0) continue;
            if (load_zone_bitmap(zone) < 0) continue;
            if (update_zone_summary(zone) < 0) continue;

            if (g_fs.sb.zones[zone].largest_free_run >= need_units &&
                g_fs.sb.zones[zone].largest_free_run > best_largest) {
                best = (int)zone;
                best_largest = g_fs.sb.zones[zone].largest_free_run;
            }
        }
        if (best >= 0) return best;
    }
    return -1;
}

static int choose_zone_for_partial_allocation(
    uint32_t preferred_zone,
    uint32_t *out_zone,
    uint32_t *out_largest_run)
{
    int best = -1;
    uint32_t best_run = 0;

    for (uint32_t z = 0;
         z < g_fs.sb.zone_count;
         ++z) {

        uint32_t zone =
            (preferred_zone + z) %
            g_fs.sb.zone_count;

        zone_header_disk_t zh;

        if (read_zone_header(zone, &zh) < 0)
            continue;
        if (load_zone_bitmap(zone) < 0)
            continue;
        if (update_zone_summary(zone) < 0)
            continue;

        uint32_t largest =
            g_fs.sb.zones[zone].largest_free_run;

        if (largest > best_run) {
            best = (int)zone;
            best_run = largest;
        }
    }

    if (best < 0 || best_run == 0) {
        errno = ENOSPC;
        return -1;
    }

    *out_zone = (uint32_t)best;
    *out_largest_run = best_run;
    return 0;
}

static int allocate_physical_region(uint64_t preferred_zone,
                                    uint64_t bytes,
                                    uint16_t granularity,
                                    uint16_t *out_zone,
                                    uint32_t *out_unit,
                                    uint32_t *out_units) {
    uint32_t need_units =
        round_units_to_gran(bytes, granularity);

    if (need_units == 0)
        need_units = 1;

    /*
     * First choice: the entire request in one contiguous run.
     */
    int zone =
        choose_zone_for_allocation(
            need_units,
            (uint32_t)preferred_zone);

    uint32_t target_units = need_units;

    /*
     * Fragmentation fallback: return the largest contiguous free
     * run we can get. ensure_capacity() will ask again for the
     * remainder and create another extent.
     */
    if (zone < 0) {
        uint32_t partial_zone;
        uint32_t largest_run;

        if (choose_zone_for_partial_allocation(
                (uint32_t)preferred_zone,
                &partial_zone,
                &largest_run) < 0) {
            errno = ENOSPC;
            return -1;
        }

        zone = (int)partial_zone;
        target_units =
            largest_run < need_units
                ? largest_run
                : need_units;
    }

    zone_header_disk_t zh;

    if (read_zone_header(
            (uint32_t)zone,
            &zh) < 0) {
        return -1;
    }

    if (load_zone_bitmap(
            (uint32_t)zone) < 0) {
        return -1;
    }

    uint32_t run = 0;
    uint32_t start = 0;

    for (uint32_t u = zh.data_first_unit;
         u < zh.total_units;
         ++u) {

        if (!bit_get(
                g_fs.zone_bitmaps[zone],
                u)) {

            if (run == 0)
                start = u;

            ++run;

            if (run >= target_units) {
                for (uint32_t i = start;
                     i < start + target_units;
                     ++i) {
                    bit_set(
                        g_fs.zone_bitmaps[zone],
                        i);
                }

                *out_zone = (uint16_t)zone;
                *out_unit = start;
                *out_units = target_units;
                return 0;
            }
        } else {
            run = 0;
        }
    }

    errno = ENOSPC;
    return -1;
}

static int free_physical_region(uint16_t zone, uint32_t unit, uint32_t units) {
    if (zone >= g_fs.sb.zone_count) {
        errno = EINVAL;
        return -1;
    }
    if (load_zone_bitmap(zone) < 0) return -1;

    for (uint32_t i = unit; i < unit + units; ++i)
        bit_clear(g_fs.zone_bitmaps[zone], i);
    return 0;
}

static int flush_superblock(void) {
    g_fs.sb.checksum = checksum_superblock(&g_fs.sb);
    if (disk_write_page(0, &g_fs.sb) < 0) {
        errno = EIO;
        return -1;
    }
    return disk_flush();
}

static int zone_write_bytes(uint32_t zone, uint32_t unit, uint32_t offset,
                            const void *buf, size_t len) {
    zone_header_disk_t zh;
    if (read_zone_header(zone, &zh) < 0) return -1;

    off_t abs = (off_t)zone_start_page(zone) * UFS_BLOCK_SIZE +
                (off_t)unit * UFS_UNIT + offset;

    if (lseek(g_fs.fd, abs, SEEK_SET) < 0) return -1;
    return write(g_fs.fd, buf, len) == (ssize_t)len ? 0 : -1;
}

static int zone_read_bytes(uint32_t zone, uint32_t unit, uint32_t offset,
                           void *buf, size_t len) {
    zone_header_disk_t zh;
    if (read_zone_header(zone, &zh) < 0) return -1;

    off_t abs = (off_t)zone_start_page(zone) * UFS_BLOCK_SIZE +
                (off_t)unit * UFS_UNIT + offset;

    if (lseek(g_fs.fd, abs, SEEK_SET) < 0) return -1;
    return read(g_fs.fd, buf, len) == (ssize_t)len ? 0 : -1;
}

static int mapping_find(const znode_disk_t *zn,
                        uint64_t logical,
                        ufs_extent_disk_t *out,
                        uint64_t *inside) {
    for (size_t i = 0;
         i < zn->extent_count;
         ++i) {

        const ufs_extent_disk_t *ex =
            &zn->extents[i];

        if (logical >= ex->logical_start &&
            logical <
                ex->logical_start +
                ex->logical_length) {

            *out = *ex;
            *inside =
                logical -
                ex->logical_start;

            return 0;
        }
    }

    uint64_t page_id =
        zn->extent_overflow_id;

    uint32_t guard = 0;

    while (page_id != 0 &&
           guard++ <
               UFS_MAX_ZONES *
               UFS_ZNODE_SLOTS) {

        extent_page_disk_t page;

        if (read_extent_page(
                page_id,
                &page) < 0) {
            return -1;
        }

        for (uint16_t i = 0;
             i < page.count;
             ++i) {

            const ufs_extent_disk_t *ex =
                &page.extents[i];

            if (logical >= ex->logical_start &&
                logical <
                    ex->logical_start +
                    ex->logical_length) {

                *out = *ex;
                *inside =
                    logical -
                    ex->logical_start;

                return 0;
            }
        }

        page_id = page.next_id;
    }

    return -1;
}

static int mapping_add(znode_disk_t *zn,
                       uint64_t logical_start,
                       uint64_t logical_length,
                       uint16_t zone,
                       uint16_t granularity,
                       uint32_t unit,
                       uint32_t units) {
    if (zn->extent_count < UFS_EXTENTS) {
        size_t i =
            zn->extent_count;

        zn->extents[i].logical_start =
            logical_start;
        zn->extents[i].logical_length =
            logical_length;
        zn->extents[i].zone_id =
            zone;
        zn->extents[i].granularity =
            granularity;
        zn->extents[i].physical_unit =
            unit;
        zn->extents[i].physical_units =
            units;

        ++zn->extent_count;
        return 0;
    }

    if (zn->extent_overflow_id == 0) {
        uint64_t new_id;

        if (allocate_extent_page(
                (int)zone,
                &new_id) < 0) {
            return -1;
        }

        extent_page_disk_t page;
        memset(&page, 0, sizeof(page));

        page.magic = UFS_EXTENT_PAGE_MAGIC;
        page.version = UFS_VERSION;
        page.count = 1;

        page.extents[0].logical_start =
            logical_start;
        page.extents[0].logical_length =
            logical_length;
        page.extents[0].zone_id =
            zone;
        page.extents[0].granularity =
            granularity;
        page.extents[0].physical_unit =
            unit;
        page.extents[0].physical_units =
            units;

        if (write_extent_page(new_id, &page) < 0) {
            free_extent_page(new_id);
            return -1;
        }

        zn->extent_overflow_id =
            new_id;
        return 0;
    }

    uint64_t page_id =
        zn->extent_overflow_id;

    uint32_t guard = 0;

    while (page_id != 0 &&
           guard++ <
               UFS_MAX_ZONES *
               UFS_ZNODE_SLOTS) {

        extent_page_disk_t page;

        if (read_extent_page(page_id, &page) < 0)
            return -1;

        if (page.count <
            UFS_EXTENTS_PER_PAGE) {

            uint16_t i =
                page.count;

            page.extents[i].logical_start =
                logical_start;
            page.extents[i].logical_length =
                logical_length;
            page.extents[i].zone_id =
                zone;
            page.extents[i].granularity =
                granularity;
            page.extents[i].physical_unit =
                unit;
            page.extents[i].physical_units =
                units;

            ++page.count;

            return write_extent_page(
                page_id,
                &page);
        }

        if (page.next_id != 0) {
            page_id =
                page.next_id;
            continue;
        }

        uint64_t new_id;

        if (allocate_extent_page(
                (int)zone,
                &new_id) < 0) {
            return -1;
        }

        extent_page_disk_t new_page;
        memset(&new_page, 0, sizeof(new_page));

        new_page.magic =
            UFS_EXTENT_PAGE_MAGIC;
        new_page.version =
            UFS_VERSION;
        new_page.count = 1;

        new_page.extents[0].logical_start =
            logical_start;
        new_page.extents[0].logical_length =
            logical_length;
        new_page.extents[0].zone_id =
            zone;
        new_page.extents[0].granularity =
            granularity;
        new_page.extents[0].physical_unit =
            unit;
        new_page.extents[0].physical_units =
            units;

        if (write_extent_page(
                new_id,
                &new_page) < 0) {
            free_extent_page(new_id);
            return -1;
        }

        page.next_id =
            new_id;

        if (write_extent_page(
                page_id,
                &page) < 0) {
            free_extent_page(new_id);
            return -1;
        }

        return 0;
    }

    errno = EIO;
    return -1;
}

static int object_znode_alloc(int preferred_zone, int type, uint64_t parent,
                              uint64_t *out_id) {
    uint32_t first = preferred_zone >= 0 ? (uint32_t)preferred_zone : 0;

    for (uint32_t pass = 0; pass < 2; ++pass) {
        for (uint32_t i = 0; i < g_fs.sb.zone_count; ++i) {
            uint32_t z = (pass == 0) ? (first + i) % g_fs.sb.zone_count : i;
            for (uint32_t local = 1; local < UFS_ZNODE_SLOTS; ++local) {
                znode_disk_t zn;
                if (read_znode(make_object_id(z, local), &zn) < 0) continue;
                if (zn.magic == UFS_ZNODE_MAGIC || zn.magic == UFS_EXTENT_PAGE_MAGIC) continue;

                memset(&zn, 0, sizeof(zn));
                zn.magic = UFS_ZNODE_MAGIC;
                zn.version = UFS_VERSION;
                zn.size_class = 1;
                zn.local_id = local;
                zn.type = (uint16_t)type;
                zn.size = 0;
                zn.parent_id = parent;
                zn.preferred_granularity = UFS_MEDIUM_GRAN;
                zn.generation = 1;

                *out_id = make_object_id(z, local);
                if (write_znode(*out_id, &zn) < 0) return -1;

                g_fs.sb.zones[z].znode_used++;
                return 0;
            }
        }
        break;
    }

    errno = ENOSPC;
    return -1;
}

static int object_znode_free(uint64_t id) {
    znode_disk_t zn;

    if (read_znode(id, &zn) < 0)
        return -1;

    for (uint32_t i = 0;
         i < zn.extent_count;
         ++i) {

        if (free_physical_region(
                zn.extents[i].zone_id,
                zn.extents[i].physical_unit,
                zn.extents[i].physical_units) < 0) {
            return -1;
        }
    }

    uint64_t page_id =
        zn.extent_overflow_id;

    uint32_t guard = 0;

    while (page_id != 0 &&
           guard++ <
               UFS_MAX_ZONES *
               UFS_ZNODE_SLOTS) {

        extent_page_disk_t page;

        if (read_extent_page(
                page_id,
                &page) < 0) {
            return -1;
        }

        uint64_t next_id =
            page.next_id;

        for (uint16_t i = 0;
             i < page.count;
             ++i) {

            if (free_physical_region(
                    page.extents[i].zone_id,
                    page.extents[i].physical_unit,
                    page.extents[i].physical_units) < 0) {
                return -1;
            }
        }

        if (free_extent_page(
                page_id) < 0) {
            return -1;
        }

        page_id = next_id;
    }

    memset(&zn, 0, sizeof(zn));

    if (write_znode(id, &zn) < 0)
        return -1;

    uint32_t zone =
        object_zone(id);

    if (g_fs.sb.zones[zone].znode_used > 0)
        --g_fs.sb.zones[zone].znode_used;

    return 0;
}

static int dir_read_entry(uint64_t dir_id,
                          uint32_t slot,
                          dir_disk_t *out) {
    znode_disk_t dir;

    if (read_znode(dir_id, &dir) < 0)
        return -1;

    uint64_t logical =
        (uint64_t)slot *
        sizeof(dir_disk_t);

    ufs_extent_disk_t ex;
    uint64_t inside;

    if (mapping_find(
            &dir,
            logical,
            &ex,
            &inside) < 0) {

        memset(out, 0, sizeof(*out));
        return 0;
    }

    uint64_t physical =
        (uint64_t)ex.physical_unit *
        UFS_UNIT +
        inside;

    return zone_read_bytes(
        ex.zone_id,
        (uint32_t)(physical / UFS_UNIT),
        (uint32_t)(physical % UFS_UNIT),
        out,
        sizeof(*out));
}

static int dir_write_entry(uint64_t dir_id,
                           uint32_t slot,
                           const dir_disk_t *in) {
    znode_disk_t dir;

    if (read_znode(dir_id, &dir) < 0)
        return -1;

    uint64_t logical =
        (uint64_t)slot *
        sizeof(dir_disk_t);

    ufs_extent_disk_t ex;
    uint64_t inside;

    if (mapping_find(
            &dir,
            logical,
            &ex,
            &inside) < 0) {

        errno = EINVAL;
        return -1;
    }

    uint64_t physical =
        (uint64_t)ex.physical_unit *
        UFS_UNIT +
        inside;

    return zone_write_bytes(
        ex.zone_id,
        (uint32_t)(physical / UFS_UNIT),
        (uint32_t)(physical % UFS_UNIT),
        in,
        sizeof(*in));
}

static int consume_last_extent_slack(znode_disk_t *zn,
                                     uint64_t needed_size) {
    if (zn->extent_count == 0)
        return 0;

    /*
     * Only the final inline extent can safely expose
     * previously allocated but logically unused capacity.
     *
     * Overflow extents are handled by the normal multi-extent
     * path for now.
     */
    if (zn->extent_count > UFS_EXTENTS)
        return 0;

    ufs_extent_disk_t *ex =
        &zn->extents[zn->extent_count - 1];

    /*
     * physical_units tells us how much physical space was
     * actually allocated to this extent.
     */
    uint64_t physical_capacity =
        (uint64_t)ex->physical_units * UFS_UNIT;

    /*
     * logical_length tells us how much of that allocation
     * is currently part of the logical file.
     */
    if (physical_capacity <= ex->logical_length)
        return 0;

    uint64_t slack =
        physical_capacity - ex->logical_length;

    uint64_t growth =
        needed_size - zn->size;

    if (growth == 0)
        return 1;

    /*
     * Consume only as much existing slack as the new growth
     * requires.
     */
    uint64_t consume =
        growth < slack ? growth : slack;

    ex->logical_length += consume;
    zn->size += consume;

    return zn->size >= needed_size;
}

static int try_extend_single_extent(znode_disk_t *zn,
                                    uint64_t needed_size) {
    if (zn->extent_count != 1)
        return 0;

    ufs_extent_disk_t *ex =
        &zn->extents[0];

    uint64_t current_end =
        ex->logical_start +
        ex->logical_length;

    if (current_end != zn->size)
        return 0;

    if (needed_size <= zn->size)
        return 1;

    uint64_t additional =
        needed_size -
        zn->size;

    uint32_t extra_units =
        (uint32_t)(
            (additional + UFS_UNIT - 1u) /
            UFS_UNIT);

    if (extra_units == 0)
        return 1;

    uint64_t extension_end64 =
        (uint64_t)ex->physical_unit +
        ex->physical_units +
        extra_units;

    if (extension_end64 > UINT32_MAX)
        return 0;

    uint32_t extension_start =
        ex->physical_unit +
        ex->physical_units;

    uint32_t extension_end =
        (uint32_t)extension_end64;

    zone_header_disk_t zh;

    if (read_zone_header(
            ex->zone_id,
            &zh) < 0) {
        return 0;
    }

    if (extension_end > zh.total_units)
        return 0;

    if (load_zone_bitmap(
            ex->zone_id) < 0) {
        return 0;
    }

    /*
     * The entire required extension must be immediately adjacent
     * and free. Otherwise fall back to creating new extents.
     */
    for (uint32_t u = extension_start;
         u < extension_end;
         ++u) {

        if (bit_get(
                g_fs.zone_bitmaps[ex->zone_id],
                u)) {
            return 0;
        }
    }

    for (uint32_t u = extension_start;
         u < extension_end;
         ++u) {

        bit_set(
            g_fs.zone_bitmaps[ex->zone_id],
            u);
    }

    ex->physical_units += extra_units;
    ex->logical_length =
        needed_size -
        ex->logical_start;

    return 1;
}

static int ensure_capacity(uint64_t object_id,
                           znode_disk_t *zn,
                           uint64_t needed_size) {
     /*
     * Growth policy:
     *
     * 1. Reuse already-allocated but logically unused capacity
     *    in the final extent.
     *
     * 2. If the file has one extent, try to extend that same
     *    extent into immediately adjacent free physical units.
     *
     * 3. Otherwise use the fragmentation-aware multi-extent
     *    allocator.
     */
    if (consume_last_extent_slack(
            zn,
            needed_size)) {
        return 0;
    }

    if (zn->extent_count == 1) {
        if (try_extend_single_extent(
                zn,
                needed_size)) {

            zn->size = needed_size;
            return 0;
        }
    }

    uint64_t logical =
        zn->size;

    while (logical < needed_size) {
        uint64_t remaining =
            needed_size -
            logical;

        uint16_t gran =
            choose_granularity(
                remaining);

        uint64_t request_bytes =
            UFS_ALIGN_UP(
                remaining,
                UFS_UNIT);

        uint16_t zone;
        uint32_t unit;
        uint32_t units;

        if (allocate_physical_region(
                object_zone(object_id),
                request_bytes,
                gran,
                &zone,
                &unit,
                &units) < 0) {
            return -1;
        }

        uint64_t allocated_bytes =
            (uint64_t)units *
            UFS_UNIT;

        uint64_t logical_len =
            allocated_bytes;

        if (logical + logical_len >
            needed_size) {
            logical_len =
                needed_size -
                logical;
        }

        if (mapping_add(
                zn,
                logical,
                logical_len,
                zone,
                gran,
                unit,
                units) < 0) {

            free_physical_region(
                zone,
                unit,
                units);

            return -1;
        }

        logical +=
            logical_len;
    }

    zn->size =
        needed_size;

    return 0;
}

static int free_tail_after(znode_disk_t *zn,
                           uint64_t new_size) {
    int truncated = 0;

    /*
     * Inline extents.
     */
    for (int i = (int)zn->extent_count - 1;
         i >= 0;
         --i) {

        ufs_extent_disk_t *ex =
            &zn->extents[i];

        uint64_t ex_end =
            ex->logical_start +
            ex->logical_length;

        if (ex->logical_start >= new_size) {
            if (free_physical_region(
                    ex->zone_id,
                    ex->physical_unit,
                    ex->physical_units) < 0) {
                return -1;
            }

            memset(ex, 0, sizeof(*ex));
            zn->extent_count--;
            truncated = 1;
            continue;
        }

        if (new_size < ex_end) {
            uint64_t keep =
                new_size -
                ex->logical_start;

            uint32_t keep_units =
                (uint32_t)(
                    (keep + UFS_UNIT - 1u) /
                    UFS_UNIT);

            if (keep_units < ex->physical_units) {
                uint32_t free_from =
                    ex->physical_unit +
                    keep_units;

                uint32_t free_count =
                    ex->physical_units -
                    keep_units;

                if (free_physical_region(
                        ex->zone_id,
                        free_from,
                        free_count) < 0) {
                    return -1;
                }

                ex->physical_units =
                    keep_units;

                ex->logical_length =
                    keep;
            }

            truncated = 1;
        }

        break;
    }

    /*
     * Overflow extents.
     */
    uint64_t page_id =
        zn->extent_overflow_id;

    uint32_t guard = 0;

    while (page_id != 0 &&
           guard++ <
               UFS_MAX_ZONES *
               UFS_ZNODE_SLOTS) {

        extent_page_disk_t page;

        if (read_extent_page(
                page_id,
                &page) < 0) {
            return -1;
        }

        uint64_t next_id =
            page.next_id;

        if (truncated) {
            for (uint16_t i = 0;
                 i < page.count;
                 ++i) {

                if (free_physical_region(
                        page.extents[i].zone_id,
                        page.extents[i].physical_unit,
                        page.extents[i].physical_units) < 0) {
                    return -1;
                }
            }

            page.count = 0;

            if (write_extent_page(
                    page_id,
                    &page) < 0) {
                return -1;
            }

            page_id = next_id;
            continue;
        }

        for (int i = (int)page.count - 1;
             i >= 0;
             --i) {

            ufs_extent_disk_t *ex =
                &page.extents[i];

            uint64_t ex_end =
                ex->logical_start +
                ex->logical_length;

            if (ex->logical_start >= new_size) {
                if (free_physical_region(
                        ex->zone_id,
                        ex->physical_unit,
                        ex->physical_units) < 0) {
                    return -1;
                }

                memset(
                    ex,
                    0,
                    sizeof(*ex));

                --page.count;
                truncated = 1;
                continue;
            }

            if (new_size < ex_end) {
                uint64_t keep =
                    new_size -
                    ex->logical_start;

                uint32_t keep_units =
                    (uint32_t)(
                        (keep + UFS_UNIT - 1u) /
                        UFS_UNIT);

                if (keep_units < ex->physical_units) {
                    uint32_t free_from =
                        ex->physical_unit +
                        keep_units;

                    uint32_t free_count =
                        ex->physical_units -
                        keep_units;

                    if (free_physical_region(
                            ex->zone_id,
                            free_from,
                            free_count) < 0) {
                        return -1;
                    }

                    ex->physical_units =
                        keep_units;

                    ex->logical_length =
                        keep;
                }

                truncated = 1;
            }

            break;
        }

        if (write_extent_page(
                page_id,
                &page) < 0) {
            return -1;
        }

        if (truncated) {
            uint64_t later =
                next_id;

            uint32_t later_guard = 0;

            while (later != 0 &&
                   later_guard++ <
                       UFS_MAX_ZONES *
                       UFS_ZNODE_SLOTS) {

                extent_page_disk_t later_page;

                if (read_extent_page(
                        later,
                        &later_page) < 0) {
                    return -1;
                }

                uint64_t later_next =
                    later_page.next_id;

                for (uint16_t i = 0;
                     i < later_page.count;
                     ++i) {

                    if (free_physical_region(
                            later_page.extents[i].zone_id,
                            later_page.extents[i].physical_unit,
                            later_page.extents[i].physical_units) < 0) {
                        return -1;
                    }
                }

                later_page.count = 0;

                if (write_extent_page(
                        later,
                        &later_page) < 0) {
                    return -1;
                }

                later = later_next;
            }

            break;
        }

        page_id = next_id;
    }

    zn->size = new_size;
    return 0;
}

static int ensure_dir_capacity(uint64_t dir_id, uint32_t extra_slots) {
    znode_disk_t dir;
    if (read_znode(dir_id, &dir) < 0) return -1;

    uint64_t required = (uint64_t)extra_slots * sizeof(dir_disk_t);
    if (dir.size >= required) return 0;

    if (ensure_capacity(dir_id, &dir, required) < 0) return -1;
    dir.size = required;
    if (write_znode(dir_id, &dir) < 0) return -1;

    return 0;
}

static int directory_find(uint64_t dir_id, const char *name,
                          uint32_t *slot_out, uint64_t *id_out) {
    uint64_t h = fnv1a64_str(name);

    for (int i = 0; i < (int)UFS_HOT_ENTRIES; ++i) {
        hot_entry_t *e = &g_fs.hot[i];
        if (!e->valid || e->dir_id != dir_id || e->name_hash != h) continue;
        if (strcmp(e->name, name) == 0) {
            e->last_used = ++g_fs.hot_clock;
            if (id_out) *id_out = e->object_id;
            if (slot_out) {
                znode_disk_t dir;
                if (read_znode(dir_id, &dir) < 0) return -1;
                uint32_t slots = (uint32_t)(dir.size / sizeof(dir_disk_t));
                for (uint32_t s = 0; s < slots; ++s) {
                    dir_disk_t de;
                    if (dir_read_entry(dir_id, s, &de) < 0) return -1;
                    if (de.active && de.object_id == e->object_id &&
                        strcmp(de.name, name) == 0) {
                        *slot_out = s;
                        break;
                    }
                }
            }
            return 0;
        }
    }

    znode_disk_t dir;
    if (read_znode(dir_id, &dir) < 0) return -1;
    uint32_t slots = (uint32_t)(dir.size / sizeof(dir_disk_t));

    for (uint32_t s = 0; s < slots; ++s) {
        dir_disk_t de;
        if (dir_read_entry(dir_id, s, &de) < 0) return -1;
        if (de.active && strncmp(de.name, name, UFS_MAX_NAME + 1) == 0) {
            if (slot_out) *slot_out = s;
            if (id_out) *id_out = de.object_id;

            int insert = -1;
            uint64_t least = UINT64_MAX;
            for (int i = 0; i < (int)UFS_HOT_ENTRIES; ++i) {
                if (!g_fs.hot[i].valid) {
                    insert = i;
                    break;
                }
                if (g_fs.hot[i].last_used < least) {
                    least = g_fs.hot[i].last_used;
                    insert = i;
                }
            }
            g_fs.hot[insert].valid = 1;
            g_fs.hot[insert].dir_id = dir_id;
            g_fs.hot[insert].name_hash = h;
            g_fs.hot[insert].object_id = de.object_id;
            g_fs.hot[insert].last_used = ++g_fs.hot_clock;
            strncpy(g_fs.hot[insert].name, de.name, UFS_MAX_NAME);
            g_fs.hot[insert].name[UFS_MAX_NAME] = '\0';
            return 0;
        }
    }

    errno = ENOENT;
    return -1;
}

static void hot_invalidate(uint64_t dir_id, uint64_t object_id) {
    for (size_t i = 0; i < UFS_HOT_ENTRIES; ++i) {
        if (g_fs.hot[i].valid &&
            g_fs.hot[i].dir_id == dir_id &&
            (object_id == 0 || g_fs.hot[i].object_id == object_id)) {
            g_fs.hot[i].valid = 0;
        }
    }
}

static int split_path(const char *path, char comps[][UFS_MAX_NAME + 1],
                      size_t *count) {
    if (!path || path[0] != '/') {
        errno = EINVAL;
        return -1;
    }
    *count = 0;
    if (strcmp(path, "/") == 0) return 0;

    char tmp[UFS_MAX_PATH + 1];
    strncpy(tmp, path, UFS_MAX_PATH);
    tmp[UFS_MAX_PATH] = '\0';

    char *save = NULL;
    char *p = strtok_r(tmp, "/", &save);
    while (p) {
        if (*count >= 64) {
            errno = ENAMETOOLONG;
            return -1;
        }
        if (strlen(p) > UFS_MAX_NAME) {
            errno = ENAMETOOLONG;
            return -1;
        }
        strcpy(comps[*count], p);
        (*count)++;
        p = strtok_r(NULL, "/", &save);
    }
    return 0;
}

static int resolve_path(const char *path, uint64_t *out_id,
                        uint64_t *parent_id, char *leaf) {
    char comps[64][UFS_MAX_NAME + 1];
    size_t n = 0;
    if (split_path(path, comps, &n) < 0) return -1;

    uint64_t cur = g_fs.sb.root_id;
    if (n == 0) {
        if (out_id) *out_id = cur;
        if (parent_id) *parent_id = 0;
        if (leaf) leaf[0] = '\0';
        return 0;
    }

    for (size_t i = 0; i < n; ++i) {
        uint64_t child;
        if (directory_find(cur, comps[i], NULL, &child) < 0) {
            if (i == n - 1 && parent_id) {
                *parent_id = cur;
                if (leaf) {
                    strncpy(leaf, comps[i], UFS_MAX_NAME);
                    leaf[UFS_MAX_NAME] = '\0';
                }
            }
            errno = ENOENT;
            return -1;
        }

        znode_disk_t zn;
        if (read_znode(child, &zn) < 0) return -1;
        if (i < n - 1 && zn.type != UFS_TYPE_DIR) {
            errno = ENOTDIR;
            return -1;
        }
        cur = child;
    }

    if (out_id) *out_id = cur;
    if (parent_id) {
        if (n == 1) *parent_id = g_fs.sb.root_id;
        else {
            uint64_t p = g_fs.sb.root_id;
            for (size_t i = 0; i + 1 < n; ++i) {
                uint64_t c;
                if (directory_find(p, comps[i], NULL, &c) < 0) return -1;
                p = c;
            }
            *parent_id = p;
        }
    }
    if (leaf) {
        strncpy(leaf, comps[n - 1], UFS_MAX_NAME);
        leaf[UFS_MAX_NAME] = '\0';
    }
    return 0;
}

static int find_free_dir_slot(uint64_t dir_id, uint32_t *slot_out) {
    znode_disk_t dir;
    if (read_znode(dir_id, &dir) < 0) return -1;
    uint32_t slots = (uint32_t)(dir.size / sizeof(dir_disk_t));

    for (uint32_t i = 0; i < slots; ++i) {
        dir_disk_t de;
        if (dir_read_entry(dir_id, i, &de) < 0) return -1;
        if (!de.active) {
            *slot_out = i;
            return 0;
        }
    }

    *slot_out = slots;
    if (ensure_dir_capacity(dir_id, slots + 1) < 0) return -1;
    return 0;
}

static int add_dir_entry(transaction_t *tx, uint64_t dir_id,
                         const char *name, uint64_t object_id, uint8_t type) {
    uint32_t slot;
    if (find_free_dir_slot(dir_id, &slot) < 0) return -1;

    dir_disk_t de;
    memset(&de, 0, sizeof(de));
    strncpy(de.name, name, UFS_MAX_NAME);
    de.name[UFS_MAX_NAME] = '\0';
    de.type = type;
    de.active = 1;
    de.object_id = object_id;
    de.generation = 1;

    if (journal_dir_slot(tx, dir_id, slot, &de) < 0) return -1;
    if (dir_write_entry(dir_id, slot, &de) < 0) return -1;

    hot_invalidate(dir_id, 0);
    return 0;
}

static int remove_dir_entry(transaction_t *tx, uint64_t dir_id,
                            const char *name) {
    uint32_t slot;
    uint64_t id;
    if (directory_find(dir_id, name, &slot, &id) < 0) return -1;

    dir_disk_t de;
    if (dir_read_entry(dir_id, slot, &de) < 0) return -1;
    de.active = 0;
    if (journal_dir_slot(tx, dir_id, slot, &de) < 0) return -1;
    if (dir_write_entry(dir_id, slot, &de) < 0) return -1;
    hot_invalidate(dir_id, id);
    return 0;
}

static int directory_is_empty(uint64_t dir_id) {
    znode_disk_t dir;
    if (read_znode(dir_id, &dir) < 0) return -1;
    uint32_t slots = (uint32_t)(dir.size / sizeof(dir_disk_t));
    for (uint32_t i = 0; i < slots; ++i) {
        dir_disk_t de;
        if (dir_read_entry(dir_id, i, &de) < 0) return -1;
        if (de.active) return 0;
    }
    return 1;
}

static int initialize_zone(uint32_t zone_id) {
    uint32_t total_units = g_fs.sb.zone_size / UFS_UNIT;

    uint32_t znode_bytes = UFS_ZNODE_SLOTS * sizeof(znode_disk_t);
    uint32_t znode_pages = (znode_bytes + UFS_BLOCK_SIZE - 1) / UFS_BLOCK_SIZE;
    uint32_t bitmap_offset_unit =
        (UFS_BLOCK_SIZE + znode_pages * UFS_BLOCK_SIZE) / UFS_UNIT;
    uint32_t bitmap_bytes = (total_units + 7u) / 8u;
    uint32_t bitmap_pages =
        (bitmap_bytes + UFS_BLOCK_SIZE - 1u) / UFS_BLOCK_SIZE;
    uint32_t bitmap_units =
        (bitmap_pages * UFS_BLOCK_SIZE) / UFS_UNIT;
    uint32_t data_first = bitmap_offset_unit + bitmap_units;

    if (data_first >= total_units) {
        errno = ENOSPC;
        return -1;
    }

    zone_header_disk_t zh;
    memset(&zh, 0, sizeof(zh));
    zh.magic = UFS_ZONE_MAGIC;
    zh.version = UFS_VERSION;
    zh.zone_id = zone_id;
    zh.total_units = total_units;
    zh.data_first_unit = data_first;
    zh.bitmap_bytes = bitmap_bytes;
    zh.znode_slots = UFS_ZNODE_SLOTS;

    uint8_t blank[UFS_BLOCK_SIZE] = {0};
    if (disk_write_page(zone_start_page(zone_id), &zh) < 0) return -1;

    for (uint32_t p = 0; p < znode_pages; ++p)
        if (disk_write_page(zone_start_page(zone_id) + 1 + p, blank) < 0)
            return -1;

    for (uint32_t p = 0; p < bitmap_pages; ++p)
        if (disk_write_page(zone_start_page(zone_id) + 1 + znode_pages + p, blank) < 0)
            return -1;

    if (load_zone_bitmap(zone_id) < 0) return -1;

    for (uint32_t u = 0; u < data_first; ++u)
        bit_set(g_fs.zone_bitmaps[zone_id], u);

    for (uint32_t i = 0; i < UFS_ZNODE_SLOTS; ++i) {
        g_fs.znode_loaded[zone_id][i] = 0;
    }

    if (flush_zone_bitmap(zone_id) < 0) return -1;
    return update_zone_summary(zone_id);
}

static void cleanup_state(void) {
    for (uint32_t i = 0; i < UFS_MAX_ZONES; ++i) {
        free(g_fs.zone_bitmaps[i]);
        g_fs.zone_bitmaps[i] = NULL;
    }
    memset(g_fs.znode_loaded, 0, sizeof(g_fs.znode_loaded));
    memset(g_fs.fds, 0, sizeof(g_fs.fds));
    memset(g_fs.hot, 0, sizeof(g_fs.hot));
    g_fs.hot_clock = 0;
}


static int clear_journal(void) {
    uint8_t zero[UFS_BLOCK_SIZE] = {0};
    for (uint32_t i = 0; i < g_fs.sb.journal_pages; ++i) {
        if (disk_write_page(g_fs.sb.journal_start_page + i, zero) < 0) {
            errno = EIO;
            return -1;
        }
    }
    g_fs.sb.journal_head = 0;
    return 0;
}

int ufs_format(const char *image_path, size_t image_size) {
    if (!image_path || image_size < UFS_MIN_IMAGE ||
        image_size % UFS_BLOCK_SIZE != 0) {
        errno = EINVAL;
        return -1;
    }

    if (g_fs.fd >= 0) {
        errno = EBUSY;
        return -1;
    }

    int fd = open(image_path, O_RDWR | O_CREAT | O_TRUNC, 0666);
    if (fd < 0) return -1;

    if (ftruncate(fd, (off_t)image_size) < 0) {
        int e = errno;
        close(fd);
        errno = e;
        return -1;
    }

    g_fs.fd = fd;
    cleanup_state();

    uint32_t total_pages = (uint32_t)(image_size / UFS_BLOCK_SIZE);
    uint32_t global_pages = 1;
    uint32_t journal_pages = UFS_JOURNAL_RECORDS;
    uint32_t zones_start = global_pages + journal_pages;
    uint32_t usable_pages = total_pages - zones_start;
    uint32_t zones = UFS_MIN_ZONES;
    while (zones < UFS_MAX_ZONES &&
           usable_pages / (zones + 1u) >= (256u * 1024u / UFS_BLOCK_SIZE)) {
        ++zones;
    }

    uint32_t pages_per_zone = usable_pages / zones;
    if (pages_per_zone < 64u) {
        close(fd);
        g_fs.fd = -1;
        cleanup_state();
        errno = ENOSPC;
        return -1;
    }
    uint32_t zone_size = pages_per_zone * UFS_BLOCK_SIZE;

    memset(&g_fs.sb, 0, sizeof(g_fs.sb));
    g_fs.sb.magic = UFS_MAGIC;
    g_fs.sb.version = UFS_VERSION;
    g_fs.sb.image_size = (uint32_t)image_size;
    g_fs.sb.total_pages = total_pages;
    g_fs.sb.zone_count = zones;
    g_fs.sb.zone_size = zone_size;
    g_fs.sb.zone_header_pages = 1;
    g_fs.sb.znode_table_pages =
        (UFS_ZNODE_SLOTS * sizeof(znode_disk_t) + UFS_BLOCK_SIZE - 1) /
        UFS_BLOCK_SIZE;
    g_fs.sb.bitmap_pages = 0;
    g_fs.sb.journal_start_page = global_pages;
    g_fs.sb.journal_pages = journal_pages;
    g_fs.sb.zones_start_page = zones_start;
    g_fs.sb.next_txid = 0;
    g_fs.sb.journal_head = 0;
    g_fs.sb.clean = 1;

    memset(g_fs.znode_loaded, 0, sizeof(g_fs.znode_loaded));

    uint8_t zero[UFS_BLOCK_SIZE] = {0};
    for (uint32_t p = 0; p < journal_pages; ++p)
        if (disk_write_page(g_fs.sb.journal_start_page + p, zero) < 0) goto fail;

    for (uint32_t z = 0; z < zones; ++z) {
        if (initialize_zone(z) < 0) goto fail;
    }

    uint64_t root_id;
    if (object_znode_alloc(0, UFS_TYPE_DIR, 0, &root_id) < 0) goto fail;
    g_fs.sb.root_id = root_id;

    znode_disk_t root;
    if (read_znode(root_id, &root) < 0) goto fail;

    if (ensure_capacity(root_id, &root, sizeof(dir_disk_t) * 2u) < 0) goto fail;
    root.size = sizeof(dir_disk_t) * 2u;

    if (write_znode(root_id, &root) < 0) goto fail;

    dir_disk_t dot = {0};
    dot.active = 1;
    dot.type = UFS_TYPE_DIR;
    strcpy(dot.name, ".");
    dot.object_id = root_id;

    dir_disk_t dotdot = {0};
    dotdot.active = 1;
    dotdot.type = UFS_TYPE_DIR;
    strcpy(dotdot.name, "..");
    dotdot.object_id = root_id;

    if (dir_write_entry(root_id, 0, &dot) < 0) goto fail;
    if (dir_write_entry(root_id, 1, &dotdot) < 0) goto fail;

    for (uint32_t z = 0; z < zones; ++z) {
        if (flush_zone_bitmap(z) < 0) goto fail;
        if (update_zone_summary(z) < 0) goto fail;
    }

    if (flush_superblock() < 0) goto fail;
    if (close(g_fs.fd) < 0) {
        g_fs.fd = -1;
        cleanup_state();
        return -1;
    }
    g_fs.fd = -1;
    cleanup_state();
    return 0;

fail:
    {
        int e = errno ? errno : EIO;
        if (g_fs.fd >= 0) close(g_fs.fd);
        g_fs.fd = -1;
        cleanup_state();
        errno = e;
        return -1;
    }
}

int ufs_mount(const char *image_path) {
    if (!image_path) {
        errno = EINVAL;
        return -1;
    }
    if (g_fs.fd >= 0) {
        errno = EBUSY;
        return -1;
    }

    int fd = open(image_path, O_RDWR);
    if (fd < 0) return -1;
    g_fs.fd = fd;
    cleanup_state();

    if (disk_read_page(0, &g_fs.sb) < 0) goto bad;
    if (g_fs.sb.magic != UFS_MAGIC || g_fs.sb.version != UFS_VERSION ||
        g_fs.sb.zone_count == 0 || g_fs.sb.zone_count > UFS_MAX_ZONES ||
        g_fs.sb.zone_size == 0) {
        errno = EINVAL;
        goto bad;
    }

    if (checksum_superblock(&g_fs.sb) != g_fs.sb.checksum) {
        errno = EIO;
        goto bad;
    }

    for (uint32_t z = 0; z < g_fs.sb.zone_count; ++z) {
        zone_header_disk_t zh;
        if (read_zone_header(z, &zh) < 0 ||
            zh.magic != UFS_ZONE_MAGIC ||
            zh.zone_id != z) {
            errno = EIO;
            goto bad;
        }
        if (load_zone_bitmap(z) < 0) goto bad;
        if (update_zone_summary(z) < 0) goto bad;
    }

    if (!g_fs.sb.clean) {
        if (replay_journal() < 0) goto bad;
    }

    /* A mounted filesystem is considered unclean until a successful unmount. */
    g_fs.sb.clean = 0;
    if (flush_superblock() < 0) goto bad;

    memset(g_fs.fds, 0, sizeof(g_fs.fds));
    return 0;

bad:
    {
        int e = errno ? errno : EIO;
        close(g_fs.fd);
        g_fs.fd = -1;
        cleanup_state();
        errno = e;
        return -1;
    }
}

int ufs_unmount(void) {
    if (!fs_mounted()) return -1;

    for (uint32_t z = 0; z < g_fs.sb.zone_count; ++z) {
        if (g_fs.zone_bitmaps[z] && flush_zone_bitmap(z) < 0) return -1;
        if (update_zone_summary(z) < 0) return -1;
    }

    /*
     * All persistent metadata/data changes have been flushed. Mark the
     * filesystem clean before clearing the journal, so a crash cannot make
     * us discard the only recovery indicator.
     */
    g_fs.sb.clean = 1;
    if (flush_superblock() < 0) return -1;
    if (clear_journal() < 0) return -1;
    if (flush_superblock() < 0) return -1;

    int rc = close(g_fs.fd);
    int e = errno;
    g_fs.fd = -1;
    cleanup_state();
    errno = e;
    return rc == 0 ? 0 : -1;
}

int ufs_create(const char *path) {
    if (!fs_mounted()) return -1;

    uint64_t existing;
    uint64_t parent;
    char name[UFS_MAX_NAME + 1];

    if (resolve_path(path, &existing, &parent, name) == 0) {
        errno = EEXIST;
        return -1;
    }
    if (errno != ENOENT) return -1;

    if (directory_find(parent, name, NULL, NULL) == 0) {
        errno = EEXIST;
        return -1;
    }

    uint64_t id;
    if (object_znode_alloc((int)object_zone(parent), UFS_TYPE_FILE,
                           parent, &id) < 0)
        return -1;

    transaction_t tx = {0};
    if (journal_begin(&tx) < 0) return -1;

    znode_disk_t zn;
    if (read_znode(id, &zn) < 0) return -1;
    if (journal_znode(&tx, id, &zn) < 0) return -1;

    if (add_dir_entry(&tx, parent, name, id, UFS_TYPE_FILE) < 0) {
        tx.active = 0;
        return -1;
    }

    if (journal_commit(&tx) < 0) return -1;

    if (write_znode(id, &zn) < 0) return -1;
    if (flush_superblock() < 0) return -1;
    return 0;
}

int ufs_mkdir(const char *path) {
    if (!fs_mounted()) return -1;

    uint64_t tmp, parent;
    char name[UFS_MAX_NAME + 1];
    if (resolve_path(path, &tmp, &parent, name) == 0) {
        errno = EEXIST;
        return -1;
    }
    if (errno != ENOENT) return -1;

    uint64_t id;
    if (object_znode_alloc((int)object_zone(parent), UFS_TYPE_DIR,
                           parent, &id) < 0)
        return -1;

    znode_disk_t zn;
    if (read_znode(id, &zn) < 0) return -1;

    if (ensure_capacity(id, &zn, sizeof(dir_disk_t) * 2u) < 0) return -1;
    zn.size = sizeof(dir_disk_t) * 2u;

    if (write_znode(id, &zn) < 0) return -1;

    dir_disk_t dot = {0};
    dot.active = 1;
    dot.type = UFS_TYPE_DIR;
    strcpy(dot.name, ".");
    dot.object_id = id;

    dir_disk_t dotdot = {0};
    dotdot.active = 1;
    dotdot.type = UFS_TYPE_DIR;
    strcpy(dotdot.name, "..");
    dotdot.object_id = parent;

    if (dir_write_entry(id, 0, &dot) < 0) return -1;
    if (dir_write_entry(id, 1, &dotdot) < 0) return -1;

    transaction_t tx = {0};
    if (journal_begin(&tx) < 0) return -1;
    if (journal_znode(&tx, id, &zn) < 0) return -1;
    if (add_dir_entry(&tx, parent, name, id, UFS_TYPE_DIR) < 0) return -1;
    if (journal_commit(&tx) < 0) return -1;

    if (flush_superblock() < 0) return -1;
    return 0;
}

int ufs_open(const char *path, int flags) {
    if (!fs_mounted()) return -1;

    uint64_t id;
    if (resolve_path(path, &id, NULL, NULL) < 0) {
        errno = ENOENT;
        return -1;
    }

    znode_disk_t zn;
    if (read_znode(id, &zn) < 0) return -1;
    if (zn.type == UFS_TYPE_DIR) {
        errno = EISDIR;
        return -1;
    }

    for (int i = 0; i < (int)UFS_MAX_OPEN_FILES; ++i) {
        if (!g_fs.fds[i].used) {
            g_fs.fds[i].used = 1;
            g_fs.fds[i].znode_id = id;
            g_fs.fds[i].flags = flags;
            g_fs.fds[i].offset = (flags & UFS_O_APPEND) ? (off_t)zn.size : 0;
            return i;
        }
    }
    errno = EMFILE;
    return -1;
}

int ufs_close(int fd) {
    if (!fs_mounted()) return -1;
    if (fd < 0 || fd >= (int)UFS_MAX_OPEN_FILES || !g_fs.fds[fd].used) {
        errno = EBADF;
        return -1;
    }
    g_fs.fds[fd].used = 0;
    return 0;
}

ssize_t ufs_write(int fd, const void *buf, size_t count) {
    if (!fs_mounted()) return -1;
    if (fd < 0 || fd >= (int)UFS_MAX_OPEN_FILES || !g_fs.fds[fd].used) {
        errno = EBADF;
        return -1;
    }
    if (!buf && count != 0) {
        errno = EINVAL;
        return -1;
    }
    int mode = g_fs.fds[fd].flags & 3;
    if (mode == UFS_O_RDONLY) {
        errno = EBADF;
        return -1;
    }
    if (count == 0) return 0;

    uint64_t id = g_fs.fds[fd].znode_id;
    znode_disk_t zn;
    if (read_znode(id, &zn) < 0) return -1;

    uint64_t old_size = zn.size;
    uint64_t end = (uint64_t)g_fs.fds[fd].offset + count;
    if (end < (uint64_t)g_fs.fds[fd].offset) {
        errno = EOVERFLOW;
        return -1;
    }

    if (end > zn.size) {
        if (ensure_capacity(id, &zn, end) < 0) return -1;
    }

    transaction_t tx = {0};
    if (end != old_size) {
        if (journal_begin(&tx) < 0) return -1;
    }

    size_t done = 0;
    while (done < count) {
        uint64_t logical = (uint64_t)g_fs.fds[fd].offset;
        ufs_extent_disk_t ex;
        uint64_t inside;

        if (mapping_find(
                &zn,
                logical,
                &ex,
                &inside) < 0) {

            if (tx.active)
                tx.active = 0;

            errno = EIO;
            return -1;
        }

        size_t available =
            (size_t)(ex.logical_length - inside);

        size_t chunk =
            (count - done < available)
                ? (count - done)
                : available;

        uint64_t physical =
            (uint64_t)ex.physical_unit *
            UFS_UNIT +
            inside;

        if (zone_write_bytes(
                ex.zone_id,
                (uint32_t)(physical / UFS_UNIT),
                (uint32_t)(physical % UFS_UNIT),
                (const unsigned char *)buf + done,
                chunk) < 0) {

            if (tx.active)
                tx.active = 0;

            errno = EIO;
            return -1;
        }

        g_fs.fds[fd].offset += (off_t)chunk;
        done += chunk;
    }

    if (end > old_size) {
        zn.size = end;
        if (journal_znode(&tx, id, &zn) < 0) return -1;
    }

    if (tx.active) {
        if (journal_commit(&tx) < 0) return -1;
    }

    if (write_znode(id, &zn) < 0) return -1;

    for (uint32_t z = 0; z < g_fs.sb.zone_count; ++z)
        if (g_fs.zone_bitmaps[z] && flush_zone_bitmap(z) < 0) return -1;

    if (end != old_size && flush_superblock() < 0) return -1;
    return (ssize_t)done;
}

ssize_t ufs_read(int fd, void *buf, size_t count) {
    if (!fs_mounted()) return -1;
    if (fd < 0 || fd >= (int)UFS_MAX_OPEN_FILES || !g_fs.fds[fd].used) {
        errno = EBADF;
        return -1;
    }
    if (!buf && count != 0) {
        errno = EINVAL;
        return -1;
    }

    znode_disk_t zn;
    if (read_znode(g_fs.fds[fd].znode_id, &zn) < 0) return -1;

    if ((uint64_t)g_fs.fds[fd].offset >= zn.size) return 0;

    size_t want = count;
    if ((uint64_t)g_fs.fds[fd].offset + want > zn.size)
        want = (size_t)(zn.size - (uint64_t)g_fs.fds[fd].offset);

    size_t done = 0;
    while (done < want) {
        uint64_t logical = (uint64_t)g_fs.fds[fd].offset;
        ufs_extent_disk_t ex;
        uint64_t inside;

        if (mapping_find(
                &zn,
                logical,
                &ex,
                &inside) < 0) {

            errno = EIO;
            return -1;
        }

        size_t available =
            (size_t)(ex.logical_length - inside);

        size_t chunk =
            (want - done < available)
                ? (want - done)
                : available;

        uint64_t physical =
            (uint64_t)ex.physical_unit *
            UFS_UNIT +
            inside;

        if (zone_read_bytes(
                ex.zone_id,
                (uint32_t)(physical / UFS_UNIT),
                (uint32_t)(physical % UFS_UNIT),
                (unsigned char *)buf + done,
                chunk) < 0) {

            errno = EIO;
            return -1;
        }

        g_fs.fds[fd].offset += (off_t)chunk;
        done += chunk;
    }

    return (ssize_t)done;
}

off_t ufs_seek(int fd, off_t offset, int whence) {
    if (!fs_mounted()) return (off_t)-1;
    if (fd < 0 || fd >= (int)UFS_MAX_OPEN_FILES || !g_fs.fds[fd].used) {
        errno = EBADF;
        return (off_t)-1;
    }

    znode_disk_t zn;
    if (read_znode(g_fs.fds[fd].znode_id, &zn) < 0) return (off_t)-1;

    off_t base;
    switch (whence) {
        case SEEK_SET: base = 0; break;
        case SEEK_CUR: base = g_fs.fds[fd].offset; break;
        case SEEK_END: base = (off_t)zn.size; break;
        default:
            errno = EINVAL;
            return (off_t)-1;
    }

    if ((offset > 0 && base > (off_t)(LLONG_MAX - offset)) ||
        (offset < 0 && base < (off_t)(LLONG_MIN - offset))) {
        errno = EOVERFLOW;
        return (off_t)-1;
    }

    off_t new_off = base + offset;
    if (new_off < 0) {
        errno = EINVAL;
        return (off_t)-1;
    }
    g_fs.fds[fd].offset = new_off;
    return new_off;
}

int ufs_truncate(const char *path, size_t size) {
    if (!fs_mounted()) return -1;

    uint64_t id;
    if (resolve_path(path, &id, NULL, NULL) < 0) return -1;

    znode_disk_t zn;
    if (read_znode(id, &zn) < 0) return -1;
    if (zn.type != UFS_TYPE_FILE) {
        errno = EISDIR;
        return -1;
    }

    if (size > zn.size) {
        if (ensure_capacity(id, &zn, size) < 0) return -1;
        zn.size = size;
    } else if (size < zn.size) {
        if (free_tail_after(&zn, size) < 0) return -1;
    }

    transaction_t tx = {0};
    if (journal_begin(&tx) < 0) return -1;
    if (journal_znode(&tx, id, &zn) < 0) return -1;
    if (journal_commit(&tx) < 0) return -1;

    if (write_znode(id, &zn) < 0) return -1;
    for (uint32_t z = 0; z < g_fs.sb.zone_count; ++z)
        if (g_fs.zone_bitmaps[z] && flush_zone_bitmap(z) < 0) return -1;
    return flush_superblock();
}

int ufs_unlink(const char *path) {
    if (!fs_mounted()) return -1;

    uint64_t id, parent;
    char name[UFS_MAX_NAME + 1];
    if (resolve_path(path, &id, &parent, name) < 0) return -1;

    znode_disk_t zn;
    if (read_znode(id, &zn) < 0) return -1;
    if (zn.type == UFS_TYPE_DIR) {
        errno = EISDIR;
        return -1;
    }

    transaction_t tx = {0};
    if (journal_begin(&tx) < 0) return -1;
    if (remove_dir_entry(&tx, parent, name) < 0) return -1;

    if (object_znode_free(id) < 0) return -1;
    if (journal_commit(&tx) < 0) return -1;

    for (uint32_t z = 0; z < g_fs.sb.zone_count; ++z)
        if (g_fs.zone_bitmaps[z] && flush_zone_bitmap(z) < 0) return -1;
    return flush_superblock();
}

int ufs_rmdir(const char *path) {
    if (!fs_mounted()) return -1;
    if (strcmp(path, "/") == 0) {
        errno = EBUSY;
        return -1;
    }

    uint64_t id, parent;
    char name[UFS_MAX_NAME + 1];
    if (resolve_path(path, &id, &parent, name) < 0) return -1;

    znode_disk_t zn;
    if (read_znode(id, &zn) < 0) return -1;
    if (zn.type != UFS_TYPE_DIR) {
        errno = ENOTDIR;
        return -1;
    }

    int empty = directory_is_empty(id);
    if (empty < 0) return -1;
    if (!empty) {
        /* Ignore "." and ".." when checking emptiness. */
        uint32_t slots = (uint32_t)(zn.size / sizeof(dir_disk_t));
        int real_entries = 0;
        for (uint32_t s = 0; s < slots; ++s) {
            dir_disk_t de;
            if (dir_read_entry(id, s, &de) < 0) return -1;
            if (de.active && strcmp(de.name, ".") != 0 &&
                strcmp(de.name, "..") != 0) {
                real_entries++;
                break;
            }
        }
        if (real_entries) {
            errno = ENOTEMPTY;
            return -1;
        }
    }

    transaction_t tx = {0};
    if (journal_begin(&tx) < 0) return -1;
    if (remove_dir_entry(&tx, parent, name) < 0) return -1;
    if (object_znode_free(id) < 0) return -1;
    if (journal_commit(&tx) < 0) return -1;

    for (uint32_t z = 0; z < g_fs.sb.zone_count; ++z)
        if (g_fs.zone_bitmaps[z] && flush_zone_bitmap(z) < 0) return -1;
    return flush_superblock();
}

int ufs_listdir(const char *path, struct ufs_dirent *entries, size_t max_entries) {
    if (!fs_mounted()) return -1;
    if (!entries && max_entries != 0) {
        errno = EINVAL;
        return -1;
    }

    uint64_t id;
    if (resolve_path(path, &id, NULL, NULL) < 0) return -1;

    znode_disk_t dir;
    if (read_znode(id, &dir) < 0) return -1;
    if (dir.type != UFS_TYPE_DIR) {
        errno = ENOTDIR;
        return -1;
    }

    uint32_t slots = (uint32_t)(dir.size / sizeof(dir_disk_t));
    size_t out = 0;

    for (uint32_t s = 0; s < slots && out < max_entries; ++s) {
        dir_disk_t de;
        if (dir_read_entry(id, s, &de) < 0) return -1;
        if (!de.active) continue;

        strncpy(entries[out].name, de.name, UFS_MAX_NAME);
        entries[out].name[UFS_MAX_NAME] = '\0';
        entries[out].object_id = de.object_id;
        entries[out].type = de.type;
        ++out;
    }

    return (int)out;
}

int ufs_stat(const char *path, struct ufs_stat *st) {
    if (!fs_mounted()) return -1;
    if (!st) {
        errno = EINVAL;
        return -1;
    }

    uint64_t id;
    if (resolve_path(path, &id, NULL, NULL) < 0) return -1;

    znode_disk_t zn;
    if (read_znode(id, &zn) < 0) return -1;

    st->type = zn.type;
    st->size = (size_t)zn.size;
    return 0;
}
