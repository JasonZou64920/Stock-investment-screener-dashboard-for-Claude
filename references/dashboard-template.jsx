import { useState, useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, PieChart, Pie, Cell } from 'recharts';

// ╔══════════════════════════════════════════════════════════════════╗
// ║  DATA CONSTANTS — Replace these with real fetched data.         ║
// ║  All rendering code below is FIXED. Do NOT modify components.   ║
// ╚══════════════════════════════════════════════════════════════════╝

const TICKER = 'AAPL';
const COMPANY_NAME = 'Apple Inc.';
const ASSET_TYPE = 'Stock';
const AS_OF_DATE = '2026-07-10';

const DATA_HERO = {
  price: 213.25, change: -1.42, changePct: -0.66,
  marketCap: 3.28e12, high52w: 237.49, low52w: 164.08, ytdReturn: 12.4,
  aum: null, expenseRatio: null,
};

const DATA_KEY_METRICS = [
  { label: 'Market Cap', value: '$3.28T' },
  { label: '52-Week High', value: '$237.49' },
  { label: '52-Week Low', value: '$164.08' },
  { label: 'YTD Return', value: '+12.40%' },
  { label: 'Avg Volume', value: '62.15M' },
  { label: 'Dividend Yield', value: '0.55%' },
];

const DATA_PRICE_HISTORY = [
  { date: '2021-04-12', open: 132.5, high: 135.0, low: 131.0, close: 134.2, volume: 89234500 },
];

const DATA_PERFORMANCE = [
  { period: '1M', stockReturn: 3.21, benchReturn: 2.15, delta: 1.06 },
  { period: '3M', stockReturn: 8.45, benchReturn: 5.12, delta: 3.33 },
  { period: '6M', stockReturn: 15.2, benchReturn: 10.8, delta: 4.4 },
  { period: 'YTD', stockReturn: 12.4, benchReturn: 9.8, delta: 2.6 },
  { period: '1Y', stockReturn: 22.1, benchReturn: 18.5, delta: 3.6 },
  { period: '3Y', stockReturn: 45.3, benchReturn: 38.2, delta: 7.1 },
  { period: '5Y', stockReturn: 210.5, benchReturn: 85.4, delta: 125.1 },
];

const DATA_COMPANY = {
  description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories.',
  industryPrimer: null,
  revenueStreams: [
    { name: 'iPhone', pct: 52, description: 'Flagship smartphone line.', growth: 'stable', margin: 'high' },
    { name: 'Services', pct: 22, description: 'App Store, Apple Music, iCloud.', growth: 'growing', margin: 'very high' },
    { name: 'Mac', pct: 10, description: 'MacBook and desktop computers.', growth: 'stable', margin: 'high' },
    { name: 'iPad', pct: 7, description: 'Tablet devices.', growth: 'stable', margin: 'high' },
    { name: 'Wearables', pct: 9, description: 'Apple Watch, AirPods.', growth: 'growing', margin: 'moderate' },
  ],
  regionalOps: [
    { region: 'Americas', pct: 43 },
    { region: 'Europe', pct: 25 },
    { region: 'Greater China', pct: 17 },
    { region: 'Japan', pct: 7 },
    { region: 'Rest of Asia Pacific', pct: 8 },
  ],
  geoConcentrationNote: '43% Americas-dependent with significant China exposure (17%)',
};

const DATA_VALUE_CHAIN = [{
  chainName: 'Consumer Electronics',
  stages: [
    { name: 'Raw Materials', desc: 'Rare earths, metals', companyHere: false, companyRole: null, explanation: 'Mining and refining of materials used in electronic devices.', keyPlayers: ['Albemarle', 'Corning'] },
    { name: 'Components', desc: 'Chips, displays', companyHere: false, companyRole: null, explanation: 'Production of processors, memory, displays.', keyPlayers: ['TSMC', 'Samsung'] },
    { name: 'Design', desc: 'Hardware + software', companyHere: true, companyRole: 'Custom silicon, iOS/macOS, hardware design', explanation: 'Product design and IP creation.', keyPlayers: ['Apple', 'Google'] },
    { name: 'Assembly', desc: 'Final assembly', companyHere: false, companyRole: null, explanation: 'Contract manufacturing.', keyPlayers: ['Foxconn'] },
    { name: 'Retail', desc: 'Sales channels', companyHere: true, companyRole: '500+ Apple Stores', explanation: 'Distribution to end consumers.', keyPlayers: ['Apple', 'Best Buy'] },
    { name: 'Services', desc: 'Subscriptions', companyHere: true, companyRole: 'App Store, iCloud, Apple TV+', explanation: 'Post-sale monetization.', keyPlayers: ['Apple', 'Google'] },
  ],
  upstreamNote: 'Dependent on TSMC and Foxconn',
  downstreamNote: 'Consumers, enterprises, education',
  adjacentCompetitors: ['Samsung', 'Google', 'Microsoft'],
}];

const DATA_THREATS = [
  { factor: 'China risk', description: 'Regulatory restrictions on US tech in China.', magnitude: 'high', affectsWhat: 'Revenue', currentStatus: 'headwind' },
  { factor: 'Antitrust', description: 'App Store investigations.', magnitude: 'high', affectsWhat: 'Services margins', currentStatus: 'headwind' },
  { factor: 'Saturation', description: 'Mature smartphone market.', magnitude: 'moderate', affectsWhat: 'iPhone volume', currentStatus: 'headwind' },
];

const DATA_OPPORTUNITIES = [
  { factor: 'Services growth', description: 'Expanding subscriptions with 1B+ installed base.', magnitude: 'very high', affectsWhat: 'Revenue and margins', currentStatus: 'tailwind' },
  { factor: 'Spatial computing', description: 'Vision Pro mixed reality.', magnitude: 'moderate', affectsWhat: 'New revenue', currentStatus: 'tailwind' },
  { factor: 'India expansion', description: 'Growth in India retail/manufacturing.', magnitude: 'high', affectsWhat: 'Diversification', currentStatus: 'tailwind' },
];

const DATA_KEY_DRIVERS = [
  { driver: 'iPhone cycle', description: 'Annual launches drive ~52% of revenue.' },
  { driver: 'Services', description: 'Highest-margin segment growing 15%+ annually.' },
  { driver: 'China demand', description: 'Huawei competition makes China a swing factor.' },
  { driver: 'Capital returns', description: '$110B+ annual buybacks support EPS.' },
];

const DATA_DRAWDOWN = {
  maxDrawdown: -31.2, peakDate: '2022-01-03', troughDate: '2022-12-28', recoveryDate: '2023-06-12',
  series: [{ date: '2021-04-12', drawdown: 0 }],
  significantPeriods: [
    { rank: 1, peakDate: '2022-01-03', troughDate: '2022-12-28', depth: -31.2, daysDown: 360, recoveryDate: '2023-06-12', daysRecover: 166, narrative: 'Fed rate hike cycle crushed tech valuations.' },
  ],
  riskSummary: 'One major drawdown of -31.2% during 2022 rate hikes, recovering in ~6 months.',
};

const DATA_MOMENTUM = {
  score: { label: 'Bullish', color: '#059669', justification: 'Above both SMAs with 3 of 4 returns positive.' },
  sma50: 208.45, sma200: 195.32, priceVs50: 2.3, priceVs200: 9.2,
  crossover: null,
  returns: [{ period: '1M', value: 3.21 }, { period: '3M', value: 8.45 }, { period: '6M', value: 15.2 }, { period: '12M', value: 22.1 }],
};

const DATA_FUNDAMENTALS = [
  { section: 'Valuation', synthesis: 'Elevated vs historical but supported by growth premium.', sectionStatus: 'slight_concern', metrics: [
    { metric: 'P/E (TTM)', current: 28.5, historicalStrongAvg: 24.2, historicalRange: { low: 18.1, high: 32.0 }, status: 'slight_concern', explanation: 'P/E above strong-period average reflecting growth premium.', likelyCause: 'Services mix shift pricing.', sourceArticle: { title: 'Morningstar AAPL', url: 'https://morningstar.com' }, direction: 'context_dependent' },
  ]},
  { section: 'Profitability', synthesis: 'Strong margins near historical highs.', sectionStatus: 'good', metrics: [
    { metric: 'Revenue (TTM)', current: 394.3e9, historicalStrongAvg: 365e9, historicalRange: { low: 274e9, high: 394e9 }, status: 'very_good', explanation: 'Record revenue.', likelyCause: 'iPhone 15 + Services.', sourceArticle: { title: 'AAPL Q4', url: 'https://example.com' }, direction: 'higher_is_better' },
  ]},
  { section: 'Cash Flow', synthesis: 'Exceptionally strong FCF.', sectionStatus: 'very_good', metrics: [] },
  { section: 'Balance Sheet', synthesis: 'Net-cash positive.', sectionStatus: 'good', metrics: [] },
  { section: 'Trading & Liquidity', synthesis: 'Highly liquid, minimal short interest.', sectionStatus: 'very_good', metrics: [] },
];

const DATA_MONTHLY_OHLC = [
  { date: '2018-04', open: 166.4, high: 176.2, low: 162.3, close: 169.1, volume: 2.1e9, ma10: null, macd: null, signal: null, histogram: null },
];

const DATA_CATALYST_EVENTS = [
  { id: 1, title: 'Apple beats Q4 estimates', date: '2024-01-25', monthDate: '2024-01', category: 'earnings', sources: [{ publisher: 'Reuters', title: 'Apple Q4', url: 'https://reuters.com/example', date: '2024-01-25' }], summary: 'Revenue of $119.6B beat estimates.', priceReaction: 'Stock rose 6.2%.', sentimentTag: 'bullish', regimeEffect: 'confirmed', regimeNote: 'Reinforced bullish regime.' },
];

const DATA_MACD_STRATEGY = {
  label: 'Strong Bull', conviction: 90, trendStatus: 'Confirmed Uptrend', momentumStatus: 'Strong Positive',
  explanation: 'Price above 10-month MA with expanding histogram.', riskNote: 'Break below 10-month MA would shift trend to neutral.',
  macdZScore: 1.42, divergence: { divergenceType: 'none', description: 'No divergence detected.' },
  projectedMACD: { expected: 4.85, ci95Low: 3.21, ci95High: 6.49 },
  avgMomentum6m: 2.14, avgMomentum12m: 1.46, momentumAcceleration: 0.68,
  signalConsistency: { score: 83, dominantSide: 'bullish', months: '10/12' },
};

const DATA_CONSENSUS = {
  rating: 'Buy', buyCount: 22, holdCount: 5, sellCount: 2, analystCount: 29,
  avgTarget: 245.0, highTarget: 300.0, highFirm: 'Wedbush', lowTarget: 180.0, lowFirm: 'Phillip Securities',
  q1Target: 225.0, medianTarget: 242.0, q3Target: 270.0, impliedUpside: 14.9,
  consensusEpsFy1: 7.45, consensusRevFy1: 412e9, forwardPE: 28.9,
  fairValue: { estimate: 220, source: 'Morningstar', starRating: 3, moatRating: 'Wide' },
  earningsSurprise: { actual: 2.18, estimate: 2.06, surprise: 0.12, surprisePct: 5.8 },
  streetThesis: 'Broadly bullish on AAPL, anchored by Services growth and iPhone AI upgrade cycle.',
};

