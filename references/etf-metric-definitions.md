# ETF Metric Definitions

Precise definitions for ETF-specific metrics used in the screening framework.

## Cost Metrics

### Expense Ratio (Net)
Annual operating expenses as a percentage of fund assets, after any fee
waivers or reimbursements. This is the number investors actually pay.
Source from the fund sponsor page or prospectus.

### Expense Ratio (Gross)
Annual operating expenses before fee waivers. Only report if materially
different from net (difference > 0.05%). Note the waiver expiration date
if available — temporary waivers can create cost surprises when they expire.

## Tracking Metrics

### Tracking Error (1-Year)
Annualized standard deviation of the daily return difference between the
ETF and its benchmark index over the trailing 12 months.

Calculation: For each trading day, compute (ETF daily return - index daily
return). Take the standard deviation of this series, then annualize by
multiplying by sqrt(252).

Interpretation:
- Under 0.10%: Excellent (typical for large, liquid index ETFs like SPY)
- 0.10% - 0.50%: Good (typical for most well-run index ETFs)
- 0.50% - 1.00%: Moderate (common for international or less liquid indices)
- Over 1.00%: High (may indicate sampling issues or illiquid underlying)

### Tracking Difference (1-Year)
Cumulative total return of the ETF minus cumulative total return of the
benchmark index over the trailing 12 months.

Unlike tracking error (which measures consistency), tracking difference
measures the total cost of ownership. Expected to be slightly negative —
roughly equal to the negative expense ratio for a well-run fund.

If tracking difference is more negative than the expense ratio, the fund
has additional drag (transaction costs, sampling error, cash drag).
If tracking difference is less negative (or positive), the fund may
benefit from securities lending income or favorable sampling.

### Premium/Discount to NAV
(Market price - NAV) / NAV * 100, expressed as a percentage.

- **Premium**: Market price > NAV. Buyers are paying more than the
  underlying assets are worth.
- **Discount**: Market price < NAV. Buyers are paying less.
- Normal range for liquid ETFs: -0.05% to +0.05%.
- Persistent premiums/discounts > 0.50% may indicate structural issues,
  illiquid underlyings, or creation/redemption bottlenecks.

Report both current premium/discount and the trailing 12-month average.

## Yield Metrics

### Distribution Yield (TTM)
Sum of all distributions paid over the trailing twelve months divided by
the current market price, expressed as a percentage.

This is backward-looking and does not predict future distributions. It
can be distorted by special distributions or return-of-capital payments.

### SEC Yield (30-Day)
Standardized yield calculation prescribed by the SEC, based on the most
recent 30-day period. Reflects the yield an investor would receive if
the portfolio composition and yield remained constant.

More comparable across funds than distribution yield because it uses a
consistent, mandated methodology. Available on the fund sponsor page.

For equity ETFs, SEC yield is less meaningful than distribution yield.
For fixed income ETFs, SEC yield is the preferred metric.

## Flow Metrics

### Fund Flows
Net new money into or out of the fund, measured in dollars.

Calculation: Track changes in shares outstanding. When new shares are
created (through the creation/redemption mechanism), that represents
inflows. When shares are redeemed, that represents outflows.

Approximate formula: Change in shares outstanding * average NAV over
the period.

Interpretation:
- Sustained inflows signal institutional demand and conviction.
- Sustained outflows may signal structural concerns, fee competition,
  or a shift to alternative vehicles.
- Flows are not performance signals — a fund can have strong returns
  and outflows (or vice versa).

Report for 1-year, 3-year (if available), and YTD periods.

## Fixed Income ETF Metrics

### Effective Duration
Measures the sensitivity of the bond portfolio's price to a 1% parallel
shift in interest rates. A duration of 6 means approximately 6% price
decline if rates rise 1%.

Not the same as average maturity — duration accounts for coupon payments,
embedded options, and other cash flow characteristics.

### Average Credit Quality
Weighted average credit rating of bonds in the portfolio. Usually reported
on the standard scale: AAA, AA, A, BBB (investment grade), BB, B, CCC
(below investment grade).

Some funds report two ratings (Moody's and S&P equivalents). Use the
lower of the two if they differ.

### Weighted Average Maturity
Average time to maturity of bonds in the portfolio, weighted by market
value. Longer maturity generally means more interest rate sensitivity
(but duration is a better measure of that).