# Sentiment Calibration Reference

Edge cases and calibration guidance for balanced sentiment assessments.

## Thinly Covered Tickers (fewer than 8 articles)

Label the sentiment section "Limited Coverage — Sentiment Assessment Based
on Sparse Data." Present available articles, compute the aggregate as usual,
but add a caveat that the sample is too small for high confidence. Do not
refuse to assess — a sparse assessment with a caveat is more useful than
no assessment.

## Earnings-Week Coverage Spike

In the week following an earnings report, coverage spikes and nearly all
articles reference the same event. Without deduplication, this inflates
sentiment artificially.

Apply aggressive deduplication during earnings weeks — count the earnings
event as one signal, not fifteen. After deduplication, remaining articles
(analyst reactions, follow-up analysis) provide the real sentiment texture.

## Overwhelmingly Positive Coverage (90%+)

Check whether the coverage is genuinely diverse (different publications
analyzing different aspects) or echo-chamber repetition of one catalyst.

- Genuine diversity: "Strongly Bullish" is appropriate.
- Echo chamber: note that the breadth of positive themes is narrow and a
  single negative catalyst could shift sentiment quickly.

## Overwhelmingly Negative Coverage (90%+)

Same logic in reverse. Check for multiple independent risk factors vs.
one event dominating:

- Multiple independent negatives: "Strongly Bearish."
- Single event concentrated: "Bearish" or "Cautiously Bearish" with a
  note about event concentration.

## Avoiding Recency Bias

If one very recent article (within 48 hours) has strong sentiment but is
the only article with that sentiment, do not let it dominate the aggregate.
The aggregate reflects the trailing 30-day landscape.

Note the recent article as a "developing story" if it represents a
potential shift, but do not change the aggregate rating based on one
data point.

## ETF-Specific Considerations

ETF news is often about the index, sector, or asset class — not the ETF
itself. An article about "tech sector under pressure" is relevant to QQQ
even though it doesn't mention QQQ by name.

Include such articles but tag them with the `macro-sector` theme. Fund-flow
articles are the most ETF-specific news and should be weighted accordingly.

## Separating Price Movement from Sentiment

"AAPL rose 3% today" is a fact about price, not a sentiment signal.
Articles that merely report price movement without analysis should be
excluded or tagged as neutral.

Sentiment comes from the REASONS behind movement, not the movement itself.

## Analyst Rating Changes

Analyst upgrades and downgrades are high-signal events. A single upgrade
from a Tier 1 firm (Goldman Sachs, Morgan Stanley, JPMorgan) carries more
weight than several Tier 3 articles repeating the same bullish narrative.

When an analyst action occurs, note the firm, the direction, and the
price target. This is one of the most actionable pieces of information
for an investment advisor.

---

## Keyword Extraction Calibration

Keywords should be extracted with attention to context, frequency, and cross-article consistency. Poor keyword selection creates noise; careful calibration produces signal.

### Ticker Symbols and Company Name Fragments

**Symptom**: Keyword clouds populated with "AAPL", "Apple Inc.", "$TSLA", company name fragments ("Apple" appearing in context of apple-the-fruit).

**Fix**:
- Exclude ticker symbols entirely (AAPL, TSLA, MSFT, etc.). They are labels, not semantic content.
- Exclude standalone company names *unless* the article is explicitly comparing companies. For example:
  - "Apple's market share erodes" → exclude "Apple"
  - "Apple vs. Microsoft: cloud strategy comparison" → include both as relevant
- Strip suffixes like "Inc.", "Corp.", "Ltd." before extraction to avoid duplication.

### Earnings-Season Keyword Inflation

**Symptom**: During earnings season, keywords like "beat", "miss", "guidance", "forecast revision" spike dramatically. A single earnings report cascading across 20 articles creates artificial keyword dominance.

**Fix**:
- Identify the earnings event by publication date clustering.
- Count earnings-related keywords (beat, miss, guidance, EPS, revenue surprise) as a *single* semantic event, not by raw frequency.
- After deduplication, the keyword frequency baseline resets — keywords appearing 2+ times across remaining (non-earnings-echo) articles are retained.
- Note in metadata: "Primary signal: Earnings [date]. Secondary signals: [list of independent keywords after deduplication]."

### Sector-Specific Keyword Context

**Symptom**: The same keyword carries opposite sentiment depending on sector. "Yield" is positive for REITs and bond funds but neutral or even negative (opportunity cost) for growth tech.

