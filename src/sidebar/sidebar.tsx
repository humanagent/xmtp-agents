import { useXMTPClient } from "@hooks/use-xmtp-client";
import { useXMTPConversations } from "@hooks/use-xmtp-conversations";
import { SidebarUserNav } from "@sidebar/sidebar-user-nav";
import { Button } from "@ui/button";
import { PlusIcon, TrashIcon } from "@ui/icons";
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Sidebar as SidebarUI,
} from "@ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui/tooltip";
import type { Conversation } from "@xmtp/browser-sdk";
import { useEffect, useState } from "react";

export function Sidebar() {
  const { client } = useXMTPClient();
  const { conversations, selectedConversation, setSelectedConversation } =
    useXMTPConversations(client);
  const [conversationLabels, setConversationLabels] = useState<
    Map<string, string>
  >(new Map());

  useEffect(() => {
    if (!client || conversations.length === 0) {
      return;
    }

    const loadLabels = async () => {
      const labels = new Map<string, string>();

      for (const conversation of conversations) {
        try {
          const members = await conversation.members();
          const otherMember = members.find(
            (m) =>
              m.inboxId.toLowerCase() !== (client?.inboxId || "").toLowerCase(),
          );

          if (otherMember) {
            const address = otherMember.inboxId;
            labels.set(
              conversation.id,
              address.slice(0, 6) + "..." + address.slice(-4),
            );
          } else {
            labels.set(conversation.id, "Unknown");
          }
        } catch (error) {
          console.error(
            `[Sidebar] Error loading label for conversation ${conversation.id}:`,
            error,
          );
          labels.set(conversation.id, "Unknown");
        }
      }

      setConversationLabels(labels);
    };

    void loadLabels();
  }, [client, conversations]);

  const handleConversationClick = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  return (
    <SidebarUI className="group-data-[side=left]:border-r-0">
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex flex-row items-center justify-between">
            <span className="cursor-pointer rounded-md px-2 font-semibold text-lg hover:bg-muted">
              XMTP Agents
            </span>
            <div className="flex flex-row gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="h-8 p-1 md:h-fit md:p-2"
                    type="button"
                    variant="ghost">
                    <TrashIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent align="end" className="hidden md:block">
                  Delete All Chats
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="h-8 p-1 md:h-fit md:p-2"
                    type="button"
                    variant="ghost">
                    <PlusIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent align="end" className="hidden md:block">
                  New Chat
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {!conversations || conversations.length === 0 ? (
            <div className="flex w-full flex-row items-center justify-center gap-2 px-2 py-8 text-sm text-muted-foreground">
              Your conversations will appear here once you start chatting!
            </div>
          ) : (
            conversations.map((conversation) => {
              const label =
                conversationLabels.get(conversation.id) ||
                conversation.id.slice(0, 20) ||
                "Conversation";
              const isActive = selectedConversation?.id === conversation.id;

              return (
                <SidebarMenuItem key={conversation.id}>
                  <SidebarMenuButton
                    isActive={isActive}
                    onClick={() => {
                      handleConversationClick(conversation);
                    }}>
                    <span className="truncate">{label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarUserNav />
      </SidebarFooter>
    </SidebarUI>
  );
}