const DATA_ANALYST_ACTIONS = [
  { date: '2026-03-15', firm: 'Morgan Stanley', analyst: 'Erik Woodring', action: 'Reiterate', rating: 'Overweight', priceTarget: 280, thesis: 'AI-driven iPhone upgrade supercycle.', url: 'https://example.com/ms' },
];

const DATA_NEWS_ARTICLES = [
  { id: 1, title: 'Apple Reports Record Q1 Revenue', source: 'Reuters', author: 'S. Nellis', date: '2026-03-28', url: 'https://reuters.com/example', source_tier: 1, sentiment_tag: 'Positive', theme: 'earnings', summary: 'Q1 revenue of $124.3B beat estimates.', extracted_keywords: [{ word: 'earnings beat', polarity: 'positive' }], fundamental_impact: 4, market_sentiment: 3, urgency: 4, confidence: 0.9 },
];

const DATA_SENTIMENT = {
  rating: 'Bullish', distribution: { positive: 14, mixed: 4, negative: 2 }, confidence: 0.82,
  justification: 'Broadly bullish driven by strong earnings and analyst commentary.',
  articleCount: 20, sourceCount: 12, tier1Pct: 65,
  dimensions: {
    fundamentalImpact: { avg: 2.8, interpretation: 'Moderately positive fundamental signals.' },
    marketSentiment: { avg: 2.1, interpretation: 'Positive market tone.' },
    urgency: { avg: 3.2, interpretation: 'Moderate urgency.' },
    confidence: { avg: 0.78, interpretation: 'High confidence from Tier 1 sources.' },
  },
};

const DATA_SENTIMENT_KEYWORDS = [
  { word: 'earnings beat', polarity: 'positive', count: 8 },
  { word: 'services growth', polarity: 'positive', count: 6 },
  { word: 'China risk', polarity: 'negative', count: 4 },
  { word: 'upgrade cycle', polarity: 'positive', count: 4 },
  { word: 'antitrust', polarity: 'negative', count: 3 },
  { word: 'margin expansion', polarity: 'positive', count: 3 },
];

const DATA_CITATIONS = [
  { category: 'Data Sources', items: [{ title: 'Yahoo Finance — Price History', url: 'https://finance.yahoo.com' }] },
  { category: 'News', items: [{ title: 'Apple Q1 Revenue — Reuters', url: 'https://reuters.com/example' }] },
];

// ═══════════════════════════════════════════════════════════════
// FIXED RENDERING CODE — Do NOT modify below this line
// ═══════════════════════════════════════════════════════════════

const COLORS = {
  pageBg: '#F7F8FA', cardBg: '#FFFFFF', cardBgHover: '#FAFBFC',
  border: '#E2E8F0', borderLight: '#EDF2F7',
  accent: '#2563EB', accentLight: '#3B82F6', accentBg: '#EFF6FF',
  textPrimary: '#1A202C', textBody: '#4A5568', textMuted: '#A0AEC0', textLight: '#CBD5E0',
  positive: '#059669', positiveBg: '#ECFDF5',
  negative: '#DC2626', negativeBg: '#FEF2F2',
  caution: '#D97706', cautionBg: '#FFFBEB',
  neutral: '#6B7280', neutralBg: '#F3F4F6',
};
const MONO = "'SF Mono','Fira Code','Consolas',monospace";
const STATUS_STYLES = {
  very_good: { border: '#047857', bg: '#ECFDF5', text: '#047857', label: 'Very Good' },
  good: { border: '#059669', bg: '#F0FDF4', text: '#059669', label: 'Good' },
  reasonable: { border: '#6B7280', bg: '#F9FAFB', text: '#6B7280', label: 'Reasonable' },
  slight_concern: { border: '#D97706', bg: '#FFFBEB', text: '#D97706', label: 'Slight Concern' },
  concern: { border: '#DC2626', bg: '#FEF2F2', text: '#DC2626', label: 'Concern' },
  severe_concern: { border: '#991B1B', bg: '#FEF2F2', text: '#991B1B', label: 'Severe Concern' },
};
const CANDLE_UP = '#5B9E8F', CANDLE_DOWN = '#C4645A';
const fmt = {
  price: (v) => v == null ? '—' : '$' + Number(v).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
  pct: (v) => v == null ? '—' : (v >= 0 ? '+' : '') + Number(v).toFixed(2) + '%',
  vol: (v) => { if (v == null) return '—'; return (Number(v)/1e6).toFixed(2)+'M'; },
  bigNum: (v) => { if (v == null) return '—'; const n = Number(v); if (n>=1e12) return '$'+(n/1e12).toFixed(2)+'T'; if (n>=1e9) return '$'+(n/1e9).toFixed(2)+'B'; if (n>=1e6) return '$'+(n/1e6).toFixed(2)+'M'; return '$'+n.toLocaleString(); },
  num: (v, dp=2) => v == null ? '—' : Number(v).toFixed(dp),
};
const downsample = (data, max) => { if (!data||data.length<=max) return data; const s=Math.ceil(data.length/max); return data.filter((_,i)=>i%s===0||i===data.length-1); };
const prepareCandleData = (data) => data.map(d => ({ ...d, candleBase: Math.min(d.open,d.close), candleBody: Math.max(0.01,Math.abs(d.close-d.open)), isUp: d.close>=d.open }));
const DONUT_COLORS = ['#2563EB','#3B82F6','#60A5FA','#93C5FD','#BFDBFE','#DBEAFE'];
const GEO_COLORS = ['#1E40AF','#2563EB','#3B82F6','#60A5FA','#93C5FD','#BFDBFE'];

const Card = ({children, style}) => <div style={{padding:16,borderRadius:8,border:'1px solid '+COLORS.border,backgroundColor:COLORS.cardBg,marginBottom:16,...style}}>{children}</div>;
const SectionLabel = ({children}) => <div style={{fontSize:11,fontWeight:700,color:COLORS.textMuted,textTransform:'uppercase',letterSpacing:1,marginBottom:8}}>{children}</div>;

{/* ─── Page 1: Overview ─── */}

const HeaderBar = () => (
  <div style={{display:'flex',alignItems:'baseline',gap:12,flexWrap:'wrap',marginBottom:16}}>
    <span style={{fontSize:28,fontWeight:800,color:COLORS.textPrimary}}>{TICKER}</span>
    <span style={{fontSize:11,fontWeight:600,padding:'2px 8px',borderRadius:8,backgroundColor:COLORS.accentBg,color:COLORS.accent}}>{ASSET_TYPE}</span>
    <span style={{fontSize:15,color:COLORS.textMuted}}>{COMPANY_NAME}</span>
    <span style={{flex:1}}/>
    <span style={{fontSize:24,fontWeight:700,fontFamily:MONO,color:COLORS.textPrimary}}>{fmt.price(DATA_HERO.price)}</span>
    <span style={{fontSize:14,fontWeight:600,fontFamily:MONO,padding:'2px 10px',borderRadius:8,backgroundColor:DATA_HERO.change>=0?COLORS.positiveBg:COLORS.negativeBg,color:DATA_HERO.change>=0?COLORS.positive:COLORS.negative}}>{fmt.pct(DATA_HERO.changePct)}</span>
    <span style={{fontSize:11,color:COLORS.textMuted}}>As of {AS_OF_DATE}</span>
  </div>
);

const MetricStrip = () => (
  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:10,marginBottom:16}}>
    {DATA_KEY_METRICS.map((m,i)=>(
      <div key={i} style={{padding:'10px 14px',borderRadius:8,border:'1px solid '+COLORS.border,backgroundColor:COLORS.cardBg}}>
        <div style={{fontSize:10,fontWeight:600,color:COLORS.textMuted,textTransform:'uppercase',letterSpacing:0.5}}>{m.label}</div>
        <div style={{fontSize:16,fontWeight:700,fontFamily:MONO,color:COLORS.textPrimary,marginTop:2}}>{m.value}</div>
      </div>
    ))}
  </div>
);

const PerformanceToggle = () => {
  const [active,setActive] = useState('YTD');
  const p = DATA_PERFORMANCE.find(d=>d.period===active)||DATA_PERFORMANCE[0];
  return (
    <Card>
      <div style={{display:'flex',gap:6,marginBottom:10,flexWrap:'wrap'}}>
        {DATA_PERFORMANCE.map(d=>(
          <button key={d.period} onClick={()=>setActive(d.period)} style={{padding:'4px 12px',borderRadius:12,fontSize:11,fontWeight:600,cursor:'pointer',border:'1.5px solid '+(active===d.period?COLORS.accent:COLORS.border),backgroundColor:active===d.period?COLORS.accentBg:'transparent',color:active===d.period?COLORS.accent:COLORS.textMuted}}>{d.period}</button>
        ))}
      </div>
      <div style={{display:'flex',gap:24}}>
        {[{label:TICKER,val:p.stockReturn},{label:'S&P 500',val:p.benchReturn},{label:'Delta',val:p.delta}].map((x,i)=>(
          <div key={i}><div style={{fontSize:10,color:COLORS.textMuted,textTransform:'uppercase'}}>{x.label}</div><div style={{fontSize:18,fontWeight:700,fontFamily:MONO,color:x.val>=0?COLORS.positive:COLORS.negative}}>{fmt.pct(x.val)}</div></div>
        ))}
      </div>
    </Card>
  );
};

