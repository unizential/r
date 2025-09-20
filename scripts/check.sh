#!/usr/bin/env bash
set -e

echo "🔍 Running Manus Engine checks..."

# Check Python syntax
echo "🐍 Checking Python syntax..."
find . -name "*.py" -not -path "./venv/*" -not -path "./env/*" -exec python3 -m py_compile {} \;

# Check JSON syntax
echo "📄 Checking JSON syntax..."
find . -name "*.json" -exec python3 -c "import json, sys; json.load(open(sys.argv[1]))" {} \;

# Check for secrets (basic)
echo "🔐 Checking for potential secrets..."
if grep -r "password\|secret\|key\|token" . --exclude-dir=.git --exclude-dir=venv --exclude-dir=env --exclude=*.md | grep -v "example\|placeholder\|TODO"; then
    echo "⚠️  Potential secrets found. Please review."
    exit 1
fi

# Check file permissions
echo "📁 Checking file permissions..."
chmod +x scripts/*.sh

# Run tests if available
echo "🧪 Running tests..."
if command -v pytest >/dev/null 2>&1; then
    cd orchestrator && python -m pytest -v && cd ..
    cd agents && python -m pytest -v && cd ..
    cd evidence && python -m pytest -v && cd ..
fi

echo "✅ All checks passed!"
