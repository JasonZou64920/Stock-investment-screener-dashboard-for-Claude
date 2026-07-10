# News & Sentiment Analysis Framework

How to gather, assess, deduplicate, and synthesize news into aggregate sentiment using advanced multi-dimensional analysis.

## Search Strategy

Run 3-5 distinct web searches per ticker:
1. "[ticker] stock/ETF news"
2. "[company/fund name] latest news [year]"
3. "[ticker] analyst rating upgrade downgrade"
4. "[ticker] earnings revenue results"
5. "[company name] risks concerns"

ETFs: also search fund flows and index outlook.

## Time Window

Primary: trailing 30 days. Extend to 60 if <15 articles, 90 if very thin. Always include most recent earnings within 90 days.

## Target Volume

20-30 articles ideal. Minimum 8 for credible assessment. Below 8: label "Limited Coverage" with caveat.

## Source Tiers

- **Tier 1 (highest weight):** Bloomberg, Reuters, WSJ, FT, Barron's, company PRs, SEC filings, earnings transcripts.
- **Tier 2:** CNBC, MarketWatch, Seeking Alpha, Yahoo Finance, IBD, trade press.
- **Tier 3 (downweight):** Aggregators, social summaries, sponsored content.
- **Exclude:** No-author articles, auto-generated summaries, forums.

## Article Processing

Capture per article: title, source, author, date, url, sentiment_tag, key_point, theme, source_tier.

### Sentiment Tags
- **Positive**: supports favorable outlook (earnings beats, upgrades, growth).
- **Negative**: supports cautious outlook (misses, downgrades, regulatory risk).
- **Mixed**: material evidence both ways.

### Deduplication
Same event + same framing = count once (keep highest tier). Same event + different conclusions = keep both. Note totals: "24 gathered, 19 unique."

### Theme Tags
earnings, analyst-action, product-growth, macro-sector, management, regulatory, competitive, fund-flows, dividend-buyback, risk-flag, other.

### Article Detail Data Structure

For each article, capture extended metadata powering dashboard interactivity:

```
{
  title: string,
  source: string,
  author: string,
  date: ISO 8601 timestamp,
  url: string,
  source_tier: 1 | 2 | 3,
  sentiment_tag: "positive" | "negative" | "mixed",
  key_point: string,
  theme: string,
  summary: string (2-3 sentence summary of article's key point),
  extracted_keywords: [
    { word: string, polarity: "positive" | "negative" | "neutral" },
    ...
  ],
  fundamental_impact: number (-5 to +5),
  market_sentiment: number (-5 to +5),
  urgency: number (1-5),
  confidence: number (0.0-1.0)
}
```

## Keyword Extraction Protocol

Extract 3-8 significant keywords per article using this structured approach:

### Methodology

1. **Strip financial stop words:** company, stock, shares, market, trading, reported, announced, quarter, year, revenue (when used generically), results, earnings, financial, update, report, statement.

2. **Identify domain-specific high-signal terms:**
   - Actions: beat, miss, upgrade, downgrade, guidance, outlook
   - Performance: growth, decline, momentum, outperform, underperform
   - Operations: margin, revenue, earnings, guidance, restructuring, acquisition, merger
   - Risk/Events: lawsuit, recall, FDA, tariff, probe, warning, layoff, debt
   - Positives: innovation, expansion, dividend, buyback, beat, upgrade
   - Negatives: miss, downgrade, risk, decline, warning, recall

3. **Tag each keyword with sentiment polarity:**
   - **Positive:** beat, upgrade, growth, outperform, innovation, expansion, dividend, buyback, momentum, strength, gains, exceeded, accelerating
   - **Negative:** miss, downgrade, risk, lawsuit, recall, decline, warning, layoff, debt, tariff, probe, headwinds, weakness, pressure, losses
   - **Neutral:** guidance, outlook, estimate, forecast, filing, acquisition, merger, settlement, restructuring, rebalancing

4. **Aggregate across all articles:**
   - Count frequency of each keyword
   - Track polarity distribution (% positive mentions vs. negative)
   - Display top 15-20 keywords sorted by frequency
   - Color code by dominant polarity (green for positive-dominant, red for negative-dominant, gray for neutral)

### Dashboard Integration

Keyword cloud visualization shows relative frequency and color-coded sentiment. Clicking a keyword filters articles to those containing it, enabling rapid signal investigation.

## Multi-Dimensional Sentiment Scoring

Beyond the 7-level aggregate rating, score each article across four independent dimensions:

### Dimension 1: Fundamental Impact (-5 to +5)

How much does this news materially affect earnings/valuation outlook?
- **+5:** Major earnings surprise (>15% miss/beat), guidance cut/raise >10%, transformational M&A, major product approval
- **+3:** Meaningful earnings surprise (5-15%), guidance change (5-10%), significant operational shift
- **+1:** Minor item impact on fundamentals, incremental guidance, product news, analyst estimate change
- **0:** No direct earnings impact; pure sentiment/narrative
- **-1 to -5:** Mirror positive scale for negative impacts

