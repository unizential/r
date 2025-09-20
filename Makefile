.PHONY: bootstrap dev test build lint type-check ci clean

bootstrap:
	@echo "🚀 Bootstrapping Manus Engine..."
	pnpm install

dev:
	@echo "🔧 Starting local runner (no Docker)..."
	pnpm local:run

test:
	@echo "🧪 Running test suites via turbo..."
	pnpm -w turbo run test

build:
	@echo "🏗️ Building all packages..."
	pnpm -w turbo run build

lint:
	@echo "✨ Linting and formatting..."
	pnpm -w turbo run lint

type-check:
	@echo "🔎 Type checking..."
	pnpm -w turbo run type-check

ci:
	@echo "🤖 Running CI pipeline (lint, build, test)..."
	make lint
	make build
	make test

clean:
	@echo "🧹 Cleaning workspaces..."
	pnpm -w turbo run clean
