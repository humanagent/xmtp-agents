import { InputArea } from "@components/input-area";
import { MessageList } from "@components/message-list";
import { useXMTPClient } from "@hooks/use-xmtp-client";
import { useXMTPConversations } from "@hooks/use-xmtp-conversations";
import { Loader2Icon } from "@ui/icons";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { type AgentConfig, AI_AGENTS } from "@/lib/agents";
import { createGroupWithAgentAddresses } from "@/lib/xmtp/conversations";
import { SidebarToggle } from "@/src/components/sidebar/sidebar-toggle";
import { ShareButton } from "@/src/components/sidebar/share-button";
import { useToast } from "@ui/toast";
import type { Conversation } from "@xmtp/browser-sdk";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export const ChatHeader = () => {
  return (
    <header className="sticky top-0 flex items-center gap-2 bg-background px-2 py-1.5 md:px-2">
      <SidebarToggle />
      <ShareButton />
    </header>
  );
};

export const Greeting = () => {
  return (
    <div
      className="mx-auto mt-4 flex size-full max-w-3xl flex-col justify-center px-4 md:mt-16 md:px-8"
      key="overview">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="font-semibold text-xl md:text-2xl"
        exit={{ opacity: 0, y: 10 }}
        initial={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.5, duration: 0.15 }}>
        Hello there
      </motion.div>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="text-xl text-muted-foreground md:text-2xl"
        exit={{ opacity: 0, y: 10 }}
        initial={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.6, duration: 0.15 }}>
        This chat is secured by XMTP. Each conversation its a new identity,
        untraceable to the previous one
      </motion.div>
    </div>
  );
};

