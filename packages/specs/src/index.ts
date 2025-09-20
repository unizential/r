// Export all JSON schemas
export { default as agentProposalSchema } from '../schemas/agent-proposal.json'
export { default as agentCritiqueSchema } from '../schemas/agent-critique.json'
export { default as councilSynthesisSchema } from '../schemas/council-synthesis.json'
export { default as orchestratorStateSchema } from '../schemas/orchestrator-state.json'

// Schema IDs for validation
export const SCHEMA_IDS = {
  agentProposal: 'https://manus.dev/schemas/agent-proposal.json',
  agentCritique: 'https://manus.dev/schemas/agent-critique.json',
  councilSynthesis: 'https://manus.dev/schemas/council-synthesis.json',
  orchestratorState: 'https://manus.dev/schemas/orchestrator-state.json'
} as const

// Schema mapping for easy lookup
export const SCHEMAS = {
  agentProposal: agentProposalSchema,
  agentCritique: agentCritiqueSchema,
  councilSynthesis: councilSynthesisSchema,
  orchestratorState: orchestratorStateSchema
} as const

// JSON Schemas for agent IO and evidence
export const specsVersion = "0.1.0";
