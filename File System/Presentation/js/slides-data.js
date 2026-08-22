// AuraFS Presentation - Complete Slides Data (Slides 1 to 73)
// Themed with Undertale Zones, Dialogue Boxes, and Interactive Metadata

const SLIDES_DATA = [
  {
    "chapter": "Table of Contents",
    "zone": "treasuremap",
    "zoneName": "Overworld: Treasure Map",
    "title": "AuraFS Expedition Map & Table of Contents",
    "subtitle": "Master Navigation Guide Across All Storage Domains",
    "badge": "WORLD MAP",
    "quote": "Follow the charted expedition path from foundational storage domains to atomic consistency and FAT32 battle arenas.",
    "content": "\n    <div class=\"undertale-box\">\n      <div class=\"box-header hl-yellow\"><span class=\"pixel-star-large\">★</span> OVERWORLD EXPEDITION ROUTE</div>\n      <div class=\"matrix-table-wrapper\">\n        <table class=\"pixel-table text-xs\">\n          <thead>\n            <tr>\n              <th>Chapter / Domain</th>\n              <th>Zone Realm</th>\n              <th>Architectural Focus & Struct Deep Dives</th>\n              <th>Deck Slides</th>\n              <th>❄️🔥 Comparison Arena</th>\n            </tr>\n          </thead>\n          <tbody>\n            <tr>\n              <td><strong>Ch 1: Universal Intro</strong></td>\n              <td><span class=\"pill-badge hl-purple\">🏛️ The Ruins</span></td>\n              <td>Logical View vs Physical Reality & 6 Core Problems</td>\n              <td><strong>Slides 1–5</strong></td>\n              <td><strong class=\"hl-cyan\">❄️ Slide 6: Core Philosophy</strong></td>\n            </tr>\n            <tr>\n              <td><strong>Ch 2: Disk Layout</strong></td>\n              <td><span class=\"pill-badge hl-cyan\">🌲 Snowdin</span></td>\n              <td>Storage Domains, 4KB Pages, <code>zone_header_disk_t</code>, <code>superblock_disk_t</code> & <code>zone_summary_disk_t</code></td>\n              <td><strong>Slides 7–24</strong></td>\n              <td><strong class=\"hl-cyan\">❄️ Slide 25: Disk Layout & Locality</strong></td>\n            </tr>\n            <tr>\n              <td><strong>Ch 3: Free Space & Z-Nodes</strong></td>\n              <td><span class=\"pill-badge hl-cyan\">💧 Waterfall</span></td>\n              <td>Local Bitmaps, <code>znode_disk_t</code>, <code>ufs_extent_disk_t</code> & Cross-Zone Scaling</td>\n              <td><strong>Slides 26–36</strong></td>\n              <td><strong class=\"hl-cyan\">❄️ Slide 37: Free Space & Metadata</strong></td>\n            </tr>\n            <tr>\n              <td><strong>Ch 4: Allocation & Granularity</strong></td>\n              <td><span class=\"pill-badge hl-blue\">⚡ The Core</span></td>\n              <td>Variable Tiers (512B/4K/16K), Contiguity, Slack Reuse, Inline & LZ4</td>\n              <td><strong>Slides 38–57</strong></td>\n              <td><strong class=\"hl-cyan\">❄️ Slide 58: Allocation & Sizing</strong></td>\n            </tr>\n            <tr>\n              <td><strong>Ch 5: Directory & Consistency</strong></td>\n              <td><span class=\"pill-badge hl-pink\">🏰 The Barrier</span></td>\n              <td><code>dir_disk_t</code>, Hot Cache, <code>journal_record_disk_t</code> & Crash Replay</td>\n              <td><strong>Slides 59–70</strong></td>\n              <td><strong class=\"hl-cyan\">❄️ Slide 71: Directories & Crash Safety</strong></td>\n            </tr>\n            <tr>\n              <td><strong>Ch 6: Summary & Blueprint</strong></td>\n              <td><span class=\"pill-badge hl-gold\">👑 Final Encounter</span></td>\n              <td>Full Architecture Map & Core Component Relationships</td>\n              <td><strong>Slides 72–73</strong></td>\n              <td><strong class=\"hl-green\">★ Master Architecture</strong></td>\n            </tr>\n          </tbody>\n        </table>\n      </div>\n    </div>\n    <div class=\"undertale-grid-2 mt-2\">\n      <div class=\"battle-card yellow-theme\">\n        <div class=\"card-title\">🧭 NAVIGATION TIPS</div>\n        <p class=\"text-xs\">Press <strong>[M]</strong> or <strong>[O]</strong> anytime to open the interactive World Map grid, or use <strong>[Left/Right Arrow]</strong> to explore.</p>\n      </div>\n      <div class=\"battle-card orange-theme\">\n        <div class=\"card-title\">❄️🔥 FROSTFIRE ARENAS</div>\n        <p class=\"text-xs\">At the end of each chapter, enter the blizzard arena to inspect how FAT32 compares against AuraFS.</p>\n      </div>\n    </div>\n",
    "id": 1
  },
  {
    "id": 2,
    "chapter": "Chapter 1: Universal Introduction",
    "zone": "ruins",
    "zoneName": "Zone 00: The Ruins",
    "title": "AuraFS — Rethinking How a Filesystem Uses the Disk",
    "subtitle": "Locality, Flexible Allocation & Explicit Metadata",
    "badge": "TEAM AURA",
    "quote": "We separate what a file means logically from where its bytes physically live.",
    "content": "\n      <div class=\"undertale-grid-2\">\n        <div class=\"battle-card purple-theme\">\n          <div class=\"card-title\"><span class=\"pixel-heart\"></span> LOGICAL VIEW vs PHYSICAL REALITY</div>\n          <div class=\"ascii-block text-sm\">\n                    AuraFS\n                       │\n        ┌──────────────┴──────────────┐\n        │                             │\n   LOGICAL VIEW                 PHYSICAL REALITY\n        │                             │\n   Files / offsets             Zones / blocks\n   Directories                  Metadata\n   Logical blocks               Free space\n                                Physical extents\n          </div>\n        </div>\n        <div class=\"battle-card cyan-theme\">\n          <div class=\"card-title\">🌐 LEFT-TO-RIGHT TRANSFORMATION</div>\n          <div class=\"ascii-block text-sm\">\nwrite(\"notes.txt\", data)\n          │\n          ▼\n   LOGICAL FILE: L0 → L1 → L2 → L3\n          │\n          ▼\n        AuraFS\n          │\n          ▼\n   PHYSICAL DISK:\n   Zone 2:       Zone 2:       Zone 5:\n   [L0][L1]      [L2]          [L3]\n          </div>\n        </div>\n      </div>\n      <div class=\"undertale-box mt-3\">\n        <div class=\"box-header\"><span class=\"pixel-star\">★</span> CORE ARCHITECTURAL PRINCIPLE</div>\n        <p class=\"hl-yellow text-center\">\n          \"The logical file is continuous even when its physical representation isn't.\"\n        </p>\n      </div>\n    ",
    "type": "title"
  },
  {
    "id": 3,
    "chapter": "Chapter 1: Universal Introduction",
    "zone": "ruins",
    "zoneName": "Zone 00: The Ruins",
    "title": "The Filesystem Has to Solve Six Problems at Once",
    "subtitle": "Six Coupled Architectural Decisions",
    "quote": "These decisions are coupled — changing one affects all the others.",
    "content": "\n      <div class=\"grid-3-col\">\n        <div class=\"feature-card cyan-border\">\n          <div class=\"feature-num hl-cyan\">01</div>\n          <div class=\"feature-title\">DISK LAYOUT</div>\n          <p class=\"feature-desc\">Where should everything live on disk?</p>\n        </div>\n        <div class=\"feature-card yellow-border\">\n          <div class=\"feature-num hl-yellow\">02</div>\n          <div class=\"feature-title\">ALLOCATION</div>\n          <p class=\"feature-desc\">How much physical space do we use?</p>\n        </div>\n        <div class=\"feature-card green-border\">\n          <div class=\"feature-num hl-green\">03</div>\n          <div class=\"feature-title\">MAPPING</div>\n          <p class=\"feature-desc\">Where are the file's blocks stored?</p>\n        </div>\n        <div class=\"feature-card orange-border\">\n          <div class=\"feature-num hl-orange\">04</div>\n          <div class=\"feature-title\">FREE SPACE</div>\n          <p class=\"feature-desc\">Where is usable free space located?</p>\n        </div>\n        <div class=\"feature-card purple-border\">\n          <div class=\"feature-num hl-purple\">05</div>\n          <div class=\"feature-title\">NAMESPACE</div>\n          <p class=\"feature-desc\">How do paths become directory entries?</p>\n        </div>\n        <div class=\"feature-card red-border\">\n          <div class=\"feature-num hl-red\">06</div>\n          <div class=\"feature-title\">CRASH CONSISTENCY</div>\n          <p class=\"feature-desc\">What happens if power fails mid-write?</p>\n        </div>\n      </div>\n      <div class=\"undertale-box mt-3 text-center\">\n        <div class=\"box-header\">CIRCULAR INTERDEPENDENCY</div>\n        <code class=\"hl-cyan\">DISK LAYOUT ➔ ALLOCATION ➔ MAPPING ➔ FREE SPACE ➔ NAMESPACE ➔ CRASH CONSISTENCY ➔ DISK LAYOUT</code>\n      </div>\n    "
  },
  {
    "id": 4,
    "chapter": "Chapter 1: Universal Introduction",
    "zone": "ruins",
    "zoneName": "Zone 00: The Ruins",
    "title": "Our Design Objective",
    "subtitle": "Local, Flexible, and Recoverable Storage",
    "quote": "Make physical storage decisions local, flexible, and recoverable — without exposing physical complexity to the application.",
    "content": "\n      <div class=\"grid-3-col\">\n        <div class=\"battle-card cyan-theme\">\n          <div class=\"card-title\">1. LOCALITY</div>\n          <p class=\"text-sm\">Keep related metadata and data physically close whenever possible to reduce disk traversal and head contention.</p>\n        </div>\n        <div class=\"battle-card yellow-theme\">\n          <div class=\"card-title\">2. FLEXIBILITY</div>\n          <p class=\"text-sm\">Allow files to use different physical granularities (512B / 4KB / 16KB) and span multiple physical extents seamlessly.</p>\n        </div>\n        <div class=\"battle-card green-theme\">\n          <div class=\"card-title\">3. RESILIENCE</div>\n          <p class=\"text-sm\">Make multi-structure updates atomic and recoverable through explicit delta journaling across power failures.</p>\n        </div>\n      </div>\n\n      <div class=\"undertale-box mt-4\">\n        <div class=\"box-header\">LAYERED DESIGN ABSTRACTION</div>\n        <div class=\"ascii-block text-xs\">\n              APPLICATION (\"read/write a file\")\n                    │\n                    ▼\n              ┌─────────┐\n              │ AuraFS  │\n              └─────────┘\n                    │\n        ┌───────────┼───────────┐\n        ▼           ▼           ▼\n     LOCALITY    FLEXIBILITY  RESILIENCE\n        </div>\n      </div>\n    "
  },
  {
    "id": 5,
    "chapter": "Chapter 1: Universal Introduction",
    "zone": "ruins",
    "zoneName": "Zone 00: The Ruins",
    "title": "One Filesystem — Six Architectural Decisions",
    "subtitle": "Turning Logical Files into Persistent Physical Storage",
    "quote": "Each section answers one fundamental question about persistent storage.",
    "content": "\n      <div class=\"undertale-box\">\n        <div class=\"box-header\">AURAFS MODULAR DECOMPOSITION</div>\n        <div class=\"matrix-table-wrapper\">\n          <table class=\"pixel-table text-sm\">\n            <thead>\n              <tr>\n                <th>Section</th>\n                <th>Core Question</th>\n                <th>AuraFS Architectural Answer</th>\n              </tr>\n            </thead>\n            <tbody>\n              <tr><td><span class=\"hl-cyan\">01 Disk Layout</span></td><td>How is physical disk organized?</td><td>Localized storage Zones + Global Area</td></tr>\n              <tr><td><span class=\"hl-yellow\">02 Allocation</span></td><td>How do we choose physical space?</td><td>Variable granularity (512B/4K/16K) + Extents</td></tr>\n              <tr><td><span class=\"hl-green\">03 Mapping</span></td><td>How do blocks map to storage?</td><td>Extent lists in Z-Nodes (Logical ➔ Physical)</td></tr>\n              <tr><td><span class=\"hl-orange\">04 Free Space</span></td><td>How to find space efficiently?</td><td>Global Heatmap + Local Bitmaps + Run Summaries</td></tr>\n              <tr><td><span class=\"hl-purple\">05 Namespace</span></td><td>How do path strings resolve?</td><td>Persistent directories + In-memory Hot Cache</td></tr>\n              <tr><td><span class=\"hl-red\">06 Crash Safety</span></td><td>How to survive unexpected crash?</td><td>Transactional Delta-based Journal replay</td></tr>\n            </tbody>\n          </table>\n        </div>\n      </div>\n    "
  },
  {
    "chapter": "Comparison: Introduction",
    "zone": "blizzard",
    "zoneName": "Frostfire: FAT32 vs AuraFS",
    "title": "FAT32 vs. AuraFS: Core Philosophy",
    "subtitle": "Monolithic Flat Table vs. Layered Locality & Extents",
    "quote": "FAT32 was engineered in 1977 for floppy disks; AuraFS is built for modern zoned storage with spatial locality and variable granularities.",
    "content": "\n    <div class=\"undertale-grid-2\">\n      <div class=\"battle-card cyan-theme\">\n        <div class=\"card-title hl-cyan\">❄️ FAT32 (1977 LEGACY)</div>\n        <ul class=\"pixel-list text-xs\">\n          <li><strong>Monolithic Layout:</strong> Flat single table index with no domain isolation.</li>\n          <li><strong>Rigid Indexing:</strong> File offsets strictly chained cluster-by-cluster.</li>\n          <li><strong>Single Fixed Granularity:</strong> One cluster size across the entire drive.</li>\n          <li><strong>Global Bottleneck:</strong> Every write contends on the same global FAT.</li>\n        </ul>\n      </div>\n      <div class=\"battle-card orange-theme\">\n        <div class=\"card-title hl-orange\">🔥 AURAFS ARCHITECTURE</div>\n        <ul class=\"pixel-list text-xs\">\n          <li><strong>Zoned Storage Domains:</strong> Autonomous zones isolate metadata & data.</li>\n          <li><strong>Decoupled Abstraction:</strong> Logical stream decoupled from physical extents.</li>\n          <li><strong>Multi-Granularity:</strong> 512B, 4KiB, and 16KiB right-sized physical units.</li>\n          <li><strong>Atomic Resilience:</strong> Delta-based journaling guarantees zero corrupted state.</li>\n        </ul>\n      </div>\n    </div>\n    <div class=\"undertale-box mt-3 text-center\">\n      <div class=\"box-header hl-yellow\">PARADIGM SHIFT</div>\n      <p class=\"text-xs\">FAT32 treats disk as one giant flat array; AuraFS organizes it into localized, resilient storage domains.</p>\n    </div>\n  ",
    "id": 6
  },
  {
    "id": 7,
    "chapter": "Chapter 2: Disk Layout",
    "zone": "snowdin",
    "zoneName": "Zone 01: Snowdin Forest",
    "title": "01 — Disk Layout",
    "subtitle": "From One Monolithic Disk to Localized Storage Domains",
    "content": "\n      <div class=\"undertale-grid-2\">\n        <div class=\"battle-card red-theme\">\n          <div class=\"card-title\">TRADITIONAL MONOLITHIC DISK</div>\n          <div class=\"ascii-block text-xs\">\n┌──────────────────────────────────────────────┐\n│ Metadata │       DATA       │ Free │ DATA... │\n└──────────────────────────────────────────────┘\n          </div>\n          <p class=\"text-xs mt-2 text-muted\">Single global metadata pool; file data scattered across gigabytes.</p>\n        </div>\n        <div class=\"battle-card cyan-theme\">\n          <div class=\"card-title\">AURAFS ZONED DOMAINS</div>\n          <div class=\"ascii-block text-xs\">\n┌──────────────────────────────────────────────────────────┐\n│ GLOBAL AREA: Superblock │ Delta Journal │ Global Heatmap │\n├──────────────┬──────────────┬──────────────┬─────────────┤\n│    ZONE 0    │    ZONE 1    │    ZONE 2    │    ZONE 3   │\n│ Meta│Free│Data│Meta│Free│Data│Meta│Free│Data│Meta│Free│Data│\n└──────────────┴──────────────┴──────────────┴─────────────┘\n          </div>\n          <p class=\"text-xs mt-2 hl-green\">Self-contained zones co-locating metadata, free state, and data.</p>\n        </div>\n      </div>\n      <div class=\"undertale-box mt-3\">\n        <div class=\"box-header\"><span class=\"pixel-star\">★</span> PARADIGM SHIFT</div>\n        <p class=\"hl-yellow\">Traditional filesystems treat disk as one large space. AuraFS turns it into multiple localized storage domains.</p>\n      </div>\n    ",
    "type": "divider"
  },
  {
    "id": 8,
    "chapter": "Chapter 2: Disk Layout",
    "zone": "snowdin",
    "zoneName": "Zone 01: Snowdin Forest",
    "title": "The Old Model: One Giant Storage Pool",
    "subtitle": "The Classical Monolithic Bottleneck",
    "content": "\n      <div class=\"undertale-box\">\n        <div class=\"box-header\">MONOLITHIC PHYSICAL DISK LAYOUT</div>\n        <div class=\"ascii-block text-xs\">\nPHYSICAL DISK:  0 ────────────────────────────────────────────────────────► MAX\n┌──────────┐ ┌─────────────┐ ┌────────────────────────────────────────────────┐\n│Superblock│ │ Inode Table │ │               HUGE DATA AREA                   │\n└──────────┘ └─────────────┘ └────────────────────────────────────────────────┘\n       Metadata ─── 500 GB physical traversal ───► File Data Blocks\n        </div>\n      </div>\n      <div class=\"grid-2x2 mt-3\">\n        <div class=\"feature-card red-border\">\n          <div class=\"feature-title hl-red\">1. POOR LOCALITY</div>\n          <p class=\"feature-desc\">Metadata and file data are physically separated by huge disk distances.</p>\n        </div>\n        <div class=\"feature-card orange-border\">\n          <div class=\"feature-title hl-orange\">2. LONG TRAVERSALS</div>\n          <p class=\"feature-desc\">Accessing a file requires bouncing between distant front-table and back-data regions.</p>\n        </div>\n        <div class=\"feature-card yellow-border\">\n          <div class=\"feature-title hl-yellow\">3. GLOBAL CONTENTION</div>\n          <p class=\"feature-desc\">Global metadata and free-space bitmaps become shared lock bottlenecks.</p>\n        </div>\n        <div class=\"feature-card cyan-border\">\n          <div class=\"feature-title hl-cyan\">4. WEAK SPATIAL ISOLATION</div>\n          <p class=\"feature-desc\">The disk is treated as one huge unstructured pool with uncoordinated allocation.</p>\n        </div>\n      </div>\n    "
  },
  {
    "id": 9,
    "chapter": "Chapter 2: Disk Layout",
    "zone": "snowdin",
    "zoneName": "Zone 01: Snowdin Forest",
    "title": "Our Solution: Divide the Disk into Localized Zones",
    "subtitle": "Modular, Localized Storage Domains",
    "quote": "A zone is a physical storage domain that co-locates file metadata, local free-space information, and data.",
    "content": "\n      <div class=\"undertale-box\">\n        <div class=\"box-header\"><span class=\"pixel-heart\"></span> AURAFS FULL DISK SCHEMATIC</div>\n        <div class=\"ascii-block text-xs\">\n                         AURAFS DISK\n┌─────────────────────────────────────────────────────────────┐\n│                      GLOBAL AREA                            │\n│ Superblock │ Delta Journal │ Global Zone Heatmap           │\n├────────────────┬────────────────┬───────────────────────────┤\n│     ZONE 0     │     ZONE 1     │          ZONE 2           │\n│  Z-Nodes       │  Z-Nodes       │       Z-Nodes             │\n│  Local Bitmap  │  Local Bitmap  │       Local Bitmap        │\n│  Data          │  Data          │       Data                │\n├────────────────┼────────────────┼───────────────────────────┤\n│     ZONE 3     │     ZONE 4     │          ZONE 5           │\n│  Z-Nodes       │  Z-Nodes       │       Z-Nodes             │\n│  Local Bitmap  │  Local Bitmap  │       Local Bitmap        │\n│  Data          │  Data          │       Data                │\n└────────────────┴────────────────┴───────────────────────────┘\n        </div>\n      </div>\n      <p class=\"hl-green mt-2 text-center text-sm\">Every Zone is an autonomous storage neighborhood containing everything needed to operate files locally.</p>\n    "
  },
  {
    "id": 10,
    "chapter": "Chapter 2: Disk Layout",
    "zone": "snowdin",
    "zoneName": "Zone 01: Snowdin Forest",
    "title": "Inside a Zone: Metadata + Free Space + Data",
    "subtitle": "The Anatomy of a Storage Domain",
    "content": "\n      <div class=\"undertale-grid-2\">\n        <div class=\"undertale-box\">\n          <div class=\"box-header\">ZONE N INTERNAL LAYOUT</div>\n          <div class=\"ascii-block text-xs\">\n                    ZONE N\n┌─────────────────────────────────────────────────────┐\n│  ┌─────────────────┐                                │\n│  │    Z-NODES      │ ➔ File metadata & extents      │\n│  └─────────────────┘                                │\n│  ┌─────────────────┐                                │\n│  │  LOCAL BITMAP   │ ➔ FREE/USED state per 512B     │\n│  └─────────────────┘                                │\n│  ┌───────────────────────────────────────────────┐  │\n│  │                 DATA REGION                   │  │\n│  │ [data][free][data][data][free][free][data]    │  │\n│  └───────────────────────────────────────────────┘  │\n└─────────────────────────────────────────────────────┘\n          </div>\n        </div>\n        <div class=\"feature-card-list\">\n          <div class=\"feature-card cyan-border\">\n            <div class=\"feature-title hl-cyan\">Z-NODES — \"Who is the file?\"</div>\n            <p class=\"feature-desc\">Authoritative file identity, metadata, preferred granularity, and extent records.</p>\n          </div>\n          <div class=\"feature-card yellow-border\">\n            <div class=\"feature-title hl-yellow\">LOCAL BITMAP — \"What is free here?\"</div>\n            <p class=\"feature-desc\">Precise binary allocation state for all 512B physical units in this zone.</p>\n          </div>\n          <div class=\"feature-card green-border\">\n            <div class=\"feature-title hl-green\">DATA REGION — \"Where are the bytes?\"</div>\n            <p class=\"feature-desc\">The physical storage blocks where actual file payloads reside.</p>\n          </div>\n        </div>\n      </div>\n    "
  },
  {
    "chapter": "Chapter 2: Disk Layout",
    "zone": "snowdin",
    "zoneName": "Zone 01: Snowdin Forest",
    "title": "Deep Dive: Zone Header Struct (zone_header_disk_t)",
    "subtitle": "On-Disk 4,096-Byte Metadata Header for Each Storage Domain",
    "badge": "STRUCT ANATOMY",
    "quote": "Every 1 MB zone begins with an authoritative 4KB header defining its internal geometry, bitmap boundaries, and Z-Node slots.",
    "content": "\n    <div class=\"undertale-box\">\n      <div class=\"box-header hl-cyan\"><span class=\"pixel-heart\"></span> ON-DISK STRUCT: <code>zone_header_disk_t</code> (4,096 Bytes / 1 Page)</div>\n      <div class=\"matrix-table-wrapper\">\n        <table class=\"pixel-table text-xs\">\n          <thead>\n            <tr>\n              <th>Field Name</th>\n              <th>C Data Type</th>\n              <th>Size</th>\n              <th>Byte Offset</th>\n              <th>Architectural Role & Value Stored</th>\n            </tr>\n          </thead>\n          <tbody>\n            <tr>\n              <td><code>magic</code></td>\n              <td><code>uint32_t</code></td>\n              <td><span class=\"pill-badge hl-yellow\">4 B</span></td>\n              <td><code>0x00..0x03</code></td>\n              <td>Zone validation signature: <code>0x5A4F4E45</code> (ASCII <code>\"ZONE\"</code>).</td>\n            </tr>\n            <tr>\n              <td><code>version</code></td>\n              <td><code>uint32_t</code></td>\n              <td><span class=\"pill-badge hl-yellow\">4 B</span></td>\n              <td><code>0x04..0x07</code></td>\n              <td>Zone layout version (Version <code>2</code>).</td>\n            </tr>\n            <tr>\n              <td><code>zone_id</code></td>\n              <td><code>uint32_t</code></td>\n              <td><span class=\"pill-badge hl-yellow\">4 B</span></td>\n              <td><code>0x08..0x0B</code></td>\n              <td>Physical zone index on disk ($0 \\dots 31$).</td>\n            </tr>\n            <tr>\n              <td><code>total_units</code></td>\n              <td><code>uint32_t</code></td>\n              <td><span class=\"pill-badge hl-yellow\">4 B</span></td>\n              <td><code>0x0C..0x0F</code></td>\n              <td>Total 512B allocation units in this zone (<code>2,048</code> units = 1 MB).</td>\n            </tr>\n            <tr>\n              <td><code>data_first_unit</code></td>\n              <td><code>uint32_t</code></td>\n              <td><span class=\"pill-badge hl-yellow\">4 B</span></td>\n              <td><code>0x10..0x13</code></td>\n              <td>Unit index where user data begins (after header, znode table, bitmap).</td>\n            </tr>\n            <tr>\n              <td><code>bitmap_bytes</code></td>\n              <td><code>uint32_t</code></td>\n              <td><span class=\"pill-badge hl-yellow\">4 B</span></td>\n              <td><code>0x14..0x17</code></td>\n              <td>Byte length of allocation bitmap (<code>total_units / 8</code> = <code>256 B</code>).</td>\n            </tr>\n            <tr>\n              <td><code>znode_slots</code></td>\n              <td><code>uint32_t</code></td>\n              <td><span class=\"pill-badge hl-yellow\">4 B</span></td>\n              <td><code>0x18..0x1B</code></td>\n              <td>Localized Z-Node slots reserved in this zone (<code>32</code> slots = 4 pages).</td>\n            </tr>\n            <tr>\n              <td><code>flags</code></td>\n              <td><code>uint32_t</code></td>\n              <td><span class=\"pill-badge hl-yellow\">4 B</span></td>\n              <td><code>0x1C..0x1F</code></td>\n              <td>Zone capability flags (Read-Only, Flash-Optimized, Journal-Target).</td>\n            </tr>\n            <tr>\n              <td><code>padding[]</code></td>\n              <td><code>uint8_t[4064]</code></td>\n              <td><span class=\"pill-badge hl-purple\">4,064 B</span></td>\n              <td><code>0x20..0xFFF</code></td>\n              <td>Zero-fill padding to align header to exactly 1 Physical Page (4,096 B).</td>\n            </tr>\n          </tbody>\n        </table>\n      </div>\n    </div>\n    <div class=\"undertale-grid-2 mt-2\">\n      <div class=\"battle-card cyan-theme\">\n        <div class=\"card-title hl-cyan\">🛡️ STATIC ASSERTION GUARANTEE</div>\n        <p class=\"text-xs\"><code>_Static_assert(sizeof(zone_header_disk_t) == 4096, \"zone header size\");</code></p>\n        <p class=\"text-xs text-muted mt-1\">* Guarantees zero-slack 4KB page alignment across all compilers.</p>\n      </div>\n      <div class=\"battle-card yellow-theme\">\n        <div class=\"card-title hl-yellow\">📍 LOCAL GEOMETRY RESOLUTION</div>\n        <p class=\"text-xs\">Zone header gives $O(1)$ computation for data units without querying the global superblock.</p>\n      </div>\n    </div>\n  ",
    "id": 11
  },
  {
    "chapter": "Chapter 2: Disk Layout",
    "zone": "snowdin",
    "zoneName": "Zone 01: Snowdin Forest",
    "title": "The Anatomy of a Page — The Atomic 4 KiB Physical I/O Unit",
    "subtitle": "How the 4,096-Byte Page Bridges Z-Nodes, Units, Extents, and Directories",
    "badge": "I/O CURRENCY",
    "quote": "The 4 KiB Page is the atomic heartbeat of physical disk transfers, unifying metadata, allocation units, and directory records.",
    "content": "\n    <div class=\"undertale-box\">\n      <div class=\"box-header hl-cyan\"><span class=\"pixel-heart\"></span> THE 4 KiB PAGE: THE UNIVERSAL PHYSICAL I/O CURRENCY</div>\n      <p class=\"text-xs\">\n        In AuraFS, all disk reads and writes operate on <strong>4,096-Byte (4 KiB) Pages</strong> (<code>UFS_BLOCK_SIZE = 4096 B</code>). This aligns with CPU MMU memory pages, DMA burst transfers, and SPI/NAND flash programming boundaries.\n      </p>\n    </div>\n    <div class=\"matrix-table-wrapper mt-2\">\n      <table class=\"pixel-table text-xs\">\n        <thead>\n          <tr>\n            <th>Structure Domain</th>\n            <th>Single Element Size</th>\n            <th>Elements Per 4 KiB Page</th>\n            <th>Role in the Filesystem Hierarchy</th>\n          </tr>\n        </thead>\n        <tbody>\n          <tr>\n            <td><strong class=\"hl-purple\">Z-Node Table</strong></td>\n            <td>512 Bytes</td>\n            <td><strong class=\"hl-yellow\">8 Z-Nodes / Page</strong></td>\n            <td>Authoritative file metadata & extent containers (32 slots = 4 pages).</td>\n          </tr>\n          <tr>\n            <td><strong class=\"hl-cyan\">Physical Units</strong></td>\n            <td>512 Bytes</td>\n            <td><strong class=\"hl-yellow\">8 Units / Page</strong></td>\n            <td>Base allocation accounting unit. 1 Medium Extent = Exactly 1 Page (4KB).</td>\n          </tr>\n          <tr>\n            <td><strong class=\"hl-green\">Directory Entries</strong></td>\n            <td>64 Bytes</td>\n            <td><strong class=\"hl-yellow\">64 Dirents / Page</strong></td>\n            <td>Path resolution records (8 entries per 512B block ➔ 64 per full page).</td>\n          </tr>\n          <tr>\n            <td><strong class=\"hl-orange\">Overflow Extents</strong></td>\n            <td>512 Bytes / Table</td>\n            <td><strong class=\"hl-yellow\">1 Overflow Page</strong></td>\n            <td>Indirect extent chaining for files exceeding 16 primary extents.</td>\n          </tr>\n          <tr>\n            <td><strong class=\"hl-gold\">Extended Attributes</strong></td>\n            <td>4,096 Bytes / Page</td>\n            <td><strong class=\"hl-yellow\">1 Dedicated Page</strong></td>\n            <td>Key-value metadata pool (up to 32 attribute tags per file).</td>\n          </tr>\n          <tr>\n            <td><strong class=\"hl-red\">Journal Records</strong></td>\n            <td>4,096 Bytes</td>\n            <td><strong class=\"hl-yellow\">1 Record / Page</strong></td>\n            <td>Atomic sector-aligned transaction updates across power failures.</td>\n          </tr>\n        </tbody>\n      </table>\n    </div>\n    <div class=\"undertale-grid-2 mt-2\">\n      <div class=\"battle-card cyan-theme\">\n        <div class=\"card-title hl-cyan\">⚡ HARDWARE ALIGNMENT</div>\n        <ul class=\"pixel-list text-xs\">\n          <li><strong>Flash Programming:</strong> Matches physical flash page boundaries, eliminating write amplification.</li>\n          <li><strong>DMA Zero-Copy:</strong> Direct aligned transfers between kernel buffers and disk without staging.</li>\n        </ul>\n      </div>\n      <div class=\"battle-card yellow-theme\">\n        <div class=\"card-title hl-yellow\">🔗 STRUCTURAL LINKAGE</div>\n        <ul class=\"pixel-list text-xs\">\n          <li><strong>Sub-Page Granularity:</strong> 512B units allow fine-grained storage inside 4KB pages.</li>\n          <li><strong>O(1) Address Arithmetic:</strong> <code>disk_offset = page_number * 4096</code> guarantees instant lookups.</li>\n        </ul>\n      </div>\n    </div>\n  ",
    "id": 12
  },
  {
    "id": 13,
    "chapter": "Chapter 2: Disk Layout",
    "zone": "snowdin",
    "zoneName": "Zone 01: Snowdin Forest",
    "title": "Why Make a Zone Self-Contained?",
    "subtitle": "Eliminating Cross-Disk Traversals",
    "content": "\n      <div class=\"undertale-grid-2\">\n        <div class=\"battle-card red-theme\">\n          <div class=\"card-title\">CONVENTIONAL DISK</div>\n          <div class=\"ascii-block text-xs\">\nMETADATA (Front of disk)\n   │\n   │   Large physical traversal (high latency)\n   │\n   └──────────────────────────► DATA (Back of disk)\n          </div>\n          <p class=\"text-xs mt-2 text-muted\">Every file read/write incurs seek penalty jumping across tables.</p>\n        </div>\n        <div class=\"battle-card green-theme\">\n          <div class=\"card-title\">AURAFS LOCALIZED ZONE</div>\n          <div class=\"ascii-block text-xs\">\n                 ZONE 5\n       ┌──────────────────────┐\n       │ Z-Node               │\n       │ Local Bitmap         │\n       │                      │\n       │ Data Data Data Data  │\n       └──────────────────────┘\n          </div>\n          <p class=\"text-xs mt-2 hl-yellow\">Local metadata ➔ Local bitmap ➔ Local data.</p>\n        </div>\n      </div>\n      <div class=\"undertale-box mt-3\">\n        <div class=\"box-header\"><span class=\"pixel-star\">★</span> RESULT</div>\n        <p class=\"hl-green text-center text-sm\">Related information lives in the same physical neighborhood ➔ Drastically reduces cross-disk traversals.</p>\n      </div>\n    "
  },
  {
    "id": 14,
    "chapter": "Chapter 2: Disk Layout",
    "zone": "snowdin",
    "zoneName": "Zone 01: Snowdin Forest",
    "title": "Physical Locality Does NOT Define File Ownership",
    "subtitle": "A Crucial Architectural Distinction",
    "quote": "Where metadata lives ≠ where all of the file's data must live.",
    "content": "\n      <div class=\"undertale-box\">\n        <div class=\"box-header\">CROSS-ZONE FILE MAPPING</div>\n        <div class=\"ascii-block text-xs\">\n                       AURAFS DISK\n       ZONE 2 (Home Zone)             ZONE 5 (Secondary Zone)\n┌───────────────────────────────┐     ┌───────────────────────────────┐\n│ Z-NODE #42 (\"video.dat\")      │     │                               │\n│  ├─ Extent 0 → Zone 2 (0-100) │     │                               │\n│  ├─ Extent 1 → Zone 2 (101-200│     │                               │\n│  └─ Extent 2 ─────────────────┼─────┼─► Data Blocks (400-499)       │\n└───────────────────────────────┘     └───────────────────────────────┘\n  ▲ METADATA & PREFERRED HOME           ▲ SECONDARY DATA EXTENT\n        </div>\n      </div>\n      <div class=\"grid-3-col mt-3\">\n        <div class=\"feature-card cyan-border\">\n          <div class=\"feature-title hl-cyan\">LOCALITY</div>\n          <p class=\"feature-desc\">Where the metadata is placed (Home Zone).</p>\n        </div>\n        <div class=\"feature-card yellow-border\">\n          <div class=\"feature-title hl-yellow\">MAPPING</div>\n          <p class=\"feature-desc\">Where each extent physically resides.</p>\n        </div>\n        <div class=\"feature-card green-border\">\n          <div class=\"feature-title hl-green\">OWNERSHIP</div>\n          <p class=\"feature-desc\">Which file's Z-Node owns the extents.</p>\n        </div>\n      </div>\n      <p class=\"hl-yellow mt-2 text-center text-xs\">\"The Z-Node tells us who owns the data. The extent list tells us where the data actually is.\"</p>\n    "
  },
  {
    "id": 15,
    "chapter": "Chapter 2: Disk Layout",
    "zone": "snowdin",
    "zoneName": "Zone 01: Snowdin Forest",
    "title": "Zones Are Preferred Locality Domains — Not Hard Boundaries",
    "subtitle": "Locality Preference with Cross-Zone Fallback",
    "content": "\n      <div class=\"undertale-grid-2\">\n        <div class=\"battle-card cyan-theme\">\n          <div class=\"card-title\">IDEAL CASE (Clean Disk)</div>\n          <div class=\"ascii-block text-xs\">\nZONE 2\n┌─────────────────────────────┐\n│ Z-Node A                    │\n│ Data A A A A A A A A        │\n└─────────────────────────────┘\n➔ 1 Extent (100% Local)\n          </div>\n        </div>\n        <div class=\"battle-card yellow-theme\">\n          <div class=\"card-title\">FRAGMENTED CASE (Full Zone)</div>\n          <div class=\"ascii-block text-xs\">\nZONE 2               ZONE 5\n┌──────────────┐     ┌──────────────┐\n│ Z-Node A     │     │ Data A A A A │\n│ Data A A     │     │              │\n└──────────────┘     └──────────────┘\n➔ 2 Extents across zones\n          </div>\n        </div>\n      </div>\n      <div class=\"undertale-box mt-3\">\n        <div class=\"box-header\">ALLOCATOR DECISION PIPELINE</div>\n        <div class=\"pipeline-horizontal text-xs\">\n          <div>Allocator</div> ➔ <div>Prefers Local Zone</div> ➔ <div>Space Exists?</div> ➔ \n          <div class=\"hl-green\">YES: Allocate locally</div> / \n          <div class=\"hl-yellow\">NO: Use another zone & add extent</div>\n        </div>\n      </div>\n    "
  },
  {
    "id": 16,
    "chapter": "Chapter 2: Disk Layout",
    "zone": "snowdin",
    "zoneName": "Zone 01: Snowdin Forest",
    "title": "Above the Zones: The Global Area",
    "subtitle": "Global Geometry, Recovery, and Routing",
    "content": "\n      <div class=\"undertale-box\">\n        <div class=\"box-header\">GLOBAL AREA ARCHITECTURE</div>\n        <div class=\"ascii-block text-xs\">\n┌─────────────────────────────────────────────────────────────┐\n│                      GLOBAL AREA                            │\n│                                                             │\n│  ┌────────────┐   ┌──────────────┐   ┌──────────────────┐   │\n│  │ SUPERBLOCK │   │ DELTA JOURNAL│   │ GLOBAL ZONE      │   │\n│  │            │   │              │   │ HEATMAP          │   │\n│  └────────────┘   └──────────────┘   └──────────────────┘   │\n└─────────────────────────────────────────────────────────────┘\n                               │\n              ┌────────────────┼─────────────────┐\n              ▼                ▼                 ▼\n           ZONE 0           ZONE 1            ZONE 2 ...\n        </div>\n      </div>\n      <div class=\"grid-3-col mt-3\">\n        <div class=\"feature-card cyan-border\">\n          <div class=\"feature-title hl-cyan\">1. SUPERBLOCK</div>\n          <p class=\"feature-desc\">Filesystem bootstrap, geometry metadata, magic numbers, and structure locator.</p>\n        </div>\n        <div class=\"feature-card green-border\">\n          <div class=\"feature-title hl-green\">2. DELTA JOURNAL</div>\n          <p class=\"feature-desc\">Persistent record of logical metadata transitions for instant crash recovery.</p>\n        </div>\n        <div class=\"feature-card yellow-border\">\n          <div class=\"feature-title hl-yellow\">3. GLOBAL HEATMAP</div>\n          <p class=\"feature-desc\">Disk-wide summary routing the allocator to promising zones in O(1) time.</p>\n        </div>\n      </div>\n    "
  },
  {
    "chapter": "Chapter 2: Disk Layout",
    "zone": "snowdin",
    "zoneName": "Zone 01: Snowdin Forest",
    "title": "Deep Dive: Superblock Struct (superblock_disk_t)",
    "subtitle": "Authoritative 4,096-Byte Master Bootstrap Descriptor at Page 0",
    "badge": "STRUCT ANATOMY",
    "quote": "Page 0 contains the root geometry, journal offsets, global zone boundaries, and the live 32-zone summary table.",
    "content": "\n    <div class=\"undertale-box\">\n      <div class=\"box-header hl-yellow\"><span class=\"pixel-heart\"></span> ON-DISK STRUCT: <code>superblock_disk_t</code> (4,096 Bytes / Page 0)</div>\n      <div class=\"matrix-table-wrapper\">\n        <table class=\"pixel-table text-xs\">\n          <thead>\n            <tr>\n              <th>Field Name</th>\n              <th>Type</th>\n              <th>Size</th>\n              <th>Offset</th>\n              <th>Architectural Role & Description</th>\n            </tr>\n          </thead>\n          <tbody>\n            <tr>\n              <td><code>magic</code> / <code>version</code></td>\n              <td><code>uint32_t[2]</code></td>\n              <td><span class=\"pill-badge hl-cyan\">8 B</span></td>\n              <td><code>0x00..0x07</code></td>\n              <td>Filesystem signature (<code>0x55465332</code> = <code>\"UFS2\"</code>) & format version (<code>2</code>).</td>\n            </tr>\n            <tr>\n              <td><code>image_size</code> / <code>total_pages</code></td>\n              <td><code>uint32_t[2]</code></td>\n              <td><span class=\"pill-badge hl-cyan\">8 B</span></td>\n              <td><code>0x08..0x0F</code></td>\n              <td>Total disk capacity (32 MB) and 4KB page count (8,192 pages).</td>\n            </tr>\n            <tr>\n              <td><code>zone_count</code> / <code>zone_size</code></td>\n              <td><code>uint32_t[2]</code></td>\n              <td><span class=\"pill-badge hl-cyan\">8 B</span></td>\n              <td><code>0x10..0x17</code></td>\n              <td>Number of zones (<code>32</code>) and physical span per zone (<code>1,048,576 B</code> = 1 MB).</td>\n            </tr>\n            <tr>\n              <td><code>zone_header/znode/bitmap_pages</code></td>\n              <td><code>uint32_t[3]</code></td>\n              <td><span class=\"pill-badge hl-cyan\">12 B</span></td>\n              <td><code>0x18..0x23</code></td>\n              <td>Geometry layout: 1 header page, 4 Z-Node table pages, 1 bitmap page.</td>\n            </tr>\n            <tr>\n              <td><code>journal_start_page/pages/head</code></td>\n              <td><code>uint32_t[3]</code></td>\n              <td><span class=\"pill-badge hl-cyan\">12 B</span></td>\n              <td><code>0x24..0x2F</code></td>\n              <td>Delta journal ring buffer: Page 1..512 (2 MB) + active circular head pointer.</td>\n            </tr>\n            <tr>\n              <td><code>zones_start_page</code></td>\n              <td><code>uint32_t</code></td>\n              <td><span class=\"pill-badge hl-cyan\">4 B</span></td>\n              <td><code>0x30..0x33</code></td>\n              <td>Physical page offset where Zone 0 begins (Page <code>513</code>).</td>\n            </tr>\n            <tr>\n              <td><code>root_id</code> / <code>next_txid</code></td>\n              <td><code>uint64_t[2]</code></td>\n              <td><span class=\"pill-badge hl-green\">16 B</span></td>\n              <td><code>0x34..0x43</code></td>\n              <td>Root Directory Object ID (<code>0x0000000000000001</code>) & monotonic TxID counter.</td>\n            </tr>\n            <tr>\n              <td><code>clean</code> / <code>checksum</code></td>\n              <td><code>uint32_t[2]</code></td>\n              <td><span class=\"pill-badge hl-cyan\">8 B</span></td>\n              <td><code>0x44..0x4B</code></td>\n              <td>Clean unmount flag (<code>1</code>=Clean, <code>0</code>=Dirty) & FNV-1a 32-bit checksum.</td>\n            </tr>\n            <tr>\n              <td><code>zones[32]</code></td>\n              <td><code>zone_summary_disk_t[32]</code></td>\n              <td><span class=\"pill-badge hl-gold\">768 B</span></td>\n              <td><code>0x4C..0x34B</code></td>\n              <td><strong>Global Zone Summary Table</strong> (32 zones &times; 24 B = 768 B) for O(1) space discovery.</td>\n            </tr>\n            <tr>\n              <td><code>padding[]</code></td>\n              <td><code>uint8_t[3252]</code></td>\n              <td><span class=\"pill-badge hl-purple\">3,252 B</span></td>\n              <td><code>0x34C..0xFFF</code></td>\n              <td>Zero padding ensuring exact 4,096-Byte (1 Page) sector alignment.</td>\n            </tr>\n          </tbody>\n        </table>\n      </div>\n    </div>\n  ",
    "id": 17
  },
  {
    "chapter": "Chapter 2: Disk Layout",
    "zone": "snowdin",
    "zoneName": "Zone 01: Snowdin Forest",
    "title": "Deep Dive: Zone Summary Struct (zone_summary_disk_t)",
    "subtitle": "The 24-Byte Heartbeat of the Global Free-Space Heatmap",
    "badge": "STRUCT ANATOMY",
    "quote": "32 of these 24-byte records live directly in the superblock, giving the allocator instant disk-wide visibility.",
    "content": "\n    <div class=\"undertale-box\">\n      <div class=\"box-header hl-green\"><span class=\"pixel-heart\"></span> ON-DISK STRUCT: <code>zone_summary_disk_t</code> (24 Bytes per Zone)</div>\n      <div class=\"matrix-table-wrapper\">\n        <table class=\"pixel-table text-xs\">\n          <thead>\n            <tr>\n              <th>Field Name</th>\n              <th>Type</th>\n              <th>Size</th>\n              <th>Offset</th>\n              <th>Dynamic Role in Space Discovery</th>\n            </tr>\n          </thead>\n          <tbody>\n            <tr>\n              <td><code>zone_id</code></td>\n              <td><code>uint32_t</code></td>\n              <td><span class=\"pill-badge hl-yellow\">4 B</span></td>\n              <td><code>0x00..0x03</code></td>\n              <td>Target zone index ($0 \\dots 31$).</td>\n            </tr>\n            <tr>\n              <td><code>free_units</code></td>\n              <td><code>uint32_t</code></td>\n              <td><span class=\"pill-badge hl-yellow\">4 B</span></td>\n              <td><code>0x04..0x07</code></td>\n              <td>Total unallocated 512-byte units remaining in this zone.</td>\n            </tr>\n            <tr>\n              <td><code>largest_free_run</code></td>\n              <td><code>uint32_t</code></td>\n              <td><span class=\"pill-badge hl-yellow\">4 B</span></td>\n              <td><code>0x08..0x0B</code></td>\n              <td>Maximum contiguous sequence of free 512B units (Instant contiguity check).</td>\n            </tr>\n            <tr>\n              <td><code>total_units</code></td>\n              <td><code>uint32_t</code></td>\n              <td><span class=\"pill-badge hl-yellow\">4 B</span></td>\n              <td><code>0x0C..0x0F</code></td>\n              <td>Total assignable data units in this zone (<code>1,984</code> units).</td>\n            </tr>\n            <tr>\n              <td><code>znode_used</code></td>\n              <td><code>uint32_t</code></td>\n              <td><span class=\"pill-badge hl-yellow\">4 B</span></td>\n              <td><code>0x10..0x13</code></td>\n              <td>Count of active Z-Nodes in this zone ($0 \\dots 32$). Used for cross-zone spillover.</td>\n            </tr>\n            <tr>\n              <td><code>reserved</code></td>\n              <td><code>uint32_t</code></td>\n              <td><span class=\"pill-badge hl-yellow\">4 B</span></td>\n              <td><code>0x14..0x17</code></td>\n              <td>Next-fit roving cursor tracker for hardware wear-leveling.</td>\n            </tr>\n          </tbody>\n        </table>\n      </div>\n    </div>\n    <div class=\"undertale-grid-2 mt-2\">\n      <div class=\"battle-card green-theme\">\n        <div class=\"card-title hl-green\">⚡ TOTAL SUMMARY SIZE</div>\n        <p class=\"text-xs\">32 Zones &times; 24 Bytes = <strong>768 Bytes Total</strong>.</p>\n        <p class=\"text-xs text-muted mt-1\">* Fits entirely in CPU L1 cache during allocation loops!</p>\n      </div>\n      <div class=\"battle-card cyan-theme\">\n        <div class=\"card-title hl-cyan\">🎯 O(1) ALLOCATION ROUTING</div>\n        <p class=\"text-xs\">Allocator scans 32 summary integers in RAM instead of reading 32 megabytes of disk bitmaps.</p>\n      </div>\n    </div>\n  ",
    "id": 18
  },
  {
    "id": 19,
    "chapter": "Chapter 2: Disk Layout",
    "zone": "snowdin",
    "zoneName": "Zone 01: Snowdin Forest",
    "title": "One Global View — Many Local Views",
    "subtitle": "Two-Tier Space Discovery Hierarchy",
    "quote": "Global Heatmap = choose the zone. Local Bitmap = choose the physical units.",
    "content": "\n      <div class=\"undertale-grid-2\">\n        <div class=\"battle-card yellow-theme\">\n          <div class=\"card-title\">GLOBAL AREA: GLOBAL HEATMAP</div>\n          <div class=\"ascii-block text-xs\">\n┌─────────────────────────────┐\n│    GLOBAL ZONE HEATMAP      │\n│                             │\n│ Zone 0 → LOW                │\n│ Zone 1 → LOW                │\n│ Zone 2 → VERY HIGH ★        │\n│ Zone 3 → MEDIUM             │\n└──────────────┬──────────────┘\n               │ \"Where should I look?\"\n               ▼\n          </div>\n          <p class=\"text-xs mt-1 hl-yellow\">Narrows disk-wide search down to Zone 2 immediately.</p>\n        </div>\n        <div class=\"battle-card cyan-theme\">\n          <div class=\"card-title\">LOCAL DOMAIN: ZONE 2 BITMAP</div>\n          <div class=\"ascii-block text-xs\">\n┌─────────────────────────────┐\n│           ZONE 2            │\n│                             │\n│ Local Bitmap                │\n│                             │\n│ \"Which units are            │\n│  actually free?\"            │\n└─────────────────────────────┘\n          </div>\n          <p class=\"text-xs mt-1 hl-cyan\">Performs granular local bit-scan for exact unit placement.</p>\n        </div>\n      </div>\n    "
  },
  {
    "id": 20,
    "chapter": "Chapter 2: Disk Layout",
    "zone": "snowdin",
    "zoneName": "Zone 01: Snowdin Forest",
    "title": "AuraFS Does Not Search the Whole Disk",
    "subtitle": "Hierarchical Query Funnel",
    "content": "\n      <div class=\"undertale-grid-2\">\n        <div class=\"undertale-box\">\n          <div class=\"box-header\">DISCOVERY QUERY FUNNEL</div>\n          <div class=\"ascii-block text-xs\">\n             WHOLE DISK\n                 │\n                 ▼\n       GLOBAL ZONE HEATMAP  ➔ \"Which zone?\"\n                 │\n                 ▼\n       LOCAL ZONE BITMAP    ➔ \"Which units?\"\n                 │\n                 ▼\n       GRANULARITY METADATA ➔ \"What size are they?\"\n                 │\n                 ▼\n          PHYSICAL RUN      ➔ \"Allocate these units!\"\n          </div>\n        </div>\n        <div class=\"undertale-box\">\n          <div class=\"box-header\">RESPONSIBILITY MATRIX</div>\n          <div class=\"matrix-table-wrapper\">\n            <table class=\"pixel-table text-xs\">\n              <thead>\n                <tr>\n                  <th>Structure</th>\n                  <th>Core Question Answered</th>\n                </tr>\n              </thead>\n              <tbody>\n                <tr><td><strong class=\"hl-yellow\">Global Heatmap</strong></td><td><strong class=\"hl-yellow\">WHERE?</strong> (Which Zone)</td></tr>\n                <tr><td><strong class=\"hl-cyan\">Local Bitmap</strong></td><td><strong class=\"hl-cyan\">WHICH?</strong> (Which 512B Units)</td></tr>\n                <tr><td><strong class=\"hl-green\">Granularity Meta</strong></td><td><strong class=\"hl-green\">WHAT SIZE?</strong> (512B / 4K / 16K)</td></tr>\n                <tr><td><strong class=\"hl-orange\">Z-Node Extent</strong></td><td><strong class=\"hl-orange\">WHO OWNS?</strong> (File Mapping)</td></tr>\n              </tbody>\n            </table>\n          </div>\n        </div>\n      </div>\n    "
  },
  {
    "id": 21,
    "chapter": "Chapter 2: Disk Layout",
    "zone": "snowdin",
    "zoneName": "Zone 01: Snowdin Forest",
    "title": "AuraFS Physical Disk — Complete Layout",
    "subtitle": "The Unified Physical Architecture",
    "content": "\n      <div class=\"undertale-box\">\n        <div class=\"box-header\"><span class=\"pixel-star-large\">★</span> COMPLETE PHYSICAL DISK HERO SCHEMATIC</div>\n        <div class=\"ascii-block text-xs\">\n                    PHYSICAL DISK\n┌─────────────────────────────────────────────────────────────┐\n│                       GLOBAL AREA                           │\n│  ┌────────────┐ ┌──────────────┐ ┌───────────────────────┐  │\n│  │ Superblock │ │ Delta Journal│ │ Global Zone Heatmap   │  │\n│  └────────────┘ └──────────────┘ └───────────────────────┘  │\n├──────────────────────┬──────────────────────┬───────────────┤\n│       ZONE 0         │       ZONE 1         │    ZONE 2     │\n│ Z-Nodes | Bitmap     │ Z-Nodes | Bitmap     │ Z-Nodes       │\n│ Data Region          │ Data Region          │ Bitmap | Data │\n├──────────────────────┼──────────────────────┼───────────────┤\n│       ZONE 3         │       ZONE 4         │    ZONE 5 ... │\n│ Z-Nodes | Bitmap     │ Z-Nodes | Bitmap     │ Z-Nodes       │\n│ Data Region          │ Data Region          │ Bitmap | Data │\n└──────────────────────┴──────────────────────┴───────────────┘\n        </div>\n      </div>\n      <div class=\"undertale-box mt-2\">\n        <div class=\"ascii-block text-xs text-center\">\nFile A ➔ Z-Node (Zone 2) ➔ Extent 0 (Zone 2 Data) + Extent 1 (Zone 5 Data)\n        </div>\n      </div>\n    "
  },
  {
    "id": 22,
    "chapter": "Chapter 2: Disk Layout",
    "zone": "snowdin",
    "zoneName": "Zone 01: Snowdin Forest",
    "title": "What Did the Zone Architecture Actually Fix?",
    "subtitle": "Specific Architectural Improvements",
    "content": "\n      <div class=\"grid-3-col\">\n        <div class=\"feature-card cyan-border\">\n          <div class=\"feature-title hl-cyan\">1. LOCALITY</div>\n          <p class=\"feature-desc\">Metadata and data are co-located within nearby physical regions.</p>\n        </div>\n        <div class=\"feature-card yellow-border\">\n          <div class=\"feature-title hl-yellow\">2. LOCAL FREE-SPACE</div>\n          <p class=\"feature-desc\">Zone-local bitmaps avoid global lock contention during concurrent writes.</p>\n        </div>\n        <div class=\"feature-card green-border\">\n          <div class=\"feature-title hl-green\">3. SCALABLE SEARCH</div>\n          <p class=\"feature-desc\">Global heatmap narrows space searches to promising zones in O(1).</p>\n        </div>\n        <div class=\"feature-card orange-border\">\n          <div class=\"feature-title hl-orange\">4. FRAGMENTATION TOLERANCE</div>\n          <p class=\"feature-desc\">Files span multiple extents and zones without losing logical continuity.</p>\n        </div>\n        <div class=\"feature-card purple-border\">\n          <div class=\"feature-title hl-purple\">5. MODULARITY</div>\n          <p class=\"feature-desc\">Each zone is an autonomous storage domain, scaling cleanly with disk size.</p>\n        </div>\n        <div class=\"feature-card red-border\">\n          <div class=\"feature-title hl-red\">6. REDUCED LATENCY</div>\n          <p class=\"feature-desc\">Seek distances are bounded to local zone spans during normal I/O.</p>\n        </div>\n      </div>\n    "
  },
  {
    "id": 23,
    "chapter": "Chapter 2: Disk Layout",
    "zone": "snowdin",
    "zoneName": "Zone 01: Snowdin Forest",
    "title": "The Trade-Off: Locality Is Not Free",
    "subtitle": "Engineering Balance & Overhead",
    "quote": "We traded a simple monolithic layout for a richer hierarchy of global and local metadata.",
    "content": "\n      <div class=\"undertale-grid-2\">\n        <div class=\"battle-card green-theme\">\n          <div class=\"card-title\">AURAFS BENEFITS ✔</div>\n          <ul class=\"pixel-list text-xs\">\n            <li>High metadata-data locality</li>\n            <li>Scalable parallel zone allocation</li>\n            <li>Targeted local free-space searches</li>\n            <li>Modular domain isolation</li>\n            <li>Graceful external fragmentation tolerance</li>\n          </ul>\n        </div>\n        <div class=\"battle-card orange-theme\">\n          <div class=\"card-title\">ARCHITECTURAL COSTS ⚖</div>\n          <ul class=\"pixel-list text-xs\">\n            <li>More discrete metadata structures</li>\n            <li>Zone summary maintenance complexity</li>\n            <li>Cross-zone extent pointer mapping</li>\n            <li>Coordinating global + local state</li>\n            <li>Additional recovery validation rules</li>\n          </ul>\n        </div>\n      </div>\n      <p class=\"hl-yellow text-center text-xs mt-3\">\"AuraFS does not magically eliminate external fragmentation — it tolerates it gracefully.\"</p>\n    "
  },
  {
    "id": 24,
    "chapter": "Chapter 2: Disk Layout",
    "zone": "snowdin",
    "zoneName": "Zone 01: Snowdin Forest",
    "title": "So What Happens When a New File Arrives?",
    "subtitle": "Connecting Disk Layout to Allocation",
    "quote": "Disk layout tells us where storage domains exist. Allocation decides which one to use.",
    "content": "\n      <div class=\"undertale-box\">\n        <div class=\"box-header\">END-TO-END ARRIVAL PIPELINE</div>\n        <div class=\"ascii-block text-xs\">\n                    NEW FILE (\"I need 16 KB\")\n                               │\n                               ▼\n                     ┌───────────────────┐\n                     │  GLOBAL HEATMAP   │ ➔ Identifies Zone 2 as promising ★\n                     └─────────┬─────────┘\n                               │\n                               ▼\n                     ┌───────────────────┐\n                     │   ZONE 2 BITMAP   │ ➔ Scans local free runs\n                     └─────────┬─────────┘\n                               │\n                               ▼\n                     Compatible Free Run Found (32 units @ 512B)\n                               │\n                               ▼\n                     ┌───────────────────┐\n                     │      Z-NODE       │ ➔ Records Extent (Zone 2, Start, 32)\n                     └───────────────────┘\n        </div>\n      </div>\n      <p class=\"hl-cyan text-center text-xs mt-2\">Smooth transition to Allocation: deciding size classes, run lengths, and growth policies.</p>\n    "
  },
  {
    "chapter": "Comparison: Disk Layout",
    "zone": "blizzard",
    "zoneName": "Frostfire: FAT32 vs AuraFS",
    "title": "FAT32 vs. AuraFS: Disk Layout & Locality",
    "subtitle": "Global Table Bottleneck vs. Self-Contained Zones",
    "content": "\n    <div class=\"undertale-grid-2\">\n      <div class=\"battle-card cyan-theme\">\n        <div class=\"card-title hl-cyan\">❄️ FAT32 DISK LAYOUT</div>\n        <div class=\"ascii-block text-xs\">\n┌──────────┬──────────┬──────────┬──────────────────┐\n│Reserved  │  FAT 1   │  FAT 2   │   DATA CLUSTERS  │\n│(Boot+BPB)│(Global)  │(Mirror)  │ (Clusters 2..N)  │\n└──────────┴──────────┴──────────┴──────────────────┘\n▲ Front of Disk                         ▲ End of Disk\n        </div>\n        <ul class=\"pixel-list text-xs mt-2\">\n          <li><strong class=\"hl-red\">Severe Seek Penalty:</strong> Metadata (FAT table) is at the start; file data is gigabytes away.</li>\n          <li><strong class=\"hl-red\">Global Contention:</strong> Every cluster write must lock and update FAT 1 & FAT 2.</li>\n        </ul>\n      </div>\n      <div class=\"battle-card orange-theme\">\n        <div class=\"card-title hl-orange\">🔥 AURAFS DISK LAYOUT</div>\n        <div class=\"ascii-block text-xs\">\n┌───────────────────────────────────────────────────┐\n│ GLOBAL AREA: Superblock │ Journal │ Heatmap       │\n├──────────────┬──────────────┬─────────────────────┤\n│    ZONE 0    │    ZONE 1    │    ZONE 2 ...       │\n│ ZNode│Bit│Data│ ZNode│Bit│Data│ ZNode│Bitmap│Data   │\n└──────────────┴──────────────┴─────────────────────┘\n        </div>\n        <ul class=\"pixel-list text-xs mt-2\">\n          <li><strong class=\"hl-green\">Co-Located Locality:</strong> Metadata, local bitmap, and data live in the same local zone.</li>\n          <li><strong class=\"hl-green\">Scalable Search:</strong> Global heatmap routes queries in O(1) without global table locks.</li>\n        </ul>\n      </div>\n    </div>\n  ",
    "id": 25
  },
  {
    "id": 26,
    "chapter": "Chapter 3: Free Space & Z-Nodes",
    "zone": "waterfall",
    "zoneName": "Zone 02: Waterfall",
    "title": "Free Space Management: The Core Problem",
    "subtitle": "Tracking Availability & Contiguity",
    "content": "\n      <div class=\"undertale-dialogue\">\n        <div class=\"dialogue-avatar avatar-soul\"></div>\n        <div class=\"dialogue-text\">\n          \"When a file needs more space, how does the filesystem know where it can put it?\"\n        </div>\n      </div>\n      <div class=\"undertale-grid-2 mt-3\">\n        <div class=\"battle-card cyan-theme\">\n          <div class=\"card-title\">1. AVAILABILITY</div>\n          <p class=\"text-sm\">Which physical storage units across the disk are currently unallocated?</p>\n          <div class=\"ascii-block text-xs mt-2\">UNIT: [FREE] [USED] [FREE] [FREE]</div>\n        </div>\n        <div class=\"battle-card yellow-theme\">\n          <div class=\"card-title\">2. CONTIGUITY</div>\n          <p class=\"text-sm\">Where is there a large enough contiguous run of free units to satisfy the request?</p>\n          <div class=\"ascii-block text-xs mt-2\">RUN: [FREE][FREE][FREE][FREE] (Len=4)</div>\n        </div>\n      </div>\n    "
  },
  {
    "id": 27,
    "chapter": "Chapter 3: Free Space & Z-Nodes",
    "zone": "waterfall",
    "zoneName": "Zone 02: Waterfall",
    "title": "Traditional Methods: Free List vs. Bitmap",
    "subtitle": "Strengths & Weaknesses of Classical Approaches",
    "content": "\n      <div class=\"undertale-grid-2\">\n        <div class=\"undertale-box\">\n          <div class=\"box-header hl-orange\">TRADITIONAL #1: FREE LIST</div>\n          <div class=\"ascii-block text-xs\">\nFREE LIST: 100 ➔ 101 ➔ 102 ➔ 200 ➔ 201 ➔ 500 ➔ NULL\n          </div>\n          <p class=\"text-xs mt-2\"><strong class=\"hl-green\">PRO:</strong> Very simple linked structure.</p>\n          <p class=\"text-xs\"><strong class=\"hl-red\">CON:</strong> \"Give me 100 contiguous blocks\" requires expensive list traversal; cannot easily detect adjacency.</p>\n        </div>\n        <div class=\"undertale-box\">\n          <div class=\"box-header hl-cyan\">TRADITIONAL #2: FLAT BITMAP</div>\n          <div class=\"ascii-block text-xs\">\nBITMAP: 0 0 0 1 1 1 0 0 0 0 0 0 1 1 (0=FREE, 1=USED)\n          </div>\n          <p class=\"text-xs mt-2\"><strong class=\"hl-green\">PRO:</strong> Compact, easy bit-ops, easy to persist.</p>\n          <p class=\"text-xs\"><strong class=\"hl-red\">CON:</strong> A standard bitmap only knows free/used, not multi-size granularities or run health without full scans.</p>\n        </div>\n      </div>\n    "
  },
  {
    "id": 28,
    "chapter": "Chapter 3: Free Space & Z-Nodes",
    "zone": "waterfall",
    "zoneName": "Zone 02: Waterfall",
    "title": "Our Design: Zone-Aware Free-Space Map",
    "subtitle": "Per-Zone Bitmaps + Dynamic Zone Summaries",
    "content": "\n      <div class=\"undertale-grid-2\">\n        <div class=\"battle-card cyan-theme\">\n          <div class=\"card-title\">1. LOCAL BITMAP</div>\n          <p class=\"text-xs\">\"What is free?\" Exact 512B physical unit bit status.</p>\n          <div class=\"ascii-block text-xs mt-2\">\nbit_get(zone, idx)\nbit_set(zone, idx)\nbit_clear(zone, idx)\n          </div>\n        </div>\n        <div class=\"battle-card yellow-theme\">\n          <div class=\"card-title\">2. ZONE SUMMARY</div>\n          <p class=\"text-xs\">\"How healthy is this zone for allocation?\"</p>\n          <div class=\"ascii-block text-xs mt-2\">\nstruct zone_summary {\n  uint32_t zone_id;\n  uint32_t free_units;\n  uint32_t largest_free_run;\n  uint32_t total_units;\n  uint32_t znode_used;\n};\n          </div>\n        </div>\n      </div>\n      <div class=\"undertale-box mt-3\">\n        <div class=\"box-header hl-green\"><code>update_zone_summary(uint32_t zone_id)</code></div>\n        <p class=\"text-xs\">Scans the zone bitmap to calculate <code>free_units</code> and <code>largest_free_run</code>, giving the allocator instant insight into zone health.</p>\n      </div>\n    "
  },
  {
    "id": 29,
    "chapter": "Chapter 3: Free Space & Z-Nodes",
    "zone": "waterfall",
    "zoneName": "Zone 02: Waterfall",
    "title": "Summary in Action: Free Units vs. Largest Free Run",
    "subtitle": "Why Total Free Space Is Not Enough",
    "content": "\n      <div class=\"undertale-grid-2\">\n        <div class=\"battle-card green-theme\">\n          <div class=\"card-title\">ZONE 0 SUMMARY</div>\n          <div class=\"ascii-block text-xs\">\nBitmap = 00011100000011\nfree_units       = 9\nlargest_free_run = 6  ★★ (Ideal for medium file)\n          </div>\n          <p class=\"text-xs mt-2 hl-green\">Contiguous space available for clean single-extent allocation.</p>\n        </div>\n        <div class=\"battle-card orange-theme\">\n          <div class=\"card-title\">ZONE 1 SUMMARY</div>\n          <div class=\"ascii-block text-xs\">\nBitmap = 01010101010100\nfree_units       = 12\nlargest_free_run = 2  (Heavily fragmented)\n          </div>\n          <p class=\"text-xs mt-2 hl-orange\">More total free units, but severely fragmented into tiny holes.</p>\n        </div>\n      </div>\n      <div class=\"undertale-box mt-3\">\n        <div class=\"box-header\"><span class=\"pixel-star\">★</span> ALLOCATOR INTELLIGENCE</div>\n        <p class=\"hl-yellow text-center text-xs\">\n          The filesystem chooses Zone 0 for an 6-unit request even though Zone 1 has more total free blocks! Best of both worlds: contiguous allocation + external fragmentation avoidance.\n        </p>\n      </div>\n    "
  },
  {
    "id": 30,
    "chapter": "Chapter 3: Free Space & Z-Nodes",
    "zone": "waterfall",
    "zoneName": "Zone 02: Waterfall",
    "title": "Advantages & Trade-Offs of Zone-Aware Free Space",
    "subtitle": "Engineering Strengths and Operational Costs",
    "content": "\n      <div class=\"undertale-grid-2\">\n        <div class=\"undertale-box\">\n          <div class=\"box-header hl-green\">SYSTEM ADVANTAGES</div>\n          <ul class=\"pixel-list text-xs\">\n            <li><strong class=\"hl-cyan\">Compact State:</strong> 1 bit per 512B unit. Fast bitwise primitives.</li>\n            <li><strong class=\"hl-yellow\">Fragmentation Awareness:</strong> <code>largest_free_run</code> prevents bad placement.</li>\n            <li><strong class=\"hl-green\">Contiguous-First:</strong> Prefers single extents on healthy zones.</li>\n            <li><strong class=\"hl-purple\">Graceful Fallback:</strong> Splits across runs when no single run fits.</li>\n          </ul>\n        </div>\n        <div class=\"undertale-box\">\n          <div class=\"box-header hl-red\">OPERATIONAL WEAKNESSES</div>\n          <ul class=\"pixel-list text-xs\">\n            <li><strong class=\"hl-orange\">Summary Stale Risk:</strong> Allocations invalidate summary until recalculated.</li>\n            <li><strong class=\"hl-red\">Scanning Overhead:</strong> Computing <code>largest_free_run</code> requires scanning bitmap words.</li>\n            <li><strong class=\"hl-yellow\">Metadata Footprint:</strong> Bitmap + zone summary + extent descriptors.</li>\n          </ul>\n        </div>\n      </div>\n      <div class=\"undertale-box mt-2 text-center text-xs\">\n        <code>512 B ➔ 1 bitmap unit</code> &nbsp;|&nbsp; <code>4 KiB ➔ 8 bitmap units</code> &nbsp;|&nbsp; <code>16 KiB ➔ 32 bitmap units</code>\n      </div>\n    "
  },
  {
    "id": 31,
    "chapter": "Chapter 3: Free Space & Z-Nodes",
    "zone": "waterfall",
    "zoneName": "Zone 02: Waterfall",
    "title": "Metadata & Mapping: Inodes vs. Extents",
    "subtitle": "Compressing Contiguous Storage Representations",
    "content": "\n      <div class=\"undertale-grid-2\">\n        <div class=\"battle-card red-theme\">\n          <div class=\"card-title\">TRADITIONAL INODE</div>\n          <div class=\"ascii-block text-xs\">\ninode:\n  ├─ size, permissions, timestamps\n  ├─ Direct pointers [0..11]\n  ├─ Single indirect pointer ➔ [blocks]\n  ├─ Double indirect pointer ➔ [tables]\n  └─ Triple indirect pointer ➔ [tables]\n          </div>\n          <p class=\"text-xs mt-2 text-muted\">Severe metadata pointer explosion for large contiguous files.</p>\n        </div>\n        <div class=\"battle-card green-theme\">\n          <div class=\"card-title\">EXTENT-BASED MAPPING</div>\n          <div class=\"ascii-block text-xs\">\nextent:\n  start  = 100\n  length = 4096 blocks\n          </div>\n          <ul class=\"pixel-list text-xs mt-2\">\n            <li>Compresses contiguous blocks into 1 descriptor.</li>\n            <li>Minimal metadata overhead.</li>\n            <li>Optimal sequential disk I/O.</li>\n          </ul>\n        </div>\n      </div>\n    "
  },
  {
    "id": 32,
    "chapter": "Chapter 3: Free Space & Z-Nodes",
    "zone": "waterfall",
    "zoneName": "Zone 02: Waterfall",
    "title": "Our Z-Node: File Metadata Container + Zone Extents",
    "subtitle": "Tailored for Variable-Granularity Zone Allocation",
    "content": "\n      <div class=\"undertale-box\">\n        <div class=\"box-header\">Z-NODE FILE METADATA CONTAINER</div>\n        <p class=\"text-xs\">Our Z-Node is the authoritative file metadata container combined with extent-based mapping tailored to our zone allocator:</p>\n        <div class=\"grid-2x2 mt-2\">\n          <div class=\"pill-badge text-xs\">uint64_t size (Logical File Size)</div>\n          <div class=\"pill-badge text-xs\">uint64_t parent (Directory Link)</div>\n          <div class=\"pill-badge text-xs\">uint16_t granularity (512B / 4K / 16K)</div>\n          <div class=\"pill-badge text-xs\">uint16_t extent_count</div>\n        </div>\n      </div>\n      <div class=\"undertale-box mt-3\">\n        <div class=\"box-header hl-cyan\">WHAT AN EXTENT MEANS IN OUR SYSTEM</div>\n        <div class=\"ascii-block text-xs\">\nlogical_start │ logical_length │ zone_id │ granularity │ physical_unit │ physical_units\n        </div>\n        <p class=\"text-xs mt-1 hl-yellow text-center\">It explicitly connects: <strong>Logical File Space ➔ Physical Zone ➔ Physical 512B Units</strong></p>\n      </div>\n    "
  },
  {
    "chapter": "Chapter 3: Free Space & Z-Nodes",
    "zone": "waterfall",
    "zoneName": "Zone 02: Waterfall",
    "title": "Deep Dive: Z-Node 512-Byte Packed Struct (znode_disk_t)",
    "subtitle": "Complete Field-by-Field Breakdown of the Master File Metadata Container",
    "badge": "STRUCT ANATOMY",
    "quote": "Exactly 512 bytes: 64 bytes of packed header metadata + 448 bytes of extent descriptors or inline data payload.",
    "content": "\n    <div class=\"undertale-box\">\n      <div class=\"box-header hl-purple\"><span class=\"pixel-heart\"></span> ON-DISK STRUCT: <code>znode_disk_t</code> (512 Bytes Packed)</div>\n      <div class=\"matrix-table-wrapper\">\n        <table class=\"pixel-table text-xs\">\n          <thead>\n            <tr>\n              <th>Field Name</th>\n              <th>Type</th>\n              <th>Size</th>\n              <th>Offset</th>\n              <th>Description & Stored State</th>\n            </tr>\n          </thead>\n          <tbody>\n            <tr>\n              <td><code>magic</code> / <code>version</code></td>\n              <td><code>uint32_t</code> / <code>uint8_t</code></td>\n              <td><span class=\"pill-badge hl-cyan\">5 B</span></td>\n              <td><code>0x000..0x004</code></td>\n              <td>Magic signature <code>0x5A4E4F44</code> (<code>\"ZNOD\"</code>) & format version (<code>2</code>).</td>\n            </tr>\n            <tr>\n              <td><code>type</code> / <code>flags</code></td>\n              <td><code>uint8_t</code> / <code>uint16_t</code></td>\n              <td><span class=\"pill-badge hl-cyan\">3 B</span></td>\n              <td><code>0x005..0x007</code></td>\n              <td><code>UFS_TYPE_FILE</code> (1) / <code>UFS_TYPE_DIR</code> (2) & <code>UFS_FLAG_INLINE</code> (0x02).</td>\n            </tr>\n            <tr>\n              <td><code>local_id</code> / <code>link_count</code></td>\n              <td><code>uint16_t[2]</code></td>\n              <td><span class=\"pill-badge hl-cyan\">4 B</span></td>\n              <td><code>0x008..0x00B</code></td>\n              <td>Slot in home zone ($1 \\dots 31$) & POSIX hard-link count (freed when 0).</td>\n            </tr>\n            <tr>\n              <td><code>preferred_granularity</code></td>\n              <td><code>uint16_t</code></td>\n              <td><span class=\"pill-badge hl-cyan\">2 B</span></td>\n              <td><code>0x00C..0x00D</code></td>\n              <td>Requested sizing class (512 B, 4 KiB, or 16 KiB).</td>\n            </tr>\n            <tr>\n              <td><code>extent_count</code> / <code>generation</code></td>\n              <td><code>uint16_t</code> / <code>uint32_t</code></td>\n              <td><span class=\"pill-badge hl-cyan\">6 B</span></td>\n              <td><code>0x00E..0x013</code></td>\n              <td>Primary extent count ($0 \\dots 16$) & stale handle validation generation.</td>\n            </tr>\n            <tr>\n              <td><code>size</code> (Logical File Size)</td>\n              <td><code>uint64_t</code></td>\n              <td><span class=\"pill-badge hl-green\">8 B</span></td>\n              <td><code>0x014..0x01B</code></td>\n              <td>Exact logical byte size of the file ($0 \\dots 2^{64}-1$).</td>\n            </tr>\n            <tr>\n              <td><code>parent_id</code></td>\n              <td><code>uint64_t</code></td>\n              <td><span class=\"pill-badge hl-green\">8 B</span></td>\n              <td><code>0x01C..0x023</code></td>\n              <td>Compound Object ID of parent directory <code>(zone &lt;&lt; 32) | slot</code>.</td>\n            </tr>\n            <tr>\n              <td><code>extent_overflow_id</code></td>\n              <td><code>uint64_t</code></td>\n              <td><span class=\"pill-badge hl-green\">8 B</span></td>\n              <td><code>0x024..0x02B</code></td>\n              <td>Pointer to chained indirect extent page (if extents &gt; 16).</td>\n            </tr>\n            <tr>\n              <td><code>xattr_page_id</code></td>\n              <td><code>uint64_t</code></td>\n              <td><span class=\"pill-badge hl-green\">8 B</span></td>\n              <td><code>0x02C..0x033</code></td>\n              <td>Pointer to dedicated 4KB Extended Attributes page (or 0).</td>\n            </tr>\n            <tr>\n              <td><code>mtime</code> / <code>atime</code> / <code>ctime</code></td>\n              <td><code>uint32_t[3]</code></td>\n              <td><span class=\"pill-badge hl-cyan\">12 B</span></td>\n              <td><code>0x034..0x03F</code></td>\n              <td>POSIX timestamps: Modified, Accessed, Created (Unix Epoch seconds).</td>\n            </tr>\n            <tr>\n              <td><strong>UNION PAYLOAD BODY</strong></td>\n              <td><code>extents[16]</code> / <code>inline[384]</code></td>\n              <td><span class=\"pill-badge hl-gold\">448 B</span></td>\n              <td><code>0x040..0x1FF</code></td>\n              <td><strong>Dual Mode:</strong> 16 Extent Descriptors ($16 \\times 28\\text{ B}$) OR Tier-0 Inline Data.</td>\n            </tr>\n          </tbody>\n        </table>\n      </div>\n    </div>\n  ",
    "id": 33
  },
  {
    "chapter": "Chapter 3: Free Space & Z-Nodes",
    "zone": "waterfall",
    "zoneName": "Zone 02: Waterfall",
    "title": "Deep Dive: Extent Descriptor Struct (ufs_extent_disk_t)",
    "subtitle": "28-Byte Mapping Descriptor Decoupling Logical Bytes from Physical Runs",
    "badge": "STRUCT ANATOMY",
    "quote": "Each 28-byte extent descriptor represents a continuous physical byte span with zero intermediate pointer blocks.",
    "content": "\n    <div class=\"undertale-box\">\n      <div class=\"box-header hl-cyan\"><span class=\"pixel-heart\"></span> ON-DISK STRUCT: <code>ufs_extent_disk_t</code> (28 Bytes Packed)</div>\n      <div class=\"matrix-table-wrapper\">\n        <table class=\"pixel-table text-xs\">\n          <thead>\n            <tr>\n              <th>Field Name</th>\n              <th>Type</th>\n              <th>Size</th>\n              <th>Offset</th>\n              <th>Mapping Function & Value Range</th>\n            </tr>\n          </thead>\n          <tbody>\n            <tr>\n              <td><code>logical_start</code></td>\n              <td><code>uint64_t</code></td>\n              <td><span class=\"pill-badge hl-yellow\">8 B</span></td>\n              <td><code>0x00..0x07</code></td>\n              <td>File logical stream offset where this extent begins (e.g. <code>0</code>, <code>4,096</code>, <code>20,480</code>).</td>\n            </tr>\n            <tr>\n              <td><code>logical_length</code></td>\n              <td><code>uint64_t</code></td>\n              <td><span class=\"pill-badge hl-yellow\">8 B</span></td>\n              <td><code>0x08..0x0F</code></td>\n              <td>Logical byte span covered by this extent. Can be expanded during slack reuse!</td>\n            </tr>\n            <tr>\n              <td><code>zone_id</code></td>\n              <td><code>uint16_t</code></td>\n              <td><span class=\"pill-badge hl-yellow\">2 B</span></td>\n              <td><code>0x10..0x11</code></td>\n              <td>Target physical zone index where raw units reside ($0 \\dots 31$).</td>\n            </tr>\n            <tr>\n              <td><code>granularity</code></td>\n              <td><code>uint16_t</code></td>\n              <td><span class=\"pill-badge hl-yellow\">2 B</span></td>\n              <td><code>0x12..0x13</code></td>\n              <td>Allocation tier (512B / 4KB / 16KB) or <code>UFS_FLAG_COMPRESSED_LZ4</code> (0x8000).</td>\n            </tr>\n            <tr>\n              <td><code>physical_unit</code></td>\n              <td><code>uint32_t</code></td>\n              <td><span class=\"pill-badge hl-yellow\">4 B</span></td>\n              <td><code>0x14..0x17</code></td>\n              <td>Starting 512-byte physical unit offset inside <code>zone_id</code>.</td>\n            </tr>\n            <tr>\n              <td><code>physical_units</code></td>\n              <td><code>uint32_t</code></td>\n              <td><span class=\"pill-badge hl-yellow\">4 B</span></td>\n              <td><code>0x18..0x1B</code></td>\n              <td>Contiguous count of 512B physical units allocated on disk.</td>\n            </tr>\n          </tbody>\n        </table>\n      </div>\n    </div>\n    <div class=\"undertale-grid-2 mt-2\">\n      <div class=\"battle-card cyan-theme\">\n        <div class=\"card-title hl-cyan\">📐 O(1) TRANSLATION FORMULA</div>\n        <p class=\"text-xs\"><code>Disk_Offset = Zone_Base(zone_id) + (physical_unit * 512) + (file_offset - logical_start)</code></p>\n        <p class=\"text-xs text-muted mt-1\">* Direct pointer arithmetic without traversing block tables.</p>\n      </div>\n      <div class=\"battle-card orange-theme\">\n        <div class=\"card-title hl-orange\">🗜️ LZ4 COMPRESSION DECOUPLING</div>\n        <p class=\"text-xs\">Decouples <code>logical_length</code> (4,096 B) from <code>physical_units</code> (1 unit = 512 B) for up to 87.5% flash density.</p>\n      </div>\n    </div>\n  ",
    "id": 34
  },
  {
    "chapter": "Chapter 3: Free Space & Z-Nodes",
    "zone": "waterfall",
    "zoneName": "Zone 02: Waterfall",
    "title": "The File Numbers Limit & Dynamic Cross-Zone Scaling",
    "subtitle": "Overcoming Inode Exhaustion with Compound 64-Bit IDs and Zone Spillover",
    "badge": "SCALING ENGINE",
    "quote": "Fixed inode tables cause premature out-of-space errors. AuraFS uses localized tables with dynamic cross-zone spillover.",
    "content": "\n    <div class=\"undertale-grid-2\">\n      <div class=\"battle-card red-theme\">\n        <div class=\"card-title hl-red\">⚠️ THE CLASSICAL INODE BOTTLENECK</div>\n        <p class=\"text-xs\">\n          In traditional filesystems (Unix / ext2), a fixed global inode count is formatted at creation time.\n        </p>\n        <ul class=\"pixel-list text-xs mt-1\">\n          <li><strong>Inode Starvation:</strong> Creating thousands of small files exhausts inodes (<code>ENOSPC</code>) even when gigabytes of data space remain.</li>\n          <li><strong>Rigid Sizing:</strong> Inode tables cannot grow or adapt to dynamic workloads.</li>\n        </ul>\n      </div>\n      <div class=\"battle-card green-theme\">\n        <div class=\"card-title hl-green\">★ AURAFS 4-PART SOLUTION</div>\n        <ul class=\"pixel-list text-xs\">\n          <li><strong>1. Local 32-Slot Tables:</strong> Each zone reserves 32 compact Z-Node slots (4 pages) for peak locality.</li>\n          <li><strong>2. Dynamic Zone Spillover:</strong> When a zone's 32 slots fill, <code>object_znode_alloc()</code> automatically balances into adjacent zones.</li>\n          <li><strong>3. Compound 64-Bit Object IDs:</strong> <code>(zone_id &lt;&lt; 32) | slot_id</code> allows scaling to billions of objects.</li>\n          <li><strong>4. Atomic Slot Recycling:</strong> <code>free_znode()</code> immediately returns deleted slots to the zone pool.</li>\n        </ul>\n      </div>\n    </div>\n    <div class=\"undertale-box mt-2\">\n      <div class=\"box-header hl-yellow\">C ALLOCATION ENGINE: <code>object_znode_alloc()</code> WORKFLOW</div>\n      <div class=\"ascii-block text-xs\">\nRequest New File (Parent Zone 2)\n       │\n       ▼\nCheck Zone 2 (Slots 1..32) ──► Slot Available? ──► [YES] ──► Allocate in Home Zone 2 ★\n       │\n      [NO] (Zone 2 Full: znode_used == 32)\n       │\n       ▼\nQuery Global Heatmap ➔ Scan (Zone 2 + i) % 32 ──► Allocate in Zone 3 ➔ Object ID: (3 &lt;&lt; 32) | 1\n      </div>\n      <p class=\"text-xs hl-cyan text-center mt-1\">\n        * Zero global inode bottlenecks: Files scale dynamically across all zones while maintaining 100% address resolution speed.\n      </p>\n    </div>\n  ",
    "id": 35
  },
  {
    "id": 36,
    "chapter": "Chapter 3: Free Space & Z-Nodes",
    "zone": "waterfall",
    "zoneName": "Zone 02: Waterfall",
    "title": "Two Sides of the Same Coin",
    "subtitle": "Free-Space Discovery & Z-Node Extents in Harmony",
    "quote": "The free-space problem and the metadata problem are two sides of the same coin.",
    "content": "\n      <div class=\"undertale-grid-2\">\n        <div class=\"battle-card cyan-theme\">\n          <div class=\"card-title\">ZONE MAP SAYS</div>\n          <div class=\"ascii-block text-xs\">\n\"Here is where physical space\n exists on disk, and here is how\n contiguous that space is.\"\n          </div>\n        </div>\n        <div class=\"battle-card yellow-theme\">\n          <div class=\"card-title\">Z-NODE EXTENT RECORDS</div>\n          <div class=\"ascii-block text-xs\">\n\"Here are the exact physical runs\n that were selected and assigned\n to represent this logical file.\"\n          </div>\n        </div>\n      </div>\n      <div class=\"undertale-box mt-3\">\n        <div class=\"box-header\"><span class=\"pixel-star\">★</span> UNIFIED BEHAVIOR</div>\n        <ul class=\"pixel-list text-xs\">\n          <li><strong>Clean Disk:</strong> Allocator finds 1 contiguous run ➔ Z-Node records <strong>1 Extent</strong>.</li>\n          <li><strong>Fragmented Disk:</strong> Allocator gathers available runs ➔ Z-Node records <strong>Multiple Extents</strong>.</li>\n          <li><strong>Result:</strong> Adapts to physical fragmentation without altering the application's logical file stream.</li>\n        </ul>\n      </div>\n    "
  },
  {
    "chapter": "Comparison: Free Space & Metadata",
    "zone": "blizzard",
    "zoneName": "Frostfire: FAT32 vs AuraFS",
    "title": "FAT32 vs. AuraFS: Free Space & Metadata",
    "subtitle": "Linked Cluster Chains vs. Local Bitmaps & Extents",
    "content": "\n    <div class=\"undertale-grid-2\">\n      <div class=\"battle-card cyan-theme\">\n        <div class=\"card-title hl-cyan\">❄️ FAT32 FREE SPACE & MAPPING</div>\n        <div class=\"ascii-block text-xs\">\nFAT Table:\nCluster 10 ➔ 11 ➔ 12 ➔ 45 ➔ 0x0FFFFFFF (EOC)\nFree Cluster = 0x00000000\n        </div>\n        <ul class=\"pixel-list text-xs mt-2\">\n          <li><strong class=\"hl-red\">No Bitmap:</strong> Finding free space requires scanning 32-bit FAT entries for zeroes.</li>\n          <li><strong class=\"hl-red\">No Inodes / Extents:</strong> Files are chains of pointers. Seeking to offset 1 GB requires traversing thousands of FAT entries!</li>\n        </ul>\n      </div>\n      <div class=\"battle-card orange-theme\">\n        <div class=\"card-title hl-orange\">🔥 AURAFS FREE SPACE & Z-NODES</div>\n        <div class=\"ascii-block text-xs\">\nZone Bitmap:  000000001111 (512B resolution)\nZone Summary: largest_free_run = 8 units\nZ-Node:       Extent (Start=5000, Len=32)\n        </div>\n        <ul class=\"pixel-list text-xs mt-2\">\n          <li><strong class=\"hl-green\">Bitmaps + Run Summaries:</strong> Instant insight into fragmentation & contiguity.</li>\n          <li><strong class=\"hl-green\">Extent Mapping:</strong> 1 extent represents huge contiguous byte spans with O(1) direct address arithmetic.</li>\n        </ul>\n      </div>\n    </div>\n  ",
    "id": 37
  },
  {
    "id": 38,
    "chapter": "Chapter 4: Allocation & Granularity",
    "zone": "hotland",
    "zoneName": "Zone 03: Hotland",
    "title": "What Does Allocation Mean?",
    "subtitle": "Deciding Which Physical Space to Give to a File",
    "quote": "Once the filesystem knows where physical space is available, how do we decide what physical space to give to a file?",
    "content": "\n  <div class=\"undertale-box\">\n    <div class=\"box-header\"><span class=\"pixel-heart\"></span> THE ALLOCATOR'S FIVE CORE DECISIONS</div>\n    <ul class=\"pixel-list text-sm\">\n      <li><span class=\"hl-cyan\">1. Space Sizing:</span> How much physical space to allocate?</li>\n      <li><span class=\"hl-yellow\">2. Granularity Selection:</span> Which allocation granularity to use (512B, 4KiB, or 16KiB)?</li>\n      <li><span class=\"hl-green\">3. Contiguity Preference:</span> Whether to keep the file contiguous in one region?</li>\n      <li><span class=\"hl-orange\">4. Multi-Extent Trigger:</span> Whether new extents are necessary due to fragmentation?</li>\n      <li><span class=\"hl-purple\">5. Growth Management:</span> How to handle subsequent file growth and slack reuse?</li>\n    </ul>\n  </div>\n  <div class=\"undertale-box mt-2\">\n    <div class=\"box-header hl-cyan\">C ALLOCATOR ENTRY POINT (<code>UserFS.c</code>)</div>\n    <pre class=\"ascii-block text-xs\">\n/* UserFS.c: Main allocation driver called before writing file payload */\nstatic int ensure_capacity(uint64_t object_id, znode_disk_t *zn, uint64_t needed_size);\n    </pre>\n    <p class=\"text-xs text-muted mt-1\">\n      * Evaluates growth: reuses extent slack, tries adjacent extension, or queries the multi-extent allocator.\n    </p>\n  </div>\n"
  },
  {
    "id": 39,
    "chapter": "Chapter 4: Allocation & Granularity",
    "zone": "hotland",
    "zoneName": "Zone 03: Hotland",
    "title": "Standard Allocation Approaches",
    "subtitle": "Contiguous vs. Linked vs. Extents",
    "content": "\n      <div class=\"grid-3-col\">\n        <div class=\"battle-card cyan-theme\">\n          <div class=\"card-title\">CONTIGUOUS</div>\n          <div class=\"ascii-block text-xs\">\nFile A\n████████████████\n          </div>\n          <p class=\"text-xs mt-2\">Entire file occupies one continuous physical region.</p>\n        </div>\n        <div class=\"battle-card yellow-theme\">\n          <div class=\"card-title\">LINKED / SCATTERED</div>\n          <div class=\"ascii-block text-xs\">\nFile A\n██   ████   ██\n          </div>\n          <p class=\"text-xs mt-2\">Parts of the file are stored scattered across blocks.</p>\n        </div>\n        <div class=\"battle-card green-theme\">\n          <div class=\"card-title\">EXTENT-BASED</div>\n          <div class=\"ascii-block text-xs\">\nFile A\n├── Extent 1\n├── Extent 2\n└── Extent 3\n          </div>\n          <p class=\"text-xs mt-2\">Each extent represents one contiguous physical region.</p>\n        </div>\n      </div>\n    "
  },
  {
    "id": 40,
    "chapter": "Chapter 4: Allocation & Granularity",
    "zone": "hotland",
    "zoneName": "Zone 03: Hotland",
    "title": "Contiguous Allocation",
    "subtitle": "Peak Locality vs. External Fragmentation",
    "content": "\n      <div class=\"undertale-box\">\n        <div class=\"box-header\">10 BLOCKS REQUEST EXAMPLE</div>\n        <div class=\"ascii-block text-xs\">\nFREE BLOCKS: FREE FREE FREE FREE FREE FREE FREE FREE FREE FREE\nFILE BLOCKS: ████████████████████ (One Continuous Run)\n        </div>\n      </div>\n      <div class=\"undertale-grid-2 mt-3\">\n        <div class=\"battle-card green-theme\">\n          <div class=\"card-title\">ADVANTAGES ✔</div>\n          <ul class=\"pixel-list text-xs\">\n            <li>Excellent physical locality</li>\n            <li>Maximal sequential throughput</li>\n            <li>Extremely simple metadata mapping</li>\n            <li>Small metadata footprint</li>\n          </ul>\n        </div>\n        <div class=\"battle-card red-theme\">\n          <div class=\"card-title\">THE PROBLEM ❌</div>\n          <p class=\"text-xs hl-red\">External Fragmentation:</p>\n          <p class=\"text-xs text-muted\">External fragmentation can prevent large contiguous allocations even when plenty of total free space exists on the drive.</p>\n        </div>\n      </div>\n    "
  },
  {
    "id": 41,
    "chapter": "Chapter 4: Allocation & Granularity",
    "zone": "hotland",
    "zoneName": "Zone 03: Hotland",
    "title": "Scattered Allocation",
    "subtitle": "Storage Flexibility at the Cost of Locality",
    "content": "\n      <div class=\"undertale-box\">\n        <div class=\"box-header\">SCATTERED PHYSICAL REGIONS</div>\n        <div class=\"ascii-block text-xs\">\nFile A:  ██     ████    ██  (Divided across isolated physical holes)\n        </div>\n      </div>\n      <div class=\"undertale-grid-2 mt-3\">\n        <div class=\"battle-card green-theme\">\n          <div class=\"card-title\">ADVANTAGES ✔</div>\n          <ul class=\"pixel-list text-xs\">\n            <li>File growth is easy into any free hole</li>\n            <li>External fragmentation does not block writes</li>\n            <li>No need for large single continuous spans</li>\n          </ul>\n        </div>\n        <div class=\"battle-card orange-theme\">\n          <div class=\"card-title\">DISADVANTAGES ❌</div>\n          <ul class=\"pixel-list text-xs\">\n            <li>Excessive physical disk seek jumps</li>\n            <li>Larger mapping metadata structures</li>\n            <li>Degraded sequential read throughput</li>\n          </ul>\n        </div>\n      </div>\n    "
  },
  {
    "id": 42,
    "chapter": "Chapter 4: Allocation & Granularity",
    "zone": "hotland",
    "zoneName": "Zone 03: Hotland",
    "title": "Our Allocation Principle",
    "subtitle": "Contiguous-First Fallback + Immediate Allocation",
    "content": "\n  <div class=\"undertale-box text-center\">\n    <div class=\"box-header\"><span class=\"pixel-star-large\">★</span> DUAL ALLOCATION OBJECTIVE</div>\n    <div class=\"hl-yellow text-lg py-1\">\n      CONTIGUOUS WHEN POSSIBLE &nbsp;+&nbsp; FRAGMENTED WHEN NECESSARY\n    </div>\n  </div>\n  <div class=\"undertale-grid-2 mt-2\">\n    <div class=\"battle-card green-theme\">\n      <div class=\"card-title hl-green\">⚡ WHY IMMEDIATE ALLOCATION?</div>\n      <ul class=\"pixel-list text-xs\">\n        <li><strong>1. Embedded-Ready:</strong> Tiny RAM footprint (&lt; 64 KB) with no multi-megabyte kernel page cache required.</li>\n        <li><strong>2. Deterministic Latency:</strong> Synchronous allocation avoids random background flush stalls in real-time systems.</li>\n        <li><strong>3. Instant ENOSPC & Durability:</strong> Out-of-space is caught immediately during write; data is journal-safe on power cuts.</li>\n      </ul>\n    </div>\n    <div class=\"battle-card cyan-theme\">\n      <div class=\"card-title hl-cyan\">C ZONE ALLOCATION FUNCTIONS</div>\n      <pre class=\"ascii-block text-xs\">\n/* 1. Contiguous-First in home zone */\nchoose_zone_for_allocation(...);\n\n/* 2. Fallback to largest free runs */\nchoose_zone_for_partial_allocation(...);\n      </pre>\n      <p class=\"text-xs text-muted mt-1\">\n        * Immediate synchronous bitmap updates + home zone locality guarantee.\n      </p>\n    </div>\n  </div>\n"
  },
  {
    "id": 43,
    "chapter": "Chapter 4: Allocation & Granularity",
    "zone": "hotland",
    "zoneName": "Zone 03: Hotland",
    "title": "First Allocation: Contiguous Case",
    "subtitle": "Optimal Single-Extent Path",
    "content": "\n      <div class=\"undertale-box\">\n        <div class=\"box-header\">15-BLOCK CONTIGUOUS REQUEST</div>\n        <p class=\"text-xs\">Suppose a file needs 15 blocks. If 15 contiguous blocks are available:</p>\n        <div class=\"ascii-block text-xs mt-2\">\nPHYSICAL RUN: ███████████████ (15 contiguous blocks)\nEXTENT:       Extent 1 (Length = 15 blocks)\n        </div>\n      </div>\n      <div class=\"undertale-box mt-3\">\n        <div class=\"box-header hl-green\">RESULTING MAPPING</div>\n        <div class=\"ascii-block text-xs text-center\">\nONE FILE ➔ ONE EXTENT ➔ ONE CONTIGUOUS REGION\n        </div>\n      </div>\n    "
  },
  {
    "id": 44,
    "chapter": "Chapter 4: Allocation & Granularity",
    "zone": "hotland",
    "zoneName": "Zone 03: Hotland",
    "title": "First Allocation: Fragmented Case",
    "subtitle": "Multi-Extent Fallback Path",
    "content": "\n      <div class=\"undertale-box\">\n        <div class=\"box-header\">15-BLOCK REQUEST OVER FRAGMENTED RUNS</div>\n        <p class=\"text-xs\">Suppose the file needs 15 blocks, but available runs are: <strong>3 blocks, 8 blocks, 4 blocks</strong> (No single 15-block run exists).</p>\n        <div class=\"ascii-block text-xs mt-2\">\nExtent 1 ➔ 3 blocks\nExtent 2 ➔ 8 blocks\nExtent 3 ➔ 4 blocks\nTotal: 3 + 8 + 4 = 15 blocks\n        </div>\n      </div>\n      <div class=\"undertale-box mt-3\">\n        <div class=\"box-header hl-yellow\">RESULTING MAPPING</div>\n        <p class=\"hl-green text-center text-xs\">All three extents belong to the SAME logical file inside one Z-Node with zero user disruption.</p>\n      </div>\n    "
  },
  {
    "id": 45,
    "chapter": "Chapter 4: Allocation & Granularity",
    "zone": "hotland",
    "zoneName": "Zone 03: Hotland",
    "title": "What Is an Extent?",
    "subtitle": "Representing Allocated File Storage Spans",
    "quote": "An extent represents a contiguous physical region belonging to a file.",
    "content": "\n  <div class=\"undertale-grid-2\">\n    <div class=\"battle-card cyan-theme\">\n      <div class=\"card-title\">EXTENT DESCRIPTOR</div>\n      <div class=\"ascii-block text-xs\">\nExtent:\n  Start  = 500\n  Length = 20 (Physical units)\n      </div>\n      <p class=\"text-xs mt-2\">Describes 20 consecutive physical units starting at unit 500.</p>\n    </div>\n    <div class=\"battle-card yellow-theme\">\n      <div class=\"card-title\">IMPORTANT DISTINCTION</div>\n      <ul class=\"pixel-list text-xs\">\n        <li>The extent describes <strong>allocated file space</strong>.</li>\n        <li>It does <strong>NOT manage free space</strong>.</li>\n        <li>Free space is managed exclusively by the bitmap & zone summary.</li>\n      </ul>\n    </div>\n  </div>\n  <div class=\"undertale-box mt-2\">\n    <div class=\"box-header hl-cyan\">C EXTENT STRUCT DEFINITION (<code>UserFS.c</code>)</div>\n    <pre class=\"ascii-block text-xs\">\ntypedef struct __attribute__((packed)) {\n    uint64_t logical_start;   /* Byte offset where extent starts in file */\n    uint64_t logical_length;  /* Actual logical bytes stored in extent */\n    uint16_t zone_id;         /* Physical zone holding these blocks */\n    uint16_t granularity;     /* Size class: 512, 4096, or 16384 bytes */\n    uint32_t physical_unit;   /* Starting 512B unit index in zone */\n    uint32_t physical_units;  /* Total physical units allocated */\n} ufs_extent_disk_t;          /* Exactly 28 bytes packed on disk */\n    </pre>\n    <p class=\"text-xs text-muted mt-1\">\n      * Stored as an inline array of 16 extents inside each Z-Node (<code>extents[16]</code>).\n    </p>\n  </div>\n"
  },
  {
    "id": 46,
    "chapter": "Chapter 4: Allocation & Granularity",
    "zone": "hotland",
    "zoneName": "Zone 03: Hotland",
    "title": "Multiple Extents, One File",
    "subtitle": "Unifying Physical Partitions into Single Logical Entity",
    "content": "\n      <div class=\"undertale-box\">\n        <div class=\"box-header\">Z-NODE EXTENT BINDING</div>\n        <div class=\"ascii-block text-xs\">\n                Z-Node\n                   │\n        ┌──────────┼──────────┐\n        ▼          ▼          ▼\n     Extent 1   Extent 2   Extent 3\n     3 blocks   8 blocks   4 blocks\n        </div>\n      </div>\n      <div class=\"undertale-box mt-3\">\n        <div class=\"box-header hl-green\">LOGICAL SYNTHESIS</div>\n        <p class=\"text-xs\">The physical regions are separated, but the Z-Node associates all of them with one file:</p>\n        <div class=\"ascii-block text-xs text-center hl-yellow mt-1\">\nExtent 1 + Extent 2 + Extent 3 = ONE LOGICAL FILE\n        </div>\n      </div>\n    "
  },
  {
    "id": 47,
    "chapter": "Chapter 4: Allocation & Granularity",
    "zone": "hotland",
    "zoneName": "Zone 03: Hotland",
    "title": "Why Multiple Physical Granularities?",
    "subtitle": "Combating Internal Fragmentation",
    "content": "\n      <div class=\"undertale-grid-2\">\n        <div class=\"battle-card red-theme\">\n          <div class=\"card-title\">SINGLE FIXED SIZE (e.g. 4 KiB)</div>\n          <div class=\"ascii-block text-xs\">\n100-byte file\n     ↓\n4 KiB allocation:\n┌──────────┬────────────────────────┐\n│ 100 B    │ 3996 B Unused (97.5%)  │\n└──────────┴────────────────────────┘\n          </div>\n          <p class=\"text-xs mt-2 text-muted\">Massive waste of physical drive capacity for small files.</p>\n        </div>\n        <div class=\"battle-card green-theme\">\n          <div class=\"card-title\">VARIABLE GRANULARITIES</div>\n          <div class=\"ascii-block text-xs\">\n100-byte file\n     ↓\n512 B allocation:\n┌──────────┬────────────────────────┐\n│ 100 B    │ 412 B Unused           │\n└──────────┴────────────────────────┘\n          </div>\n          <p class=\"text-xs mt-2 hl-green\">Drastically reduces wasted slack while preserving efficiency.</p>\n        </div>\n      </div>\n    "
  },
  {
    "id": 48,
    "chapter": "Chapter 4: Allocation & Granularity",
    "zone": "hotland",
    "zoneName": "Zone 03: Hotland",
    "title": "Our Allocation Granularities",
    "subtitle": "Three Right-Sized Physical Unit Classes",
    "content": "\n  <div class=\"matrix-table-wrapper\">\n    <table class=\"pixel-table text-sm\">\n      <thead>\n        <tr>\n          <th>File Request Size</th>\n          <th>Granularity Tier</th>\n          <th>Physical Allocation Size</th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr><td><strong>&le; 512 B</strong></td><td><strong class=\"hl-cyan\">SMALL</strong></td><td><strong>512 B (1 unit)</strong></td></tr>\n        <tr><td><strong>&le; 4 KiB</strong></td><td><strong class=\"hl-yellow\">MEDIUM</strong></td><td><strong>4 KiB (8 units)</strong></td></tr>\n        <tr><td><strong>&gt; 4 KiB</strong></td><td><strong class=\"hl-green\">LARGE</strong></td><td><strong>16 KiB (32 units)</strong></td></tr>\n      </tbody>\n    </table>\n  </div>\n  <div class=\"undertale-box mt-2\">\n    <div class=\"box-header hl-green\">C GRANULARITY LOGIC (<code>UserFS.c</code>)</div>\n    <pre class=\"ascii-block text-xs\">\n#define UFS_UNIT        512u   /* Base accounting block */\n#define UFS_SMALL_GRAN  512u   /* Small files <= 512 B */\n#define UFS_MEDIUM_GRAN 4096u  /* Medium files <= 4 KiB */\n#define UFS_LARGE_GRAN  16384u /* Large files > 4 KiB */\n\nstatic uint16_t choose_granularity(uint64_t size) {\n    if (size <= UFS_SMALL_GRAN)  return UFS_SMALL_GRAN;\n    if (size <= UFS_MEDIUM_GRAN) return UFS_MEDIUM_GRAN;\n    return UFS_LARGE_GRAN;\n}\n    </pre>\n    <p class=\"text-xs text-muted mt-1\">\n      * Dynamically maps payload size thresholds to physical unit multipliers; cuts internal slack.\n    </p>\n  </div>\n"
  },
  {
    "id": 49,
    "chapter": "Chapter 4: Allocation & Granularity",
    "zone": "core",
    "zoneName": "Zone 04: The Core",
    "title": "Granularity Can Change as a File Grows",
    "subtitle": "Dynamic Tier Promotion Over Lifecycle",
    "content": "\n      <div class=\"undertale-box\">\n        <div class=\"box-header\"><span class=\"pixel-heart\"></span> LIFETIME GRANULARITY PROMOTION</div>\n        <p class=\"text-xs\">A file does not remain tied to one allocation size for its entire lifetime:</p>\n        <div class=\"ascii-block text-xs mt-2\">\nFile Growth Over Time:\n├── Earlier allocation (Initial write) ➔ Medium Granularity (4 KiB)\n└── Later allocation (Appends)         ➔ Large Granularity (16 KiB)\n        </div>\n      </div>\n      <p class=\"hl-green mt-3 text-center text-xs\">Small files start lightweight and seamlessly scale into high-performance large blocks as storage demands rise.</p>\n    "
  },
  {
    "id": 50,
    "chapter": "Chapter 4: Allocation & Granularity",
    "zone": "core",
    "zoneName": "Zone 04: The Core",
    "title": "The 512-B Physical Accounting Unit",
    "subtitle": "Common Denominator for All Granularities",
    "content": "\n  <div class=\"undertale-grid-2\">\n    <div class=\"undertale-box\">\n      <div class=\"box-header\">UNIT CONVERSION FORMULA</div>\n      <div class=\"ascii-block text-xs\">\n512 B  = 1 unit\n4 KiB  = 8 units\n16 KiB = 32 units\n      </div>\n      <p class=\"text-xs mt-2 text-muted\">The physical disk and bitmap count strictly in 512B units.</p>\n    </div>\n    <div class=\"undertale-box\">\n      <div class=\"box-header hl-yellow\">C UNIT ALIGNMENT (<code>UserFS.c</code>)</div>\n      <pre class=\"ascii-block text-xs\">\n#define UFS_ALIGN_UP(x, a) (((x) + ((a) - 1u)) / (a) * (a))\n\nstatic uint32_t round_units_to_gran(uint64_t bytes, uint16_t gran) {\n    uint64_t aligned = UFS_ALIGN_UP(bytes, (uint64_t)gran);\n    return (uint32_t)(aligned / UFS_UNIT);\n}\n      </pre>\n      <p class=\"text-xs text-muted mt-1\">\n        * Converts byte requests into 512B physical bitmap units based on tier.\n      </p>\n    </div>\n  </div>\n"
  },
  {
    "id": 51,
    "chapter": "Chapter 4: Allocation & Granularity",
    "zone": "core",
    "zoneName": "Zone 04: The Core",
    "title": "Logical Size vs Physical Allocation",
    "subtitle": "Understanding Internal Slack",
    "content": "\n      <div class=\"undertale-box\">\n        <div class=\"box-header\">LOGICAL DATA vs. PHYSICAL CAPACITY</div>\n        <p class=\"text-xs\">A file can possess less logical data than its allocated physical extent:</p>\n        <div class=\"ascii-block text-xs mt-2\">\nLogical Size     = 1 KiB\nPhysical Extent  = 4 KiB\n┌──────────────────────────┬──────────────────────────────────────────┐\n│ 1 KiB Data               │ 3 KiB Unused Internal Slack              │\n└──────────────────────────┴──────────────────────────────────────────┘\n        </div>\n      </div>\n      <p class=\"hl-yellow text-center text-xs mt-2\">The unused portion is internal slack available inside the already allocated extent.</p>\n    "
  },
  {
    "id": 52,
    "chapter": "Chapter 4: Allocation & Granularity",
    "zone": "core",
    "zoneName": "Zone 04: The Core",
    "title": "Reusing Existing Slack",
    "subtitle": "Zero-Allocation File Expansion",
    "content": "\n  <div class=\"undertale-box\">\n    <div class=\"box-header\">GROWTH WITHOUT NEW DISK ALLOCATION</div>\n    <p class=\"text-xs\">When a file grows from 1 KiB to 2 KiB inside a 4 KiB physical extent:</p>\n    <div class=\"ascii-block text-xs mt-2\">\n1 KiB Existing Data  +  1 KiB Reused Slack  =  2 KiB Total\n    </div>\n  </div>\n  <div class=\"undertale-box mt-2\">\n    <div class=\"box-header hl-green\">C SLACK REUSE IMPLEMENTATION (<code>UserFS.c</code>)</div>\n    <pre class=\"ascii-block text-xs\">\n/* UserFS.c: Expands logical_length inside existing physical capacity */\nstatic int consume_last_extent_slack(znode_disk_t *zn, uint64_t needed_size) {\n    ufs_extent_disk_t *ex = &zn->extents[zn->extent_count - 1];\n    uint64_t cap = (uint64_t)ex->physical_units * UFS_UNIT;\n    if (cap <= ex->logical_length) return 0;\n    uint64_t slack = cap - ex->logical_length;\n    uint64_t consume = (needed_size - zn->size) < slack ? (needed_size - zn->size) : slack;\n    ex->logical_length += consume;\n    zn->size += consume;\n    return zn->size >= needed_size;\n}\n    </pre>\n    <p class=\"text-xs text-muted mt-1\">\n      * Zero disk writes, zero new extents, and zero bitmap toggles when growth fits in slack.\n    </p>\n  </div>\n"
  },
  {
    "id": 53,
    "chapter": "Chapter 4: Allocation & Granularity",
    "zone": "core",
    "zoneName": "Zone 04: The Core",
    "title": "Example: 18 KiB File",
    "subtitle": "Allocation in 16 KiB Granules & Granularity Limitation",
    "content": "\n      <div class=\"undertale-box\">\n        <div class=\"box-header hl-orange\">18 KiB STORAGE ALLOCATION BREAKDOWN</div>\n        <div class=\"ascii-block text-xs\">\nFile Size:     18 KiB\nSelected Tier: Large Granularity (16 KiB)\n\nAllocation:\n├── Extent 1 ➔ 16 KiB (100% full: 16 KiB data)\n└── Extent 2 ➔ 16 KiB (Contains remaining 2 KiB data + 14 KiB slack)\n\nTotal Physical Space Allocated: 32 KiB (2 × 16 KiB granules)\n        </div>\n      </div>\n      <div class=\"battle-card red-theme mt-3\">\n        <div class=\"card-title\">⚠️ SYSTEM LIMITATION: GRANULARITY SLACK</div>\n        <p class=\"text-sm\">\n          The remaining <strong>2 KiB</strong> must still be allocated inside a full <strong>16 KiB granule</strong>.\n        </p>\n        <p class=\"text-xs text-muted mt-1\">\n          Because allocation units follow the file's active large granularity tier (16 KiB), the leftover 2 KiB cannot borrow a 512B or 4KiB unit, resulting in <strong>14 KiB of internal fragmentation</strong>.\n        </p>\n      </div>\n    "
  },
  {
    "id": 54,
    "chapter": "Chapter 4: Allocation & Granularity",
    "zone": "core",
    "zoneName": "Zone 04: The Core",
    "title": "Act 3: Tier 0 — Inline Z-Node Data",
    "subtitle": "Zero-Block Storage for Small Files (&le; 384 Bytes)",
    "content": "\n  <div class=\"undertale-grid-2\">\n    <div class=\"battle-card green-theme\">\n      <div class=\"card-title hl-green\">★ TIER 0: INLINE STORAGE</div>\n      <div class=\"ascii-block text-xs\">\nZ-Node (512 Bytes):\n┌────────────────────────────┐\n│ Header: flags = INLINE     │\n├────────────────────────────┤\n│ INLINE DATA PAYLOAD        │\n│ (Up to 384 Bytes in Z-Node)│\n└────────────────────────────┘\n      </div>\n      <ul class=\"pixel-list text-xs mt-1\">\n        <li><strong>0 Blocks Allocated:</strong> 0% internal slack!</li>\n        <li><strong>0 Seeks:</strong> 1 read fetches metadata + data.</li>\n      </ul>\n    </div>\n    <div class=\"battle-card cyan-theme\">\n      <div class=\"card-title hl-cyan\">SEAMLESS SPILL-OVER</div>\n      <div class=\"ascii-block text-xs\">\nFile grows past 384 B?\n         │\n         ▼\n1. Allocate 4 KiB extent\n2. Copy inline data to extent\n3. Clear INLINE flag & append\n      </div>\n      <p class=\"text-xs text-muted mt-1\">Smoothly scales from embedded bytes to massive multi-extent files.</p>\n    </div>\n  </div>\n"
  },
  {
    "id": 55,
    "chapter": "Chapter 4: Allocation & Granularity",
    "zone": "core",
    "zoneName": "Zone 04: The Core",
    "title": "Act 3: Extended Attributes (xattrs) & MIME Indexing",
    "subtitle": "Extension-Free Content Classification in the Z-Node",
    "content": "\n  <div class=\"undertale-grid-2\">\n    <div class=\"battle-card green-theme\">\n      <div class=\"card-title hl-green\">★ ZERO-PAYLOAD FAST SNIFFING</div>\n      <div class=\"ascii-block text-xs\">\nZ-Node (512 Bytes):\n├── Header + Extents\n└── xattr: user.mime_type = \"application/json\"\n      </div>\n      <ul class=\"pixel-list text-xs mt-1\">\n        <li><strong>0ms Type Discovery:</strong> Instant identification without reading a whole 10 MB payload from disk.</li>\n        <li><strong>Zero I/O Waste:</strong> Web servers and file managers read metadata only.</li>\n      </ul>\n    </div>\n    <div class=\"battle-card yellow-theme\">\n      <div class=\"card-title hl-yellow\">⚡ EXTENSION-FREE FREEDOM</div>\n      <div class=\"ascii-block text-xs\">\nFile: /telemetry_data (No .json extension!)\n└── Z-Node Tag: user.mime_type = application/json\n      </div>\n      <ul class=\"pixel-list text-xs mt-1\">\n        <li><strong>Like Linux ext4 / XFS:</strong> Users are free from stating file extensions when creating files/folders.</li>\n        <li><strong>Arbitrary Key-Value Tags:</strong> Stores sensor IDs, firmware versions, and custom metadata.</li>\n      </ul>\n    </div>\n  </div>\n"
  },
  {
    "id": 56,
    "chapter": "Chapter 4: Allocation & Granularity",
    "zone": "core",
    "zoneName": "Zone 04: The Core",
    "title": "Act 3: Transparent Per-Extent Compression (LZ4)",
    "subtitle": "Sub-Block Level Flash Density & Hardware Lifespan",
    "content": "\n  <div class=\"undertale-grid-2\">\n    <div class=\"battle-card green-theme\">\n      <div class=\"card-title hl-green\">★ 3 CORE BENEFITS FOR AURAFS</div>\n      <ul class=\"pixel-list text-xs\">\n        <li><strong>1. 2x–3x Storage Density:</strong> Compresses 4 KiB text/telemetry logs down to 512B–1024B (87.5% space saved).</li>\n        <li><strong>2. 60% Less Flash Wear:</strong> Writing fewer 512B units directly doubles flash chip hardware lifespan!</li>\n        <li><strong>3. Faster Read Speeds:</strong> Reading small chunks over slow SPI/SDIO buses and decompressing in RAM is faster than raw disk I/O.</li>\n      </ul>\n    </div>\n    <div class=\"battle-card cyan-theme\">\n      <div class=\"card-title hl-cyan\">⚡ WHY NOT .ZIP OR TAR.GZ?</div>\n      <div class=\"ascii-block text-xs\">\nExtent (4KB Logical ➔ 1KB Physical):\n├── Random Seek & Read in 2 microseconds\n└── Zero 50MB archive unzipping into RAM!\n      </div>\n      <p class=\"text-xs text-muted mt-1\">\n        * <strong>AuraFS Fit:</strong> Extent natively separates <code>logical_length</code> from <code>physical_units</code> via <code>UFS_FLAG_COMPRESSED_LZ4</code>.\n      </p>\n    </div>\n  </div>\n"
  },
  {
    "id": 57,
    "chapter": "Chapter 4: Allocation & Granularity",
    "zone": "core",
    "zoneName": "Zone 04: The Core",
    "title": "Act 3: Hardware & Flash Optimizations",
    "subtitle": "64-Bit Bitwise Acceleration & Wear-Leveling Cursors",
    "content": "\n  <div class=\"undertale-grid-2\">\n    <div class=\"battle-card yellow-theme\">\n      <div class=\"card-title hl-yellow\">⚡ 64-BIT WORD BITWISE SCANNER</div>\n      <div class=\"ascii-block text-xs\">\nCast bitmap to uint64_t words:\n- Check 64 units (32 KiB) in 1 instruction!\n- __builtin_ctzll(~word) finds bit in 1 cycle.\n➔ 64x to 512x faster allocation discovery.\n      </div>\n    </div>\n    <div class=\"battle-card orange-theme\">\n      <div class=\"card-title hl-orange\">🔄 ROVING WEAR-LEVELING CURSOR</div>\n      <div class=\"ascii-block text-xs\">\nZone Next-Fit Pointer:\n- Resumes scan from last allocated unit.\n- Circular wrap-around across zone.\n➔ Distributes write cycles evenly across Flash.\n      </div>\n    </div>\n  </div>\n  <div class=\"undertale-box mt-2 text-center text-xs\">\n    <span class=\"hl-green\">Engineered specifically for embedded microcontrollers (STM32) and high-speed flash storage.</span>\n  </div>\n"
  },
  {
    "id": 58,
    "chapter": "Chapter 4: Allocation & Granularity",
    "zone": "core",
    "zoneName": "Zone 04: The Core",
    "title": "The Master 3-Act Allocation Workflow",
    "subtitle": "End-to-End Decision & Growth Flowchart",
    "quote": "Our allocation engine uses Tier-0 inline storage for tiny files, 3 multi-granularity tiers for larger files, and reuses slack & coalesces extents for zero-overhead growth.",
    "content": "\n      <div class=\"undertale-box\">\n        <div class=\"box-header\"><span class=\"pixel-star-large\">★</span> MASTER DECISION PIPELINE</div>\n        <div class=\"ascii-block text-xs\">\n                             INCOMING FILE WRITE\n                                      │\n                    ┌─────────────────┴─────────────────┐\n                    ▼                                   ▼\n          File Size &le; 384 B                    File Size &gt; 384 B\n         [TIER 0: INLINE Z-NODE]                [SELECT MULTI-GRAN TIER]\n         (0 Physical Blocks)                    (512 B / 4 KiB / 16 KiB)\n                                                        │\n                                                        ▼\n                                            Can we reuse extent slack?\n                                                   /          \\\n                                                 YES           NO\n                                                  │             │\n                                                  ▼             ▼\n                                             Expand length  Can tail extend?\n                                                             /         \\\n                                                           YES          NO\n                                                            │            │\n                                                            ▼            ▼\n                                                        Extend+Coalesce New Extent\n        </div>\n      </div>\n  "
  },
  {
    "chapter": "Comparison: Allocation & Granularity",
    "zone": "blizzard",
    "zoneName": "Frostfire: FAT32 vs AuraFS",
    "title": "FAT32 vs. AuraFS: Allocation & Granularity",
    "subtitle": "Rigid Coarse Clusters vs. 4-Tier Zero-Overhead Engine",
    "content": "\n    <div class=\"undertale-grid-2\">\n      <div class=\"battle-card cyan-theme\">\n        <div class=\"card-title hl-cyan\">❄️ FAT32 ALLOCATION</div>\n        <div class=\"ascii-block text-xs\">\n100-byte file on 32 KiB cluster:\n┌──────────┬────────────────────────┐\n│ 100 B    │ 32,668 B Wasted (99.7%)│\n└──────────┴────────────────────────┘\n        </div>\n        <ul class=\"pixel-list text-xs mt-2\">\n          <li><strong class=\"hl-red\">Rigid Fixed Cluster:</strong> Selected at format time (e.g. 4KB, 8KB, 32KB).</li>\n          <li><strong class=\"hl-red\">Severe Slack Waste:</strong> Thousands of small files waste gigabytes of drive storage.</li>\n          <li><strong class=\"hl-red\">No Slack Reuse:</strong> File expansion always allocates additional full clusters.</li>\n        </ul>\n      </div>\n      <div class=\"battle-card orange-theme\">\n        <div class=\"card-title hl-orange\">🔥 ENHANCED AURAFS ALLOCATION</div>\n        <div class=\"ascii-block text-xs\">\n100-byte file: 0 B allocated (Tier-0 Inline)\n5 KiB file: 4 KiB extent + coalesced appends\n        </div>\n        <ul class=\"pixel-list text-xs mt-2\">\n          <li><strong class=\"hl-green\">4 Dynamic Tiers:</strong> Inline (&le;384B), 512B, 4KiB, and 16KiB units.</li>\n          <li><strong class=\"hl-green\">Zero Slack for Small Files:</strong> Embedded inside 512B Z-Node.</li>\n          <li><strong class=\"hl-green\">In-Place Coalescing:</strong> Merges adjacent extents automatically.</li>\n          <li><strong class=\"hl-green\">Flash Wear-Aware:</strong> Next-Fit roving cursor protects flash lifespan.</li>\n        </ul>\n      </div>\n    </div>\n  ",
    "id": 59
  },
  {
    "chapter": "Chapter 5: Directory & Consistency",
    "zone": "barrier",
    "zoneName": "Zone 07: The Barrier",
    "title": "The Anatomy of a Directory",
    "subtitle": "A Directory is Not a Magical Container",
    "quote": "A directory is not a magical container. Under the hood, it is a file with a special type and a simple on-disk structure.",
    "content": "\n      <div class=\"grid-2x2 mb-2\">\n        <div class=\"pill-badge hl-cyan\">DIRECTORY = FILE</div>\n        <div class=\"pill-badge hl-yellow\">64-BYTE SLOTS</div>\n        <div class=\"pill-badge hl-green\">Z-NODE POINTER</div>\n        <div class=\"pill-badge hl-purple\">HOT DIRECTORY CACHE</div>\n      </div>\n      <div class=\"undertale-box\">\n        <div class=\"box-header hl-cyan\">ON-DISK RECORD: <code>dir_disk_t</code> (64 BYTES)</div>\n        <pre class=\"ascii-block text-xs\">\ntypedef struct __attribute__((packed)) {\n    char name[UFS_MAX_NAME + 1]; /* 32 bytes: File or folder name */\n    uint8_t type;                /* UFS_TYPE_FILE (1) or UFS_TYPE_DIR (2) */\n    uint8_t active;              /* 1 = active entry, 0 = free slot */\n    uint16_t reserved;\n    uint64_t object_id;          /* Target Z-Node ID: (zone_id, local_id) */\n    uint32_t generation;         /* Generational tag to prevent stale links */\n} dir_disk_t;                    /* Exactly 64 bytes on disk */\n        </pre>\n        <p class=\"text-xs text-muted mt-1\">\n          * Stored as fixed-size 64-byte records in directory data blocks. 8 entries fit in one 512B block.\n        </p>\n      </div>\n    ",
    "id": 60
  },
  {
    "chapter": "Chapter 5: Directory & Consistency",
    "zone": "barrier",
    "zoneName": "Zone 07: The Barrier",
    "title": "A Directory Is Just a File",
    "subtitle": "Reusing the General File Machinery for Directory Records",
    "content": "\n      <div class=\"undertale-grid-2\">\n        <div class=\"battle-card cyan-theme\">\n          <div class=\"card-title\">REGULAR FILE (<code>UFS_TYPE_FILE</code>)</div>\n          <div class=\"ascii-block text-xs\">\n[Z-Node] ➔ Extents ➔ [Raw User Data]\n(Text, images, binaries, documents)\n          </div>\n          <p class=\"text-xs mt-2\">Stores arbitrary application byte payloads.</p>\n        </div>\n        <div class=\"battle-card yellow-theme\">\n          <div class=\"card-title\">DIRECTORY FILE (<code>UFS_TYPE_DIR</code>)</div>\n          <div class=\"ascii-block text-xs\">\n[Z-Node] ➔ Extents ➔ [Array of dir_disk_t]\n(64-byte structured name records)\n          </div>\n          <p class=\"text-xs mt-2\">Stores an array of fixed-size directory entries.</p>\n        </div>\n      </div>\n      <div class=\"undertale-box mt-3\">\n        <div class=\"box-header hl-green\">WHY THIS MATTERS</div>\n        <p class=\"text-xs\">\n          The filesystem reuses one unified file and extent abstraction: directories grow, allocate physical extents, and use Z-Nodes identically to regular files without redundant machinery.\n        </p>\n      </div>\n    ",
    "id": 61
  },
  {
    "chapter": "Chapter 5: Directory & Consistency",
    "zone": "barrier",
    "zoneName": "Zone 07: The Barrier",
    "title": "Deep Dive: Directory Entry Struct (dir_disk_t)",
    "subtitle": "On-Disk 64-Byte Structured Mapping Container for Hierarchical Paths",
    "badge": "STRUCT ANATOMY",
    "quote": "Each 64-byte entry bridges human-readable path strings directly to 64-bit compound Z-Node object IDs.",
    "content": "\n    <div class=\"undertale-box\">\n      <div class=\"box-header hl-green\"><span class=\"pixel-heart\"></span> ON-DISK STRUCT: <code>dir_disk_t</code> (64 Bytes Packed)</div>\n      <div class=\"matrix-table-wrapper\">\n        <table class=\"pixel-table text-xs\">\n          <thead>\n            <tr>\n              <th>Field Name</th>\n              <th>Type</th>\n              <th>Size</th>\n              <th>Offset</th>\n              <th>Directory Role & Description</th>\n            </tr>\n          </thead>\n          <tbody>\n            <tr>\n              <td><code>name[48]</code></td>\n              <td><code>char[48]</code></td>\n              <td><span class=\"pill-badge hl-cyan\">48 B</span></td>\n              <td><code>0x00..0x2F</code></td>\n              <td>Null-terminated filename string (up to 47 characters + <code>\\0</code>).</td>\n            </tr>\n            <tr>\n              <td><code>type</code></td>\n              <td><code>uint8_t</code></td>\n              <td><span class=\"pill-badge hl-cyan\">1 B</span></td>\n              <td><code>0x30</code></td>\n              <td>Target entry type: <code>UFS_TYPE_FILE</code> (1) or <code>UFS_TYPE_DIR</code> (2).</td>\n            </tr>\n            <tr>\n              <td><code>active</code></td>\n              <td><code>uint8_t</code></td>\n              <td><span class=\"pill-badge hl-cyan\">1 B</span></td>\n              <td><code>0x31</code></td>\n              <td>Slot state: <code>1</code> = Active entry, <code>0</code> = Deleted / Free tombstone slot.</td>\n            </tr>\n            <tr>\n              <td><code>reserved</code></td>\n              <td><code>uint16_t</code></td>\n              <td><span class=\"pill-badge hl-cyan\">2 B</span></td>\n              <td><code>0x32..0x33</code></td>\n              <td>Alignment padding to 64-bit boundary.</td>\n            </tr>\n            <tr>\n              <td><code>object_id</code></td>\n              <td><code>uint64_t</code></td>\n              <td><span class=\"pill-badge hl-green\">8 B</span></td>\n              <td><code>0x34..0x3B</code></td>\n              <td>Compound 64-bit target ID: <code>(zone_id &lt;&lt; 32) | local_slot_id</code>.</td>\n            </tr>\n            <tr>\n              <td><code>generation</code></td>\n              <td><code>uint32_t</code></td>\n              <td><span class=\"pill-badge hl-cyan\">4 B</span></td>\n              <td><code>0x3C..0x3F</code></td>\n              <td>Z-Node incarnation generation for stale pointer detection.</td>\n            </tr>\n          </tbody>\n        </table>\n      </div>\n    </div>\n    <div class=\"undertale-grid-2 mt-2\">\n      <div class=\"battle-card green-theme\">\n        <div class=\"card-title hl-green\">⚡ CLEAN POWER-OF-TWO PACKING</div>\n        <p class=\"text-xs\">Exactly <strong>8 entries per 512B unit</strong> and <strong>64 entries per 4KB page</strong>.</p>\n        <p class=\"text-xs text-muted mt-1\">* Zero internal fragmentation across directory data extents.</p>\n      </div>\n      <div class=\"battle-card yellow-theme\">\n        <div class=\"card-title hl-yellow\">🔄 ATOMIC TOMBSTONE REUSE</div>\n        <p class=\"text-xs\">Creating a file scans directory slots and reuses the first <code>active == 0</code> slot immediately.</p>\n      </div>\n    </div>\n  ",
    "id": 62
  },
  {
    "chapter": "Chapter 5: Directory & Consistency",
    "zone": "barrier",
    "zoneName": "Zone 07: The Barrier",
    "title": "Why Design It This Way?",
    "subtitle": "Instant Navigation & Painless Renaming",
    "quote": "The directory table is essentially a name ➔ Z-Node mapping, with \".\" and \"..\" providing built-in links to current and parent directory.",
    "content": "\n      <div class=\"undertale-grid-2\">\n        <div class=\"undertale-box\">\n          <div class=\"box-header hl-cyan\">1. INSTANT NAVIGATION (<code>cd ..</code>)</div>\n          <p class=\"text-xs\">When navigating upward, the shell searches the current directory for <code>\"..\"</code>, reads its <code>object_id</code>, and jumps directly to the parent Z-Node:</p>\n          <div class=\"ascii-block text-xs mt-1\">\n/home (Z-Node 10)\n  └─► src (Z-Node 35)\n        └─► project (Z-Node 21)\n  cd .. ➔ find \"..\" ➔ read 35 ➔ jump!\n          </div>\n        </div>\n        <div class=\"undertale-box\">\n          <div class=\"box-header hl-yellow\">2. PAINLESS RENAMING</div>\n          <p class=\"text-xs\">A directory does not embed its parent's real path name:</p>\n          <div class=\"ascii-block text-xs mt-1\">\nRename \"project\" ➔ \"project_v2\":\n1. Update single entry in \"src\"\n2. ZERO child entries modified!\n          </div>\n          <p class=\"text-xs mt-1 hl-green\">Eliminates recursive path-update overhead completely.</p>\n        </div>\n      </div>\n    ",
    "id": 63
  },
  {
    "id": 64,
    "chapter": "Chapter 5: Directory & Consistency",
    "zone": "barrier",
    "zoneName": "Zone 07: The Barrier",
    "title": "Hot Directory Cache",
    "subtitle": "In-Memory Acceleration for Frequent Paths",
    "content": "\n      <div class=\"undertale-grid-2\">\n        <div class=\"undertale-box\">\n          <div class=\"box-header\">HOT CACHE TABLE</div>\n          <div class=\"ascii-block text-xs\">\n\"notes.txt\" ➔ Z-Node (Zone 3, #104)\n\"config\"    ➔ Z-Node (Zone 1, #12)\n\"report\"    ➔ Z-Node (Zone 5, #88)\n          </div>\n        </div>\n        <div class=\"undertale-box\">\n          <div class=\"box-header hl-green\">FAST PATH EXECUTION</div>\n          <p class=\"hl-green text-sm\">Repeated file accesses resolve in RAM instantly, avoiding disk directory traversal.</p>\n        </div>\n      </div>\n    "
  },
  {
    "id": 65,
    "chapter": "Chapter 5: Directory & Consistency",
    "zone": "barrier",
    "zoneName": "Zone 07: The Barrier",
    "title": "Why Not An Overly Complex On-Disk Directory?",
    "subtitle": "Simplicity & Crash Safety over B-Tree Splitting Overhead",
    "content": "\n      <div class=\"undertale-grid-2\">\n        <div class=\"battle-card red-theme\">\n          <div class=\"card-title\">COMPLEX B-TREE DISK RISKS ❌</div>\n          <ul class=\"pixel-list text-xs\">\n            <li>Frequent node splitting and rebalancing.</li>\n            <li>Multi-block atomic crash updates required.</li>\n            <li>Complicated recovery mechanisms.</li>\n          </ul>\n        </div>\n        <div class=\"battle-card green-theme\">\n          <div class=\"card-title\">AURAFS BALANCED DESIGN ✔</div>\n          <p class=\"hl-yellow text-sm\">Simple persistent directory structure on disk + blazing-fast in-memory hot cache.</p>\n        </div>\n      </div>\n    "
  },
  {
    "id": 66,
    "chapter": "Chapter 5: Directory & Consistency",
    "zone": "barrier",
    "zoneName": "Zone 07: The Barrier",
    "title": "Crash Consistency",
    "subtitle": "Preventing State Corruption Across Multi-Step Writes",
    "content": "\n      <div class=\"undertale-dialogue\">\n        <div class=\"dialogue-avatar avatar-soul\"></div>\n        <div class=\"dialogue-text\">\n          A single logical file write modifies up to 5 distinct on-disk structures! What happens if power cuts halfway through?\n        </div>\n      </div>\n      <div class=\"undertale-box mt-3\">\n        <div class=\"box-header\">MODIFIED STRUCTURES</div>\n        <div class=\"grid-3-col\">\n          <div class=\"pill-badge\">1. Free-space Bitmap</div>\n          <div class=\"pill-badge\">2. Data Blocks</div>\n          <div class=\"pill-badge\">3. Z-Node Extents</div>\n          <div class=\"pill-badge\">4. Directory Record</div>\n          <div class=\"pill-badge\">5. Global Heatmap</div>\n          <div class=\"pill-badge\">6. Superblock</div>\n        </div>\n      </div>\n    "
  },
  {
    "id": 67,
    "chapter": "Chapter 5: Directory & Consistency",
    "zone": "barrier",
    "zoneName": "Zone 07: The Barrier",
    "title": "Delta-Based Journaling",
    "subtitle": "Recording Logical Transitions, Not Whole Blocks",
    "quote": "Instead of writing whole 4KB blocks to the log for a 4-byte change, we journal precise logical deltas.",
    "content": "\n      <div class=\"undertale-grid-2\">\n        <div class=\"undertale-box\">\n          <div class=\"box-header hl-cyan\">EXAMPLE DELTA 1: JOP_SET_ZNODE</div>\n          <div class=\"ascii-block text-xs\">\nJOP_SET_ZNODE {\n  File = 42,\n  Field = size,\n  NewValue = 1024\n}\n          </div>\n        </div>\n        <div class=\"undertale-box\">\n          <div class=\"box-header hl-yellow\">EXAMPLE DELTA 2: JOP_ADD_EXTENT</div>\n          <div class=\"ascii-block text-xs\">\nJOP_ADD_EXTENT {\n  File = 42,\n  Zone = 5,\n  Start = 100,\n  Length = 8\n}\n          </div>\n        </div>\n      </div>\n    "
  },
  {
    "chapter": "Chapter 5: Directory & Consistency",
    "zone": "barrier",
    "zoneName": "Zone 07: The Barrier",
    "title": "Deep Dive: Journal Record Struct (journal_record_disk_t)",
    "subtitle": "4,096-Byte Atomic Transaction Envelope for Crash Resilience",
    "badge": "STRUCT ANATOMY",
    "quote": "Every transactional transition is captured in an atomic, sector-aligned 4KB log page before disk modification.",
    "content": "\n    <div class=\"undertale-box\">\n      <div class=\"box-header hl-red\"><span class=\"pixel-heart\"></span> ON-DISK STRUCT: <code>journal_record_disk_t</code> (4,096 Bytes / 1 Page)</div>\n      <div class=\"matrix-table-wrapper\">\n        <table class=\"pixel-table text-xs\">\n          <thead>\n            <tr>\n              <th>Field Name</th>\n              <th>Type</th>\n              <th>Size</th>\n              <th>Offset</th>\n              <th>Crash Recovery Role & Stored Payload</th>\n            </tr>\n          </thead>\n          <tbody>\n            <tr>\n              <td><code>magic</code> / <code>version</code></td>\n              <td><code>uint32_t</code> / <code>uint16_t</code></td>\n              <td><span class=\"pill-badge hl-cyan\">6 B</span></td>\n              <td><code>0x000..0x005</code></td>\n              <td>Journal signature <code>0x4A524E31</code> (<code>\"JRN1\"</code>) & format version.</td>\n            </tr>\n            <tr>\n              <td><code>type</code> (Operation Type)</td>\n              <td><code>uint16_t</code></td>\n              <td><span class=\"pill-badge hl-cyan\">2 B</span></td>\n              <td><code>0x006..0x007</code></td>\n              <td><code>JOP_BEGIN</code>, <code>JOP_SET_ZNODE</code>, <code>JOP_DIR_SLOT</code>, <code>JOP_SET_BITMAP</code>, <code>JOP_COMMIT</code>.</td>\n            </tr>\n            <tr>\n              <td><code>size</code> / <code>reserved0</code></td>\n              <td><code>uint16_t[2]</code></td>\n              <td><span class=\"pill-badge hl-cyan\">4 B</span></td>\n              <td><code>0x008..0x00B</code></td>\n              <td>Payload byte count & boundary alignment.</td>\n            </tr>\n            <tr>\n              <td><code>txid</code> (Transaction ID)</td>\n              <td><code>uint64_t</code></td>\n              <td><span class=\"pill-badge hl-green\">8 B</span></td>\n              <td><code>0x00C..0x013</code></td>\n              <td>Monotonic transaction sequence counter.</td>\n            </tr>\n            <tr>\n              <td><code>object_id</code></td>\n              <td><code>uint64_t</code></td>\n              <td><span class=\"pill-badge hl-green\">8 B</span></td>\n              <td><code>0x014..0x01B</code></td>\n              <td>Target Z-Node or Directory being modified.</td>\n            </tr>\n            <tr>\n              <td><code>zone_id</code> / <code>aux</code></td>\n              <td><code>uint32_t[2]</code></td>\n              <td><span class=\"pill-badge hl-cyan\">8 B</span></td>\n              <td><code>0x01C..0x023</code></td>\n              <td>Target zone index & auxiliary field/slot identifier.</td>\n            </tr>\n            <tr>\n              <td><code>bitmap_unit/value</code></td>\n              <td><code>uint32_t[2]</code></td>\n              <td><span class=\"pill-badge hl-cyan\">8 B</span></td>\n              <td><code>0x024..0x02B</code></td>\n              <td>Bitmap delta: target unit index and allocation bit value (0 or 1).</td>\n            </tr>\n            <tr>\n              <td><code>znode</code> (Full Snapshot)</td>\n              <td><code>znode_disk_t</code></td>\n              <td><span class=\"pill-badge hl-gold\">512 B</span></td>\n              <td><code>0x02C..0x22B</code></td>\n              <td>Complete 512-byte Z-Node state snapshot for deterministic rollback/replay.</td>\n            </tr>\n            <tr>\n              <td><code>dirent</code> (Dir Snapshot)</td>\n              <td><code>dir_disk_t</code></td>\n              <td><span class=\"pill-badge hl-gold\">64 B</span></td>\n              <td><code>0x22C..0x26B</code></td>\n              <td>Directory entry state snapshot.</td>\n            </tr>\n            <tr>\n              <td><code>reserved[]</code></td>\n              <td><code>uint8_t[3476]</code></td>\n              <td><span class=\"pill-badge hl-purple\">3,476 B</span></td>\n              <td><code>0x26C..0xFFF</code></td>\n              <td>Zero padding ensuring atomic 4,096-Byte single-page sector writes.</td>\n            </tr>\n          </tbody>\n        </table>\n      </div>\n    </div>\n  ",
    "id": 68
  },
  {
    "id": 69,
    "chapter": "Chapter 5: Directory & Consistency",
    "zone": "barrier",
    "zoneName": "Zone 07: The Barrier",
    "title": "Why Delta Journaling Fits Our Architecture",
    "subtitle": "Explicit Metadata Operations Match Discrete Data Structures",
    "content": "\n      <div class=\"undertale-box\">\n        <div class=\"box-header\">EXPLICIT METADATA STRUCTURES</div>\n        <p class=\"text-xs\">Because Z-Nodes, Extents, and Bitmaps are structured explicitly, changes are expressed directly as operations:</p>\n        <div class=\"grid-2x2 mt-3\">\n          <div class=\"feature-card\"><code>CHANGE_FIELD(znode, size, val)</code></div>\n          <div class=\"feature-card\"><code>ADD_EXTENT(znode, zone, start, len)</code></div>\n          <div class=\"feature-card\"><code>MARK_BITMAP(zone, index, status)</code></div>\n          <div class=\"feature-card\"><code>UPDATE_HEATMAP(zone, run)</code></div>\n        </div>\n      </div>\n    "
  },
  {
    "id": 70,
    "chapter": "Chapter 5: Directory & Consistency",
    "zone": "barrier",
    "zoneName": "Zone 07: The Barrier",
    "title": "One Crash-Safe Allocation Transaction",
    "subtitle": "The Atomic Journaled Sequence",
    "content": "\n      <div class=\"undertale-box\">\n        <div class=\"box-header\">ATOMIC JOURNAL COMMIT PIPELINE</div>\n        <div class=\"pipeline-vertical text-xs\">\n          <div class=\"pipe-row\">1. Reserve physical blocks in memory</div>\n          <div class=\"pipe-row\">2. Write user data to disk</div>\n          <div class=\"pipe-row\">3. Append deltas (Z-Node + Extent + Bitmap) to Journal</div>\n          <div class=\"pipe-row\">4. Commit Journal record</div>\n          <div class=\"pipe-row\">5. Apply in-place metadata updates</div>\n        </div>\n      </div>\n      <p class=\"hl-green mt-3 text-center text-xs\">On recovery, the journal replays committed deltas to guarantee zero orphaned blocks.</p>\n    "
  },
  {
    "chapter": "Comparison: Directory & Consistency",
    "zone": "blizzard",
    "zoneName": "Frostfire: FAT32 vs AuraFS",
    "title": "FAT32 vs. AuraFS: Directories & Crash Safety",
    "subtitle": "Messy Directory Sweeps vs. Hot Cache & Delta Journaling",
    "content": "\n    <div class=\"undertale-grid-2\">\n      <div class=\"battle-card cyan-theme\">\n        <div class=\"card-title hl-cyan\">❄️ FAT32 DIRECTORIES & RECOVERY</div>\n        <ul class=\"pixel-list text-xs\">\n          <li><strong class=\"hl-red\">32-Byte Linear Slots:</strong> Long filenames require hacky multi-slot VFAT records.</li>\n          <li><strong class=\"hl-red\">No Journaling:</strong> Power failures mid-write cause broken FAT chains, cross-linked files, and orphaned clusters.</li>\n          <li><strong class=\"hl-red\">Painful fsck Sweeps:</strong> Booting after a crash requires full disk scan (chkdsk / fsck.vfat) taking minutes or hours.</li>\n        </ul>\n      </div>\n      <div class=\"battle-card orange-theme\">\n        <div class=\"card-title hl-orange\">🔥 AURAFS DIRECTORIES & CRASH SAFETY</div>\n        <ul class=\"pixel-list text-xs\">\n          <li><strong class=\"hl-green\">Clean 64-Byte Records:</strong> <code>dir_disk_t</code> maps name to Z-Node ID directly.</li>\n          <li><strong class=\"hl-green\">Hot Directory Cache:</strong> In-memory LRU cache accelerates frequent path lookups.</li>\n          <li><strong class=\"hl-green\">Transactional Delta Journal:</strong> Records logical transitions atomically. Replays in milliseconds on boot with zero orphaned blocks.</li>\n        </ul>\n      </div>\n    </div>\n  ",
    "id": 71
  },
  {
    "id": 72,
    "chapter": "Chapter 6: Summary & Blueprint",
    "zone": "encounter",
    "zoneName": "Zone 08: The Final Encounter",
    "title": "The Full Architecture (Part 1 Summary)",
    "subtitle": "The Complete AuraFS Architectural Map",
    "content": "\n      <div class=\"undertale-box\">\n        <div class=\"box-header\">FULL ARCHITECTURE SUMMARY</div>\n        <div class=\"ascii-block text-xs\">\n                          APPLICATION\n                               │\n                               ▼\n                          FILESYSTEM API\n                               │\n                               ▼\n                    LOGICAL / VIRTUAL LAYER\n                               │\n                               ▼\n                      GRANULARITY DECISION (512B / 4KB / 16KB)\n                               │\n                               ▼\n                            ALLOCATOR\n                               │\n                ┌───────────────┼────────────────┐\n                ▼               ▼                ▼\n           ZONE HEATMAP     LOCAL BITMAP    GRANULARITY TAGS\n                │               │                │\n                └───────────────┼────────────────┘\n                                ▼\n                       PHYSICAL ALLOCATION\n                                │\n                                ▼\n                             Z-NODE ───► DIRECTORY / HOT CACHE\n                                │\n                         ┌──────┴──────┐\n                         ▼             ▼\n                      EXTENTS       METADATA\n                                │\n                                ▼\n                    PHYSICAL DATA (IN LOCAL ZONE)\n        </div>\n      </div>\n    "
  },
  {
    "id": 73,
    "chapter": "Chapter 6: Summary & Blueprint",
    "zone": "encounter",
    "zoneName": "Zone 08: The Final Encounter",
    "title": "The Most Important Relationship",
    "subtitle": "How the Core Components Cooperate",
    "content": "\n      <div class=\"undertale-grid-2\">\n        <div class=\"battle-card cyan-theme\">\n          <div class=\"card-title\">ALLOCATION FLOW</div>\n          <div class=\"ascii-block text-xs\">\nLOGICAL FILE: \"I need 16 KB space\"\n      ↓\nALLOCATOR:    \"Zone 2 has a 32-unit run\"\n      ↓\nZ-NODE:       \"Extent (Z2, 5000, 32) belongs to me\"\n      ↓\nPHYSICAL DATA Written to disk!\n          </div>\n        </div>\n        <div class=\"battle-card yellow-theme\">\n          <div class=\"card-title\">FREE-SPACE VERIFICATION</div>\n          <div class=\"ascii-block text-xs\">\nFREE-SPACE MANAGER:\n  ├─ Was it free? ➔ Checked local bitmap\n  ├─ Granularity? ➔ Verified 16KB tags\n  └─ Which Zone?  ➔ Routed via Heatmap\n          </div>\n        </div>\n      </div>\n    "
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SLIDES_DATA };
}
