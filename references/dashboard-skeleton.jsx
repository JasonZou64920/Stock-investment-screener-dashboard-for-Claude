/**
 * Investment Screening Dashboard — Light-Theme Multi-Page Skeleton
 *
 * This artifact is designed to be shared via Claude's shareable link feature.
 * All data is embedded inline with no external dependencies.
 *
 * This is a complete but empty React component skeleton for a screening dashboard
 * with multi-page tab navigation: Overview, Analysis, News & Sentiment, Export Data.
 * All 10 sections are distributed across tabs with proper light-theme styling.
 * Fill in the data from your research to produce the final artifact.
 *
 * Usage: Copy this skeleton, replace placeholder comments with real data,
 * and export as a .jsx artifact.
 */

import { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// ── Color Palette (Light Theme) ────────────────────────────────────────
const COLORS = {
  pageBg: "#F7F8FA",
  cardBg: "#FFFFFF",
  cardBgHover: "#FAFBFC",
  border: "#E2E8F0",
  borderLight: "#EDF2F7",
  accent: "#2563EB",
  accentLight: "#3B82F6",
  accentBg: "#EFF6FF",
  textPrimary: "#1A202C",
  textBody: "#4A5568",
  textMuted: "#A0AEC0",
  textLight: "#CBD5E0",
  positive: "#059669",
  positiveBg: "#ECFDF5",
  negative: "#DC2626",
  negativeBg: "#FEF2F2",
  caution: "#D97706",
  cautionBg: "#FFFBEB",
  neutral: "#6B7280",
  neutralBg: "#F3F4F6",
};

const MONO = "'SF Mono', 'Fira Code', Consolas, monospace";
const SANS =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

// ── Reusable Primitives ────────────────────────────────────────────────
const Card = ({ title, children }) => (
  <div
    style={{
      backgroundColor: COLORS.cardBg,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 8,
      padding: "20px 24px",
      marginBottom: 16,
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
      transition: "all 0.2s ease",
    }}
  >
    {title && (
      <h2
        style={{
          fontSize: 18,
          fontWeight: 600,
          color: COLORS.textPrimary,
          margin: "0 0 16px 0",
        }}
      >
        {title}
      </h2>
    )}
    {children}
  </div>
);

const MetricCell = ({ label, value, color, clickable, onClick }) => (
  <div
    onClick={onClick}
    style={{
      cursor: clickable ? "pointer" : "default",
      padding: clickable ? 12 : 0,
      borderRadius: clickable ? 6 : 0,
      backgroundColor: clickable ? COLORS.borderLight : "transparent",
      transition: clickable ? "all 0.2s ease" : "none",
    }}
    onMouseEnter={(e) => {
      if (clickable) e.currentTarget.style.backgroundColor = COLORS.neutralBg;
    }}
    onMouseLeave={(e) => {
      if (clickable) e.currentTarget.style.backgroundColor = COLORS.borderLight;
    }}
  >
    <div
      style={{
        fontSize: 11,
        fontWeight: 500,
        color: COLORS.textMuted,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        marginBottom: 4,
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontSize: 20,
        fontWeight: 700,
        color: color || COLORS.textPrimary,
        fontFamily: MONO,
      }}
    >
      {value}
    </div>
  </div>
);

const CollapsibleSection = ({ title, rowCount, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom: 12 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "none",
          border: "none",
          color: COLORS.accent,
          cursor: "pointer",
          fontSize: 13,
          fontWeight: 600,
          padding: "8px 0",
          fontFamily: SANS,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span style={{ display: "inline-block", transition: "transform 0.2s" }}>
          {open ? "▾" : "▸"}
        </span>
        {title} ({rowCount} rows)
      </button>
      {open && (
        <div style={{ marginTop: 12, paddingLeft: 16 }}>
          {children}
        </div>
      )}
    </div>
  );
};

// ── Tooltip Styles ─────────────────────────────────────────────────────
const tooltipStyle = {
  backgroundColor: COLORS.cardBg,
  border: `1px solid ${COLORS.border}`,
  borderRadius: 6,
  color: COLORS.textBody,
  fontSize: 12,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
};

// ── Tab Navigation ─────────────────────────────────────────────────────
const TabNav = ({ tabs, activeTab, setActiveTab }) => (
  <div
    style={{
      display: "flex",
      gap: 2,
      borderBottom: `2px solid ${COLORS.border}`,
      marginBottom: 24,
      paddingBottom: 0,
    }}
  >
    {tabs.map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        style={{
          background: "none",
          border: "none",
          fontSize: 14,
          fontWeight: activeTab === tab ? 600 : 500,
          color: activeTab === tab ? COLORS.accent : COLORS.textMuted,
          padding: "12px 16px",
          cursor: "pointer",
          borderBottom: activeTab === tab ? `3px solid ${COLORS.accent}` : "none",
          marginBottom: -2,
          fontFamily: SANS,
          transition: "all 0.2s ease",
        }}
      >
        {tab}
      </button>
    ))}
  </div>
);

