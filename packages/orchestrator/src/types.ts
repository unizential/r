export type AgentProposal = {
  type: 'proposal'
  summary: string
  rationale?: string
  confidence?: number
  artifacts?: Record<string, unknown>
}

export type AgentCritique = {
  type: 'critique'
  target_agent: string
  feedback: string
  rating?: number
  suggestions?: unknown[]
}

export type CouncilSynthesis = {
  mode: 'consensus' | 'best'
  recommendation: string
  confidence: number
}


