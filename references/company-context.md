# Company Context Reference

Framework for building the investor-grade context engine on the Overview page.
Covers business description, revenue streams, regional operations, value chain
positioning, threats/opportunities, and key drivers. This section transforms
the Overview from a metrics-only snapshot into a full strategic landscape view.

---

## 1. Company Description & Industry Primer

**Objective:** Help an intelligent non-specialist investor understand what the
company does and where it fits, in under 60 seconds of reading.

### Gathering approach

Run 2-3 targeted web searches:
1. `"[company name] business description what does [company] do"`
2. `"[company name] annual report business overview [year]"` — 10-K filings are the gold standard
3. `"[industry name] value chain explained"` — for specialized/technical industries

### Structure

**Industry primer (if needed):**
Required when the company operates in a technical, specialized, or non-obvious
industry. Write 2-4 sentences that teach the broader system before placing the
company inside it.

Trigger heuristic — write an industry primer if ANY of these are true:
- The company's primary industry is not one of: consumer retail, banking,
  insurance, real estate, telecoms, airlines, restaurants, media/entertainment
- The company sells B2B products that end users never see
- The industry involves complex supply chains or multi-step manufacturing
- Understanding the company requires understanding a technical process
  (e.g., semiconductor fab, drug discovery pipeline, upstream oil)

**Template:**
```
[Industry] Primer:
[2-4 sentences explaining the broader industry system in plain English.
Start with the end product or service that consumers/businesses use.
Work backward through the chain to explain what gets made, who makes it,
and what inputs/tools/services are needed. Then introduce the company's role.]

[Company name] [verb — designs / manufactures / provides / operates]:
[1-2 sentences: what the company specifically does, its primary product or
service, and its target customer type.]

Founded [year]. Headquartered in [city, country]. [Market position — e.g.,
"one of the three largest", "the leading pure-play", "a niche provider of"].
```

**Example (for a company like ACMR):**
```
Semiconductor Manufacturing Primer:
Most electronic devices run on chips, which are manufactured in specialized
factories called fabs. Chips are built on silicon wafers through hundreds of
processing steps including deposition, lithography, etching, and cleaning.
Each step must be contamination-free — even a microscopic particle can
destroy a chip. This creates demand for specialized cleaning and treatment
equipment used throughout the manufacturing process.

ACM Research designs and manufactures advanced wafer cleaning and
processing equipment used by semiconductor fabs during chip production.
Its tools remove contaminants between manufacturing steps using proprietary
cleaning technologies.

Founded 1998. Headquartered in Fremont, CA. A niche but growing player
in the wafer cleaning equipment segment, competing with larger firms like
SCREEN Holdings, Tokyo Electron, and Lam Research.
```

### Quality rules
- Never use jargon without explaining it first
- Always start from the end product and work backward
- Keep the primer factual — no promotional language
- If the company has changed its business model significantly (e.g., pivot
  from hardware to SaaS), note both the current and legacy model
- For conglomerates, name the 2-3 largest segments and note the company
  is diversified

---

## 2. Revenue Streams

**Objective:** Show where the money comes from, how diversified the business is,
and what each revenue line actually represents.

### Gathering approach

Run 1-2 web searches:
1. `"[company name] revenue breakdown by segment [year]"`
2. `"[company name] 10-K revenue segments [year]"` — SEC filings have definitive data

### Data structure per revenue stream

```javascript
{
  name: "Cloud Services",                    // segment name
  revenuePct: 42,                            // % of total revenue
  revenueAmt: "$38.2B",                      // absolute revenue if available
  description: "Includes Azure, AI services, and enterprise cloud infrastructure.",
  whyItMatters: "Cloud is the primary growth engine and highest-margin business.",
  primer: "Cloud computing allows companies to rent computing power, storage, and software over the internet instead of buying and maintaining their own servers...",  // only if technical/niche
  status: "growing",                         // growing | shrinking | stable | cyclical
  marginNote: "High-margin (~45% operating margin)",
  riskNote: "Competitive pressure from AWS and GCP on pricing",
  isGrowing: true,
  growthRate: "+23% YoY"                     // if available
}
```

