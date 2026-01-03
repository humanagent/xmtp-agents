import { SidebarProvider, SidebarInset } from "./components/ui/sidebar";
import { Sidebar } from "./components/sidebar";
import { ChatArea } from "./components/chat-area";

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