**Fix**:
- Build sector-specific keyword mapping:
  - **REITs/Fixed Income**: "yield" → positive, "coupon" → neutral, "rate hike" → negative
  - **Tech/Growth**: "volatility" → context-dependent, "cash burn" → negative, "R&D spend" → positive
  - **Energy**: "barrel price" → neutral (input metric), "hedged exposure" → positive, "supply disruption" → negative
  - **Healthcare**: "FDA approval" → very positive, "patent cliff" → negative, "trials" → neutral
- When a keyword appears, cross-reference against sector context. If context inverts polarity, adjust keyword weight or add a note: "[keyword] appears in [count] articles; sector context: [polarity]."

### Ambiguous Keywords

**Symptom**: A keyword like "volatility" or "restructuring" has no inherent sentiment — context determines polarity.

**Fix**:
- For each ambiguous keyword, read surrounding sentences to determine local sentiment.
- Classify per occurrence: "volatility (positive: options premium expansion)" vs. "volatility (negative: downside risk)."
- In keyword cloud, display ambiguous keywords with mixed-color coding (e.g., split blue-red) or group them separately under "Contextual Keywords."
- Examples of ambiguous keywords:
  - "Volatility" (positive for options traders, negative for long holders)
  - "Restructuring" (positive if cost-cutting, negative if distressed)
  - "Transition" (positive if strategic pivot, negative if forced)
  - "Pressure" (positive if competitor pressure drives innovation, negative if margin pressure)

### Minimum Keyword Frequency Threshold

**Symptom**: Single-mention keywords clutter the display and represent one journalist's editorial choice, not consensus.

**Fix**:
- Display only keywords appearing 2+ times across the article set.
- For thinly covered tickers (<8 articles), lower threshold to 1+ mentions with a footnote: "Limited coverage; single-mention keywords included."
- Track keyword distribution: if a keyword appears in 3 articles, note "3 sources"; if 1 article, note "single source" (see Cross-Article Consistency Check below).

---

## Multi-Dimensional Score Calibration

Sentiment analysis spans multiple dimensions. Calibration ensures consistency and prevents conflation of unrelated drivers.

### Fundamental Impact Anchoring

**Symptom**: A "Bullish" sentiment rating could mean "stock might go up 5%" or "this changes the valuation thesis by 50%." Without anchoring, ratings conflate magnitude and direction.

**Fix**: Define Fundamental Impact on a discrete scale tied to valuation change:

| Score | Meaning |
|-------|---------|
| **+5** | Existential positive: changes fair value estimate by >20%, or opens entirely new revenue stream, or resolves major risk (e.g., drug approval after binary trial) |
| **+4** | Major positive: changes fair value estimate by 10–20% (e.g., new market entry, cost structure improvement) |
| **+3** | Moderate positive: changes fair value estimate by 5–10% (e.g., better-than-expected quarterly results) |
| **+2** | Minor positive: changes fair value estimate by 1–5% (e.g., analyst upgrade, minor product launch) |
| **+1** | Negligible positive: no material valuation impact but confirms prior thesis (e.g., management commentary reaffirming guidance) |
| **0** | Neutral: observation about price action, sector trend, or forward guidance with no new information (e.g., "stock rose in line with tech sector") |
| **-1** | Negligible negative: raises concern but not material to valuation (e.g., customer churn in non-core segment) |
| **-2** | Minor negative: changes fair value estimate by 1–5% (e.g., guidance cut, margin pressure) |
| **-3** | Moderate negative: changes fair value estimate by 5–10% (e.g., loss of major customer, regulatory warning) |
| **-4** | Major negative: changes fair value estimate by 10–20% (e.g., product recall, management scandal) |
| **-5** | Existential negative: existential risk to business model, bankruptcy signal, or >20% valuation impact (e.g., market disruption, loss of business license) |

Apply this scale consistently. An article titled "Apple stock surges on iPhone 20 rumors" might only be **+1** (price movement without fundamental change), while "FDA approves XYZ's lead candidate" is **+5** (removes binary risk, changes valuation).

### Urgency Calibration

**Symptom**: A "Bullish" rating doesn't convey whether the opportunity matters *today* or *in 2030*. Investors need timeline clarity.

**Fix**: Define Urgency independently of direction (positive/negative):

| Score | Meaning |
|-------|---------|
| **5** | Intraday catalyst: news that moves the stock within hours (earnings miss, M&A, trading halt, FDA decision announced today) |
| **4** | Weekly impact: news driving moves within this week (analyst downgrade published, insider buying disclosed, supply disruption announced) |
| **3** | Quarterly impact: developments affecting this quarter's results (guidance for next Q, product launch window, sector rotation starting) |
| **2** | Annual/medium-term: developments affecting full-year results or next 12 months (new partnership announced, market entry in progress, cost initiative rolling out) |
| **1** | Multi-year trend: long-duration structural change (demographic shift, industry consolidation, secular tech adoption) |

