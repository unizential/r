#!/usr/bin/env zx

// Manus Engine Scaffold Script
// Handles repo scaffolding, Rojo sync, tests, lint, and release pipelines

console.log('🚀 Manus Engine Scaffold Script');

// Check if we're in the right directory
const pkg = JSON.parse(await fs.readFile('package.json', 'utf-8'));
if (pkg.name !== 'manus-engine') {
  console.error('❌ Not in manus-engine directory');
  process.exit(1);
}

// Create package directories if they don't exist
console.log('📦 Creating package directories...');
await $`mkdir -p packages/{ui,plugins,specs}/src`;

// Install dependencies
console.log('📥 Installing dependencies...');
await $`pnpm install`;

// Build all packages
console.log('🔨 Building packages...');
await $`pnpm -w build`;

// Run tests
console.log('🧪 Running tests...');
await $`pnpm -w test`;

// Check for changes
const changed = await $`git status --porcelain`;
if (changed.stdout) {
  console.log('📝 Changes detected, committing...');
  await $`git add -A`;
  await $`git commit -m "scaffold: setup monorepo structure with zx scripts"`;
} else {
  console.log('✅ No changes to commit');
}

console.log('🎉 Scaffold complete!');
