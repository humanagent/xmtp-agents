type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export function MessageList({ messages }: { messages: Message[] }) {
  return (
    <>
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
    </>
  );
}
