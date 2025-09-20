// Model Context Protocol (MCP) interface for Manus Engine agents

export interface MCPAgent {
  id: string;
  capabilities: string[];
  execute(cmd: string, ctx: any): Promise<any>;
}

export interface MCPMessage {
  id: string;
  agent_id: string;
  council_id: string;
  round: number;
  content: {
    type: 'proposal' | 'critique' | 'evidence';
    summary?: string;
    target_agent?: string;
    feedback?: string;
    [key: string]: any;
  };
}

export interface MCPContext {
  file_path: string;
  issue: string;
  [key: string]: any;
}

export interface MCPProvider {
  id: 'raycast' | 'cursor' | 'openpipe' | 'mlx_local';
  name: string;
  quota: number;
  used: number;
  execute(prompt: string, context: any): Promise<any>;
}

export class MCPRouter {
  private agents: Map<string, MCPAgent> = new Map();
  private providers: Map<string, MCPProvider> = new Map();

  registerAgent(agent: MCPAgent): void {
    this.agents.set(agent.id, agent);
  }

  registerProvider(provider: MCPProvider): void {
    this.providers.set(provider.id, provider);
  }

  async routeMessage(message: MCPMessage): Promise<any> {
    const agent = this.agents.get(message.agent_id);
    if (!agent) {
      throw new Error(`Agent ${message.agent_id} not found`);
    }

    return await agent.execute(message.content.type, {
      council_id: message.council_id,
      round: message.round,
      content: message.content
    });
  }

  async executeProvider(providerId: string, prompt: string, context: any): Promise<any> {
    const provider = this.providers.get(providerId);
    if (!provider) {
      throw new Error(`Provider ${providerId} not found`);
    }

    if (provider.used >= provider.quota) {
      throw new Error(`Provider ${providerId} quota exceeded`);
    }

    provider.used++;
    return await provider.execute(prompt, context);
  }

  getAvailableAgents(): string[] {
    return Array.from(this.agents.keys());
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }
}
