---
name: investment-screener
description: >
  Produces institutional-quality screening dashboards for stocks and ETFs as
  interactive React (.jsx) artifacts. Uses a fixed dashboard template and
  populates it with real financial data. Default data source is Yahoo Finance
  (via yfinance in the sandbox shell). Supports configurable data connectors
  including LSEG Refinitiv MCP, Alpha Vantage, or any MCP-based financial
  data provider. Use when user says "screen AAPL", "analyze SPY", "dashboard
  for MSFT", "investment screening", "analyst consensus", "full analysis",
  or provides a ticker with an analysis request. Do NOT trigger on casual
  ticker mentions or portfolio allocation discussions.
metadata:
  author: Jason Zou
  version: 5.0.0
  license: MIT
---

# Investment Screener

Interactive, multi-page screening dashboards for stocks and ETFs.
Fixed JSX template with data injection — Claude fetches data and populates
the template's DATA_* constants. No component code is generated; only data.

## Architecture

This skill uses a **fixed template + data population** architecture:

1. **Template** (`references/dashboard-template.jsx`): A complete, self-contained
   React component with ~2800 lines of rendering code. Data lives in clearly
   marked `DATA_*` constants at the top of the file. The rendering code below
   those constants is NEVER modified.

2. **This skill** (SKILL.md): Instructions for fetching real data and replacing
   the placeholder constants. Claude reads the template, fetches data, replaces
   constants, and outputs the populated JSX as a React artifact.

## Data Source Configuration

The skill supports multiple data sources. The user can specify which to use,
or it defaults to Yahoo Finance.

### Default: Yahoo Finance (no connector required)

Uses the `yfinance` Python package in the sandbox shell. Install with:
```
pip install yfinance --break-system-packages
```

Then run Python scripts to fetch price history, fundamentals, and analyst data.
This is the zero-configuration default — works without any MCP connectors.

### Alternative: LSEG Refinitiv MCP

If the user has the LSEG Refinitiv MCP connector configured, use these tools:
- `historical_pricing_summaries` — price/volume history
- `qa_company_fundamentals` — reported financials
- `qa_ibes_consensus` — analyst consensus estimates
- `insight_headlines` — news articles

To use: the user says "screen AAPL using Refinitiv" or the skill detects
available LSEG MCP tools.

### Alternative: Alpha Vantage API

If the user provides an Alpha Vantage API key, use the Alpha Vantage REST API
via web fetch for price history and fundamentals.

### Alternative: Any MCP Financial Data Provider

The skill can adapt to any MCP that provides:
- Historical price/volume data
- Company fundamentals
- Analyst consensus estimates
- News/headlines

Claude should check available MCP tools and use them if they match these
capabilities.

## Instructions

### Step 1: Identify Ticker and Data Source

Normalize the ticker to uppercase. Determine the data source:

1. Check if the user specified a data source (e.g., "using Refinitiv", "with Alpha Vantage")
2. Check if relevant MCP tools are available (LSEG, etc.)
3. Default to Yahoo Finance via yfinance in the sandbox

Classify as ETF or Stock:
- **ETF if:** has expense ratio, tracks an index, reports AUM
- **Stock if:** has EPS, P/E, is a single operating company
- Default to Stock if ambiguous

### Step 2: Read the Template

Read `references/dashboard-template.jsx` to understand the exact DATA_*
constant shapes. The placeholder data shows the expected schema for each constant.

### Step 3: Fetch All Data

Fetch data for ALL constants. The order doesn't matter, but ALL must be populated.

#### Step 3a: Price & Volume History (DATA_PRICE_HISTORY)

**Yahoo Finance (default):**
```python
import yfinance as yf
import json

ticker = yf.Ticker("AAPL")
hist = ticker.history(period="5y", interval="1wk")
data = []
for date, row in hist.iterrows():
    data.append({
        "date": date.strftime("%Y-%m-%d"),
        "open": round(row["Open"], 2),
        "high": round(row["High"], 2),
        "low": round(row["Low"], 2),
        "close": round(row["Close"], 2),
        "volume": int(row["Volume"]),
    })
print(json.dumps(data))
```

Also fetch S&P 500 benchmark:
```python
spy = yf.Ticker("SPY")
spy_hist = spy.history(period="5y", interval="1wk")
```

**Refinitiv:** `historical_pricing_summaries` with `interval: "P1W"`, `tenor: "5Y"`

#### Step 3b: Hero Metrics (DATA_HERO, DATA_KEY_METRICS)

**Yahoo Finance:**
```python
info = ticker.info
hero = {
    "price": info.get("currentPrice") or info.get("regularMarketPrice"),
    "change": info.get("regularMarketChange", 0),
    "changePct": info.get("regularMarketChangePercent", 0),
    "marketCap": info.get("marketCap"),
    "high52w": info.get("fiftyTwoWeekHigh"),
    "low52w": info.get("fiftyTwoWeekLow"),
    "ytdReturn": None,  # compute from price history
    "aum": info.get("totalAssets"),  # ETFs only
    "expenseRatio": info.get("annualReportExpenseRatio"),  # ETFs only
}
```

