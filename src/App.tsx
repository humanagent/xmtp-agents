import { SidebarInset, SidebarProvider } from "../components/ui/sidebar";
import { ChatArea } from "../components/chat-area";
import { Sidebar } from "../components/sidebar";

export default function App() {
  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar />
      <SidebarInset>
        <ChatArea />
      </SidebarInset>
    </SidebarProvider>
  );
}

