import { ChatArea } from "@chat-area/index";
import { useXMTPClient } from "@hooks/use-xmtp-client";
import { useXMTPConversations } from "@hooks/use-xmtp-conversations";
import { ConversationView } from "@message-list/conversation-view";
import { Sidebar } from "@sidebar/sidebar";
import { SidebarInset, SidebarProvider } from "@ui/sidebar";

export default function App() {
  const { client } = useXMTPClient();
  const { selectedConversation } = useXMTPConversations(client);

  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        {selectedConversation ? <ConversationView /> : <ChatArea />}
      </SidebarInset>
    </SidebarProvider>
  );
}
