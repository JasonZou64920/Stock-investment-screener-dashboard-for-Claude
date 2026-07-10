# Drawdown Math Reference

Detailed computation guide with worked examples and edge cases.

## Walkthrough Example

Consider a 12-month price series:

| Month | Price  | High Water Mark | Drawdown   |
|-------|--------|-----------------|------------|
| Jan   | 100.00 | 100.00          | 0.00%      |
| Feb   | 105.00 | 105.00          | 0.00%      |
| Mar   | 95.00  | 105.00          | -9.52%     |
| Apr   | 90.00  | 105.00          | -14.29%    |
| May   | 98.00  | 105.00          | -6.67%     |
| Jun   | 107.00 | 107.00          | 0.00%      |
| Jul   | 103.00 | 107.00          | -3.74%     |
| Aug   | 100.00 | 107.00          | -6.54%     |
| Sep   | 108.00 | 108.00          | 0.00%      |
| Oct   | 102.00 | 108.00          | -5.56%     |
| Nov   | 106.00 | 108.00          | -1.85%     |
| Dec   | 110.00 | 110.00          | 0.00%      |

**Max Drawdown**: -14.29% (Feb peak to Apr trough)
**Peak Date**: Feb (price 105.00)
**Trough Date**: Apr (price 90.00)
**Recovery Date**: Jun (price 107.00, exceeds prior peak of 105.00)
**Days to Trough**: ~59 days (Feb to Apr)
**Days to Recovery**: ~61 days (Apr to Jun)
**Total Underwater**: ~120 days (Feb to Jun)

## Algorithm Pseudocode

```
function compute_drawdowns(prices):
    high_water_mark = prices[0].close
    max_drawdown = 0
    max_dd_peak_idx = 0
    max_dd_trough_idx = 0
    drawdown_series = []

    for i, point in enumerate(prices):
        if point.close > high_water_mark:
            high_water_mark = point.close
            hwm_idx = i

        drawdown = (point.close - high_water_mark) / high_water_mark
        drawdown_series.append({date: point.date, drawdown_pct: drawdown})

        if drawdown < max_drawdown:
            max_drawdown = drawdown
            max_dd_peak_idx = hwm_idx
            max_dd_trough_idx = i

    # Find recovery: first date after trough where price >= peak price
    peak_price = prices[max_dd_peak_idx].close
    recovery_idx = None
    for i in range(max_dd_trough_idx + 1, len(prices)):
        if prices[i].close >= peak_price:
            recovery_idx = i
            break

    return {
        max_drawdown: max_drawdown,
        peak: prices[max_dd_peak_idx],
        trough: prices[max_dd_trough_idx],
        recovery: prices[recovery_idx] if recovery_idx else None,
        series: drawdown_series
    }
```

## Significant Drawdown Identification

```
function find_significant_drawdowns(drawdown_series, threshold):
    events = []
    in_drawdown = False
    current_event = None

    for point in drawdown_series:
        if point.drawdown_pct < threshold and not in_drawdown:
            # Entering a significant drawdown
            in_drawdown = True
            # Find the peak: last time drawdown was 0 before this
            current_event = {start: last_zero_date, deepest: point}

        elif in_drawdown:
            if point.drawdown_pct < current_event.deepest.drawdown_pct:
                current_event.deepest = point

            if point.drawdown_pct == 0:
                # Recovered
                current_event.recovery = point
                events.append(current_event)
                in_drawdown = False
                current_event = None

    # Handle ongoing drawdown (never recovered)
    if in_drawdown and current_event:
        current_event.recovery = None
        events.append(current_event)

    return sorted(events, key=lambda e: e.deepest.drawdown_pct)
```

## Edge Cases

### Series That Never Recovers
If the price series ends before the maximum drawdown is recovered:
- Recovery date: "Not yet recovered"
- Days to recovery: "Ongoing — X days and counting" (from trough to end of series)
- The current_vs_high_pct field captures where the price stands vs. the peak.

### Multiple Equal Peaks
If the high-water mark is reached multiple times at the same price, the
peak date for a subsequent drawdown is the most recent date the high-water
mark was matched or exceeded.

### Flat Series
A price series with zero volatility (e.g., money market ETF) will show 0%
max drawdown. This is a valid result. Note it as "No significant drawdowns
during the period."

### Very Short Series
If the series has fewer than 12 months of data, drawdown analysis can still
run but should be caveated: "Based on limited history (X months). Drawdown
statistics may not reflect the full risk profile."

### Multiple Drawdowns Without Full Recovery Between Them
If the price drops, partially recovers, then drops further (without ever
reaching a new high), this is ONE drawdown event, not two. The event starts
at the original peak and the trough is the deepest point before a full
recovery.

## Annualization Note

Drawdowns are NOT annualized. They are point-to-point measurements.
A -30% drawdown over 6 months is reported as -30%, not annualized to some
other figure. Returns and volatility are annualized; drawdowns are not.
