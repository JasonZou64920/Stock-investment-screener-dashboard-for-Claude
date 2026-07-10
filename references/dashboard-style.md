# Dashboard Style Guide

Complete design system for institutional-quality investment screening dashboards — light, professional interface optimized for institutional users.

## Design Philosophy

Investment professionals scan dashboards under time pressure. Every choice serves scannability, credibility, and usability:

- **Information density with breathing room**: Financial users expect data-rich screens, but light backgrounds require careful spacing. Use white cards with subtle borders on a light gray page to prevent visual fatigue during extended sessions.
- **Hierarchy through weight and color**: Font weight, size, and semantic color convey importance. Cards lift subtly on hover. Interactive elements invite exploration without overwhelming the layout.
- **Light institutional confidence**: Clean, precise, and accessible. Think Morningstar, FactSet, or S&P Capital IQ — professional without excessive ornamentation. Subtle shadows (max 3px), no gradients, no playful embellishments. System typeface for trust and legibility.

## Color Palette

Light, institutional palette suitable for extended viewing. Semantic colors are bright enough to stand out on white backgrounds without causing eye strain.

### Primary Colors

| Token          | Hex       | Usage                                              |
|----------------|-----------|-----------------------------------------------------|
| `pageBackground` | `#F8F9FB` | Page background (very light cool gray)             |
| `cardBackground` | `#FFFFFF` | Cards, panels, modals                              |
| `borderLight`  | `#E3E8EF` | Card borders, dividers, subtle lines               |
| `borderMed`    | `#D1D8E0` | Interactive borders, input focus rings             |
| `textPrimary`  | `#1A202C` | Body text, primary copy (nearly black)             |
| `textSecondary` | `#4A5568` | Secondary text, meta information                   |
| `textMuted`    | `#718096` | Disabled text, captions, axis labels               |
| `accentBlue`   | `#2563EB` | Primary accent, links, active states, chart lines  |
| `accentBlueDark` | `#1E40AF` | Hover states for blue accents                      |
| `accentBlueSoft` | `#DBEAFE` | Light blue backgrounds, badge highlights           |

### Semantic Colors

| Token      | Hex       | Usage                                                  |
|------------|-----------|--------------------------------------------------------|
| `positive` | `#10B981` | Positive returns, bullish signals, gains, up trends    |
| `negative` | `#EF4444` | Negative returns, bearish signals, losses, down trends |
| `caution`  | `#F59E0B` | Mixed signals, watch items, neutral-to-mixed sentiment |
| `neutral`  | `#A0AEC0` | Unchanged, flat, no signal, zero values               |
| `success`  | `#10B981` | Operation success, confirmations                       |
| `warning`  | `#F59E0B` | Non-critical warnings, attention flags                |
| `error`    | `#DC2626` | Critical errors, alerts                               |

