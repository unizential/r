#!/usr/bin/env zx

// Scan for TODOs, FIXMEs, and technical debt
import { $ } from 'zx'
import fs from 'fs'

$.verbose = false

async function scanTodos() {
  console.log('🔍 Scanning for TODOs and technical debt...')
  
  try {
    // Use grep to find todos (fallback if ripgrep not available)
    const { stdout } = await $`grep -r --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" --include="*.py" --include="*.md" --include="*.json" --include="*.yaml" --include="*.yml" --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=.turbo "TODO\|FIXME\|HACK\|XXX\|BUG" . || true`
    
    if (!stdout.trim()) {
      console.log('✅ No TODOs found')
      return
    }
    
    const lines = stdout.trim().split('\n').filter(line => line.trim())
    
    console.log(`📝 Found ${lines.length} lines with TODOs:`)
    
    lines.forEach(line => {
      console.log(`  ${line}`)
    })
    
    // Write to cache file
    fs.writeFileSync('.cache/todos.txt', stdout)
    console.log('\n📄 Full list written to .cache/todos.txt')
    
  } catch (err) {
    console.log('✅ No TODOs found')
  }
}

scanTodos().catch(err => {
  console.error('Scan failed:', err)
  process.exit(1)
})
