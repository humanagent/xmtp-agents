import { ChatHeader } from "./chat-header";
import { LandingPage } from "./landing-page";

export function ChatArea() {
  return (
    <div className="overscroll-behavior-contain flex h-dvh min-w-0 touch-pan-y flex-col bg-background">
      <ChatHeader chatId="wireframe" isReadonly={false} />
      <LandingPage />
    </div>
  );
}