*Example:* "Apple beats Q3 EPS by 12%, raises FY guidance" → +4 fundamental impact (concrete earnings beat)
*Example:* "Apple shares gain on retail optimism" → 0 fundamental impact (sentiment only, no concrete catalyst)

### Dimension 2: Market Sentiment (-5 to +5)

How does this news reflect and shape investor optimism/pessimism independent of fundamentals?
- **+5:** Bullish narrative, analyst upgrades, institutional buying signals, technical breakout context
- **+3:** Positive sentiment shift, fund inflows, retail enthusiasm, sector tailwinds
- **+1:** Neutral-to-mildly-positive framing, routine positive mention
- **0:** Purely factual; no sentiment angle
- **-1 to -5:** Mirror positive scale for bearish sentiment

*Example:* "Goldman Sachs upgrades XYZ to Buy with $150 PT" → +4 market sentiment (explicit bullish signal)
*Example:* "XYZ stock falls on broader tech selloff" → -3 market sentiment (bearish momentum, not company-specific)

### Dimension 3: Urgency (1-5 Scale)

Is this immediately actionable or long-term strategic context?
- **5:** Immediate action catalyst; earnings surprise, FDA decision, M&A announcement, analyst action, guidance revision
- **4:** Near-term catalyst; upcoming event catalyst, significant regulatory/legal action
- **3:** Quarter-to-quarter relevance; product launch, competitive move, sector shift
- **2:** Strategic but not immediate; long-term outlook, R&D progress, management change implications
- **1:** Long-term context; historical perspective, macro trend, academic/research item

*Example:* "FDA decision on drug approval expected by EOD Friday" → 5 urgency (days)
*Example:* "XYZ announces 2030 net-zero target" → 2 urgency (years away)

### Dimension 4: Confidence (0.0-1.0 Scale)

How reliable is this signal? Factor in source credibility, data clarity, and author expertise.
- **0.9-1.0:** Tier 1 source + verifiable data (earnings report, SEC filing, executive quote, major wire service)
- **0.7-0.89:** Tier 1-2 source + clear but indirect data (analyst report with detailed analysis, financial journalist summary)
- **0.5-0.69:** Tier 2 source + some ambiguity (opinion-driven market commentary, aggregator with thin sourcing)
- **0.3-0.49:** Tier 3 source or significant uncertainty (sponsored content, second-hand commentary)
- **<0.3:** Unreliable signal (anonymous rumor, old data, no clear author)

*Example:* "Reuters reports Q3 earnings beat" → 0.95 confidence (Tier 1, primary source)
*Example:* "Seeking Alpha contributor bullish on growth story" → 0.55 confidence (Tier 2, opinion-driven)

### Aggregate Dimension Scoring

For dashboard-level summary, compute weighted averages across all articles:

**Dimension Score** = Σ(article_score × weight) / Σ(weights)

Where weight = source_tier_multiplier × recency_factor:
- Tier 1 × 1.0
- Tier 2 × 0.7
- Tier 3 × 0.4
- Recency: articles ≤7 days old get 1.0×, 8-30 days get 0.85×, 31-60 days get 0.7×, 60+ days get 0.5×

**Dashboard aggregates:**
- Fundamental Impact Score: [-5, +5]
- Market Sentiment Score: [-5, +5]
- Urgency Index: [1, 5] (weighted average)
- Confidence Level: [0.0, 1.0] (weighted average)

These four scores provide institutional-grade signal fidelity beyond the simple aggregate rating.

## Signal Weighting Hierarchy

Apply professional institutional weighting when computing aggregate sentiment. Do not treat all articles equally.

### Weight Categories

- **Earnings surprises & guidance changes: 40-50%**
  - Earnings beats/misses, explicit guidance revisions, management commentary on outlook, analyst consensus changes tied to new data
  - These are anchoring signals with direct P/E and valuation impact

- **Analyst rating actions: 15-20%**
  - Upgrades/downgrades with explicit price targets, initiation of coverage, termination of coverage
  - Weighted by analyst tier (top-ranked analysts by Starmine/TipRanks carry 1.2-1.5× multiplier vs. unranked)

- **Macro & sector developments: 15-20%**
  - Industry-wide trends, regulatory environment changes, macro headwinds/tailwinds, index/sector reallocations
  - Applied uniformly across related holdings

- **Company-specific operational news: 10-15%**
  - Product launches, partnerships, restructuring, management changes, facility closures, capacity announcements
  - High signal when directly comparable to competitor actions

- **Social/retail sentiment indicators: 5-10%**
  - Reddit/StockTwits activity, retail order flow, short squeeze narratives, meme stock dynamics
  - Lowest weight; useful for context on momentum but not fundamental value

### Implementation

When computing aggregate rating, apply these weights to article counts:

```
Weighted Positive Count = 
  (earnings_positive × 0.45) 
  + (analyst_upgrade × 0.175) 
  + (macro_positive × 0.175) 
  + (operational_positive × 0.125) 
  + (retail_positive × 0.075)

Weighted Negative Count = (same structure for negatives)

Aggregate Rating % = 
  Weighted Positive / (Weighted Positive + Weighted Negative)
```

