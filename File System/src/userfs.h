
#ifndef USERFS_H
#define USERFS_H

#include <stddef.h>
#include <stdint.h>
#include <sys/types.h>

#ifdef __cplusplus
extern "C" {
#endif

#define UFS_BLOCK_SIZE 4096u
#define UFS_MAX_NAME 47u
#define UFS_MAX_PATH 1023u
#define UFS_MAX_OPEN_FILES 64u

#define UFS_TYPE_FILE 1
#define UFS_TYPE_DIR  2

#define UFS_O_RDONLY 0x0000
#define UFS_O_WRONLY 0x0001
#define UFS_O_RDWR   0x0002
#define UFS_O_APPEND 0x0008

struct ufs_stat {
    int type;
    size_t size;
    size_t physical_size;
    size_t extent_count;
    uint32_t zone_id;
    uint32_t real_zones[32];
    uint32_t real_zone_count;
    uint32_t count_512b_blocks;
    uint32_t count_4kb_blocks;
    uint32_t count_16kb_blocks;
    uint32_t logical_block_count;
    uint64_t object_id;
    uint32_t link_count;
    uint64_t mtime;
    uint64_t atime;
    uint64_t ctime;
};

struct ufs_dirent {
    char name[UFS_MAX_NAME + 1];
    uint64_t object_id;
    int type;
};

struct ufs_statfs {
    uint32_t magic;
    uint32_t version;
    uint32_t image_size;
    uint32_t total_pages;
    uint32_t zone_count;
    uint32_t zone_size;
    uint64_t root_id;
    uint32_t clean;
};

int ufs_format(const char *image_path, size_t image_size);
int ufs_mount(const char *image_path);
int ufs_unmount(void);
int ufs_link(const char *oldpath, const char *newpath);

int ufs_create(const char *path);
int ufs_open(const char *path, int flags);
int ufs_close(int fd);
ssize_t ufs_read(int fd, void *buf, size_t count);
ssize_t ufs_write(int fd, const void *buf, size_t count);
off_t ufs_seek(int fd, off_t offset, int whence);
int ufs_truncate(const char *path, size_t size);
int ufs_unlink(const char *path);

int ufs_mkdir(const char *path);
int ufs_rmdir(const char *path);
int ufs_listdir(const char *path,
                struct ufs_dirent *entries,
                size_t max_entries);

int ufs_stat(const char *path, struct ufs_stat *st);
int ufs_statfs(struct ufs_statfs *st);

struct ufs_extent_info {
    uint16_t zone_id;
    uint16_t granularity;
    uint32_t physical_unit;
    uint32_t physical_units;
    uint64_t logical_start;
    uint64_t logical_length;
};

int ufs_inspect(const char *path, int *is_inline, uint16_t *extent_count,
                struct ufs_extent_info *extents, size_t max_extents);

int ufs_setxattr(const char *path, const char *name, const void *value, size_t size);
int ufs_getxattr(const char *path, const char *name, void *value, size_t size);
int ufs_listxattr(const char *path, char *list, size_t size);
int ufs_removexattr(const char *path, const char *name);

#define UFS_FLAG_COMPRESSED_LZ4 0x8000u

int ufs_compress_file(const char *path);

/* Debugging & Low-Level Inspection Data Structures */
struct ufs_zone_debug {
    uint32_t zone_id;
    uint32_t total_units;
    uint32_t free_units;
    uint32_t largest_free_run;
    uint32_t znode_used;
    uint32_t next_fit_cursor;
    size_t   bitmap_bytes;
    uint8_t  bitmap_preview[64]; /* 64 bytes = 512 allocation units */
};

struct ufs_znode_slot_debug {
    uint32_t slot;
    uint32_t magic;
    uint8_t  type;
    uint16_t flags;
    uint64_t size;
    uint32_t link_count;
    uint16_t extent_count;
    uint64_t object_id;
};

struct ufs_dirent_raw {
    char name[UFS_MAX_NAME + 1];
    uint8_t type;
    uint8_t active;
    uint64_t object_id;
    uint32_t generation;
};

struct ufs_journal_debug {
    uint32_t journal_start_page;
    uint32_t journal_pages;
    uint32_t journal_head;
    uint64_t next_txid;
};

struct ufs_cache_debug {
    char name[UFS_MAX_NAME + 1];
    uint64_t dir_id;
    uint64_t object_id;
    uint64_t last_used;
};

int ufs_debug_get_zone(uint32_t zone_id, struct ufs_zone_debug *zd, struct ufs_znode_slot_debug *slots, size_t max_slots, int *out_slot_count);
int ufs_debug_get_dirents(const char *path, struct ufs_dirent_raw *entries, size_t max_entries, int *out_count);
int ufs_debug_get_journal(struct ufs_journal_debug *jd);
int ufs_debug_get_cache(struct ufs_cache_debug *entries, size_t max_entries, int *out_count);
int ufs_debug_get_overflow_extents(const char *path, struct ufs_extent_info *exts, size_t max_exts, int *out_count);
int ufs_debug_read_raw_page(uint32_t page_num, void *buf);

/* Enhanced Low-Level Debug Structures */
struct ufs_superblock_debug {
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
    uint32_t stored_checksum;
    uint32_t calculated_checksum;
    int      checksum_valid;
};

struct ufs_znode_raw_debug {
    uint32_t magic;
    uint8_t  version;
    uint8_t  type;
    uint16_t flags;
    uint16_t local_id;
    uint16_t link_count;
    uint16_t preferred_granularity;
    uint16_t extent_count;
    uint32_t generation;
    uint64_t size;
    uint64_t parent_id;
    uint64_t extent_overflow_id;
    uint64_t xattr_page_id;
    uint32_t mtime;
    uint32_t atime;
    uint32_t ctime;
    uint8_t  raw_bytes[512];
};

struct ufs_xattr_raw_debug {
    char     name[32];
    char     value[128];
    uint16_t value_len;
    uint8_t  active;
};

struct ufs_fsck_stat {
    int      errors;
    int      warnings;
    uint32_t total_files;
    uint32_t total_dirs;
    uint32_t total_extents;
    uint64_t total_allocated_bytes;
    uint32_t orphaned_units;
    uint32_t link_mismatches;
    int      superblock_ok;
    int      clean_flag_ok;
    int      root_dir_ok;
    int      zone_headers_ok;
    int      bitmap_crosscheck_ok;
    int      link_counts_ok;
    int      xattr_chains_ok;
};

int ufs_debug_get_full_bitmap(uint32_t zone_id, uint8_t *out_bitmap, size_t max_bytes, size_t *out_bytes, uint32_t *out_data_first);
int ufs_debug_get_superblock(struct ufs_superblock_debug *out_sb);
int ufs_debug_get_raw_znode(const char *path, struct ufs_znode_raw_debug *out_zn);
int ufs_debug_get_raw_xattrs(const char *path, struct ufs_xattr_raw_debug *entries, size_t max_entries, int *out_count, uint64_t *out_xattr_page_id);
int ufs_debug_fsck(struct ufs_fsck_stat *out_stat);
int ufs_debug_get_system_overview(struct ufs_statfs *sb, uint64_t *total_used_bytes, uint32_t *file_count, uint32_t *dir_count, uint32_t *active_txs, uint32_t *cache_valid);

#ifdef __cplusplus
}
#endif

#endif
