import { instructor } from 'instructor';
import type { AgentProposal, AgentCritique } from '@manus/orchestrator';

// Instructor client for robust LLM output validation
export const instructorClient = instructor({
  mode: 'json',
  max_retries: 3,
});

// Schema objects for instructor validation
const AgentProposalSchema = {
  type: 'object',
  properties: {
    type: { type: 'string', enum: ['proposal'] },
    summary: { type: 'string' },
    rationale: { type: 'string' },
    confidence: { type: 'number', minimum: 0, maximum: 1 },
    artifacts: { type: 'object' }
  },
  required: ['type', 'summary']
}

const AgentCritiqueSchema = {
  type: 'object',
  properties: {
    type: { type: 'string', enum: ['critique'] },
    target_agent: { type: 'string' },
    feedback: { type: 'string' },
    rating: { type: 'number', minimum: 1, maximum: 5 },
    suggestions: { type: 'array', items: { type: 'string' } }
  },
  required: ['type', 'target_agent', 'feedback']
}

// Validated agent proposal generation
export async function generateValidatedProposal(
  agentId: string,
  context: string,
  llmClient: any
): Promise<AgentProposal> {
  return instructorClient.chat({
    messages: [
      {
        role: 'system',
        content: `You are ${agentId}. Generate a proposal based on the context.`,
      },
      {
        role: 'user',
        content: context,
      },
    ],
    response_model: AgentProposalSchema,
    max_retries: 3,
  });
}

// Validated agent critique generation
export async function generateValidatedCritique(
  agentId: string,
  targetAgent: string,
  proposal: AgentProposal,
  llmClient: any
): Promise<AgentCritique> {
  return instructorClient.chat({
    messages: [
      {
        role: 'system',
        content: `You are ${agentId}. Critique the proposal from ${targetAgent}.`,
      },
      {
        role: 'user',
        content: JSON.stringify(proposal),
      },
    ],
    response_model: AgentCritiqueSchema,
    max_retries: 3,
  });
}
