#!/usr/bin/env zx

// Scan for files outside workspace boundaries
import { $ } from 'zx'
import fs from 'fs'
import path from 'path'

$.verbose = false

const WORKSPACE_DIRS = [
  'packages',
  'apps', 
  'scripts',
  'docs',
  'samples',
  'openapi',
  'services'
]

const ALLOWED_ROOT_FILES = [
  '.cursorrules',
  '.editorconfig', 
  '.gitignore',
  '.gitattributes',
  '.gitleaks.toml',
  '.husky',
  '.cursor',
  '.github',
  'biome.jsonc',
  'CODEOWNERS',
  'CONTRIBUTING.md',
  'CURSOR_SETUP.md',
  'env.example',
  'LICENSE',
  'Makefile',
  'package.json',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  'README.md',
  'tsconfig.json',
  'turbo.json',
  'ui-specs'
]

async function scanUnowned() {
  console.log('🔍 Scanning for files outside workspace boundaries...')
  
  const unowned = []
  
  // Get all files in repo
  const { stdout } = await $`find . -type f -not -path "./.git/*" -not -path "./node_modules/*" -not -path "./.turbo/*" -not -path "./.cache/*"`
  const files = stdout.trim().split('\n').map(f => f.replace('./', ''))
  
  for (const file of files) {
    const parts = file.split('/')
    const rootDir = parts[0]
    
    // Skip if it's a workspace dir or allowed root file/dir
    if (WORKSPACE_DIRS.includes(rootDir) || ALLOWED_ROOT_FILES.includes(rootDir) || ALLOWED_ROOT_FILES.includes(file)) {
      continue
    }
    
    unowned.push(file)
  }
  
  if (unowned.length > 0) {
    console.log('❌ Found files outside workspace boundaries:')
    unowned.forEach(f => console.log(`  ${f}`))
    console.log('\n💡 Move these files to appropriate workspace directories:')
    console.log('   - packages/* for libraries')
    console.log('   - apps/* for applications') 
    console.log('   - scripts/* for utilities')
    console.log('   - docs/* for documentation')
    console.log('   - samples/* for examples')
    process.exit(1)
  } else {
    console.log('✅ All files are within workspace boundaries')
  }
}

scanUnowned().catch(err => {
  console.error('Scan failed:', err)
  process.exit(1)
})
