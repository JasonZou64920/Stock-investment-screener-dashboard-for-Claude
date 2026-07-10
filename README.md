# Investment Screener — Claude Skill

An open-source [Claude Skill](https://docs.claude.com) that produces institutional-quality
stock and ETF screening dashboards as interactive React artifacts.

Built by [Jason Zou](https://github.com/jzou1).

## What It Does

Give it a ticker symbol, and it generates a complete, interactive dashboard with:

- **Overview** — price charts, performance vs S&P 500, revenue streams, geographic breakdown, full industry value chain, threats & opportunities
- **Analysis** — drawdown analysis, momentum scoring, 40+ fundamental metrics with drill-down comparisons to historical baselines
- **MACD Strategy** — monthly candlestick chart, MACD histogram with signal lines, catalyst event timeline, quantitative strategy assessment with Z-scores, confidence intervals, and divergence detection
- **Street Consensus** — analyst ratings, box-plot price target range, forward estimates, recent analyst actions table
- **News & Sentiment** — multi-dimensional sentiment analysis, interactive keyword cloud, paginated article browser
- **Export & Citations** — clickable source citations, expandable data tables

## Architecture

This skill uses a **fixed template + data population** design:

1. `references/dashboard-template.jsx` — A complete, self-contained React dashboard (~2800 lines). All rendering code is fixed and never modified.
2. `SKILL.md` — Instructions that tell Claude how to fetch data and inject it into the template's `DATA_*` constants.

This architecture eliminates rendering bugs — the template is tested once and reused.

## Data Sources

| Source | Setup Required | What It Provides |
|--------|---------------|------------------|
| **Yahoo Finance** (default) | None — uses `yfinance` in sandbox | Prices, fundamentals, basic analyst data |
| **LSEG Refinitiv** | MCP connector | Institutional-grade prices, IBES consensus, news |
| **Alpha Vantage** | API key | Prices, fundamentals |
| **Custom MCP** | MCP connector | Anything the MCP provides |

By default, no connectors or API keys are needed. Yahoo Finance data is fetched
via Python in Claude's sandbox.

## Installation

### One-Command Install

```bash
# Clone into your Claude skills directory
git clone https://github.com/jzou1/investment-screener.git ~/.claude/skills/investment-screener
```

That's it. The skill is immediately available in Claude.

### Manual Install

1. Download or clone this repository
2. Copy the entire folder to `~/.claude/skills/investment-screener`
3. The folder must contain `SKILL.md` and the `references/` directory

### Verify Installation

In Claude, type: `screen AAPL` — if the skill triggers, you're set.

## Usage

### Basic

```
screen AAPL
```

```
analyze MSFT
```

```
dashboard for SPY
```

### With a Specific Data Source

```
screen AAPL using Refinitiv
```

```
analyze NVDA with Alpha Vantage
```

### What You Get

A self-contained React artifact with 6 tabbed pages, all data inline, shareable
via Claude's conversation sharing.

## Configuration

The skill auto-detects available data connectors. To use a specific one:

- **LSEG Refinitiv**: Connect the LSEG MCP in your Claude connector settings
- **Alpha Vantage**: Provide your API key when prompted
- **Yahoo Finance**: No setup needed (default)

## File Structure

```
investment-screener/
├── SKILL.md                           # Skill instructions (data population)
├── LICENSE                            # MIT License
├── README.md                          # This file
├── DISCLAIMER.md                      # Investment disclaimer
└── references/
    └── dashboard-template.jsx         # Fixed React dashboard template
```

## Disclaimer

This tool is for **informational and educational purposes only**. It does not
constitute investment advice, a recommendation, or a solicitation to buy or sell
any security. See [DISCLAIMER.md](DISCLAIMER.md) for full details.

## License

MIT License — Copyright (c) 2026 Jason Zou. See [LICENSE](LICENSE).
