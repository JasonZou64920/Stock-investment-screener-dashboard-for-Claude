# MACD Moving Average Strategy Reference

Framework for computing the 10-month moving average + monthly MACD strategy
classification, conviction scoring, and natural-language explanation generation.

---

## 1. Monthly OHLC Aggregation

Convert daily price data (gathered in Step 2) into monthly OHLC candles.

**Algorithm:**
1. Group daily records by calendar month (YYYY-MM).
2. For each group:
   - `open` = first trading day's open (or close of previous month's last day if open unavailable)
   - `high` = max of all daily highs (or daily closes if highs unavailable)
   - `low` = min of all daily lows (or daily closes if lows unavailable)
   - `close` = last trading day's close
   - `volume` = sum of all daily volumes in the month
   - `date` = last trading day date of that month (used as the candle's X position)
3. Require at least 10 trading days in a month for it to count (partial months at edges are acceptable for the most recent month only).
4. Output: array of `{ date, open, high, low, close, volume }` — typically ~60 candles for 5 years.

**Edge cases:**
- If only daily close prices are available (no OHLC), set `open = close` of first day, `high = max(close)`, `low = min(close)`, `close = close` of last day. Note "Synthetic OHLC from close-only data" in the dashboard.
- Partial current month: include as the rightmost candle, annotate with "(MTD)" in the header.

---

## 2. 10-Month Simple Moving Average

Compute a 10-month SMA on monthly close prices.

**Formula:** `MA10[i] = mean(close[i-9], close[i-8], ..., close[i])`

- Requires at least 10 months of data before the first MA value exists.
- For charting: the MA line begins at month 10 of the series.
- Store as `ma10` field on each monthly data point (null for the first 9 months).
- The MA value should be computed on the final close of each month, not intra-month.

**Interpretation framework:**
- Price > MA10: constructive long-term regime (trend filter is bullish)
- Price < MA10: defensive long-term regime (trend filter is bearish)
- Price crossing above MA10: potential regime change to bullish (confirm with MACD)
- Price crossing below MA10: potential regime change to bearish (confirm with MACD)
- Price hovering near MA10 (within 2%): ambiguous / transitional zone

---

## 3. Monthly MACD Computation

Standard MACD using the (12, 26, 9) parameters applied to **monthly** close prices.

**Step-by-step:**

1. **EMA-12 (fast):** 12-month exponential moving average of monthly closes.
   - Multiplier: `k = 2 / (12 + 1) = 0.1538`
   - `EMA12[i] = close[i] * k + EMA12[i-1] * (1 - k)`
   - Seed: SMA of first 12 closes.

2. **EMA-26 (slow):** 26-month exponential moving average of monthly closes.
   - Multiplier: `k = 2 / (26 + 1) = 0.0741`
   - `EMA26[i] = close[i] * k + EMA26[i-1] * (1 - k)`
   - Seed: SMA of first 26 closes.

3. **MACD line:** `MACD[i] = EMA12[i] - EMA26[i]`
   - First valid value at month 26.

4. **Signal line:** 9-month EMA of the MACD line.
   - Multiplier: `k = 2 / (9 + 1) = 0.2`
   - Seed: SMA of first 9 valid MACD values.
   - First valid value at month 34.

5. **Histogram:** `histogram[i] = MACD[i] - signal[i]`
   - Positive histogram = MACD above signal (momentum expanding)
   - Negative histogram = MACD below signal (momentum contracting)

**Data output per month:**
```
{ date, open, high, low, close, volume, ma10, macd, signal, histogram }
```

Null fields for months where computation hasn't started.

**MACD direction assessment (used by strategy engine):**
- `macdTrend`: "rising" if MACD[current] > MACD[previous], else "falling"
- `histogramTrend`: "expanding" if |histogram[current]| > |histogram[previous]| in same sign direction, else "contracting"
- `momentumStrengthening`: true if histogram is expanding in the same direction as MACD sign (positive and growing, or negative and growing more negative)
- `momentumWeakening`: true if histogram is contracting (shrinking toward zero regardless of sign)

---

## 4. Strategy Classification Engine

Uses the 10-month MA and monthly MACD to classify the stock into one of six regimes.

### Input variables

| Variable | Source | Description |
|----------|--------|-------------|
| `priceVsMa` | close vs ma10 | "above" if close > ma10, "below" if close < ma10, "near" if within 2% |
| `macdSign` | macd value | "positive" if macd > 0, "negative" if macd < 0 |
| `macdTrend` | macd[i] vs macd[i-1] | "rising" or "falling" |
| `histogramSign` | histogram value | "positive" or "negative" |
| `histogramTrend` | histogram magnitude direction | "expanding" or "contracting" |
| `momentumAligned` | macdSign matches priceVsMa direction | true/false |

### Classification rules (evaluate in order)

| # | Condition | Label | Conviction |
|---|-----------|-------|------------|
| 1 | priceVsMa = "above" AND macdSign = "positive" AND histogramTrend = "expanding" | **Strong Bull** | 85-95% |
| 2 | priceVsMa = "above" AND macdSign = "positive" AND histogramTrend = "contracting" | **Bull** | 65-80% |
| 3 | priceVsMa = "above" AND (macdSign = "negative" OR macdTrend = "falling" with histogram turning negative) | **Neutral / Bull Under Pressure** | 40-55% |
| 4 | priceVsMa = "below" AND (macdTrend = "rising" OR histogram turning less negative) | **Neutral / Recovery Watch** | 35-50% |
| 5 | priceVsMa = "below" AND macdSign = "negative" AND histogramTrend = "contracting" | **Bear** | 65-80% |
| 6 | priceVsMa = "below" AND macdSign = "negative" AND histogramTrend = "expanding" (more negative) | **Strong Bear** | 85-95% |

**Conviction scoring details:**
- Base conviction from table above.
- Add +5% if price has been on same side of MA10 for 3+ consecutive months.
- Add +5% if MACD and histogram agree in direction.
- Subtract -10% if price is within 2% of MA10 (transitional zone).
- Subtract -5% if histogram has changed sign in the last 2 months (recent reversal).
- Cap at 95%, floor at 25%.

### Trend and momentum sub-labels

**Trend status** (from 10-month MA):
- "Confirmed Uptrend" — price > MA10 for 3+ months
- "Emerging Uptrend" — price just crossed above MA10 (1-2 months)
- "Confirmed Downtrend" — price < MA10 for 3+ months
- "Emerging Downtrend" — price just crossed below MA10 (1-2 months)
- "Transitional" — price within 2% of MA10 or recently crossed

**Momentum status** (from MACD):
- "Strong Positive" — MACD > 0 and histogram expanding
- "Positive but Fading" — MACD > 0 but histogram contracting
- "Turning Positive" — MACD < 0 but histogram contracting (approaching zero from below)
- "Turning Negative" — MACD > 0 but histogram contracting sharply toward zero
- "Negative but Improving" — MACD < 0 and histogram contracting (less negative)
- "Strong Negative" — MACD < 0 and histogram expanding (more negative)

---

## 5. Natural Language Explanation Templates

The strategy status block must output a 2-4 sentence explanation. Use these templates as a starting framework, then adapt to the specific data.

### Strong Bull
"[Ticker] closes at [price], firmly above the 10-month moving average ([ma10_value]), indicating a confirmed long-term uptrend. Monthly MACD is positive at [macd_value] with an expanding histogram, confirming strengthening bullish momentum. Trend and momentum are fully aligned, supporting high conviction in the current bullish regime."

### Bull
"[Ticker] remains above the 10-month moving average ([ma10_value]), maintaining a constructive long-term trend. Monthly MACD is positive but the histogram is contracting, suggesting momentum may be decelerating even though the broader trend structure holds. Conviction is moderate — watch for histogram stabilization or re-expansion."

### Neutral / Bull Under Pressure
"[Ticker] is still trading above the 10-month moving average ([ma10_value]), but monthly MACD has turned negative or is deteriorating, which raises a caution flag. The long-term trend filter remains nominally bullish, but weakening momentum suggests the uptrend may be losing steam. A sustained MACD decline could precede a break below the moving average."

### Neutral / Recovery Watch
"[Ticker] remains below the 10-month moving average ([ma10_value]), indicating the long-term trend is still under pressure. However, monthly MACD is showing signs of improvement — the histogram is becoming less negative, which may be an early signal of momentum recovery. Confirmation requires MACD crossing above zero and price reclaiming the moving average."

### Bear
"[Ticker] is trading below the 10-month moving average ([ma10_value]), indicating a weakened long-term trend. Monthly MACD is negative, confirming downside momentum. Trend and momentum are aligned to the downside, though the histogram is not worsening, suggesting the decline may be stabilizing."

### Strong Bear
"[Ticker] closes at [price], well below the 10-month moving average ([ma10_value]), indicating a confirmed long-term downtrend. Monthly MACD is negative at [macd_value] with an expanding (more negative) histogram, confirming accelerating bearish momentum. Trend and momentum are fully aligned to the downside — high conviction in the current bearish regime."

### Risk note generation
Always append a risk note based on regime:
- Bull regimes: "Key risk: a sustained break below the 10-month moving average would shift the trend assessment."
- Bear regimes: "Key recovery signal: MACD histogram contraction followed by price reclaiming the 10-month moving average."
- Neutral regimes: "The current state is ambiguous — monitor for decisive resolution above or below the 10-month moving average."

---

## 6. Display specifications

### Strategy Status Card layout
```
┌─────────────────────────────────────────────────┐
│  STRATEGY STATUS                                │
│                                                 │
│  ┌──────────┐  Trend: Confirmed Uptrend         │
│  │ STRONG   │  Momentum: Strong Positive         │
│  │  BULL    │  Conviction: 90%                   │
│  └──────────┘                                   │
│                                                 │
│  Price remains above the 10-month moving        │
│  average ($187.42), indicating a confirmed      │
│  long-term uptrend. Monthly MACD is positive    │
│  at 4.32 with an expanding histogram...         │
│                                                 │
│  ───────────────────────────────────────────     │
│  Key risk: a sustained break below the          │
│  10-month moving average would shift the        │
│  trend assessment.                              │
└─────────────────────────────────────────────────┘
```

### Regime badge colors
| Regime | Badge BG | Badge Text |
|--------|----------|------------|
| Strong Bull | #ECFDF5 | #059669 |
| Bull | #ECFDF5 (lighter) | #059669 |
| Neutral / Bull Under Pressure | #FFFBEB | #D97706 |
| Neutral / Recovery Watch | #FFFBEB | #D97706 |
| Bear | #FEF2F2 | #DC2626 |
| Strong Bear | #FEF2F2 | #DC2626 |

### Conviction bar
Horizontal progress bar, 0-100%. Color matches regime badge. Show percentage label right-aligned.
