import { Loader2Icon } from "./icons";

export function ThinkingIndicator({ message }: { message: string }) {
  return (
    <div className="flex w-full items-start gap-2 md:gap-3 justify-start">
      <div className="flex flex-col gap-2 md:gap-4 max-w-[calc(100%-2.5rem)] sm:max-w-[min(fit-content,80%)]">
        <div className="flex flex-col gap-2 overflow-hidden text-sm w-fit break-words rounded-md px-3 py-2 bg-secondary text-foreground">
          <div className="flex items-center gap-2">
            <Loader2Icon size={14} className="animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
