"use client";

import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AIAgent } from "@/lib/xmtp/agents";

type ChatHeaderProps = {
  agent: AIAgent;
  onBackToAgents: () => void;
};

export function ChatHeader({ agent, onBackToAgents }: ChatHeaderProps) {
  return (
    <header className="border-b border-border bg-card/50 p-4">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBackToAgents}
          className="hover:bg-secondary"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-lg font-bold">{agent.name}</h2>
          <p className="text-sm text-muted-foreground">{agent.description}</p>
        </div>
      </div>
    </header>
  );
}