const PriceVolumeChart = () => {
  const cd = useMemo(()=>downsample(DATA_PRICE_HISTORY,250),[]);
  return (
    <Card>
      <SectionLabel>Price & Volume</SectionLabel>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={cd} margin={{top:5,right:10,left:10,bottom:0}}>
          <defs><linearGradient id="prGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={COLORS.accent} stopOpacity={0.15}/><stop offset="95%" stopColor={COLORS.accent} stopOpacity={0.02}/></linearGradient></defs>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.borderLight}/>
          <YAxis domain={['auto','auto']} tickFormatter={v=>fmt.price(v)} tick={{fontSize:10,fill:COLORS.textMuted}} width={65}/>
          <Tooltip formatter={v=>[fmt.price(v),'Close']}/>
          <Area type="monotone" dataKey="close" stroke={COLORS.accent} strokeWidth={1.5} fill="url(#prGrad)" dot={false}/>
        </AreaChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="100%" height={90}>
        <BarChart data={cd} margin={{top:0,right:10,left:10,bottom:0}}>
          <XAxis dataKey="date" tick={{fontSize:9,fill:COLORS.textMuted}} tickLine={false} interval={Math.floor(cd.length/6)}/>
          <YAxis tickFormatter={v=>fmt.vol(v)} tick={{fontSize:9,fill:COLORS.textMuted}} width={65}/>
          <Tooltip formatter={v=>[fmt.vol(v),'Volume']}/>
          <Bar dataKey="volume" fill={COLORS.accent} fillOpacity={0.35} radius={[1,1,0,0]}/>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

const CompanyPrimer = () => (
  <Card>
    <SectionLabel>Company Overview</SectionLabel>
    {DATA_COMPANY.industryPrimer && <div style={{fontSize:13,lineHeight:1.6,color:COLORS.accent,padding:'8px 12px',borderRadius:6,backgroundColor:COLORS.accentBg,marginBottom:8,borderLeft:'3px solid '+COLORS.accent}}>{DATA_COMPANY.industryPrimer}</div>}
    <div style={{fontSize:13,lineHeight:1.7,color:COLORS.textBody}}>{DATA_COMPANY.description}</div>
  </Card>
);

const RevenueDonutChart = () => {
  const [idx,setIdx] = useState(null);
  const s = DATA_COMPANY.revenueStreams;
  if (!s||!s.length) return null;
  const a = idx!=null?s[idx]:null;
  return (
    <Card>
      <SectionLabel>Revenue Streams</SectionLabel>
      <div style={{display:'flex',gap:16,flexWrap:'wrap',alignItems:'flex-start'}}>
        <div style={{width:180,height:180,flexShrink:0}}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart><Pie data={s} dataKey="pct" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75} onClick={(_,i)=>setIdx(idx===i?null:i)} style={{cursor:'pointer'}}>{s.map((_,i)=><Cell key={i} fill={DONUT_COLORS[i%DONUT_COLORS.length]} stroke={idx===i?'#1A202C':'#fff'} strokeWidth={idx===i?2:1}/>)}</Pie><Tooltip formatter={v=>v+'%'}/></PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{flex:1,minWidth:200}}>
          <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:10}}>
            {s.map((seg,i)=><button key={i} onClick={()=>setIdx(idx===i?null:i)} style={{padding:'3px 10px',borderRadius:10,fontSize:11,fontWeight:600,cursor:'pointer',border:'1.5px solid '+(idx===i?DONUT_COLORS[i%DONUT_COLORS.length]:COLORS.border),backgroundColor:idx===i?DONUT_COLORS[i%DONUT_COLORS.length]+'15':'transparent',color:idx===i?DONUT_COLORS[i%DONUT_COLORS.length]:COLORS.textMuted}}>{seg.name} ({seg.pct}%)</button>)}
          </div>
          {a && <div style={{padding:12,borderRadius:6,backgroundColor:COLORS.pageBg,border:'1px solid '+COLORS.borderLight}}>
            <div style={{fontSize:13,fontWeight:600,color:COLORS.textPrimary,marginBottom:4}}>{a.name} — {a.pct}%</div>
            <div style={{fontSize:12,lineHeight:1.6,color:COLORS.textBody,marginBottom:6}}>{a.description}</div>
            <div style={{display:'flex',gap:12,fontSize:10}}>
              <span style={{padding:'2px 8px',borderRadius:8,backgroundColor:a.growth==='growing'?COLORS.positiveBg:COLORS.neutralBg,color:a.growth==='growing'?COLORS.positive:COLORS.neutral,fontWeight:600}}>{a.growth}</span>
              <span style={{padding:'2px 8px',borderRadius:8,backgroundColor:COLORS.neutralBg,color:COLORS.textBody,fontWeight:600}}>{a.margin} margin</span>
            </div>
          </div>}
        </div>
      </div>
    </Card>
  );
};

const RegionalDonutChart = () => {
  const r = DATA_COMPANY.regionalOps;
  if (!r||!r.length) return null;
  return (
    <Card>
      <SectionLabel>Geographic Revenue</SectionLabel>
      <div style={{display:'flex',gap:16,flexWrap:'wrap',alignItems:'center'}}>
        <div style={{width:160,height:160,flexShrink:0}}>
          <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={r} dataKey="pct" nameKey="region" cx="50%" cy="50%" innerRadius={40} outerRadius={68}>{r.map((_,i)=><Cell key={i} fill={GEO_COLORS[i%GEO_COLORS.length]}/>)}</Pie><Tooltip formatter={v=>v+'%'}/></PieChart></ResponsiveContainer>
        </div>
        <div style={{flex:1}}>
          {r.map((reg,i)=><div key={i} style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}><div style={{width:10,height:10,borderRadius:2,backgroundColor:GEO_COLORS[i%GEO_COLORS.length],flexShrink:0}}/><span style={{fontSize:12,color:COLORS.textBody,flex:1}}>{reg.region}</span><span style={{fontSize:12,fontWeight:600,fontFamily:MONO,color:COLORS.textPrimary}}>{reg.pct}%</span></div>)}
          {DATA_COMPANY.geoConcentrationNote && <div style={{fontSize:10,color:COLORS.textMuted,marginTop:6,fontStyle:'italic'}}>{DATA_COMPANY.geoConcentrationNote}</div>}
        </div>
      </div>
    </Card>
  );
};

const ValueChainDiagram = () => {
  const [ac,setAc]=useState(0);const [ex,setEx]=useState(null);const [hov,setHov]=useState(null);
  const chains=DATA_VALUE_CHAIN; if(!chains||!chains.length)return null;
  const ch=chains[ac]; if(!ch||!ch.stages)return null;
  return (
    <Card>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:4,flexWrap:'wrap'}}>
        <SectionLabel>Industry Value Chain</SectionLabel>
        {chains.length>1&&chains.map((c,i)=><button key={i} onClick={()=>{setAc(i);setEx(null);}} style={{padding:'3px 10px',borderRadius:10,fontSize:10,fontWeight:600,cursor:'pointer',border:'1.5px solid '+(ac===i?COLORS.accent:COLORS.border),backgroundColor:ac===i?COLORS.accentBg:'transparent',color:ac===i?COLORS.accent:COLORS.textMuted}}>{c.chainName}</button>)}
      </div>
      <div style={{fontSize:10,color:'#9CA3AF',marginBottom:10}}>Click any stage for details</div>
      <div style={{display:'flex',alignItems:'center',flexWrap:'wrap',gap:0,padding:'6px 0',overflowX:'auto'}}>
        {ch.stages.map((s,i)=>{const isH=!!s.companyHere;const isE=ex===i;const isV=hov===i;return(
          <div key={i} style={{display:'flex',alignItems:'center',flexShrink:0}}>
            <div onClick={()=>setEx(isE?null:i)} onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}
              style={{padding:'10px 16px',borderRadius:8,minWidth:100,maxWidth:170,textAlign:'center',cursor:'pointer',backgroundColor:isH?(isV?'#DBEAFE':'#EFF6FF'):(isV?'#F3F4F6':'#F9FAFB'),border:'2px solid '+(isE?'#1D4ED8':isH?'#2563EB':isV?'#D1D5DB':'#E5E7EB'),boxShadow:isV||isE?'0 2px 8px rgba(0,0,0,0.1)':isH?'0 0 0 3px rgba(37,99,235,0.12)':'none',transition:'all 0.15s',position:'relative'}}>
              <div style={{fontSize:12,fontWeight:600,lineHeight:1.3,color:isH?'#2563EB':'#1A1A2E'}}>{s.name}</div>
              {s.desc&&<div style={{fontSize:10,color:'#6B7280',marginTop:3,lineHeight:1.3}}>{s.desc}</div>}
              {isH&&s.companyRole&&<div style={{fontSize:9,fontWeight:700,color:'#2563EB',marginTop:5,padding:'2px 8px',borderRadius:8,display:'inline-block',backgroundColor:'rgba(37,99,235,0.1)'}}>★ {s.companyRole}</div>}
              <div style={{position:'absolute',top:4,right:6,fontSize:10,color:isH?'#93C5FD':'#D1D5DB',lineHeight:1}}>ⓘ</div>
            </div>
            {i<ch.stages.length-1&&<div style={{padding:'0 6px',fontSize:20,color:'#9CA3AF',lineHeight:1,flexShrink:0,userSelect:'none'}}>→</div>}
          </div>
        );})}
      </div>
      {ex!=null&&ch.stages[ex]&&(()=>{const s=ch.stages[ex];const isC=!!s.companyHere;return(
        <div style={{marginTop:10,padding:'14px 16px',borderRadius:8,backgroundColor:isC?'#F0F7FF':'#F9FAFB',border:'1px solid '+(isC?'#BFDBFE':'#E5E7EB')}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
            <span style={{fontSize:13,fontWeight:700,color:isC?'#2563EB':'#1A1A2E'}}>{s.name}</span>
            {isC&&<span style={{fontSize:9,fontWeight:700,color:'#2563EB',padding:'2px 8px',borderRadius:8,backgroundColor:'rgba(37,99,235,0.1)'}}>★ Company</span>}
            <span style={{flex:1}}/><button onClick={()=>setEx(null)} style={{background:'none',border:'1px solid #E5E7EB',borderRadius:4,padding:'2px 8px',fontSize:10,color:'#6B7280',cursor:'pointer'}}>✕</button>
          </div>
          {s.explanation&&<div style={{fontSize:13,lineHeight:1.7,color:'#374151',marginBottom:10}}>{s.explanation}</div>}
          {isC&&s.companyRole&&<div style={{fontSize:12,lineHeight:1.6,color:'#2563EB',padding:'8px 12px',borderRadius:6,marginBottom:10,backgroundColor:'rgba(37,99,235,0.06)',borderLeft:'3px solid #2563EB'}}><span style={{fontWeight:600}}>Role:</span> {s.companyRole}</div>}
          {s.keyPlayers&&s.keyPlayers.length>0&&<div style={{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap'}}><span style={{fontSize:10,fontWeight:600,color:'#6B7280',textTransform:'uppercase'}}>Key players:</span>{s.keyPlayers.map((p,pi)=><span key={pi} style={{fontSize:10,padding:'2px 8px',borderRadius:8,backgroundColor:'#F3F4F6',color:'#374151',fontWeight:500}}>{p}</span>)}</div>}
        </div>
      );})()}
      {(ch.upstreamNote||ch.downstreamNote)&&<div style={{display:'flex',justifyContent:'space-between',gap:16,marginTop:10,fontSize:11,color:'#6B7280',flexWrap:'wrap'}}>{ch.upstreamNote&&<span>← {ch.upstreamNote}</span>}<span style={{flex:1}}/>{ch.downstreamNote&&<span>{ch.downstreamNote} →</span>}</div>}
      {ch.adjacentCompetitors&&ch.adjacentCompetitors.length>0&&<div style={{marginTop:8,fontSize:11,color:'#6B7280'}}><span style={{fontWeight:600}}>Competitors:</span> {ch.adjacentCompetitors.join(', ')}</div>}
    </Card>
  );
};

const ThreatsOpportunities = () => {
  const ms=(m)=>({very_high:{bg:'#FEF2F2',text:'#DC2626'},high:{bg:'#FFFBEB',text:'#D97706'},moderate:{bg:COLORS.neutralBg,text:COLORS.textBody},low:{bg:COLORS.pageBg,text:COLORS.textMuted}}[m]||{bg:COLORS.neutralBg,text:COLORS.textBody});
  const si=(s)=>s==='tailwind'?{sym:'↗',col:COLORS.positive}:s==='headwind'?{sym:'↘',col:COLORS.negative}:{sym:'→',col:COLORS.textMuted};
  const ri=(item)=>{const m=ms(item.magnitude);const s=si(item.currentStatus);return(
    <div style={{padding:'10px 0',borderBottom:'1px solid '+COLORS.borderLight}}>
      <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:4}}><span style={{fontSize:13,fontWeight:600,color:COLORS.textPrimary,flex:1}}>{item.factor}</span><span style={{fontSize:10,fontWeight:600,padding:'1px 7px',borderRadius:8,backgroundColor:m.bg,color:m.text}}>{item.magnitude}</span></div>
      <div style={{fontSize:12,lineHeight:1.5,color:COLORS.textBody,marginBottom:4}}>{item.description}</div>
      <div style={{display:'flex',gap:8,fontSize:10,color:COLORS.textMuted}}><span>Affects: {item.affectsWhat}</span><span style={{color:s.col,fontWeight:600}}>{s.sym} {item.currentStatus}</span></div>
    </div>
  );};
  return (
    <Card style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
      <div><div style={{fontSize:11,fontWeight:700,color:COLORS.negative,textTransform:'uppercase',letterSpacing:1,marginBottom:6}}>Threats</div>{DATA_THREATS.map((t,i)=><div key={i}>{ri(t)}</div>)}</div>
      <div><div style={{fontSize:11,fontWeight:700,color:COLORS.positive,textTransform:'uppercase',letterSpacing:1,marginBottom:6}}>Opportunities</div>{DATA_OPPORTUNITIES.map((o,i)=><div key={i}>{ri(o)}</div>)}</div>
    </Card>
  );
};