Rules: Never use pure white (#FFFFFF) for backgrounds in high-contrast contexts. Semantic colors only for data meaning, never decorative. All text must pass WCAG AA contrast on cardBackground.

## Typography

System font stack: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`
Monospace for numbers: `'SF Mono', 'Monaco', 'Roboto Mono', Consolas, monospace`

| Element              | Size  | Weight | Color           | Notes                        |
|----------------------|-------|--------|-----------------|------------------------------|
| Page title (ticker)  | 32px  | 700    | textPrimary     | Ticker symbol, hero text     |
| Page title (name)    | 16px  | 400    | textSecondary   | Company/fund name, subtitle  |
| Tab labels           | 13px  | 500    | textSecondary   | Active: accentBlue           |
| Section header       | 18px  | 600    | textPrimary     | Major sections, modals       |
| Subsection header    | 14px  | 600    | textSecondary   | Panel titles, card headers   |
| Body text            | 13px  | 400    | textPrimary     | Analysis text, paragraphs    |
| Metric label         | 11px  | 600    | textMuted       | Uppercase, 0.1em spacing     |
| Metric value         | 20px  | 700    | textPrimary     | Monospace, hero numbers      |
| Small metric         | 16px  | 600    | textSecondary   | Secondary numbers            |
| Badge/pill text      | 12px  | 500    | varies          | Sentiment tags, status pills |
| Caption/footnote     | 11px  | 400    | textMuted       | Sources, timestamps, notes   |
| Table header         | 12px  | 600    | textMuted       | Table column labels          |
| Table cell           | 13px  | 400    | textPrimary     | Table data (mono for numbers)|

Rules: All caps only for metric labels and table headers. Line height 1.5 for body, 1.3 for headers, 1.2 for metrics. Letter spacing 0.08em for metric labels.

## Layout

**Page Container**
```
max-width: 1200px
margin: 0 auto
padding: 32px 24px
background: pageBackground
min-height: 100vh
```

**Card Component**
```
background: cardBackground
border: 1px solid borderLight
border-radius: 8px
padding: 24px
margin-bottom: 20px
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08)
transition: box-shadow 150ms ease, transform 150ms ease
```

**Card Hover (Interactive Cards)**
```
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12)
transform: translateY(-2px)
cursor: pointer
```

**Grid (Metric Strips)**
```
display: grid
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))
gap: 20px
margin-bottom: 24px
```
Collapse to single column under 768px.

**Responsive Breakpoints**
- Desktop: 1200px+ (full layout)
- Tablet: 768px–1199px (2-column grids)
- Mobile: <768px (single column)

## Tab Navigation

Horizontal tab bar positioned at the top of the main content area (below the header bar). Sticky on scroll for easy access.

```
background: cardBackground
border-bottom: 2px solid borderLight
display: flex
gap: 32px
padding: 0 24px
height: 56px
position: sticky
top: 0
z-index: 10
```

**Tab Item (Inactive)**
```
color: textSecondary
font-size: 13px
font-weight: 500
padding: 16px 0
cursor: pointer
transition: color 150ms ease, border-color 150ms ease
border-bottom: 3px solid transparent
```

**Tab Item (Active)**
```
color: accentBlue
border-bottom: 3px solid accentBlue
```

**Tab Item (Hover, Inactive)**
```
color: textPrimary
border-bottom: 3px solid borderMed
```

**Page Content**
Content below tabs is fully swappable. Each tab (Overview, Analysis, News & Sentiment, Export Data) renders different sections but follows the same card and metric patterns.

## Interactive States

### Clickable Metric Cards

Metric cards that expand to show detailed breakdowns use the following pattern:

**Base State**
```
padding: 24px
background: cardBackground
border: 1px solid borderLight
border-radius: 8px
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08)
cursor: pointer
```

**Hover State**
```
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12)
transform: translateY(-2px)
background: accentBlueSoft
border-color: accentBlue
```

**Active/Expanded State**
```
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15)
border-color: accentBlue
background: cardBackground
outline: 2px solid accentBlue
outline-offset: 1px
```

### Links and Button States

**Link (Default)**
```
color: accentBlue
text-decoration: none
transition: color 150ms ease
```

**Link (Hover)**
```
color: accentBlueDark
text-decoration: underline
```

**Link (Active/Visited)**
```
color: #5B7FCC
```

**Button (Primary)**
```
background: accentBlue
color: white
border: 1px solid accentBlue
border-radius: 6px
padding: 10px 16px
font-size: 13px
font-weight: 500
cursor: pointer
transition: background 150ms ease, box-shadow 150ms ease
box-shadow: 0 1px 3px rgba(37, 99, 235, 0.2)
```

**Button (Primary Hover)**
```
background: accentBlueDark
box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3)
```

**Button (Secondary)**
```
background: transparent
color: accentBlue
border: 1px solid borderMed
border-radius: 6px
padding: 10px 16px
font-size: 13px
font-weight: 500
cursor: pointer
transition: all 150ms ease
```

**Button (Secondary Hover)**
```
border-color: accentBlue
background: accentBlueSoft
```

## Header Bar

Positioned at the very top of the dashboard, above tab navigation.

```
display: flex
justify-content: space-between
align-items: flex-start
padding: 24px
background: cardBackground
border-bottom: 1px solid borderLight
margin-bottom: 0
```

**Left Section**
```
Ticker: 32px / 700 / textPrimary / monospace
Name: 16px / 400 / textSecondary
Price: 24px / 700 / textPrimary / monospace
Change: 14px / 600 / (positive or negative) / monospace
Timestamp: 11px / 400 / textMuted
```

**Right Section**
```
Badging (e.g., "Stock", "ETF"): pill shape
background: accentBlueSoft
color: accentBlue
padding: 6px 12px
border-radius: 20px
font-size: 11px
font-weight: 600
text-transform: uppercase
```

Example header:
```
AAPL                                                Stock
Apple Inc.
$213.25   +1.47 (+0.69%)      As of Apr 9, 2026
```

## Key Metrics Strip

4–6 hero metrics displayed in a responsive grid below the header and tab bar. Each metric occupies a card slot.

**Metric Card Layout**
```
padding: 20px 24px
background: cardBackground
border: 1px solid borderLight
border-radius: 8px
text-align: center
```

**Metric Label** (above value)
```
font-size: 11px
font-weight: 600
color: textMuted
text-transform: uppercase
letter-spacing: 0.1em
margin-bottom: 8px
```

**Metric Value** (large)
```
font-size: 20px
font-weight: 700
color: textPrimary
font-family: monospace
```

**Optional Semantic Color** (for directional metrics like YTD Return)
Apply positive, negative, caution, or neutral color to the value itself, not the label.

Example metric card:
```
┌─────────────────────────┐
│  P/E RATIO              │
│  24.3                   │
│  (textPrimary)          │
└─────────────────────────┘
```

## Chart Conventions (Recharts)

All charts use light-theme colors and smooth animations for clarity.

### Price Chart (Multi-Year or Sub-3-Month)

```
<AreaChart
  data={priceData}
  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
  height={300}