export function ChatArea() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedAgents, setSelectedAgents] = useState<AgentConfig[]>([]);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const { client } = useXMTPClient();
  const { selectedConversation } = useXMTPConversations(client);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!client || !selectedConversation) {
      return;
    }

    let mounted = true;

    const setupMessages = async () => {
      try {
        await selectedConversation.sync();
        const existingMessages = await selectedConversation.messages();

        const chatMessages: Message[] = existingMessages
          .filter((msg: any) => typeof msg.content === "string")
          .map((msg: any) => ({
            id: msg.id,
            role: msg.senderInboxId === client.inboxId ? "user" : "assistant",
            content: msg.content as string,
          }));

        if (mounted) {
          setMessages(chatMessages);
        }

        const stream = await selectedConversation.stream({
          onValue: (message: any) => {
            if (!mounted || typeof message.content !== "string") {
              return;
            }

            const newMessage: Message = {
              id: message.id,
              role:
                message.senderInboxId === client.inboxId ? "user" : "assistant",
              content: message.content as string,
            };

            setMessages((prev) => {
              if (prev.some((m) => m.id === message.id)) {
                return prev;
              }
              return [...prev, newMessage];
            });
          },
        });

        return () => {
          stream.end().catch(console.error);
        };
      } catch (error) {
        console.error("[ChatArea] Error setting up messages:", error);
      }
    };

    setupMessages();

    return () => {
      mounted = false;
    };
  }, [client, selectedConversation]);

  const handleSendMessage = useCallback(
    async (content: string) => {
      console.log("[ChatArea] handleSendMessage called", {
        content,
        hasClient: !!client,
        selectedAgentsCount: selectedAgents.length,
        selectedAgents: selectedAgents.map((a) => ({
          name: a.name,
          address: a.address,
        })),
        hasSelectedConversation: !!selectedConversation,
      });

      if (!client) {
        console.log("[ChatArea] Early return - no client");
        return;
      }

      if (selectedAgents.length === 0) {
        console.log("[ChatArea] Early return - no selected agents");
        return;
      }

      let conversation = selectedConversation;

      if (!conversation) {
        try {
          console.log("[ChatArea] No existing conversation, creating group...");
          setIsCreatingConversation(true);
          const agentAddresses = selectedAgents.map((agent) => agent.address);
          console.log(
            "[ChatArea] Creating group with addresses:",
            agentAddresses,
          );
          conversation = await createGroupWithAgentAddresses(
            client,
            agentAddresses,
          );
          console.log("[ChatArea] Group created successfully", {
            conversationId: conversation.id,
            conversationType: conversation.constructor.name,
          });
          navigate(`/chat/${conversation.id}`);
          console.log("[ChatArea] Navigated to conversation", {
            conversationId: conversation.id,
          });

          console.log("[ChatArea] Syncing conversations to update sidebar...");
          try {
            await client.conversations.sync();
            console.log("[ChatArea] Conversations synced successfully");
            const updatedConversations = await client.conversations.list();
            const conversationId = conversation.id;
            console.log("[ChatArea] Updated conversations list", {
              count: updatedConversations.length,
              conversationIds: updatedConversations.map((c) => c.id),
              includesNewGroup: updatedConversations.some(
                (c) => c.id === conversationId,
              ),
            });
          } catch (syncError) {
            console.error("[ChatArea] Error syncing conversations:", syncError);
          }
        } catch (error) {
          console.error("[ChatArea] Error creating conversation:", error);
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to create conversation";
          showToast(errorMessage, "error");
          setIsCreatingConversation(false);
          return;
        } finally {
          setIsCreatingConversation(false);
        }
      }

      if (!conversation) {
        console.log(
          "[ChatArea] Early return - no conversation after creation attempt",
        );
        return;
      }

      console.log("[ChatArea] Sending message to conversation", {
        conversationId: conversation.id,
        content,
      });

      const tempMessage: Message = {
        id: `temp-${Date.now()}`,
        role: "user",
        content,
      };

      setMessages((prev) => [...prev, tempMessage]);

      try {
        await conversation.send(content);
        console.log("[ChatArea] Message sent successfully");
        setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id));
      } catch (error) {
        console.error("[ChatArea] Error sending message:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Failed to send message";
        showToast(errorMessage, "error");
        setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id));
      }
    },
    [client, selectedConversation, selectedAgents, navigate],
  );

  return (
    <div className="overscroll-behavior-contain flex h-dvh min-w-0 touch-pan-y flex-col bg-background">
      <ChatHeader />

      <div className="relative flex-1">
        <div className="absolute inset-0 touch-pan-y overflow-y-auto">
          <div className="mx-auto flex min-w-0 max-w-4xl flex-col gap-4 px-2 py-4 md:gap-6 md:px-4">
            {messages.length === 0 && <Greeting />}
            {messages.map((message) => (
              <div
                key={message.id}
                className="fade-in w-full animate-in duration-150">
                <div
                  className={`flex w-full items-start gap-2 md:gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className="flex flex-col gap-2 md:gap-4 max-w-[calc(100%-2.5rem)] sm:max-w-[min(fit-content,80%)]">
                    <div
                      className={`flex flex-col gap-2 overflow-hidden text-sm w-fit break-words rounded-md px-3 py-2 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground"
                      }`}>
                      <div className="space-y-4 whitespace-normal size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_code]:whitespace-pre-wrap [&_code]:break-words [&_pre]:max-w-full [&_pre]:overflow-x-auto">
                        <p>{message.content}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 z-1 mx-auto flex w-full max-w-4xl gap-2 border-t-0 bg-background px-2 pb-3 md:px-4 md:pb-4">
        <InputArea
          selectedAgents={selectedAgents}
          setSelectedAgents={setSelectedAgents}
          sendMessage={handleSendMessage}
          conversation={selectedConversation}
        />
      </div>
      {isCreatingConversation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 rounded-lg bg-card p-6 shadow-lg">
            <Loader2Icon size={24} className="animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Creating conversation...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export function ConversationView({
  conversation,
}: {
  conversation?: Conversation;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedAgents, setSelectedAgents] = useState<AgentConfig[]>([]);
  const { client } = useXMTPClient();
  const { selectedConversation: hookSelectedConversation } =
    useXMTPConversations((client ?? null) as any);
  const { showToast } = useToast();

  // Use prop conversation if provided, otherwise fall back to hook
  const selectedConversation =
    conversation || hookSelectedConversation;

  // Load agents from conversation members
  useEffect(() => {
    if (!selectedConversation || !client) {
      setSelectedAgents([]);
      return;
    }

    const loadAgentsFromMembers = async () => {
      try {
        const members = await selectedConversation.members();
        const userInboxId = client.inboxId.toLowerCase();

        // Get member addresses, excluding the current user
        const memberAddresses = new Set(
          members
            .filter((member) => member.inboxId.toLowerCase() !== userInboxId)
            .flatMap((member) =>
              member.accountIdentifiers
                .filter(
                  (id) =>
                    id.identifierKind === 0 || id.identifierKind === "Ethereum",
                )
                .map((id) => id.identifier.toLowerCase()),
            ),
        );

        const agents = AI_AGENTS.filter((agent) =>
          memberAddresses.has(agent.address.toLowerCase()),
        );

        console.log("[ConversationView] Loaded agents from members:", {
          memberCount: members.length,
          agentCount: agents.length,
          agents: agents.map((a) => a.name),
        });

        setSelectedAgents(agents);
      } catch (error) {
        console.error(
          "[ConversationView] Error loading agents from members:",
          error,
        );
        setSelectedAgents([]);
      }
    };

    void loadAgentsFromMembers();
  }, [selectedConversation, client]);

  useEffect(() => {
    console.log("[ConversationView] Effect triggered", {
      hasClient: !!client,
      hasSelectedConversation: !!selectedConversation,
      conversationId: selectedConversation?.id,
      clientInboxId: client?.inboxId,
    });

    if (!client) {
      console.log("[ConversationView] Early return - no client");
      return;
    }

    if (!selectedConversation) {
      console.log("[ConversationView] Early return - no selectedConversation");
      return;
    }

    let mounted = true;

    const setupMessages = async () => {
      try {
        console.log(
          "[ConversationView] Setting up messages for conversation:",
          selectedConversation.id,
        );
        await selectedConversation.sync();
        console.log("[ConversationView] Conversation synced");
        const existingMessages = await selectedConversation.messages();
        console.log(
          "[ConversationView] Fetched messages:",
          existingMessages.length,
        );

        const chatMessages: Message[] = existingMessages
          .filter((msg: any) => typeof msg.content === "string")
          .map((msg: any) => ({
            id: msg.id,
            role: msg.senderInboxId === client.inboxId ? "user" : "assistant",
            content: msg.content as string,
          }));

        console.log(
          "[ConversationView] Processed chat messages:",
          chatMessages.length,
        );

        if (mounted) {
          setMessages(chatMessages);
          console.log("[ConversationView] Messages set in state");
        }

        const stream = await selectedConversation.stream({
          onValue: (message: any) => {
            if (!mounted || typeof message.content !== "string") {
              return;
            }

            const newMessage: Message = {
              id: message.id,
              role:
                message.senderInboxId === client.inboxId ? "user" : "assistant",
              content: message.content as string,
            };

            setMessages((prev) => {
              if (prev.some((m) => m.id === message.id)) {
                return prev;
              }
              return [...prev, newMessage];
            });
          },
        });

        return () => {
          stream.end().catch(console.error);
        };
      } catch (error) {
        console.error("[ConversationView] Error setting up messages:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to load messages";
        showToast(errorMessage, "error");
      }
    };

    void setupMessages();

    return () => {
      mounted = false;
    };
  }, [client, selectedConversation, showToast]);

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!client || !selectedConversation) {
        return;
      }

      const tempMessage: Message = {
        id: `temp-${Date.now()}`,
        role: "user",
        content,
      };

      setMessages((prev) => [...prev, tempMessage]);

      try {
        await selectedConversation.send(content);
        setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id));
      } catch (error) {
        console.error("[ConversationView] Error sending message:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Failed to send message";
        showToast(errorMessage, "error");
        setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id));
      }
    },
    [client, selectedConversation, showToast],
  );

  return (
    <div className="overscroll-behavior-contain flex h-dvh min-w-0 touch-pan-y flex-col bg-background">
      <ChatHeader />

      <div className="relative flex-1">
        <div className="absolute inset-0 touch-pan-y overflow-y-auto">
          <div className="mx-auto flex min-w-0 max-w-4xl flex-col gap-4 px-2 py-4 md:gap-6 md:px-4">
            {messages.length === 0 && <Greeting />}
            {messages.length > 0 && <MessageList messages={messages} />}
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 z-1 mx-auto flex w-full max-w-4xl gap-2 border-t-0 bg-background px-2 pb-3 md:px-4 md:pb-4">
        <InputArea
          selectedAgents={selectedAgents}
          setSelectedAgents={setSelectedAgents}
          messages={messages}
          sendMessage={(content) => {
            void handleSendMessage(content);
          }}
          conversation={selectedConversation}
        />
      </div>
    </div>
  );
}
