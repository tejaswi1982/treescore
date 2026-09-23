# TreeScore Boundary Assumptions — v0.2

Per-locality record of how each v0.2 analysis area was reasoned, and what was deliberately left in or out. Confidence is `medium` for all three: correctly placed in coordinate space, but hand-reasoned approximations rather than basemap-traced lines.

---

## Andheri West Core (`andheri-west-core`)

**Footprint area:** ~4.81 sq km (tightened from v0.1's 5.46 sq km)

**Edges**
- **East:** held west of the Western Railway line (Andheri station ~72.847 sits *outside*, east of the polygon) to avoid Andheri East.
- **West:** ~72.817, the Versova-side urban edge — not the full coast/village.
- **North:** ~19.137, stopping short of deep Lokhandwala / Oshiwara.
- **South:** ~19.119, above Juhu (no overlap with the Juhu polygon).

**Included:** Seven Bungalows, Four Bungalows, DN Nagar, Azad Nagar, station-side west-of-railway core.
**Excluded:** Andheri East, anything east of the railway, Jogeshwari West, deep Lokhandwala/Oshiwara extensions, Juhu, full Versova village/coast.

**Why "Core":** v0.1 inspection showed the polygon covered the western core but not the wider Lokhandwala/Oshiwara footprint many call "Andheri West." Naming it *Core* avoids implying full coverage. A separate "Andheri West Extended" can be added later.

---

## Powai Lake + Urban Area (`powai-lake-urban-area`)

**Footprint area:** ~3.57 sq km land (lake excluded; tightened sharply from v0.1's 6.17 sq km)

**Edges**
- **Outer:** roughly W 72.890 / E 72.912 / N 19.131 / S 19.110 — focused on the Hiranandani + lake-edge + JVLR-side urban fabric.
- **Inner ring (hole):** the main Powai Lake water body, cut out so it doesn't count as land.

**Included:** central Powai urban fabric, Hiranandani-area residential-commercial, lake-edge neighbourhood, urban Powai toward JVLR.
**Excluded:** the lake water body (hole), the IIT-Bombay interior/institutional green (marker ~72.913,19.133 sits outside the NE edge), Vikhroli, Sanjay Gandhi National Park, Aarey influence zone, Bhandup/Kanjurmarg, large hill/forest tracts.

**Why tightened:** v0.1's high green-cover reading was partly an artefact of surrounding institutional/forest green that isn't the Powai *neighbourhood*. v0.2 measures the lived urban Powai, while still retaining genuine in-neighbourhood green (we don't carve out real green — only the lake and out-of-area forest).

**Still required in GEE:** water masking, as a backstop to the approximate lake hole.

---

## Juhu (`juhu`)

**Footprint area:** ~2.83 sq km (tightened from v0.1's 3.46 sq km)

**Edges**
- **West:** ~72.825, the Arabian Sea beach edge, nudged slightly east of v0.1 to keep dry sand / surf out of the land denominator.
- **East:** ~72.836, toward Juhu Tara Road / central Juhu residential.
- **North:** ~19.117, below Andheri West Core.
- **South:** ~19.091, short of Vile Parle/Santacruz.

**Included:** Juhu residential/coastal neighbourhood, beach edge as the western side, Juhu Tara / central Juhu, Juhu Scheme-style residential fabric.
**Excluded:** Vile Parle, Santacruz, Andheri West, Versova, airport land, and excess beach/sea area.

**Why unchanged in name:** already conservative and well-placed in v0.1; only the beach edge was tightened.

---

## Cross-cutting caveat

Because the three areas differ in how much coast, lake-edge, and dense built-up land they contain, a green-cover ranking between them partly reflects where the lines were drawn — not purely real vegetation. Fine for a v0.2 beta; it's the reason the "TreeScore-defined analysis area" label is accurate rather than just cautious. Tracing these to `high` confidence against a basemap is what would make a published Juhu-vs-Powai-vs-Andheri ranking defensible.
