# Manus Engine Scripts

This directory contains zx scripts for automating common development tasks.

## Prerequisites

- Node.js 18+
- pnpm
- zx (installed as dev dependency)

## Available Scripts

### `scaffold.mjs`
Sets up the complete monorepo structure and builds all packages.

```bash
pnpm scaffold
# or
./scripts/scaffold.mjs
```

### `dev-setup.mjs`
Sets up the complete development environment and starts all services.

```bash
pnpm dev-setup
# or
./scripts/dev-setup.mjs
```

### `council-run.mjs`
Orchestrates MCP agents and runs a test Council session.

```bash
pnpm council-run
# or
./scripts/council-run.mjs
```

### `rojo-sync.mjs`
Synchronizes with Roblox using Rojo and optionally uploads to Roblox Cloud.

```bash
pnpm rojo-sync
# or
./scripts/rojo-sync.mjs
```

## Environment Variables

- `RBX_PLACE_ID`: Roblox place ID for cloud uploads
- `ORCHESTRATOR_PORT`: Port for orchestrator service (default: 7071)
- `EVIDENCE_PORT`: Port for evidence runner (default: 7072)

## Local Runner (no Docker)

Use the local runner to start orchestrator and agents without containers:

```bash
pnpm local:run
```

This script starts:
- Orchestrator at `http://localhost:$ORCHESTRATOR_PORT`
- Agent processes in watch mode
- Evidence runner in sandboxed mode

## Creating New Scripts

1. Create a new `.mjs` file in the `scripts/` directory
2. Add the shebang: `#!/usr/bin/env zx`
3. Make it executable: `chmod +x scripts/your-script.mjs`
4. Add to package.json scripts if needed

## zx Features Used

- `$` for shell commands
- `fs` for file operations
- `glob` for file matching
- Async/await for sequential operations
- Built-in JSON parsing
- Cross-platform compatibility
