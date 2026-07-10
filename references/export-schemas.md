# Export Schemas Reference

Complete column-level specifications for all seven export tables, including
example rows, null handling, and edge cases.

## General Rules

### Null Handling
- **Numeric fields**: Leave blank (empty cell). Do not use "N/A", "0", or "-".
  A blank cell imports as null in Excel.
- **Text fields**: Leave blank if unknown.
- **Date fields**: Leave blank if unknown. Never use placeholder dates.
- **Exception**: "Recovery Date" in Significant Drawdowns may contain the text
  "Ongoing" — this is the one case where text appears in a date column.

### Large Numbers
Export the full number, not abbreviated forms:
- Market cap: `3280000000000` not `3.28T`
- Revenue: `94800000000` not `$94.8B`
- Volume: `89234500` not `89.2M`

Abbreviation is for dashboard display; exports need raw values for computation.

### Percentage Convention
All percentages are exported as decimals:
- 5.2% → `0.052`
- -27.5% → `-0.275`
- 0.0945% → `0.000945`

This is the standard for financial data. Users format as Percentage in Excel.

### Currency
All dollar amounts in USD unless the ticker trades in a different currency.
Note the currency in the metadata header if non-USD. Do not mix currencies.

### CSV Dialect
UTF-8 encoding, comma-delimited, double-quote string enclosure, Unix line
endings (\n). First row after metadata separator is the column header row.

---

## Table 1: Price History — Example Rows

```
Ticker, AAPL
Asset Type, Stock
Export Date, 2026-04-08
Data Source, Investment Screening Dashboard
Table, Price History
---
Date,Closing Price,Volume,Monthly Return,High,Low
2021-04-30,131.46,89234500,,137.07,122.25
2021-05-28,124.61,78456200,-0.0521,128.32,122.86
2021-06-30,136.96,71234800,0.0991,139.15,123.13
2021-07-30,145.86,65478900,0.0650,150.00,141.67
```

Notes:
- First row's Monthly Return is blank (no prior month for comparison).
- High and Low may be blank if not available for a given month.
- Volume is total average daily, not monthly total.

## Table 2: Drawdown Series — Example Rows

```
Date,Closing Price,High Water Mark,Drawdown
2021-04-30,131.46,131.46,0
2021-05-28,124.61,131.46,-0.0521
2021-06-30,136.96,136.96,0
2021-07-30,145.86,145.86,0
2022-01-28,159.22,182.01,-0.1252
2022-06-30,136.72,182.01,-0.2489
```

Notes:
- Drawdown is always zero or negative.
- Zero indicates a new all-time high at that date.

## Table 3: Significant Drawdown Periods — Example Rows

```
Drawdown #,Peak Date,Trough Date,Peak Price,Trough Price,Drawdown Depth,Days to Trough,Recovery Date,Days to Recovery,Total Days Underwater
1,2022-01-03,2022-06-16,182.01,129.04,-0.2911,164,2023-07-26,405,569
2,2020-02-12,2020-03-23,327.85,224.37,-0.3156,40,2020-06-08,77,117
3,2021-09-07,2021-10-04,156.69,139.14,-0.1120,27,2021-10-25,21,48
```

Notes:
- Drawdown Depth is a negative decimal.
- If a drawdown is ongoing, Recovery Date = "Ongoing", Days to Recovery and
  Total Days Underwater show days from trough/peak to the export date.

## Table 4: Summary Metrics — Example Row (Stock)

```
Ticker,Company Name,Exchange,Sector,Industry,Current Price,Market Cap,52-Week High,52-Week Low,YTD Return,1-Year Return,3-Year Annualized,5-Year Annualized,P/E Ratio TTM,Forward P/E,EPS TTM,Revenue TTM,Profit Margin,ROE,Debt/Equity,Beta,Dividend Yield,Avg Daily Volume,Max Drawdown 5yr,Momentum Score
AAPL,Apple Inc.,NASDAQ,Information Technology,Technology Hardware,213.25,3280000000000,237.49,164.08,0.082,0.241,0.149,0.228,33.2,28.5,6.42,394800000000,0.262,1.567,1.87,1.24,0.0049,54200000,-0.2911,Bullish
```

## Table 4: Summary Metrics — Example Row (ETF)

```
Ticker,Fund Name,Issuer,Index Tracked,Asset Class,Inception Date,Current Price,AUM,Expense Ratio,52-Week High,52-Week Low,YTD Return,1-Year Return,3-Year Annualized,5-Year Annualized,Distribution Yield,Tracking Error 1yr,Number of Holdings,Top 10 Concentration,Beta,Max Drawdown 5yr,Momentum Score,1-Year Fund Flows
SPY,SPDR S&P 500 ETF Trust,State Street Global Advisors,S&P 500,Equity,1993-01-22,523.45,562000000000,0.000945,548.21,432.18,0.095,0.228,0.112,0.142,0.0131,0.0003,503,0.342,1.00,-0.2489,Bullish,58400000000
```

## Table 5: Performance Comparison — Example Rows

```
Period,Ticker Return,S&P 500 Return,Index Return,Excess vs S&P 500
1 Month,0.034,0.028,,0.006
3 Months,0.082,0.071,,0.011
6 Months,0.145,0.118,,0.027
YTD,0.082,0.095,,-0.013
1 Year,0.241,0.228,,0.013
3 Years,0.149,0.112,,0.037
5 Years,0.228,0.142,,0.086
```

Notes:
- Index Return column is blank for stocks (only applies to ETFs).
- Multi-year figures are annualized (CAGR).

## Table 6: Holdings (ETF) — Example Rows

```
Rank,Ticker,Name,Weight,Sector
1,AAPL,Apple Inc.,0.0712,Information Technology
2,MSFT,Microsoft Corp.,0.0685,Information Technology
3,AMZN,Amazon.com Inc.,0.0352,Consumer Discretionary
4,NVDA,NVIDIA Corp.,0.0341,Information Technology
5,GOOGL,Alphabet Inc. Class A,0.0215,Communication Services
```

Notes:
- Weight is a decimal (0.0712 = 7.12%).
- Sector uses GICS classification.

## Table 7: News Articles — Example Rows

```
Date,Source,Author,Title,Sentiment,Theme,URL,Key Point
2026-04-07,Bloomberg,Mark Gurman,"Apple Revenue Beats Estimates on iPhone Demand",Positive,earnings,https://bloomberg.com/news/...,Q1 revenue topped consensus by 4% driven by iPhone 16 Pro demand
2026-04-05,Barron's,Eric Savitz,"Goldman Sachs Upgrades Apple to Buy",Positive,analyst-action,https://barrons.com/articles/...,Price target raised to $250 citing services growth acceleration
2026-03-22,Wall Street Journal,Tim Higgins,"FTC Expands Probe Into Apple App Store Practices",Negative,regulatory,https://wsj.com/articles/...,Investigation widened to include in-app payment steering restrictions
```

Notes:
- Author is blank if not identifiable.
- URL contains the actual article link (never fabricated).
- Key Point is a single sentence, not a paragraph.

## Multi-Ticker Exports

When screening multiple tickers:
- **Summary Metrics**: Becomes multi-row (one row per ticker). Ideal for
  side-by-side comparison in Excel.
- **All other tables**: Remain per-ticker. Include the ticker in the metadata
  header to distinguish files. In a combined Excel workbook, use sheet names
  like "AAPL Price History", "MSFT Price History".
