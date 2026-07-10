# Component Templates Reference

Reusable React component snippets for screening dashboard building blocks.
Light theme with enhanced interactivity using the COLORS constant below.

## Color Tokens (Light Theme)

```jsx
const COLORS = {
  pageBg: '#F7F8FA',
  cardBg: '#FFFFFF',
  cardBgHover: '#FAFBFC',
  border: '#E2E8F0',
  borderLight: '#EDF2F7',
  accent: '#2563EB',
  accentLight: '#3B82F6',
  accentBg: '#EFF6FF',
  textPrimary: '#1A202C',
  textBody: '#4A5568',
  textMuted: '#A0AEC0',
  textLight: '#CBD5E0',
  positive: '#059669',
  positiveBg: '#ECFDF5',
  negative: '#DC2626',
  negativeBg: '#FEF2F2',
  caution: '#D97706',
  cautionBg: '#FFFBEB',
  neutral: '#6B7280',
  neutralBg: '#F3F4F6',
};
```

---

## Number Formatting Helpers

CRITICAL: Use these formatters for ALL numeric display. Define at the top of the component.

```jsx
const fmt = {
  price: (v) => v == null ? '—' : '$' + Number(v).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
  pct: (v) => v == null ? '—' : (v >= 0 ? '+' : '') + Number(v).toFixed(2) + '%',
  vol: (v) => {
    if (v == null) return '—';
    const m = Number(v) / 1e6;
    return m.toFixed(2) + 'M';
  },
  bigNum: (v) => {
    if (v == null) return '—';
    const n = Number(v);
    if (n >= 1e12) return '$' + (n / 1e12).toFixed(2) + 'T';
    if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
    if (n >= 1e6) return '$' + (n / 1e6).toFixed(2) + 'M';
    return '$' + n.toLocaleString();
  },
};
// Examples:
// fmt.price(213.254)  → "$213.25"
// fmt.vol(89234500)   → "89.23M"
// fmt.pct(0.69)       → "+0.69%"
// fmt.pct(-2.31)      → "-2.31%"
// fmt.bigNum(2.87e12) → "$2.87T"
```

Rules:
- All prices: 2 decimal places, comma-separated thousands, $ prefix
- All volumes: divide by 1,000,000, round to 2 decimal places, suffix "M"
- All percentages: 2 decimal places, +/- prefix, % suffix
- All large numbers (market cap, AUM): abbreviated with 2dp (T/B/M)
- Y-axis tickFormatter for price charts: `fmt.price`
- Y-axis tickFormatter for volume bars: `fmt.vol`
- Tooltip formatters: use `fmt.price` for price, `fmt.vol` for volume

---

## DashboardContainer

Outer wrapper for the entire dashboard with light background.

```jsx
const DashboardContainer = ({ children }) => (
  <div style={{
    maxWidth: 1200,
    margin: '0 auto',
    padding: '32px 24px',
    backgroundColor: COLORS.pageBg,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    color: COLORS.textPrimary,
    lineHeight: 1.5,
  }}>
    {children}
  </div>
);
```

---

## SectionCard

Card wrapper for each dashboard section with subtle borders and hover effects.

```jsx
const SectionCard = ({ title, children }) => (
  <div style={{
    backgroundColor: COLORS.cardBg,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 6,
    padding: '20px 24px',
    marginBottom: 16,
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  }}>
    {title && (
      <h2 style={{
        fontSize: 18,
        fontWeight: 600,
        color: COLORS.textPrimary,
        margin: '0 0 16px 0',
      }}>
        {title}
      </h2>
    )}
    {children}
  </div>
);
```

---

## HeaderBar

Dashboard header displaying ticker, company name, asset type badge, price, and change metrics.

```jsx
const HeaderBar = ({ ticker, name, assetType, price, change, changePct, timestamp }) => (
  <div style={{
    backgroundColor: COLORS.cardBg,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 6,
    padding: '24px 28px',
    marginBottom: 16,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <span style={{ fontSize: 28, fontWeight: 700, color: COLORS.textPrimary }}>{ticker}</span>
          <span style={{
            fontSize: 11,
            fontWeight: 500,
            color: COLORS.accent,
            backgroundColor: COLORS.accentBg,
            padding: '2px 10px',
            borderRadius: 10,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            border: `1px solid ${COLORS.accentLight}33`,
          }}>
            {assetType}
          </span>
        </div>
        <div style={{ fontSize: 16, fontWeight: 400, color: COLORS.textBody, marginBottom: 12 }}>
          {name}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span style={{
            fontSize: 24, fontWeight: 700, color: COLORS.textPrimary,
            fontFamily: "'SF Mono', 'Fira Code', Consolas, monospace",
          }}>
            ${typeof price === 'number' ? price.toLocaleString('en-US', { minimumFractionDigits: 2 }) : price}
          </span>
          <span style={{
            fontSize: 14, fontWeight: 600,
            color: change >= 0 ? COLORS.positive : COLORS.negative,
            fontFamily: "'SF Mono', 'Fira Code', Consolas, monospace",
          }}>
            {change >= 0 ? '+' : ''}{change?.toFixed(2)} ({change >= 0 ? '+' : ''}{changePct?.toFixed(2)}%)
          </span>
        </div>
      </div>
    </div>
    <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 8 }}>
      {timestamp}
    </div>
  </div>
);
```

---

## MetricStrip

Responsive grid of 4-6 hero metrics on light background.

```jsx
const MetricStrip = ({ metrics }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: 16,
    backgroundColor: COLORS.cardBg,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 6,
    padding: '20px 24px',
    marginBottom: 16,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  }}>
    {metrics.map((m, i) => (
      <div key={i}>
        <div style={{
          fontSize: 11, fontWeight: 500, color: COLORS.textMuted,
          textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4,
        }}>
          {m.label}
        </div>
        <div style={{
          fontSize: 20, fontWeight: 700,
          color: m.color || COLORS.textPrimary,
          fontFamily: "'SF Mono', 'Fira Code', Consolas, monospace",
        }}>
          {m.value}
        </div>
      </div>
    ))}
  </div>
);
```

---

## DataTable

Styled table with alternating row backgrounds and right-aligned numbers.

```jsx
const DataTable = ({ columns, rows }) => (
  <div style={{ overflowX: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ backgroundColor: COLORS.neutralBg }}>
          {columns.map((col, i) => (
            <th key={i} style={{
              padding: '10px 12px',
              fontSize: 11, fontWeight: 500, color: COLORS.textMuted,
              textTransform: 'uppercase', letterSpacing: '0.05em',
              textAlign: col.align || 'left',
              borderBottom: `1px solid ${COLORS.border}`,
            }}>
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri} style={{
            backgroundColor: ri % 2 === 1 ? COLORS.cardBgHover : COLORS.cardBg,
            borderBottom: `1px solid ${COLORS.borderLight}`,
            transition: 'background-color 0.15s ease',
          }}>
            {columns.map((col, ci) => (
              <td key={ci} style={{
                padding: '10px 12px',
                fontSize: 13,
                color: row[col.key + '_color'] || COLORS.textBody,
                textAlign: col.align || 'left',
                fontFamily: col.mono ? "'SF Mono', 'Fira Code', Consolas, monospace" : 'inherit',
              }}>
                {row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
```

---

## ChartWrapper

Standardized Recharts container with tooltip and axis styling optimized for light backgrounds.

```jsx
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const ChartWrapper = ({ data, dataKey, height = 300, yFormat, xFormat, color }) => (
  <ResponsiveContainer width="100%" height={height}>
    <AreaChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
      <defs>
        <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color || COLORS.accentLight} stopOpacity={0.15} />
          <stop offset="100%" stopColor={color || COLORS.accentLight} stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid stroke={COLORS.borderLight} strokeOpacity={0.6} strokeDasharray="3 3" />
      <XAxis
        dataKey="date"
        tick={{ fill: COLORS.textMuted, fontSize: 11 }}
        tickFormatter={xFormat}
        axisLine={{ stroke: COLORS.border }}
        tickLine={{ stroke: COLORS.border }}
      />
      <YAxis
        tick={{ fill: COLORS.textMuted, fontSize: 11 }}
        tickFormatter={yFormat}
        axisLine={{ stroke: COLORS.border }}
        tickLine={{ stroke: COLORS.border }}
      />
      <Tooltip
        contentStyle={{
          backgroundColor: COLORS.cardBg,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 4,
          color: COLORS.textPrimary,
          fontSize: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      />
      <Area
        type="monotone"
        dataKey={dataKey}
        stroke={color || COLORS.accentLight}
        strokeWidth={2}
        fill={`url(#grad-${dataKey})`}
        isAnimationActive={false}
      />
    </AreaChart>
  </ResponsiveContainer>
);
```

---

## PriceVolumeChart (Overview Page)

CRITICAL: Price and Volume are TWO SEPARATE Recharts charts stacked vertically. They share the same X axis visually but are independent `<ResponsiveContainer>` elements. The volume chart sits directly below the price chart with zero gap. The price chart hides its X axis labels; only the volume chart shows them.

This pattern avoids the performance issues of ComposedChart with large datasets.

**IMPORTANT — Data downsampling for performance:** With ~1,260 daily data points, the chart WILL lag. Always downsample to ~250 weekly points for display. Keep the full daily dataset only in export tables. The `downsample` helper below is REQUIRED.

```jsx
// --- REQUIRED: Downsample helper (put near top of component) ---
const downsample = (data, maxPoints = 250) => {
  if (data.length <= maxPoints) return data;
  const step = Math.ceil(data.length / maxPoints);
  return data.filter((_, i) => i % step === 0 || i === data.length - 1);
};

// --- Usage in the Overview page ---
// Assume PRICE_DATA is the full daily array: [{ date, close, volume }, ...]
const chartData = useMemo(() => downsample(PRICE_DATA, 250), []);

