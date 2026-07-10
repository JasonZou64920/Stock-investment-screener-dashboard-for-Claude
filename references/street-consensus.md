# Street Consensus & Analyst Research Framework

How to gather, structure, and present Wall Street analyst consensus data
alongside recent research reports for the screening dashboard.

## Data Accessibility

**Critical:** Most financial data sites (Morningstar, TipRanks, MarketBeat,
StockAnalysis, Yahoo Finance, Benzinga) are blocked for direct page
fetching via WebFetch. However, WebSearch returns rich analyst data in
search result snippets. This section relies primarily on WebSearch.

**Strategy:** Run multiple targeted searches to triangulate consensus data
from different aggregators. Extract structured data from search snippets.
Cross-reference across sources for accuracy.

## Search Sequence (run 4-6 searches)

1. `"[ticker] analyst consensus price target [year]"` — aggregated
   consensus from MarketBeat, TipRanks, StockAnalysis
2. `"[ticker] analyst upgrades downgrades [year]"` — recent rating
   changes with firm names and dates
3. `"[ticker] fair value estimate valuation [year]"` — Morningstar fair
   value, moat rating, or equivalent valuation assessments
4. `"[ticker] research report [company name] [year]"` — specific
   research reports from major banks and institutions
5. `"[ticker] earnings estimate consensus EPS [year]"` — forward
   earnings estimates and revisions
6. `"[ticker] [specific firm] price target"` — targeted searches for
   high-credibility firms (Goldman Sachs, Morgan Stanley, JPMorgan,
   Wedbush, Barclays, etc.)

If Morningstar data is not surfaced in search results, try alternatives:
- Zacks fair value / style scores
- Simply Wall St valuation analysis
- GuruFocus intrinsic value estimates
- Seeking Alpha Quant ratings

## Consensus Data Points to Collect

### Aggregate Consensus (required)

| Field                   | Example            | Notes                        |
|-------------------------|--------------------|------------------------------|
| Consensus Rating        | Buy / Hold / Sell  | Most common recommendation   |
| Number of Analysts      | 29                 | Total covering analysts      |
| Buy Count               | 22                 |                              |
| Hold Count              | 5                  |                              |
| Sell Count              | 2                  |                              |
| Avg Price Target        | $299.91            | 12-month forward             |
| High Price Target       | $350 (Wedbush)     | Include firm name            |
| Low Price Target        | $200 (Phillip Sec) | Include firm name            |
| Median Price Target     | $300.00            | If available                 |
| Implied Upside/Downside | +17.2%             | vs current price             |

### Fair Value Assessment (best effort)

| Field                 | Example           | Source Priority             |
|-----------------------|-------------------|-----------------------------|
| Fair Value Estimate   | $245.00           | Morningstar > Zacks > other |
| Star Rating           | 3 stars           | Morningstar                 |
| Moat Rating           | Wide              | Morningstar                 |
| Valuation Assessment  | Fairly Valued     | Over/Under/Fairly Valued    |
| Uncertainty Rating    | Medium            | Morningstar                 |

If fair value data is unavailable, explicitly state "Fair value estimate
not available from accessible sources" in the dashboard rather than
omitting the section or fabricating data.

### Forward Estimates (if available)

| Field                  | Example    |
|------------------------|------------|
| FY1 EPS Estimate       | $7.45      |
| FY2 EPS Estimate       | $8.12      |
| FY1 Revenue Estimate   | $420.5B    |
| EPS Revision (30d)     | +$0.12     |
| Revenue Revision (30d) | +$2.1B     |

## Recent Research Reports (10-15 target)

Search for individual analyst actions from the past 60 days. Prioritize:

### Credibility Tiers for Research Firms

**Tier 1 (highest credibility, prioritize):**
Goldman Sachs, Morgan Stanley, JPMorgan, Bank of America/Merrill Lynch,
Citigroup, Barclays, UBS, Deutsche Bank, Wells Fargo, RBC Capital

**Tier 2 (strong credibility):**
Wedbush, Needham, Piper Sandler, Raymond James, Bernstein, Jefferies,
Evercore ISI, Oppenheimer, Wolfe Research, Loop Capital, KeyBanc

**Tier 3 (include but note source):**
Maxim Group, Phillip Securities, Rosenblatt, DA Davidson, Citrini,
boutique/regional firms

**Star rating guide:** When the user mentions "4-5 star reports," this
refers to analyst track records. TipRanks, MarketBeat, and Benzinga
track analyst accuracy. Prioritize analysts with strong track records
from Tier 1-2 firms.

### Data to Capture Per Report

| Field         | Example                                         |
|---------------|-------------------------------------------------|
| Date          | Mar 31, 2026                                    |
| Firm          | Wedbush                                         |
| Analyst       | Dan Ives                                        |
| Action        | Maintains Outperform                            |
| Price Target  | $350 (from $325)                                |
| Key Thesis    | AI monetization accelerating, services at scale |
| Credibility   | Tier 2, strong Apple track record               |

### Minimum Requirements

- Target 10-15 reports from the past 60 days
- At least 3 must be from Tier 1 firms
- Include both bullish and bearish perspectives if available
- If fewer than 5 reports found, expand to 90 days and note sparse coverage

## Composing the Street Thesis

After gathering all data, write a 3-5 sentence **Street Thesis** that
synthesizes:

1. **Consensus direction:** What is the street's prevailing view?
   (Overwhelmingly bullish, mixed, cautiously positive, etc.)
2. **Key catalysts:** What 2-3 themes drive the consensus?
   (e.g., AI monetization, services growth, margin expansion)
3. **Key risks acknowledged:** What 1-2 risks do analysts flag?
   (e.g., China exposure, regulatory, valuation premium)
4. **Valuation context:** Is the stock trading above or below the
   consensus target? Above or below fair value estimates?
5. **Revision trend:** Are estimates being revised up or down?

Example thesis:
> "The Street maintains a strong Buy consensus on AAPL with a median
> target of $300, implying 17% upside. Bullish conviction centers on AI
> integration into the ecosystem and accelerating Services revenue, with
> Wedbush ($350) and Morgan Stanley ($320) leading the bull case.
> Bears cite premium valuation at 32x forward earnings and China supply
> chain risk, with Barclays ($248) and Phillip Securities ($200) the most
> cautious. Consensus EPS estimates have been revised upward by $0.12
> over the past 30 days, signaling improving fundamental expectations."

## Dashboard Display

The Street Consensus section in the dashboard should include:

1. **Consensus Summary Card** — rating badge (Buy/Hold/Sell), analyst
   count, average price target, implied upside/downside bar
2. **Price Target Range** — horizontal bar showing low/avg/high targets
   with current price marked, labeled with firm names at extremes
3. **Fair Value Assessment** — if available: star rating, moat badge,
   valuation status (overvalued/undervalued/fairly valued)
4. **Street Thesis** — 3-5 sentence synthesis paragraph
5. **Recent Analyst Actions Table** — paginated (5 per page), sortable
   columns: Date, Firm, Analyst, Action, Price Target, Key Point
6. **Estimate Revisions** — small chart or indicators showing EPS/revenue
   revision direction over 30/60/90 days

## ETF Applicability

Street consensus applies primarily to individual stocks. For ETFs:
- Skip the analyst rating/price target section
- Instead, show: expense ratio comparisons with similar ETFs, fund flow
  trends, Morningstar category rating if available
- The Street Thesis for ETFs should focus on the underlying index/sector
  outlook rather than individual fund recommendations

---
