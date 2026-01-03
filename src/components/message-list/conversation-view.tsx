import { useState, useEffect, useCallback } from "react";
import { ChatHeader } from "../chat-area/chat-header";
import { Greeting } from "../chat-area/greeting";
import { InputArea } from "./input-area";
import { MessageList } from "./message-list";
import { useXMTPClient } from "../../hooks/use-xmtp-client";
import { useXMTPConversations } from "../../hooks/use-xmtp-conversations";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export function ConversationView() {
  const [messages, setMessages] = useState<Message[]>([]);
  const { client } = useXMTPClient();
  const { selectedConversation } = useXMTPConversations(client);

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
              role: message.senderInboxId === client.inboxId ? "user" : "assistant",
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
      }
    };

    setupMessages();

    return () => {
      mounted = false;
    };
  }, [client, selectedConversation]);

  const handleSendMessage = useCallback(async (content: string) => {
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
      setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id));
    }
  }, [client, selectedConversation]);

  return (
    <div className="overscroll-behavior-contain flex h-dvh min-w-0 touch-pan-y flex-col bg-background">
      <ChatHeader chatId="wireframe" isReadonly={false} />

      <div className="relative flex-1">
        <div className="absolute inset-0 touch-pan-y overflow-y-auto">
          <div className="mx-auto flex min-w-0 max-w-4xl flex-col gap-4 px-2 py-4 md:gap-6 md:px-4">
            {messages.length === 0 && <Greeting />}
            {messages.length > 0 && <MessageList messages={messages} />}
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 z-1 mx-auto flex w-full max-w-4xl gap-2 border-t-0 bg-background px-2 pb-3 md:px-4 md:pb-4">
        <InputArea messages={messages} sendMessage={handleSendMessage} />
      </div>
    </div>
  );
}