>
  <defs>
    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor={accentBlue} stopOpacity={0.15}/>
      <stop offset="95%" stopColor={accentBlue} stopOpacity={0}/>
    </linearGradient>
  </defs>
  <CartesianGrid strokeDasharray="3 3" stroke={borderLight} vertical={false} />
  <XAxis
    dataKey="date"
    tick={{ fontSize: 11, fill: textMuted }}
    stroke={borderMed}
    axisLine={false}
  />
  <YAxis
    tick={{ fontSize: 11, fill: textMuted }}
    stroke={borderMed}
    axisLine={false}
    label={{ value: 'Price ($)', angle: -90, position: 'insideLeft' }}
  />
  <Tooltip
    contentStyle={{
      background: cardBackground,
      border: `1px solid ${borderMed}`,
      borderRadius: '6px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)'
    }}
    labelStyle={{ color: textPrimary }}
  />
  <Area
    type="monotone"
    dataKey="price"
    stroke={accentBlue}
    strokeWidth={2}
    fillOpacity={1}
    fill="url(#colorPrice)"
    isAnimationActive={true}
    animationDuration={800}
  />
</AreaChart>
```

**Key Rules**
- Stroke: accentBlue, 2px
- Grid: borderLight, dashed, vertical=false (horizontal lines only)
- Axes: textMuted, 11px
- Tooltip: cardBackground, textPrimary text, 1px borderMed border
- Animation: enabled, 800ms duration for smooth transitions
- Height: 300px

### Volume Bars

```
<BarChart data={volumeData} height={80} margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
  <CartesianGrid strokeDasharray="3 3" stroke={borderLight} vertical={false} />
  <XAxis dataKey="date" tick={{ fontSize: 10, fill: textMuted }} stroke={borderMed} />
  <YAxis tick={{ fontSize: 10, fill: textMuted }} stroke={borderMed} />
  <Bar dataKey="volume" fill={neutral} opacity={0.6} />
