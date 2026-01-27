export const Greeting = ({ onOpenAgents }: { onOpenAgents?: () => void }) => {
  return (
    <div
      className="mx-auto flex size-full max-w-3xl flex-col justify-center px-4 pt-8 pb-4 md:mt-16 md:px-8 md:pt-0"
      key="overview"
    >
      <div
        className="flex mt-10 items-center gap-2 font-semibold text-lg md:text-xl lg:text-2xl animate-fade-in-up"
        style={{ animationDelay: "100ms", animationDuration: "150ms" }}
      >
        <span>Hello there</span>
        <span
          className="inline-block animate-wave"
          style={{ transformOrigin: "70% 70%" }}
        >
          👋
        </span>
      </div>
      <div
        className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base lg:text-lg animate-fade-in-up"
        style={{ animationDelay: "150ms", animationDuration: "150ms" }}
      >
        This chat is secured by XMTP.{" "}
        {onOpenAgents && (
          <button
            type="button"
            onClick={onOpenAgents}
            className="text-accent underline transition-colors duration-200 hover:text-accent/80 active:scale-[0.97]"
          >
            Select an agent
          </button>
        )}{" "}
        to get started.
      </div>
    </div>
  );
};