Compute YTD return from price history (first trading day of year vs current).

Format DATA_KEY_METRICS as pre-formatted strings using fmt helpers logic:
- Market Cap: use T/B/M suffixes
- Prices: 2 decimal places with $
- Percentages: 2 decimal places with +/- and %
- Volume: divide by 1M, 2dp, "M" suffix

#### Step 3c: Performance Comparison (DATA_PERFORMANCE)

Compute returns for 1M, 3M, 6M, YTD, 1Y, 3Y, 5Y periods for both the
stock and SPY benchmark. Delta = stock - benchmark.

#### Step 3d: Monthly OHLC + MACD (DATA_MONTHLY_OHLC)

**CRITICAL: Fetch 8 YEARS of monthly data** so MACD warmup (34 months for
signal line) completes before the displayed 5-year window.

**Yahoo Finance:**
```python
monthly = ticker.history(period="8y", interval="1mo")
```

Then compute for each month:
1. **10-month SMA (ma10):** Average of close[i-9..i]. First valid at month 10.
2. **EMA-12 (fast):** Seeded with SMA of first 12 closes.
3. **EMA-26 (slow):** Seeded with SMA of first 26 closes.
4. **MACD line:** EMA-12 − EMA-26. First valid at month 26.
5. **Signal line:** 9-month EMA of MACD. First valid at month 34.
6. **Histogram:** MACD − Signal.

**DO NOT FILTER NULLS.** Early months will have null macd/signal/histogram.
Pass the full array — Recharts handles nulls automatically.

EMA formula: `EMA[i] = close[i] * k + EMA[i-1] * (1-k)` where `k = 2/(period+1)`

#### Step 3e: Company Context (DATA_COMPANY, DATA_VALUE_CHAIN, etc.)

Use **web search** for qualitative data:
1. "[company] business description" → DATA_COMPANY.description
2. "[company] revenue breakdown by segment [year]" → revenueStreams
3. "[company] revenue by region geography [year]" → regionalOps
4. "[industry] value chain explained" → DATA_VALUE_CHAIN
5. "[company] key risks opportunities [year]" → DATA_THREATS, DATA_OPPORTUNITIES
6. "[company] key business drivers [year]" → DATA_KEY_DRIVERS

For the value chain: show the FULL industry chain (5-8 stages), not just
the company's stages. Mark the company's stages with `companyHere: true`.
Each stage needs an `explanation` (3-5 sentences) and `keyPlayers` array.

For revenue streams: each segment needs a 2-3 sentence `description`,
`growth` (growing/stable/declining), and `margin` (very high/high/moderate/low).

For regional operations: mandatory for large/mega-cap stocks. Try 2-3 search
queries. Include a `geoConcentrationNote`.

#### Step 3f: Drawdown & Momentum (DATA_DRAWDOWN, DATA_MOMENTUM)

Compute from price history:
1. High-water-mark drawdown algorithm
2. Identify significant drawdowns (>10% for stocks, >7% for broad ETFs)
3. 50-day and 200-day SMA (or monthly proxies)
4. Momentum score: Strong Bullish / Bullish / Neutral / Bearish / Strong Bearish
5. Golden/Death Cross detection in trailing 12 months

#### Step 3g: Fundamentals (DATA_FUNDAMENTALS)

**Yahoo Finance:**
```python
# Key financial data
bs = ticker.balance_sheet
is_ = ticker.income_stmt
cf = ticker.cashflow
info = ticker.info
```

For each metric, research and provide:
- `current`: current value
- `historicalStrongAvg`: average during the company's strong-performance periods
- `historicalRange`: { low, high } during strong periods
- `status`: very_good / good / reasonable / slight_concern / concern / severe_concern
- `explanation`: 1-3 sentences
- `likelyCause`: what's driving any gap
- `sourceArticle`: { title, url } — real cited source
- `direction`: higher_is_better / lower_is_better / context_dependent

**Section groups:**
- **Valuation**: P/E, Forward P/E, PEG, Price/Sales, Price/Book, EV/EBITDA, EV/Revenue, Market Cap
- **Profitability**: Revenue, Revenue Growth, Gross Profit, Gross Margin, EBITDA, EBITDA Margin, Net Income, EPS, Operating Income, Operating Margin, Profit Margin, ROE, ROA, ROIC
- **Cash Flow**: FCF, FCF Yield, Operating Cash Flow, Capex, Capex/Revenue, FCF Conversion
- **Balance Sheet**: Total Assets, Total Debt, Net Debt, Debt/Equity, Debt/EBITDA, Current Ratio, Quick Ratio, NWC, Cash, Interest Coverage
- **Trading & Liquidity**: Avg Volume, Beta, Short Interest, Short Interest Ratio, Dividend Yield, Payout Ratio, Shares Outstanding, Float %

#### Step 3h: MACD Strategy Analysis (DATA_MACD_STRATEGY)

Classify the current regime:

