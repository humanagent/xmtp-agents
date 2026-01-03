import { AgentSelector } from "@chat-area/agent-selector";
import { SuggestedActions } from "@chat-area/suggested-actions";
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@message-list/prompt-input";
import { Button } from "@ui/button";
import { ArrowUpIcon, PaperclipIcon } from "@ui/icons";
import { useState } from "react";
import { AI_AGENTS, type AgentConfig } from "@/lib/agents";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export function InputArea({
  messages = [],
  sendMessage,
}: {
  messages?: Message[];
  sendMessage?: (content: string) => void;
}) {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [attachments] = useState([]);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const [liveAgents] = useState(() =>
    shuffleArray(AI_AGENTS.filter((agent) => agent.live)),
  );
  const [selectedAgent, setSelectedAgent] = useState<AgentConfig | undefined>(
    liveAgents[0],
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const messageContent = input.trim();

    if (!messageContent || !sendMessage) {
      return;
    }

    sendMessage(messageContent);
    setInput("");
  };

  return (
    <div className="relative flex w-full flex-col gap-4">
      {messages.length === 0 && attachments.length === 0 && selectedAgent && (
        <SuggestedActions
          chatId="wireframe"
          sendMessage={sendMessage || (() => {})}
          selectedAgents={[selectedAgent]}
        />
      )}

      <PromptInput
        className="rounded-md border border-border bg-background p-3 transition-all duration-150 focus-within:border-border hover:border-muted-foreground/50"
        onSubmit={handleSubmit}>
        <div className="flex flex-row items-start gap-1 sm:gap-2">
          <PromptInputTextarea
            className="grow resize-none border-0! border-none! bg-transparent p-2 text-sm outline-none ring-0 [-ms-overflow-style:none] [scrollbar-width:none] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 [&::-webkit-scrollbar]:hidden"
            placeholder="Send a message..."
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />
        </div>
        <PromptInputToolbar className="border-top-0! border-t-0! p-0 shadow-none dark:border-0 dark:border-transparent!">
          <PromptInputTools className="gap-0 sm:gap-0.5">
            <Button
              className="h-8 p-1 md:h-fit md:p-2"
              type="button"
              variant="ghost">
              <PaperclipIcon size={16} />
            </Button>
            <AgentSelector onOpenChange={setOpen} open={open}>
              <AgentSelectorTrigger asChild>
                <Button
                  className="h-8 w-[200px] justify-between px-2"
                  variant="ghost">
                  <AgentSelectorName>
                    {selectedAgent?.name || "Select agent"}
                  </AgentSelectorName>
                </Button>
              </AgentSelectorTrigger>
              <AgentSelectorContent>
                <AgentSelectorInput placeholder="Search agents..." />
                <AgentSelectorList>
                  <AgentSelectorGroup heading="AI Agents">
                    {liveAgents.map((agent) => (
                      <AgentSelectorItem
                        key={agent.address}
                        value={agent.address}
                        onSelect={() => {
                          setSelectedAgent(agent);
                          setOpen(false);
                        }}>
                        <AgentSelectorName>{agent.name}</AgentSelectorName>
                      </AgentSelectorItem>
                    ))}
                  </AgentSelectorGroup>
                </AgentSelectorList>
              </AgentSelectorContent>
            </AgentSelector>
          </PromptInputTools>

          <PromptInputSubmit
            className="size-8 rounded-full bg-primary text-primary-foreground transition-colors duration-150 hover:bg-[#3d8aff] disabled:bg-muted disabled:text-muted-foreground"
            disabled={!input.trim()}>
            <ArrowUpIcon size={14} />
          </PromptInputSubmit>
        </PromptInputToolbar>
      </PromptInput>
    </div>
  );
}
