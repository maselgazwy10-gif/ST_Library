
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
};

struct ufs_dirent {
    char name[UFS_MAX_NAME + 1];
    uint64_t object_id;
    int type;
};

int ufs_format(const char *image_path, size_t image_size);
int ufs_mount(const char *image_path);
int ufs_unmount(void);

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

#ifdef __cplusplus
}
#endif

#endif
