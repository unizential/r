#!/usr/bin/env zx

// Rojo Sync Script
// Handles Roblox project synchronization

console.log('🎮 Rojo Sync Script');

// Check if rojo is available
try {
  await $`rojo --version`;
} catch {
  console.error('❌ Rojo not found. Install with: pnpm add -g rojo-cli');
  process.exit(1);
}

// Build Roblox project
console.log('🔨 Building Roblox project...');
await $`rojo build --output build.rbxmx`;

// Check if build was successful
if (await fs.exists('build.rbxmx')) {
  console.log('✅ Build successful: build.rbxmx');
  
  // Optional: Upload to Roblox Cloud
  if (process.env.RBX_PLACE_ID) {
    console.log('☁️ Uploading to Roblox Cloud...');
    await $`rbxcloud upload --place-id ${process.env.RBX_PLACE_ID} --file build.rbxmx`;
  }
} else {
  console.error('❌ Build failed');
  process.exit(1);
}

console.log('🎉 Rojo sync complete!');