</BarChart>
```

- Fill: neutral (#A0AEC0) at 60% opacity
- Height: 80px
- Share X-axis with price chart for alignment

### Drawdown Chart

```
<AreaChart data={drawdownData} height={200} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
  <CartesianGrid strokeDasharray="3 3" stroke={borderLight} vertical={false} />
  <XAxis dataKey="date" tick={{ fontSize: 11, fill: textMuted }} stroke={borderMed} />
  <YAxis
    tick={{ fontSize: 11, fill: textMuted }}
    stroke={borderMed}
    domain={[(-Math.max(...data), 0)]}
    label={{ value: 'Drawdown (%)', angle: -90, position: 'insideLeft' }}
  />
  <Tooltip contentStyle={{ ... }} />
  <Area
    type="monotone"
    dataKey="drawdown"
    stroke={negative}
    strokeWidth={1.5}
    fill={negative}
    fillOpacity={0.15}
  />
</AreaChart>
```

- Fill: negative at 15% opacity (red tint)
- Stroke: negative, 1.5px
- Y-axis: inverted (0% at top, max drawdown at bottom)
- Height: 200px

### General Chart Rules

- Always include X/Y axis labels with descriptive text
- Use ResponsiveContainer with width="100%" for all charts
- Format Y values: prices as $X,XXX.XX, percentages as X.X%, volume abbreviated (M, B)
- Format X dates: MMM 'YY for multi-year ranges, MMM DD for sub-3-month
- No gridlines on the right/top edges (vertical=false, horizontal=true)
- Tooltip shows full precision; on-chart labels show abbreviated precision
- Animations enabled for user engagement, duration 800ms

## Pill Badges (Sentiment & Status)

Compact, inline badges for sentiment scores, momentum signals, and status flags.

**Positive Sentiment Pill**
```
background: #D1FAE5
color: #065F46
border: 1px solid #A7F3D0
border-radius: 20px
padding: 4px 12px
font-size: 12px
font-weight: 500
```

**Negative Sentiment Pill**
```
background: #FEE2E2
color: #7F1D1D
border: 1px solid #FECACA
border-radius: 20px
padding: 4px 12px
font-size: 12px
font-weight: 500
```

**Neutral/Caution Pill**
```
background: #FEF3C7
color: #78350F
border: 1px solid #FCD34D
border-radius: 20px
padding: 4px 12px
font-size: 12px
font-weight: 500
```

Use these for inline sentiment indicators, status tags, and category badges throughout the dashboard.

## Sentiment Keyword Pills Section

New section on the News & Sentiment tab showing frequently extracted keywords from article content, colored by sentiment polarity.

**Section Layout**
```
Heading: "Sentiment Themes"
Description: "Most frequently mentioned topics in recent news (past 30 days)"
Grid: grid-template-columns: repeat(auto-wrap, fit-content)
Gap: 12px
Padding: 20px
Background: accentBlueSoft (light blue highlight)
Border-radius: 8px
```

**Individual Keyword Pill** (clickable, interactive)
```
padding: 8px 14px
border-radius: 24px
font-size: 13px
font-weight: 500
cursor: pointer
transition: all 150ms ease
border: 1px solid transparent
```

**Keyword (Positive Sentiment)**
```
background: #D1FAE5
color: #065F46
border-color: #A7F3D0
On hover: background: #A7F3D0, box-shadow: 0 2px 8px rgba(16, 185, 129, 0.15)
```

**Keyword (Negative Sentiment)**
```
background: #FEE2E2
color: #7F1D1D
border-color: #FECACA
On hover: background: #FECACA, box-shadow: 0 2px 8px rgba(239, 68, 68, 0.15)
```

**Keyword (Neutral Sentiment)**
```
background: #F3F4F6
color: #374151
border-color: #E5E7EB
On hover: background: #E5E7EB, box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)
```

**Keyword Click Behavior** (optional)
When clicked, filter the news table below to show only articles mentioning that keyword, or open a detail modal showing all mentions.

## Progress-Bar Style Horizontal Gauges

For metrics with a range (e.g., RSI 0-100, Sharpe ratio, volatility percentile).

**Gauge Container**
```
display: flex
align-items: center
gap: 12px
margin: 16px 0
```

**Gauge Bar**
```
flex: 1
height: 8px
background: borderLight
border-radius: 4px
overflow: hidden
position: relative
```

**Gauge Fill**
```
height: 100%
background: linear-gradient(90deg, positive 0%, caution 50%, negative 100%)
width: ${(value / 100) * 100}%
transition: width 300ms ease
border-radius: 4px
```

**Gauge Label (Left)**
```
font-size: 12px
font-weight: 600
color: textMuted
min-width: 60px
```

**Gauge Value (Right)**
```
font-size: 13px
font-weight: 600
color: textPrimary
min-width: 40px
text-align: right
```

Example: RSI gauge shows a 8px bar filled to 65%, with "RSI" label on left and "65" on right.

## Article Detail Modal

Triggered when clicking an article row in the News & Sentiment tab.

**Modal Container (Overlay)**
```
position: fixed
top: 0
left: 0
right: 0
bottom: 0
background: rgba(0, 0, 0, 0.5)
display: flex
justify-content: center
align-items: center
z-index: 100
animation: fadeIn 200ms ease
```

**Modal Panel**
```
background: cardBackground
border: 1px solid borderLight
border-radius: 12px
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15)
max-width: 600px
width: 90%
max-height: 80vh
overflow-y: auto
padding: 32px
animation: slideUp 300ms ease
```

**Modal Header**
```
display: flex
justify-content: space-between
align-items: flex-start
margin-bottom: 20px
border-bottom: 1px solid borderLight
padding-bottom: 16px
```

**Modal Title**
```
font-size: 18px
font-weight: 600
color: textPrimary
flex: 1
```

**Close Button (X)**
```
font-size: 20px
color: textMuted
cursor: pointer
background: none
border: none
padding: 0 8px
transition: color 150ms ease
On hover: color: textPrimary
```

**Modal Body Sections**

1. **Headline** (16px / 600 / textPrimary)
2. **Publication & Date** (11px / 400 / textMuted)
3. **Sentiment Badge** (pill, positioned top-right or inline)
4. **Summary** (13px / 400 / textPrimary, max 3 lines)
5. **Sentiment Breakdown** (horizontal bar showing positive/mixed/negative words found)
6. **Key Quotes** (blockquote styling, 12px / italic, gray background)
7. **Source Link** (button: "Read Full Article →", accentBlue, opens in new tab)

**Sentiment Breakdown Bar** (inside modal)
```
display: flex
height: 24px
border-radius: 4px
overflow: hidden
background: borderLight
Segments: positive, neutral, negative with proportional widths and semantic colors
Labels below: "X positive • Y neutral • Z negative"
```

**Key Quotes Block**
```
background: pageBackground
border-left: 4px solid accentBlue
padding: 16px
border-radius: 4px
margin: 16px 0
font-size: 12px
font-style: italic
color: textSecondary
```

**Example Key Quote**
```
"Apple's services revenue grew 12% year-over-year, demonstrating sustained
strength in the ecosystem."
— Report Summary
```

**Modal Footer**
```
border-top: 1px solid borderLight
padding-top: 16px
margin-top: 20px
display: flex
justify-content: flex-end
gap: 12px
```

Buttons: "Close" (secondary), "Read Full Article" (primary, external link icon).

## News Pagination

Article table in the News & Sentiment tab displays 5 articles per page.

**Table Layout**
```
border-collapse: collapse
width: 100%
background: cardBackground
```

**Table Header Row**
```
background: pageBackground
border: 1px solid borderLight
```

**Table Header Cell**
```
padding: 12px 16px
font-size: 12px
font-weight: 600
color: textMuted
text-align: left
text-transform: uppercase
letter-spacing: 0.05em
```

**Table Body Row (Even)**
```
background: cardBackground
border-bottom: 1px solid borderLight
```

**Table Body Row (Odd)**
```
background: #FAFBFC (very light, slightly off-white)
border-bottom: 1px solid borderLight
```

**Table Body Row (Hover)**
```
background: accentBlueSoft
cursor: pointer
box-shadow: inset 0 0 0 1px borderMed
```

**Table Cell**
```
padding: 14px 16px
font-size: 13px
color: textPrimary
text-align: left
```

**Numeric Cell** (e.g., Sentiment Score)
```
font-family: monospace
font-weight: 600
text-align: right
```

**Sentiment Score Cell**
```
display: inline-flex
align-items: center
gap: 8px
```
Example: `78% ✓` (with positive icon/color) or `32% ✗` (with negative icon/color).

**Pagination Controls** (below table)
```
display: flex
justify-content: center
align-items: center
gap: 16px
margin-top: 24px
padding: 16px
background: pageBackground
border-radius: 8px
border: 1px solid borderLight
```

**Pagination Buttons**
```
Previous / Next buttons: secondary style
Disabled state: opacity 0.5, cursor: not-allowed
Active/enabled state: background accentBlueSoft, border accentBlue
```

**Page Indicator**
```
font-size: 13px
color: textMuted
Example: "Page 1 of 4 (showing 5 of 18 articles)"
```

## Table Conventions (General)

Used throughout the dashboard for data tables (holdings, metrics, articles, etc.).

**Header Row**
```
background: pageBackground
border: 1px solid borderLight
```

**Header Cell**
```
padding: 12px 16px
font-size: 12px
font-weight: 600
color: textMuted
text-transform: uppercase
letter-spacing: 0.05em
text-align: left (or right for numeric columns)
```

**Body Rows**
Alternating: cardBackground / #FAFBFC (light off-white)

**Body Cell**
```
padding: 14px 16px
font-size: 13px
color: textPrimary
border-bottom: 1px solid borderLight
```

**Monospace for Numbers**
Prices, percentages, volumes, and ratios use monospace font family.

**Right-Aligned Numeric Columns**
```
text-align: right
padding-right: 20px (extra space for visual separation)
```

**Row Hover (if clickable)**
```
background: accentBlueSoft
box-shadow: inset 0 0 0 1px borderMed
cursor: pointer
```

## Sentiment Gauge (Horizontal Segmented Bar)

Overview page sentiment summary — a full-width gauge showing the breakdown of articles by sentiment polarity across a 30-day window.

**Gauge Container**
```
padding: 24px
background: cardBackground
border: 1px solid borderLight
border-radius: 8px
margin-bottom: 20px
```

**Gauge Label (Above)**
```
font-size: 14px
font-weight: 600
color: textPrimary
margin-bottom: 8px
Example: "News Sentiment (Past 30 Days)"
```

**Gauge Bar**
```
display: flex
height: 32px
border-radius: 6px
overflow: hidden
background: borderLight
```

**Gauge Segments**
Divide bar proportionally by positive, mixed, and negative article counts.

```
Positive segment: background positive (#10B981), width: (positive / total) * 100%
Mixed segment: background caution (#F59E0B), width: (mixed / total) * 100%
Negative segment: background negative (#EF4444), width: (negative / total) * 100%
```

**Legend (Below Gauge)**
```
display: flex
justify-content: space-around
margin-top: 12px
font-size: 12px
Example: 
  ✓ 18 positive (45%)  •  ◆ 12 mixed (30%)  •  ✗ 10 negative (25%)
```

**Count Line (Below Legend)**
```
font-size: 11px
color: textMuted
text-align: center
margin-top: 8px
Example: "Based on 40 articles from the past 30 days."
```

## Sources Section

Compact reference list at the dashboard footer, grouped by category.

**Section Container**
```
padding: 24px
background: pageBackground
border: 1px solid borderLight
border-radius: 8px
margin-top: 32px
```

**Section Title**
```
font-size: 14px
font-weight: 600
color: textPrimary
margin-bottom: 16px
```

**Source Groups**
Organize sources into collapsible or simple grouped sections:
1. **Official Filings** (SEC, company investor relations)
2. **Fund Sponsor** (mutual fund / ETF sponsor resources)
3. **Data Providers** (market data, fundamentals, estimates)
4. **Publications** (news outlets, research firms)
5. **Other** (supplementary sources)

**Group Header**
```
font-size: 12px
font-weight: 600
color: textMuted
text-transform: uppercase
margin-top: 12px
margin-bottom: 8px
```

**Source Link**
```
display: block
margin: 6px 0
font-size: 13px
color: accentBlue
text-decoration: none
transition: color 150ms ease
On hover: color accentBlueDark, text-decoration underline
```

**Source Attribution**
```
font-size: 11px
color: textMuted
margin-top: 12px
Example: "Sources verified as of April 9, 2026."
```

## Disclaimer Footer

Positioned at the absolute bottom of the page, separated from content by a border.

**Container**
```
border-top: 1px solid borderLight
padding: 20px 24px
background: pageBackground
font-size: 11px
color: textMuted
line-height: 1.6
text-align: center
```

**Content** (defined in main SKILL.md)

Example:
```
This dashboard is for educational and research purposes only. It does not constitute 
investment advice, an offer to buy or sell securities, or a recommendation to buy or 
sell any security. Past performance is not indicative of future results. All data is 
provided as-is without warranty. Consult a financial advisor before making investment 
decisions.
```

---

## Animation Specifications

**Hover Lift on Interactive Cards**
```
transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), 
            box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)
```
Translate Y by -2px, increase shadow from 3px to 12px offset.

**Tab Active Indicator**
```
transition: border-color 200ms ease, color 200ms ease
```
Smooth slide of bottom border and color shift.

**Modal Entrance (Overlay + Panel)**
```
Overlay: fadeIn 200ms ease (opacity 0 → 0.5)
Panel: slideUp 300ms ease (transform: translateY(40px) → 0)
```

**Sentiment Keyword Pill Hover**
```
transition: all 150ms ease
On hover: box-shadow 0 2px 8px rgba(color, 0.15), background brighten 5%
```

**Chart Line Transitions**
```
animationDuration: 800ms
animationEasing: ease-in-out
Applies to Recharts Area, Bar, Line components on mount and data update
```

---

## Accessibility Notes

- All interactive elements have a minimum touch target of 44×44px
- Color alone never conveys information; use icons, text, or patterns (e.g., "positive" is green + checkmark + "Up")
- Form inputs have visible focus states (outline: 2px solid accentBlue)
- Modal has focus trap; keyboard users can navigate with Tab and close with Escape
- All text meets WCAG AA contrast ratios on light backgrounds
- Sentiment keywords have aria-labels describing sentiment type

---

## Export Data Tab

The fourth tab in the navigation bar allows users to export dashboard data.

**Export Options Panel**
```
padding: 24px
background: cardBackground
border: 1px solid borderLight
border-radius: 8px
```

**Export Format Selector**
```
Checkbox group or radio buttons
Options: CSV, JSON, Excel (.xlsx)
```

**Data Scope Selector**
```
Checkbox group
Options: Key Metrics, Historical Price, Volume, Drawdown, Articles, Full Report
```

**Export Button**
```
Primary button style
Text: "Download [Format]"
On click: Generate and download file
```

**Example File Names**
```
AAPL-Dashboard-Overview-Apr-9-2026.csv
AAPL-Dashboard-FullReport-Apr-9-2026.xlsx
```

---

## Summary of Key Changes from Dark Theme

1. **Page background**: Navy (#0A1628) → Light gray (#F8F9FB)
2. **Cards**: Deep blue (#111D33) → White (#FFFFFF)
3. **Borders**: Steel (#2A3F5F) → Light gray (#E3E8EF / #D1D8E0)
4. **Text**: Cloud/white → Dark gray (textPrimary #1A202C)
5. **Accents**: Ice blue (#4A90D9) → Bright blue (#2563EB)
6. **Shadows**: None in dark theme → Subtle (0 1px 3px / 0 4px 12px on hover)
7. **Interactivity**: Minimal → Enhanced hover states, modals, pill badges, pagination
8. **Navigation**: Single scroll → Multi-tab with sticky bar
9. **Modal system**: None → Full article detail modal with sentiment breakdown
10. **Typography**: Maintained system font stack, adjusted colors for light background contrast
