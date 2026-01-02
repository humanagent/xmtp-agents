"use client";

import type { Client } from "@xmtp/browser-sdk";
import { useEffect, useState } from "react";
import { AgentSelector } from "@/components/agent-selector";
import { Chat } from "@/components/chat";
import { Button } from "@/components/ui/button";
import type { AIAgent } from "@/lib/xmtp/agents";
import { createXMTPClient } from "@/lib/xmtp/client";
import {
  clearPrivateKey,
  getOrCreateIdentity,
  getWalletAddress,
} from "@/lib/xmtp/identity";

export default function Page() {
  const [client, setClient] = useState<Client | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeClient = async () => {
      try {
        const wallet = getOrCreateIdentity();
        const address = getWalletAddress(wallet);
        setWalletAddress(address);

        const xmtpClient = await createXMTPClient(wallet);
        setClient(xmtpClient);
      } catch (error) {
        console.error("Failed to initialize XMTP client:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeClient();
  }, []);

  const handleResetIdentity = () => {
    clearPrivateKey();
    window.location.reload();
  };

  const handleBackToAgents = () => {
    setSelectedAgent(null);
  };

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold">Initializing XMTP...</h2>
          <p className="text-muted-foreground">
            Setting up your ephemeral identity
          </p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold">Failed to initialize</h2>
          <p className="text-muted-foreground">
            Could not create XMTP client
          </p>
          <Button onClick={() => window.location.reload()} className="mt-4">Retry</Button>
        </div>
      </div>
    );
  }

  if (selectedAgent) {
    return (
      <Chat
        client={client}
        agent={selectedAgent}
        userAddress={walletAddress}
        onBackToAgents={handleBackToAgents}
      />
    );
  }

  return (
    <div className="relative">
      <div className="absolute top-6 right-6 z-10 space-y-3 text-right">
        <div className="text-sm text-muted-foreground">
          <span className="micro-label text-xs opacity-70">Your Address</span>
          <div className="font-mono text-foreground mt-1">{walletAddress}</div>
        </div>
        <Button variant="outline" size="sm" onClick={handleResetIdentity}>
          Generate New Identity
        </Button>
      </div>
      <AgentSelector onSelectAgent={setSelectedAgent} />
    </div>
  );
}
