"use client";

import { format } from "date-fns";
import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { XMTPMessage } from "@/lib/xmtp/client";

type MessagesProps = {
  messages: XMTPMessage[];
  userAddress: string;
};

export function Messages({ messages, userAddress }: MessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Start a conversation</h2>
          <p className="text-muted-foreground">
            Send a message to begin chatting with the AI agent
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div ref={scrollRef} className="p-6 space-y-4">
        {messages.map((message) => {
          const isUser = message.senderAddress === userAddress;
          return (
            <div
              key={message.id}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-4 ${
                  isUser
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border"
                }`}
              >
                <div className="text-xs mb-2 opacity-70 font-medium uppercase tracking-wide">
                  {isUser ? "You" : "Agent"}
                </div>
                <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                  {message.content}
                </div>
                <div className="text-xs mt-3 opacity-50">
                  {format(message.sentAt, "HH:mm")}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
