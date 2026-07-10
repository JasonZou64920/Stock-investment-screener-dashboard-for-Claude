# Momentum Signals Reference

Extended discussion of momentum indicators and their interpretation.

## Why 50-Day and 200-Day SMAs

These are the industry-standard moving averages:
- **50-day SMA** captures roughly one quarter of trading activity. It's
  responsive enough to reflect recent trends while smoothing daily noise.
- **200-day SMA** captures roughly one year of trading. It represents the
  long-term trend direction and is widely watched by institutional investors.

Together they provide a two-timeframe trend view that is universally
understood by investment professionals. Using non-standard periods
(like 100-day or 150-day) would reduce comparability.

## Golden Cross / Death Cross

- **Golden Cross**: 50-day SMA crosses above 200-day SMA. The short-term
  trend is now stronger than the long-term trend, generally considered
  bullish.
- **Death Cross**: 50-day SMA crosses below 200-day SMA. The short-term
  trend has weakened below the long-term trend, generally considered bearish.

**Important caveat**: These are lagging indicators by definition — they
confirm trend changes after they've already begun. They are more useful
for confirming a trend than predicting one. Note this in the dashboard
narrative rather than presenting crossovers as predictive signals.

In range-bound markets, crossovers can whipsaw (cross back and forth
frequently), generating false signals. Note if multiple crossovers
occurred within a short period.

## 12-Month Momentum

Academic research (Jegadeesh & Titman, 1993; Asness et al., 2013) has
consistently found that trailing 12-month returns have predictive power
for forward returns across asset classes and geographies. This is the
most cited momentum factor in quantitative finance.

The 12-month return is the single most important momentum metric. When
signals conflict, the 12-month return should carry the most weight in
the momentum score assignment.

## Multi-Period Momentum Interpretation

- **1 Month**: Very short-term. Noisy. Subject to mean reversion. Include
  for completeness but do not let it heavily influence the score.
- **3 Months**: Short-term momentum. Meaningful for identifying recent
  trend shifts.
- **6 Months**: Medium-term. Strong signal for trend continuation.
- **12 Months**: The sweet spot. Strongest empirical support for momentum
  persistence.

When short-term and long-term momentum disagree (e.g., positive 1-month
but negative 12-month), the score should lean toward the longer timeframe.
Recent short-term strength within a longer downtrend is a "bear market
rally" until the longer-term trend confirms a reversal.

## Asset-Type Calibration

Different asset types have different typical return magnitudes. A +5%
6-month return means very different things for a bond ETF vs. a tech stock:

| Asset Type        | Typical 6-Month Range | "Strong" Threshold |
|-------------------|----------------------|-------------------|
| Large-cap stock   | -15% to +20%         | > +15%            |
| Small-cap stock   | -20% to +25%         | > +18%            |
| Broad equity ETF  | -12% to +18%         | > +12%            |
| Sector equity ETF | -20% to +25%         | > +18%            |
| Fixed income ETF  | -5% to +5%           | > +3%             |
| Commodity ETF     | -15% to +20%         | > +15%            |

For borderline momentum scores, use the asset's typical range as context.
A +4% 6-month return is "neutral" for a stock but "strong bullish" for
a bond ETF.

## Conflicting Signals

When indicators disagree, use this priority order:

1. **Price vs. 200-day SMA** — The single most important trend indicator.
   Above = bullish lean, below = bearish lean.
2. **12-month return** — Strongest empirical momentum signal.
3. **Price vs. 50-day SMA** — Short-term trend confirmation.
4. **6-month return** — Medium-term confirmation.
5. **3-month return** — Recent direction.
6. **Crossover events** — Confirmatory, not primary.
7. **1-month return** — Noise; tiebreaker only.

## Momentum Decay and Reversal

Very long-term momentum (beyond 12 months) tends to reverse — this is
the "long-term reversal" effect documented in the academic literature.
Assets that have performed strongly over 3-5 years are slightly more
likely to underperform going forward than to continue outperforming.

This is why the screening framework focuses on 1-12 month momentum
windows and does not extend the momentum analysis to multi-year periods.
Multi-year returns are captured in the performance summary table instead.