const KeyDriverCards = () => (
  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:10,marginBottom:16}}>
    {DATA_KEY_DRIVERS.map((d,i)=><Card key={i} style={{marginBottom:0}}><div style={{fontSize:13,fontWeight:600,color:COLORS.textPrimary,marginBottom:4}}>{d.driver}</div><div style={{fontSize:12,lineHeight:1.5,color:COLORS.textBody}}>{d.description}</div></Card>)}
  </div>
);

const OverviewPage = () => (<div><MetricStrip/><PerformanceToggle/><PriceVolumeChart/><CompanyPrimer/><RevenueDonutChart/><RegionalDonutChart/><ValueChainDiagram/><ThreatsOpportunities/><KeyDriverCards/></div>);

{/* ─── Page 2: Analysis ─── */}

const DrawdownChart = () => {
  const dd = useMemo(()=>downsample(DATA_DRAWDOWN.series,250),[]);
  return (
    <Card>
      <SectionLabel>Drawdown Analysis</SectionLabel>
      <div style={{display:'flex',gap:16,marginBottom:12,flexWrap:'wrap'}}>
        <div><div style={{fontSize:10,color:COLORS.textMuted,textTransform:'uppercase'}}>Max Drawdown</div><div style={{fontSize:22,fontWeight:700,fontFamily:MONO,color:COLORS.negative}}>{fmt.pct(DATA_DRAWDOWN.maxDrawdown)}</div></div>
        <div><div style={{fontSize:10,color:COLORS.textMuted,textTransform:'uppercase'}}>Peak</div><div style={{fontSize:13,fontFamily:MONO}}>{DATA_DRAWDOWN.peakDate}</div></div>
        <div><div style={{fontSize:10,color:COLORS.textMuted,textTransform:'uppercase'}}>Trough</div><div style={{fontSize:13,fontFamily:MONO}}>{DATA_DRAWDOWN.troughDate}</div></div>
        <div><div style={{fontSize:10,color:COLORS.textMuted,textTransform:'uppercase'}}>Recovery</div><div style={{fontSize:13,fontFamily:MONO}}>{DATA_DRAWDOWN.recoveryDate||'—'}</div></div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={dd} margin={{top:5,right:10,left:10,bottom:0}}>
          <defs><linearGradient id="ddGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={COLORS.negative} stopOpacity={0.2}/><stop offset="95%" stopColor={COLORS.negative} stopOpacity={0.02}/></linearGradient></defs>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.borderLight}/>
          <XAxis dataKey="date" tick={{fontSize:9,fill:COLORS.textMuted}} tickLine={false} interval={Math.floor(dd.length/6)}/>
          <YAxis domain={['auto',0]} tickFormatter={v=>fmt.pct(v)} tick={{fontSize:10,fill:COLORS.textMuted}} width={55} reversed/>
          <Tooltip formatter={v=>[fmt.pct(v),'Drawdown']}/>
          <ReferenceLine y={DATA_DRAWDOWN.maxDrawdown} stroke={COLORS.negative} strokeDasharray="5 5" label={{value:'Max: '+fmt.pct(DATA_DRAWDOWN.maxDrawdown),fill:COLORS.negative,fontSize:10,position:'right'}}/>
          <Area type="monotone" dataKey="drawdown" stroke={COLORS.negative} strokeWidth={1.5} fill="url(#ddGrad)" dot={false}/>
        </AreaChart>
      </ResponsiveContainer>
      {DATA_DRAWDOWN.significantPeriods.length>0&&(
        <div style={{marginTop:12}}>
          <div style={{fontSize:11,fontWeight:600,color:COLORS.textMuted,marginBottom:6}}>Significant Drawdown Periods</div>
          <table style={{width:'100%',fontSize:11,borderCollapse:'collapse'}}>
            <thead><tr style={{borderBottom:'2px solid '+COLORS.border}}>{['#','Peak','Trough','Depth','Days Down','Recovery','Days'].map(h=><th key={h} style={{padding:'4px 8px',textAlign:'left',color:COLORS.textMuted,fontWeight:600}}>{h}</th>)}</tr></thead>
            <tbody>{DATA_DRAWDOWN.significantPeriods.map(p=><tr key={p.rank} style={{borderBottom:'1px solid '+COLORS.borderLight}}>
              <td style={{padding:'4px 8px'}}>{p.rank}</td><td style={{padding:'4px 8px',fontFamily:MONO}}>{p.peakDate}</td><td style={{padding:'4px 8px',fontFamily:MONO}}>{p.troughDate}</td>
              <td style={{padding:'4px 8px',fontFamily:MONO,color:COLORS.negative}}>{fmt.pct(p.depth)}</td><td style={{padding:'4px 8px',fontFamily:MONO}}>{p.daysDown}</td>
              <td style={{padding:'4px 8px',fontFamily:MONO}}>{p.recoveryDate||'—'}</td><td style={{padding:'4px 8px',fontFamily:MONO}}>{p.daysRecover||'—'}</td>
            </tr>)}</tbody>
          </table>
        </div>
      )}
      <div style={{marginTop:10,fontSize:12,lineHeight:1.6,color:COLORS.textBody}}>{DATA_DRAWDOWN.riskSummary}</div>
    </Card>
  );
};

const MomentumCard = () => (
  <Card>
    <SectionLabel>Momentum & Trend</SectionLabel>
    <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
      <span style={{fontSize:14,fontWeight:700,padding:'4px 14px',borderRadius:12,backgroundColor:DATA_MOMENTUM.score.color+'18',color:DATA_MOMENTUM.score.color}}>{DATA_MOMENTUM.score.label}</span>
      <span style={{fontSize:12,color:COLORS.textBody}}>{DATA_MOMENTUM.score.justification}</span>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))',gap:10}}>
      {[{l:'50-Day SMA',v:fmt.price(DATA_MOMENTUM.sma50),sub:fmt.pct(DATA_MOMENTUM.priceVs50)+' vs price'},{l:'200-Day SMA',v:fmt.price(DATA_MOMENTUM.sma200),sub:fmt.pct(DATA_MOMENTUM.priceVs200)+' vs price'},...DATA_MOMENTUM.returns.map(r=>({l:r.period+' Return',v:fmt.pct(r.value),sub:null}))].map((m,i)=>(
        <div key={i} style={{padding:8,borderRadius:6,backgroundColor:COLORS.pageBg}}>
          <div style={{fontSize:10,color:COLORS.textMuted,textTransform:'uppercase'}}>{m.l}</div>
          <div style={{fontSize:14,fontWeight:700,fontFamily:MONO,color:COLORS.textPrimary}}>{m.v}</div>
          {m.sub&&<div style={{fontSize:10,color:COLORS.textMuted}}>{m.sub}</div>}
        </div>
      ))}
    </div>
    {DATA_MOMENTUM.crossover&&<div style={{marginTop:8,fontSize:11,padding:'4px 10px',borderRadius:6,backgroundColor:COLORS.cautionBg,color:COLORS.caution,display:'inline-block'}}>{DATA_MOMENTUM.crossover.type} on {DATA_MOMENTUM.crossover.date}</div>}
  </Card>
);

