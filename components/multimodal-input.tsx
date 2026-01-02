"use client";

import { ArrowUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type MultimodalInputProps = {
  input: string;
  setInput: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
};

export function MultimodalInput({
  input,
  setInput,
  onSubmit,
  isLoading,
}: MultimodalInputProps) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (!isLoading && input.trim()) {
        onSubmit();
      }
    }
  };

  return (
    <div className="border-t border-border bg-card/50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-3 items-end">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={isLoading}
            className="min-h-[60px] max-h-[200px] resize-none"
            rows={1}
          />
          <Button
            onClick={onSubmit}
            disabled={isLoading || !input.trim()}
            size="icon"
            className="h-[60px] w-[60px] shrink-0 rounded-full"
          >
            <ArrowUpIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
