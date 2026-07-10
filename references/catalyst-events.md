# Catalyst Events Reference

Framework for identifying significant monthly price moves, gathering real cited
catalysts, and integrating event analysis with the MACD strategy regime.

---

## 1. Identifying Significant Monthly Moves

After computing monthly OHLC (see `macd-strategy.md` §1), identify months with
outsized price moves that likely had a material catalyst.

**Significance threshold:**
- Compute absolute monthly return for each candle: `|close - open| / open * 100`
- Flag months where the absolute return exceeds **2 standard deviations** above the
  mean absolute monthly return for the full series.
- Also flag any month with absolute return > 8% regardless of standard deviation.
- Target: 5-10 flagged months across the 5-year history. If more than 10, keep only
  the 10 largest by absolute return.
- If fewer than 5, lower the threshold to 1.5 standard deviations.

**Output:** List of `{ date, monthlyReturn, direction }` for flagged months.

---

## 2. Search Patterns for Catalyst Discovery

For each flagged month, run 1-2 targeted web searches to find the catalyst.

**Search templates:**
1. `"[ticker] [company name] news [month name] [year]"` — broad month-specific search
2. `"[ticker] stock move [month name] [year]"` — targets coverage of the price move itself
3. If earnings season (Jan/Feb, Apr/May, Jul/Aug, Oct/Nov):
   `"[ticker] earnings [quarter] [year] results"` — earnings are the most common catalyst

**Source priority:**
- Tier 1: Reuters, Bloomberg, WSJ, Financial Times, CNBC, Barron's
- Tier 2: Seeking Alpha, MarketWatch, Yahoo Finance, Investor's Business Daily
- Tier 3: Industry-specific publications, company press releases

**Search efficiency:**
- Most significant moves are caused by a small set of catalyst types. Check earnings
  first (covers ~40% of large moves), then analyst actions, then macro/sector events.
- Limit to 2 searches per flagged month to stay within the skill's search budget.
- If a catalyst is obvious from the first search (e.g., earnings miss), skip the second.

---

## 3. Catalyst Type Taxonomy

Classify each event into one of these catalyst categories:

| Category | Examples | Typical Impact |
|----------|----------|----------------|
| `earnings` | Earnings beat/miss, revenue surprise, guidance change | High — most frequent cause of large monthly moves |
| `analyst-action` | Major upgrade/downgrade, price target change | Medium-High |
| `regulatory` | FDA approval/rejection, antitrust ruling, policy change | High — often binary outcome |
| `macro-shock` | Fed rate decision, recession signal, trade war escalation | High — affects broad market but explains sector/stock moves |
| `m-and-a` | Acquisition announcement, merger, spin-off, takeover bid | Very High — often >10% moves |
| `product-launch` | Major product reveal, service launch, technology breakthrough | Medium |
| `management` | CEO change, leadership shake-up, activist investor | Medium |
| `litigation` | Lawsuit outcome, settlement, regulatory fine | Medium-High |
| `dividend-buyback` | Dividend cut/raise, major buyback announcement | Medium |
| `competitive` | Competitor disruption, market share shift, pricing war | Medium |
| `political` | Election result, trade policy, sanctions, tariff change | Medium-High |
| `commodity` | Oil/gas price shock, raw material cost change | High for commodity-sensitive sectors |
| `fund-flows` | Major ETF rebalance, index inclusion/exclusion | Medium (more relevant for ETFs) |

---

## 4. Event Detail Data Structure

Every catalyst event MUST include all of these fields:

```javascript
{
  // Required fields
  title: "Q3 Earnings Beat — Revenue +12% YoY",      // concise event title
  date: "2024-10-24",                                   // event date (YYYY-MM-DD)
  monthDate: "2024-10",                                  // month key for chart alignment
  category: "earnings",                                  // from taxonomy above
  
  // Source citation (REQUIRED — never fabricate)
  sources: [
    {
      publisher: "Reuters",
      title: "Apple reports Q3 revenue of $94.8B, beating estimates",
      url: "https://...",                                // real URL from search results
      date: "2024-10-24"
    }
  ],
  
  // Analysis
  summary: "Apple reported Q3 FY2024 revenue of $94.8 billion, beating consensus estimates of $92.1 billion. Services revenue hit a record $23.1 billion. Management guided Q4 revenue above expectations, citing strong iPhone 16 demand.",
  
  priceReaction: "+4.2% in the month. Stock gapped up on the day following the report and held gains through month-end.",
  
  sentimentTag: "bullish",                              // "bullish", "bearish", or "mixed"
  
  // Technical regime integration (CRITICAL — ties event to strategy)
  regimeEffect: "confirmed",                            // "confirmed", "interrupted", or "reversed"
  regimeNote: "The earnings beat reinforced the existing bullish regime. Price remained firmly above the 10-month MA, and the positive surprise contributed to MACD histogram expansion."
}
```

