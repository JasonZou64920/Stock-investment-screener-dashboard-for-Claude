# ETF Historical Analysis Framework

Complete 5-year screening framework for exchange-traded funds.

## Screening Philosophy

ETFs are exposure vehicles, not single-company bets. Three core questions:
1. **What am I buying?** — Index, holdings, sector/geo tilt, structure
2. **What does it cost?** — Expense ratio, tracking error, premium/discount
3. **How has it delivered?** — Performance, risk, flows, yield

## Data Sourcing Priority

1. ETF sponsor/issuer pages (iShares, Vanguard, SPDR, Invesco, Schwab)
2. ETF-specialized providers (ETF.com, ETFdb.com)
3. Major data providers (Yahoo Finance, Google Finance, MarketWatch)
4. SEC filings (N-PORT, annual reports)
5. Financial publications

Always check the sponsor page first for holdings, expense ratio, AUM.

## Required Metrics

### Tier 1: Header (all required)

Current Price, Daily Change, AUM, Expense Ratio (net), 52-Week High, YTD Return.

### Tier 2: Fund Structure

Issuer/Sponsor, Index Tracked, Inception Date, Legal Structure, Replication Method, Rebalance Frequency, Number of Holdings, Asset Class, Geographic Focus, Market Cap Focus.

### Tier 3: Holdings & Exposure

**Top 10 Holdings** table with rank, ticker, name, weight, sector. Include top-10 concentration percentage.

**Sector Breakdown** table (GICS for equity; credit quality/duration for fixed income).

**Geographic Breakdown** (required for international/global ETFs, omit for US domestic).

### Tier 4: Cost & Efficiency

Net/Gross Expense Ratio, Tracking Error (1yr), Tracking Difference (1yr), Premium/Discount (current and 1yr avg), Bid-Ask Spread, Median 30-Day Volume.

### Tier 5: Income & Flows

Distribution Yield (TTM), SEC Yield (30-day), Distribution Frequency, Last Ex-Div Date, 1Y/3Y/YTD Fund Flows.

### Tier 6: Risk Profile

Beta (vs S&P 500), Standard Deviation (1yr), Sharpe Ratio (3yr), Sortino Ratio (3yr). Fixed income: add Duration, Credit Quality, Maturity.

## Performance Summary Table

| Period | ETF Return | Index Return | Difference | S&P 500 |
|--------|-----------|-------------|------------|---------|
| 1M-5Y  | ...       | ...         | ...        | ...     |

Use total return. Annualize 1Y+.

## Structural Considerations

Note (1-3 sentences each) if relevant: concentration risk (top 10 > 50%), liquidity (daily $ volume < $10M), closure risk (AUM < $50M), tax efficiency, securities lending income, cheaper alternatives.

## ETF Identification

Has expense ratio + issuer + tracks an index + reports AUM + has holdings page. Common issuers: iShares, Vanguard, SPDR, Invesco, Schwab, ProShares, VanEck, First Trust, WisdomTree, ARK, Global X, Dimensional.

## Missing Data Rules

Same as stock: Tier 1 required, others include if available, never fabricate.

---