### Visualization: Revenue Mix Donut Chart

- Use a Recharts `PieChart` with inner radius (donut style)
- Maximum 6 visible slices — group anything <5% into "Other"
- Color palette: use the institutional accent blue as primary, then cycle
  through muted complementary tones (see color assignments below)
- Label each slice with segment name and percentage
- Center of donut shows total revenue figure
- On slice hover: highlight with slight opacity change
- On slice click (or via toggle buttons): show that stream's detail panel

**Donut color cycle:**
```
Slice 1: #2563EB (accent blue)
Slice 2: #6B9BD2 (soft blue)
Slice 3: #5B9E8F (muted teal)
Slice 4: #D97706 (caution amber)
Slice 5: #8B5CF6 (muted violet)
Slice 6: #A0AEC0 (neutral gray — typically "Other")
```

### Toggle interaction for stream details

Only ONE stream's detail explanation is shown at a time. Implement as:
1. A row of small pill-style toggle buttons (one per segment, color-matched to donut)
2. The currently selected segment's pill is filled; others are outlined
3. Below the buttons, show the selected segment's detail card:
   - Segment name + revenue share + growth rate badge
   - Description (1-2 sentences)
   - Why it matters (1 sentence)
   - Primer (if applicable — 2-3 sentences explaining the niche)
   - Status badge (Growing / Shrinking / Stable / Cyclical)
   - Margin note
   - Risk note
4. Default: show the largest segment on page load

---

## 3. Regional Operations

**Objective:** Show geographic revenue/operations mix and highlight exposure
to specific markets.

### Gathering approach

Run 1 web search:
1. `"[company name] revenue by region geography [year]"` or
   `"[company name] 10-K geographic revenue breakdown"`

If geographic data is not publicly broken out, note "Geographic breakdown
not disclosed" and skip the regional chart. Do not fabricate regional splits.

### Data structure per region

```javascript
{
  region: "China",
  revenuePct: 55,
  significance: "Primary growth market. Majority of new fab construction driving equipment demand.",
  riskFactors: ["Geopolitical tension", "Export control regulations", "Currency risk"],
  growthOutlook: "High growth but elevated regulatory risk",
  isConcentrated: true   // flag if >40% of revenue from single region
}
```

### Visualization: Regional Mix Donut Chart

Same donut style as revenue mix, but with geography-appropriate muted colors:
```
North America: #2563EB
China: #DC2626 (muted)
Europe: #5B9E8F
APAC ex-China: #D97706
Rest of World: #A0AEC0
```

- If one region is >50%, visually flag it (bold label, or small "⚠ Concentrated" badge)
- Below the chart, show a compact region detail row for each region:
  significance + key risk factor + growth outlook

---

## 4. Value Chain Positioning

**Objective:** Place the company inside its industry value chain(s) so the user
can see upstream suppliers, downstream customers, and adjacent competitors.

### Gathering approach

Run 1-2 web searches:
1. `"[industry] value chain diagram"`
2. `"[company name] customers suppliers competitors"` — annual report language

### Data structure

Each stage now includes an `explanation` field — a plain-English description written
for finance professionals who may not be industry specialists. The language should be
technically accurate but accessible, explaining what actually happens at that stage,
why it matters to the chain, and who the key players are.