// ── Article Detail Modal ───────────────────────────────────────────────
const ArticleDetailModal = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: COLORS.cardBg,
          borderRadius: 8,
          padding: "32px",
          maxWidth: 600,
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: "0 20px 25px rgba(0, 0, 0, 0.15)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 16 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: COLORS.textPrimary, margin: 0, flex: 1, marginRight: 16 }}>
            {article.title}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: 20,
              color: COLORS.textMuted,
              cursor: "pointer",
              padding: 0,
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ marginBottom: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: COLORS.textMuted }}>
            {article.source}
          </span>
          <span style={{ fontSize: 12, color: COLORS.textMuted }}>
            {article.date}
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: "2px 8px",
              borderRadius: 4,
              backgroundColor:
                article.sentiment === "Positive"
                  ? COLORS.positiveBg
                  : article.sentiment === "Negative"
                  ? COLORS.negativeBg
                  : COLORS.cautionBg,
              color:
                article.sentiment === "Positive"
                  ? COLORS.positive
                  : article.sentiment === "Negative"
                  ? COLORS.negative
                  : COLORS.caution,
            }}
          >
            {article.sentiment}
          </span>
        </div>

        <div style={{ marginBottom: 16, lineHeight: 1.6, fontSize: 14, color: COLORS.textBody }}>
          {article.summary}
        </div>

        {article.keywords && article.keywords.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.textMuted, marginBottom: 8 }}>
              KEY KEYWORDS
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {article.keywords.map((kw, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 12,
                    padding: "4px 10px",
                    backgroundColor: COLORS.accentBg,
                    color: COLORS.accent,
                    borderRadius: 4,
                    fontWeight: 500,
                  }}
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {article.url && (
          <div style={{ paddingTop: 16, borderTop: `1px solid ${COLORS.border}` }}>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 13,
                color: COLORS.accent,
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Read original article →
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Sentiment Gauge Component ──────────────────────────────────────────
const SentimentGauge = ({ positive, mixed, negative, total }) => {
  const posPct = total > 0 ? (positive / total) * 100 : 0;
  const mixPct = total > 0 ? (mixed / total) * 100 : 0;
  const negPct = total > 0 ? (negative / total) * 100 : 0;

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 12, height: 24, borderRadius: 4, overflow: "hidden" }}>
        <div style={{ flex: posPct, backgroundColor: COLORS.positive, minWidth: posPct > 0 ? 4 : 0 }} />
        <div style={{ flex: mixPct, backgroundColor: COLORS.caution, minWidth: mixPct > 0 ? 4 : 0 }} />
        <div style={{ flex: negPct, backgroundColor: COLORS.negative, minWidth: negPct > 0 ? 4 : 0 }} />
      </div>
      <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
        <div>
          <span style={{ color: COLORS.textMuted }}>Positive: </span>
          <span style={{ fontWeight: 600, color: COLORS.positive }}>{positive}</span>
        </div>
        <div>
          <span style={{ color: COLORS.textMuted }}>Mixed: </span>
          <span style={{ fontWeight: 600, color: COLORS.caution }}>{mixed}</span>
        </div>
        <div>
          <span style={{ color: COLORS.textMuted }}>Negative: </span>
          <span style={{ fontWeight: 600, color: COLORS.negative }}>{negative}</span>
        </div>
      </div>
    </div>
  );
};

// ── Keyword Cloud Component ────────────────────────────────────────────
const KeywordCloud = ({ keywords }) => {
  if (!keywords || keywords.length === 0) return null;

  return (
    <div style={{ marginTop: 16 }}>
      <h4 style={{ fontSize: 14, fontWeight: 600, color: COLORS.textPrimary, marginBottom: 12 }}>
        Top Keywords
      </h4>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {keywords.slice(0, 20).map((kw, i) => (
          <span
            key={i}
            style={{
              fontSize: 12,
              padding: "6px 12px",
              backgroundColor: [COLORS.accentBg, COLORS.positiveBg, COLORS.cautionBg, COLORS.neutralBg][i % 4],
              color: [COLORS.accent, COLORS.positive, COLORS.caution, COLORS.neutral][i % 4],
              borderRadius: 16,
              fontWeight: 500,
            }}
          >
            {kw}
          </span>
        ))}
      </div>
    </div>
  );
};

