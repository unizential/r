#!/usr/bin/env bash
set -e

echo "🚀 Starting Manus Engine development environment (no Docker)..."

# Kill existing tmux session if it exists
tmux kill-session -t manus 2>/dev/null || true

# Create new tmux session
tmux new-session -d -s manus -c "$(pwd)"

# Window 1: Orchestrator (Node/TS)
tmux send-keys -t manus "cd packages/orchestrator && pnpm dev" C-m

# Split for agents
tmux split-window -h -t manus
tmux send-keys -t manus "cd packages/agents && pnpm dev" C-m

# Split for evidence
tmux split-window -v -t manus
tmux send-keys -t manus "pnpm dev:evidence" C-m

# Window 2: macOS App (Tauri)
tmux new-window -t manus -c "$(pwd)/apps/studio"
tmux send-keys -t manus "pnpm dev" C-m

# Window 3: Logs
tmux new-window -t manus -c "$(pwd)"
tmux send-keys -t manus "pnpm -w turbo run dev" C-m

echo "✅ Development environment started!"
echo "📱 Xcode should open automatically"
echo "🌐 Orchestrator running on http://localhost:${ORCHESTRATOR_PORT:-7071}"
echo "📺 Attach to tmux: tmux attach -t manus"

# Auto-attach if terminal supports it
if [[ -t 0 ]]; then
    tmux attach -t manus
fi