### Field-by-field guidance

**title:** 8-15 words. Lead with event type, include key metric if quantitative.
- Good: "Q3 Earnings Beat — EPS $1.64 vs $1.50 Expected"
- Bad: "Positive News" or "Stock Went Up"

**sources:** Minimum 1, target 2 per event. Must be real articles found via WebSearch.
Never fabricate URLs. If URL uncertain, cite by publisher + title + date only.

**summary:** 2-4 sentences. What happened, what the key numbers were, what the
immediate market implication was. Factual tone — no investment advice.

**priceReaction:** 1-2 sentences. Quantify the monthly move. Mention if the move was
concentrated in a single day or spread across the month.

**sentimentTag:** Based on the event's implication for the stock:
- `bullish` — positive catalyst, constructive for price
- `bearish` — negative catalyst, destructive for price
- `mixed` — unclear implication or offsetting factors

**regimeEffect:** How the event interacted with the prevailing MACD strategy regime:
- `confirmed` — Event reinforced the existing trend/momentum direction. Example: earnings beat while stock is in Strong Bull regime.
- `interrupted` — Event temporarily disrupted the regime but didn't reverse it. Example: a one-month selloff in an otherwise bullish regime.
- `reversed` — Event triggered a regime change. Example: guidance cut that pushed price below the 10-month MA and turned MACD negative.

**regimeNote:** 1-2 sentences connecting the event to the technical indicators. Reference
the 10-month MA and/or MACD specifically.

---

## 5. Event Pill Positioning on Chart

Event pills appear in a dedicated row between the price panel and the MACD panel.

**Positioning rules:**
- Each pill is centered on its month's X-axis position.
- Pills are small filled circles (radius 6px) with accent blue fill (#2563EB at 80% opacity).
- On hover: scale up slightly (1.2x), show tooltip with event title.
- On click: expand the event detail panel (inline below the event row, or a slide-out drawer).
- If two events fall in the same month, stack vertically with 2px gap, or show a "2" badge.

**Visual hierarchy:**
- Bullish events: teal-tinted pill border
- Bearish events: salmon-tinted pill border
- Mixed events: neutral gray border
- Default (before hover): all pills use accent blue fill to maintain clean appearance

---

## 6. Event Detail Panel Design

When a user clicks an event pill, display an event detail panel.

**Layout (inline expansion):**
```
┌──────────────────────────────────────────────────────────┐
│  📅 Oct 24, 2024  │  earnings  │  ● bullish  │ confirmed │
│                                                          │
│  Q3 Earnings Beat — EPS $1.64 vs $1.50 Expected         │
│                                                          │
│  Apple reported Q3 FY2024 revenue of $94.8 billion,      │
│  beating consensus estimates of $92.1 billion. Services   │
│  revenue hit a record $23.1 billion...                    │
│                                                          │
│  Price reaction: +4.2% in the month. Stock gapped up     │
│  on the day following the report.                         │
│                                                          │
│  Technical context: The earnings beat reinforced the      │
│  existing bullish regime. Price remained above the        │
│  10-month MA, MACD histogram expanded.                    │
│                                                          │
│  Sources:                                                 │
│  • Reuters — "Apple reports Q3 revenue..." — Oct 24      │
│    Read article →                                         │
│  • CNBC — "Apple earnings top estimates..." — Oct 24     │
│    Read article →                                         │
└──────────────────────────────────────────────────────────┘
```

**Panel styling:**
- Light card background (#FFFFFF) with subtle border
- Category badge pill (small, muted color)
- Sentiment badge: bullish=teal, bearish=salmon, mixed=amber
- Regime effect badge: confirmed=teal, interrupted=amber, reversed=salmon
- Source links: accent blue, underlined, "Read article →" with external link icon
- Close button (X) in top-right corner

---

## 7. Integration with SKILL.md Steps

This reference supports two steps in the main skill:

**Step 4 (Compute MACD Strategy):**
- Aggregate daily → monthly OHLC (§1)
- Compute 10-month MA (§2)
- Compute MACD 12/26/9 (§3)
- Run classification engine (§4)
- Generate explanation text (§5)

**Step 5 (Gather Catalyst Events):**
- Identify significant months (§1 here)
- Search for catalysts (§2)
- Classify events (§3)
- Build event data structures (§4)
- Assess regime effect for each event (§4, regimeEffect field)

**Step 10 (Assemble Dashboard), Page 3:**
- Render candlestick chart with MA overlay
- Render event pill row
- Render MACD histogram panel
- Render strategy status card
- Wire up event pill click → detail panel