// ── Main Dashboard Component ───────────────────────────────────────────
export default function ScreeningDashboard() {
  // TODO: Replace all placeholder data below with real research data.

  const [activeTab, setActiveTab] = useState("Overview");
  const [expandedArticle, setExpandedArticle] = useState(null);
  const [showAllNews, setShowAllNews] = useState(false);
  const [newsPage, setNewsPage] = useState(0);

  // ── Section 1: Header Bar Data ─────────────────────────────────────
  const header = {
    ticker: "TICKER",
    name: "Company or Fund Name",
    assetType: "Stock", // or "ETF"
    price: 0.0,
    change: 0.0,
    changePct: 0.0,
    timestamp: "As of MMM DD, YYYY H:MM PM ET",
  };

  // ── Section 2: Key Metrics Strip Data ──────────────────────────────
  const keyMetrics = [
    // { label: "MARKET CAP", value: "$X.XXB", color: null },
    // { label: "52-WEEK HIGH", value: "$XXX.XX", color: null },
    // { label: "YTD RETURN", value: "+X.X%", color: COLORS.positive },
    // ... 4-6 metrics
  ];

  // ── Section 3: Price & Volume Data ─────────────────────────────────
  const priceData = [
    // { date: "May '21", close: 131.46, volume: 89234500 },
    // ... ~60 data points
  ];

  // ── Section 4: Drawdown Data ───────────────────────────────────────
  const drawdownData = [
    // { date: "May '21", drawdown: 0 },
    // ... same length as priceData
  ];
  const maxDrawdown = { pct: 0, peakDate: "", troughDate: "", recoveryDate: "" };
  const significantDrawdowns = [
    // { rank: 1, peakDate: "", troughDate: "", depth: "", daysDown: 0,
    //   recoveryDate: "", daysRecover: 0, totalUnderwater: 0, narrative: "" },
  ];

  // ── Section 5: Momentum & Trend Data ───────────────────────────────
  const movingAverages = { sma50: 0, sma200: 0, priceVs50: "", priceVs200: "", crossover: "" };
  const momentumReturns = [
    // { period: "1 Month", return: "+X.X%", color: COLORS.positive },
  ];
  const momentumScore = { label: "Neutral", color: COLORS.neutral, justification: "" };

  // ── Section 6: Asset-Specific Details ──────────────────────────────
  // For stocks: fundamentals object. For ETFs: structure, holdings, cost.
  // TODO: Populate based on asset type.

  // ── Section 7: News & Sentiment Data ───────────────────────────────
  const sentiment = {
    rating: "Mixed",
    positive: 0,
    mixed: 0,
    negative: 0,
    total: 0,
    justification: "",
  };
  const articles = [
    // { date: "", source: "", title: "", sentiment: "", summary: "", keywords: [], url: "" },
  ];
  const topKeywords = [
    // "keyword1", "keyword2", ...
  ];

  // ── Section 8: Sources ─────────────────────────────────────────────
  const sources = {
    // officialFilings: [{ name: "", title: "", date: "", url: "" }],
    // fundSponsor: [],
    // dataProviders: [],
    // publications: [],
  };

  // ── Section 9 & 10: Export Tables & Disclaimer ─────────────────────
  // Reuse priceData, drawdownData, significantDrawdowns, articles, sources, etc.

  // ── Helper Functions ───────────────────────────────────────────────
  const changeColor = header.change >= 0 ? COLORS.positive : COLORS.negative;
  const articlesPerPage = 5;
  const displayedArticles = showAllNews ? articles : articles.slice(newsPage * articlesPerPage, (newsPage + 1) * articlesPerPage);
  const totalNewsPages = Math.ceil(articles.length / articlesPerPage);

  // ── RENDER ─────────────────────────────────────────────────────────

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "32px 24px",
        backgroundColor: COLORS.pageBg,
        fontFamily: SANS,
        color: COLORS.textPrimary,
        lineHeight: 1.5,
      }}
    >
      {/* ── 1. Header Bar (All Tabs) ──────────────────────────────────── */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: COLORS.textPrimary }}>{header.ticker}</span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: COLORS.accent,
                  backgroundColor: COLORS.accentBg,
                  padding: "2px 10px",
                  borderRadius: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {header.assetType}
              </span>
            </div>
            <div style={{ fontSize: 16, color: COLORS.textBody, marginBottom: 12 }}>{header.name}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <span style={{ fontSize: 24, fontWeight: 700, color: COLORS.textPrimary, fontFamily: MONO }}>
                ${header.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
              <span style={{ fontSize: 14, fontWeight: 600, color: changeColor, fontFamily: MONO }}>
                {header.change >= 0 ? "+" : ""}
                {header.change.toFixed(2)} ({header.changePct >= 0 ? "+" : ""}
                {header.changePct.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
        <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 12 }}>{header.timestamp}</div>
      </Card>

      {/* ── Tab Navigation ────────────────────────────────────────────── */}
      <TabNav tabs={["Overview", "Analysis", "News & Sentiment", "Export Data"]} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* ════ OVERVIEW TAB ════════════════════════════════════════════════ */}
      {activeTab === "Overview" && (
        <>
          {/* ── 2. Key Metrics Strip ──────────────────────────────────── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 16,
              marginBottom: 16,
            }}
          >
            {keyMetrics.map((m, i) => (
              <Card key={i}>
                <MetricCell label={m.label} value={m.value} color={m.color} clickable onClick={() => {}} />
              </Card>
            ))}
          </div>

          {/* ── 3. Price & Volume Chart ───────────────────────────────── */}
          <Card title="Price & Volume — 5 Year">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={priceData} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
                <defs>
                  <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.accent} stopOpacity={0.15} />
                    <stop offset="100%" stopColor={COLORS.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={COLORS.border} strokeOpacity={0.5} strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fill: COLORS.textMuted, fontSize: 11 }} axisLine={{ stroke: COLORS.border }} />
                <YAxis tick={{ fill: COLORS.textMuted, fontSize: 11 }} axisLine={{ stroke: COLORS.border }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="close" stroke={COLORS.accent} strokeWidth={2} fill="url(#priceGrad)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="100%" height={80}>
              <BarChart data={priceData} margin={{ top: 0, right: 20, bottom: 5, left: 10 }}>
                <XAxis dataKey="date" tick={false} axisLine={{ stroke: COLORS.border }} />
                <YAxis tick={{ fill: COLORS.textMuted, fontSize: 10 }} axisLine={{ stroke: COLORS.border }} />
                <Bar dataKey="volume" fill={COLORS.accent} fillOpacity={0.3} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </>
      )}

      {/* ════ ANALYSIS TAB ═════════════════════════════════════════════════ */}
      {activeTab === "Analysis" && (
        <>
          {/* ── 4. Drawdown Analysis ──────────────────────────────────── */}
          <Card title="Drawdown Analysis">
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 500, color: COLORS.textMuted, textTransform: "uppercase", marginBottom: 4 }}>
                    Max Drawdown
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.negative }}>
                    {maxDrawdown.pct}%
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 500, color: COLORS.textMuted, textTransform: "uppercase", marginBottom: 4 }}>
                    Peak Date
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.textPrimary }}>
                    {maxDrawdown.peakDate || "—"}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 500, color: COLORS.textMuted, textTransform: "uppercase", marginBottom: 4 }}>
                    Trough Date
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.textPrimary }}>
                    {maxDrawdown.troughDate || "—"}
                  </div>
                </div>
              </div>
            </div>
            {/* TODO: Max drawdown chart, significant drawdowns table, risk summary */}
          </Card>

          {/* ── 5. Momentum & Trend ───────────────────────────────────── */}
          <Card title="Momentum & Trend">
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "inline-block", padding: "8px 16px", borderRadius: 20, backgroundColor: COLORS.neutralBg }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: momentumScore.color }}>
                  {momentumScore.label}
                </span>
              </div>
              {momentumScore.justification && (
                <div style={{ marginTop: 12, fontSize: 13, color: COLORS.textBody, lineHeight: 1.6 }}>
                  {momentumScore.justification}
                </div>
              )}
            </div>
            {/* TODO: Momentum score badge, MA table, return pills, trend overlay chart */}
          </Card>

          {/* ── 6. Asset-Specific Details ─────────────────────────────── */}
          <Card title={header.assetType === "ETF" ? "Fund Structure & Holdings" : "Fundamentals"}>
            {/* TODO: Stock fundamentals tables OR ETF structure/holdings/cost tables */}
          </Card>
        </>
      )}

      {/* ════ NEWS & SENTIMENT TAB ═════════════════════════════════════════ */}
      {activeTab === "News & Sentiment" && (
        <>
          {/* ── 7. News & Sentiment ───────────────────────────────────── */}
          <Card title="News & Sentiment">
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 500, color: COLORS.textMuted, textTransform: "uppercase", marginBottom: 8 }}>
                    Overall Rating
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.textPrimary }}>
                    {sentiment.rating}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 500, color: COLORS.textMuted, textTransform: "uppercase", marginBottom: 8 }}>
                    Total Articles
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.textPrimary }}>
                    {sentiment.total}
                  </div>
                </div>
              </div>

              <h4 style={{ fontSize: 13, fontWeight: 600, color: COLORS.textPrimary, marginBottom: 12 }}>
                Sentiment Breakdown
              </h4>
              <SentimentGauge
                positive={sentiment.positive}
                mixed={sentiment.mixed}
                negative={sentiment.negative}
                total={sentiment.total}
              />

              {sentiment.justification && (
                <div style={{ fontSize: 13, color: COLORS.textBody, lineHeight: 1.6, padding: 12, backgroundColor: COLORS.neutralBg, borderRadius: 6 }}>
                  {sentiment.justification}
                </div>
              )}
            </div>

            <h4 style={{ fontSize: 14, fontWeight: 600, color: COLORS.textPrimary, marginTop: 20, marginBottom: 12 }}>
              Recent Articles
            </h4>

            {articles.length > 0 ? (
              <>
                <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                  <button
                    onClick={() => {
                      setShowAllNews(!showAllNews);
                      setNewsPage(0);
                    }}
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: COLORS.accent,
                      backgroundColor: COLORS.accentBg,
                      border: `1px solid ${COLORS.border}`,
                      padding: "6px 12px",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    {showAllNews ? "Show Paginated" : "Show All News"}
                  </button>
                </div>

                <div style={{ marginBottom: 16 }}>
                  {displayedArticles.map((article, i) => (
                    <div
                      key={i}
                      onClick={() => setExpandedArticle(article)}
                      style={{
                        padding: 12,
                        marginBottom: 8,
                        backgroundColor: COLORS.borderLight,
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: 6,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = COLORS.cardBgHover;
                        e.currentTarget.style.transform = "translateY(-1px)";
                        e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.08)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = COLORS.borderLight;
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.textPrimary, marginBottom: 4 }}>
                            {article.title}
                          </div>
                          <div style={{ display: "flex", gap: 12, fontSize: 11, color: COLORS.textMuted }}>
                            <span>{article.source}</span>
                            <span>{article.date}</span>
                          </div>
                        </div>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            padding: "4px 10px",
                            borderRadius: 4,
                            backgroundColor:
                              article.sentiment === "Positive"
                                ? COLORS.positiveBg
                                : article.sentiment === "Negative"
                                ? COLORS.negativeBg
                                : COLORS.cautionBg,
                            color:
                              article.sentiment === "Positive"
                                ? COLORS.positive
                                : article.sentiment === "Negative"
                                ? COLORS.negative
                                : COLORS.caution,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {article.sentiment}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {!showAllNews && totalNewsPages > 1 && (
                  <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 16 }}>
                    <button
                      onClick={() => setNewsPage(Math.max(0, newsPage - 1))}
                      disabled={newsPage === 0}
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: newsPage === 0 ? COLORS.textMuted : COLORS.accent,
                        background: "none",
                        border: `1px solid ${COLORS.border}`,
                        padding: "6px 12px",
                        borderRadius: 4,
                        cursor: newsPage === 0 ? "default" : "pointer",
                      }}
                    >
                      ← Previous
                    </button>
                    <span style={{ fontSize: 12, color: COLORS.textMuted, padding: "6px 12px" }}>
                      Page {newsPage + 1} of {totalNewsPages}
                    </span>
                    <button
                      onClick={() => setNewsPage(Math.min(totalNewsPages - 1, newsPage + 1))}
                      disabled={newsPage >= totalNewsPages - 1}
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: newsPage >= totalNewsPages - 1 ? COLORS.textMuted : COLORS.accent,
                        background: "none",
                        border: `1px solid ${COLORS.border}`,
                        padding: "6px 12px",
                        borderRadius: 4,
                        cursor: newsPage >= totalNewsPages - 1 ? "default" : "pointer",
                      }}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div style={{ fontSize: 13, color: COLORS.textMuted, padding: 12, backgroundColor: COLORS.borderLight, borderRadius: 6 }}>
                No articles available.
              </div>
            )}

            <KeywordCloud keywords={topKeywords} />
          </Card>

          <ArticleDetailModal article={expandedArticle} onClose={() => setExpandedArticle(null)} />
        </>
      )}

      {/* ════ EXPORT DATA TAB ══════════════════════════════════════════════ */}
      {activeTab === "Export Data" && (
        <>
          {/* ── 8. Sources ────────────────────────────────────────────── */}
          <Card title="Sources">
            <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 16 }}>
              Sources verified as of {header.timestamp?.replace("As of ", "")}.
            </div>
            {/* TODO: Grouped source entries by category */}
          </Card>

          {/* ── 9. Export Data ────────────────────────────────────────── */}
          <Card title="Export Data">
            <p style={{ fontSize: 13, color: COLORS.textBody, marginTop: 0, marginBottom: 16 }}>
              The following data tables are available for export. Click to expand.
            </p>

            <CollapsibleSection title="Price Data" rowCount={priceData.length}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                      <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: COLORS.textPrimary }}>Date</th>
                      <th style={{ padding: "8px 12px", textAlign: "right", fontWeight: 600, color: COLORS.textPrimary }}>Close</th>
                      <th style={{ padding: "8px 12px", textAlign: "right", fontWeight: 600, color: COLORS.textPrimary }}>Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {priceData.slice(0, 10).map((row, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${COLORS.borderLight}` }}>
                        <td style={{ padding: "8px 12px", color: COLORS.textBody }}>{row.date}</td>
                        <td style={{ padding: "8px 12px", textAlign: "right", color: COLORS.textBody }}>{row.close}</td>
                        <td style={{ padding: "8px 12px", textAlign: "right", color: COLORS.textBody }}>{row.volume}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {priceData.length > 10 && (
                <div style={{ marginTop: 8, fontSize: 11, color: COLORS.textMuted }}>
                  ... and {priceData.length - 10} more rows
                </div>
              )}
            </CollapsibleSection>

            <CollapsibleSection title="Significant Drawdowns" rowCount={significantDrawdowns.length}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                      <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: COLORS.textPrimary }}>Rank</th>
                      <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: COLORS.textPrimary }}>Depth</th>
                      <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: COLORS.textPrimary }}>Days Down</th>
                    </tr>
                  </thead>
                  <tbody>
                    {significantDrawdowns.slice(0, 5).map((row, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${COLORS.borderLight}` }}>
                        <td style={{ padding: "8px 12px", color: COLORS.textBody }}>{row.rank}</td>
                        <td style={{ padding: "8px 12px", color: COLORS.negative }}>{row.depth}</td>
                        <td style={{ padding: "8px 12px", color: COLORS.textBody }}>{row.daysDown}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Articles" rowCount={articles.length}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                      <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: COLORS.textPrimary }}>Title</th>
                      <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: COLORS.textPrimary }}>Source</th>
                      <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: COLORS.textPrimary }}>Sentiment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {articles.slice(0, 10).map((article, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${COLORS.borderLight}` }}>
                        <td style={{ padding: "8px 12px", color: COLORS.textBody }}>{article.title}</td>
                        <td style={{ padding: "8px 12px", color: COLORS.textBody }}>{article.source}</td>
                        <td style={{ padding: "8px 12px", color: COLORS.textBody }}>{article.sentiment}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {articles.length > 10 && (
                <div style={{ marginTop: 8, fontSize: 11, color: COLORS.textMuted }}>
                  ... and {articles.length - 10} more articles
                </div>
              )}
            </CollapsibleSection>
          </Card>

          {/* ── 10. Disclaimer ────────────────────────────────────────── */}
          <div
            style={{
              borderTop: `1px solid ${COLORS.border}`,
              paddingTop: 16,
              marginTop: 8,
              fontSize: 11,
              color: COLORS.textMuted,
              lineHeight: 1.6,
            }}
          >
            This screening dashboard is for informational purposes only and does not
            constitute investment advice, a recommendation, or a solicitation to buy
            or sell any security. Past performance is not indicative of future results.
            All data is sourced from publicly available information and may contain
            errors or delays. Consult a qualified financial advisor before making
            investment decisions.
          </div>
        </>
      )}
    </div>
  );
}
