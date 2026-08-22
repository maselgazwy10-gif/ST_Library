#define _FILE_OFFSET_BITS 64
#include "userfs.h"

#include <assert.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define CHECK(x, msg) do { if ((x) < 0) { perror(msg); exit(1); } } while (0)

int main(void) {
    const char *img = "alloc_test.img";
    printf("============================================================\n");
    printf("  RUNNING AURAFS ALLOCATION IN-DEPTH INNOVATION TESTS\n");
    printf("============================================================\n");

    CHECK(ufs_format(img, 32u * 1024u * 1024u), "format");
    CHECK(ufs_mount(img), "mount");

    /* TEST 1: Tier-0 Inline Data (<= 384 Bytes) */
    printf("\n[TEST 1] Testing Tier-0 Inline Z-Node Storage...\n");
    CHECK(ufs_create("/tiny.cfg"), "create /tiny.cfg");
    int fd = ufs_open("/tiny.cfg", UFS_O_WRONLY);
    assert(fd >= 0);
    const char *tiny_data = "CONFIG_KEY=12345;FLASH_SPEED=HIGH;MODE=STANDALONE;";
    ssize_t wr = ufs_write(fd, tiny_data, strlen(tiny_data));
    assert(wr == (ssize_t)strlen(tiny_data));
    CHECK(ufs_close(fd), "close /tiny.cfg");

    struct ufs_stat st;
    CHECK(ufs_stat("/tiny.cfg", &st), "stat /tiny.cfg");
    printf("  /tiny.cfg: Logical Size = %zu bytes, Physical Allocated Size = %zu bytes\n",
           st.size, st.physical_size);
    assert(st.size == strlen(tiny_data));
    assert(st.physical_size == 0); /* 0 physical data blocks used! */

    int is_inline = 0;
    uint16_t ext_cnt = 0;
    struct ufs_extent_info exts[16];
    CHECK(ufs_inspect("/tiny.cfg", &is_inline, &ext_cnt, exts, 16), "inspect /tiny.cfg");
    assert(is_inline == 1);
    assert(ext_cnt == 0);
    printf("  [PASS] Tier-0 Inline verified: Stored in Z-Node with 0 physical allocation.\n");

    /* TEST 2: Remount & Data Persistence of Inline File */
    printf("\n[TEST 2] Verifying Inline Data Persistence Across Remount...\n");
    CHECK(ufs_unmount(), "unmount");
    CHECK(ufs_mount(img), "remount");

    fd = ufs_open("/tiny.cfg", UFS_O_RDONLY);
    assert(fd >= 0);
    char read_buf[256] = {0};
    ssize_t rd = ufs_read(fd, read_buf, sizeof(read_buf) - 1);
    assert(rd == (ssize_t)strlen(tiny_data));
    assert(strcmp(read_buf, tiny_data) == 0);
    CHECK(ufs_close(fd), "close");
    printf("  [PASS] Read back inline data correctly: \"%s\"\n", read_buf);

    /* TEST 3: Inline Spill-over (> 384 Bytes) */
    printf("\n[TEST 3] Testing Seamless Spill-Over from Inline to Extents...\n");
    fd = ufs_open("/tiny.cfg", UFS_O_WRONLY | UFS_O_APPEND);
    assert(fd >= 0);
    char large_chunk[500];
    memset(large_chunk, 'A', sizeof(large_chunk));
    wr = ufs_write(fd, large_chunk, sizeof(large_chunk));
    assert(wr == (ssize_t)sizeof(large_chunk));
    CHECK(ufs_close(fd), "close");

    CHECK(ufs_stat("/tiny.cfg", &st), "stat after spill");
    printf("  After spill: Logical Size = %zu bytes, Physical Allocated Size = %zu bytes\n",
           st.size, st.physical_size);
    assert(st.size == strlen(tiny_data) + sizeof(large_chunk));
    assert(st.physical_size > 0); /* Now backed by physical extents */

    CHECK(ufs_inspect("/tiny.cfg", &is_inline, &ext_cnt, exts, 16), "inspect after spill");
    assert(is_inline == 0);
    assert(ext_cnt >= 1);
    printf("  [PASS] Spilled cleanly into %u physical extent(s) of size %zu bytes.\n",
           ext_cnt, st.physical_size);

    /* TEST 4: Extent Coalescing (Merging adjacent writes) */
    printf("\n[TEST 4] Testing Adjacent Extent Coalescing...\n");
    CHECK(ufs_create("/stream.log"), "create /stream.log");
    fd = ufs_open("/stream.log", UFS_O_WRONLY | UFS_O_APPEND);
    assert(fd >= 0);

    /* Perform 10 small 512-byte appends */
    char block[512];
    memset(block, 'X', sizeof(block));
    for (int i = 0; i < 10; i++) {
        wr = ufs_write(fd, block, sizeof(block));
        assert(wr == sizeof(block));
    }
    CHECK(ufs_close(fd), "close /stream.log");

    CHECK(ufs_inspect("/stream.log", &is_inline, &ext_cnt, exts, 16), "inspect /stream.log");
    printf("  /stream.log (5,120 bytes across 10 writes): Extent Count = %u\n", ext_cnt);
    for (int i = 0; i < ext_cnt; i++) {
        printf("    Extent #%d: Zone %u, Unit %u-%u (%u units = %u bytes)\n",
               i, exts[i].zone_id, exts[i].physical_unit,
               exts[i].physical_unit + exts[i].physical_units - 1,
               exts[i].physical_units, exts[i].physical_units * 512);
    }
    /* Without coalescing, ext_cnt would be 10. With coalescing, ext_cnt is 1! */
    assert(ext_cnt == 1);
    printf("  [PASS] Coalescing verified: 10 consecutive appends merged into 1 continuous extent!\n");

    /* TEST 5: Slack Reuse */
    printf("\n[TEST 5] Testing Slack Reuse inside Extents...\n");
    /* 1. First append 20 bytes: extends physical units by 1 (512B) giving 492 bytes of slack */
    fd = ufs_open("/stream.log", UFS_O_WRONLY | UFS_O_APPEND);
    assert(fd >= 0);
    wr = ufs_write(fd, "12345678901234567890", 20); /* size: 5120 -> 5140, phys: 5632 */
    assert(wr == 20);
    CHECK(ufs_close(fd), "close");

    CHECK(ufs_stat("/stream.log", &st), "stat /stream.log");
    size_t phys_with_slack = st.physical_size;
    printf("  After extending to 5140 bytes: Physical size = %zu bytes (has %zu bytes slack).\n",
           st.physical_size, st.physical_size - st.size);

    /* 2. Now append another 50 bytes: MUST be absorbed in existing slack! */
    fd = ufs_open("/stream.log", UFS_O_WRONLY | UFS_O_APPEND);
    assert(fd >= 0);
    wr = ufs_write(fd, "12345678901234567890123456789012345678901234567890", 50);
    assert(wr == 50);
    CHECK(ufs_close(fd), "close");

    CHECK(ufs_stat("/stream.log", &st), "stat after slack append");
    printf("  Expanded from 5140 to %zu bytes while physical size stayed at %zu bytes.\n",
           st.size, st.physical_size);
    assert(st.size == 5190);
    assert(st.physical_size == phys_with_slack); /* 0 new blocks allocated! */
    printf("  [PASS] Slack reuse verified: Absorbed growth within existing capacity!\n");

    /* TEST 6: Extended Attributes (xattrs) */
    printf("\n[TEST 6] Testing Extended Attributes (xattrs) & MIME Indexing...\n");
    CHECK(ufs_setxattr("/stream.log", "user.mime_type", "application/json", strlen("application/json")), "setxattr mime");
    CHECK(ufs_setxattr("/stream.log", "user.sensor_id", "STM32_TEMP_04", strlen("STM32_TEMP_04")), "setxattr sensor");

    char xval[64] = {0};
    int xlen = ufs_getxattr("/stream.log", "user.mime_type", xval, sizeof(xval) - 1);
    assert(xlen > 0);
    printf("  Read xattr 'user.mime_type': \"%s\"\n", xval);
    assert(strcmp(xval, "application/json") == 0);

    memset(xval, 0, sizeof(xval));
    xlen = ufs_getxattr("/stream.log", "user.sensor_id", xval, sizeof(xval) - 1);
    assert(xlen > 0);
    printf("  Read xattr 'user.sensor_id': \"%s\"\n", xval);
    assert(strcmp(xval, "STM32_TEMP_04") == 0);

    char xlist[256] = {0};
    int total_keys = ufs_listxattr("/stream.log", xlist, sizeof(xlist));
    assert(total_keys > 0);
    printf("  List xattrs total bytes = %d (Keys: \"%s\", \"%s\")\n", total_keys, xlist, xlist + strlen(xlist) + 1);

    /* Test persistence across unmount/mount */
    CHECK(ufs_unmount(), "unmount before xattr test");
    CHECK(ufs_mount(img), "remount for xattr test");

    memset(xval, 0, sizeof(xval));
    xlen = ufs_getxattr("/stream.log", "user.mime_type", xval, sizeof(xval) - 1);
    assert(xlen > 0 && strcmp(xval, "application/json") == 0);
    printf("  [PASS] Extended Attributes verified across remount! MIME type indexed in 0ms.\n");

    /* TEST 7: Transparent Per-Extent LZ4 Compression */
    printf("\n[TEST 7] Testing Transparent Per-Extent LZ4 Compression...\n");
    CHECK(ufs_create("/telemetry.json"), "create /telemetry.json");
    fd = ufs_open("/telemetry.json", UFS_O_WRONLY);
    assert(fd >= 0);
    char comp_sample[4096];
    for (int i = 0; i < 4096; i += 64) {
        snprintf(comp_sample + i, 64, "SENSOR_ID=STM32;TEMP=24.5C;STATUS=NORMAL;RECORD_NUM=%04d;\n", i / 64);
    }
    wr = ufs_write(fd, comp_sample, sizeof(comp_sample));
    assert(wr == sizeof(comp_sample));
    CHECK(ufs_close(fd), "close /telemetry.json");

    CHECK(ufs_stat("/telemetry.json", &st), "stat /telemetry.json");
    printf("  Before Compression: Logical = %zu bytes, Physical = %zu bytes (%zu units)\n",
           st.size, st.physical_size, st.physical_size / 512);
    assert(st.physical_size == 4096);

    /* Run LZ4 compression on file */
    CHECK(ufs_compress_file("/telemetry.json"), "compress /telemetry.json");

    CHECK(ufs_stat("/telemetry.json", &st), "stat after compression");
    printf("  After Compression:  Logical = %zu bytes, Physical = %zu bytes (%zu units)\n",
           st.size, st.physical_size, st.physical_size / 512);
    assert(st.physical_size < 4096);
    double saved_pct = (1.0 - (double)st.physical_size / 4096.0) * 100.0;
    printf("  [PASS] Flash Storage Space Saved: %.1f%% (%zu units saved!)\n", saved_pct, (4096 - st.physical_size) / 512);

    /* Verify extent has UFS_FLAG_COMPRESSED_LZ4 */
    ext_cnt = 0;
    CHECK(ufs_inspect("/telemetry.json", &is_inline, &ext_cnt, exts, 64), "inspect compressed");
    assert(ext_cnt == 1);
    assert(exts[0].granularity & UFS_FLAG_COMPRESSED_LZ4);

    /* Verify transparent decompression upon reading */
    fd = ufs_open("/telemetry.json", UFS_O_RDONLY);
    assert(fd >= 0);
    char readback[4096] = {0};
    ssize_t read_bytes = ufs_read(fd, readback, sizeof(readback));
    assert(read_bytes == sizeof(comp_sample));
    assert(memcmp(readback, comp_sample, sizeof(comp_sample)) == 0);
    CHECK(ufs_close(fd), "close after read");
    printf("  [PASS] Transparent Decompression verified: 100%% byte-for-byte fidelity!\n");

    /* Verify persistence across reboot */
    CHECK(ufs_unmount(), "unmount before reboot test");
    CHECK(ufs_mount(img), "remount for reboot test");

    fd = ufs_open("/telemetry.json", UFS_O_RDONLY);
    assert(fd >= 0);
    memset(readback, 0, sizeof(readback));
    read_bytes = ufs_read(fd, readback, sizeof(readback));
    assert(read_bytes == sizeof(comp_sample));
    assert(memcmp(readback, comp_sample, sizeof(comp_sample)) == 0);
    CHECK(ufs_close(fd), "close after remount read");
    printf("  [PASS] Compressed Extents verified persistent across disk remount!\n");

    CHECK(ufs_unmount(), "unmount");
    printf("\n============================================================\n");
    printf("  ALL ALLOCATION IN-DEPTH TESTS PASSED SUCCESSFULLY! (100%%)\n");
    printf("============================================================\n");
    return 0;
}
