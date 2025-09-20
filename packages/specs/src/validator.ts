import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import { SCHEMAS, SCHEMA_IDS } from './index.js'

// Initialize AJV with formats
const ajv = new Ajv({
  allErrors: true,
  verbose: true,
  strict: false
})
addFormats(ajv)

// Add all schemas to AJV instance
Object.entries(SCHEMAS).forEach(([name, schema]) => {
  ajv.addSchema(schema, SCHEMA_IDS[name as keyof typeof SCHEMA_IDS])
})

// Create validator function for a specific schema
export function createValidator(schemaId: keyof typeof SCHEMA_IDS) {
  const validate = ajv.getSchema(SCHEMA_IDS[schemaId])
  if (!validate) {
    throw new Error(`Schema not found: ${schemaId}`)
  }
  return validate
}

// Validate data against schema
export function validateData<T = any>(
  schemaId: keyof typeof SCHEMA_IDS, 
  data: unknown
): { valid: boolean; data?: T; errors?: string[] } {
  const validate = createValidator(schemaId)
  const valid = validate(data)
  
  if (valid) {
    return { valid: true, data: data as T }
  } else {
    return { 
      valid: false, 
      errors: validate.errors?.map((e: any) => `${e.instancePath} ${e.message}`) || []
    }
  }
}

export { ajv }
