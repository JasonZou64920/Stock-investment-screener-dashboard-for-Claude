# Benchmark Comparison Reference

Guidance on selecting and presenting appropriate benchmarks for stock
screening performance tables.

## Default Benchmark

Always include the **S&P 500 Total Return** as the primary benchmark.
This provides broad market context that every investor understands.
Use total return (with reinvested dividends), not price return.

## Sector Benchmark

When the stock's sector is identifiable, include the most relevant sector
ETF as a secondary benchmark. Common mappings:

| GICS Sector              | Sector ETF | Full Name                        |
|--------------------------|------------|----------------------------------|
| Information Technology   | XLK        | Technology Select Sector SPDR    |
| Health Care              | XLV        | Health Care Select Sector SPDR   |
| Financials               | XLF        | Financial Select Sector SPDR     |
| Consumer Discretionary   | XLY        | Consumer Discretionary SPDR      |
| Consumer Staples         | XLP        | Consumer Staples Select SPDR     |
| Energy                   | XLE        | Energy Select Sector SPDR        |
| Industrials              | XLI        | Industrial Select Sector SPDR    |
| Materials                | XLB        | Materials Select Sector SPDR     |
| Utilities                | XLU        | Utilities Select Sector SPDR     |
| Real Estate              | XLRE       | Real Estate Select Sector SPDR   |
| Communication Services   | XLC        | Communication Services SPDR      |

Include the sector benchmark column if the sector is identifiable and the
ETF data is available. This helps the user distinguish between stock-specific
performance and sector-wide trends.

## Performance Table Format

With two benchmarks, the performance table becomes:

| Period   | Stock Return | vs. S&P 500 | vs. Sector ETF |
|----------|-------------|-------------|----------------|
| 1 Month  | +X.X%       | +/- X.X%    | +/- X.X%       |
| 3 Months | +X.X%       | +/- X.X%    | +/- X.X%       |
| ...      | ...         | ...         | ...            |

The "vs." columns show excess return (stock return minus benchmark return).
Positive means outperformance; negative means underperformance. Color these
with semantic colors.

## When NOT to Include a Sector Benchmark

- If the stock is in a conglomerate or diversified sector where no single
  sector ETF is a good match.
- If the sector ETF data is unavailable.
- If adding a third column makes the table too wide for the dashboard layout.
  The S&P 500 comparison alone is sufficient.

## Peer Comparison (Optional)

Do not include full peer comparison in the standard screen. It would require
running analysis on multiple additional tickers, which exceeds the scope of
a single screen.

However, if the stock is in a well-known competitive group, note the peer
tickers in the Context section:

> "Key peers: MSFT, GOOGL, AMZN, META (large-cap tech platform companies)."

This gives the advisor a starting point for further research without
cluttering the current dashboard.

## Benchmark Return Sources

- S&P 500 total return data is widely available from Yahoo Finance (^SP500TR)
  or any major financial data provider.
- Sector ETF returns are available from Yahoo Finance or the ETF sponsor page.
- Use the same "as of" date for all return calculations to ensure comparability.