// Price Chart (top) — height 300, NO x-axis labels
<div style={{ background: COLORS.cardBg, borderRadius: 8, border: `1px solid ${COLORS.border}`, padding: '16px 16px 0 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
  <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.textPrimary, marginBottom: 8 }}>
    Price — 5 Year
  </div>
  <ResponsiveContainer width="100%" height={300}>
    <AreaChart data={chartData} margin={{ top: 5, right: 20, bottom: 0, left: 10 }}>
      <defs>
        <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={COLORS.accentLight} stopOpacity={0.15} />
          <stop offset="100%" stopColor={COLORS.accentLight} stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid stroke={COLORS.borderLight} strokeDasharray="3 3" />
      <XAxis dataKey="date" hide={true} />
      <YAxis
        tick={{ fill: COLORS.textMuted, fontSize: 11 }}
        tickFormatter={fmt.price}
        axisLine={{ stroke: COLORS.border }}
        width={70}
      />
      <Tooltip
        formatter={(v) => [fmt.price(v), 'Price']}
        contentStyle={{ backgroundColor: COLORS.cardBg, border: `1px solid ${COLORS.border}`, borderRadius: 4, fontSize: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
        isAnimationActive={false}
      />
      <Area type="monotone" dataKey="close" stroke={COLORS.accentLight} strokeWidth={2} fill="url(#priceGrad)" isAnimationActive={false} dot={false} />
    </AreaChart>
  </ResponsiveContainer>

  {/* Volume Chart (bottom) — height 100, shows x-axis labels */}
  <ResponsiveContainer width="100%" height={100}>
    <BarChart data={chartData} margin={{ top: 0, right: 20, bottom: 5, left: 10 }}>
      <XAxis
        dataKey="date"
        tick={{ fill: COLORS.textMuted, fontSize: 10 }}
        tickFormatter={(d) => d.slice(0, 7)}
        axisLine={{ stroke: COLORS.border }}
        tickLine={false}
        interval="preserveStartEnd"
      />
      <YAxis
        tick={{ fill: COLORS.textMuted, fontSize: 10 }}
        tickFormatter={fmt.vol}
        axisLine={{ stroke: COLORS.border }}
        width={70}
      />
      <Tooltip
        formatter={(v) => [fmt.vol(v), 'Volume']}
        contentStyle={{ backgroundColor: COLORS.cardBg, border: `1px solid ${COLORS.border}`, borderRadius: 4, fontSize: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
        isAnimationActive={false}
      />
      <Bar dataKey="volume" fill={COLORS.accentLight} opacity={0.4} isAnimationActive={false} />
    </BarChart>
  </ResponsiveContainer>
</div>
```

Key rules:
- Price chart: `height={300}`, XAxis `hide={true}`, Area with `dot={false}`
- Volume chart: `height={100}`, sits directly below with no gap (both inside same card div)
- Both use `isAnimationActive={false}` on ALL elements including Tooltip
- Both use `dot={false}` or no dots to reduce DOM nodes
- Data is downsampled via `useMemo` — never pass raw 1,260-point array to Recharts
- `interval="preserveStartEnd"` on volume XAxis to limit tick count

---

## SentimentGauge

Horizontal segmented bar showing positive/mixed/negative proportions with labels.

```jsx
const SentimentGauge = ({ positive, mixed, negative, total, rating }) => {
  const pPct = (positive / total) * 100;
  const mPct = (mixed / total) * 100;
  const nPct = (negative / total) * 100;
  const ratingColor = rating.includes('Bullish') ? COLORS.positive
    : rating.includes('Bearish') ? COLORS.negative
    : COLORS.caution;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <span style={{ fontSize: 16, fontWeight: 600, color: ratingColor }}>
          {rating}
        </span>
      </div>
      <div style={{
        display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden',
        backgroundColor: COLORS.borderLight, marginBottom: 8,
      }}>
        <div style={{ width: `${pPct}%`, backgroundColor: COLORS.positive }} />
        <div style={{ width: `${mPct}%`, backgroundColor: COLORS.caution }} />
        <div style={{ width: `${nPct}%`, backgroundColor: COLORS.negative }} />
      </div>
      <div style={{ fontSize: 11, color: COLORS.textMuted }}>
        Based on {total} articles — {positive} positive, {mixed} mixed, {negative} negative
      </div>
    </div>
  );
};
```

---

## TabNavigation

Horizontal tab bar with page navigation. Active tab displays accent underline and accent text color. Uses React useState for page state management.

```jsx
import React, { useState } from 'react';

const TabNavigation = ({ onPageChange }) => {
  const [activePage, setActivePage] = useState('Overview');
  const pages = ['Overview', 'Analysis', 'News & Sentiment', 'Export Data'];

  const handlePageChange = (page) => {
    setActivePage(page);
    if (onPageChange) onPageChange(page);
  };

  return (
    <div style={{
      display: 'flex',
      borderBottom: `2px solid ${COLORS.border}`,
      marginBottom: 24,
      gap: 0,
    }}>
      {pages.map((page) => {
        const isActive = activePage === page;
        return (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            style={{
              padding: '12px 20px',
              fontSize: 14,
              fontWeight: isActive ? 600 : 500,
              color: isActive ? COLORS.accent : COLORS.textBody,
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: isActive ? `3px solid ${COLORS.accent}` : '3px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              marginBottom: '-2px',
            }}>
            {page}
          </button>
        );
      })}
    </div>
  );
};
```

---

## PageContainer

Wraps content and conditionally renders based on active page. Manages visibility of tab-specific content.

```jsx
const PageContainer = ({ activePage, pageName, children }) => {
  return activePage === pageName ? (
    <div style={{
      animation: 'fadeIn 0.15s ease',
    }}>
      {children}
    </div>
  ) : null;
};

/* Add this CSS animation to your stylesheet: */
/* @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } */
```

---

## ArticleModal

Overlay modal that displays article details when clicked. Shows title, source, date, sentiment badge, summary, keywords, and a link button. Includes close X button.

```jsx
import React, { useState } from 'react';

const ArticleModal = ({ article, isOpen, onClose }) => {
  if (!isOpen || !article) return null;

  const sentimentColor = article.sentiment === 'positive' ? COLORS.positive
    : article.sentiment === 'negative' ? COLORS.negative
    : COLORS.caution;

  const sentimentBgColor = article.sentiment === 'positive' ? COLORS.positiveBg
    : article.sentiment === 'negative' ? COLORS.negativeBg
    : COLORS.cautionBg;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
    }}>
      <div style={{
        backgroundColor: COLORS.cardBg,
        borderRadius: 8,
        padding: '28px',
        maxWidth: 600,
        width: '100%',
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
        position: 'relative',
      }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: 24,
            color: COLORS.textMuted,
            cursor: 'pointer',
            padding: '4px 8px',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => e.target.style.color = COLORS.textPrimary}
          onMouseLeave={(e) => e.target.style.color = COLORS.textMuted}>
          ✕
        </button>

        {/* Title */}
        <h2 style={{
          fontSize: 18,
          fontWeight: 700,
          color: COLORS.textPrimary,
          margin: '0 0 12px 0',
          paddingRight: 32,
          lineHeight: 1.4,
        }}>
          {article.title}
        </h2>

        {/* Source and date */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 12,
          fontSize: 12,
          color: COLORS.textMuted,
        }}>
          <span>{article.source}</span>
          <span>•</span>
          <span>{article.date}</span>
        </div>

        {/* Sentiment badge */}
        <div style={{
          display: 'inline-block',
          backgroundColor: sentimentBgColor,
          color: sentimentColor,
          padding: '4px 12px',
          borderRadius: 16,
          fontSize: 12,
          fontWeight: 600,
          marginBottom: 16,
          textTransform: 'capitalize',
        }}>
          {article.sentiment}
        </div>

        {/* Summary */}
        <p style={{
          fontSize: 14,
          color: COLORS.textBody,
          lineHeight: 1.6,
          margin: '0 0 16px 0',
        }}>
          {article.summary}
        </p>

        {/* Keywords */}
        {article.keywords && article.keywords.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{
              fontSize: 12,
              fontWeight: 600,
              color: COLORS.textMuted,
              marginBottom: 8,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Keywords
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {article.keywords.map((kw, i) => (
                <span key={i} style={{
                  backgroundColor: COLORS.neutralBg,
                  color: COLORS.textBody,
                  padding: '4px 10px',
                  borderRadius: 12,
                  fontSize: 11,
                  fontWeight: 500,
                }}>
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Full article link button */}
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            backgroundColor: COLORS.accent,
            color: '#FFFFFF',
            padding: '10px 16px',
            borderRadius: 4,
            fontSize: 13,
            fontWeight: 600,
            textDecoration: 'none',
            marginTop: 12,
            transition: 'background-color 0.2s ease',
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = COLORS.accentLight}
          onMouseLeave={(e) => e.target.style.backgroundColor = COLORS.accent}>
          Read Full Article →
        </a>
      </div>
    </div>
  );
};
```

---

## PaginatedTable

Wraps DataTable with pagination controls. Shows Previous/Next buttons, page indicator, and configurable rows per page (default 5 for news).

```jsx
import React, { useState } from 'react';

const PaginatedTable = ({ columns, rows, rowsPerPage = 5 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(rows.length / rowsPerPage);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRows = rows.slice(startIndex, endIndex);

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div>
      {/* Data table */}
      <DataTable columns={columns} rows={currentRows} />

      {/* Pagination controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 16,
        padding: '12px 0',
        fontSize: 13,
      }}>
        <div style={{ color: COLORS.textMuted }}>
          Page {currentPage} of {totalPages}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            style={{
              padding: '8px 12px',
              fontSize: 12,
              fontWeight: 600,
              color: currentPage === 1 ? COLORS.textLight : COLORS.accent,
              backgroundColor: currentPage === 1 ? COLORS.neutralBg : COLORS.accentBg,
              border: `1px solid ${currentPage === 1 ? COLORS.border : COLORS.accent}`,
              borderRadius: 4,
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
            }}>
            ← Previous
          </button>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            style={{
              padding: '8px 12px',
              fontSize: 12,
              fontWeight: 600,
              color: currentPage === totalPages ? COLORS.textLight : COLORS.accent,
              backgroundColor: currentPage === totalPages ? COLORS.neutralBg : COLORS.accentBg,
              border: `1px solid ${currentPage === totalPages ? COLORS.border : COLORS.accent}`,
              borderRadius: 4,
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
            }}>
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};
```

---

## KeywordCloud

Displays extracted keywords as interactive colored pill badges. Each shows word, frequency count, and sentiment-based color. Flex-wrap layout with hover effects.

```jsx
const KeywordCloud = ({ keywords }) => {
  // keywords: [{ word: 'revenue', frequency: 5, sentiment: 'positive' }, ...]
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
    }}>
      {keywords.map((kw, i) => {
        const bgColor = kw.sentiment === 'positive' ? COLORS.positiveBg
          : kw.sentiment === 'negative' ? COLORS.negativeBg
          : COLORS.neutralBg;

        const textColor = kw.sentiment === 'positive' ? COLORS.positive
          : kw.sentiment === 'negative' ? COLORS.negative
          : COLORS.neutral;

        return (
          <div
            key={i}
            style={{
              backgroundColor: bgColor,
              color: textColor,
              padding: '6px 12px',
              borderRadius: 16,
              fontSize: 12,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              border: `1px solid ${textColor}33`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = `0 2px 6px ${textColor}33`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
            <span>{kw.word}</span>
            <span style={{ opacity: 0.7, fontSize: 11 }}>({kw.frequency})</span>
          </div>
        );
      })}
    </div>
  );
};
```

---

## SentimentBreakdownBar

Enhanced gauge showing sentiment sub-dimensions: Fundamental sentiment, Market sentiment, Urgency level, and Confidence score. Each rendered as a labeled horizontal bar.

```jsx
const SentimentBreakdownBar = ({ fundamentalScore, marketScore, urgencyScore, confidenceScore }) => {
  const dimensions = [
    { label: 'Fundamental Sentiment', value: fundamentalScore, color: COLORS.accent },
    { label: 'Market Sentiment', value: marketScore, color: COLORS.positive },
    { label: 'Urgency Level', value: urgencyScore, color: COLORS.caution },
    { label: 'Confidence Score', value: confidenceScore, color: COLORS.neutral },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {dimensions.map((dim, i) => (
        <div key={i}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 6,
            fontSize: 12,
            fontWeight: 600,
          }}>
            <span style={{ color: COLORS.textBody }}>{dim.label}</span>
            <span style={{ color: dim.color, fontWeight: 700 }}>{Math.round(dim.value)}%</span>
          </div>
          <div style={{
            width: '100%',
            height: 8,
            backgroundColor: COLORS.borderLight,
            borderRadius: 4,
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${dim.value}%`,
              height: '100%',
              backgroundColor: dim.color,
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>
      ))}
    </div>
  );
};
```

---

## ClickableMetricCard

Metric card that expands on click to show additional detail text. Uses useState for expanded state. Includes subtle shadow on hover.

```jsx
import React, { useState } from 'react';

const ClickableMetricCard = ({ label, value, detailText, color }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      style={{
        backgroundColor: COLORS.cardBg,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 6,
        padding: '16px 20px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: expanded ? '0 4px 12px rgba(0, 0, 0, 0.08)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
        e.currentTarget.style.backgroundColor = COLORS.cardBgHover;
      }}
      onMouseLeave={(e) => {
        if (!expanded) {
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
          e.currentTarget.style.backgroundColor = COLORS.cardBg;
        }
      }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
      }}>
        <span style={{
          fontSize: 11,
          fontWeight: 500,
          color: COLORS.textMuted,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          {label}
        </span>
        <span style={{
          fontSize: 16,
          color: COLORS.textMuted,
          transition: 'transform 0.2s ease',
          transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
        }}>
          ▼
        </span>
      </div>

      <div style={{
        fontSize: 18,
        fontWeight: 700,
        color: color || COLORS.textPrimary,
        fontFamily: "'SF Mono', 'Fira Code', Consolas, monospace",
        marginBottom: expanded ? 12 : 0,
      }}>
        {value}
      </div>

      {expanded && (
        <div style={{
          fontSize: 12,
          color: COLORS.textBody,
          lineHeight: 1.5,
          paddingTop: 12,
          borderTop: `1px solid ${COLORS.border}`,
          animation: 'fadeIn 0.15s ease',
        }}>
          {detailText}
        </div>
      )}
    </div>
  );
};
```

---

## CollapsibleSection

Container with collapsible/expandable content. Includes animated chevron and light theme styling.

```jsx
import React, { useState } from 'react';

const CollapsibleSection = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div style={{
      backgroundColor: COLORS.cardBg,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 6,
      overflow: 'hidden',
      marginBottom: 16,
    }}>
      {/* Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          backgroundColor: COLORS.cardBg,
          transition: 'background-color 0.2s ease',
          userSelect: 'none',
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.cardBgHover}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.cardBg}>
        <h3 style={{
          fontSize: 14,
          fontWeight: 600,
          color: COLORS.textPrimary,
          margin: 0,
        }}>
          {title}
        </h3>
        <span style={{
          fontSize: 16,
          color: COLORS.textMuted,
          transition: 'transform 0.2s ease',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        }}>
          ▼
        </span>
      </div>

      {/* Content */}
      {isOpen && (
        <div style={{
          padding: '16px 20px',
          borderTop: `1px solid ${COLORS.border}`,
          backgroundColor: COLORS.pageBg,
          animation: 'slideDown 0.2s ease',
        }}>
          {children}
        </div>
      )}
    </div>
  );
};

/* Add this CSS animation to your stylesheet: */
/* @keyframes slideDown { from { opacity: 0; max-height: 0; } to { opacity: 1; max-height: 500px; } } */
```

---

## PriceTargetRangeBar

Horizontal bar showing analyst low/avg/high price targets with current price marker.
**CRITICAL:** The average target and current price markers on the bar MUST be clearly
distinguishable. The avg target is a **blue vertical bar** with a blue "Avg Target" label
directly above it. The current price is a **dark triangle ▼** with a dark "Current" label
directly above it. Both labels sit ABOVE the bar so users can visually see which marker
is which without looking at the bottom legend.

```jsx
const PriceTargetRangeBar = ({ low, lowFirm, avg, high, highFirm, current }) => {
  const min = Math.min(low, current) * 0.95;
  const max = high * 1.05;
  const range = max - min || 1;
  const pct = (v) => Math.max(0, Math.min(100, ((v - min) / range) * 100));

  return (
    <div style={{ padding: '16px 0' }}>
      {/* Marker area — labels above the bar */}
      <div style={{ position: 'relative', height: 70, marginBottom: 8 }}>

        {/* Avg Target label — above its marker */}
        <div style={{
          position: 'absolute', left: `${pct(avg)}%`, top: 0,
          transform: 'translateX(-50%)', textAlign: 'center', whiteSpace: 'nowrap',
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.accent }}>Avg Target</div>
          <div style={{ fontSize: 12, fontWeight: 700, fontFamily: MONO, color: COLORS.accent }}>
            {fmt.price(avg)}
          </div>
        </div>

        {/* Current Price label — above its marker */}
        <div style={{
          position: 'absolute', left: `${pct(current)}%`, top: 0,
          transform: 'translateX(-50%)', textAlign: 'center', whiteSpace: 'nowrap',
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.textPrimary }}>Current</div>
          <div style={{ fontSize: 12, fontWeight: 700, fontFamily: MONO, color: COLORS.textPrimary }}>
            {fmt.price(current)}
          </div>
        </div>

        {/* Track background */}
        <div style={{
          position: 'absolute', top: 42, left: 0, right: 0, height: 10,
          backgroundColor: '#F1F5F9', borderRadius: 5,
        }} />

        {/* Range fill (low to high) — blue tinted */}
        <div style={{
          position: 'absolute', top: 42, height: 10, borderRadius: 5,
          left: `${pct(low)}%`, width: `${pct(high) - pct(low)}%`,
          backgroundColor: '#DBEAFE',
          border: '1px solid #93C5FD',
        }} />

        {/* Low marker — thin red line */}
        <div style={{
          position: 'absolute', top: 38, left: `${pct(low)}%`,
          width: 2, height: 18, backgroundColor: COLORS.negative,
        }} />

        {/* Avg Target marker — thick blue line */}
        <div style={{
          position: 'absolute', top: 36, left: `${pct(avg)}%`,
          width: 4, height: 22, backgroundColor: COLORS.accent,
          borderRadius: 2, transform: 'translateX(-2px)',
        }} />

        {/* High marker — thin green line */}
        <div style={{
          position: 'absolute', top: 38, left: `${pct(high)}%`,
          width: 2, height: 18, backgroundColor: COLORS.positive,
        }} />

        {/* Current price marker — dark triangle pointing down */}
        <div style={{
          position: 'absolute', top: 32, left: `${pct(current)}%`,
          transform: 'translateX(-6px)',
          width: 0, height: 0,
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderTop: `8px solid ${COLORS.textPrimary}`,
        }} />
      </div>

      {/* Bottom legend — Low and High extremes with firm names */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
        <div>
          <div style={{ fontWeight: 700, fontFamily: MONO, color: COLORS.negative }}>
            {fmt.price(low)} Low
          </div>
          <div style={{ color: COLORS.textMuted, fontSize: 10 }}>{lowFirm}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 700, fontFamily: MONO, color: COLORS.positive }}>
            {fmt.price(high)} High
          </div>
          <div style={{ color: COLORS.textMuted, fontSize: 10 }}>{highFirm}</div>
        </div>
      </div>
    </div>
  );
};
```

---

## ConsensusCard

Summary card showing Buy/Hold/Sell rating badge, analyst count, avg target, implied upside.

```jsx
const ConsensusCard = ({ rating, analystCount, buyCount, holdCount, sellCount, avgTarget, impliedUpside }) => {
  const ratingColor = rating === 'Buy' || rating === 'Strong Buy' ? COLORS.positive
    : rating === 'Sell' || rating === 'Strong Sell' ? COLORS.negative
    : COLORS.caution;
  const ratingBg = rating === 'Buy' || rating === 'Strong Buy' ? COLORS.positiveBg
    : rating === 'Sell' || rating === 'Strong Sell' ? COLORS.negativeBg
    : COLORS.cautionBg;
  const total = buyCount + holdCount + sellCount;

  return (
    <div style={{
      backgroundColor: COLORS.cardBg, border: `1px solid ${COLORS.border}`,
      borderRadius: 6, padding: '24px', marginBottom: 16,
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <span style={{
          backgroundColor: ratingBg, color: ratingColor, padding: '6px 16px',
          borderRadius: 20, fontSize: 16, fontWeight: 700,
          border: `1px solid ${ratingColor}33`,
        }}>{rating}</span>
        <span style={{ fontSize: 13, color: COLORS.textMuted }}>
          {analystCount} analysts
        </span>
      </div>
      {/* Buy / Hold / Sell bar */}
      <div style={{ display: 'flex', height: 10, borderRadius: 5, overflow: 'hidden', marginBottom: 8 }}>
        <div style={{ width: `${(buyCount/total)*100}%`, backgroundColor: COLORS.positive }} />
        <div style={{ width: `${(holdCount/total)*100}%`, backgroundColor: COLORS.caution }} />
        <div style={{ width: `${(sellCount/total)*100}%`, backgroundColor: COLORS.negative }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: COLORS.textMuted, marginBottom: 16 }}>
        <span>Buy {buyCount}</span><span>Hold {holdCount}</span><span>Sell {sellCount}</span>
      </div>
      <div style={{ display: 'flex', gap: 32 }}>
        <div>
          <div style={{ fontSize: 11, color: COLORS.textMuted, textTransform: 'uppercase', marginBottom: 4 }}>Avg Target</div>
          <div style={{ fontSize: 20, fontWeight: 700, fontFamily: MONO, color: COLORS.textPrimary }}>{fmt.price(avgTarget)}</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: COLORS.textMuted, textTransform: 'uppercase', marginBottom: 4 }}>Implied Upside</div>
          <div style={{
            fontSize: 20, fontWeight: 700, fontFamily: MONO,
            color: impliedUpside >= 0 ? COLORS.positive : COLORS.negative,
          }}>{fmt.pct(impliedUpside)}</div>
        </div>
      </div>
    </div>
  );
};
```

---

## AnalystActionsTable

Paginated table of recent analyst actions. Rows are clickable — clicking expands an inline detail panel showing the analyst's thesis and a link to the source report.

```jsx
const AnalystActionsTable = ({ reports }) => {
  // reports: [{ date, firm, analyst, action, priceTarget, thesis, url }, ...]
  const [page, setPage] = useState(1);
  const [expandedIdx, setExpandedIdx] = useState(null);
  const perPage = 5;
  const totalPages = Math.ceil(reports.length / perPage);
  const slice = reports.slice((page - 1) * perPage, page * perPage);
  const globalOffset = (page - 1) * perPage;

  return (
    <div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: COLORS.neutralBg }}>
            {['Date', 'Firm', 'Analyst', 'Action', 'Target'].map((h, i) => (
              <th key={i} style={{
                padding: '10px 12px', fontSize: 11, fontWeight: 500,
                color: COLORS.textMuted, textTransform: 'uppercase',
                textAlign: 'left', borderBottom: `1px solid ${COLORS.border}`,
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {slice.map((r, i) => {
            const globalIdx = globalOffset + i;
            const isExpanded = expandedIdx === globalIdx;
            const actionColor = r.action.toLowerCase().includes('upgrade') || r.action.toLowerCase().includes('outperform') || r.action.toLowerCase().includes('buy')
              ? COLORS.positive
              : r.action.toLowerCase().includes('downgrade') || r.action.toLowerCase().includes('sell') || r.action.toLowerCase().includes('reduce')
              ? COLORS.negative : COLORS.textBody;
            return (
              <React.Fragment key={globalIdx}>
                <tr
                  onClick={() => setExpandedIdx(isExpanded ? null : globalIdx)}
                  style={{
                    cursor: 'pointer',
                    backgroundColor: isExpanded ? COLORS.accentBg : (i % 2 === 1 ? COLORS.cardBgHover : COLORS.cardBg),
                    borderBottom: `1px solid ${COLORS.borderLight}`,
                    transition: 'background-color 0.15s',
                  }}
                >
                  <td style={{ padding: '10px 12px', fontSize: 13, color: COLORS.textMuted }}>{r.date}</td>
                  <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: COLORS.textPrimary }}>{r.firm}</td>
                  <td style={{ padding: '10px 12px', fontSize: 13, color: COLORS.textBody }}>{r.analyst}</td>
                  <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: actionColor }}>{r.action}</td>
                  <td style={{ padding: '10px 12px', fontSize: 13, fontFamily: MONO, fontWeight: 600, color: COLORS.textPrimary }}>
                    {r.priceTarget ? fmt.price(r.priceTarget) : '—'}
                  </td>
                </tr>
                {isExpanded && (
                  <tr>
                    <td colSpan={5} style={{
                      padding: '16px 20px', backgroundColor: COLORS.accentBg,
                      borderBottom: `1px solid ${COLORS.border}`,
                    }}>
                      <div style={{ fontSize: 13, color: COLORS.textBody, lineHeight: 1.6, marginBottom: 12 }}>
                        <strong>Thesis:</strong> {r.thesis || 'No thesis detail available.'}
                      </div>
                      {r.url && (
                        <a href={r.url} target="_blank" rel="noopener noreferrer" style={{
                          color: COLORS.accent, fontSize: 12, fontWeight: 600, textDecoration: 'none',
                        }}>
                          View Source Report →
                        </a>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, fontSize: 13 }}>
        <span style={{ color: COLORS.textMuted }}>Page {page} of {totalPages}</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button disabled={page===1} onClick={() => setPage(page-1)} style={{
            padding: '6px 12px', fontSize: 12, fontWeight: 600, borderRadius: 4, cursor: page===1?'not-allowed':'pointer',
            color: page===1 ? COLORS.textLight : COLORS.accent, border: `1px solid ${page===1?COLORS.border:COLORS.accent}`,
            backgroundColor: page===1 ? COLORS.neutralBg : COLORS.accentBg,
          }}>← Prev</button>
          <button disabled={page===totalPages} onClick={() => setPage(page+1)} style={{
            padding: '6px 12px', fontSize: 12, fontWeight: 600, borderRadius: 4, cursor: page===totalPages?'not-allowed':'pointer',
            color: page===totalPages ? COLORS.textLight : COLORS.accent, border: `1px solid ${page===totalPages?COLORS.border:COLORS.accent}`,
            backgroundColor: page===totalPages ? COLORS.neutralBg : COLORS.accentBg,
          }}>Next →</button>
        </div>
      </div>
    </div>
  );
};
```

---

## ArticleBrowser

CRITICAL COMPONENT — Paginated article list with inline expand-on-click detail panel. Each article MUST have: title, source, date, sentiment, summary, keywords array, and url. Clicking a row expands a detail panel below it showing the summary, keywords as pills, and a clickable link to the full article.

```jsx
const ArticleBrowser = ({ articles }) => {
  // articles: [{ title, source, date, sentiment, summary, keywords: [{word, sentiment}], url, theme }, ...]
  const [page, setPage] = useState(1);
  const [expandedIdx, setExpandedIdx] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const perPage = 5;
  const totalPages = Math.ceil(articles.length / perPage);
  const displayed = showAll ? articles : articles.slice((page - 1) * perPage, page * perPage);
  const globalOffset = showAll ? 0 : (page - 1) * perPage;

  const sentColor = (s) => s === 'Positive' ? COLORS.positive : s === 'Negative' ? COLORS.negative : COLORS.caution;
  const sentBg = (s) => s === 'Positive' ? COLORS.positiveBg : s === 'Negative' ? COLORS.negativeBg : COLORS.cautionBg;

  return (
    <div>
      {displayed.map((a, i) => {
        const globalIdx = globalOffset + i;
        const isExpanded = expandedIdx === globalIdx;
        return (
          <div key={globalIdx} style={{
            border: `1px solid ${isExpanded ? COLORS.accent + '44' : COLORS.border}`,
            borderRadius: 6, marginBottom: 8, overflow: 'hidden',
            backgroundColor: COLORS.cardBg,
            transition: 'border-color 0.2s',
          }}>
            {/* Clickable row */}
            <div
              onClick={() => setExpandedIdx(isExpanded ? null : globalIdx)}
              style={{
                padding: '12px 16px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 12,
                backgroundColor: isExpanded ? COLORS.accentBg + '44' : 'transparent',
                transition: 'background-color 0.15s',
              }}
            >
              <span style={{
                backgroundColor: sentBg(a.sentiment), color: sentColor(a.sentiment),
                padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 600,
                minWidth: 52, textAlign: 'center',
              }}>{a.sentiment}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: COLORS.textPrimary, flex: 1 }}>
                {a.title}
              </span>
              <span style={{ fontSize: 11, color: COLORS.textMuted, whiteSpace: 'nowrap' }}>
                {a.source} · {a.date}
              </span>
              <span style={{
                fontSize: 14, color: COLORS.textMuted,
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }}>▾</span>
            </div>
            {/* Expanded detail panel */}
            {isExpanded && (
              <div style={{
                padding: '16px 20px', borderTop: `1px solid ${COLORS.border}`,
                backgroundColor: COLORS.pageBg,
              }}>
                {/* Summary — MUST be present */}
                <p style={{ fontSize: 13, color: COLORS.textBody, lineHeight: 1.6, margin: '0 0 12px 0' }}>
                  {a.summary || 'No summary available for this article.'}
                </p>
                {/* Keywords as pills */}
                {a.keywords && a.keywords.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                    {a.keywords.map((kw, ki) => {
                      const kwSent = typeof kw === 'string' ? 'neutral' : (kw.sentiment || 'neutral');
                      const kwText = typeof kw === 'string' ? kw : kw.word;
                      return (
                        <span key={ki} style={{
                          backgroundColor: kwSent === 'positive' ? COLORS.positiveBg : kwSent === 'negative' ? COLORS.negativeBg : COLORS.neutralBg,
                          color: kwSent === 'positive' ? COLORS.positive : kwSent === 'negative' ? COLORS.negative : COLORS.neutral,
                          padding: '3px 8px', borderRadius: 10, fontSize: 11, fontWeight: 500,
                        }}>{kwText}</span>
                      );
                    })}
                  </div>
                )}
                {/* Link to full article — MUST be present */}
                {a.url ? (
                  <a href={a.url} target="_blank" rel="noopener noreferrer" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    color: COLORS.accent, fontSize: 13, fontWeight: 600, textDecoration: 'none',
                  }}>
                    Read Full Article →
                  </a>
                ) : (
                  <span style={{ fontSize: 12, color: COLORS.textMuted, fontStyle: 'italic' }}>
                    Source link unavailable — cite by name
                  </span>
                )}
              </div>
            )}
          </div>
        );
      })}
      {/* Pagination / Show All */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
        <button onClick={() => { setShowAll(!showAll); setPage(1); setExpandedIdx(null); }} style={{
          background: 'none', border: 'none', color: COLORS.accent, fontSize: 12,
          fontWeight: 600, cursor: 'pointer', padding: 0,
        }}>
          {showAll ? 'Show Paginated' : `Show All ${articles.length} Articles`}
        </button>
        {!showAll && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
            <span style={{ color: COLORS.textMuted }}>Page {page} of {totalPages}</span>
            <button disabled={page===1} onClick={() => { setPage(page-1); setExpandedIdx(null); }} style={{
              padding: '6px 12px', fontSize: 12, fontWeight: 600, borderRadius: 4,
              cursor: page===1 ? 'not-allowed' : 'pointer',
              color: page===1 ? COLORS.textLight : COLORS.accent,
              border: `1px solid ${page===1 ? COLORS.border : COLORS.accent}`,
              backgroundColor: page===1 ? COLORS.neutralBg : COLORS.accentBg,
            }}>← Prev</button>
            <button disabled={page===totalPages} onClick={() => { setPage(page+1); setExpandedIdx(null); }} style={{
              padding: '6px 12px', fontSize: 12, fontWeight: 600, borderRadius: 4,
              cursor: page===totalPages ? 'not-allowed' : 'pointer',
              color: page===totalPages ? COLORS.textLight : COLORS.accent,
              border: `1px solid ${page===totalPages ? COLORS.border : COLORS.accent}`,
              backgroundColor: page===totalPages ? COLORS.neutralBg : COLORS.accentBg,
            }}>Next →</button>
          </div>
        )}
      </div>
    </div>
  );
};
```

---

---

## MonthlyCandlestickChart (MACD Strategy Page — Price Panel)

Monthly OHLC candlestick chart with 10-month MA overlay. Uses Recharts `ComposedChart`
with a `Customized` layer for candle rendering, since Recharts has no native candlestick.

**CRITICAL:** This component uses ~60 data points (monthly over 5 years). No downsampling needed.

The chart design is TradingView-inspired: off-white background, subtle gridlines, thin
strokes, muted candle colors, compact typography.

```jsx
import { useState, useMemo } from 'react';
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Customized } from 'recharts';

