# Inventory Sample - Performance Scenario

This sample demonstrates a common Roblox performance issue: an inventory system with per-frame updates causing CPU spikes as item count increases.

## Problem Statement
- `inventory.lua` updates every frame (60 FPS)
- Performance degrades significantly at 50+ items
- Hover detection adds additional overhead
- CPU spikes reach 18% at 100 items

## Expected Council Improvements
- Event-driven updates instead of per-frame
- Hover debouncing for UX responsiveness
- UI batching and lazy updates
- Memory pooling for UI elements

## Running the Test
```bash
cd samples/inventory
luau tests/InventorySpec.lua
```

## Metrics Baseline
See `metrics.json` for CPU/memory baselines at different item counts.
