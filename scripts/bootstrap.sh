#!/usr/bin/env bash
set -e

echo "🔧 Bootstrapping Manus Engine..."

# Check prerequisites
echo "📋 Checking prerequisites..."
command -v python3 >/dev/null 2>&1 || { echo "❌ Python 3.11+ required"; exit 1; }
command -v xcodebuild >/dev/null 2>&1 || { echo "❌ Xcode required"; exit 1; }

# Python environments
echo "🐍 Setting up Python environments..."
cd orchestrator && pip install -r requirements.txt && cd ..
cd agents && pip install -r requirements.txt && cd ..
cd evidence && pip install -r requirements.txt && cd ..

# Create logs directory
mkdir -p orchestrator/logs
mkdir -p evidence/logs

# Install dev tools (optional)
if command -v npm >/dev/null 2>&1; then
    echo "📦 Installing dev tools..."
    npm install -g prettier
fi

# Copy environment file
if [[ ! -f .env ]]; then
    cp env.example .env
    echo "📝 Created .env from template"
fi

# Validate schemas
echo "🔍 Validating JSON schemas..."
python3 -c "
import json, jsonschema
for schema_file in ['orchestrator/schemas/agent_output.json', 'orchestrator/schemas/council_synthesis.json']:
    try:
        with open(schema_file) as f:
            json.load(f)
        print(f'✅ {schema_file}')
    except Exception as e:
        print(f'❌ {schema_file}: {e}')
"

echo "✅ Bootstrap complete!"
echo "🚀 Run 'make dev' to start development environment"