const FundamentalsSection = () => {
  const [openSec,setOpenSec]=useState(null);const [openMetric,setOpenMetric]=useState(null);
  return (
    <Card>
      <SectionLabel>Fundamental Analysis</SectionLabel>
      {DATA_FUNDAMENTALS.map((sec,si)=>{const ss=STATUS_STYLES[sec.sectionStatus]||STATUS_STYLES.reasonable;const isOpen=openSec===si;return(
        <div key={si} style={{marginBottom:12}}>
          <div onClick={()=>setOpenSec(isOpen?null:si)} style={{display:'flex',alignItems:'center',gap:8,padding:'8px 12px',borderRadius:6,backgroundColor:COLORS.pageBg,cursor:'pointer',border:'1px solid '+COLORS.borderLight}}>
            <span style={{width:4,height:20,borderRadius:2,backgroundColor:ss.border,flexShrink:0}}/>
            <span style={{fontSize:13,fontWeight:600,color:COLORS.textPrimary,flex:1}}>{sec.section}</span>
            <span style={{fontSize:10,padding:'2px 8px',borderRadius:8,backgroundColor:ss.bg,color:ss.text,fontWeight:600}}>{ss.label}</span>
            <span style={{fontSize:12,color:COLORS.textMuted}}>{isOpen?'▾':'▸'}</span>
          </div>
          {isOpen&&<div style={{padding:'10px 12px',fontSize:12,lineHeight:1.6,color:COLORS.textBody,borderLeft:'3px solid '+ss.border,marginLeft:6,marginTop:4}}>{sec.synthesis}</div>}
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:8,marginTop:8}}>
            {sec.metrics.map((m,mi)=>{const ms=STATUS_STYLES[m.status]||STATUS_STYLES.reasonable;const isExpanded=openMetric===si+'-'+mi;const displayVal=typeof m.current==='number'&&m.current>1e6?fmt.bigNum(m.current):fmt.num(m.current);return(
              <div key={mi}>
                <div onClick={()=>setOpenMetric(isExpanded?null:si+'-'+mi)} style={{padding:'8px 12px',borderRadius:6,border:'1px solid '+COLORS.borderLight,borderLeft:'4px solid '+ms.border,backgroundColor:ms.bg+'33',cursor:'pointer',transition:'all 0.15s'}}>
                  <div style={{fontSize:10,fontWeight:600,color:COLORS.textMuted,textTransform:'uppercase'}}>{m.metric}</div>
                  <div style={{fontSize:16,fontWeight:700,fontFamily:MONO,color:COLORS.textPrimary}}>{displayVal}</div>
                </div>
                {isExpanded&&(
                  <div style={{padding:12,marginTop:4,borderRadius:6,backgroundColor:COLORS.pageBg,border:'1px solid '+COLORS.borderLight,fontSize:12}}>
                    <div style={{display:'flex',gap:16,marginBottom:8,flexWrap:'wrap'}}>
                      <div><div style={{fontSize:10,color:COLORS.textMuted}}>Current</div><div style={{fontFamily:MONO,fontWeight:600}}>{displayVal}</div></div>
                      <div><div style={{fontSize:10,color:COLORS.textMuted}}>Strong-Period Avg</div><div style={{fontFamily:MONO}}>{typeof m.historicalStrongAvg==='number'&&m.historicalStrongAvg>1e6?fmt.bigNum(m.historicalStrongAvg):fmt.num(m.historicalStrongAvg)}</div></div>
                      <div><div style={{fontSize:10,color:COLORS.textMuted}}>Range</div><div style={{fontFamily:MONO}}>{fmt.num(m.historicalRange.low)} — {fmt.num(m.historicalRange.high)}</div></div>
                    </div>
                    <span style={{fontSize:10,padding:'2px 8px',borderRadius:8,backgroundColor:ms.bg,color:ms.text,fontWeight:600}}>{ms.label}</span>
                    <div style={{marginTop:8,lineHeight:1.6,color:COLORS.textBody}}>{m.explanation}</div>
                    <div style={{marginTop:4,fontStyle:'italic',color:COLORS.textMuted}}>{m.likelyCause}</div>
                    {m.sourceArticle&&m.sourceArticle.url&&<a href={m.sourceArticle.url} target="_blank" rel="noopener noreferrer" style={{display:'inline-block',marginTop:6,fontSize:11,color:COLORS.accent,textDecoration:'none'}}>📄 {m.sourceArticle.title} →</a>}
                    <button onClick={()=>setOpenMetric(null)} style={{display:'block',marginTop:8,background:'none',border:'1px solid '+COLORS.border,borderRadius:4,padding:'2px 8px',fontSize:10,color:COLORS.textMuted,cursor:'pointer'}}>✕ Close</button>
                  </div>
                )}
              </div>
            );})}
          </div>
        </div>
      );})}
    </Card>
  );
};

const AnalysisPage = () => (<div><DrawdownChart/><MomentumCard/><FundamentalsSection/></div>);

{/* ─── Page 3: MACD Strategy ─── */}

const CandleWithWicks = (props) => {
  const {x,y,width,height,payload} = props;
  if (!payload||x==null||y==null||!height) return null;
  const color = payload.isUp ? CANDLE_UP : CANDLE_DOWN;
  const cx = x+width/2;
  const bw = Math.max(4,Math.min(12,width*0.6));
  const cb = payload.candleBody||0.01;
  const px = height/cb;
  const bt = Math.max(payload.open,payload.close);
  const bb = Math.min(payload.open,payload.close);
  const wt = y-(payload.high-bt)*px;
  const wb = y+height+(bb-payload.low)*px;
  return (<g><line x1={cx} y1={wt} x2={cx} y2={wb} stroke={color} strokeWidth={1}/><rect x={cx-bw/2} y={y} width={bw} height={Math.max(1,height)} fill={color} stroke={color} strokeWidth={0.5} rx={1}/></g>);
};

const MACDStrategyPage = () => {
  const [selEvent,setSelEvent]=useState(null);
  const candleData = useMemo(()=>prepareCandleData(DATA_MONTHLY_OHLC),[]);
  const strat = DATA_MACD_STRATEGY;
  const regimeColors = {
    'Strong Bull':'#047857','Bull':'#059669','Neutral / Bull Under Pressure':'#D97706',
    'Neutral / Recovery Watch':'#D97706','Bear':'#DC2626','Strong Bear':'#991B1B',
  };
  const rc = regimeColors[strat.label]||COLORS.neutral;
  return (
    <div>
      <Card>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
          <SectionLabel>Monthly OHLC Candlestick</SectionLabel>
          <span style={{fontSize:10,color:COLORS.textMuted}}>MA(10) · MACD(12,26,9)</span>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={candleData} margin={{top:10,right:10,left:10,bottom:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.borderLight}/>
            <XAxis dataKey="date" tick={{fontSize:9,fill:COLORS.textMuted}} tickLine={false} interval={Math.floor(candleData.length/8)}/>
            <YAxis domain={['auto','auto']} tickFormatter={v=>fmt.price(v)} tick={{fontSize:10,fill:COLORS.textMuted}} width={65}/>
            <Tooltip formatter={(v,name)=>{if(name==='candleBase')return[null,null];if(name==='candleBody')return[null,null];if(name==='ma10')return[fmt.price(v),'MA(10)'];return[v,name];}} labelFormatter={l=>l}/>
            <Bar dataKey="candleBase" stackId="candle" fill="transparent" isAnimationActive={false}/>
            <Bar dataKey="candleBody" stackId="candle" shape={<CandleWithWicks/>} isAnimationActive={false}/>
            <Area type="monotone" dataKey="ma10" stroke="#6B9BD2" strokeWidth={2} dot={false} fill="none" connectNulls={true}/>
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      {DATA_CATALYST_EVENTS.length>0&&(
        <Card>
          <SectionLabel>Catalyst Events</SectionLabel>
          <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:selEvent!=null?12:0}}>
            {DATA_CATALYST_EVENTS.map((e,i)=>(
              <button key={e.id} onClick={()=>setSelEvent(selEvent===i?null:i)} style={{
                width:28,height:28,borderRadius:'50%',fontSize:10,fontWeight:600,cursor:'pointer',
                border:'2px solid '+(e.sentimentTag==='bullish'?CANDLE_UP:e.sentimentTag==='bearish'?CANDLE_DOWN:'#9CA3AF'),
                backgroundColor:selEvent===i?COLORS.accentBg:COLORS.cardBg,color:COLORS.accent,
                display:'flex',alignItems:'center',justifyContent:'center',
              }}>{i+1}</button>
            ))}
          </div>
          {selEvent!=null&&DATA_CATALYST_EVENTS[selEvent]&&(()=>{const e=DATA_CATALYST_EVENTS[selEvent];return(
            <div style={{padding:14,borderRadius:8,backgroundColor:COLORS.pageBg,border:'1px solid '+COLORS.borderLight}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6,flexWrap:'wrap'}}>
                <span style={{fontSize:13,fontWeight:700,color:COLORS.textPrimary,flex:1}}>{e.title}</span>
                <span style={{fontSize:10,padding:'2px 8px',borderRadius:8,backgroundColor:e.sentimentTag==='bullish'?COLORS.positiveBg:e.sentimentTag==='bearish'?COLORS.negativeBg:COLORS.neutralBg,color:e.sentimentTag==='bullish'?COLORS.positive:e.sentimentTag==='bearish'?COLORS.negative:COLORS.neutral,fontWeight:600}}>{e.sentimentTag}</span>
                <span style={{fontSize:10,padding:'2px 8px',borderRadius:8,backgroundColor:COLORS.accentBg,color:COLORS.accent,fontWeight:600}}>{e.category}</span>
                <button onClick={()=>setSelEvent(null)} style={{background:'none',border:'1px solid '+COLORS.border,borderRadius:4,padding:'2px 8px',fontSize:10,color:COLORS.textMuted,cursor:'pointer'}}>✕</button>
              </div>
              <div style={{fontSize:12,color:COLORS.textMuted,marginBottom:6}}>{e.date}</div>
              <div style={{fontSize:12,lineHeight:1.6,color:COLORS.textBody,marginBottom:6}}>{e.summary}</div>
              <div style={{fontSize:11,color:COLORS.textMuted,fontStyle:'italic',marginBottom:6}}>{e.priceReaction}</div>
              {e.regimeNote&&<div style={{fontSize:11,padding:'6px 10px',borderRadius:6,backgroundColor:COLORS.accentBg,color:COLORS.accent,borderLeft:'3px solid '+COLORS.accent}}>{e.regimeNote}</div>}
              {e.sources&&e.sources.map((src,si)=><a key={si} href={src.url} target="_blank" rel="noopener noreferrer" style={{display:'inline-block',marginTop:6,marginRight:8,fontSize:11,color:COLORS.accent,textDecoration:'none'}}>Read: {src.title} →</a>)}
            </div>
          );})()}
        </Card>
      )}

      <Card>
        <SectionLabel>MACD Histogram & Signal</SectionLabel>
        <ResponsiveContainer width="100%" height={160}>
          <ComposedChart data={candleData} margin={{top:5,right:10,left:10,bottom:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.borderLight}/>
            <XAxis dataKey="date" tick={{fontSize:9,fill:COLORS.textMuted}} tickLine={false} interval={Math.floor(candleData.length/8)}/>
            <YAxis tickFormatter={v=>Number(v).toFixed(2)} tick={{fontSize:10,fill:COLORS.textMuted}} width={50}/>
            <Tooltip formatter={(v,name)=>[v!=null?Number(v).toFixed(2):'—',name]}/>
            <ReferenceLine y={0} stroke={COLORS.border}/>
            <Bar dataKey="histogram" fill={COLORS.neutral} isAnimationActive={false}>
              {candleData.map((d,i)=><Cell key={i} fill={d.histogram!=null&&d.histogram>=0?'#5B9E8F':'#C4645A'}/>)}
            </Bar>
            <Area type="monotone" dataKey="macd" stroke={COLORS.accent} strokeWidth={2} dot={false} fill="none" connectNulls={true}/>
            <Area type="monotone" dataKey="signal" stroke="#D97706" strokeWidth={1.5} strokeDasharray="5 3" dot={false} fill="none" connectNulls={true}/>
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <SectionLabel>Strategy Status</SectionLabel>
        <div style={{display:'flex',alignItems:'flex-start',gap:16,flexWrap:'wrap'}}>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:18,fontWeight:800,padding:'12px 20px',borderRadius:12,backgroundColor:rc+'15',color:rc,border:'2px solid '+rc}}>{strat.label.toUpperCase()}</div>
            <div style={{fontSize:11,color:COLORS.textMuted,marginTop:4}}>{strat.trendStatus}</div>
            <div style={{fontSize:11,color:COLORS.textMuted}}>{strat.momentumStatus}</div>
          </div>
          <div style={{flex:1,minWidth:250}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
              <span style={{fontSize:11,fontWeight:600,color:COLORS.textMuted}}>Conviction</span>
              <div style={{flex:1,height:8,borderRadius:4,backgroundColor:COLORS.neutralBg}}>
                <div style={{width:strat.conviction+'%',height:'100%',borderRadius:4,backgroundColor:rc}}/>
              </div>
              <span style={{fontSize:13,fontWeight:700,fontFamily:MONO,color:rc}}>{strat.conviction}%</span>
              {strat.macdZScore!=null&&<span style={{fontSize:11,fontFamily:MONO,padding:'2px 8px',borderRadius:8,backgroundColor:strat.macdZScore>1?COLORS.positiveBg:strat.macdZScore<-1?COLORS.negativeBg:COLORS.neutralBg,color:strat.macdZScore>1?COLORS.positive:strat.macdZScore<-1?COLORS.negative:COLORS.neutral}}>Z: {strat.macdZScore>0?'+':''}{strat.macdZScore.toFixed(2)}</span>}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:8,marginBottom:10}}>
              <div style={{padding:6,borderRadius:4,backgroundColor:COLORS.pageBg,fontSize:11}}><span style={{color:COLORS.textMuted}}>Avg Mom (6M): </span><span style={{fontFamily:MONO,fontWeight:600}}>{strat.avgMomentum6m>0?'+':''}{fmt.num(strat.avgMomentum6m)}</span></div>
              <div style={{padding:6,borderRadius:4,backgroundColor:COLORS.pageBg,fontSize:11}}><span style={{color:COLORS.textMuted}}>Acceleration: </span><span style={{fontFamily:MONO,fontWeight:600}}>{strat.momentumAcceleration>0?'+':''}{fmt.num(strat.momentumAcceleration)}</span></div>
              <div style={{padding:6,borderRadius:4,backgroundColor:COLORS.pageBg,fontSize:11}}><span style={{color:COLORS.textMuted}}>Consistency: </span><span style={{fontFamily:MONO,fontWeight:600}}>{strat.signalConsistency.score}% {strat.signalConsistency.dominantSide} ({strat.signalConsistency.months})</span></div>
              {strat.projectedMACD&&<div style={{padding:6,borderRadius:4,backgroundColor:COLORS.pageBg,fontSize:11}}><span style={{color:COLORS.textMuted}}>Projected: </span><span style={{fontFamily:MONO,fontWeight:600}}>{fmt.num(strat.projectedMACD.expected)} [{fmt.num(strat.projectedMACD.ci95Low)}–{fmt.num(strat.projectedMACD.ci95High)}]</span></div>}
            </div>
            {strat.divergence&&<div style={{fontSize:11,marginBottom:6,color:strat.divergence.divergenceType==='none'?COLORS.textMuted:COLORS.caution}}>Divergence: {strat.divergence.description}</div>}
            <div style={{fontSize:13,lineHeight:1.7,color:COLORS.textBody,padding:'10px 14px',borderRadius:6,borderLeft:'3px solid '+rc,backgroundColor:COLORS.pageBg}}>{strat.explanation}</div>
            <div style={{fontSize:11,color:COLORS.textMuted,fontStyle:'italic',marginTop:6,padding:'6px 14px',borderLeft:'2px solid '+COLORS.borderLight}}>{strat.riskNote}</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

