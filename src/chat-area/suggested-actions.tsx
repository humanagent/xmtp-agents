import { Suggestion } from "@chat-area/suggestion";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { type AgentConfig } from "@/lib/agents";

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export function SuggestedActions({
  chatId: _chatId,
  sendMessage,
  selectedAgents,
}: {
  chatId: string;
  sendMessage: (content: string) => void;
  selectedAgents: AgentConfig[];
}) {
  const suggestedActions = useMemo(() => {
    if (selectedAgents.length === 0) {
      return [];
    }

    const allSuggestions: string[] = selectedAgents
      .flatMap((agent) => agent.suggestions || [])
      .filter((suggestion): suggestion is string => Boolean(suggestion));

    if (allSuggestions.length === 0) {
      return [];
    }

    const shuffled = shuffleArray(allSuggestions);
    return shuffled.slice(0, 4);
  }, [selectedAgents]);

  if (suggestedActions.length === 0) {
    return null;
  }

  return (
    <div
      className="grid w-full gap-2 sm:grid-cols-2"
      data-testid="suggested-actions">
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          initial={{ opacity: 0, y: 20 }}
          key={suggestedAction}
          transition={{ delay: 0.05 * index }}>
          <Suggestion
            className="h-auto w-full whitespace-normal p-3 text-left"
            onClick={(suggestion) => {
              sendMessage(suggestion);
            }}
            suggestion={suggestedAction}>
            {suggestedAction}
          </Suggestion>
        </motion.div>
      ))}
    </div>
  );
}
