#!/usr/bin/env zx

// Validate schema exports and OpenAPI consistency
import { $ } from 'zx'
import fs from 'fs'
import path from 'path'

$.verbose = false

async function validateSchemas() {
  console.log('🔍 Validating schema exports...')
  
  // Check if all schemas are exported
  const schemasDir = 'packages/specs/schemas'
  const indexFile = 'packages/specs/src/index.ts'
  
  if (!fs.existsSync(schemasDir)) {
    console.error('❌ Schemas directory not found:', schemasDir)
    process.exit(1)
  }
  
  if (!fs.existsSync(indexFile)) {
    console.error('❌ Specs index file not found:', indexFile)
    process.exit(1)
  }
  
  // Get all JSON schema files
  const schemaFiles = fs.readdirSync(schemasDir)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''))
  
  // Read index file content
  const indexContent = fs.readFileSync(indexFile, 'utf8')
  
  // Check each schema is exported
  const missing = []
  for (const schema of schemaFiles) {
    // Convert kebab-case to camelCase for export name
    const camelCase = schema.split('-').map((part, i) => 
      i === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
    ).join('')
    
    const exportPattern = new RegExp(`export.*${camelCase}Schema.*from.*schemas/${schema}\\.json`)
    if (!exportPattern.test(indexContent)) {
      missing.push(schema)
    }
  }
  
  if (missing.length > 0) {
    console.log('❌ Missing schema exports:')
    missing.forEach(s => console.log(`  - ${s}`))
    console.log('\n💡 Add exports to packages/specs/src/index.ts:')
    missing.forEach(s => {
      const camelCase = s.split('-').map((part, i) => 
        i === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
      ).join('')
      console.log(`  export { default as ${camelCase}Schema } from '../schemas/${s}.json'`)
    })
    process.exit(1)
  }
  
  console.log('✅ All schemas are exported')
}

async function validateOpenAPI() {
  console.log('🔍 Validating OpenAPI spec...')
  
  const openapiFile = 'openapi/api.yaml'
  if (!fs.existsSync(openapiFile)) {
    console.error('❌ OpenAPI spec not found:', openapiFile)
    process.exit(1)
  }
  
  // Basic YAML validation
  try {
    const content = fs.readFileSync(openapiFile, 'utf8')
    if (!content.includes('openapi: 3.0.3')) {
      console.error('❌ Invalid OpenAPI version')
      process.exit(1)
    }
    
    if (!content.includes('paths:')) {
      console.error('❌ Missing paths section')
      process.exit(1)
    }
    
    console.log('✅ OpenAPI spec is valid')
  } catch (err) {
    console.error('❌ Failed to parse OpenAPI spec:', err.message)
    process.exit(1)
  }
}

async function main() {
  await validateSchemas()
  await validateOpenAPI()
  console.log('🎉 All validations passed!')
}

main().catch(err => {
  console.error('Validation failed:', err)
  process.exit(1)
})