// Candle colors — muted, institutional
const CANDLE = { up: '#5B9E8F', down: '#C4645A', wick: 1, body: 0.6 };

// Custom candle renderer — accesses Recharts internal scales via Customized props
const CandleLayer = ({ xAxisMap, yAxisMap, data }) => {
  if (!xAxisMap || !yAxisMap) return null;
  const xAxis = Object.values(xAxisMap)[0];
  const yAxis = Object.values(yAxisMap)[0];
  if (!xAxis?.scale || !yAxis?.scale) return null;

  const bandwidth = xAxis.bandSize || 12;

  return (
    <g className="candle-layer">
      {data.map((d, i) => {
        const xPos = xAxis.scale(d.date);
        if (xPos == null || isNaN(xPos)) return null;
        const centerX = xPos + bandwidth / 2;
        const w = Math.max(3, bandwidth * CANDLE.body);
        const oY = yAxis.scale(d.open);
        const cY = yAxis.scale(d.close);
        const hY = yAxis.scale(d.high);
        const lY = yAxis.scale(d.low);
        const isUp = d.close >= d.open;
        const color = isUp ? CANDLE.up : CANDLE.down;

        return (
          <g key={i}>
            {/* Wick */}
            <line x1={centerX} y1={hY} x2={centerX} y2={lY}
              stroke={color} strokeWidth={CANDLE.wick} />
            {/* Body */}
            <rect
              x={centerX - w / 2}
              y={Math.min(oY, cY)}
              width={w}
              height={Math.max(1, Math.abs(oY - cY))}
              fill={color} stroke={color} strokeWidth={0.5}
              rx={1}
            />
          </g>
        );
      })}
    </g>
  );
};

