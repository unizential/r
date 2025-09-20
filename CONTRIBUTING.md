# Contributing to Manus Engine

## Development Workflow

### Branch Strategy
- `main` - Production-ready code
- `feature/*` - New features
- `hotfix/*` - Critical fixes
- `release/*` - Release preparation

### Commit Convention
Use conventional commits:
- `feat(scope): description` - New features
- `fix(scope): description` - Bug fixes  
- `docs(scope): description` - Documentation
- `test(scope): description` - Tests
- `refactor(scope): description` - Code refactoring

Scopes: `app`, `orchestrator`, `agents`, `evidence`, `ui`, `docs`, `infra`

### Code Standards
- Swift: 2-space indent, 120-char lines
- Python: Black formatter, isort imports
- JSON: Prettier, 100-char width
- Lua: Stylua formatter

### Testing
- Unit tests required for all new code
- Integration tests for cross-service flows
- Performance smoke tests for evidence providers
- Run via turbo: `pnpm test`

### Review Process
- All PRs require 1 reviewer
- Required checks: tests pass, lint clean, no secrets, perf smoke
- Security-flagged paths require additional review

### Local Development
- Use `make dev` to start local runner (no Docker)
- Orchestrator on `http://localhost:${ORCHESTRATOR_PORT:-7071}`
- Studio app in `apps/studio`

### Secrets Policy
- Do not commit secrets. Use `.env.example` placeholders
- Use Doppler for local secrets management
- CI runs `gitleaks` to scan PRs

Run `make check` before submitting PRs.
