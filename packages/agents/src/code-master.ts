import { instructorClient } from './instructor';

export interface MCPAgent {
  id: string;
  capabilities: string[];
  execute(cmd: string, ctx: any): Promise<any>;
}

export class CodeMasterAgent implements MCPAgent {
  id = 'code_master';
  capabilities = ['scripting', 'static-analysis', 'patch-generation', 'performance-optimization'];

  async execute(cmd: string, ctx: any): Promise<any> {
    switch (cmd) {
      case 'proposal':
        return await this.generateProposal(ctx.content);
      case 'critique':
        return await this.generateCritique(ctx.content.target_agent, ctx.content);
      default:
        throw new Error(`Unknown command: ${cmd}`);
    }
  }

  private async generateProposal(content: string): Promise<any> {
    // Use instructor for validated output
    return instructorClient.chat({
      messages: [
        {
          role: 'system',
          content: `You are ${this.id}. Generate a proposal based on your capabilities: ${this.capabilities.join(', ')}`,
        },
        {
          role: 'user',
          content,
        },
      ],
      response_model: {
        type: 'proposal',
        summary: 'string',
        rationale: 'string',
        confidence: 'number',
        artifacts: 'object'
      },
      max_retries: 3,
    });
  }

  private async generateCritique(targetAgent: string, proposal: any): Promise<any> {
    return instructorClient.chat({
      messages: [
        {
          role: 'system',
          content: `You are ${this.id}. Critique the proposal from ${targetAgent} based on your expertise.`,
        },
        {
          role: 'user',
          content: JSON.stringify(proposal),
        },
      ],
      response_model: {
        type: 'critique',
        target_agent: 'string',
        feedback: 'string',
        rating: 'number',
        suggestions: 'array'
      },
      max_retries: 3,
    });
  }
}
