#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include "userfs.h"

#define MAX_PATH_LEN 1024

void get_absolute_path(const char *input, char *output, size_t max_len, const char *cwd) {
    if (!input || input[0] == '\0') {
        strncpy(output, cwd, max_len);
        return;
    }
    if (input[0] == '/') {
        strncpy(output, input, max_len);
    } else {
        if (strcmp(cwd, "/") == 0) {
            snprintf(output, max_len, "/%s", input);
        } else {
            snprintf(output, max_len, "%s/%s", cwd, input);
        }
    }
    output[max_len - 1] = '\0';
}

int main(int argc, char **argv) {
    char cwd[MAX_PATH_LEN] = "/";

    printf("Welcome to My Ahla Shell! Type 'help' for available commands.\n");

    while (1) {
        char buff[20000];
        printf("my ahla shell:%s$ ", cwd);
        fflush(stdout);

        if (fgets(buff, sizeof(buff), stdin) == NULL) {
            printf("\n");
            break;
        }

        buff[strcspn(buff, "\r\n")] = 0;
        if (strlen(buff) == 0) {
            continue;
        }

        char *args[16];
        int arg_count = 0;
        char *token = strtok(buff, " ");
        while (token && arg_count < 16) {
            args[arg_count++] = token;
            token = strtok(NULL, " ");
        }

        if (arg_count == 0) continue;
        char *cmd = args[0];

        if (!strcmp(cmd, "exit") || !strcmp(cmd, "quit")) {
            ufs_unmount(); // Safe cleanup if mounted
            printf("Good Bye \n");
            break;
        }
        else if (!strncmp(cmd, "echo", 4)) {
            char *p = buff + 4;
            while (*p == ' ') p++;
            printf("%s\n", p);
        }
        else if (!strcmp(cmd, "pwd")) {
            printf("%s\n", cwd);
        }
        else if (!strcmp(cmd, "help")) {
            printf("Available commands:\n");
            printf("  mount <disk.img>        - Manually mount a virtual disk image\n");
            printf("  unmount                 - Manually unmount the active disk\n");
            printf("  format <disk.img> [sz]  - Format a fresh virtual disk image\n");
            printf("  ls [path]               - List directory contents\n");
            printf("  cd <path>               - Change directory\n");
            printf("  pwd                     - Print working directory\n");
            printf("  mkdir <path>            - Create a directory\n");
            printf("  rmdir <path>            - Remove an empty directory\n");
            printf("  create <path>           - Create an empty file\n");
            printf("  rm <path>               - Delete a file\n");
            printf("  stat <path>             - Show file info & physical block size\n");
            printf("  cat <path>              - Read and print file contents\n");
            printf("  write <path> <text>     - Write text into a file (appends)\n");
            printf("  truncate <path> <size>  - Truncate file to a specific size\n");
            printf("  exit                    - Exit the shell\n");
        }
        else if (!strcmp(cmd, "mount")) {
            if (arg_count < 2) {
                printf("Usage: mount <disk_image>\n");
                continue;
            }
            if (ufs_mount(args[1]) == 0) {
                printf("Successfully mounted '%s'\n", args[1]);
                strcpy(cwd, "/");
            } else {
                printf("Failed to mount '%s'.\n", args[1]);
            }
        }
        else if (!strcmp(cmd, "unmount")) {
            if (ufs_unmount() == 0) {
                printf("Disk unmounted successfully.\n");
                strcpy(cwd, "/");
            } else {
                printf("Failed to unmount disk (Is it mounted?).\n");
            }
        }
        else if (!strcmp(cmd, "format")) {
            if (arg_count < 2) {
                printf("Usage: format <disk_image>\n");
                continue;
            }
            size_t size = 32u * 1024u * 1024u; // 32MB disk size
            if (ufs_format(args[1], size) == 0) {
                printf("Successfully formatted disk: %s\n", args[1]);
            } else {
                printf("Failed to format disk.\n");
            }
        }
        else if (!strcmp(cmd, "cd")) {
            if (arg_count < 2) {
                printf("Usage: cd <path>\n");
                continue;
            }
            if (strcmp(args[1], "..") == 0) {
                char *last_slash = strrchr(cwd, '/');
                if (last_slash && last_slash != cwd) {
                    *last_slash = '\0';
                } else {
                    strcpy(cwd, "/");
                }
                continue;
            } else if (strcmp(args[1], ".") == 0) {
                continue;
            }

            char target[MAX_PATH_LEN];
            get_absolute_path(args[1], target, sizeof(target), cwd);

            struct ufs_stat s;
            if (ufs_stat(target, &s) == 0) {
                if (s.type == UFS_TYPE_DIR) {
                    strncpy(cwd, target, sizeof(cwd));
                } else {
                    printf("cd: Not a directory: %s\n", args[1]);
                }
            } else {
                printf("cd: No such directory: %s\n", args[1]);
            }
        }
        else if (!strcmp(cmd, "ls")) {
            char target[MAX_PATH_LEN];
            char *path_arg = (arg_count > 1) ? args[1] : cwd;
            get_absolute_path(path_arg, target, sizeof(target), cwd);

            struct ufs_dirent entries[64];
            int count = ufs_listdir(target, entries, 64);
            if (count >= 0) {
                for (int i = 0; i < count; i++) {
                    char *icon = (entries[i].type == UFS_TYPE_DIR) ? "[DIR]  " : "[FILE] ";
                    printf("  %s %s\n", icon, entries[i].name);
                }
                if (count == 0) printf("  (Empty Directory)\n");
            } else {
                printf("Failed to list directory: %s\n", target);
            }
        }
        else if (!strcmp(cmd, "mkdir")) {
            if (arg_count < 2) {
                printf("Usage: mkdir <path>\n");
                continue;
            }
            char target[MAX_PATH_LEN];
            get_absolute_path(args[1], target, sizeof(target), cwd);
            if (ufs_mkdir(target) == 0) {
                printf("Created directory: %s\n", target);
            } else {
                printf("Failed to create directory.\n");
            }
        }
        else if (!strcmp(cmd, "rmdir")) {
            if (arg_count < 2) {
                printf("Usage: rmdir <path>\n");
                continue;
            }
            char target[MAX_PATH_LEN];
            get_absolute_path(args[1], target, sizeof(target), cwd);
            if (ufs_rmdir(target) == 0) {
                printf("Removed directory: %s\n", target);
            } else {
                printf("Failed to remove directory.\n");
            }
        }
        else if (!strcmp(cmd, "create")) {
            if (arg_count < 2) {
                printf("Usage: create <path>\n");
                continue;
            }
            char target[MAX_PATH_LEN];
            get_absolute_path(args[1], target, sizeof(target), cwd);
            if (ufs_create(target) == 0) {
                printf("Created file: %s\n", target);
            } else {
                printf("Failed to create file.\n");
            }
        }
        else if (!strcmp(cmd, "rm")) {
            if (arg_count < 2) {
                printf("Usage: rm <path>\n");
                continue;
            }
            char target[MAX_PATH_LEN];
            get_absolute_path(args[1], target, sizeof(target), cwd);
            if (ufs_unlink(target) == 0) {
                printf("Deleted file: %s\n", target);
            } else {
                printf("Failed to delete file.\n");
            }
        }
        else if (!strcmp(cmd, "stat")) {
            if (arg_count < 2) {
                printf("Usage: stat <path>\n");
                continue;
            }
            char target[MAX_PATH_LEN];
            get_absolute_path(args[1], target, sizeof(target), cwd);
            struct ufs_stat s;
            if (ufs_stat(target, &s) == 0) {
                char *type_str = (s.type == UFS_TYPE_DIR) ? "Directory" : "File";
                printf("Stat for %s:\n", target);
                printf("  Type:          %s\n", type_str);
                printf("  Logical Size:  %zu bytes\n", s.size);
                printf("  Physical Size: %zu bytes\n", s.physical_size);
            } else {
                printf("Failed to read stat.\n");
            }
        }
        else if (!strcmp(cmd, "cat")) {
            if (arg_count < 2) {
                printf("Usage: cat <path>\n");
                continue;
            }
            char target[MAX_PATH_LEN];
            get_absolute_path(args[1], target, sizeof(target), cwd);
            int fd = ufs_open(target, UFS_O_RDONLY);
            if (fd >= 0) {
                char buffer[UFS_BLOCK_SIZE + 1];
                ssize_t bytes_read = ufs_read(fd, buffer, UFS_BLOCK_SIZE);
                if (bytes_read >= 0) {
                    buffer[bytes_read] = '\0';
                    printf("%s\n", buffer);
                } else {
                    printf("Failed to read file.\n");
                }
                ufs_close(fd);
            } else {
                printf("Failed to open file for reading.\n");
            }
        }
        else if (!strcmp(cmd, "write")) {
            if (arg_count < 3) {
                printf("Usage: write <path> <text>\n");
                continue;
            }
            char target[MAX_PATH_LEN];
            get_absolute_path(args[1], target, sizeof(target), cwd);

            char data[1024] = "";
            for (int i = 2; i < arg_count; i++) {
                strcat(data, args[i]);
                if (i < arg_count - 1) strcat(data, " ");
            }

            int fd = ufs_open(target, UFS_O_WRONLY | UFS_O_APPEND);
            if (fd >= 0) {
                ssize_t written = ufs_write(fd, data, strlen(data));
                if (written >= 0) {
                    printf("Wrote %zd bytes to %s\n", written, target);
                } else {
                    printf("Failed to write to file.\n");
                }
                ufs_close(fd);
            } else {
                printf("Failed to open file for writing. (Does it exist?)\n");
            }
        }
        else if (!strcmp(cmd, "truncate")) {
            if (arg_count < 3) {
                printf("Usage: truncate <path> <size>\n");
                continue;
            }
            char target[MAX_PATH_LEN];
            get_absolute_path(args[1], target, sizeof(target), cwd);
            size_t new_size = (size_t)atoi(args[2]);
            if (ufs_truncate(target, new_size) == 0) {
                printf("Successfully truncated %s to %zu bytes.\n", target, new_size);
            } else {
                printf("Failed to truncate file.\n");
            }
        }
        else {
            printf("invalid command (Type 'help' for options)\n");
        }
    }
    return 0;
}
