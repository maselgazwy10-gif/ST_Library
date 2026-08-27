
#include "userfs.h"
#include <stdio.h>
#include <inttypes.h>

static void show(const char *p) {
    struct ufs_dirent e[32];
    int n = ufs_listdir(p, e, 32);
    if (n < 0) { perror(p); return; }
    printf("LIST %s: %d entries\n", p, n);
    for (int i=0; i<n; ++i)
        printf("  [%d] %s id=0x%016" PRIx64 " type=%d\n",
               i, e[i].name, e[i].object_id, e[i].type);
}
int main(void) {
    if (ufs_mount("disk.img")<0) { perror("mount"); return 1; }
    show("/");
    show("/docs");
    show("/docs/course");
    struct ufs_stat st;
    if (ufs_stat("/docs/course/notes.txt", &st)<0) perror("stat");
    else printf("stat notes: %zu\n", st.size);
    ufs_unmount();
    return 0;
}