{/* ─── Page 4: Street Consensus ─── */}

const PriceTargetBoxPlot = () => {
  const c = DATA_CONSENSUS; const cur = DATA_HERO.price;
  const lo = c.lowTarget, hi = c.highTarget;
  const range = hi-lo||1;
  const pct = (v) => Math.max(0,Math.min(100,((v-lo)/range)*100));
  const labelPos = (v) => {const p=pct(v);return p<10?'left':p>90?'right':'center';};
  return (
    <Card>
      <SectionLabel>Price Target Range</SectionLabel>
      <div style={{position:'relative',margin:'30px 16px 50px',height:40}}>
        {/* Whisker line */}
        <div style={{position:'absolute',top:18,left:0,right:0,height:2,backgroundColor:COLORS.border}}/>
        {/* IQR box */}
        <div style={{position:'absolute',top:6,left:pct(c.q1Target)+'%',width:(pct(c.q3Target)-pct(c.q1Target))+'%',height:28,backgroundColor:COLORS.accentBg,border:'1.5px solid '+COLORS.accent,borderRadius:4}}/>
        {/* Median line */}
        <div style={{position:'absolute',top:4,left:pct(c.medianTarget)+'%',width:2,height:32,backgroundColor:COLORS.accent}}/>
        {/* Avg target diamond */}
        <div style={{position:'absolute',top:11,left:'calc('+pct(c.avgTarget)+'% - 7px)',width:14,height:14,backgroundColor:COLORS.accent,transform:'rotate(45deg)',borderRadius:2}}/>
        {/* Current price circle */}
        <div style={{position:'absolute',top:11,left:'calc('+pct(cur)+'% - 7px)',width:14,height:14,borderRadius:'50%',backgroundColor:'#1A202C',border:'2px solid #fff',boxShadow:'0 1px 3px rgba(0,0,0,0.3)'}}/>
        {/* Labels */}
        <div style={{position:'absolute',top:-22,left:0,fontSize:10,color:COLORS.textMuted}}>{c.lowFirm}: {fmt.price(lo)}</div>
        <div style={{position:'absolute',top:-22,right:0,fontSize:10,color:COLORS.textMuted,textAlign:'right'}}>{c.highFirm}: {fmt.price(hi)}</div>
        <div style={{position:'absolute',top:42,left:pct(cur)+'%',transform:'translateX(-50%)',fontSize:10,fontWeight:600,color:'#1A202C',textAlign:'center',whiteSpace:'nowrap'}}>Current: {fmt.price(cur)}</div>
        <div style={{position:'absolute',top:42,left:pct(c.avgTarget)+'%',transform:'translateX(-50%)',fontSize:10,fontWeight:600,color:COLORS.accent,textAlign:'center',whiteSpace:'nowrap'}}>Avg Target: {fmt.price(c.avgTarget)}</div>
      </div>
      <div style={{display:'flex',gap:16,justifyContent:'center',fontSize:10,color:COLORS.textMuted,marginTop:8}}>
        <span>◆ Avg Target</span><span>● Current Price</span><span style={{color:COLORS.accent}}>█ Q1–Q3 Range</span><span style={{color:COLORS.accent}}>│ Median</span>
      </div>
    </Card>
  );
};

const ConsensusPage = () => {
  const c = DATA_CONSENSUS;
  const [actPage,setActPage]=useState(0);
  const perPage=5; const actions=DATA_ANALYST_ACTIONS;
  const pageActions=actions.slice(actPage*perPage,(actPage+1)*perPage);
  const totalPages=Math.ceil(actions.length/perPage);
  const [expandedAction,setExpandedAction]=useState(null);
  const total=c.buyCount+c.holdCount+c.sellCount;
  const ratingColors={Buy:COLORS.positive,Hold:COLORS.caution,Sell:COLORS.negative};
  if(ASSET_TYPE==='ETF')return null;
  return (
    <div>
      <Card>
        <SectionLabel>Analyst Consensus</SectionLabel>
        <div style={{display:'flex',gap:16,alignItems:'center',flexWrap:'wrap',marginBottom:12}}>
          <span style={{fontSize:18,fontWeight:700,padding:'6px 18px',borderRadius:12,backgroundColor:(ratingColors[c.rating]||COLORS.neutral)+'18',color:ratingColors[c.rating]||COLORS.neutral}}>{c.rating}</span>
          <div style={{flex:1,minWidth:200}}>
            <div style={{display:'flex',borderRadius:6,overflow:'hidden',height:20}}>
              {c.buyCount>0&&<div style={{width:(c.buyCount/total*100)+'%',backgroundColor:COLORS.positive,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:'#fff',fontWeight:600}}>{c.buyCount} Buy</div>}
              {c.holdCount>0&&<div style={{width:(c.holdCount/total*100)+'%',backgroundColor:COLORS.caution,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:'#fff',fontWeight:600}}>{c.holdCount} Hold</div>}
              {c.sellCount>0&&<div style={{width:(c.sellCount/total*100)+'%',backgroundColor:COLORS.negative,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:'#fff',fontWeight:600}}>{c.sellCount} Sell</div>}
            </div>
            <div style={{fontSize:10,color:COLORS.textMuted,marginTop:4}}>{c.analystCount} analysts</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:10,color:COLORS.textMuted}}>Avg Target</div>
            <div style={{fontSize:18,fontWeight:700,fontFamily:MONO,color:COLORS.textPrimary}}>{fmt.price(c.avgTarget)}</div>
            <div style={{fontSize:12,fontFamily:MONO,color:c.impliedUpside>=0?COLORS.positive:COLORS.negative}}>{fmt.pct(c.impliedUpside)} upside</div>
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:10}}>
          {[{l:'Consensus EPS (FY1)',v:fmt.price(c.consensusEpsFy1)},{l:'Forward P/E',v:fmt.num(c.forwardPE)},{l:'Consensus Rev (FY1)',v:fmt.bigNum(c.consensusRevFy1)},{l:'Earnings Surprise',v:c.earningsSurprise?fmt.pct(c.earningsSurprise.surprisePct):'—'}].map((m,i)=>(
            <div key={i} style={{padding:8,borderRadius:6,backgroundColor:COLORS.pageBg}}><div style={{fontSize:10,color:COLORS.textMuted,textTransform:'uppercase'}}>{m.l}</div><div style={{fontSize:14,fontWeight:700,fontFamily:MONO}}>{m.v}</div></div>
          ))}
        </div>
      </Card>

      <PriceTargetBoxPlot/>

      {c.fairValue&&c.fairValue.estimate&&(
        <Card>
          <SectionLabel>Fair Value Assessment</SectionLabel>
          <div style={{display:'flex',gap:16,alignItems:'center',flexWrap:'wrap'}}>
            <div><div style={{fontSize:10,color:COLORS.textMuted}}>Fair Value</div><div style={{fontSize:18,fontWeight:700,fontFamily:MONO}}>{fmt.price(c.fairValue.estimate)}</div><div style={{fontSize:10,color:COLORS.textMuted}}>{c.fairValue.source}</div></div>
            {c.fairValue.starRating&&<div style={{fontSize:16}}>{'★'.repeat(c.fairValue.starRating)}{'☆'.repeat(5-c.fairValue.starRating)}</div>}
            {c.fairValue.moatRating&&<span style={{fontSize:11,padding:'2px 10px',borderRadius:8,backgroundColor:COLORS.accentBg,color:COLORS.accent,fontWeight:600}}>{c.fairValue.moatRating} Moat</span>}
          </div>
        </Card>
      )}

      <Card>
        <SectionLabel>Street Thesis</SectionLabel>
        <div style={{fontSize:13,lineHeight:1.7,color:COLORS.textBody,padding:'10px 14px',borderRadius:6,borderLeft:'3px solid '+COLORS.accent,backgroundColor:COLORS.pageBg}}>{c.streetThesis}</div>
      </Card>

      <Card>
        <SectionLabel>Recent Analyst Actions ({actions.length})</SectionLabel>
        <table style={{width:'100%',fontSize:11,borderCollapse:'collapse'}}>
          <thead><tr style={{borderBottom:'2px solid '+COLORS.border}}>{['Date','Firm','Action','Target','Key Point'].map(h=><th key={h} style={{padding:'6px 8px',textAlign:'left',color:COLORS.textMuted,fontWeight:600}}>{h}</th>)}</tr></thead>
          <tbody>{pageActions.map((a,i)=>{const gi=actPage*perPage+i;return(
            <React.Fragment key={gi}>
              <tr onClick={()=>setExpandedAction(expandedAction===gi?null:gi)} style={{borderBottom:'1px solid '+COLORS.borderLight,cursor:'pointer',backgroundColor:expandedAction===gi?COLORS.pageBg:'transparent'}}>
                <td style={{padding:'6px 8px',fontFamily:MONO}}>{a.date}</td>
                <td style={{padding:'6px 8px',fontWeight:600}}>{a.firm}</td>
                <td style={{padding:'6px 8px'}}><span style={{padding:'1px 6px',borderRadius:6,fontSize:10,fontWeight:600,backgroundColor:a.action==='Upgrade'||a.action==='Initiate'?COLORS.positiveBg:a.action==='Downgrade'?COLORS.negativeBg:COLORS.neutralBg,color:a.action==='Upgrade'||a.action==='Initiate'?COLORS.positive:a.action==='Downgrade'?COLORS.negative:COLORS.neutral}}>{a.action}</span></td>
                <td style={{padding:'6px 8px',fontFamily:MONO}}>{a.priceTarget?fmt.price(a.priceTarget):'—'}</td>
                <td style={{padding:'6px 8px',color:COLORS.textBody,maxWidth:200,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{a.thesis}</td>
              </tr>
              {expandedAction===gi&&(
                <tr><td colSpan={5} style={{padding:'10px 16px',backgroundColor:COLORS.pageBg,borderBottom:'1px solid '+COLORS.borderLight}}>
                  <div style={{fontSize:12,lineHeight:1.6,color:COLORS.textBody,marginBottom:6}}>{a.thesis}</div>
                  {a.analyst&&<div style={{fontSize:11,color:COLORS.textMuted}}>Analyst: {a.analyst}</div>}
                  {a.url&&<a href={a.url} target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:COLORS.accent,textDecoration:'none'}}>View Source →</a>}
                </td></tr>
              )}
            </React.Fragment>
          );})}</tbody>
        </table>
        {totalPages>1&&<div style={{display:'flex',justifyContent:'center',gap:8,marginTop:10}}>
          <button onClick={()=>setActPage(Math.max(0,actPage-1))} disabled={actPage===0} style={{padding:'4px 10px',borderRadius:6,fontSize:11,border:'1px solid '+COLORS.border,backgroundColor:COLORS.cardBg,cursor:actPage===0?'default':'pointer',opacity:actPage===0?0.4:1}}>← Prev</button>
          <span style={{fontSize:11,color:COLORS.textMuted,lineHeight:'28px'}}>Page {actPage+1} of {totalPages}</span>
          <button onClick={()=>setActPage(Math.min(totalPages-1,actPage+1))} disabled={actPage>=totalPages-1} style={{padding:'4px 10px',borderRadius:6,fontSize:11,border:'1px solid '+COLORS.border,backgroundColor:COLORS.cardBg,cursor:actPage>=totalPages-1?'default':'pointer',opacity:actPage>=totalPages-1?0.4:1}}>Next →</button>
        </div>}
      </Card>
    </div>
  );
};

