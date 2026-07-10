# Stock Historical Analysis Framework

Complete 5-year screening framework for individual equities.

## Screening Philosophy

A good stock screen answers three questions:
1. **What has this stock done?** — Price performance, volume, highs/lows
2. **What is it worth?** — Valuation, profitability, capital structure
3. **What might it do next?** — Momentum, trend, risk profile

## Data Sourcing Priority

1. Company investor relations and SEC filings
2. Major data providers (Yahoo Finance, Google Finance, MarketWatch)
3. Exchange pages (NYSE, NASDAQ)
4. Financial publications (Bloomberg, Reuters, WSJ, Barron's)

Always note the "as of" date. Prefer most recently updated official source when data conflicts.

## Required Metrics

### Tier 1: Header Metrics (all required)

| Metric        | Format           | Notes                          |
|---------------|------------------|--------------------------------|
| Current Price | $X,XXX.XX        | Most recent close or real-time |
| Daily Change  | +/- $X.XX (X.X%) | Absolute and percentage        |
| Market Cap    | $X.XXB/T         | Abbreviated                    |
| 52-Week High  | $X,XXX.XX        | With date if available         |
| 52-Week Low   | $X,XXX.XX        | With date if available         |
| YTD Return    | +/- X.X%         | Colored positive/negative      |

### Tier 2: Valuation & Fundamentals

P/E (TTM), Forward P/E, PEG Ratio, Price/Sales, Price/Book, EV/EBITDA, EPS (TTM), Revenue (TTM), Net Income (TTM), Profit Margin, Return on Equity, Debt/Equity.

### Tier 3: Trading & Risk

Avg Daily Volume (3mo), Beta (5yr monthly vs S&P 500), Annualized Volatility (1yr), Dividend Yield, Dividend Per Share, Ex-Dividend Date, Shares Outstanding, Float, Short Interest (% of float).

### Tier 4: Context

Sector (GICS), Industry (GICS sub-industry), Exchange, Index Membership (S&P 500, DJIA, etc.), Next Earnings Date.

## 5-Year Price & Volume History

Daily data points (~1,260 trading days): date, closing price (adjusted), daily volume. If full daily data makes the artifact too large, downsample to weekly (~260 points, Friday close). Never use monthly. Identify: 5-year and 52-week highs/lows with dates, stock splits, significant single-day moves (>5%, up to 5 events).

## Performance Summary Table

| Period  | Stock Return | S&P 500 Return | Excess |
|---------|-------------|----------------|--------|
| 1 Month | +/- X.X%    | +/- X.X%       | +/- X.X% |
| 3 Months| ...         | ...            | ...    |
| 6 Months| ...         | ...            | ...    |
| YTD     | ...         | ...            | ...    |
| 1 Year  | ...         | ...            | ...    |
| 3 Years | ...         | ...            | ...    |
| 5 Years | ...         | ...            | ...    |

Annualize 3Y and 5Y using CAGR. Use total return (dividend-adjusted).

## Analyst Context & Street Consensus

This section has been expanded to a dedicated step and reference file.
See `references/street-consensus.md` for the full framework covering:
- Aggregate consensus data (rating, analyst count, price targets, implied upside)
- Fair value assessment (Morningstar star/moat or alternatives)
- 10-15 recent research reports with firm credibility tiers
- Street Thesis composition
- Forward EPS/revenue estimates and revision trends

For quick reference, the minimum to collect here is: number of analysts,
consensus rating, average/high/low price targets, next-year EPS estimate.

## Stock Identification

Confirm via: has P/E and EPS (ETFs don't), listed as common stock, single issuing company. If ambiguous, note it.

## Missing Data Rules

- Tier 1: must all be present ("Data unavailable" if needed).
- Tier 2-4: include what's available; omit cleanly if mostly empty.
- Price series: use available granularity, note limitations.
- Never fabricate data.

---