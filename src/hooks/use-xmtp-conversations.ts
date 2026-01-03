import type { Client, Conversation } from "@xmtp/browser-sdk";
import { useEffect, useState, useCallback } from "react";

export function useXMTPConversations(client: Client<any> | null | undefined) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversationState] =
    useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const setSelectedConversation = useCallback((conversation: Conversation | null) => {
    console.log("[useXMTPConversations] setSelectedConversation called", {
      conversationId: conversation?.id,
      hasConversation: !!conversation,
    });
    setSelectedConversationState(conversation);
  }, []);

  useEffect(() => {
    if (!client) {
      return;
    }

    let mounted = true;
    let streamCleanup: (() => Promise<void>) | null = null;

    const init = async () => {
      try {
        setIsLoading(true);
        setError(null);

        await client.conversations.sync();
        const allConversations = await client.conversations.list();

        if (mounted) {
          setConversations(allConversations);
          setIsLoading(false);
        }

        const stream = await client.conversations.stream({
          onValue: (conversation) => {
            if (mounted) {
              setConversations((prev) => {
                const exists = prev.some((c) => c.id === conversation.id);
                if (exists) {
                  return prev.map((c) =>
                    c.id === conversation.id ? conversation : c,
                  );
                }
                return [...prev, conversation];
              });
            }
          },
        });

        streamCleanup = async () => {
          await stream.end();
        };
      } catch (err) {
        console.error("[useXMTPConversations] Failed to initialize:", err);
        if (mounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setIsLoading(false);
        }
      }
    };

    init();

    return () => {
      mounted = false;
      if (streamCleanup) {
        streamCleanup().catch(console.error);
      }
    };
  }, [client]);

  useEffect(() => {
    console.log("[useXMTPConversations] selectedConversation changed", {
      conversationId: selectedConversation?.id,
      hasConversation: !!selectedConversation,
    });
  }, [selectedConversation]);

  return {
    conversations,
    selectedConversation,
    setSelectedConversation,
    isLoading,
    error,
  };
}
