#!/usr/bin/env zx

// Local runner to start orchestrator, agents, evidence, and app without Docker
import { $ } from 'zx'

$.verbose = true

const orchestratorPort = process.env.ORCHESTRATOR_PORT || '7071'

async function main() {
  console.log('🚀 Starting Manus Engine local runner (no Docker)...')
  await $`tmux kill-session -t manus 2>/dev/null || true`
  await $`tmux new-session -d -s manus -c ${process.cwd()}`

  // Orchestrator
  await $`tmux send-keys -t manus 'cd packages/orchestrator && pnpm dev' C-m`

  // Agents
  await $`tmux split-window -h -t manus`
  await $`tmux send-keys -t manus 'cd packages/agents && pnpm dev' C-m`

  // Evidence
  await $`tmux split-window -v -t manus`
  await $`tmux send-keys -t manus 'pnpm dev:evidence' C-m`

  // App
  await $`tmux new-window -t manus -c ${process.cwd() + '/apps/studio'}`
  await $`tmux send-keys -t manus 'pnpm dev' C-m`

  console.log(`🌐 Orchestrator running on http://localhost:${orchestratorPort}`)
  console.log('📺 Attach to tmux: tmux attach -t manus')

  if (process.stdin.isTTY) {
    await $`tmux attach -t manus`
  }
}

main().catch((err) => {
  console.error('Local runner failed:', err)
  process.exit(1)
})


