import { SidebarToggle } from "@sidebar/sidebar-toggle";
import { memo } from "react";

function PureChatHeader({
  _chatId,
  _isReadonly,
}: {
  _chatId: string;
  _isReadonly: boolean;
}) {
  return (
    <header className="sticky top-0 flex items-center gap-2 bg-background px-2 py-1.5 md:px-2">
      <SidebarToggle />
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
  return (
    prevProps.chatId === nextProps.chatId &&
    prevProps.isReadonly === nextProps.isReadonly
  );
});