{/* ─── Page 5: News & Sentiment ─── */}

const SentimentPage = () => {
  const [artPage,setArtPage]=useState(0);const [expandedArt,setExpandedArt]=useState(null);const [kwFilter,setKwFilter]=useState(null);
  const perPage=5;
  const filtered = kwFilter ? DATA_NEWS_ARTICLES.filter(a=>a.extracted_keywords&&a.extracted_keywords.some(k=>k.word===kwFilter)) : DATA_NEWS_ARTICLES;
  const pageArts=filtered.slice(artPage*perPage,(artPage+1)*perPage);
  const totalPages=Math.ceil(filtered.length/perPage);
  const s = DATA_SENTIMENT; const dims = s.dimensions;
  const total = (s.distribution.positive||0)+(s.distribution.mixed||0)+(s.distribution.negative||0);
  const ratingColors={'Strongly Bullish':COLORS.positive,'Bullish':COLORS.positive,'Cautiously Bullish':'#059669','Mixed':COLORS.caution,'Cautiously Bearish':COLORS.negative,'Bearish':COLORS.negative,'Strongly Bearish':'#991B1B'};
  const rc2=ratingColors[s.rating]||COLORS.neutral;

  return (
    <div>
      <Card>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:12,flexWrap:'wrap'}}>
          <SectionLabel>Sentiment Overview</SectionLabel>
          <span style={{padding:'4px 14px',borderRadius:12,fontSize:13,fontWeight:700,backgroundColor:rc2+'18',color:rc2}}>{s.rating}</span>
          <span style={{flex:1}}/>
          <span style={{fontSize:11,color:COLORS.textMuted}}>{s.articleCount} articles · {s.sourceCount} sources · {s.tier1Pct}% Tier 1</span>
        </div>
        <div style={{display:'flex',borderRadius:6,overflow:'hidden',height:24,marginBottom:12}}>
          {s.distribution.positive>0&&<div style={{width:(s.distribution.positive/total*100)+'%',backgroundColor:COLORS.positive,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:'#fff',fontWeight:600}}>{Math.round(s.distribution.positive/total*100)}% Pos</div>}
          {s.distribution.mixed>0&&<div style={{width:(s.distribution.mixed/total*100)+'%',backgroundColor:'#FBBF24',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:'#78350F',fontWeight:600}}>{Math.round(s.distribution.mixed/total*100)}% Mix</div>}
          {s.distribution.negative>0&&<div style={{width:(s.distribution.negative/total*100)+'%',backgroundColor:COLORS.negative,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:'#fff',fontWeight:600}}>{Math.round(s.distribution.negative/total*100)}% Neg</div>}
        </div>
        <div style={{display:'flex',gap:12,alignItems:'flex-start',flexWrap:'wrap'}}>
          <div style={{minWidth:100}}><div style={{fontSize:10,fontWeight:600,color:COLORS.textMuted,textTransform:'uppercase',marginBottom:2}}>Confidence</div><div style={{fontSize:20,fontWeight:700,fontFamily:MONO,color:COLORS.textPrimary}}>{Math.round(s.confidence*100)}%</div></div>
          <div style={{flex:1,minWidth:200,fontSize:13,lineHeight:1.6,color:COLORS.textBody}}>{s.justification}</div>
        </div>
      </Card>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:16}}>
        {[{l:'Fundamental Impact',v:dims.fundamentalImpact.avg,min:-5,max:5,interp:dims.fundamentalImpact.interpretation,grad:'linear-gradient(to right,#DC2626,#6B7280 50%,#059669)'},{l:'Market Sentiment',v:dims.marketSentiment.avg,min:-5,max:5,interp:dims.marketSentiment.interpretation,grad:'linear-gradient(to right,#DC2626,#6B7280 50%,#059669)'},{l:'Urgency',v:dims.urgency.avg,min:1,max:5,interp:dims.urgency.interpretation,grad:'linear-gradient(to right,#93C5FD,#2563EB)'},{l:'Confidence',v:dims.confidence.avg,min:0,max:1,interp:dims.confidence.interpretation,grad:'linear-gradient(to right,#FCA5A5,#059669)'}].map((d,i)=>{
          const p=((d.v-d.min)/(d.max-d.min))*100;return(
          <Card key={i} style={{marginBottom:0}}>
            <div style={{fontSize:10,fontWeight:700,color:COLORS.textMuted,textTransform:'uppercase',letterSpacing:0.5,marginBottom:6}}>{d.l}</div>
            <div style={{fontSize:22,fontWeight:700,fontFamily:MONO,color:COLORS.textPrimary,marginBottom:8}}>{d.max===1?d.v.toFixed(2):d.v.toFixed(1)}</div>
            <div style={{position:'relative',height:8,borderRadius:4,background:d.grad,marginBottom:8}}><div style={{position:'absolute',top:-3,left:'calc('+Math.max(2,Math.min(98,p))+'% - 7px)',width:14,height:14,borderRadius:'50%',backgroundColor:'#1A202C',border:'2px solid #fff',boxShadow:'0 1px 3px rgba(0,0,0,0.3)'}}/></div>
            <div style={{fontSize:11,color:COLORS.textBody,lineHeight:1.4}}>{d.interp}</div>
          </Card>
        );})}
      </div>

      <Card>
        <SectionLabel>Sentiment Keywords</SectionLabel>
        <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
          {DATA_SENTIMENT_KEYWORDS.sort((a,b)=>b.count-a.count).map((kw,i)=>{
            const pc={positive:{bg:'#ECFDF5',text:'#059669',bdr:'#A7F3D0'},negative:{bg:'#FEF2F2',text:'#DC2626',bdr:'#FECACA'},neutral:{bg:'#F3F4F6',text:'#6B7280',bdr:'#D1D5DB'}}[kw.polarity]||{bg:'#F3F4F6',text:'#6B7280',bdr:'#D1D5DB'};
            const active=kwFilter===kw.word;
            return <button key={i} onClick={()=>{setKwFilter(active?null:kw.word);setArtPage(0);}} style={{display:'inline-flex',alignItems:'center',gap:5,padding:'4px 10px',borderRadius:12,fontSize:12,fontWeight:500,backgroundColor:active?pc.text:pc.bg,color:active?'#fff':pc.text,border:'1px solid '+(active?pc.text:pc.bdr),cursor:'pointer',transition:'all 0.15s'}}>{kw.word}<span style={{fontSize:10,fontWeight:700,padding:'1px 5px',borderRadius:8,backgroundColor:active?'rgba(255,255,255,0.2)':'rgba(0,0,0,0.06)'}}>{kw.count}</span></button>;
          })}
        </div>
        {kwFilter&&<div style={{marginTop:8,fontSize:11,color:COLORS.textMuted}}>Filtering by "{kwFilter}" — <button onClick={()=>{setKwFilter(null);setArtPage(0);}} style={{background:'none',border:'none',color:COLORS.accent,cursor:'pointer',fontSize:11}}>Clear filter</button></div>}
      </Card>

      <Card>
        <SectionLabel>Article Browser ({filtered.length} articles{kwFilter?' — filtered':''}) </SectionLabel>
        <table style={{width:'100%',fontSize:11,borderCollapse:'collapse'}}>
          <thead><tr style={{borderBottom:'2px solid '+COLORS.border}}>{['Date','Source','Title','Sentiment'].map(h=><th key={h} style={{padding:'6px 8px',textAlign:'left',color:COLORS.textMuted,fontWeight:600}}>{h}</th>)}</tr></thead>
          <tbody>{pageArts.map((a,i)=>{const gi=artPage*perPage+i;const sentColors={Positive:COLORS.positive,Negative:COLORS.negative,Mixed:COLORS.caution};return(
            <React.Fragment key={a.id}>
              <tr onClick={()=>setExpandedArt(expandedArt===gi?null:gi)} style={{borderBottom:'1px solid '+COLORS.borderLight,cursor:'pointer',backgroundColor:expandedArt===gi?COLORS.pageBg:'transparent'}}>
                <td style={{padding:'6px 8px',fontFamily:MONO,whiteSpace:'nowrap'}}>{a.date}</td>
                <td style={{padding:'6px 8px'}}>{a.source}</td>
                <td style={{padding:'6px 8px',color:COLORS.textPrimary,fontWeight:500,maxWidth:300,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{a.title}</td>
                <td style={{padding:'6px 8px'}}><span style={{padding:'1px 6px',borderRadius:6,fontSize:10,fontWeight:600,backgroundColor:(sentColors[a.sentiment_tag]||COLORS.neutral)+'18',color:sentColors[a.sentiment_tag]||COLORS.neutral}}>{a.sentiment_tag}</span></td>
              </tr>
              {expandedArt===gi&&(
                <tr><td colSpan={4} style={{padding:'10px 16px',backgroundColor:COLORS.pageBg,borderBottom:'1px solid '+COLORS.borderLight}}>
                  <div style={{fontSize:13,fontWeight:600,color:COLORS.textPrimary,marginBottom:4}}>{a.title}</div>
                  <div style={{fontSize:11,color:COLORS.textMuted,marginBottom:6}}>{a.source} · {a.author||'Staff'} · {a.date}</div>
                  <div style={{fontSize:12,lineHeight:1.6,color:COLORS.textBody,marginBottom:8}}>{a.summary}</div>
                  {a.extracted_keywords&&<div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:8}}>
                    {a.extracted_keywords.map((kw,ki)=>{const kc={positive:'#059669',negative:'#DC2626',neutral:'#6B7280'}[kw.polarity]||'#6B7280';return <span key={ki} style={{fontSize:10,padding:'2px 8px',borderRadius:8,backgroundColor:kc+'15',color:kc,fontWeight:500}}>{kw.word}</span>;})}
                  </div>}
                  {a.url?<a href={a.url} target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:COLORS.accent,textDecoration:'none'}}>Read Full Article →</a>:<span style={{fontSize:10,padding:'2px 8px',borderRadius:6,backgroundColor:COLORS.neutralBg,color:COLORS.neutral}}>Source: Data Provider</span>}
                </td></tr>
              )}
            </React.Fragment>
          );})}</tbody>
        </table>
        {totalPages>1&&<div style={{display:'flex',justifyContent:'center',gap:8,marginTop:10}}>
          <button onClick={()=>setArtPage(Math.max(0,artPage-1))} disabled={artPage===0} style={{padding:'4px 10px',borderRadius:6,fontSize:11,border:'1px solid '+COLORS.border,backgroundColor:COLORS.cardBg,cursor:artPage===0?'default':'pointer',opacity:artPage===0?0.4:1}}>← Prev</button>
          <span style={{fontSize:11,color:COLORS.textMuted,lineHeight:'28px'}}>Page {artPage+1} of {totalPages}</span>
          <button onClick={()=>setArtPage(Math.min(totalPages-1,artPage+1))} disabled={artPage>=totalPages-1} style={{padding:'4px 10px',borderRadius:6,fontSize:11,border:'1px solid '+COLORS.border,backgroundColor:COLORS.cardBg,cursor:artPage>=totalPages-1?'default':'pointer',opacity:artPage>=totalPages-1?0.4:1}}>Next →</button>
        </div>}
      </Card>
    </div>
  );
};

