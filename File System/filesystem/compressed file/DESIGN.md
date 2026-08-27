
# UserFS current architecture

This baseline implements the architecture currently selected by the team.

## 1. Execution model

User-space C library/application operating on a normal Linux disk-image file. No FUSE and no kernel module are used.

## 2. Block / physical allocation model

The filesystem uses 4 KiB disk I/O pages for the implementation, but physical file allocation is performed at three granularities:

- 512 B
- 4 KiB
- 16 KiB

The logical file address space is byte-oriented. Mapping entries translate logical file ranges to physical regions.

## 3. Disk layout

The image contains:

1. One superblock page.
2. A fixed-size delta journal area.
3. N equal-sized physical zones.
4. Each zone contains:
   - a zone header
   - a fixed Z-Node table
   - a local 512-byte-resolution allocation bitmap
   - allocatable physical regions

## 4. Z-Node metadata

Each filesystem object receives a compound 64-bit object ID:

    upper 32 bits = home zone
    lower 32 bits = local Z-Node ID

A Z-Node lives in its home zone and contains:

- object type
- size
- parent object ID
- preferred allocation granularity
- extent count
- variable-granularity extent records

A file's data is allowed to span multiple zones.

## 5. Mapping

Each extent contains:

- logical start
- logical length
- physical zone
- physical start unit
- physical unit count
- granularity

Small objects can remain represented by the extents stored directly in the Z-Node.

## 6. Free-space management

Each zone has a bitmap with one bit per 512-byte allocation unit.

The global superblock stores a zone summary including:

- free units
- largest free run
- total allocatable units
- number of used Z-Nodes

The allocator chooses candidate zones from the summaries, then scans the selected local bitmap.

## 7. Directory

Directories are ordinary UserFS files containing fixed-size directory entries.

A small in-memory hot cache records frequently accessed name -> object-ID mappings. The persistent directory remains simple and predictable.

## 8. Crash consistency

The journal records metadata/allocation deltas rather than a whole filesystem snapshot. A transaction contains:

- BEGIN
- delta records (Z-Node, directory slot, bitmap)
- COMMIT

Committed deltas are replayed during mount. The implementation orders metadata persistence after the journal commit.

## 9. Important invariants

- Object IDs uniquely identify Z-Nodes.
- A directory entry points to a valid Z-Node.
- A mapped physical region is marked allocated.
- Freed physical regions are not referenced by active extents.
- Root is always a directory.
- `.` and `..` are present in directories.
- File size never exceeds the logical capacity described by its extents.
