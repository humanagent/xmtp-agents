"use client";

import type { Client } from "@xmtp/browser-sdk";
import { useEffect, useRef, useState } from "react";

// Use any for conversation type since SDK types are not fully exposed
type Dm = any;
import { ChatHeader } from "@/components/chat-header";
import type { AIAgent } from "@/lib/xmtp/agents";
import {
  getMessages,
  sendMessage,
  startConversation,
  streamMessages,
  type XMTPMessage,
} from "@/lib/xmtp/client";
import { Messages } from "./messages";
import { MultimodalInput } from "./multimodal-input";
import { toast } from "./toast";

export function Chat({
  client,
  agent,
  userAddress,
  onBackToAgents,
}: {
  client: Client;
  agent: AIAgent;
  userAddress: string;
  onBackToAgents: () => void;
}) {
  const [messages, setMessages] = useState<XMTPMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const conversationRef = useRef<Dm | null>(null);

  useEffect(() => {
    let cleanup: (() => Promise<void>) | null = null;

    const initConversation = async () => {
      try {
        const conversation = await startConversation(client, agent.address);
        conversationRef.current = conversation;

        const existingMessages = await getMessages(conversation);
        setMessages(existingMessages);

        cleanup = await streamMessages(conversation, (message) => {
          setMessages((prev) => [...prev, message]);
        });
      } catch (error) {
        console.error("Failed to initialize conversation:", error);
        toast({ type: "error", description: "Failed to connect to agent" });
      }
    };

    initConversation();

    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [client, agent]);

  const handleSendMessage = async () => {
    if (!input.trim() || !conversationRef.current || isLoading) return;

    const content = input.trim();
    setInput("");
    setIsLoading(true);

    try {
      await sendMessage(conversationRef.current, content);
    } catch (error) {
      console.error("Failed to send message:", error);
      toast({ type: "error", description: "Failed to send message" });
      setInput(content);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <ChatHeader agent={agent} onBackToAgents={onBackToAgents} />
      <Messages messages={messages} userAddress={userAddress} />
      <MultimodalInput
        input={input}
        setInput={setInput}
        onSubmit={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
}
