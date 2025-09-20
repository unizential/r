# Manus Engine - Council-Driven Roblox AI Studio

A native macOS application for AI-powered Roblox game development with multi-agent collaboration.

## Quick Start (5 minutes)

### Prerequisites
- macOS 14+ with Xcode 15+
- Python 3.11+
- Node.js 18+ (optional, for formatting)

### Bootstrap
```bash
git clone 
cd manus-engine
make bootstrap
make dev
```

This will:
1. Install dependencies for all workspaces (pnpm + turbo)
2. Start orchestrator and agents locally (no Docker)
3. Open SwiftUI app in Xcode
4. Launch evidence runner
5. Set up sample inventory project

### First Council Session
1. Open samples/inventory in the app
2. Right-click on inventory.lua → "Ask Council"
3. Review proposals and evidence
4. Click "Apply in Branch"
5. Use "Open PR" to see auto-generated summary

## Architecture
- **app-macos**: Native SwiftUI app (Council Chamber, Editor, Console)
- **orchestrator**: State machine service (proposals → synthesis)
- **agents**: MCP-compliant AI agents (CodeMaster, TestBot, ScriptDoctor)
- **evidence**: Sandboxed providers (Luau Linter, Unit Test Runner, PerfProbe)

## Development
- `make dev` - Start local runner (tmux + node services)
- `make test` - Run tests via turbo across workspaces
- `make lint` - Lint/format via turbo tasks
- `make build` - Build all packages
- `make type-check` - Run type checks
- `make ci` - Lint, build, test pipeline

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed workflow.
