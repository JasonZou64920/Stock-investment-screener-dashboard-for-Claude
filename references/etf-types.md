# ETF Types Reference

Different ETF categories require different metric emphasis. Use this guide
to adapt the screening framework based on the ETF's asset class and strategy.

## Broad Equity ETFs
Examples: SPY, VTI, QQQ, IWM, VOO

Full framework applies as written. Sector breakdown uses GICS sectors.
Holdings are individual stocks. All risk metrics applicable. Default
significance threshold for drawdowns: -7%.

## Sector / Thematic Equity ETFs
Examples: XLK, ARKK, TAN, XBI, SOXX

Same as broad equity but concentration risk is more common — flag if top
10 holdings exceed 40% (lower threshold than broad). Benchmark should be
the sector-specific index, not S&P 500 alone. Drawdown threshold: -10%.
Thematic ETFs often have higher expense ratios; note competitive alternatives.

## International Equity ETFs
Examples: EFA, VWO, IXUS, EEM, VEA

Include geographic breakdown as a REQUIRED section (not optional). Note
currency exposure explicitly — international ETF returns are affected by
both underlying asset performance and currency movements. Benchmark may
be MSCI EAFE, MSCI EM, MSCI ACWI ex-US, etc. Note whether the ETF is
hedged or unhedged.

## Fixed Income ETFs
Examples: AGG, BND, LQD, HYG, TLT, TIPS, SHY

Major adaptations required:
- Replace sector breakdown with **credit quality breakdown** and **duration
  buckets** (short/intermediate/long).
- Add **effective duration**, **average credit quality**, and **weighted
  average maturity** as required Tier 2 metrics.
- **Yield** becomes the primary performance metric alongside total return.
  SEC yield is preferred over distribution yield.
- Drawdown threshold: -3% for investment-grade, -7% for high-yield.
- Benchmark: Bloomberg Aggregate, Bloomberg US Corporate, ICE BofA High
  Yield, etc. as appropriate.
- Volatility is much lower than equity — calibrate momentum signals
  accordingly.

## Commodity ETFs
Examples: GLD, SLV, USO, DBC, PDBC

Structure is fundamentally different:
- Often grantor trusts (GLD, SLV) or limited partnerships (USO).
- **No holdings breakdown** in the traditional sense — they hold physical
  commodity or futures contracts.
- Key metrics: contango/backwardation (for futures-based), storage costs,
  roll yield, tax treatment.
- Tax note: Some issue K-1 forms (USO) rather than 1099s. This matters
  for investors and should be flagged.
- Tracking difference is measured against spot commodity price.
- Drawdown threshold: -10%.

## Leveraged / Inverse ETFs
Examples: TQQQ, SQQQ, SPXU, UPRO, SOXL

**Critical warnings to include prominently:**
- These are daily-reset instruments. The leverage ratio (2x, 3x, -1x, -3x)
  applies to DAILY returns only.
- Over periods longer than one day, compounding causes returns to diverge
  significantly from the expected multiple of the index return. This
  divergence (called "volatility decay" or "beta slippage") is especially
  severe in volatile, range-bound markets.
- These are designed as short-term trading instruments, NOT buy-and-hold
  investments. A 5-year analysis will show dramatic path dependency effects.
- Expense ratios are typically higher (0.75% - 1.00%+).
- Drawdown threshold: -15% (and drawdowns can be extreme — 50%+ is common
  for 3x products in bear markets).

Include a clear note in the dashboard: "This is a leveraged/inverse ETF.
The 5-year analysis reflects the effects of daily reset compounding.
Performance over periods longer than one day may differ significantly from
the leverage multiple applied to the index return."

## Currency ETFs
Examples: FXE, UUP, FXY, FXB

Track currency pairs or baskets:
- No traditional holdings or sector breakdown.
- Key metrics: interest rate differential between currencies, rolling
  returns vs. spot rate.
- Yield may come from interest rate carry.
- Benchmark: spot exchange rate.
- These are typically used as hedging instruments or currency exposure plays.

## Multi-Asset / Allocation ETFs
Examples: AOR, AOA, AOK, NTSX

Include both equity and fixed income breakdowns. Note the rebalancing
methodology and target allocation. These are "portfolio-in-a-box" products
and should be evaluated on risk-adjusted return (Sharpe, Sortino) rather
than raw return.

## Identifying ETF Type

When the asset type is identified as ETF, determine the sub-type by checking:
1. Fund name and description (usually states "equity," "bond," "gold," etc.)
2. Asset class reported on sponsor page
3. Underlying index or benchmark
4. Top holdings (stocks = equity, bonds = fixed income, futures = commodity)
5. Whether it has a leverage/inverse label (2x, 3x, -1x, Ultra, Short, etc.)

Pass the identified sub-type to the drawdown-momentum-analysis skill as the
`asset_subtype` field.