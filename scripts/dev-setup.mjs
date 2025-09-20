#!/usr/bin/env zx

// Development Setup Script
// Sets up the complete development environment

console.log('🛠️ Development Setup Script');

// Check prerequisites
console.log('🔍 Checking prerequisites...');
const nodeVersion = await $`node --version`;
const pnpmVersion = await $`pnpm --version`;
console.log(`✅ Node: ${nodeVersion.stdout.trim()}`);
console.log(`✅ pnpm: ${pnpmVersion.stdout.trim()}`);

// Install dependencies
console.log('📥 Installing dependencies...');
await $`pnpm install`;

// Build all packages
console.log('🔨 Building packages...');
await $`pnpm -w build`;

// Start development servers
console.log('🚀 Starting development servers...');

// Start orchestrator
console.log('🎯 Starting orchestrator...');
await $`cd packages/orchestrator && pnpm dev` &;

// Start evidence runner
console.log('🔍 Starting evidence runner...');
await $`cd packages/evidence && pnpm dev` &;

// Start Tauri app
console.log('🖥️ Starting Tauri app...');
await $`cd apps/studio && pnpm tauri dev` &;

// Wait a moment for services to start
await new Promise(resolve => setTimeout(resolve, 5000));

// Check service health
console.log('🏥 Checking service health...');
try {
  const orchestratorHealth = await $`curl -s http://localhost:4000/health`;
  console.log('✅ Orchestrator:', JSON.parse(orchestratorHealth.stdout));
} catch {
  console.log('⚠️ Orchestrator not responding');
}

try {
  const evidenceHealth = await $`curl -s http://localhost:4001/health`;
  console.log('✅ Evidence Runner:', JSON.parse(evidenceHealth.stdout));
} catch {
  console.log('⚠️ Evidence Runner not responding');
}

console.log('🎉 Development environment ready!');
console.log('📋 Available services:');
console.log('   - Orchestrator: http://localhost:4000');
console.log('   - Evidence Runner: http://localhost:4001');
console.log('   - Tauri App: Check your desktop');
console.log('');
console.log('🔧 Available scripts:');
console.log('   - ./scripts/council-run.mjs - Run a council session');
console.log('   - ./scripts/rojo-sync.mjs - Sync with Roblox');
console.log('   - ./scripts/scaffold.mjs - Rebuild everything');
