
#include "userfs.h"

#include <errno.h>
#include <stdio.h>
#include <inttypes.h>
#include <stdlib.h>
#include <string.h>

static void die(const char *msg) {
    perror(msg);
    exit(EXIT_FAILURE);
}

static void check(int rc, const char *msg) {
    if (rc < 0) die(msg);
}

int main(void) {
    const char *image = "disk.img";

    if (ufs_format(image, 32u * 1024u * 1024u) < 0)
        die("ufs_format");

    if (ufs_mount(image) < 0)
        die("ufs_mount");

    check(ufs_mkdir("/docs"), "mkdir /docs");
    check(ufs_mkdir("/docs/course"), "mkdir /docs/course");
    check(ufs_create("/docs/course/notes.txt"), "create notes");

    int fd = ufs_open("/docs/course/notes.txt", UFS_O_RDWR);
    if (fd < 0) die("open");

    const char *msg =
        "UserFS test: this file is stored through variable-granularity "
        "zone allocation and a Z-Node based metadata design.\n";

    ssize_t wr = ufs_write(fd, msg, strlen(msg));
    if (wr != (ssize_t)strlen(msg))
        die("write");

    if (ufs_seek(fd, 0, SEEK_SET) < 0)
        die("seek");

    char buf[512];
    memset(buf, 0, sizeof(buf));
    ssize_t rd = ufs_read(fd, buf, sizeof(buf) - 1);
    if (rd < 0) die("read");

    printf("Read back (%zd bytes):\n%s\n", rd, buf);

    check(ufs_close(fd), "close");

    struct ufs_dirent ents[16];
    int n = ufs_listdir("/docs/course", ents, 16);
    if (n < 0) die("listdir");

    printf("Directory entries:\n");
    for (int i = 0; i < n; ++i)
        printf("  %s  type=%d  object_id=0x%016" PRIx64 "\n",
               ents[i].name, ents[i].type, ents[i].object_id);

    struct ufs_stat st;
    check(ufs_stat("/docs/course/notes.txt", &st), "stat");
    printf("notes.txt: size=%zu type=%d\n", st.size, st.type);

    check(ufs_unmount(), "unmount");

    check(ufs_mount(image), "remount");

    fd = ufs_open("/docs/course/notes.txt", UFS_O_RDONLY);
    if (fd < 0) die("reopen");

    memset(buf, 0, sizeof(buf));
    rd = ufs_read(fd, buf, sizeof(buf) - 1);
    if (rd < 0) die("reread");

    printf("After remount (%zd bytes):\n%s\n", rd, buf);

    check(ufs_close(fd), "close after remount");
    check(ufs_unmount(), "final unmount");

    puts("UserFS smoke test passed.");
    return EXIT_SUCCESS;
}