```javascript
{
  chainName: "Semiconductor Equipment",      // name of the value chain
  stages: [
    {
      name: "Raw Materials",
      desc: "Silicon ingots, chemicals, gases",
      companyHere: false,
      explanation: "This is where the physical inputs originate. Companies mine and refine ultra-pure silicon into cylindrical ingots, which are sliced into wafers — the thin discs that chips are built on. Specialty chemical firms also supply the photoresists, etchants, and process gases that make fabrication possible. Think of this as the 'ingredients' stage. Key players include Shin-Etsu Chemical and SUMCO for silicon, and Entegris for specialty materials.",
      keyPlayers: ["Shin-Etsu Chemical", "SUMCO", "Entegris"],
    },
    {
      name: "Equipment Manufacturing",
      desc: "Tools for deposition, etch, lithography, cleaning",
      companyHere: true,
      companyRole: "Wafer cleaning equipment",
      explanation: "Equipment manufacturers build the highly specialized machines that fabs use to pattern circuits onto silicon wafers. Each tool handles a specific step — depositing thin films, etching patterns, or cleaning contaminants between steps. These machines cost $10M–$350M each and require extreme precision (measured in nanometers). This stage has enormous pricing power because switching costs are very high — once a fab qualifies a tool, replacing it risks months of lost production.",
      keyPlayers: ["ASML", "Applied Materials", "Lam Research", "Tokyo Electron"],
    },
    {
      name: "Chip Fabrication (Fabs)",
      desc: "TSMC, Samsung, Intel — manufacture chips on wafers",
      companyHere: false,
      explanation: "Fabrication plants ('fabs') are where chips are actually made. A single wafer goes through hundreds of processing steps over 2-3 months. Building a leading-edge fab costs $15-20 billion and requires thousands of equipment tools working in sequence. This is the most capital-intensive stage in the chain. The industry has consolidated heavily — TSMC alone manufactures over 50% of the world's advanced chips.",
      keyPlayers: ["TSMC", "Samsung Foundry", "Intel Foundry"],
    },
    {
      name: "Packaging & Testing",
      desc: "Assemble and test finished chips",
      companyHere: false,
      explanation: "After fabrication, individual chip 'dies' are cut from the wafer, packaged into protective casings with electrical connections, and tested for defects. Advanced packaging (like chip stacking and chiplets) is becoming a key differentiator as it allows combining multiple chip types into one package. This stage is growing in strategic importance as traditional transistor scaling slows down.",
      keyPlayers: ["ASE Technology", "Amkor", "JCET"],
    },
    {
      name: "End Products",
      desc: "Phones, servers, cars, consumer electronics",
      companyHere: false,
      explanation: "The final demand layer — companies that design and sell products containing semiconductors. This includes consumer electronics (Apple, Samsung phones), data center infrastructure (cloud providers buying AI accelerators), and automotive (electric vehicles requiring 3-5x more chips than traditional cars). Demand signals from this stage ripple backward through the entire chain, driving equipment orders 12-18 months later.",
      keyPlayers: ["Apple", "NVIDIA", "Tesla", "AWS"],
    },
  ],
  upstreamNote: "Suppliers include specialty chemical firms and precision component makers.",
  downstreamNote: "Primary customers are large semiconductor fabs — TSMC, Samsung, SK Hynix.",
  adjacentCompetitors: ["SCREEN Holdings", "Tokyo Electron", "Lam Research"],
}
```

**Writing guidelines for stage explanations:**
- Write for a finance professional who understands business and markets but may not know the specific industry
- Lead with WHAT happens at this stage, then WHY it matters economically
- Include concrete numbers when helpful (costs, market shares, timelines) — these ground the explanation
- Mention key players by name so the reader can orient themselves
- Explain any industry jargon in-line (e.g., "fabs" = fabrication plants)
- Keep each explanation to 3-5 sentences — enough to be useful without being a textbook
- Be technically accurate but avoid assuming the reader knows acronyms or processes

### Visualization: Interactive Horizontal Value Chain Flowchart