| Condition | Label |
|-----------|-------|
| Price > MA10, MACD > 0, histogram expanding | Strong Bull |
| Price > MA10, MACD > 0, histogram contracting | Bull |
| Price > MA10, MACD < 0 or deteriorating | Neutral / Bull Under Pressure |
| Price < MA10, MACD improving | Neutral / Recovery Watch |
| Price < MA10, MACD < 0, histogram contracting | Bear |
| Price < MA10, MACD < 0, histogram expanding negative | Strong Bear |

Compute quantitative extensions:
1. **MACD Z-Score:** Rolling 24-month normalization. `Z = (MACD - mean) / stddev`
2. **Histogram Divergence:** Compare price slope vs histogram slope over 6 months
3. **Momentum Confidence Interval:** Project next-month MACD ± 1.96 * std(deltaMACD)
4. **Average Momentum:** 6M and 12M histogram averages + acceleration
5. **Signal Consistency:** % months on dominant side of signal line in last 12 months

Conviction scoring: 25-95% based on regime + adjustments:
- +5% if consistency > 80%
- +5% if Z-score confirms direction
- +5% if no divergence
- -5% if consistency < 60%
- -10% if opposing divergence
- -5% if CI crosses zero

#### Step 3i: Catalyst Events (DATA_CATALYST_EVENTS)

From monthly OHLC, find months with >8% absolute return or >2 std devs.
Web search for each: "[ticker] news [month] [year]"
Target 5-10 events with cited sources.

#### Step 3j: Street Consensus (DATA_CONSENSUS, DATA_ANALYST_ACTIONS)

**Yahoo Finance:**
```python
info = ticker.info
consensus = {
    "rating": info.get("recommendationKey", "Hold").title(),
    "avgTarget": info.get("targetMeanPrice"),
    "highTarget": info.get("targetHighPrice"),
    "lowTarget": info.get("targetLowPrice"),
    "analystCount": info.get("numberOfAnalystOpinions"),
}
```

Supplement with web search for:
- Individual firm price targets and names
- Buy/hold/sell distribution
- Fair value estimates (Morningstar)
- Recent analyst actions (upgrades/downgrades)
- Earnings surprise data

**Consistency requirement:** Buy/hold/sell counts in DATA_CONSENSUS MUST match
the deduplicated DATA_ANALYST_ACTIONS (most recent action per firm).

For the box-plot: compute Q1, median, Q3 from individual analyst targets.
If not available, estimate from low/avg/high.

#### Step 3k: News & Sentiment (DATA_NEWS_ARTICLES, DATA_SENTIMENT, DATA_SENTIMENT_KEYWORDS)

Web search 4-6 queries for recent news:
1. "[ticker] news [year]"
2. "[company] latest news"
3. "[ticker] earnings results [year]"
4. "[ticker] analyst rating [year]"

For each article, score:
- fundamental_impact: -5 to +5
- market_sentiment: -5 to +5
- urgency: 1-5
- confidence: 0.0-1.0

Aggregate into DATA_SENTIMENT with distribution, dimensions, and rating.
Extract top 15-20 keywords with polarity and frequency.

#### Step 3l: Citations (DATA_CITATIONS)

Collect all URLs used during data gathering. Group by category:
- Data Sources (Yahoo Finance, etc.)
- News Articles
- Analyst Reports
- SEC Filings

### Step 4: Assemble the Artifact

1. Read `references/dashboard-template.jsx`
2. Replace ALL DATA_* constants with the real fetched data
3. Keep ALL rendering code exactly as-is — do not modify anything below
   the `// FIXED RENDERING CODE` marker
4. Output as a React (.jsx) artifact with a default export

**CRITICAL RULES:**
- Never modify rendering code — only replace data constants
- All numbers must be raw (unformatted) — the template's `fmt` helpers handle formatting
- DATA_KEY_METRICS values must be pre-formatted strings (the template displays them as-is)
- Do NOT filter nulls from DATA_MONTHLY_OHLC — early months have null MACD fields
- Every article must have a `url` field
- Every analyst action must have `thesis` and `url` fields
- Deduplicate analyst actions by firm (keep most recent)
- The full ~96-month OHLC array must be passed (not truncated)

### Step 5: Quality Checkpoint

Before outputting the artifact, verify:
- [ ] All DATA_* constants are populated with real data (no placeholders remaining)
- [ ] DATA_PRICE_HISTORY has ~250 weekly points
- [ ] DATA_MONTHLY_OHLC has ~96 monthly points with ma10/macd/signal/histogram fields
- [ ] MACD/signal/histogram cover the displayed 5-year window (not truncated)
- [ ] DATA_FUNDAMENTALS has metrics in all 5 sections
- [ ] DATA_VALUE_CHAIN shows the FULL industry chain (5-8 stages)
- [ ] DATA_CONSENSUS buy+hold+sell counts match DATA_ANALYST_ACTIONS
- [ ] DATA_NEWS_ARTICLES all have url, summary, and extracted_keywords fields
- [ ] DATA_CITATIONS has clickable URLs for all sources
- [ ] No rendering code was modified
