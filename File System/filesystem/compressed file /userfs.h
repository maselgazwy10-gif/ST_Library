
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

#ifdef __cplusplus
}
#endif

#endif
