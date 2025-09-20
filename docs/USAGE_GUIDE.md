# Manus Engine Usage Guide

## Cursor Rules & Development Standards

### Code style
- Language: TypeScript first, ES2022 modules, `"type": "module"`
- Strict TS: "noImplicitAny", "strictNullChecks", "exactOptionalPropertyTypes"
- Lint: eslint + @typescript-eslint, prettier singleQuote true, printWidth 100
- Paths: use `@core/*`, `@agents/*`, `@orchestrator/*` via tsconfig baseUrl `./packages`
- Node target: 18+, `"moduleResolution": "bundler"`

### Commits
- Conventional Commits: feat, fix, chore, refactor, perf, test, docs
- PR title must match commit
- Require passing `pnpm -w test` and `pnpm -w lint`

### Testing
- Vitest for unit, Playwright for e2e, 80%+ coverage on packages/orchestrator and agents
- Snapshot tests for schemas and orchestrator states

### Orchestrator contracts
- Schemas in `packages/contracts/src/*.schema.json` are source of truth
- No agent may bypass schema validation, all I/O through MCP interface
- Timeouts: proposal 12s, critique 10s, evidence provider declares latency

### Security
- No network calls without `services/registry.ts` entry
- Secrets only via `.env.local` and Doppler, never committed
- Sandbox third‑party evidence providers, file access read‑only by default

### Repo tasks
- Use pnpm workspaces, root scripts:
  - `pnpm dev` turbo run dev
  - `pnpm build` turbo run build
  - `pnpm test` turbo run test
  - `pnpm lint` turbo run lint
- zx for workflows in `scripts/*.mjs`, keep pure and idempotent

### Docs
- Keep ADRs in `docs/adrs/ADR-YYYYMMDD-*.md`
- Update `docs/ARCHITECTURE.md` on any cross‑package contract change

## Ask Council Flow

1. **Start Council Session**
   ```bash
   pnpm council-run
   ```

2. **Monitor Council State**
   - Check orchestrator logs for state transitions
   - Verify agent responses via API endpoints

3. **Review Synthesis**
   - Council synthesis available at `/council/:id/synthesis`
   - Evidence results validated against schemas

## Development Workflow

1. **Setup Environment**
   ```bash
   pnpm dev-setup
   ```

2. **Run Tests**
   ```bash
   pnpm test
   ```

3. **Sync with Roblox**
   ```bash
   pnpm sync-roblox
   ```

## Local Runner (no Docker)

Start all services locally with tmux and pnpm:

```bash
make dev
```

This starts:
- Orchestrator on `http://localhost:${ORCHESTRATOR_PORT:-7071}`
- Agents in watch mode
- Evidence runner
- Studio app at `apps/studio`

## LLM Integration with Instructor

The project uses [567-labs/instructor](https://github.com/567-labs/instructor) for robust LLM output validation:

- **Agent Outputs**: Enforces Pydantic schemas on all agent proposals and critiques
- **Orchestrator Synthesis**: Validates final council synthesis against contracts
- **Evidence Provider Results**: Ensures evidence data matches expected formats
- **Marketplace Manifest Validation**: Validates plugin and provider manifests

Benefits over raw clients:
- Eliminates flaky parsing with retries and coercion
- Provides typed guarantees with minimal code
- Streaming support for real-time agent responses
- Built-in validators for complex nested structures
