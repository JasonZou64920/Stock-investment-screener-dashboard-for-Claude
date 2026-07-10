# Drawdown & Momentum Analysis Framework

Asset-type agnostic methodology for drawdown and momentum analysis on any price series.

## Input Requirements

A price series: array of {date, close} objects, chronological (oldest first), split/dividend adjusted. Minimum 12 months, ideal 60 months. Plus an asset_subtype for threshold selection.

## Drawdown Analysis

### Maximum Drawdown Algorithm

1. Walk the price series chronologically.
2. Track the running maximum (high-water mark).
3. At each point: drawdown = (price - HWM) / HWM.
4. Most negative value = maximum drawdown.
5. Record peak date/price, trough date/price, recovery date (or "ongoing").

### Drawdown Series

Full series of drawdown percentages for charting — always zero or negative, touching zero at each new all-time high.

### Significance Thresholds

| Asset Subtype      | Threshold |
|-------------------|-----------|
| Stock             | -10%      |
| Broad equity ETF  | -7%       |
| Sector/theme ETF  | -10%      |
| Leveraged ETF     | -15%      |
| Fixed income ETF  | -3%       |
| Commodity ETF     | -10%      |

### Significant Drawdown Table

For each (cap at 5, sorted deepest first): peak date, trough date, depth %, days to trough, recovery date, days to recovery, total days underwater.

### Recovery Narratives

For top 3: 1-2 sentences covering trigger, duration, recovery shape (V/U/L).

### Risk Summary

Worst-case severity, frequency of significant drawdowns, average recovery time, current distance from all-time high.

## Momentum Analysis

### Moving Averages

50-day and 200-day SMAs (or 3-month/10-month proxies for monthly data). Report price vs. each SMA and any Golden Cross (bullish) or Death Cross (bearish) within 12 months.

### Multi-Period Returns

1-month, 3-month, 6-month, 12-month. Color with semantic colors.

### Momentum Score

Strong Bullish / Bullish / Neutral / Bearish / Strong Bearish. Based on SMA positioning, return signs, and crossover events. 1-sentence justification required.

### Signal Priority (when conflicting)

1. Price vs. 200-day SMA (most important)
2. 12-month return
3. Price vs. 50-day SMA
4. 6-month return
5. 3-month return
6. Crossover events
7. 1-month return (noise, tiebreaker only)

See `drawdown-math.md` for pseudocode and edge cases.
See `momentum-signals.md` for asset-type calibration.

---