Example: 24 articles split as:
- 3 earnings surprises (2 beats, 1 miss): 0.45 × 2 = +0.9, 0.45 × 1 = -0.45
- 6 analyst actions (4 upgrades, 2 downgrades): 0.175 × 4 = +0.7, 0.175 × 2 = -0.35
- 8 macro/sector (6 positive, 2 negative): 0.175 × 6 = +1.05, 0.175 × 2 = -0.35
- 4 operational (3 positive, 1 negative): 0.125 × 3 = +0.375, 0.125 × 1 = -0.125
- 3 retail (2 positive, 1 negative): 0.075 × 2 = +0.15, 0.075 × 1 = -0.075

**Total weighted:** +3.175 positive vs. -1.325 negative = **70.5% positive** → **Bullish** rating

## Loughran-McDonald Validation Layer

After LLM-based sentiment assessment, cross-check against Loughran-McDonald financial sentiment lexicon principles. This catches context-specific sentiment that general NLP models may miss.

### Key Validation Rules

**Financial context reversal:**
- Word: "liability" → General English: negative, **Financial context: negative (liability is a balance-sheet drag)**
- Word: "tax" → General English: negative, **Financial context: mixed (but "tax cut" is positive; "tax exposure" is negative)**
- Word: "cost" → General English: negative, **Financial context: negative (higher COGS, opex reduce margins)**
- Word: "outstanding" → General English: positive, **Financial context: NEUTRAL (as in "shares outstanding"; not sentiment)**

**Conservative financial language patterns:**
- "Likely," "may," "could," "risk of" → Hedge language; downweight certainty
- "Record," "beat," "exceeded," "accelerating" → Strong positive language; upgrade confidence
- "Decline," "warning," "pressure," "headwind" → Strong negative language; upgrade confidence

### Discrepancy Handling

When LLM assessment disagrees with Loughran-McDonald lexicon check:

1. **Log the discrepancy** with both scores
2. **Default to the more conservative rating** (lower if LLM said bullish but lexicon is bearish, vice versa)
3. **Document the reason** (e.g., "LLM scored bullish due to 'tax cut' language, but overall article is about quarterly pressure—downgraded to Neutral")

Example:
- **LLM sentiment:** Positive ("cost reduction initiatives announced")
- **Loughran-McDonald check:** "cost" is negative, but "reduction" is positive; net is context-dependent
- **Resolution:** Mark as Mixed rather than Positive; requires human judgment on whether cost-cutting is strategic repositioning (positive) vs. emergency measure (negative)

## Aggregate Sentiment

### Rating Scale
Strongly Bullish (80%+ positive) → Bullish (60-80%) → Cautiously Bullish (majority positive, notable negatives) → Mixed/Neutral (balanced) → Cautiously Bearish → Bearish (60-80% negative) → Strongly Bearish (80%+ negative).

### Weighting Adjustments (judgment, not formula)
- Apply signal weighting hierarchy (earnings 40-50%, analyst 15-20%, etc.)
- Tier 1 > Tier 3 source weighting
- Recency: last 7 days carry 1.0×, 8-30 days carry 0.85×, beyond 60 days carry 0.5×
- Earnings anchor the baseline (most recent earnings call within 90 days sets tone)
- Magnitude matters: a 20% EPS beat outweighs a 2% miss from a month ago

### Justification
2-4 sentences citing: article count/breakdown, dominant positive/negative themes, key sources, caveats. Reference weighted percentages and dimensions scores. Example: "16 of 22 articles positive (73% weighted), driven by earnings beat (Tier 1 anchored) and analyst upgrades. Macro headwinds noted but offset by operational strength. Fundamental Impact +2.8, Market Sentiment +1.9, Urgency 3.2, Confidence 0.78 → Bullish."

## Theme Summary

Cluster coverage into Positive Themes, Negative Themes, Neutral Themes (2-4 per category). Each: label, description, article count, key sources.

Example cluster:
- **Positive Theme:** "Earnings Beat & Guidance Strength"
  - Description: Company delivered Q3 EPS beat and raised FY guidance on margin expansion
  - Article count: 4
  - Key sources: Reuters earnings report, Morgan Stanley note, Barron's

- **Negative Theme:** "Macro Headwinds & Tariff Exposure"
  - Description: Broader tech sector sold off; tariff risk on supply chain flagged
  - Article count: 3
  - Key sources: CNBC macro analysis, Goldman Sachs sector report

## Article List Table

Date (desc), Source, Tier, Title, Sentiment, Theme, Dimensions (Fund/Market/Urgency/Conf), Link.

Example row:
| 2026-04-08 | Reuters | 1 | Q3 Earnings Beat 12%, Raises FY Guidance | Positive | earnings | +3.0 / +2.0 / 4 / 0.95 | [link](url) |

For all link standards, follow citation-standards.md.

---
