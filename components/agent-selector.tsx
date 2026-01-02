"use client";

import { Card } from "@/components/ui/card";
import { AI_AGENTS, type AIAgent } from "@/lib/xmtp/agents";

type AgentSelectorProps = {
  onSelectAgent: (agent: AIAgent) => void;
};

export function AgentSelector({ onSelectAgent }: AgentSelectorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-5xl font-bold tracking-tight">XMTP AI Agents</h1>
          <p className="text-muted-foreground text-base">
            Select an AI agent to start a conversation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {AI_AGENTS.map((config) => {
            const agent: AIAgent = {
              id: config.address,
              name: config.name,
              description: `XMTP AI agent at ${config.address.slice(0, 6)}...${config.address.slice(-4)}`,
              address: config.address,
            };
            return (
              <Card
                key={config.name}
                className="p-6 cursor-pointer hover:bg-secondary/50 transition-colors duration-150 border-border"
                onClick={() => onSelectAgent(agent)}
              >
                <div className="space-y-3">
                  <h3 className="text-xl font-bold">{agent.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {agent.description}
                  </p>
                  <p className="text-xs font-mono text-muted-foreground truncate">
                    {agent.address}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