An article about "upcoming dividend increase effective next quarter" is **Fundamental Impact +2, Urgency 3** (relevant to Q2–Q3, moderate valuation impact).
An article about "analyst questions long-term AI viability" is **Fundamental Impact -3 to -5, Urgency 1** (major thesis threat, but develops over years).

### Confidence Floor and Ceiling

**Symptom**: Confidence scores float freely (0–1.0) without discipline. A Tier 3 source with speculative language gets 0.8 confidence; a Tier 1 source with precise data gets 0.6.

**Fix**: Impose hard bounds by source tier and content clarity:

| Tier | Source Examples | Confidence Floor | Confidence Ceiling |
|------|-----------------|------------------|-------------------|
| **Tier 1** | Goldman Sachs research, SEC filings, official earnings transcripts, Bloomberg Terminal data, earnings call recordings | 0.5 (any Tier 1 content is credible) | 1.0 (clear quantitative data or management guidance) |
| **Tier 2** | Financial Times, WSJ, Reuters, FT Alphaville, major sell-side houses (non-proprietary), earnings call summaries from reliable sources | 0.4 | 0.9 (unless data contradicts multiple sources) |
| **Tier 3** | CNBC daily articles, SeekingAlpha, small-cap analyst notes, Twitter/X fintwit, Reddit r/investing, Medium blogs | 0.2 (rumor-level baseline for Tier 3) | 0.8 (maximum, even if logically clear — Tier 3 lacks institutional discipline) |
| **Tier 4** | Single bloggers, anonymous tips, unverified message board posts | 0.0 (excluded from signal) | N/A (do not include) |

**Application**:
- A Tier 1 source (earnings report) clearly stating "Q2 revenue grew 15% YoY" → **Confidence 1.0**
- A Tier 2 source (WSJ analysis) arguing "profit margins are under pressure" with cited data → **Confidence 0.85**
- A Tier 3 source (SeekingAlpha) speculating "CEO might resign due to fatigue" → **Confidence capped at 0.6** (structural limit)
- Tier 1 and Tier 2 sources contradicting each other → **Confidence reduced to 0.5** (unresolved)

### Market Sentiment vs. Fundamental Impact Divergence

**Symptom**: Articles describe strong positive fundamentals (new product line, margin improvement) but the market has reacted negatively (stock down 5%). This divergence is a high-value insight.

**Fix**:
- Compute two independent scores:
  - **Fundamental Impact**: What the article suggests about intrinsic value (range: -5 to +5)
  - **Market Sentiment**: What the market (stock price, options implied volatility, short interest) is currently reflecting (range: -5 to +5)
- **Flag divergence when absolute difference > 3**:
  - **Fundamental Impact +4, Market Sentiment -2** → Flag: "**Sentiment-Fundamental Disconnect: Positive Catalyst Underappreciated**"
  - **Fundamental Impact -1, Market Sentiment +3** → Flag: "**Sentiment-Fundamental Disconnect: Irrational Exuberance**"
- Add narrative: "Market sentiment appears [divergent from / overestimating / underestimating] fundamental catalysts. Potential catalyst for [re-rating up / correction down]."
- This is one of the highest-value insights for active investors: a large, clear divergence often precedes mean reversion.

---

## Keyword Cloud Display Calibration

Keyword clouds should be scannable at a glance while avoiding visual distortion from outlier frequencies.

### Maximum Keywords and Minimum Frequency

**Rule**: Display maximum 20 keywords. Require minimum 2 occurrences to include (see Keyword Extraction Calibration for thinly covered exceptions).

**Application**: If 45 unique keywords appear across 30 articles, filter to top 20 by frequency, applying the 2+ threshold.

### Logarithmic Size Scaling

**Symptom**: One keyword appears 18 times, another 4 times. Using raw frequency as size, the first keyword dominates the visual (18/4 = 4.5x scale spread), distorting perception.

**Fix**: Scale keyword size by **log(frequency)**, not raw frequency.

**Example**:
- Keyword A: 18 mentions → size = log(18) ≈ 2.89 (large)
- Keyword B: 4 mentions → size = log(4) ≈ 1.39 (medium)
- Visual ratio: 2.89 / 1.39 ≈ 2.1x, more balanced than 4.5x

Formula: `font_size = base_size + (log(frequency) * scale_factor)`
- `base_size = 12px`, `scale_factor = 8px` produces a range from ~12px (freq=1) to ~30px (freq=100).

### Color Intensity by Frequency

