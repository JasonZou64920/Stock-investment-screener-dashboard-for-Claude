# Stock Metric Definitions

Precise definitions and calculation notes for each metric in the stock
screening framework. Financial metrics have subtle variants — this file
specifies exactly which variant to use.

## Price & Return Metrics

### Current Price
Most recent closing price or real-time quote. Use the value reported by your
primary data source. Always note whether this is a closing price or intraday.

### Daily Change
Absolute change: current price minus prior close. Percentage change:
(current - prior close) / prior close * 100.

### YTD Return
(Current price - Dec 31 prior year close) / Dec 31 prior year close,
expressed as a percentage. Use split-adjusted and dividend-adjusted closing
prices to account for corporate actions.

### Annualized Multi-Year Returns
Use the CAGR (Compound Annual Growth Rate) formula:
`(ending_price / beginning_price) ^ (1 / years) - 1`

For total return calculations, use adjusted close prices that account for
dividends and splits.

### Adjusted vs. Unadjusted Prices
- **Historical returns**: Always use split-adjusted and dividend-adjusted
  prices. This ensures return calculations reflect what an investor actually
  earned.
- **Current price and 52-week range**: Use unadjusted (nominal) prices for
  display, as these match what the user sees on their brokerage screen.
- **Price charts**: Use adjusted prices for the historical series so the
  chart accurately represents cumulative returns, not distorted by splits.

## Valuation Metrics

### P/E Ratio (TTM)
Price divided by trailing twelve months diluted earnings per share.
- If EPS is negative, display as "N/M" (not meaningful) rather than a
  negative P/E number.
- If EPS is zero, display as "N/M."
- Use GAAP EPS unless the company and analysts predominantly reference
  non-GAAP (adjusted) EPS, in which case note "Adjusted" in the display.

### Forward P/E
Price divided by consensus analyst EPS estimate for the next twelve months.
Only include if consensus data is available from at least 3 analysts.
Note "Consensus est." in the citation.

### PEG Ratio
P/E ratio divided by the expected earnings growth rate (typically the
consensus long-term EPS growth rate, 3-5 years). If growth rate is
negative or zero, display as "N/M."

### Price/Sales (TTM)
Market cap divided by trailing twelve months revenue. Always use total
revenue, not operating revenue.

### Price/Book
Price per share divided by book value per share (total shareholders'
equity / diluted shares outstanding). If book value is negative (common
for companies with large buyback programs), display as "N/M."

### Enterprise Value / EBITDA
EV = Market cap + total debt - cash and equivalents.
EBITDA = Earnings before interest, taxes, depreciation, and amortization
(trailing twelve months).
If EBITDA is negative, display as "N/M."

## Profitability Metrics

### EPS (TTM)
Diluted earnings per share over the trailing twelve months. Use the most
recent four quarterly reports. Prefer GAAP unless adjusted is standard
for the company. Always specify which convention.

### Revenue (TTM)
Total revenue over trailing twelve months. Sum of the most recent four
quarters. Abbreviate: B for billions, M for millions.

### Net Income (TTM)
GAAP net income attributable to common shareholders over trailing twelve
months. Abbreviate consistently with revenue.

### Profit Margin
Net income / revenue * 100, trailing twelve months. Display as percentage.
Negative margins are valid and should be displayed (not "N/M").

### Return on Equity (ROE)
Net income / average shareholders' equity * 100, trailing twelve months.
Average equity = (beginning equity + ending equity) / 2.
If average equity is negative, display as "N/M."

### Debt/Equity
Total liabilities / total shareholders' equity, from the most recent
quarterly balance sheet. If equity is negative, display as "N/M."
Note: some sources use total debt / equity instead of total liabilities /
equity. Be consistent and note which definition you're using.

## Trading & Risk Metrics

### Average Daily Volume
Mean of daily share volumes over the trailing 63 trading days (approximately
3 months). Abbreviate: M for millions, K for thousands.

### Beta
5-year monthly beta against the S&P 500 Total Return Index. This is the
slope coefficient from a regression of the stock's monthly returns against
the index's monthly returns over 60 months.
- Beta > 1.0: More volatile than the market.
- Beta < 1.0: Less volatile than the market.
- Beta < 0: Moves inversely to the market (rare for stocks).
- Negative beta is valid and should be displayed.

### Annualized Volatility
Standard deviation of daily logarithmic returns over the trailing 252
trading days (1 year), multiplied by sqrt(252) to annualize.
Display as a percentage.

### Dividend Yield
Annual dividends per share / current price * 100. Use trailing twelve
months of declared dividends.
- If the company does not pay dividends, display "—" (em dash), not "0%."
- Forward yield (based on declared forward dividend rate) is an acceptable
  alternative if clearly labeled.

### Shares Outstanding
Total diluted shares outstanding from the most recent filing. Abbreviate.

### Float
Shares available for public trading = total shares minus restricted shares,
insider holdings, and closely held shares. If not available from primary
sources, omit rather than estimate.

### Short Interest
Short shares / float * 100. Typically reported bimonthly by exchanges.
Note the report date. If not available, omit.

## Market Cap Calculation
Current price * diluted shares outstanding. Use diluted shares when
available; otherwise basic shares. Abbreviate:
- Under $2B: display in millions ($XXX.XM)
- $2B - $999B: display in billions ($X.XXB)
- $1T+: display in trillions ($X.XXT)