// Main chart component
const MonthlyCandlestickChart = ({ data, height = 400 }) => {
  // data: [{ date, open, high, low, close, ma10 }]
  const [hovered, setHovered] = useState(null);

  // Compute Y domain with padding
  const [yMin, yMax] = useMemo(() => {
    const lows = data.map(d => d.low).filter(Boolean);
    const highs = data.map(d => d.high).filter(Boolean);
    const lo = Math.min(...lows);
    const hi = Math.max(...highs);
    const pad = (hi - lo) * 0.05;
    return [lo - pad, hi + pad];
  }, [data]);

  const current = hovered || data[data.length - 1];
  const isUp = current && current.close >= current.open;
  const change = current ? (current.close - current.open) : 0;
  const changePct = current && current.open ? (change / current.open * 100) : 0;

  return (
    <div style={{ background: COLORS.cardBg, borderRadius: 8, border: `1px solid ${COLORS.border}`,
      padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
      {/* Instrument header — TradingView style */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'baseline',
        fontSize: 12, fontFamily: 'monospace', color: COLORS.textMuted, marginBottom: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.textPrimary }}>Monthly</span>
        {current && (
          <>
            <span>O <b style={{ color: COLORS.textPrimary }}>{fmt.price(current.open)}</b></span>
            <span>H <b style={{ color: COLORS.textPrimary }}>{fmt.price(current.high)}</b></span>
            <span>L <b style={{ color: COLORS.textPrimary }}>{fmt.price(current.low)}</b></span>
            <span>C <b style={{ color: COLORS.textPrimary }}>{fmt.price(current.close)}</b></span>
            <span style={{ color: isUp ? CANDLE.up : CANDLE.down }}>
              {change >= 0 ? '+' : ''}{change.toFixed(2)} ({changePct >= 0 ? '+' : ''}{changePct.toFixed(2)}%)
            </span>
          </>
        )}
        {current?.ma10 != null && (
          <span>MA(10) <b style={{ color: '#6B9BD2' }}>{fmt.price(current.ma10)}</b></span>
        )}
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={data} margin={{ top: 10, right: 60, bottom: 5, left: 10 }}
          onMouseMove={(e) => { if (e?.activePayload?.[0]) setHovered(e.activePayload[0].payload); }}
          onMouseLeave={() => setHovered(null)}
        >
          <CartesianGrid stroke={COLORS.borderLight} strokeDasharray="3 3" strokeOpacity={0.5} />
          <XAxis dataKey="date" tick={{ fill: COLORS.textMuted, fontSize: 10 }}
            tickFormatter={(d) => d?.slice(0, 7)} axisLine={{ stroke: COLORS.border }}
            tickLine={false} interval="preserveStartEnd" />
          <YAxis domain={[yMin, yMax]} orientation="right"
            tick={{ fill: COLORS.textMuted, fontSize: 11 }}
            tickFormatter={fmt.price} axisLine={{ stroke: COLORS.border }}
            tickLine={false} width={65} />
          <Tooltip content={() => null} /> {/* Header shows OHLC instead */}

          {/* Invisible lines to anchor Y domain to high/low */}
          <Line dataKey="high" stroke="transparent" dot={false} isAnimationActive={false} />
          <Line dataKey="low" stroke="transparent" dot={false} isAnimationActive={false} />

          {/* 10-month MA overlay — thin soft blue, visually subordinate */}
          <Line dataKey="ma10" stroke="#6B9BD2" strokeWidth={1.5} dot={false}
            strokeDasharray="" isAnimationActive={false}
            connectNulls={false} />

          {/* Candles via Customized — access internal scales */}
          <Customized component={<CandleLayer data={data} />} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
```

---

## MACDHistogramPanel (MACD Strategy Page — Indicator Panel)

Monthly MACD histogram with MACD line and signal line **always visible**.
The histogram bars are the background, the two lines overlay them.
**CRITICAL:** The MACD line and signal line MUST render by default — they
are NOT hidden behind a toggle. Without the lines, the chart is useless.

```jsx
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Cell } from 'recharts';

const MACDHistogramPanel = ({ data, height = 140 }) => {
  // data: [{ date, macd, signal, histogram }]

  return (
    <div style={{ background: COLORS.cardBg, borderRadius: 8, border: `1px solid ${COLORS.border}`,
      padding: '12px 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.textPrimary }}>
          MACD (12, 26, 9) — Monthly
        </span>
        <span style={{ fontSize: 10, color: COLORS.accent }}>● MACD</span>
        <span style={{ fontSize: 10, color: '#D97706' }}>● Signal</span>
        <span style={{ fontSize: 10, color: '#5B9E8F' }}>■ Histogram</span>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={data} margin={{ top: 5, right: 60, bottom: 5, left: 10 }}>
          <CartesianGrid stroke={COLORS.borderLight} strokeDasharray="3 3" strokeOpacity={0.4} />
          <XAxis dataKey="date" tick={{ fill: COLORS.textMuted, fontSize: 10 }}
            tickFormatter={(d) => d?.slice(0, 7)} axisLine={{ stroke: COLORS.border }}
            tickLine={false} interval="preserveStartEnd" />
          <YAxis orientation="right" tick={{ fill: COLORS.textMuted, fontSize: 10 }}
            axisLine={{ stroke: COLORS.border }} tickLine={false} width={50} />
          <ReferenceLine y={0} stroke={COLORS.textMuted} strokeWidth={1} strokeOpacity={0.6} />
          <Tooltip
            formatter={(v, name) => [Number(v).toFixed(2), name]}
            contentStyle={{ backgroundColor: COLORS.cardBg, border: `1px solid ${COLORS.border}`,
              borderRadius: 4, fontSize: 11, boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}
            isAnimationActive={false}
          />

          {/* Histogram bars — background layer */}
          <Bar dataKey="histogram" isAnimationActive={false} maxBarSize={10}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.histogram >= 0 ? '#5B9E8F' : '#C4645A'}
                fillOpacity={0.6} />
            ))}
          </Bar>

          {/* MACD line — ALWAYS visible, solid blue */}
          <Line dataKey="macd" stroke={COLORS.accent} strokeWidth={1.5}
            dot={false} isAnimationActive={false} />

          {/* Signal line — ALWAYS visible, dashed orange */}
          <Line dataKey="signal" stroke="#D97706" strokeWidth={1.2}
            strokeDasharray="4 2" dot={false} isAnimationActive={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
```

---

## EventMarkerRow (MACD Strategy Page — Between Price and MACD Panels)

Row of clickable circular pills aligned to the monthly X axis, one per significant event.

```jsx
const EventMarkerRow = ({ events, onEventClick, activeEventIdx }) => {
  // events: [{ monthDate, title, sentimentTag, ... }]
  // monthDate aligns with the candlestick data's date field

  const sentBorder = (s) =>
    s === 'bullish' ? '#5B9E8F' : s === 'bearish' ? '#C4645A' : COLORS.textMuted;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 0, padding: '6px 16px',
      background: COLORS.pageBg, borderLeft: `1px solid ${COLORS.border}`,
      borderRight: `1px solid ${COLORS.border}`,
      position: 'relative', minHeight: 28,
    }}>
      <span style={{ fontSize: 10, color: COLORS.textMuted, marginRight: 8, whiteSpace: 'nowrap' }}>
        Events
      </span>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {events.map((ev, i) => (
          <button key={i} onClick={() => onEventClick(i)}
            title={ev.title}
            style={{
              width: 14, height: 14, borderRadius: '50%',
              backgroundColor: activeEventIdx === i ? COLORS.accent : COLORS.accent + 'CC',
              border: `2px solid ${sentBorder(ev.sentimentTag)}`,
              cursor: 'pointer', padding: 0,
              transform: activeEventIdx === i ? 'scale(1.3)' : 'scale(1)',
              transition: 'transform 0.15s, background-color 0.15s',
              boxShadow: activeEventIdx === i ? `0 0 6px ${COLORS.accent}44` : 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
};
```

---

## EventDetailPanel (MACD Strategy Page — Expands Below Event Row)

Inline detail panel shown when an event pill is clicked. Displays event title,
metadata, summary, price reaction, technical regime note, and cited source links.

```jsx
const EventDetailPanel = ({ event, onClose }) => {
  if (!event) return null;

  const sentColor = event.sentimentTag === 'bullish' ? COLORS.positive
    : event.sentimentTag === 'bearish' ? COLORS.negative : COLORS.caution;
  const sentBg = event.sentimentTag === 'bullish' ? COLORS.positiveBg
    : event.sentimentTag === 'bearish' ? COLORS.negativeBg : COLORS.cautionBg;
  const effectColor = event.regimeEffect === 'confirmed' ? COLORS.positive
    : event.regimeEffect === 'reversed' ? COLORS.negative : COLORS.caution;
  const effectBg = event.regimeEffect === 'confirmed' ? COLORS.positiveBg
    : event.regimeEffect === 'reversed' ? COLORS.negativeBg : COLORS.cautionBg;

  return (
    <div style={{
      background: COLORS.cardBg, border: `1px solid ${COLORS.border}`,
      borderRadius: 8, padding: 20, margin: '0 16px 12px 16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)', position: 'relative',
    }}>
      {/* Close button */}
      <button onClick={onClose} style={{
        position: 'absolute', top: 10, right: 12, background: 'none',
        border: 'none', fontSize: 16, color: COLORS.textMuted, cursor: 'pointer',
      }}>✕</button>

      {/* Header: date + category + sentiment + regime effect */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: 12, color: COLORS.textMuted }}>{event.date}</span>
        <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10,
          backgroundColor: COLORS.neutralBg, color: COLORS.textBody }}>
          {event.category}
        </span>
        <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10,
          backgroundColor: sentBg, color: sentColor }}>
          {event.sentimentTag}
        </span>
        <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10,
          backgroundColor: effectBg, color: effectColor }}>
          {event.regimeEffect}
        </span>
      </div>

      {/* Title */}
      <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.textPrimary, marginBottom: 10 }}>
        {event.title}
      </div>

      {/* Summary */}
      <p style={{ fontSize: 13, lineHeight: 1.6, color: COLORS.textBody, margin: '0 0 10px 0' }}>
        {event.summary}
      </p>

      {/* Price reaction */}
      <div style={{ fontSize: 12, color: COLORS.textBody, marginBottom: 10,
        padding: '8px 12px', backgroundColor: COLORS.pageBg, borderRadius: 6 }}>
        <span style={{ fontWeight: 600, color: COLORS.textPrimary }}>Price reaction: </span>
        {event.priceReaction}
      </div>

      {/* Technical regime note */}
      <div style={{ fontSize: 12, color: COLORS.textBody, marginBottom: 14,
        padding: '8px 12px', backgroundColor: COLORS.pageBg, borderRadius: 6 }}>
        <span style={{ fontWeight: 600, color: COLORS.textPrimary }}>Technical context: </span>
        {event.regimeNote}
      </div>

      {/* Sources with clickable links */}
      <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.textPrimary }}>Sources:</span>
        {event.sources.map((s, i) => (
          <div key={i} style={{ marginTop: 6, fontSize: 12 }}>
            <span style={{ color: COLORS.textBody }}>{s.publisher} — "{s.title}" — {s.date}</span>
            {s.url ? (
              <a href={s.url} target="_blank" rel="noopener noreferrer" style={{
                display: 'inline-block', marginLeft: 8, color: COLORS.accent,
                fontSize: 12, fontWeight: 600, textDecoration: 'none',
              }}>Read article →</a>
            ) : (
              <span style={{ marginLeft: 8, fontSize: 11, color: COLORS.textMuted, fontStyle: 'italic' }}>
                Link unavailable
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

## StrategyStatusCard (MACD Strategy Page — Analysis Block)

Displays the computed regime label, conviction score, trend/momentum sub-labels,
natural-language explanation, and risk note.

```jsx
const StrategyStatusCard = ({ regime }) => {
  // regime: { label, conviction, trendStatus, momentumStatus, explanation, riskNote }

  const labelColors = {
    'Strong Bull':   { bg: '#ECFDF5', text: '#059669' },
    'Bull':          { bg: '#ECFDF5', text: '#059669' },
    'Neutral / Bull Under Pressure': { bg: '#FFFBEB', text: '#D97706' },
    'Neutral / Recovery Watch':       { bg: '#FFFBEB', text: '#D97706' },
    'Bear':          { bg: '#FEF2F2', text: '#DC2626' },
    'Strong Bear':   { bg: '#FEF2F2', text: '#DC2626' },
  };

  const c = labelColors[regime.label] || { bg: COLORS.neutralBg, text: COLORS.textBody };

  return (
    <div style={{
      background: COLORS.cardBg, borderRadius: 8, border: `1px solid ${COLORS.border}`,
      padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.textMuted,
        textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
        Strategy Status
      </div>

      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Regime badge */}
        <div style={{
          backgroundColor: c.bg, color: c.text, borderRadius: 8,
          padding: '14px 20px', fontWeight: 700, fontSize: 18,
          textAlign: 'center', minWidth: 120, lineHeight: 1.3,
        }}>
          {regime.label}
        </div>

        {/* Sub-labels and conviction */}
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: 'flex', gap: 16, marginBottom: 8, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: 600 }}>TREND</div>
              <div style={{ fontSize: 13, color: COLORS.textPrimary, fontWeight: 500 }}>
                {regime.trendStatus}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: 600 }}>MOMENTUM</div>
              <div style={{ fontSize: 13, color: COLORS.textPrimary, fontWeight: 500 }}>
                {regime.momentumStatus}
              </div>
            </div>
          </div>

          {/* Conviction bar */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: 600 }}>CONVICTION</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: c.text }}>
                {regime.conviction}%
              </span>
            </div>
            <div style={{ height: 6, borderRadius: 3, backgroundColor: COLORS.neutralBg }}>
              <div style={{
                height: '100%', borderRadius: 3, backgroundColor: c.text,
                width: `${regime.conviction}%`, transition: 'width 0.3s',
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Natural language explanation */}
      <p style={{
        fontSize: 13, lineHeight: 1.7, color: COLORS.textBody,
        margin: '12px 0 0 0', padding: '12px 14px',
        backgroundColor: COLORS.pageBg, borderRadius: 6,
        borderLeft: `3px solid ${c.text}`,
      }}>
        {regime.explanation}
      </p>

      {/* Risk note */}
      <div style={{
        marginTop: 10, fontSize: 12, color: COLORS.textMuted,
        fontStyle: 'italic', padding: '0 14px',
      }}>
        {regime.riskNote}
      </div>
    </div>
  );
};
```

---

## TradingViewToolbar (MACD Strategy Page — Optional Compact Toolbar)

Compact top toolbar that gives the chart section a professional charting-terminal
appearance. Primarily visual — functional elements are optional.

```jsx
const ChartToolbar = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '4px 12px', borderBottom: `1px solid ${COLORS.border}`,
    backgroundColor: COLORS.cardBg, fontSize: 11, color: COLORS.textMuted,
  }}>
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <span style={{ fontWeight: 600, color: COLORS.textPrimary }}>1M</span>
      <span style={{ color: COLORS.border }}>|</span>
      <span>MA(10)</span>
      <span style={{ color: COLORS.border }}>|</span>
      <span>MACD(12,26,9)</span>
    </div>
    <div style={{ display: 'flex', gap: 8 }}>
      <span title="Log scale" style={{ cursor: 'default' }}>log</span>
      <span title="Auto scale" style={{ cursor: 'default' }}>auto</span>
    </div>
  </div>
);
```

---

---

## CompanyPrimer (Overview Page — Context Section)

Plain-English company description with optional industry primer for technical
or specialized businesses. Rendered as the first element of the context section.

```jsx
const CompanyPrimer = ({ primer, description, founded, hq, marketPosition }) => (
  <div style={{ marginBottom: 16 }}>
    {primer && (
      <div style={{
        padding: '12px 16px', backgroundColor: '#EFF6FF', borderRadius: 6,
        borderLeft: `3px solid ${COLORS.accent}`, marginBottom: 12,
        fontSize: 13, lineHeight: 1.7, color: COLORS.textBody,
      }}>
        <span style={{ fontWeight: 700, fontSize: 11, color: COLORS.accent,
          textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', marginBottom: 4 }}>
          Industry Primer
        </span>
        {primer}
      </div>
    )}
    <p style={{ fontSize: 13, lineHeight: 1.7, color: COLORS.textBody, margin: '0 0 8px 0' }}>
      {description}
    </p>
    <div style={{ fontSize: 12, color: COLORS.textMuted, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      {founded && <span>Founded {founded}</span>}
      {hq && <span>HQ: {hq}</span>}
      {marketPosition && <span>{marketPosition}</span>}
    </div>
  </div>
);
```

---

## RevenueDonutChart (Overview Page — Revenue Streams)

Donut chart showing revenue mix with toggle-based drill-down for stream details.
Maximum 6 slices — group anything <5% into "Other".

**CRITICAL:** Use Recharts `PieChart` with `innerRadius` and `outerRadius`.
Center of donut shows total revenue. Clicking a slice or a toggle pill below
selects that stream and shows its detail panel.

```jsx
import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const DONUT_COLORS = ['#2563EB', '#6B9BD2', '#5B9E8F', '#D97706', '#8B5CF6', '#A0AEC0'];

const RevenueDonutChart = ({ streams, totalRevenue }) => {
  // streams: [{ name, revenuePct, revenueAmt, description, whyItMatters, primer, status, marginNote, riskNote, growthRate }]
  const [selected, setSelected] = useState(0);

  const statusBadge = (s) => {
    const map = { growing: { bg: COLORS.positiveBg, text: COLORS.positive, label: 'Growing' },
      shrinking: { bg: COLORS.negativeBg, text: COLORS.negative, label: 'Shrinking' },
      stable: { bg: COLORS.neutralBg, text: COLORS.textBody, label: 'Stable' },
      cyclical: { bg: COLORS.cautionBg, text: COLORS.caution, label: 'Cyclical' } };
    const m = map[s] || map.stable;
    return (<span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10,
      backgroundColor: m.bg, color: m.text }}>{m.label}</span>);
  };

  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.textMuted,
        textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
        Revenue Streams
      </div>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Donut chart */}
        <div style={{ width: 200, height: 200, position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={streams} dataKey="revenuePct" cx="50%" cy="50%"
                innerRadius={55} outerRadius={85} paddingAngle={2}
                isAnimationActive={false}
                onClick={(_, idx) => setSelected(idx)}>
                {streams.map((_, i) => (
                  <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]}
                    stroke={COLORS.cardBg} strokeWidth={2}
                    opacity={selected === i ? 1 : 0.7}
                    style={{ cursor: 'pointer' }} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`}
                contentStyle={{ backgroundColor: COLORS.cardBg, border: `1px solid ${COLORS.border}`,
                  borderRadius: 4, fontSize: 11 }}
                isAnimationActive={false} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div style={{ position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.textPrimary }}>
              {totalRevenue}
            </div>
            <div style={{ fontSize: 10, color: COLORS.textMuted }}>Total Revenue</div>
          </div>
        </div>

        {/* Right side: toggle pills + detail panel */}
        <div style={{ flex: 1, minWidth: 260 }}>
          {/* Toggle pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {streams.map((s, i) => (
              <button key={i} onClick={() => setSelected(i)} style={{
                padding: '4px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600,
                cursor: 'pointer', border: `1.5px solid ${DONUT_COLORS[i % DONUT_COLORS.length]}`,
                backgroundColor: selected === i ? DONUT_COLORS[i % DONUT_COLORS.length] : 'transparent',
                color: selected === i ? '#fff' : DONUT_COLORS[i % DONUT_COLORS.length],
                transition: 'all 0.15s',
              }}>
                {s.name} ({s.revenuePct}%)
              </button>
            ))}
          </div>

          {/* Selected stream detail */}
          {streams[selected] && (() => {
            const s = streams[selected];
            return (
              <div style={{ padding: 14, backgroundColor: COLORS.pageBg, borderRadius: 8,
                border: `1px solid ${COLORS.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.textPrimary }}>
                    {s.name}
                  </span>
                  {s.revenueAmt && <span style={{ fontSize: 12, color: COLORS.textMuted }}>{s.revenueAmt}</span>}
                  {statusBadge(s.status)}
                  {s.growthRate && <span style={{ fontSize: 11, fontWeight: 600,
                    color: s.growthRate.startsWith('+') ? COLORS.positive : COLORS.negative }}>
                    {s.growthRate}
                  </span>}
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: COLORS.textBody, margin: '0 0 6px 0' }}>
                  {s.description}
                </p>
                {s.whyItMatters && (
                  <p style={{ fontSize: 12, color: COLORS.textBody, margin: '0 0 6px 0' }}>
                    <b>Why it matters:</b> {s.whyItMatters}
                  </p>
                )}
                {s.primer && (
                  <div style={{ fontSize: 12, lineHeight: 1.6, color: COLORS.textBody,
                    padding: '8px 12px', backgroundColor: '#EFF6FF', borderRadius: 4, margin: '6px 0',
                    borderLeft: `2px solid ${COLORS.accent}` }}>
                    {s.primer}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 6, fontSize: 11, color: COLORS.textMuted }}>
                  {s.marginNote && <span>{s.marginNote}</span>}
                  {s.riskNote && <span style={{ color: COLORS.caution }}>{s.riskNote}</span>}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};
```

---

## RegionalDonutChart (Overview Page — Regional Operations)

Geographic revenue/operations donut chart with region detail rows below.

```jsx
const REGION_COLORS = { 'North America': '#2563EB', 'China': '#DC2626', 'Europe': '#5B9E8F',
  'APAC ex-China': '#D97706', 'Rest of World': '#A0AEC0', 'Other': '#A0AEC0' };

const RegionalDonutChart = ({ regions, totalRevenue }) => {
  // regions: [{ region, revenuePct, significance, riskFactors, growthOutlook, isConcentrated }]

  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.textMuted,
        textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
        Regional Operations
      </div>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Donut */}
        <div style={{ width: 180, height: 180, position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={regions} dataKey="revenuePct" nameKey="region"
                cx="50%" cy="50%" innerRadius={50} outerRadius={75}
                paddingAngle={2} isAnimationActive={false}>
                {regions.map((r, i) => (
                  <Cell key={i} fill={REGION_COLORS[r.region] || '#A0AEC0'}
                    stroke={COLORS.cardBg} strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} isAnimationActive={false}
                contentStyle={{ backgroundColor: COLORS.cardBg, border: `1px solid ${COLORS.border}`,
                  borderRadius: 4, fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Region detail rows */}
        <div style={{ flex: 1, minWidth: 260 }}>
          {regions.map((r, i) => (
            <div key={i} style={{ padding: '8px 0', borderBottom: i < regions.length - 1 ? `1px solid ${COLORS.borderLight}` : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%',
                  backgroundColor: REGION_COLORS[r.region] || '#A0AEC0', flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.textPrimary }}>
                  {r.region}
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.textBody }}>
                  {r.revenuePct}%
                </span>
                {r.isConcentrated && (
                  <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 8,
                    backgroundColor: COLORS.cautionBg, color: COLORS.caution }}>CONCENTRATED</span>
                )}
              </div>
              <div style={{ fontSize: 12, color: COLORS.textBody, marginLeft: 18, lineHeight: 1.5 }}>
                {r.significance}
              </div>
              {r.riskFactors?.length > 0 && (
                <div style={{ marginLeft: 18, marginTop: 2, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {r.riskFactors.map((rf, j) => (
                    <span key={j} style={{ fontSize: 10, padding: '1px 6px', borderRadius: 8,
                      backgroundColor: COLORS.neutralBg, color: COLORS.textMuted }}>{rf}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
```

---

## ValueChainDiagram (Overview Page — Interactive Value Chain Positioning)

**Interactive** horizontal flowchart showing industry value chain stages. Each stage
box is **clickable** — on click, it expands an inline detail panel below the diagram
with a plain-English explanation of what happens at that stage and why it matters.
Uses **pure HTML/CSS** with flexbox — no SVG, no canvas, no Recharts.

**IMPORTANT:** This component MUST render as a visible horizontal row of clickable boxes
connected by arrow characters. If it doesn't render, the dashboard is broken.

Every stage box must have: `cursor: pointer`, a hover state (shadow lift + slight
background tint), and a small `ⓘ` info icon indicating it's interactive.

The explanations are written for finance professionals who may not be industry
specialists — technically accurate but accessible, explaining what happens at each
stage and why it matters economically.

```jsx
import { useState } from 'react';

const ValueChainDiagram = ({ chains }) => {
  // chains: [{ chainName, stages: [{ name, desc, companyHere, companyRole,
  //            explanation, keyPlayers }],
  //            upstreamNote, downstreamNote, adjacentCompetitors }]
  const [activeChain, setActiveChain] = useState(0);
  const [expandedStage, setExpandedStage] = useState(null);
  const [hoveredStage, setHoveredStage] = useState(null);

  if (!chains || chains.length === 0) return null;
  const chain = chains[activeChain];
  if (!chain || !chain.stages) return null;

  const handleStageClick = (idx) => {
    setExpandedStage(expandedStage === idx ? null : idx);
  };

  return (
    <div style={{ padding: '14px 16px', borderRadius: 8, border: '1px solid ' + COLORS.border,
      backgroundColor: COLORS.cardBg }}>
      {/* Header + chain toggle pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.textMuted,
          textTransform: 'uppercase', letterSpacing: 1 }}>
          Value Chain
        </span>
        {chains.length > 1 && chains.map((c, i) => (
          <button key={i} onClick={() => { setActiveChain(i); setExpandedStage(null); }} style={{
            padding: '3px 10px', borderRadius: 10, fontSize: 10, fontWeight: 600,
            cursor: 'pointer',
            border: '1.5px solid ' + (activeChain === i ? COLORS.accent : COLORS.border),
            backgroundColor: activeChain === i ? COLORS.accentBg : 'transparent',
            color: activeChain === i ? COLORS.accent : COLORS.textMuted,
          }}>
            {c.chainName}
          </button>
        ))}
      </div>
      <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 10 }}>
        Click any stage to learn what happens there and why it matters
      </div>

      {/* Horizontal chain — pure HTML/CSS flexbox, NO SVG */}
      <div style={{
        display: 'flex', alignItems: 'center', flexWrap: 'wrap',
        gap: 0, padding: '6px 0', overflowX: 'auto',
      }}>
        {chain.stages.map((s, i) => {
          const isHighlighted = !!s.companyHere;
          const isExpanded = expandedStage === i;
          const isHovered = hoveredStage === i;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              {/* Stage box — CLICKABLE */}
              <div
                onClick={() => handleStageClick(i)}
                onMouseEnter={() => setHoveredStage(i)}
                onMouseLeave={() => setHoveredStage(null)}
                style={{
                  padding: '10px 16px', borderRadius: 8, minWidth: 110,
                  maxWidth: 180, textAlign: 'center', cursor: 'pointer',
                  backgroundColor: isHighlighted
                    ? (isHovered ? '#DBEAFE' : '#EFF6FF')
                    : (isHovered ? '#F3F4F6' : '#F9FAFB'),
                  border: '2px solid ' + (
                    isExpanded ? '#1D4ED8'
                    : isHighlighted ? '#2563EB'
                    : isHovered ? '#D1D5DB'
                    : '#E5E7EB'
                  ),
                  boxShadow: isHovered || isExpanded
                    ? '0 2px 8px rgba(0,0,0,0.1)'
                    : isHighlighted ? '0 0 0 3px rgba(37,99,235,0.12)' : 'none',
                  transition: 'box-shadow 0.15s, background-color 0.15s, border-color 0.15s',
                  position: 'relative',
                }}>
                <div style={{
                  fontSize: 12, fontWeight: 600, lineHeight: 1.3,
                  color: isHighlighted ? '#2563EB' : '#1A1A2E',
                }}>
                  {s.name}
                </div>
                {s.desc && (
                  <div style={{ fontSize: 10, color: '#6B7280', marginTop: 3, lineHeight: 1.3 }}>
                    {s.desc}
                  </div>
                )}
                {isHighlighted && s.companyRole && (
                  <div style={{
                    fontSize: 9, fontWeight: 700, color: '#2563EB', marginTop: 5,
                    padding: '2px 8px', borderRadius: 8, display: 'inline-block',
                    backgroundColor: 'rgba(37,99,235,0.1)',
                  }}>
                    ★ {s.companyRole}
                  </div>
                )}
                {/* Info icon — subtle affordance */}
                <div style={{
                  position: 'absolute', top: 4, right: 6,
                  fontSize: 10, color: isHighlighted ? '#93C5FD' : '#D1D5DB',
                  lineHeight: 1,
                }}>
                  ⓘ
                </div>
              </div>
              {/* Arrow connector between stages */}
              {i < chain.stages.length - 1 && (
                <div style={{
                  padding: '0 6px', fontSize: 20, color: '#9CA3AF',
                  lineHeight: 1, flexShrink: 0, userSelect: 'none',
                }}>
                  →
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Expanded stage detail panel — appears below the chain */}
      {expandedStage !== null && chain.stages[expandedStage] && (() => {
        const s = chain.stages[expandedStage];
        const isCompanyStage = !!s.companyHere;
        return (
          <div style={{
            marginTop: 10, padding: '14px 16px', borderRadius: 8,
            backgroundColor: isCompanyStage ? '#F0F7FF' : '#F9FAFB',
            border: '1px solid ' + (isCompanyStage ? '#BFDBFE' : '#E5E7EB'),
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700,
                color: isCompanyStage ? '#2563EB' : '#1A1A2E' }}>
                {s.name}
              </span>
              {isCompanyStage && (
                <span style={{ fontSize: 9, fontWeight: 700, color: '#2563EB',
                  padding: '2px 8px', borderRadius: 8, backgroundColor: 'rgba(37,99,235,0.1)' }}>
                  ★ Company Position
                </span>
              )}
              <span style={{ flex: 1 }} />
              <button onClick={() => setExpandedStage(null)} style={{
                background: 'none', border: '1px solid #E5E7EB', borderRadius: 4,
                padding: '2px 8px', fontSize: 10, color: '#6B7280', cursor: 'pointer',
              }}>✕</button>
            </div>

            {/* Explanation — the main content */}
            {s.explanation && (
              <div style={{ fontSize: 13, lineHeight: 1.7, color: '#374151', marginBottom: 10 }}>
                {s.explanation}
              </div>
            )}

            {/* Company-specific role detail */}
            {isCompanyStage && s.companyRole && (
              <div style={{
                fontSize: 12, lineHeight: 1.6, color: '#2563EB',
                padding: '8px 12px', borderRadius: 6, marginBottom: 10,
                backgroundColor: 'rgba(37,99,235,0.06)',
                borderLeft: '3px solid #2563EB',
              }}>
                <span style={{ fontWeight: 600 }}>Company's role:</span> {s.companyRole}
              </div>
            )}

            {/* Key players */}
            {s.keyPlayers && s.keyPlayers.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: '#6B7280',
                  textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Key players:
                </span>
                {s.keyPlayers.map((p, pi) => (
                  <span key={pi} style={{
                    fontSize: 10, padding: '2px 8px', borderRadius: 8,
                    backgroundColor: '#F3F4F6', color: '#374151', fontWeight: 500,
                  }}>
                    {p}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* Upstream / downstream notes */}
      {(chain.upstreamNote || chain.downstreamNote) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginTop: 10,
          fontSize: 11, color: '#6B7280', flexWrap: 'wrap' }}>
          {chain.upstreamNote && <span>← Upstream: {chain.upstreamNote}</span>}
          <span style={{ flex: 1 }} />
          {chain.downstreamNote && <span>Downstream: {chain.downstreamNote} →</span>}
        </div>
      )}

      {/* Adjacent competitors */}
      {chain.adjacentCompetitors && chain.adjacentCompetitors.length > 0 && (
        <div style={{ marginTop: 8, fontSize: 11, color: '#6B7280' }}>
          <span style={{ fontWeight: 600 }}>Key competitors:</span>{' '}
          {chain.adjacentCompetitors.join(', ')}
        </div>
      )}
    </div>
  );
};
```

---

## ThreatsOpportunities (Overview Page — Two-Column Risk/Upside Layout)

Structured threats and opportunities with magnitude badges and status indicators.

```jsx
const ThreatsOpportunities = ({ threats, opportunities }) => {
  const magnitudeStyle = (m) => {
    const map = {
      'very high': { bg: '#FEF2F2', text: '#DC2626' },
      'high': { bg: '#FFFBEB', text: '#D97706' },
      'moderate': { bg: COLORS.neutralBg, text: COLORS.textBody },
      'low': { bg: COLORS.pageBg, text: COLORS.textMuted },
    };
    return map[m] || map.moderate;
  };

  const statusIcon = (s) =>
    s === 'tailwind' ? { symbol: '↗', color: COLORS.positive }
    : s === 'headwind' ? { symbol: '↘', color: COLORS.negative }
    : { symbol: '→', color: COLORS.textMuted };

  const renderItem = (item) => {
    const ms = magnitudeStyle(item.magnitude);
    const si = statusIcon(item.currentStatus);
    return (
      <div style={{ padding: '10px 0', borderBottom: `1px solid ${COLORS.borderLight}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.textPrimary, flex: 1 }}>
            {item.factor}
          </span>
          <span style={{ fontSize: 10, fontWeight: 600, padding: '1px 7px', borderRadius: 8,
            backgroundColor: ms.bg, color: ms.text }}>{item.magnitude}</span>
        </div>
        <div style={{ fontSize: 12, lineHeight: 1.5, color: COLORS.textBody, marginBottom: 4 }}>
          {item.description}
        </div>
        <div style={{ display: 'flex', gap: 8, fontSize: 10, color: COLORS.textMuted }}>
          <span>Affects: {item.affectsWhat}</span>
          <span style={{ color: si.color, fontWeight: 600 }}>{si.symbol} {item.currentStatus}</span>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.negative,
          textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
          Threats
        </div>
        {threats.map((t, i) => <div key={i}>{renderItem(t)}</div>)}
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.positive,
          textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
          Opportunities
        </div>
        {opportunities.map((o, i) => <div key={i}>{renderItem(o)}</div>)}
      </div>
    </div>
  );
};
```

---

## KeyDriverCards (Overview Page — Largest Movers)

Compact card grid showing the 4-6 most important variables that move the stock.

```jsx
const KeyDriverCards = ({ drivers }) => {
  // drivers: [{ driver, description, affects, magnitude, currentDirection, directionNote }]
  const dirStyle = (d) =>
    d === 'tailwind' ? { arrow: '↗', color: COLORS.positive, bg: COLORS.positiveBg }
    : d === 'headwind' ? { arrow: '↘', color: COLORS.negative, bg: COLORS.negativeBg }
    : { arrow: '→', color: COLORS.textMuted, bg: COLORS.neutralBg };

  const magColor = (m) =>
    m === 'very high' ? COLORS.negative : m === 'high' ? COLORS.caution : COLORS.textMuted;

  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.textMuted,
        textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
        Key Drivers
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
        {drivers.map((d, i) => {
          const ds = dirStyle(d.currentDirection);
          return (
            <div key={i} style={{
              padding: '12px 14px', borderRadius: 8, border: `1px solid ${COLORS.border}`,
              backgroundColor: COLORS.cardBg, boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 18, color: ds.color, lineHeight: 1 }}>{ds.arrow}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.textPrimary, flex: 1 }}>
                  {d.driver}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 8,
                  backgroundColor: COLORS.neutralBg, color: COLORS.textMuted }}>
                  {d.affects}
                </span>
                <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 8,
                  backgroundColor: COLORS.neutralBg, color: magColor(d.magnitude) }}>
                  {d.magnitude}
                </span>
                <span style={{ fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 8,
                  backgroundColor: ds.bg, color: ds.color }}>
                  {d.currentDirection}
                </span>
              </div>
              <div style={{ fontSize: 12, lineHeight: 1.5, color: COLORS.textBody }}>
                {d.directionNote || d.description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
```

---

## Fundamentals Shared Constants

**Define these ONCE at the top of the artifact**, alongside `COLORS` and `fmt`.
They are shared by `FundamentalMetricCard`, `FundamentalSectionHeader`, and
`FundamentalsSection`.

```jsx
const STATUS_STYLES = {
  very_good:      { border: '#047857', bg: '#ECFDF5', badge: '#047857', badgeBg: '#D1FAE5', label: 'Very Good' },
  good:           { border: '#059669', bg: '#F0FDF4', badge: '#059669', badgeBg: '#D1FAE5', label: 'Good' },
  reasonable:     { border: '#6B7280', bg: '#F9FAFB', badge: '#6B7280', badgeBg: '#F3F4F6', label: 'Reasonable' },
  slight_concern: { border: '#D97706', bg: '#FFFBEB', badge: '#D97706', badgeBg: '#FEF3C7', label: 'Slight Concern' },
  concern:        { border: '#DC2626', bg: '#FEF2F2', badge: '#DC2626', badgeBg: '#FEE2E2', label: 'Concern' },
  severe_concern: { border: '#991B1B', bg: '#FEF2F2', badge: '#991B1B', badgeBg: '#FEE2E2', label: 'Severe Concern' },
};

const MONO = "'SF Mono', 'Fira Code', 'Consolas', monospace";
```

---

## FundamentalMetricCard (Analysis Page — Interactive Metric Card)

A clickable metric card with semantic status color, hover state, and inline
drill-down expansion. Each card shows the metric at a glance when collapsed,
and expands to show full historical comparison analysis when clicked.

**CRITICAL:** This is NOT a static display card. It MUST have:
- `cursor: pointer` and a hover state (elevation + shadow lift)
- A colored left border (4px) indicating status
- A small `›` chevron or "View analysis" affordance
- Click expands an inline analysis panel below the card

```jsx
import { useState } from 'react';

// STATUS_STYLES is defined as a shared constant (see above) — do NOT redefine here
// MONO font is available via the fmt helper's parent scope

const FundamentalMetricCard = ({ metric }) => {
  // metric: { metric (name), current (formatted string), currentRaw (number),
  //           historicalStrongAvg, historicalRange: { low, high },
  //           status, explanation, likelyCause, sourceArticle: { title, url },
  //           direction }
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const s = STATUS_STYLES[metric.status] || STATUS_STYLES.reasonable;

  return (
    <div style={{ marginBottom: 6 }}>
      {/* Collapsed card */}
      <div
        onClick={() => setExpanded(!expanded)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px', borderRadius: 8, cursor: 'pointer',
          backgroundColor: hovered ? s.bg : COLORS.cardBg,
          border: `1px solid ${COLORS.border}`,
          borderLeft: `4px solid ${s.border}`,
          boxShadow: hovered
            ? '0 2px 8px rgba(0,0,0,0.1)'
            : '0 1px 2px rgba(0,0,0,0.04)',
          transition: 'box-shadow 0.15s, background-color 0.15s',
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: COLORS.textMuted,
            textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {metric.metric}
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, fontFamily: MONO,
            color: COLORS.textPrimary, marginTop: 2 }}>
            {metric.current}
          </div>
        </div>
        <div style={{ fontSize: 9, fontWeight: 600, color: s.badge, padding: '2px 8px',
          borderRadius: 8, backgroundColor: s.badgeBg, whiteSpace: 'nowrap' }}>
          {s.label}
        </div>
        <div style={{ fontSize: 14, color: COLORS.textMuted,
          transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
          transition: 'transform 0.15s' }}>
          ›
        </div>
      </div>

      {/* Expanded drill-down panel */}
      {expanded && (
        <div style={{
          margin: '0 0 0 4px', padding: '14px 16px',
          borderLeft: `3px solid ${s.border}`,
          borderBottom: `1px solid ${COLORS.border}`,
          borderRight: `1px solid ${COLORS.border}`,
          borderRadius: '0 0 8px 8px',
          backgroundColor: '#FAFBFC',
        }}>
          {/* Current vs Historical */}
          <div style={{ display: 'flex', gap: 24, marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 10, color: COLORS.textMuted, textTransform: 'uppercase',
                letterSpacing: 0.5 }}>Current</div>
              <div style={{ fontSize: 18, fontWeight: 700, fontFamily: MONO, color: COLORS.textPrimary }}>
                {metric.current}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: COLORS.textMuted, textTransform: 'uppercase',
                letterSpacing: 0.5 }}>Strong-Period Avg</div>
              <div style={{ fontSize: 18, fontWeight: 700, fontFamily: MONO, color: COLORS.textBody }}>
                {metric.historicalStrongAvg}
              </div>
              {metric.historicalRange && (
                <div style={{ fontSize: 10, color: COLORS.textMuted }}>
                  Range: {metric.historicalRange.low} – {metric.historicalRange.high}
                </div>
              )}
            </div>
            <div>
              <div style={{ fontSize: 10, color: COLORS.textMuted, textTransform: 'uppercase',
                letterSpacing: 0.5 }}>Status</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: s.badge, marginTop: 4,
                padding: '2px 10px', borderRadius: 10, backgroundColor: s.badgeBg,
                display: 'inline-block' }}>
                {s.label}
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div style={{ fontSize: 13, lineHeight: 1.6, color: COLORS.textBody, marginBottom: 8 }}>
            {metric.explanation}
          </div>

          {/* Likely Cause */}
          {metric.likelyCause && (
            <div style={{ fontSize: 12, lineHeight: 1.5, color: COLORS.textMuted,
              fontStyle: 'italic', marginBottom: 10 }}>
              Likely driver: {metric.likelyCause}
            </div>
          )}

          {/* Source article */}
          {metric.sourceArticle && (
            <a href={metric.sourceArticle.url} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 11, color: COLORS.accent, textDecoration: 'none',
                fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              📄 {metric.sourceArticle.title} →
            </a>
          )}

          {/* Close button */}
          <div style={{ marginTop: 10, textAlign: 'right' }}>
            <button onClick={(e) => { e.stopPropagation(); setExpanded(false); }}
              style={{ fontSize: 10, color: COLORS.textMuted, background: 'none',
                border: `1px solid ${COLORS.border}`, borderRadius: 4,
                padding: '2px 10px', cursor: 'pointer' }}>
              ✕ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
```

---

## FundamentalSectionHeader (Analysis Page — Clickable Section Header)

A clickable section header that expands to show a synthesized summary of all metrics
in the group. Shows section name, metric count, overall section status, and a chevron.

```jsx
import { useState } from 'react';

const FundamentalSectionHeader = ({ title, metrics, sectionSummary, sectionStatus }) => {
  // sectionSummary: 2-3 sentence synthesis string
  // sectionStatus: same status key as individual metrics (e.g., 'good', 'slight_concern')
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const s = STATUS_STYLES[sectionStatus] || STATUS_STYLES.reasonable;

  const statusCounts = {};
  metrics.forEach(m => {
    const st = m.status || 'reasonable';
    statusCounts[st] = (statusCounts[st] || 0) + 1;
  });

  return (
    <div style={{ marginBottom: 8 }}>
      <div
        onClick={() => setExpanded(!expanded)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px', borderRadius: 8, cursor: 'pointer',
          backgroundColor: hovered ? '#F1F5F9' : '#F8FAFC',
          border: `1px solid ${COLORS.border}`,
          transition: 'background-color 0.15s',
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.textPrimary, flex: 1 }}>
          {title}
        </div>
        <div style={{ fontSize: 10, color: COLORS.textMuted }}>
          {metrics.length} metrics
        </div>
        <div style={{ fontSize: 9, fontWeight: 600, color: s.badge, padding: '2px 8px',
          borderRadius: 8, backgroundColor: s.badgeBg }}>
          {s.label}
        </div>
        <div style={{ fontSize: 14, color: COLORS.textMuted,
          transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
          transition: 'transform 0.15s' }}>
          ›
        </div>
      </div>

      {expanded && (
        <div style={{
          padding: '12px 16px', margin: '0 0 4px 0',
          borderLeft: `3px solid ${s.border}`,
          borderBottom: `1px solid ${COLORS.border}`,
          borderRight: `1px solid ${COLORS.border}`,
          borderRadius: '0 0 8px 8px',
          backgroundColor: '#FAFBFC',
        }}>
          {/* Status distribution */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
            {Object.entries(statusCounts).map(([st, count]) => {
              const ss = STATUS_STYLES[st] || STATUS_STYLES.reasonable;
              return (
                <span key={st} style={{ fontSize: 10, fontWeight: 600, color: ss.badge,
                  padding: '2px 8px', borderRadius: 8, backgroundColor: ss.badgeBg }}>
                  {count}× {ss.label}
                </span>
              );
            })}
          </div>
          {/* Synthesis */}
          <div style={{ fontSize: 13, lineHeight: 1.6, color: COLORS.textBody }}>
            {sectionSummary}
          </div>
        </div>
      )}
    </div>
  );
};
```

---

## FundamentalsSection (Analysis Page — Complete Interactive Fundamentals)

Assembles the full interactive fundamentals section with grouped sections and
drill-down metric cards. This is the top-level component used on Page 2.

```jsx
import { useState } from 'react';

const FundamentalsSection = ({ sections }) => {
  // sections: [{
  //   title: 'Valuation Metrics',
  //   sectionSummary: '...',
  //   sectionStatus: 'good',
  //   metrics: [{ metric, current, historicalStrongAvg, ... }]
  // }]

  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.textMuted,
        textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
        Fundamentals — Click any metric for analysis
      </div>
      {sections.map((section, si) => (
        <div key={si} style={{ marginBottom: 16 }}>
          <FundamentalSectionHeader
            title={section.title}
            metrics={section.metrics}
            sectionSummary={section.sectionSummary}
            sectionStatus={section.sectionStatus}
          />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 6, padding: '0 2px',
          }}>
            {section.metrics.map((m, mi) => (
              <FundamentalMetricCard key={mi} metric={m} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
```

---

## PerformanceToggle (Overview Page — Performance vs Benchmark)

A row of pill-style toggle buttons showing stock performance vs S&P 500 for one
time period at a time. Only one period is active. Shows stock return, S&P return,
and the delta (outperformance / underperformance). This replaces the old full table
approach to avoid information overload.

```jsx
import { useState } from 'react';

const PerformanceToggle = ({ performanceData, ticker }) => {
  // performanceData: { '1M': { stock: 3.2, sp500: 1.8 }, '3M': { stock: -2.1, sp500: 4.5 }, ... }
  // Keys should be: '1M', '3M', '6M', 'YTD', '1Y', '3Y', '5Y'
  const periods = ['1M', '3M', '6M', 'YTD', '1Y', '3Y', '5Y'];
  const available = periods.filter(p => performanceData[p]);
  const [active, setActive] = useState(available[0] || '1Y');

  const d = performanceData[active];
  if (!d) return null;

  const delta = d.stock - d.sp500;
  const deltaColor = delta >= 0 ? COLORS.positive : COLORS.negative;
  const deltaSign = delta >= 0 ? '+' : '';

  return (
    <div style={{ padding: '14px 16px', borderRadius: 8, border: `1px solid ${COLORS.border}`,
      backgroundColor: COLORS.cardBg }}>
      {/* Period pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.textMuted,
          textTransform: 'uppercase', letterSpacing: 1, marginRight: 4 }}>
          Performance
        </span>
        {available.map(p => (
          <button key={p} onClick={() => setActive(p)} style={{
            padding: '3px 10px', borderRadius: 10, fontSize: 10, fontWeight: 600,
            cursor: 'pointer', border: `1.5px solid ${active === p ? COLORS.accent : COLORS.border}`,
            backgroundColor: active === p ? COLORS.accentBg : 'transparent',
            color: active === p ? COLORS.accent : COLORS.textMuted,
            transition: 'all 0.15s ease',
          }}>
            {p}
          </button>
        ))}
      </div>

      {/* Return display — three columns: stock, S&P, delta */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'baseline' }}>
        <div>
          <div style={{ fontSize: 10, color: COLORS.textMuted, marginBottom: 2, textTransform: 'uppercase',
            letterSpacing: 0.5 }}>
            {ticker}
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'monospace',
            color: d.stock >= 0 ? COLORS.positive : COLORS.negative }}>
            {d.stock >= 0 ? '+' : ''}{d.stock.toFixed(2)}%
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: COLORS.textMuted, marginBottom: 2, textTransform: 'uppercase',
            letterSpacing: 0.5 }}>
            S&P 500
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'monospace',
            color: d.sp500 >= 0 ? COLORS.positive : COLORS.negative }}>
            {d.sp500 >= 0 ? '+' : ''}{d.sp500.toFixed(2)}%
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: COLORS.textMuted, marginBottom: 2, textTransform: 'uppercase',
            letterSpacing: 0.5 }}>
            vs S&P
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'monospace', color: deltaColor }}>
            {deltaSign}{delta.toFixed(2)}%
          </div>
          <div style={{ fontSize: 10, color: deltaColor, fontWeight: 600 }}>
            {delta >= 0 ? 'Outperforming' : 'Underperforming'}
          </div>
        </div>
      </div>
    </div>
  );
};
```

---

## Usage Notes

- All components use the light theme `COLORS` constant defined at the top
- Inline styles provide full control without CSS dependencies (no Tailwind)
- Each component is self-contained and can be imported independently
- Hover states and transitions use `onMouseEnter`/`onMouseLeave` for interactivity
- Modal and expandable components use React `useState` for state management
- Add the CSS animations (fadeIn, slideDown) to your global stylesheet for proper transitions
- MACD Strategy components use the `CANDLE` color constant for chart-specific palette
- The `CandleLayer` uses Recharts `Customized` to access internal axis scales for SVG rendering
- `PerformanceToggle` uses pill buttons for time period selection — only one active at a time
- Context section components (`RevenueDonutChart`, `RegionalDonutChart`, `ValueChainDiagram`, `ThreatsOpportunities`, `KeyDriverCards`) all use toggle-based progressive disclosure to manage information density
