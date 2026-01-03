import { ChatArea } from "@chat-area/index";
import { Sidebar } from "@sidebar/sidebar";
import { SidebarInset, SidebarProvider } from "@ui/sidebar";

export default function App() {
  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        <ChatArea />
      </SidebarInset>
    </SidebarProvider>
  );
}