{/* ─── Page 6: Export & Citations ─── */}

const ExportPage = () => {
  const [expanded,setExpanded]=useState({});
  const toggle=(k)=>setExpanded(p=>({...p,[k]:!p[k]}));
  const TblWrap=({title,dataKey,headers,renderRow,data})=>{const show=expanded[dataKey];const rows=show?data:data.slice(0,10);return(
    <Card>
      <div onClick={()=>toggle(dataKey)} style={{display:'flex',alignItems:'center',cursor:'pointer'}}>
        <span style={{fontSize:13,fontWeight:600,color:COLORS.textPrimary,flex:1}}>{title} ({data.length} rows)</span>
        <span style={{fontSize:12,color:COLORS.textMuted}}>{show?'▾ Collapse':'▸ Expand'}</span>
      </div>
      {(show||data.length<=10)&&<table style={{width:'100%',fontSize:11,borderCollapse:'collapse',marginTop:8}}>
        <thead><tr style={{borderBottom:'2px solid '+COLORS.border}}>{headers.map(h=><th key={h} style={{padding:'4px 8px',textAlign:'left',color:COLORS.textMuted,fontWeight:600}}>{h}</th>)}</tr></thead>
        <tbody>{rows.map(renderRow)}</tbody>
      </table>}
      {!show&&data.length>10&&<div style={{marginTop:6,fontSize:11,color:COLORS.textMuted}}>Showing 10 of {data.length} — click to expand</div>}
    </Card>
  );};

  return (
    <div>
      <Card>
        <SectionLabel>Sources & Citations</SectionLabel>
        {DATA_CITATIONS.map((cat,ci)=>(
          <div key={ci} style={{marginBottom:12}}>
            <div style={{fontSize:12,fontWeight:600,color:COLORS.textPrimary,marginBottom:4}}>{cat.category}</div>
            {cat.items.map((item,ii)=>(
              <div key={ii} style={{fontSize:12,marginBottom:2}}>
                <span style={{color:COLORS.textMuted}}>[{ci+1}.{ii+1}] </span>
                <a href={item.url} target="_blank" rel="noopener noreferrer" style={{color:COLORS.accent,textDecoration:'none'}}>{item.title}</a>
              </div>
            ))}
          </div>
        ))}
      </Card>

      <TblWrap title="Key Metrics" dataKey="metrics" headers={DATA_KEY_METRICS.map(m=>m.label)} renderRow={(_,i)=><tr key={i} style={{borderBottom:'1px solid '+COLORS.borderLight}}>{DATA_KEY_METRICS.map(m=><td key={m.label} style={{padding:'4px 8px',fontFamily:MONO}}>{m.value}</td>)}</tr>} data={[DATA_KEY_METRICS]}/>

      {DATA_DRAWDOWN.significantPeriods.length>0&&<TblWrap title="Significant Drawdowns" dataKey="drawdowns" headers={['#','Peak','Trough','Depth','Recovery','Narrative']}
        renderRow={(p,i)=><tr key={i} style={{borderBottom:'1px solid '+COLORS.borderLight}}><td style={{padding:'4px 8px'}}>{p.rank}</td><td style={{padding:'4px 8px',fontFamily:MONO}}>{p.peakDate}</td><td style={{padding:'4px 8px',fontFamily:MONO}}>{p.troughDate}</td><td style={{padding:'4px 8px',fontFamily:MONO,color:COLORS.negative}}>{fmt.pct(p.depth)}</td><td style={{padding:'4px 8px',fontFamily:MONO}}>{p.recoveryDate||'—'}</td><td style={{padding:'4px 8px',fontSize:10}}>{p.narrative}</td></tr>}
        data={DATA_DRAWDOWN.significantPeriods}/>}

      {ASSET_TYPE==='Stock'&&DATA_ANALYST_ACTIONS.length>0&&<TblWrap title="Analyst Actions" dataKey="analysts" headers={['Date','Firm','Action','Target','Thesis']}
        renderRow={(a,i)=><tr key={i} style={{borderBottom:'1px solid '+COLORS.borderLight}}><td style={{padding:'4px 8px',fontFamily:MONO}}>{a.date}</td><td style={{padding:'4px 8px'}}>{a.firm}</td><td style={{padding:'4px 8px'}}>{a.action}</td><td style={{padding:'4px 8px',fontFamily:MONO}}>{a.priceTarget?fmt.price(a.priceTarget):'—'}</td><td style={{padding:'4px 8px',fontSize:10}}>{a.thesis}</td></tr>}
        data={DATA_ANALYST_ACTIONS}/>}

      <Card>
        <div style={{fontSize:11,color:COLORS.textMuted,lineHeight:1.6}}>
          <strong>Data Attribution:</strong> Financial data sourced via configured data provider. News from web search and data provider feeds. Analyst consensus from public sources and data provider APIs.
        </div>
        <div style={{fontSize:10,color:COLORS.textMuted,marginTop:8,padding:'8px 12px',borderRadius:6,backgroundColor:COLORS.pageBg,lineHeight:1.6}}>
          <strong>Disclaimer:</strong> This screening dashboard is for informational purposes only and does not constitute investment advice, a recommendation, or a solicitation to buy or sell any security. Past performance does not guarantee future results. Data may be delayed or inaccurate. Always conduct your own research and consult a qualified financial advisor before making investment decisions.
        </div>
      </Card>
    </div>
  );
};

{/* ─── Main Dashboard Shell ─── */}

const PAGES = [
  { label: 'Overview', component: OverviewPage },
  { label: 'Analysis', component: AnalysisPage },
  { label: 'MACD Strategy', component: MACDStrategyPage },
  ...(ASSET_TYPE !== 'ETF' ? [{ label: 'Street Consensus', component: ConsensusPage }] : []),
  { label: 'News & Sentiment', component: SentimentPage },
  { label: 'Export & Citations', component: ExportPage },
];

const InvestmentScreener = () => {
  const [tab, setTab] = useState(0);
  const ActivePage = PAGES[tab]?.component || OverviewPage;
  return (
    <div style={{width:'100%',maxWidth:1200,margin:'0 auto',padding:'24px 20px',backgroundColor:COLORS.pageBg,fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif",color:COLORS.textPrimary,lineHeight:1.5,minHeight:'100vh',boxSizing:'border-box',overflowX:'hidden'}}>
      <HeaderBar/>
      <div style={{display:'flex',gap:0,borderBottom:'2px solid '+COLORS.borderLight,marginBottom:20}}>
        {PAGES.map((p,i)=>(
          <button key={i} onClick={()=>setTab(i)} style={{padding:'8px 16px',fontSize:13,fontWeight:tab===i?600:400,color:tab===i?COLORS.accent:COLORS.textMuted,backgroundColor:'transparent',border:'none',borderBottom:tab===i?'2px solid '+COLORS.accent:'2px solid transparent',marginBottom:-2,cursor:'pointer',transition:'all 0.15s',whiteSpace:'nowrap'}}>{p.label}</button>
        ))}
      </div>
      <ActivePage/>
      <div style={{marginTop:24,padding:'12px 16px',borderRadius:8,backgroundColor:COLORS.cardBg,border:'1px solid '+COLORS.borderLight,fontSize:10,color:COLORS.textMuted,textAlign:'center'}}>
        {TICKER} Investment Screening Dashboard · Data as of {AS_OF_DATE} · For informational purposes only
      </div>
    </div>
  );
};

export default InvestmentScreener;
