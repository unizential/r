#!/usr/bin/env zx

// Council Run Script
// Orchestrates MCP agents and Evidence Runner invocations

console.log('🤖 Council Run Script');

// Start orchestrator if not running
console.log('🎯 Starting orchestrator...');
try {
  await $`curl -f http://localhost:4000/health`;
  console.log('✅ Orchestrator already running');
} catch {
  console.log('🚀 Starting orchestrator...');
  await $`cd packages/orchestrator && pnpm dev` &;
  await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for startup
}

// Start evidence runner if not running
console.log('🔍 Starting evidence runner...');
try {
  await $`curl -f http://localhost:4001/health`;
  console.log('✅ Evidence runner already running');
} catch {
  console.log('🚀 Starting evidence runner...');
  await $`cd packages/evidence && pnpm dev` &;
  await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for startup
}

// Create a test council session
console.log('🏛️ Creating test council session...');
const councilResponse = await $`curl -X POST http://localhost:4000/council \
  -H "Content-Type: application/json" \
  -d '{
    "context": {
      "file_path": "inventory.lua",
      "issue": "performance"
    },
    "agents": ["code_master", "test_bot", "script_doctor", "design_guru"],
    "timeout_seconds": 300
  }'`;

const councilData = JSON.parse(councilResponse.stdout);
console.log(`✅ Council created: ${councilData.council_id}`);

// Simulate agent messages
const agents = ['code_master', 'test_bot', 'script_doctor', 'design_guru'];
for (const agent of agents) {
  console.log(`💬 ${agent} submitting proposal...`);
  await $`curl -X POST http://localhost:4000/council/${councilData.council_id}/message \
    -H "Content-Type: application/json" \
    -d '{
      "agent_id": "${agent}",
      "council_id": "${councilData.council_id}",
      "round": 1,
      "content": {
        "type": "proposal",
        "summary": "Test proposal from ${agent}"
      }
    }'`;
  
  await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
}

// Get synthesis
console.log('📋 Getting council synthesis...');
const synthesisResponse = await $`curl http://localhost:4000/council/${councilData.council_id}/synthesis`;
const synthesis = JSON.parse(synthesisResponse.stdout);

console.log('🎉 Council session complete!');
console.log('📊 Synthesis:', synthesis.recommendation?.summary || 'No synthesis available');