**Rule**: Higher frequency keywords get more saturated color. Lower frequency keywords get muted/desaturated color.

**Application**:
- Keyword appearing 10+ times: full saturation (100% RGB intensity)
- Keyword appearing 5–9 times: 80% saturation
- Keyword appearing 2–4 times: 60% saturation

This preserves the visual hierarchy while avoiding size distortion.

### Grouped and Sorted Ordering

**Rule**: Within the keyword cloud, order keywords by sentiment category, then by frequency within each category.

**Order**:
1. **Positive sentiment keywords** (sorted by frequency descending)
   - "growth", "opportunity", "beat", "strong"
2. **Negative sentiment keywords** (sorted by frequency descending)
   - "decline", "risk", "pressure", "headwind"
3. **Neutral/contextual keywords** (sorted by frequency descending)
   - "transition", "guidance", "sector", "macro"

This grouping makes it fast to scan sentiment tilt at a glance.

---

## Cross-Article Consistency Check

Signal quality improves when multiple independent sources converge on the same insight. Use consistency checks to elevate consensus and flag isolated claims.

### Multi-Source Keyword Elevation

**Symptom**: The word "restructuring" appears once in a Seeking Alpha article. Its frequency score is low, so it barely appears in the keyword cloud. But the same term appears independently in a Reuters report, an earnings call summary, and a company filing — now it's a strong consensus signal, yet frequency-based ranking may still underweight it.

**Fix**:
- When 3+ articles from *different sources* (not the same wire service, not the same publication cross-posted) use the same unusual or domain-specific keyword (e.g., "restructuring", "covenant waiver", "strategic review"), **elevate that keyword's prominence**:
  - Increase displayed size by +1 log unit: `size_boost = log(source_count) ≈ 1.1` for 3 sources
  - Add a "consensus" badge or icon next to the keyword
  - In metadata, note: "[keyword]: 3 sources (Reuters, company filing, earnings call)"

**Examples**:
- "bankruptcy" appearing in 1 article → include but flag as "single source"
- "margin expansion" in 5 articles by 4 different publications → elevate, mark as consensus
- "AI catalyst" in 8 articles by 1 publication (retweets, aggregates) → count as 1 source, do not elevate

### Single-Source Keyword Flagging

**Symptom**: A strong keyword like "bankruptcy risk" appears in only one article. Should it influence the aggregate sentiment?

**Fix**:
- For keywords appearing in only one article, display with a visual indicator (e.g., dashed outline, superscript "*") and metadata tag: "*single source*"
- Include it in the keyword cloud (frequency is still 1+ mention) but make the single-source nature visible
- In narrative, note: "[keyword] flagged by [source name] alone; not corroborated by other sources. Merits investigation if it represents unique insight or editorial bias."

**Application**:
- "CEO departure imminent" (single source, sensational outlet) → flag as "*single source*", investigate further
- "Operating leverage improving" (single source, but detailed financial analysis) → flag as "*single source*", note that others may not have analyzed this angle yet

---

## Summary Table: Calibration at a Glance

| Calibration Area | Key Rule | Output |
|------------------|----------|--------|
| **Ticker/Company Names** | Exclude tickers, exclude company names unless comparing | Cleaner keyword cloud, less noise |
| **Earnings Inflation** | Count earnings event once, not per article | Baseline resets, secondary signals surface |
| **Sector Context** | "Yield" is context-dependent | Keywords tagged with sector polarity |
| **Ambiguous Keywords** | Classify per occurrence or group separately | Mixed-polarity display or contextual section |
| **Frequency Threshold** | 2+ mentions minimum (lower for sparse coverage) | Focus on consensus, not outliers |
| **Fundamental Impact** | -5 to +5 scale tied to valuation change | Investor can gauge magnitude |
| **Urgency** | 5-level scale independent of direction | Investor knows timing |
| **Confidence Bounds** | Tier 1: 0.5–1.0, Tier 2: 0.4–0.9, Tier 3: 0.2–0.8, Tier 4: excluded | Discipline prevents overconfidence in weak sources |
| **Sentiment-Fundamental Divergence** | Flag when abs(impact - market sentiment) > 3 | High-value rerating opportunity surfaced |
| **Keyword Scaling** | log(frequency) for size, saturation by frequency | Balanced visual, no outlier dominance |
| **Keyword Ordering** | Positive, then negative, then neutral; sort by frequency | Scannable at a glance |
| **Multi-Source Elevation** | 3+ sources for same unusual keyword → elevate | Consensus keywords emphasize signal |
| **Single-Source Flagging** | Mark with "*single source*" indicator | Unique claims isolated, easier to follow |