Render as a horizontal row of connected **clickable** boxes (left to right = upstream to downstream).
Each stage box is clickable — on click, it expands an inline detail panel below the diagram
showing the stage explanation, key players, and (for the company's stage) why the company's
position matters.

```
┌──────────┐    ┌──────────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Raw    │ →  │    Equipment     │ →  │     Chip     │ →  │  Packaging   │ →  │     End      │
│ Materials│    │  Manufacturing   │    │ Fabrication  │    │  & Testing   │    │   Products   │
└──────────┘    │  ★ COMPANY HERE  │    └──────────────┘    └──────────────┘    └──────────────┘
                └──────────────────┘
  [click any box to see what happens at that stage and why it matters]
```

- Every stage box has `cursor: pointer`, a hover state (shadow lift), and a small `ⓘ` or
  expand affordance indicating it's clickable
- The company's stage is highlighted with accent blue background + border
- Other stages use neutral/light backgrounds
- Arrow connectors between stages (simple `→` characters)
- Clicking a stage expands an inline detail panel below the full chain showing:
  the stage explanation, key players as small pills, and for the company's stage,
  an additional note about the company's specific role and competitive position
- Only one stage detail panel is open at a time (clicking another stage closes the previous)
- Below the chain: upstream note (left-aligned) and downstream note (right-aligned)
- If multiple value chains apply, use toggle buttons above the diagram to switch

### Toggle for multiple chains

If the company participates in 2+ distinct value chains (e.g., a company that
sells both equipment and software to different industries), implement:
1. Small toggle pills above the diagram: "Chain 1: [name]" | "Chain 2: [name]"
2. Only one chain visible at a time
3. Each chain has its own stages, highlighting, and notes

---

## 5. Threats and Opportunities

**Objective:** Structured risk/upside assessment — not a vague list, but a
decision-useful framework showing magnitude and direction.

### Gathering approach

Extract from prior research (annual reports, news articles, analyst reports).
No additional searches needed — synthesize from data gathered in Steps 2, 6, 7.

### Data structure

```javascript
{
  threats: [
    {
      factor: "Geopolitical Risk — China Export Controls",
      description: "Tightening US export restrictions could limit sales to Chinese fabs, which represent 55% of revenue.",
      magnitude: "very high",     // low | moderate | high | very high
      affectsWhat: "revenue",     // revenue | margins | sentiment | valuation | multiple
      currentStatus: "headwind"   // tailwind | headwind | neutral | uncertain
    },
    // ... more threats
  ],
  opportunities: [
    {
      factor: "AI-Driven Semiconductor Capex Expansion",
      description: "Massive investment in AI chips is driving new fab construction globally, expanding the addressable market for cleaning equipment.",
      magnitude: "high",
      affectsWhat: "revenue",
      currentStatus: "tailwind"
    },
    // ... more opportunities
  ]
}
```

### Visualization

Two-column layout:
- Left column: Threats (header in muted red)
- Right column: Opportunities (header in muted teal)

Each item:
- Factor name (bold)
- Magnitude badge (pill: Very High = red, High = amber, Moderate = gray, Low = light gray)
- 1-2 sentence description
- "Affects: Revenue" tag
- Current status pill: Tailwind (teal) | Headwind (red) | Neutral (gray)

Target: 3-5 threats and 3-5 opportunities. Prioritize by magnitude.

---

## 6. Key Drivers / Largest Movers

**Objective:** Identify the 4-6 most important variables that move the stock or
change revenue expectations materially.

### Gathering approach

Extract from prior research. Supplement with 1 optional web search:
1. `"[company name] key revenue drivers what moves the stock"` (if needed)

### Data structure per driver

```javascript
{
  driver: "Semiconductor Capital Expenditure Cycle",
  description: "The global semiconductor industry invests ~$150B+ annually in new fab equipment. ACMR's revenue directly tracks this capex cycle.",
  affects: "revenue",            // revenue | margins | sentiment | valuation
  magnitude: "very high",       // low | moderate | high | very high
  currentDirection: "tailwind", // tailwind | headwind | neutral
  directionNote: "AI demand driving record capex in 2024-2026, especially in advanced nodes."
}
```

### Visualization: Driver Cards

Horizontal scrollable row or 2-column grid of compact cards:

```
┌─────────────────────────────────────────┐
│  ◎ Semiconductor Capex Cycle            │
│  Affects: Revenue  │ Magnitude: V. High │
│  ↗ TAILWIND                             │
│  AI demand driving record capex in...   │
└─────────────────────────────────────────┘
```

- Direction arrow: ↗ tailwind (teal), ↘ headwind (red), → neutral (gray)
- Magnitude badge: same color scale as threats/opportunities
- Keep cards compact — 3-4 lines max per card
- Target: 4-6 drivers, sorted by magnitude descending

---

## 7. ETF Adaptation

For ETFs, the context section adapts:

- **Description:** What the ETF tracks, the index methodology, the sponsor,
  inception date, and investment objective
- **Revenue Streams → Holdings Breakdown:** Replace revenue streams with top
  sector/industry allocation donut chart
- **Regional Operations:** Geographic allocation of holdings (not revenue)
- **Value Chain:** Replace with "Market Segment Positioning" — where the ETF
  sits in the investment landscape (e.g., Broad Market → Large Cap → US → Growth)
- **Threats/Opportunities:** Index-level risks (concentration, sector tilt,
  rebalancing methodology, tracking error)
- **Key Drivers:** Macro factors that drive the index (rates, earnings growth,
  sector rotation, fund flows)

---

## 8. Integration with SKILL.md

This reference supports:

**Step 2 (Gather Historical Data) — expanded scope:**
Add 1-2 web searches for company description and segment data alongside
the existing financial data gathering.

**Step 10 (Assemble Dashboard), Page 1 — Overview:**
After the existing header, metrics strip, and price/volume chart, add the
Context section as a collapsible block below the chart. The context section
should be expanded by default and contain:

1. Company Description & Industry Primer
2. Revenue Streams (donut chart + toggle detail panels)
3. Regional Operations (donut chart + region detail rows) — if geographic data available
4. Value Chain Positioning (horizontal flowchart + toggle for multiple chains)
5. Threats & Opportunities (two-column layout)
6. Key Drivers / Largest Movers (card grid)

All subsections are visible on the Overview page. Revenue stream details and
value chain views use inline toggles to manage information density.

---

## 9. UI/UX Design Principles for Context Section

These rules were developed by consulting both UI design and equities research
best practices:

### Layout hierarchy
1. Company description + primer = first thing the user reads (top of context area)
2. Revenue mix donut + regional donut = side-by-side if space allows, stacked on narrow
3. Value chain = full-width horizontal diagram
4. Threats/Opportunities = two-column, balanced layout
5. Key Drivers = card grid, compact

### Interaction design
- **Toggles > scroll:** Use toggle buttons to switch between revenue streams,
  value chains — never dump all details on screen simultaneously
- **Progressive disclosure:** Show the most important slice/chain by default;
  let user click for others
- **Donut > pie:** Inner radius creates space for the total figure and looks
  less dated than solid pie charts
- **Consistent badges:** All magnitude, status, and type badges use the same
  pill style and color scale throughout
- **No decorative charts:** Every chart must answer a question (what % of
  revenue? what's the geographic mix?). If a chart wouldn't be useful, skip it.

### Data visualization rules
- Max 6 slices in any donut chart
- Always label percentages on slices (not just in legend)
- Group slices <5% into "Other"
- Use the institutional light palette (off-white background, subtle borders)
- Donut charts: inner radius = 60%, outer radius = 80% of available space
- Avoid 3D, shadows, or gradient fills on charts

### Typography
- Section headers: 13px, weight 700, uppercase, letter-spacing 1px, muted text color
- Body text: 13px, weight 400, textBody color, line-height 1.6
- Data labels: 11px monospace for numbers, 12px sans-serif for names
- Badges: 10px, weight 600, pill shape, colored background

### Research methodology
- Revenue segment data must come from 10-K/annual report (most authoritative)
  or reputable financial data providers
- Geographic breakdown: same sourcing priority
- Value chain: can be constructed from industry knowledge + company filings
- Threats/opportunities: synthesized from news, analyst reports, filings —
  not made up. Each factor must be traceable to a source.
- Key drivers: must reflect real operational or market variables, not generic
  platitudes like "execution risk" or "market conditions"
