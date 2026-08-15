// UserFS Presentation - Complete Slides Data (Slides 1 to 86)
// Themed with Undertale Zones, Dialogue Boxes, and Interactive Metadata

const SLIDES_DATA = [
  // ==========================================
  // CHAPTER 1: THE CORE VISION & PROBLEM STATEMENT (Slides 1-7)
  // Zone: The Ruins (Deep Purple / Ancient Stone / Intro)
  // ==========================================
  {
    id: 1,
    chapter: "Chapter 1: The Core Vision",
    zone: "ruins",
    zoneName: "Zone 00: The Ruins",
    title: "UserFS",
    subtitle: "A Zoned, Variable-Granularity Filesystem",
    badge: "TEAM AURA",
    quote: "Separate the logical view of files from their physical placement, then organize the physical disk into localized Zones where metadata, allocation information, and data cooperate.",
    content: `
      <div class="undertale-grid-2">
        <div class="undertale-box">
          <div class="box-header"><span class="pixel-heart"></span> CORE ARCHITECTURAL PILLARS</div>
          <ul class="pixel-list">
            <li><span class="hl-cyan">Logical / Virtual Blocks:</span> Abstract file view</li>
            <li><span class="hl-yellow">Variable Physical Sizes:</span> 512B / 4KB / 16KB</li>
            <li><span class="hl-orange">Zone-Based Allocator:</span> Locality by default</li>
            <li><span class="hl-green">Local Bitmaps + Metadata:</span> Size-aware free tracking</li>
            <li><span class="hl-red">Global Zone Heatmaps:</span> Fast O(1) zone routing</li>
          </ul>
        </div>
        <div class="undertale-box">
          <div class="box-header"><span class="pixel-star">★</span> SYSTEM HIGHLIGHTS</div>
          <ul class="pixel-list">
            <li><span class="hl-purple">Z-Nodes:</span> Compact extent-based file objects</li>
            <li><span class="hl-cyan">Extent-Based Mapping:</span> Contiguous & fragmented files</li>
            <li><span class="hl-yellow">Directory Caching:</span> Lightning fast path lookup</li>
            <li><span class="hl-green">Delta Crash Consistency:</span> Transactional recovery</li>
            <li><span class="hl-red">Determination:</span> Resilient under fragmentation</li>
          </ul>
        </div>
      </div>
    `,
    type: "title"
  },
  {
    id: 2,
    chapter: "Chapter 1: The Core Vision",
    zone: "ruins",
    zoneName: "Zone 00: The Ruins",
    title: "What Is a Filesystem Actually Doing?",
    subtitle: "The Fundamental Translation Problem",
    content: `
      <div class="undertale-dialogue">
        <div class="dialogue-avatar avatar-soul"></div>
        <div class="dialogue-text">
          A filesystem must bridge the gap between human intention and magnetic/flash physics:
        </div>
      </div>

      <div class="undertale-pipeline-horizontal">
        <div class="pipe-node cyan-border">
          <div class="node-title">APPLICATION</div>
          <code>write("notes.txt", data)</code>
        </div>
        <div class="pipe-arrow">➔</div>
        <div class="pipe-node yellow-border">
          <div class="node-title">LOGICAL FILE</div>
          <code>Continuous virtual byte stream</code>
        </div>
        <div class="pipe-arrow">➔</div>
        <div class="pipe-node green-border">
          <div class="node-title">PHYSICAL DISK</div>
          <code>Sectors, Zones & Blocks</code>
        </div>
      </div>

      <div class="undertale-box mt-4">
        <div class="box-header">SIX SIMULTANEOUS PROBLEMS TO SOLVE</div>
        <div class="grid-3-col">
          <div class="pill-badge">1. File Representation</div>
          <div class="pill-badge">2. Space Sizing</div>
          <div class="pill-badge">3. Free Space Finding</div>
          <div class="pill-badge">4. Location Mapping</div>
          <div class="pill-badge">5. Path Resolution</div>
          <div class="pill-badge">6. Crash Recovery</div>
        </div>
      </div>
    `
  },
  {
    id: 3,
    chapter: "Chapter 1: The Core Vision",
    zone: "ruins",
    zoneName: "Zone 00: The Ruins",
    title: "The Fundamental Separation",
    subtitle: "Logical World vs. Physical World",
    content: `
      <div class="quote-box">
        "The user sees one seamless logical file. The filesystem decides how that logical file is physically carved and placed on disk."
      </div>
      <div class="undertale-grid-2 mt-4">
        <div class="battle-card cyan-theme">
          <div class="card-title">🌐 LOGICAL WORLD</div>
          <div class="card-desc">What the application sees (Clean, contiguous abstraction)</div>
          <div class="ascii-block">
File "savegame.dat"
├── Logical Block 0 (Offset 0x0000)
├── Logical Block 1 (Offset 0x1000)
├── Logical Block 2 (Offset 0x2000)
└── Logical Block 3 (Offset 0x3000)
          </div>
        </div>
        <div class="battle-card purple-theme">
          <div class="card-title">💾 PHYSICAL WORLD</div>
          <div class="card-desc">Where bytes actually live on hardware</div>
          <div class="ascii-block">
Physical Storage Media
├── Zone 2 → Physical Region 500
├── Zone 2 → Physical Region 501
├── Zone 7 → Physical Region 900
└── Zone 7 → Physical Region 901
          </div>
        </div>
      </div>
    `
  },
  {
    id: 4,
    chapter: "Chapter 1: The Core Vision",
    zone: "ruins",
    zoneName: "Zone 00: The Ruins",
    title: "The Virtual / Logical Block Layer",
    subtitle: "Decoupling API Calls from Physical Allocation",
    content: `
      <p class="mb-3">We introduce a <strong>logical block layer</strong> between the POSIX file API and physical allocation.</p>
      
      <div class="flow-diagram">
        <div class="flow-step">Application File I/O</div>
        <div class="flow-down">▼</div>
        <div class="flow-step hl-cyan-box">Logical / Virtual File Blocks</div>
        <div class="flow-down">▼</div>
        <div class="flow-step hl-orange-box">Physical Allocation (512B / 4KB / 16KB)</div>
      </div>

      <div class="undertale-box mt-4">
        <div class="box-header"><span class="pixel-star">★</span> IMPORTANT DISTINCTION</div>
        <p>This is <strong>NOT CPU virtual memory or MMU page tables</strong>.</p>
        <p class="hl-yellow">It is a filesystem abstraction separating <em>where a file logically exists</em> from <em>where its bytes physically reside on disk</em>.</p>
      </div>
    `
  },
  {
    id: 5,
    chapter: "Chapter 1: The Core Vision",
    zone: "ruins",
    zoneName: "Zone 00: The Ruins",
    title: "Why Do We Need the Logical Layer?",
    subtitle: "Shielding Applications from Physical Fragmentation",
    content: `
      <div class="quote-box">
        "Physical fragmentation does not change the logical identity or continuity of the file."
      </div>
      <div class="undertale-grid-2 mt-4">
        <div class="undertale-box">
          <div class="box-header">WITHOUT LOGICAL LAYER ❌</div>
          <p class="text-sm">The application would have to manage scattered block pointers, handle physical hole jumps, and restructure I/O buffers whenever disk fragmentation occurs.</p>
          <div class="bad-block">App manages: Zone 1:A + Zone 1:B + Zone 4:C</div>
        </div>
        <div class="undertale-box">
          <div class="box-header">WITH LOGICAL LAYER (UserFS) ✔</div>
          <p class="text-sm">The application simply accesses Logical Block 0, 1, 2, 3. The filesystem abstracts all physical placement complexities seamlessly.</p>
          <div class="good-block">App sees: File [L0 | L1 | L2 | L3]</div>
        </div>
      </div>
    `
  },
  {
    id: 6,
    chapter: "Chapter 1: The Core Vision",
    zone: "ruins",
    zoneName: "Zone 00: The Ruins",
    title: "The Complete Allocation Pipeline",
    subtitle: "From API Call to Physical Media",
    content: `
      <div class="pipeline-vertical">
        <div class="pipe-row"><span class="pipe-badge">1</span> Application Request <span class="arrow">➔</span> <code>write(fd, buf, count)</code></div>
        <div class="pipe-row"><span class="pipe-badge">2</span> Logical / Virtual Block Layer <span class="arrow">➔</span> Assigns logical block index</div>
        <div class="pipe-row"><span class="pipe-badge">3</span> Granularity Decision <span class="arrow">➔</span> Selects 512B, 4KB, or 16KB</div>
        <div class="pipe-row"><span class="pipe-badge">4</span> Global Zone Heatmap <span class="arrow">➔</span> Identifies target Zone with best free runs</div>
        <div class="pipe-row"><span class="pipe-badge">5</span> Zone Free-Space Metadata <span class="arrow">➔</span> Validates local bitmap + size compatibility</div>
        <div class="pipe-row"><span class="pipe-badge">6</span> Physical Allocation & Extent <span class="arrow">➔</span> Carves physical range & updates Z-Node</div>
      </div>
    `
  },
  {
    id: 7,
    chapter: "Chapter 1: The Core Vision",
    zone: "ruins",
    zoneName: "Zone 00: The Ruins",
    title: "The Six Architectural Questions",
    subtitle: "The Blueprint of UserFS",
    content: `
      <div class="grid-2x3">
        <div class="qa-mini-card">
          <div class="q-num">Q1</div>
          <div class="q-title">Disk Organization</div>
          <div class="q-ans">Divide disk into independent localized <strong>Zones</strong> with collocated metadata & data.</div>
        </div>
        <div class="qa-mini-card">
          <div class="q-num">Q2</div>
          <div class="q-title">Allocation</div>
          <div class="q-ans"><strong>Variable Granularity</strong> (512B / 4KB / 16KB) matching file size profile.</div>
        </div>
        <div class="qa-mini-card">
          <div class="q-num">Q3</div>
          <div class="q-title">Mapping</div>
          <div class="q-ans"><strong>Z-Nodes + Extents</strong> mapping continuous logical blocks to physical spans.</div>
        </div>
        <div class="qa-mini-card">
          <div class="q-num">Q4</div>
          <div class="q-title">Free-Space Mgmt</div>
          <div class="q-ans"><strong>Two-Tier</strong>: Global Zone Heatmaps + Local Bitmaps & Granularity Tags.</div>
        </div>
        <div class="qa-mini-card">
          <div class="q-num">Q5</div>
          <div class="q-title">Namespace</div>
          <div class="q-ans">Simple robust on-disk directory + lightning-fast <strong>In-Memory Hot Cache</strong>.</div>
        </div>
        <div class="qa-mini-card">
          <div class="q-num">Q6</div>
          <div class="q-title">Crash Consistency</div>
          <div class="q-ans"><strong>Delta-Based Journaling</strong> recording logical metadata state transitions.</div>
        </div>
      </div>
    `
  },

  // ==========================================
  // CHAPTER 2: DISK LAYOUT & ZONE LOCALITY (Slides 8-11)
  // Zone: Snowdin Forest (Icy Cyan / Chill / Locality)
  // ==========================================
  {
    id: 8,
    chapter: "Chapter 2: Disk Layout & Locality",
    zone: "snowdin",
    zoneName: "Zone 01: Snowdin Forest",
    title: "Problem 1: Monolithic Disk Layout",
    subtitle: "The Classical Metadata Bottleneck",
    content: `
      <div class="monolith-disk-visual">
        <div class="disk-segment sb">Superblock</div>
        <div class="disk-segment meta">Inode Table (Metadata)</div>
        <div class="disk-segment bmp">Block Bitmap</div>
        <div class="disk-segment data">Gigantic Data Area</div>
      </div>
      
      <div class="undertale-dialogue mt-4">
        <div class="dialogue-avatar avatar-sans"></div>
        <div class="dialogue-text">
          * heh. having metadata at the front of the disk and data miles away means your drive heads are running a marathon just to read one tiny file.
        </div>
      </div>

      <div class="undertale-box mt-3">
        <div class="box-header">CONSEQUENCES OF MONOLITHIC DISK LAYOUT</div>
        <ul class="pixel-list">
          <li><strong>Extreme Head Movement:</strong> Constant seeks between inode tables and data blocks.</li>
          <li><strong>Metadata Contention:</strong> Single global lock/region for all disk allocations.</li>
          <li><strong>Poor Locality:</strong> No physical correlation between file metadata and its actual payload.</li>
        </ul>
      </div>
    `
  },
  {
    id: 9,
    chapter: "Chapter 2: Disk Layout & Locality",
    zone: "snowdin",
    zoneName: "Zone 01: Snowdin Forest",
    title: "Our Physical Organization: Zones",
    subtitle: "Modular, Localized Storage Domains",
    content: `
      <div class="zone-architecture-diagram">
        <div class="global-area-box">
          <div class="area-title">GLOBAL AREA</div>
          <div class="area-items">Superblock ✦ Delta Journal ✦ Global Zone Heatmap</div>
        </div>
        <div class="zones-container">
          <div class="zone-box">
            <div class="zone-header">ZONE 0</div>
            <div class="zone-body">Header | Z-Nodes | Local Bitmap | Data</div>
          </div>
          <div class="zone-box">
            <div class="zone-header">ZONE 1</div>
            <div class="zone-body">Header | Z-Nodes | Local Bitmap | Data</div>
          </div>
          <div class="zone-box highlight-zone">
            <div class="zone-header">ZONE 2</div>
            <div class="zone-body">Header | Z-Nodes | Local Bitmap | Data</div>
          </div>
          <div class="zone-box">
            <div class="zone-header">ZONE N...</div>
            <div class="zone-body">Header | Z-Nodes | Local Bitmap | Data</div>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 10,
    chapter: "Chapter 2: Disk Layout & Locality",
    zone: "snowdin",
    zoneName: "Zone 01: Snowdin Forest",
    title: "Why a Zone Exists",
    subtitle: "A Self-Contained Localized Storage Environment",
    content: `
      <div class="undertale-grid-2">
        <div class="undertale-box">
          <div class="box-header">CONVENTIONAL CHAOS ❌</div>
          <div class="ascii-block text-xs">
Metadata   = Address 0x00004000
Free Space = Address 0x00010000
Data       = Address 0x4F800000

Result: Long latency physical jumps!
          </div>
        </div>
        <div class="undertale-box">
          <div class="box-header">USERFS ZONE UNIT ✔</div>
          <div class="ascii-block text-xs">
┌──────────────────────────────────────┐
│ ZONE K                               │
│  ├─ Z-Nodes (File Metadata)          │
│  ├─ Local Free-Space Bitmap + Tags   │
│  └─ Local Data Allocation Blocks     │
└──────────────────────────────────────┘
          </div>
        </div>
      </div>
      <div class="quote-box mt-3">
        "A Zone gives the filesystem spatial locality as a first-class architectural invariant."
      </div>
    `
  },
  {
    id: 11,
    chapter: "Chapter 2: Disk Layout & Locality",
    zone: "snowdin",
    zoneName: "Zone 01: Snowdin Forest",
    title: "Zone Locality in Action",
    subtitle: "Keeping Related Data Close Together",
    content: `
      <div class="locality-flow">
        <div class="loc-card">
          <div class="loc-icon">📁</div>
          <div class="loc-title">Z-Node (Metadata)</div>
          <div class="loc-sub">Zone 5 Header Area</div>
        </div>
        <div class="loc-connect">⇄ <span class="text-xs">ZERO SEEK PENALTY</span> ⇄</div>
        <div class="loc-card">
          <div class="loc-icon">💾</div>
          <div class="loc-title">Physical Data</div>
          <div class="loc-sub">Zone 5 Data Region</div>
        </div>
      </div>

      <div class="undertale-box mt-4">
        <div class="box-header"><span class="pixel-star">★</span> ARCHITECTURAL GOAL</div>
        <p class="hl-yellow">"Keep the information needed to understand a file physically close to the data that file uses."</p>
        <p class="text-sm mt-2 text-muted">The filesystem does not need to cross-reference global tables across the disk to read local data blocks.</p>
      </div>
    `
  },

  // ==========================================
  // CHAPTER 3: VARIABLE GRANULARITY & ALLOCATION (Slides 12-17)
  // Zone: Waterfall (Luminous Teal / Echo Flowers / Granularity)
  // ==========================================
  {
    id: 12,
    chapter: "Chapter 3: Variable Granularity",
    zone: "waterfall",
    zoneName: "Zone 02: Waterfall",
    title: "Problem 2: Fixed Physical Blocks",
    subtitle: "The Curse of Internal Fragmentation",
    content: `
      <p class="mb-2">Traditional filesystems enforce a rigid, universal block size (typically 4 KB):</p>

      <div class="frag-visual-box">
        <div class="block-bar-wrapper">
          <div class="block-label">Fixed 4 KB Block:</div>
          <div class="block-meter">
            <div class="meter-used" style="width: 3%;">50B Data</div>
            <div class="meter-wasted" style="width: 97%;">3,998 Bytes Wasted (97.6% Internal Fragmentation)</div>
          </div>
        </div>
      </div>

      <div class="undertale-dialogue mt-4">
        <div class="dialogue-avatar avatar-echo"></div>
        <div class="dialogue-text">
          * (An echo flower whispers: "Millions of small configuration files, IoT telemetry packets, and log lines are drowning in wasted 4KB blocks...")
        </div>
      </div>
    `
  },
  {
    id: 13,
    chapter: "Chapter 3: Variable Granularity",
    zone: "waterfall",
    zoneName: "Zone 02: Waterfall",
    title: "Our Allocation Principle: Variable Granularity",
    subtitle: "Right-Sized Physical Blocks for Every File",
    content: `
      <div class="grid-3-col">
        <div class="granularity-card cyan-theme">
          <div class="gran-badge">SMALL</div>
          <div class="gran-size">512 B</div>
          <div class="gran-desc">Ideal for small configs, scripts, sensor logs, and tiny files.</div>
        </div>
        <div class="granularity-card yellow-theme">
          <div class="gran-badge">MEDIUM</div>
          <div class="gran-size">4 KB</div>
          <div class="gran-desc">General-purpose documents, source code, and medium datasets.</div>
        </div>
        <div class="granularity-card orange-theme">
          <div class="gran-badge">LARGE</div>
          <div class="gran-size">16 KB</div>
          <div class="gran-desc">High-throughput multimedia, databases, and large sequential streams.</div>
        </div>
      </div>
      <div class="quote-box mt-4">
        "Use a physical granularity appropriate to the file instead of forcing every file into one universal block size."
      </div>
    `
  },
  {
    id: 14,
    chapter: "Chapter 3: Variable Granularity",
    zone: "waterfall",
    zoneName: "Zone 02: Waterfall",
    title: "Why Variable Granularity Helps",
    subtitle: "Visual Comparison of Storage Efficiency",
    content: `
      <div class="undertale-box">
        <div class="box-header">CASE STUDY: STORING A 50-BYTE FILE</div>
        
        <div class="comparison-bar-row">
          <div class="comp-label">Fixed 4 KB:</div>
          <div class="comp-bar">
            <span class="bar-fill red-fill" style="width: 2%;">50B</span>
            <span class="bar-fill gray-fill" style="width: 98%;">3,998 B Unused Space (Waste!)</span>
          </div>
        </div>

        <div class="comparison-bar-row mt-3">
          <div class="comp-label">UserFS 512 B:</div>
          <div class="comp-bar">
            <span class="bar-fill green-fill" style="width: 15%;">50B</span>
            <span class="bar-fill dark-gray-fill" style="width: 85%;">462 B Unused (88% reduction in waste!)</span>
          </div>
        </div>
      </div>

      <div class="undertale-box mt-3">
        <div class="box-header">FOR LARGE FILES:</div>
        <p>16 KB blocks drastically reduce the number of extent records and metadata operations required to manage large files.</p>
      </div>
    `
  },
  {
    id: 15,
    chapter: "Chapter 3: Variable Granularity",
    zone: "waterfall",
    zoneName: "Zone 02: Waterfall",
    title: "The New Challenge of Variable Granularity",
    subtitle: "A Standard Bitmap Only Knows Free or Used",
    content: `
      <div class="undertale-dialogue">
        <div class="dialogue-avatar avatar-soul"></div>
        <div class="dialogue-text">
          If physical blocks can be 512B, 4KB, or 16KB, how does the free-space manager know what size each free slot is?
        </div>
      </div>

      <div class="undertale-grid-2 mt-4">
        <div class="battle-card red-theme">
          <div class="card-title">STANDARD BITMAP LIMITATION</div>
          <div class="ascii-block">
Bit 0: [0] = FREE   (Free what? 512B? 4KB? 16KB?)
Bit 1: [1] = USED
Bit 2: [0] = FREE   (Unknown granularity!)
          </div>
          <p class="text-xs mt-2 text-muted">A binary bit cannot represent multi-state granularity classes!</p>
        </div>

        <div class="battle-card green-theme">
          <div class="card-title">THE ARCHITECTURAL QUESTION</div>
          <p class="text-sm">We cannot allow the allocator to guess or scan disk headers to find block dimensions. The representation must be unambiguous and fast.</p>
        </div>
      </div>
    `
  },
  {
    id: 16,
    chapter: "Chapter 3: Variable Granularity",
    zone: "waterfall",
    zoneName: "Zone 02: Waterfall",
    title: "Our Solution: Granularity Metadata",
    subtitle: "Decoupling Availability from Size Classification",
    content: `
      <div class="undertale-box">
        <div class="box-header">TWO-DIMENSIONAL FREE-SPACE DESCRIPTOR</div>
        <div class="ascii-block">
┌─────────────────────────────────────────────────────────────┐
│ 1. BITMAP STATE          │ 0 = FREE       │ 1 = USED        │
├──────────────────────────┼────────────────┼─────────────────┤
│ 2. GRANULARITY METADATA  │ 00 = 512 B     │ 01 = 4 KB       │
│                          │ 10 = 16 KB     │ 11 = Reserved   │
└─────────────────────────────────────────────────────────────┘
        </div>
      </div>

      <div class="undertale-grid-2 mt-4">
        <div class="stat-pill"><span class="pill-q">Q: Is it free?</span> <span class="pill-a hl-green">Bitmap says YES/NO</span></div>
        <div class="stat-pill"><span class="pill-q">Q: What physical size?</span> <span class="pill-a hl-cyan">Granularity tag says 512B/4K/16K</span></div>
      </div>
    `
  },
  {
    id: 17,
    chapter: "Chapter 3: Variable Granularity",
    zone: "waterfall",
    zoneName: "Zone 02: Waterfall",
    title: "Why We Keep the Bitmap",
    subtitle: "Separation of Responsibilities",
    content: `
      <p class="mb-3">We do <strong>not</strong> overload the bitmap or replace it with a heavy tree. The bitmap stays blazing fast:</p>

      <div class="grid-3-col">
        <div class="undertale-box">
          <div class="box-header hl-green">BITMAP</div>
          <p class="text-sm">Blazing fast bitwise scan (e.g., <code>ffs()</code> / SIMD) answering:</p>
          <div class="hl-code">"Is this unit free?"</div>
        </div>
        <div class="undertale-box">
          <div class="box-header hl-cyan">GRANULARITY TAG</div>
          <p class="text-sm">Compact metadata descriptor answering:</p>
          <div class="hl-code">"What size class is it?"</div>
        </div>
        <div class="undertale-box">
          <div class="box-header hl-yellow">ALLOCATOR</div>
          <p class="text-sm">Intelligent matchmaker answering:</p>
          <div class="hl-code">"What does this file need?"</div>
        </div>
      </div>
    `
  },

  // ==========================================
  // CHAPTER 4: FREE SPACE DISCOVERY & THE HEATMAP (Slides 18-22)
  // Zone: Hotland (Magma Orange / Industrial / Fast Search)
  // ==========================================
  {
    id: 18,
    chapter: "Chapter 4: Free Space & Heatmaps",
    zone: "hotland",
    zoneName: "Zone 03: Hotland",
    title: "Local Free-Space Management",
    subtitle: "Zone-Local Bitmaps Prevent Global Contention",
    content: `
      <div class="zones-free-grid">
        <div class="zone-subcard">
          <div class="sub-header">ZONE 0</div>
          <div class="sub-body">Local Bitmap + Granularity Metadata</div>
        </div>
        <div class="zone-subcard">
          <div class="sub-header">ZONE 1</div>
          <div class="sub-body">Local Bitmap + Granularity Metadata</div>
        </div>
        <div class="zone-subcard">
          <div class="sub-header">ZONE 2</div>
          <div class="sub-body">Local Bitmap + Granularity Metadata</div>
        </div>
      </div>
      <div class="undertale-box mt-4">
        <div class="box-header">BENEFITS OF LOCALIZED FREE SPACE</div>
        <ul class="pixel-list">
          <li><strong>No Global Bitmap Lock:</strong> Concurrent allocations in different zones proceed in parallel.</li>
          <li><strong>Bounded Scan Time:</strong> Searching for free blocks only inspects a single Zone's compact metadata.</li>
        </ul>
      </div>
    `
  },
  {
    id: 19,
    chapter: "Chapter 4: Free Space & Heatmaps",
    zone: "hotland",
    zoneName: "Zone 03: Hotland",
    title: "Global Zone Heatmap",
    subtitle: "Fast O(1) Routing to Promising Storage Zones",
    content: `
      <p>A compact in-memory and on-disk summary tracking the largest contiguous run in each Zone:</p>

      <div class="heatmap-table-container">
        <table class="pixel-table">
          <thead>
            <tr>
              <th>Zone ID</th>
              <th>Total Free Units</th>
              <th>Largest Free Run</th>
              <th>Status Rating</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Zone 0</td><td>12 units</td><td>Run = 4</td><td><span class="badge-low">LOW</span></td></tr>
            <tr><td>Zone 1</td><td>8 units</td><td>Run = 2</td><td><span class="badge-low">LOW</span></td></tr>
            <tr class="hl-row"><td>Zone 2</td><td>240 units</td><td>Run = 80 units</td><td><span class="badge-hot">★ VERY HIGH</span></td></tr>
            <tr><td>Zone 3</td><td>45 units</td><td>Run = 21 units</td><td><span class="badge-med">MED</span></td></tr>
          </tbody>
        </table>
      </div>

      <div class="quote-box mt-3">
        "The heatmap answers: WHICH ZONE is promising? It avoids linear disk-wide search."
      </div>
    `
  },
  {
    id: 20,
    chapter: "Chapter 4: Free Space & Heatmaps",
    zone: "hotland",
    zoneName: "Zone 03: Hotland",
    title: "Heatmap vs Bitmap vs Granularity",
    subtitle: "The Three Questions of Space Discovery",
    content: `
      <div class="grid-3-col">
        <div class="battle-card orange-theme">
          <div class="card-title">1. GLOBAL HEATMAP</div>
          <div class="card-q">"WHERE should I look?"</div>
          <div class="card-ans">Selects Zone 2 (Largest run = 80)</div>
        </div>
        <div class="battle-card cyan-theme">
          <div class="card-title">2. LOCAL BITMAP</div>
          <div class="card-q">"WHICH units are free?"</div>
          <div class="card-ans">Finds units 100 to 179 are free</div>
        </div>
        <div class="battle-card purple-theme">
          <div class="card-title">3. GRANULARITY TAG</div>
          <div class="card-q">"WHAT TYPE of space?"</div>
          <div class="card-ans">Confirms units match 4KB size</div>
        </div>
      </div>
      <div class="pipeline-arrow-flow mt-4">
        <span>Heatmap</span> ➔ <span>Local Bitmap</span> ➔ <span>Granularity Metadata</span> ➔ <span class="hl-green">Allocate</span>
      </div>
    `
  },
  {
    id: 21,
    chapter: "Chapter 4: Free Space & Heatmaps",
    zone: "hotland",
    zoneName: "Zone 03: Hotland",
    title: "The Allocator",
    subtitle: "The Central Decision-Making Engine",
    content: `
      <div class="undertale-dialogue">
        <div class="dialogue-avatar avatar-soul"></div>
        <div class="dialogue-text">
          The Allocator is the core brain of UserFS. It mediates between logical user demands and physical disk reality.
        </div>
      </div>

      <div class="undertale-grid-2 mt-4">
        <div class="undertale-box">
          <div class="box-header">LOGICAL INPUTS</div>
          <ul class="pixel-list">
            <li>File size & predicted growth</li>
            <li>Requested logical block offset</li>
            <li>Access pattern hint</li>
          </ul>
        </div>
        <div class="undertale-box">
          <div class="box-header">PHYSICAL INPUTS</div>
          <ul class="pixel-list">
            <li>Zone Heatmap status</li>
            <li>Zone local free runs</li>
            <li>Physical granularity availability</li>
          </ul>
        </div>
      </div>
    `
  },
  {
    id: 22,
    chapter: "Chapter 4: Free Space & Heatmaps",
    zone: "hotland",
    zoneName: "Zone 03: Hotland",
    title: "The Allocator's Inputs & Outputs",
    subtitle: "Synthesizing Requirements into Extents",
    content: `
      <div class="allocator-synthesis-diagram">
        <div class="inputs-column">
          <div class="mini-input">File Size (e.g., 12 KB)</div>
          <div class="mini-input">Selected Granularity (4 KB)</div>
          <div class="mini-input">Target Zone Locality (Zone 2)</div>
        </div>
        <div class="allocator-core-hub">
          <div class="hub-title">⚙ ALLOCATOR</div>
          <div class="hub-sub">Matches demand with optimal contiguous run</div>
        </div>
        <div class="outputs-column">
          <div class="mini-output">Physical Range: [5000..5002]</div>
          <div class="mini-output">Extent: (Start=5000, Len=3)</div>
          <div class="mini-output">Z-Node Record Updated</div>
        </div>
      </div>
    `
  },

  // ==========================================
  // CHAPTER 5: LOGICAL-TO-PHYSICAL MAPPING & EXTENTS (Slides 23-34)
  // Zone: The Core (Electric Neon Blue / High-Tech Cyber Grid)
  // ==========================================
  {
    id: 23,
    chapter: "Chapter 5: Mapping & Extents",
    zone: "core",
    zoneName: "Zone 04: The Core",
    title: "Logical Blocks vs Physical Blocks",
    subtitle: "A Critical Architectural Distinction",
    content: `
      <div class="undertale-grid-2">
        <div class="battle-card cyan-theme">
          <div class="card-title">LOGICAL BLOCKS (Virtual)</div>
          <p class="text-sm">Continuous index space perceived by the file stream:</p>
          <div class="ascii-block">
File "aura_core.bin":
├── L0 [Offset 0 KB]
├── L1 [Offset 4 KB]
├── L2 [Offset 8 KB]
└── L3 [Offset 12 KB]
          </div>
        </div>
        <div class="battle-card blue-theme">
          <div class="card-title">PHYSICAL REGIONS (Disk)</div>
          <p class="text-sm">Actual storage regions carved out in disk zones:</p>
          <div class="ascii-block">
Disk Layout:
├── Zone 4: Region 100-101 (L0, L1)
└── Zone 7: Region 550-551 (L2, L3)
          </div>
        </div>
      </div>
      <div class="quote-box mt-3">
        "Logical blocks are what the application reads. Physical blocks are where the magnetic/flash bytes reside."
      </div>
    `
  },
  {
    id: 24,
    chapter: "Chapter 5: Mapping & Extents",
    zone: "core",
    zoneName: "Zone 04: The Core",
    title: "Logical-to-Physical Mapping",
    subtitle: "The Five-Step Address Translation Path",
    content: `
      <div class="mapping-steps-grid">
        <div class="step-card"><span class="step-badge">1</span> Logical Offset (e.g. 14,000)</div>
        <div class="step-card"><span class="step-badge">2</span> Logical Block Index (L3)</div>
        <div class="step-card"><span class="step-badge">3</span> Z-Node Extent Lookup</div>
        <div class="step-card"><span class="step-badge">4</span> Target Zone Identification</div>
        <div class="step-card"><span class="step-badge">5</span> Physical Sector/Block Read</div>
      </div>
      <div class="undertale-box mt-4">
        <div class="box-header">EXAMPLE TRANSLATION</div>
        <div class="ascii-block">
Logical:  [ L0 ]         [ L1 ]         [ L2 ]         [ L3 ]
           ↓              ↓              ↓              ↓
Physical: Zone 2: 100   Zone 2: 101   Zone 2: 102   Zone 5: 400
        </div>
      </div>
    `
  },
  {
    id: 25,
    chapter: "Chapter 5: Mapping & Extents",
    zone: "core",
    zoneName: "Zone 04: The Core",
    title: "Why the Application Does Not Need to Know",
    subtitle: "Clean Abstraction & Zero API Friction",
    content: `
      <div class="undertale-dialogue">
        <div class="dialogue-avatar avatar-soul"></div>
        <div class="dialogue-text">
          Application calls: <code>read(file, offset, len)</code>. It never needs to know which zone, how many extents, or what block granularity was used!
        </div>
      </div>

      <div class="undertale-box mt-4">
        <div class="box-header"><span class="pixel-star">★</span> CORE PRINCIPLE</div>
        <p class="hl-yellow text-lg">"Logical continuity is completely independent of physical continuity."</p>
      </div>
    `
  },
  {
    id: 26,
    chapter: "Chapter 5: Mapping & Extents",
    zone: "core",
    zoneName: "Zone 04: The Core",
    title: "Choosing Physical Granularity",
    subtitle: "Dynamic Selection via choose_granularity()",
    content: `
      <div class="decision-tree-box">
        <div class="decision-node">File Creation / Growth Request</div>
        <div class="decision-split">
          <div class="split-branch">
            <div class="branch-cond">&lt; 2 KB Size</div>
            <div class="branch-res hl-cyan">512 B Granularity</div>
          </div>
          <div class="split-branch">
            <div class="branch-cond">2 KB – 64 KB Size</div>
            <div class="branch-res hl-yellow">4 KB Granularity</div>
          </div>
          <div class="split-branch">
            <div class="branch-cond">&gt; 64 KB Size</div>
            <div class="branch-res hl-orange">16 KB Granularity</div>
          </div>
        </div>
      </div>
      <p class="text-sm text-center mt-3 text-muted">The chosen granularity is tagged in the Z-Node and used to match free-space metadata.</p>
    `
  },
  {
    id: 27,
    chapter: "Chapter 5: Mapping & Extents",
    zone: "core",
    zoneName: "Zone 04: The Core",
    title: "The Allocation Decision Walkthrough",
    subtitle: "Step-by-Step Allocation Flow",
    content: `
      <div class="pipeline-vertical">
        <div class="pipe-row"><strong>1. Sizing:</strong> Determine MEDIUM (4 KB) requirement</div>
        <div class="pipe-row"><strong>2. Heatmap:</strong> Consult global Zone heatmap for candidate zones</div>
        <div class="pipe-row"><strong>3. Selection:</strong> Select Zone with largest free run (Zone 2)</div>
        <div class="pipe-row"><strong>4. Local Scan:</strong> Inspect Zone 2 local bitmap for free run</div>
        <div class="pipe-row"><strong>5. Verify:</strong> Check granularity metadata for compatibility</div>
        <div class="pipe-row"><strong>6. Allocate:</strong> Mark bits USED in local bitmap</div>
        <div class="pipe-row"><strong>7. Record:</strong> Store Extent (Zone 2, Start, Len) in Z-Node</div>
      </div>
    `
  },
  {
    id: 28,
    chapter: "Chapter 5: Mapping & Extents",
    zone: "core",
    zoneName: "Zone 04: The Core",
    title: "Best-Case Allocation",
    subtitle: "Contiguous Free Run ➔ Single Extent",
    content: `
      <div class="undertale-box">
        <div class="box-header">CONTIGUOUS FREE RUN AVAILABLE</div>
        <div class="ascii-block text-sm">
Zone Free Space: [FREE] [FREE] [FREE] [FREE]
Allocation:      [████] [████] [████] [████] (Assigned contiguously)
        </div>
      </div>
      <div class="undertale-grid-2 mt-4">
        <div class="battle-card green-theme">
          <div class="card-title">RESULT</div>
          <div class="hl-code">ONE FILE ➔ ONE EXTENT ➔ ONE CONTIGUOUS SPAN</div>
        </div>
        <div class="battle-card cyan-theme">
          <div class="card-title">Z-NODE STORAGE</div>
          <div class="hl-code">Extent 0: (Start = 5000, Length = 4)</div>
        </div>
      </div>
    `
  },
  {
    id: 29,
    chapter: "Chapter 5: Mapping & Extents",
    zone: "core",
    zoneName: "Zone 04: The Core",
    title: "Why We Prefer Contiguous Allocation",
    subtitle: "Performance First, Extents as Fallback",
    content: `
      <div class="grid-2x2">
        <div class="feature-card"><span class="feat-icon">⚡</span> <strong>Max Sequential Throughput:</strong> Hardware drives stream contiguous sectors at maximum bus rate.</div>
        <div class="feature-card"><span class="feat-icon">🎯</span> <strong>Zero Head Jumps:</strong> Eliminates physical actuator seek delays and command queue overhead.</div>
        <div class="feature-card"><span class="feat-icon">📦</span> <strong>Ultra-Compact Metadata:</strong> Entire file described by a single 8-byte extent struct.</div>
        <div class="feature-card"><span class="feat-icon">🛡</span> <strong>Strong Locality:</strong> Metadata and payload reside in the exact same physical sector neighborhood.</div>
      </div>
    `
  },
  {
    id: 30,
    chapter: "Chapter 5: Mapping & Extents",
    zone: "core",
    zoneName: "Zone 04: The Core",
    title: "What Happens When the Disk Is Fragmented?",
    subtitle: "Multi-Extent Graceful Degradation",
    content: `
      <div class="undertale-box">
        <div class="box-header">FRAGMENTED FREE RUNS ON DISK</div>
        <div class="ascii-block text-xs">
[FREE][FREE] [USED] [FREE][FREE][FREE] [USED] [FREE][FREE][FREE][FREE][FREE]
  (2 units)           (3 units)                   (5 units)
        </div>
      </div>
      <div class="undertale-box mt-3">
        <div class="box-header">ALLOCATOR ASSEMBLES THREE EXTENTS:</div>
        <ul class="pixel-list">
          <li><strong>Extent 1:</strong> Start = 100, Len = 2 (Units 0..1)</li>
          <li><strong>Extent 2:</strong> Start = 103, Len = 3 (Units 2..4)</li>
          <li><strong>Extent 3:</strong> Start = 107, Len = 5 (Units 5..9)</li>
        </ul>
        <p class="hl-green mt-2">The Z-Node records all three extents. The application sees one seamless 10-unit file!</p>
      </div>
    `
  },
  {
    id: 31,
    chapter: "Chapter 5: Mapping & Extents",
    zone: "core",
    zoneName: "Zone 04: The Core",
    title: "The Meaning of an Extent",
    subtitle: "A Record of Assigned Space, NOT a Free-Space Manager",
    content: `
      <div class="quote-box">
        "An extent describes a region of physical space already assigned to a file."
      </div>
      <div class="undertale-grid-2 mt-4">
        <div class="battle-card cyan-theme">
          <div class="card-title">EXTENT STRUCTURE</div>
          <div class="ascii-block">
struct Extent {
  uint32_t zone_id;
  uint32_t physical_start;
  uint32_t block_count;
};
          </div>
        </div>
        <div class="battle-card yellow-theme">
          <div class="card-title">WHAT AN EXTENT IS NOT</div>
          <p class="text-sm">An extent is <strong>NOT</strong> the free-space manager. It does not scan free blocks or decide allocations. It is simply a mapping record.</p>
        </div>
      </div>
    `
  },
  {
    id: 32,
    chapter: "Chapter 5: Mapping & Extents",
    zone: "core",
    zoneName: "Zone 04: The Core",
    title: "Free Space and Extents Are Opposites",
    subtitle: "The Life Cycle of Disk Storage",
    content: `
      <div class="undertale-grid-2">
        <div class="undertale-box">
          <div class="box-header hl-cyan">BEFORE ALLOCATION</div>
          <p><strong>Free-Space Manager View:</strong></p>
          <div class="ascii-block">Region [5000..5019] = FREE</div>
          <p class="text-xs text-muted mt-2">Available for any file requesting compatible granularity.</p>
        </div>
        <div class="undertale-box">
          <div class="box-header hl-yellow">AFTER ALLOCATION</div>
          <p><strong>Free-Space Manager:</strong></p>
          <div class="ascii-block">Region [5000..5019] = USED</div>
          <p class="mt-2"><strong>Z-Node File Mapping:</strong></p>
          <div class="ascii-block">Extent: 5000..5019 (Belongs to File X)</div>
        </div>
      </div>
    `
  },
  {
    id: 33,
    chapter: "Chapter 5: Mapping & Extents",
    zone: "core",
    zoneName: "Zone 04: The Core",
    title: "How Scattered Extents Belong to One File",
    subtitle: "The Z-Node Is the Single Owner of the Extent List",
    content: `
      <div class="undertale-dialogue">
        <div class="dialogue-avatar avatar-sans"></div>
        <div class="dialogue-text">
          * "How do scattered extents across different zones know they belong to the same file?"<br>
          * "they don't need to know anything. the z-node holds the whole list."
        </div>
      </div>

      <div class="znode-ownership-visual mt-4">
        <div class="znode-owner-card">
          <div class="znode-id-title">Z-Node #42 ("savegame.dat")</div>
          <div class="znode-extents">
            <div>Extent 0 ➔ Zone 2 [Region A] (Blocks 0..3)</div>
            <div>Extent 1 ➔ Zone 2 [Region B] (Blocks 4..7)</div>
            <div>Extent 2 ➔ Zone 7 [Region C] (Blocks 8..15)</div>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 34,
    chapter: "Chapter 5: Mapping & Extents",
    zone: "core",
    zoneName: "Zone 04: The Core",
    title: "Does Physical Proximity Create Ownership?",
    subtitle: "Locality vs Ownership: Two Distinct Concepts",
    content: `
      <div class="undertale-grid-2">
        <div class="battle-card purple-theme">
          <div class="card-title">Z-NODE LOCATION</div>
          <div class="card-ans">Provides <strong>LOCALITY</strong></div>
          <p class="text-xs mt-2">Placing the Z-Node in Zone 5 ensures metadata is physically near the primary data blocks.</p>
        </div>
        <div class="battle-card cyan-theme">
          <div class="card-title">Z-NODE EXTENT LIST</div>
          <div class="card-ans">Provides <strong>MAPPING & OWNERSHIP</strong></div>
          <p class="text-xs mt-2">Even if an extent is allocated in Zone 9, it is 100% owned by the Z-Node referencing it.</p>
        </div>
      </div>
      <div class="quote-box mt-3">
        "Z-Node location ≠ extent ownership. Locality is an optimization; the extent list is the binding authority."
      </div>
    `
  },

  // ==========================================
  // CHAPTER 6: Z-NODES & EXTENT ARCHITECTURE (Slides 35-42)
  // Zone: Judgment Hall (Gilded Amber / Determination / Architecture)
  // ==========================================
  {
    id: 35,
    chapter: "Chapter 6: Z-Nodes & Architecture",
    zone: "judgement",
    zoneName: "Zone 05: Judgment Hall",
    title: "What Is a Z-Node?",
    subtitle: "The File's Localized Metadata Object",
    content: `
      <div class="undertale-grid-2">
        <div class="undertale-box">
          <div class="box-header">Z-NODE STRUCTURE</div>
          <div class="ascii-block text-xs">
struct ZNode {
  uint32_t file_id;
  uint16_t file_type;
  uint32_t zone_id;
  uint64_t file_size;
  uint16_t granularity;
  uint32_t extent_count;
  Extent   extents[MAX_DIRECT];
};
          </div>
        </div>
        <div class="undertale-box">
          <div class="box-header">KEY ADVANTAGES</div>
          <ul class="pixel-list">
            <li>Replaces deep indirect pointer trees with compact extents.</li>
            <li>Contains complete allocation context in a single cacheable struct.</li>
            <li>Stored directly inside the home Zone.</li>
          </ul>
        </div>
      </div>
    `
  },
  {
    id: 36,
    chapter: "Chapter 6: Z-Nodes & Architecture",
    zone: "judgement",
    zoneName: "Zone 05: Judgment Hall",
    title: "Why Not Conventional Inode Pointers?",
    subtitle: "Escaping the Multi-Level Indirect Pointer Trap",
    content: `
      <div class="undertale-grid-2">
        <div class="battle-card red-theme">
          <div class="card-title">TRADITIONAL INODES ❌</div>
          <div class="ascii-block text-xs">
Inode 
  ➔ Direct Pointers [0..11]
  ➔ Single Indirect Block
      ➔ Double Indirect Block
          ➔ Triple Indirect Block
              ➔ Data
          </div>
          <p class="text-xs text-muted mt-1">Deep trees, multiple disk seeks per read!</p>
        </div>
        <div class="battle-card green-theme">
          <div class="card-title">USERFS Z-NODES ✔</div>
          <div class="ascii-block text-xs">
Z-Node
  ➔ Extent 0 (Start=1000, Len=500)
  ➔ Extent 1 (Start=2000, Len=800)
  ➔ Physical Data directly!
          </div>
          <p class="text-xs text-muted mt-1">Flat, direct, O(1) extent lookup!</p>
        </div>
      </div>
    `
  },
  {
    id: 37,
    chapter: "Chapter 6: Z-Nodes & Architecture",
    zone: "judgement",
    zoneName: "Zone 05: Judgment Hall",
    title: "Z-Node vs 'Just an Extent'",
    subtitle: "The File Entity vs Its Mapping Components",
    content: `
      <div class="comparison-dual-table">
        <div class="comp-col">
          <div class="col-head hl-yellow">AN EXTENT</div>
          <p class="text-sm">Simply a tuple: <code>(Zone, StartBlock, Length)</code>.</p>
          <p class="text-xs text-muted">Has no name, permissions, file size, or identity.</p>
        </div>
        <div class="comp-col">
          <div class="col-head hl-cyan">THE Z-NODE</div>
          <p class="text-sm">The authoritative file object: Identity + Metadata + Extent Array + Locality Context.</p>
          <p class="text-xs text-muted">The complete representation of a file entity.</p>
        </div>
      </div>
    `
  },
  {
    id: 38,
    chapter: "Chapter 6: Z-Nodes & Architecture",
    zone: "judgement",
    zoneName: "Zone 05: Judgment Hall",
    title: "Why Place Z-Nodes Inside Zones?",
    subtitle: "Compound Identifiers & Physical Collocation",
    content: `
      <div class="compound-id-visual">
        <div class="id-badge">File Identifier: <code>(Zone_ID, Local_ID)</code></div>
      </div>
      <div class="undertale-box mt-4">
        <div class="box-header">INSTANT ZONE ROUTING</div>
        <p>Given <code>File ID (5, 42)</code>, the filesystem instantly directs I/O to <strong>Zone 5</strong> without querying a global inode table.</p>
        <p class="hl-cyan mt-2">Metadata and data live in the same physical neighborhood, eliminating cross-disk seek latency.</p>
      </div>
    `
  },
  {
    id: 39,
    chapter: "Chapter 6: Z-Nodes & Architecture",
    zone: "judgement",
    zoneName: "Zone 05: Judgment Hall",
    title: "What Problem Does Z-Node Locality Solve?",
    subtitle: "Eliminating Metadata/Data Physical Separation",
    content: `
      <div class="undertale-grid-2">
        <div class="undertale-box">
          <div class="box-header">TRADITIONAL MONOLITH</div>
          <div class="ascii-block text-xs">
[Disk Front: Inode Table] 
          ↓ (Seek 500 GB)
[Disk Middle: File Data]
          </div>
        </div>
        <div class="undertale-box">
          <div class="box-header">USERFS LOCALIZED ZONE</div>
          <div class="ascii-block text-xs">
[Zone 5]
├── Z-Node Table
└── File Data Region (Adjacent!)
          </div>
        </div>
      </div>
      <div class="quote-box mt-3">
        "The filesystem locates metadata and file data within the same physical neighborhood."
      </div>
    `
  },
  {
    id: 40,
    chapter: "Chapter 6: Z-Nodes & Architecture",
    zone: "judgement",
    zoneName: "Zone 05: Judgment Hall",
    title: "Does the Z-Node Eliminate External Fragmentation?",
    subtitle: "No — It Tolerates External Fragmentation Gracefully",
    content: `
      <div class="undertale-dialogue">
        <div class="dialogue-avatar avatar-soul"></div>
        <div class="dialogue-text">
          External fragmentation is an inescapable physical reality when files are created and deleted over time.
        </div>
      </div>
      <div class="undertale-box mt-4">
        <div class="box-header">OUR STRATEGY</div>
        <div class="pipeline-horizontal">
          <div>1. Try contiguous first</div>
          <div>➔</div>
          <div>2. Fallback to multiple extents</div>
          <div>➔</div>
          <div>3. Z-Node records them seamlessly</div>
        </div>
        <p class="hl-yellow mt-3">We tolerate external fragmentation without requiring expensive instant defragmentation cycles!</p>
      </div>
    `
  },
  {
    id: 41,
    chapter: "Chapter 6: Z-Nodes & Architecture",
    zone: "judgement",
    zoneName: "Zone 05: Judgment Hall",
    title: "The 'Fragmentation Safety Net'",
    subtitle: "Contiguity When Possible, Extents When Necessary",
    content: `
      <div class="undertale-grid-2">
        <div class="battle-card green-theme">
          <div class="card-title">WHEN DISK IS CLEAN</div>
          <div class="hl-code">Large Contiguous Free Run ➔ 1 Extent</div>
          <p class="text-xs mt-2">Optimal sequential performance and minimal metadata footprint.</p>
        </div>
        <div class="battle-card yellow-theme">
          <div class="card-title">WHEN DISK IS FRAGMENTED</div>
          <div class="hl-code">Scattered Free Runs ➔ Multiple Extents</div>
          <p class="text-xs mt-2">Allocation never fails due to non-contiguous layout.</p>
        </div>
      </div>
      <div class="quote-box mt-3">
        "Contiguity is the preferred physical state; extents are the robust fallback representation."
      </div>
    `
  },
  {
    id: 42,
    chapter: "Chapter 6: Z-Nodes & Architecture",
    zone: "judgement",
    zoneName: "Zone 05: Judgment Hall",
    title: "Variable Granularity + Extents",
    subtitle: "Two Solutions for Two Distinct Problems",
    content: `
      <div class="undertale-grid-2">
        <div class="battle-card cyan-theme">
          <div class="card-title">VARIABLE GRANULARITY</div>
          <div class="card-sub">512B / 4KB / 16KB</div>
          <p class="hl-green">Target: Internal Fragmentation</p>
          <p class="text-xs mt-1">Eliminates wasted space inside allocated blocks.</p>
        </div>
        <div class="battle-card orange-theme">
          <div class="card-title">EXTENT-BASED MAPPING</div>
          <div class="card-sub">Array of (Start, Length) spans</div>
          <p class="hl-yellow">Target: External Fragmentation</p>
          <p class="text-xs mt-1">Provides flexibility when free space is scattered.</p>
        </div>
      </div>
      <div class="quote-box mt-3">
        "RIGHT-SIZED ALLOCATION + FLEXIBLE PHYSICAL PLACEMENT"
      </div>
    `
  },

  // ==========================================
  // CHAPTER 7: FREE-SPACE ARCHITECTURE & LIFECYCLE (Slides 43-54)
  // Zone: The True Lab (Phosphor CRT Green / Terminal / Deep Tech)
  // ==========================================
  {
    id: 43,
    chapter: "Chapter 7: Free Space & Lifecycle",
    zone: "truelab",
    zoneName: "Zone 06: The True Lab",
    title: "The Free-Space Architecture",
    subtitle: "Hierarchical Space Discovery Hierarchy",
    content: `
      <div class="hierarchy-tree-visual">
        <div class="tree-level-1">
          <div class="tree-badge">GLOBAL LEVEL</div>
          <div class="tree-content">Zone Heatmaps (Largest free run per Zone)</div>
        </div>
        <div class="tree-arrow">▼ Selects Promising Zone</div>
        <div class="tree-level-2">
          <div class="tree-badge">LOCAL LEVEL</div>
          <div class="tree-content">Local Bitmap (FREE/USED) + Granularity Tags (512/4K/16K)</div>
        </div>
        <div class="tree-arrow">▼ Informs Decision</div>
        <div class="tree-level-3">
          <div class="tree-badge">ALLOCATOR</div>
          <div class="tree-content">Carves physical extents and updates Z-Node</div>
        </div>
      </div>
    `
  },
  {
    id: 44,
    chapter: "Chapter 7: Free Space & Lifecycle",
    zone: "truelab",
    zoneName: "Zone 06: The True Lab",
    title: "What the Allocator Knows",
    subtitle: "The Master Synthesizer of the Filesystem",
    content: `
      <div class="undertale-box">
        <div class="box-header">SYNTHESIZING SYSTEM STATE</div>
        <ul class="pixel-list">
          <li><strong>Logical File Demand:</strong> Byte length, growth offset, access profile.</li>
          <li><strong>Granularity Class:</strong> Optimal physical unit (512B, 4KB, 16KB).</li>
          <li><strong>Zone Candidates:</strong> Ranked by global heatmap.</li>
          <li><strong>Local Compatibility:</strong> Exact free spans matching size class.</li>
        </ul>
      </div>
      <p class="hl-green text-center mt-3">The allocator decides WHERE to place data and HOW MUCH space to assign.</p>
    `
  },
  {
    id: 45,
    chapter: "Chapter 7: Free Space & Lifecycle",
    zone: "truelab",
    zoneName: "Zone 06: The True Lab",
    title: "What the Bitmap Does NOT Know",
    subtitle: "Keeping the Bitmap Simple, Fast & Focused",
    content: `
      <div class="undertale-box">
        <div class="box-header">THE BITMAP IS INTENTIONALLY MINIMAL</div>
        <div class="grid-3-col">
          <div class="bad-item">❌ Does not know file names</div>
          <div class="bad-item">❌ Does not know file owners</div>
          <div class="bad-item">❌ Does not know logical structure</div>
        </div>
        <div class="hl-code mt-3 text-center">
          Bitmap Responsibility: 1 bit = 1 state (FREE [0] or USED [1])
        </div>
      </div>
    `
  },
  {
    id: 46,
    chapter: "Chapter 7: Free Space & Lifecycle",
    zone: "truelab",
    zoneName: "Zone 06: The True Lab",
    title: "What the Extent Does NOT Know",
    subtitle: "Extents Are Passive Records, Not Active Agents",
    content: `
      <div class="undertale-grid-2">
        <div class="undertale-box">
          <div class="box-header">EXTENT LIMITS</div>
          <ul class="pixel-list">
            <li>Does NOT search the disk for free space.</li>
            <li>Does NOT choose block granularity.</li>
            <li>Does NOT balance zone load.</li>
          </ul>
        </div>
        <div class="undertale-box">
          <div class="box-header">EXTENT PURPOSE</div>
          <p class="hl-cyan">Record a physical region AFTER the allocator has made the decision.</p>
        </div>
      </div>
    `
  },
  {
    id: 47,
    chapter: "Chapter 7: Free Space & Lifecycle",
    zone: "truelab",
    zoneName: "Zone 06: The True Lab",
    title: "What the Z-Node Does NOT Do",
    subtitle: "Separation of Concerns Prevents Monolithic Bloat",
    content: `
      <div class="undertale-box">
        <div class="box-header">CLEAR BOUNDARIES</div>
        <p>The Z-Node does <strong>NOT</strong> replace the Allocator or scan free space.</p>
        <div class="ascii-block mt-3">
Z-Node Role = File ID + Metadata + Extent Array + Locality Context
        </div>
      </div>
    `
  },
  {
    id: 48,
    chapter: "Chapter 7: Free Space & Lifecycle",
    zone: "truelab",
    zoneName: "Zone 06: The True Lab",
    title: "One Complete File Creation",
    subtitle: "End-to-End Walkthrough of Creating '/report.txt'",
    content: `
      <div class="lifecycle-steps">
        <div class="life-step"><span class="step-num">1</span> <strong>Directory:</strong> Receives request for <code>/report.txt</code></div>
        <div class="life-step"><span class="step-num">2</span> <strong>Z-Node:</strong> Allocated in target Zone with new ID</div>
        <div class="life-step"><span class="step-num">3</span> <strong>Granularity:</strong> File size determines physical unit class</div>
        <div class="life-step"><span class="step-num">4</span> <strong>Heatmap:</strong> Allocator queries heatmap for best Zone</div>
        <div class="life-step"><span class="step-num">5</span> <strong>Local Free Space:</strong> Bitmap & granularity tags locate free run</div>
        <div class="life-step"><span class="step-num">6</span> <strong>Physical Allocation:</strong> Mark bits USED; assign blocks</div>
        <div class="life-step"><span class="step-num">7</span> <strong>Extent Storage:</strong> Extent appended to Z-Node</div>
        <div class="life-step"><span class="step-num">8</span> <strong>Directory Link:</strong> Directory maps <code>/report.txt ➔ Z-Node ID</code></div>
      </div>
    `
  },
  {
    id: 49,
    chapter: "Chapter 7: Free Space & Lifecycle",
    zone: "truelab",
    zoneName: "Zone 06: The True Lab",
    title: "One Complete File Write",
    subtitle: "From Buffer to Magnetic/Flash Media",
    content: `
      <div class="pipeline-vertical">
        <div class="pipe-row"><strong>1. write():</strong> User provides logical offset & buffer</div>
        <div class="pipe-row"><strong>2. Block Lookup:</strong> Offset translated to Logical Block Index</div>
        <div class="pipe-row"><strong>3. Extent Match:</strong> Z-Node identifies matching physical extent</div>
        <div class="pipe-row"><strong>4. Disk I/O:</strong> Bytes written to Zone physical location</div>
        <div class="pipe-row"><strong>5. Growth:</strong> If write extends past EOF, Allocator carves new space</div>
      </div>
    `
  },
  {
    id: 50,
    chapter: "Chapter 7: Free Space & Lifecycle",
    zone: "truelab",
    zoneName: "Zone 06: The True Lab",
    title: "File Growth Dynamics",
    subtitle: "Extending Extents vs Appending New Extents",
    content: `
      <div class="undertale-grid-2">
        <div class="battle-card green-theme">
          <div class="card-title">CASE 1: ADJACENT FREE SPACE EXISTS</div>
          <div class="ascii-block text-xs">
Current: [100..109] (File) + [110..119] (FREE)
Result:  Extend Extent 1 ➔ [100..119] (Len = 20)
          </div>
          <p class="text-xs mt-2 hl-green">Zero extra extent entries needed!</p>
        </div>
        <div class="battle-card yellow-theme">
          <div class="card-title">CASE 2: ADJACENT SPACE OCCUPIED</div>
          <div class="ascii-block text-xs">
Current: [100..109] (File) + [110..119] (OCCUPIED)
Result:  Add Extent 2 ➔ [200..209] in new run
          </div>
          <p class="text-xs mt-2 hl-yellow">File grows seamlessly via multi-extents.</p>
        </div>
      </div>
    `
  },
  {
    id: 51,
    chapter: "Chapter 7: Free Space & Lifecycle",
    zone: "truelab",
    zoneName: "Zone 06: The True Lab",
    title: "Why Contiguous Allocation Still Matters",
    subtitle: "One Large Extent vs Many Fragmented Extents",
    content: `
      <div class="comparison-dual-table">
        <div class="comp-col">
          <div class="col-head hl-green">ONE EXTENT</div>
          <div class="ascii-block text-xs">[DATA][DATA][DATA][DATA]</div>
          <p class="text-xs mt-2">Continuous stream, zero disk head repositioning.</p>
        </div>
        <div class="comp-col">
          <div class="col-head hl-red">MANY EXTENTS</div>
          <div class="ascii-block text-xs">[DATA] ➔ SEEK ➔ [DATA] ➔ SEEK</div>
          <p class="text-xs mt-2">Fragmented seeks introduce hardware latency.</p>
        </div>
      </div>
      <p class="quote-box mt-3">
        "The allocator ALWAYS prefers the largest suitable contiguous run before fragmenting."
      </p>
    `
  },
  {
    id: 52,
    chapter: "Chapter 7: Free Space & Lifecycle",
    zone: "truelab",
    zoneName: "Zone 06: The True Lab",
    title: "Why the Heatmap Matters",
    subtitle: "Eliminating O(N) Disk Scans",
    content: `
      <div class="undertale-box">
        <div class="box-header">SCENARIO: ALLOCATOR NEEDS 20 CONTIGUOUS UNITS</div>
        <div class="ascii-block text-xs">
Zone 0: Largest Run = 3   (Too small)
Zone 1: Largest Run = 7   (Too small)
Zone 2: Largest Run = 48  (★ PERFECT MATCH!)
Zone 3: Largest Run = 4   (Too small)
        </div>
      </div>
      <div class="undertale-box mt-3">
        <div class="box-header">RESULT</div>
        <p class="hl-green">Instant O(1) routing straight to Zone 2. Zero wasted scans in Zones 0, 1, or 3.</p>
      </div>
    `
  },
  {
    id: 53,
    chapter: "Chapter 7: Free Space & Lifecycle",
    zone: "truelab",
    zoneName: "Zone 06: The True Lab",
    title: "Why Granularity Metadata Matters",
    subtitle: "Ensuring Type & Size Safety on Disk",
    content: `
      <div class="undertale-box">
        <div class="box-header">HEATMAP + BITMAP + GRANULARITY TRINITY</div>
        <div class="ascii-block text-sm">
Heatmap              ➔ WHERE to look (Zone 2)
Local Bitmap         ➔ WHAT is free (Units 100..147)
Granularity Metadata ➔ WHAT SIZE CLASS it supports (4 KB)
        </div>
      </div>
      <p class="quote-box mt-3">
        "Every free physical unit carries granularity metadata, ensuring allocations never mismatch physical block sizes."
      </p>
    `
  },
  {
    id: 54,
    chapter: "Chapter 7: Free Space & Lifecycle",
    zone: "truelab",
    zoneName: "Zone 06: The True Lab",
    title: "The Three-Level Allocation Decision",
    subtitle: "The Three Questions of Space Allocation",
    content: `
      <div class="grid-3-col">
        <div class="battle-card cyan-theme">
          <div class="card-title">LEVEL 1: WHERE?</div>
          <div class="card-ans">Global Zone Heatmap</div>
        </div>
        <div class="battle-card yellow-theme">
          <div class="card-title">LEVEL 2: WHICH SPACE?</div>
          <div class="card-ans">Local Bitmap</div>
        </div>
        <div class="battle-card orange-theme">
          <div class="card-title">LEVEL 3: WHAT KIND?</div>
          <div class="card-ans">Granularity Metadata</div>
        </div>
      </div>
      <div class="hl-code mt-4 text-center">
        Decision ➔ Physical Assignment ➔ Extent Appended to Z-Node
      </div>
    `
  },

  // ==========================================
  // CHAPTER 8: NAMESPACE, DIRECTORY & CRASH CONSISTENCY (Slides 55-62)
  // Zone: The Barrier (Prismatic Rainbow / Void / Showdown)
  // ==========================================
  {
    id: 55,
    chapter: "Chapter 8: Directory & Consistency",
    zone: "barrier",
    zoneName: "Zone 07: The Barrier",
    title: "Directory Architecture",
    subtitle: "Mapping Human Names to Z-Nodes",
    content: `
      <div class="pipeline-horizontal">
        <div>Path: <code>"/docs/course/notes.txt"</code></div>
        <div>➔</div>
        <div>Directory Resolver</div>
        <div>➔</div>
        <div class="hl-cyan">Z-Node ID: (Zone 3, #104)</div>
      </div>
      <div class="undertale-box mt-4">
        <div class="box-header">DESIGN PHILOSOPHY</div>
        <p>Keep the on-disk directory layout straightforward and robust. Rely on an in-memory cache for ultra-low-latency lookups.</p>
      </div>
    `
  },
  {
    id: 56,
    chapter: "Chapter 8: Directory & Consistency",
    zone: "barrier",
    zoneName: "Zone 07: The Barrier",
    title: "Hot Directory Cache",
    subtitle: "In-Memory Acceleration for Frequent Paths",
    content: `
      <div class="undertale-grid-2">
        <div class="undertale-box">
          <div class="box-header">HOT CACHE TABLE</div>
          <div class="ascii-block text-xs">
"notes.txt" ➔ Z-Node (Zone 3, #104)
"config"    ➔ Z-Node (Zone 1, #12)
"report"    ➔ Z-Node (Zone 5, #88)
          </div>
        </div>
        <div class="undertale-box">
          <div class="box-header">FAST PATH EXECUTION</div>
          <p class="hl-green">Repeated file accesses resolve in RAM instantly, avoiding disk directory traversal.</p>
        </div>
      </div>
    `
  },
  {
    id: 57,
    chapter: "Chapter 8: Directory & Consistency",
    zone: "barrier",
    zoneName: "Zone 07: The Barrier",
    title: "Why Not an Overly Complex On-Disk Directory?",
    subtitle: "Simplicity & Crash Safety over B-Tree Splitting Overhead",
    content: `
      <div class="undertale-grid-2">
        <div class="battle-card red-theme">
          <div class="card-title">COMPLEX B-TREE DISK RISKS ❌</div>
          <ul class="pixel-list">
            <li>Frequent node splitting and rebalancing.</li>
            <li>Multi-block atomic crash updates required.</li>
            <li>Complicated recovery mechanisms.</li>
          </ul>
        </div>
        <div class="battle-card green-theme">
          <div class="card-title">USERFS BALANCED DESIGN ✔</div>
          <p class="hl-yellow">Simple persistent directory structure on disk + blazing-fast in-memory hot cache.</p>
        </div>
      </div>
    `
  },
  {
    id: 58,
    chapter: "Chapter 8: Directory & Consistency",
    zone: "barrier",
    zoneName: "Zone 07: The Barrier",
    title: "Crash Consistency",
    subtitle: "Preventing State Corruption Across Multi-Step Writes",
    content: `
      <div class="undertale-dialogue">
        <div class="dialogue-avatar avatar-soul"></div>
        <div class="dialogue-text">
          A single logical file write modifies up to 5 distinct on-disk structures! What happens if power cuts halfway through?
        </div>
      </div>
      <div class="undertale-box mt-4">
        <div class="box-header">MODIFIED STRUCTURES</div>
        <div class="grid-3-col">
          <div class="pill-badge">1. Free-space Bitmap</div>
          <div class="pill-badge">2. Data Blocks</div>
          <div class="pill-badge">3. Z-Node Extents</div>
          <div class="pill-badge">4. Directory Record</div>
          <div class="pill-badge">5. Global Heatmap</div>
        </div>
      </div>
    `
  },
  {
    id: 59,
    chapter: "Chapter 8: Directory & Consistency",
    zone: "barrier",
    zoneName: "Zone 07: The Barrier",
    title: "Delta-Based Journaling",
    subtitle: "Recording Logical Transitions, Not Whole Blocks",
    content: `
      <div class="undertale-grid-2">
        <div class="undertale-box">
          <div class="box-header hl-cyan">EXAMPLE DELTA 1: JOP_SET_ZNODE</div>
          <div class="ascii-block text-xs">
JOP_SET_ZNODE {
  File = 42,
  Field = size,
  NewValue = 1024
}
          </div>
        </div>
        <div class="undertale-box">
          <div class="box-header hl-yellow">EXAMPLE DELTA 2: JOP_ADD_EXTENT</div>
          <div class="ascii-block text-xs">
JOP_ADD_EXTENT {
  File = 42,
  Zone = 5,
  Start = 100,
  Length = 8
}
          </div>
        </div>
      </div>
      <div class="quote-box mt-3">
        "Instead of writing whole 4KB blocks to the log for a 4-byte change, we journal precise logical deltas."
      </div>
    `
  },
  {
    id: 60,
    chapter: "Chapter 8: Directory & Consistency",
    zone: "barrier",
    zoneName: "Zone 07: The Barrier",
    title: "Why Delta Journaling Fits Our Architecture",
    subtitle: "Explicit Metadata Operations Match Discrete Data Structures",
    content: `
      <div class="undertale-box">
        <div class="box-header">EXPLICIT METADATA STRUCTURES</div>
        <p>Because Z-Nodes, Extents, and Bitmaps are structured explicitly, changes are expressed directly as operations:</p>
        <div class="grid-2x2 mt-3">
          <div class="feature-card"><code>CHANGE_FIELD(znode, size, val)</code></div>
          <div class="feature-card"><code>ADD_EXTENT(znode, zone, start, len)</code></div>
          <div class="feature-card"><code>MARK_BITMAP(zone, index, status)</code></div>
          <div class="feature-card"><code>UPDATE_HEATMAP(zone, run)</code></div>
        </div>
      </div>
    `
  },
  {
    id: 61,
    chapter: "Chapter 8: Directory & Consistency",
    zone: "barrier",
    zoneName: "Zone 07: The Barrier",
    title: "One Crash-Safe Allocation Transaction",
    subtitle: "The Atomic Journaled Sequence",
    content: `
      <div class="pipeline-vertical">
        <div class="pipe-row">1. Reserve physical blocks in memory</div>
        <div class="pipe-row">2. Write user data to disk</div>
        <div class="pipe-row">3. Append deltas (Z-Node + Extent + Bitmap) to Journal</div>
        <div class="pipe-row">4. Commit Journal record</div>
        <div class="pipe-row">5. Apply in-place metadata updates</div>
      </div>
      <p class="hl-green mt-3 text-center">On recovery, the journal replays committed deltas to guarantee zero orphaned blocks.</p>
    `
  },
  {
    id: 62,
    chapter: "Chapter 8: Directory & Consistency",
    zone: "barrier",
    zoneName: "Zone 07: The Barrier",
    title: "The Full Architecture (Part 1 Summary)",
    subtitle: "The Complete UserFS Architectural Map",
    content: `
      <div class="master-arch-ascii">
        <div class="ascii-block text-xs">
                          APPLICATION
                               │
                               ▼
                         FILESYSTEM API
                               │
                               ▼
                    LOGICAL / VIRTUAL LAYER
                               │
                               ▼
                      GRANULARITY DECISION (512B / 4KB / 16KB)
                               │
                               ▼
                           ALLOCATOR
                               │
               ┌───────────────┼────────────────┐
               ▼               ▼                ▼
          ZONE HEATMAP     LOCAL BITMAP    GRANULARITY TAGS
               │               │                │
               └───────────────┼────────────────┘
                               ▼
                      PHYSICAL ALLOCATION
                               │
                               ▼
                            Z-NODE ───► DIRECTORY / HOT CACHE
                               │
                        ┌──────┴──────┐
                        ▼             ▼
                     EXTENTS       METADATA
                        │
                        ▼
                   PHYSICAL DATA (IN LOCAL ZONE)
        </div>
      </div>
      <div class="end-part1-banner">
        ★ END OF PART 1 — DETERMINATION UNLOCKED ★
      </div>
    `
  },

  // ==========================================
  // CHAPTER 9: DEEP DIVE Q&A & CORE RELATIONSHIPS (Slides 63-76)
  // Zone: Final Encounter (Sans & Papyrus Battle Grid)
  // ==========================================
  {
    id: 63,
    chapter: "Chapter 9: Core Relationships & Q&A",
    zone: "encounter",
    zoneName: "Zone 08: The Final Encounter",
    title: "The Most Important Relationship",
    subtitle: "How the Core Components Cooperate",
    content: `
      <div class="undertale-grid-2">
        <div class="battle-card cyan-theme">
          <div class="card-title">ALLOCATION FLOW</div>
          <div class="ascii-block text-xs">
LOGICAL FILE: "I need 16 KB space"
      ↓
ALLOCATOR:    "Zone 2 has a 4-unit run"
      ↓
Z-NODE:       "Extent (Z2, 5000, 4) belongs to me"
      ↓
PHYSICAL DATA Written to disk!
          </div>
        </div>
        <div class="battle-card yellow-theme">
          <div class="card-title">FREE-SPACE VERIFICATION</div>
          <div class="ascii-block text-xs">
FREE-SPACE MANAGER:
  ├─ Was it free? ➔ Checked local bitmap
  ├─ Granularity? ➔ Verified 4KB tags
  └─ Which Zone?  ➔ Routed via Heatmap
          </div>
        </div>
      </div>
    `
  },
  {
    id: 64,
    chapter: "Chapter 9: Core Relationships & Q&A",
    zone: "encounter",
    zoneName: "Zone 08: The Final Encounter",
    title: "What Each Structure Knows",
    subtitle: "Master Architectural Responsibility Matrix",
    content: `
      <div class="matrix-table-wrapper">
        <table class="pixel-table text-xs">
          <thead>
            <tr>
              <th>Structure</th>
              <th>Primary Responsibility</th>
            </tr>
          </thead>
          <tbody>
            <tr><td><strong>Logical Layer</strong></td><td>Presents continuous virtual byte address space</td></tr>
            <tr><td><strong>Allocator</strong></td><td>Translates logical demand into physical allocations</td></tr>
            <tr><td><strong>Zone Heatmap</strong></td><td>Summarizes largest free runs per Zone for O(1) routing</td></tr>
            <tr><td><strong>Local Bitmap</strong></td><td>Maintains exact binary FREE/USED state in local Zone</td></tr>
            <tr><td><strong>Granularity Meta</strong></td><td>Tags physical units with size class (512B, 4K, 16K)</td></tr>
            <tr><td><strong>Z-Node</strong></td><td>Authoritative file object holding metadata & extents</td></tr>
            <tr><td><strong>Extent</strong></td><td>Represents physical span already allocated to a file</td></tr>
            <tr><td><strong>Directory</strong></td><td>Resolves human pathname strings to Z-Node IDs</td></tr>
            <tr><td><strong>Hot Cache</strong></td><td>In-memory lookup table for active path resolution</td></tr>
            <tr><td><strong>Delta Journal</strong></td><td>Records atomic logical state transitions for crash recovery</td></tr>
            <tr><td><strong>Zone</strong></td><td>Physical container collocating metadata, free-space & data</td></tr>
          </tbody>
        </table>
      </div>
    `
  },
  {
    id: 65,
    chapter: "Chapter 9: Core Relationships & Q&A",
    zone: "encounter",
    zoneName: "Zone 08: The Final Encounter",
    title: "Key Design Questions We Answered (Part 1)",
    subtitle: "Questions 1 through 4",
    content: `
      <div class="grid-2x2">
        <div class="qa-block">
          <div class="qa-q">Q1: Can a file be contiguous or fragmented?</div>
          <div class="qa-a">YES. Contiguous = 1 extent; Fragmented = multiple extents.</div>
        </div>
        <div class="qa-block">
          <div class="qa-q">Q2: Do extents manage free space?</div>
          <div class="qa-a">NO. Extents only record space ALREADY allocated to files.</div>
        </div>
        <div class="qa-block">
          <div class="qa-q">Q3: How does Z-Node know extents belong to same file?</div>
          <div class="qa-a">The Z-Node explicitly owns and stores the extent array.</div>
        </div>
        <div class="qa-block">
          <div class="qa-q">Q4: Does putting Z-Node in a Zone create ownership?</div>
          <div class="qa-a">NO. Z-Node location provides LOCALITY; extent list provides MAPPING.</div>
        </div>
      </div>
    `
  },
  {
    id: 66,
    chapter: "Chapter 9: Core Relationships & Q&A",
    zone: "encounter",
    zoneName: "Zone 08: The Final Encounter",
    title: "More Design Questions (Part 2)",
    subtitle: "Questions 5 through 8",
    content: `
      <div class="grid-2x2">
        <div class="qa-block">
          <div class="qa-q">Q5: How does variable-granularity work with binary bitmaps?</div>
          <div class="qa-a">Every physical unit carries companion granularity metadata.</div>
        </div>
        <div class="qa-block">
          <div class="qa-q">Q6: Who decides block size (512B, 4KB, 16KB)?</div>
          <div class="qa-a">The Allocator's <code>choose_granularity()</code> logic.</div>
        </div>
        <div class="qa-block">
          <div class="qa-q">Q7: Who decides where physical space comes from?</div>
          <div class="qa-a">The Allocator, using heatmap + local bitmap + granularity.</div>
        </div>
        <div class="qa-block">
          <div class="qa-q">Q8: Who remembers the final allocation?</div>
          <div class="qa-a">The file's Z-Node via its extent array.</div>
        </div>
      </div>
    `
  },
  {
    id: 67,
    chapter: "Chapter 9: Core Relationships & Q&A",
    zone: "encounter",
    zoneName: "Zone 08: The Final Encounter",
    title: "Is the Z-Node Itself the Allocator?",
    subtitle: "Clear Separation of Powers",
    content: `
      <div class="undertale-dialogue">
        <div class="dialogue-avatar avatar-soul"></div>
        <div class="dialogue-text">
          NO. The Z-Node is a passive file-descriptor object. It does not scan disks or decide allocations.
        </div>
      </div>
      <div class="undertale-grid-2 mt-4">
        <div class="undertale-box">
          <div class="box-header hl-cyan">THE ALLOCATOR</div>
          <p>The active decision maker that queries free space and computes optimal placement.</p>
        </div>
        <div class="undertale-box">
          <div class="box-header hl-yellow">THE Z-NODE</div>
          <p>The structured ledger recording what the file currently owns.</p>
        </div>
      </div>
    `
  },
  {
    id: 68,
    chapter: "Chapter 9: Core Relationships & Q&A",
    zone: "encounter",
    zoneName: "Zone 08: The Final Encounter",
    title: "What if All Free Space Is Fragmented?",
    subtitle: "Do We Lose the Contiguous Advantage?",
    content: `
      <p>We lose the ability to make <em>every</em> file contiguous, but:</p>
      <div class="undertale-box mt-3">
        <div class="box-header">WHY USERFS REMAINS ROBUST</div>
        <ul class="pixel-list">
          <li>Multiple physical regions are recorded as multiple extents under <strong>one logical file</strong>.</li>
          <li>The allocator continues preferring largest available runs to minimize fragment count.</li>
          <li>System performance degrades gracefully rather than failing allocations.</li>
        </ul>
      </div>
    `
  },
  {
    id: 69,
    chapter: "Chapter 9: Core Relationships & Q&A",
    zone: "encounter",
    zoneName: "Zone 08: The Final Encounter",
    title: "Why Not Allocate Everything in 512 B Units?",
    subtitle: "The Danger of Extreme Fine Granularity",
    content: `
      <div class="undertale-box">
        <div class="box-header">512 B ONLY: CATASTROPHIC BOOKKEEPING OVERHEAD</div>
        <p>A 1 GB file would require <strong>2,097,152 physical blocks</strong>!</p>
        <ul class="pixel-list mt-2">
          <li>Massive extent list explosion.</li>
          <li>Severe CPU overhead scanning millions of bitmap entries.</li>
          <li>Excessive memory pressure on metadata buffers.</li>
        </ul>
      </div>
      <p class="hl-green mt-3 text-center">Variable granularity gives 512B to tiny files and 16KB to big files.</p>
    `
  },
  {
    id: 70,
    chapter: "Chapter 9: Core Relationships & Q&A",
    zone: "encounter",
    zoneName: "Zone 08: The Final Encounter",
    title: "Why Not Make Everything 16 KB?",
    subtitle: "The Danger of Extreme Coarse Granularity",
    content: `
      <div class="undertale-box">
        <div class="box-header">16 KB ONLY: CATASTROPHIC INTERNAL FRAGMENTATION</div>
        <p>A 100-byte file wastes <strong>16,284 bytes (99.4% waste)</strong>.</p>
        <p class="text-sm mt-2 text-muted">In systems with millions of small config files or IoT logs, half the physical storage drive is wasted on empty padding.</p>
      </div>
      <div class="quote-box mt-3">
        "Variable granularity dynamically matches block size to file payload."
      </div>
    `
  },
  {
    id: 71,
    chapter: "Chapter 9: Core Relationships & Q&A",
    zone: "encounter",
    zoneName: "Zone 08: The Final Encounter",
    title: "The Two Fragmentation Problems, Revisited",
    subtitle: "Distinct Mechanisms for Distinct Problems",
    content: `
      <div class="undertale-grid-2">
        <div class="battle-card cyan-theme">
          <div class="card-title">INTERNAL FRAGMENTATION</div>
          <div class="card-q">Wasted bytes inside allocated blocks</div>
          <div class="card-ans hl-green">SOLVED BY: Variable Physical Granularity (512B / 4K / 16K)</div>
        </div>
        <div class="battle-card orange-theme">
          <div class="card-title">EXTERNAL FRAGMENTATION</div>
          <div class="card-q">Scattered free space holes between files</div>
          <div class="card-ans hl-yellow">SOLVED BY: Heatmaps + Contiguous-First + Multi-Extents</div>
        </div>
      </div>
    `
  },
  {
    id: 72,
    chapter: "Chapter 9: Core Relationships & Q&A",
    zone: "encounter",
    zoneName: "Zone 08: The Final Encounter",
    title: "The Complete Architectural Chain",
    subtitle: "How Every Component Links Together",
    content: `
      <div class="chain-flow-visual">
        <div class="chain-link">Variable Granularity</div>
        <div class="chain-down">↓ requires</div>
        <div class="chain-link">Granularity-Aware Free-Space Metadata</div>
        <div class="chain-down">↓ informs</div>
        <div class="chain-link">Zone Allocator (Prefers Contiguous Runs)</div>
        <div class="chain-down">↓ guided by</div>
        <div class="chain-link">Global Zone Heatmaps + Local Bitmaps</div>
        <div class="chain-down">↓ produces</div>
        <div class="chain-link">Physical Extents inside Z-Nodes (Zone Locality)</div>
      </div>
    `
  },
  {
    id: 73,
    chapter: "Chapter 9: Core Relationships & Q&A",
    zone: "encounter",
    zoneName: "Zone 08: The Final Encounter",
    title: "Best Case vs Worst Case Scenarios",
    subtitle: "Predictable Performance Across All Disk States",
    content: `
      <div class="undertale-grid-2">
        <div class="undertale-box">
          <div class="box-header hl-green">BEST CASE (Clean Storage)</div>
          <ul class="pixel-list text-xs">
            <li>Optimal granularity selected.</li>
            <li>Large contiguous free region found.</li>
            <li>Single physical extent generated.</li>
            <li>Peak sequential throughput & maximum locality.</li>
          </ul>
        </div>
        <div class="undertale-box">
          <div class="box-header hl-yellow">WORST CASE (Heavy Fragmentation)</div>
          <ul class="pixel-list text-xs">
            <li>Optimal granularity selected.</li>
            <li>No single large free run available.</li>
            <li>Multiple extents seamlessly stitched.</li>
            <li>File remains 100% readable with zero data loss.</li>
          </ul>
        </div>
      </div>
    `
  },
  {
    id: 74,
    chapter: "Chapter 9: Core Relationships & Q&A",
    zone: "encounter",
    zoneName: "Zone 08: The Final Encounter",
    title: "Why Our Design Is Flexible",
    subtitle: "Dynamic Adaptation Without Changing the User Abstraction",
    content: `
      <div class="undertale-box">
        <div class="box-header">TRIPLE ADAPTIVE CAPABILITY</div>
        <div class="grid-3-col">
          <div class="adapt-card">
            <div class="adapt-title">1. File Size</div>
            <div class="adapt-desc">Selects 512B, 4KB, or 16KB units.</div>
          </div>
          <div class="adapt-card">
            <div class="adapt-title">2. Free-Space Shape</div>
            <div class="adapt-desc">Contiguous extent or multi-extent fallback.</div>
          </div>
          <div class="adapt-card">
            <div class="adapt-title">3. Zone Locality</div>
            <div class="adapt-desc">Collocates metadata near active data.</div>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 75,
    chapter: "Chapter 9: Core Relationships & Q&A",
    zone: "encounter",
    zoneName: "Zone 08: The Final Encounter",
    title: "The Core Innovation of UserFS",
    subtitle: "Not Isolated Features — Their Symbiotic Interaction",
    content: `
      <div class="undertale-box">
        <div class="box-header">THE NOVELTY IS IN THE INTERACTION</div>
        <div class="ascii-block text-xs">
               VARIABLE GRANULARITY
                       │
                       ▼
          GRANULARITY-AWARE FREE SPACE
                       │
                       ▼
                 ZONE ALLOCATOR
                       │
                       ▼
           CONTIGUOUS-FIRST PLACEMENT
             ┌─────────┴─────────┐
             ▼                   ▼
        ONE EXTENT         MULTIPLE EXTENTS
             │                   │
             └─────────┬─────────┘
                       ▼
                     Z-NODE (Zone Locality)
        </div>
      </div>
    `
  },
  {
    id: 76,
    chapter: "Chapter 9: Core Relationships & Q&A",
    zone: "encounter",
    zoneName: "Zone 08: The Final Encounter",
    title: "Why the Architecture Is Coherent",
    subtitle: "Single Responsibility Principle Across the Entire Stack",
    content: `
      <div class="coherence-grid">
        <div class="coh-item"><strong>Logical Layer:</strong> What the file looks like to apps.</div>
        <div class="coh-item"><strong>Allocator:</strong> What physical space it receives.</div>
        <div class="coh-item"><strong>Free-Space Manager:</strong> What space is free.</div>
        <div class="coh-item"><strong>Granularity Metadata:</strong> What kind of space is free.</div>
        <div class="coh-item"><strong>Zone Heatmap:</strong> Where promising space exists.</div>
        <div class="coh-item"><strong>Extent:</strong> Which physical space belongs to the file.</div>
        <div class="coh-item"><strong>Z-Node:</strong> Complete file-to-physical mapping context.</div>
        <div class="coh-item"><strong>Zone:</strong> Physical environment keeping it all local.</div>
      </div>
    `
  },

  // ==========================================
  // CHAPTER 10: TESTING, INVARIANTS & MASTER SUMMARY (Slides 77-86)
  // Zone: The Surface (Golden Sunrise / Green Hills / Determination)
  // ==========================================
  {
    id: 77,
    chapter: "Chapter 10: Testing & Invariants",
    zone: "surface",
    zoneName: "Zone 09: The Surface",
    title: "Testing the Architecture",
    subtitle: "Independent Validation of Each Architectural Claim",
    content: `
      <div class="undertale-grid-2">
        <div class="undertale-box">
          <div class="box-header">1. VARIABLE GRANULARITY TEST</div>
          <p class="text-xs">Create Tiny (100B), Medium (12KB), and Large (1MB) files. Validate allocation size classes on disk.</p>
        </div>
        <div class="undertale-box">
          <div class="box-header">2. METADATA SYNCHRONIZATION TEST</div>
          <p class="text-xs">Verify bitmap FREE/USED state matches granularity tag consistency across all zones.</p>
        </div>
        <div class="undertale-box">
          <div class="box-header">3. CONTIGUITY VERIFICATION</div>
          <p class="text-xs">Verify single extent assignment on clean disks.</p>
        </div>
        <div class="undertale-box">
          <div class="box-header">4. Z-NODE LOCALITY TEST</div>
          <p class="text-xs">Verify Z-Node and primary data belong to same Zone.</p>
        </div>
      </div>
    `
  },
  {
    id: 78,
    chapter: "Chapter 10: Testing & Invariants",
    zone: "surface",
    zoneName: "Zone 09: The Surface",
    title: "Integration Testing",
    subtitle: "End-to-End Forward Write and Backward Read Paths",
    content: `
      <div class="undertale-grid-2">
        <div class="battle-card cyan-theme">
          <div class="card-title">FORWARD WRITE PATH</div>
          <div class="ascii-block text-xs">
Create ➔ Directory ➔ Z-Node ➔ Granularity ➔ 
Allocator ➔ Heatmap ➔ Local Bitmap ➔ 
Granularity Tag ➔ Physical Space ➔ Extent ➔ Write
          </div>
        </div>
        <div class="battle-card green-theme">
          <div class="card-title">REVERSE READ PATH</div>
          <div class="ascii-block text-xs">
Read ➔ Directory ➔ Z-Node ➔ 
Extent Lookup ➔ Physical Disk Read ➔ 
Reconstruct Logical File Stream
          </div>
        </div>
      </div>
    `
  },
  {
    id: 79,
    chapter: "Chapter 10: Testing & Invariants",
    zone: "surface",
    zoneName: "Zone 09: The Surface",
    title: "The Fragmentation Stress Test",
    subtitle: "Forcing Checkerboard Layouts to Validate Multi-Extents",
    content: `
      <div class="undertale-box">
        <div class="box-header">EXPERIMENT SETUP</div>
        <div class="pipeline-horizontal text-xs">
          <div>Create A, B, C, D</div>
          <div>➔</div>
          <div>Delete B, D</div>
          <div>➔</div>
          <div>Allocate Large File E</div>
        </div>
      </div>
      <div class="undertale-box mt-3">
        <div class="box-header">EXPECTED RESULTS</div>
        <ul class="pixel-list text-xs">
          <li>No single contiguous free run exists for File E.</li>
          <li>Allocator stitches multiple extents from deleted holes.</li>
          <li>Z-Node records multiple extents; file remains 100% byte-exact.</li>
        </ul>
      </div>
    `
  },
  {
    id: 80,
    chapter: "Chapter 10: Testing & Invariants",
    zone: "surface",
    zoneName: "Zone 09: The Surface",
    title: "Persistence & Remount Testing",
    subtitle: "Validating On-Disk State Across Power Cycles",
    content: `
      <div class="pipeline-horizontal text-xs">
        <div>Format</div> ➔ <div>Mount</div> ➔ <div>Write Files</div> ➔ 
        <div>Unmount</div> ➔ <div>Remount</div> ➔ <div>Verify MD5 Hash</div>
      </div>
      <div class="undertale-box mt-4">
        <div class="box-header">TEST VALIDATION</div>
        <p class="hl-green">All logical byte streams match byte-for-byte before and after unmount/remount operations.</p>
      </div>
    `
  },
  {
    id: 81,
    chapter: "Chapter 10: Testing & Invariants",
    zone: "surface",
    zoneName: "Zone 09: The Surface",
    title: "Crash Recovery Testing",
    subtitle: "Simulated Power Failure Mid-Transaction",
    content: `
      <div class="undertale-box">
        <div class="box-header">INTERRUPT SYSTEM MID-OPERATION</div>
        <p class="text-xs">Force sudden kill during: Space Allocation, Z-Node Update, Directory Link, or Bitmap Toggle.</p>
      </div>
      <div class="undertale-grid-2 mt-3">
        <div class="battle-card yellow-theme">
          <div class="card-title">REMOUNT & REPLAY</div>
          <p class="text-xs">Journal replays committed deltas and rolls back incomplete operations.</p>
        </div>
        <div class="battle-card green-theme">
          <div class="card-title">INVARIANT CHECK</div>
          <p class="text-xs">Zero orphaned blocks, zero invalid extent pointers, zero directory ghosts.</p>
        </div>
      </div>
    `
  },
  {
    id: 82,
    chapter: "Chapter 10: Testing & Invariants",
    zone: "surface",
    zoneName: "Zone 09: The Surface",
    title: "Core Filesystem Invariants",
    subtitle: "The Five Mathematical Laws of UserFS",
    content: `
      <div class="invariants-list">
        <div class="inv-card"><strong>1. Allocation Invariant:</strong> A physical region cannot simultaneously be FREE and owned by a file.</div>
        <div class="inv-card"><strong>2. Mapping Invariant:</strong> Every Z-Node extent must reference valid allocated physical space.</div>
        <div class="inv-card"><strong>3. Granularity Invariant:</strong> Physical space described by an extent must match its allocation metadata tag.</div>
        <div class="inv-card"><strong>4. Directory Invariant:</strong> Every valid directory entry must resolve to a valid Z-Node.</div>
        <div class="inv-card"><strong>5. Root Invariant:</strong> The filesystem must always maintain an immutable, valid root directory.</div>
      </div>
    `
  },
  {
    id: 83,
    chapter: "Chapter 10: Testing & Invariants",
    zone: "surface",
    zoneName: "Zone 09: The Surface",
    title: "The Complete File Lifecycle",
    subtitle: "Creation ➔ Growth ➔ Deletion Reversal",
    content: `
      <div class="lifecycle-dual-grid">
        <div class="undertale-box">
          <div class="box-header hl-green">CREATION & GROWTH</div>
          <div class="ascii-block text-xs">
Create ➔ Directory ➔ Z-Node ➔ 
Granularity ➔ Heatmap ➔ 
Allocate ➔ Extent ➔ Write ➔ Journal
          </div>
        </div>
        <div class="undertale-box">
          <div class="box-header hl-red">DELETION (Exact Reversal)</div>
          <div class="ascii-block text-xs">
Delete ➔ Read Extents ➔ 
Free Physical Blocks ➔ 
Update Local Bitmap + Granularity ➔ 
Update Heatmap ➔ Remove Dir Entry
          </div>
        </div>
      </div>
    `
  },
  {
    id: 84,
    chapter: "Chapter 10: Testing & Invariants",
    zone: "surface",
    zoneName: "Zone 09: The Surface",
    title: "The Complete Architecture",
    subtitle: "The Full End-to-End Blueprint of UserFS",
    content: `
      <div class="master-arch-ascii">
        <div class="ascii-block text-xs">
                         APPLICATION
                              │
                              ▼
                           FILE API
                              │
                              ▼
                LOGICAL / VIRTUAL BLOCK LAYER
                              │
                              ▼
                    FILE SIZE / GROWTH NEED
                              │
                              ▼
                    GRANULARITY SELECTION (512B / 4KB / 16KB)
                              │
                              ▼
                           ALLOCATOR
                              │
                 ┌────────────┼────────────┐
                 ▼            ▼            ▼
             HEATMAP       BITMAP     GRANULARITY TAGS
                 │            │            │
                 └────────────┼────────────┘
                              ▼
                         PHYSICAL SPACE
                              │
                              ▼
                            Z-NODE (In Local Zone)
                              │
                         EXTENT ARRAY
                              │
                 ┌────────────┼────────────┐
                 ▼            ▼            ▼
               DATA         DATA         DATA
                              │
                              ▼
                         PHYSICAL DISK
        </div>
      </div>
    `
  },
  {
    id: 85,
    chapter: "Chapter 10: Testing & Invariants",
    zone: "surface",
    zoneName: "Zone 09: The Surface",
    title: "The One-Sentence Explanation",
    subtitle: "The Essence of UserFS",
    quote: "UserFS presents a logical filesystem to the application, translates logical file storage into variable-sized physical allocations through a Zone-aware allocator, records those allocations as extents inside Zone-local Z-Nodes, uses granularity-aware local free-space metadata and global heatmaps to find space efficiently, and uses journaling to keep the resulting metadata consistent.",
    content: `
      <div class="undertale-dialogue mt-4">
        <div class="dialogue-avatar avatar-soul"></div>
        <div class="dialogue-text">
          * Knowing that such a clean filesystem architecture exists... it fills you with DETERMINATION.
        </div>
      </div>
    `,
    type: "quote"
  },
  {
    id: 86,
    chapter: "Chapter 10: Testing & Invariants",
    zone: "surface",
    zoneName: "Zone 09: The Surface",
    title: "Final Takeaway",
    subtitle: "Adapting Physical Representation While Preserving Logical Elegance",
    content: `
      <div class="undertale-grid-2">
        <div class="battle-card green-theme">
          <div class="card-title">WHEN DISK IS CLEAN</div>
          <div class="hl-code">Contiguous Allocation ➔ 1 Extent ➔ Peak Throughput</div>
        </div>
        <div class="battle-card yellow-theme">
          <div class="card-title">WHEN DISK IS FRAGMENTED</div>
          <div class="hl-code">Multiple Extents ➔ Seamless Logical File View</div>
        </div>
      </div>

      <div class="undertale-box mt-3">
        <div class="box-header"><span class="pixel-star">★</span> TEAM AURA — CONCLUSION</div>
        <p class="hl-yellow text-center text-lg mt-1">
          "The filesystem adapts the physical representation to the state of the disk while preserving one stable logical view to the user."
        </p>
      </div>

      <div class="save-point-visual mt-3">
        <span class="pixel-star-large">★</span>
        <span class="save-text">FILE SAVED. THANK YOU!</span>
      </div>
    `,
    type: "final"
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SLIDES_DATA };
}
