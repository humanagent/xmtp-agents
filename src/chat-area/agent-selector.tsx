import * as PopoverPrimitive from "@radix-ui/react-popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@ui/command";
import { Dialog, DialogContent, DialogTitle } from "@ui/dialog";
import * as React from "react";
import type { AgentConfig } from "@/lib/agents";
import { cn } from "@/lib/utils";

// Simple Dialog-based AgentSelector (for chat-area/input-area.tsx)
export type AgentSelectorDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agents: AgentConfig[];
  selectedAgents: AgentConfig[];
  onAddAgent: (agent: AgentConfig) => void;
  placeholder?: string;
};

export const AgentSelectorDialog = ({
  open,
  onOpenChange,
  agents,
  selectedAgents,
  onAddAgent,
  placeholder = "Search agents...",
}: AgentSelectorDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0">
        <DialogTitle className="sr-only">Agent Selector</DialogTitle>
        <Command className="**:data-[slot=command-input-wrapper]:h-auto">
          <CommandInput className="h-auto py-3.5" placeholder={placeholder} />
          <CommandList>
            <CommandGroup heading="AI Agents">
              {agents.map((agent) => {
                const isSelected = selectedAgents.some(
                  (a) => a.address === agent.address,
                );
                return (
                  <CommandItem
                    key={agent.address}
                    value={agent.address}
                    disabled={isSelected}
                    onSelect={() => {
                      if (!isSelected) {
                        onAddAgent(agent);
                      }
                    }}
                    className={cn(isSelected && "opacity-50")}>
                    <span className="flex-1 truncate text-left">
                      {agent.name}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {agents.length === 0 && (
              <CommandEmpty>No agents found.</CommandEmpty>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

// Compound component pattern (for message-list/input-area.tsx)
const AgentSelectorRoot = PopoverPrimitive.Root;

const AgentSelectorTrigger = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.Trigger ref={ref} className={cn(className)} {...props} />
));
AgentSelectorTrigger.displayName = PopoverPrimitive.Trigger.displayName;

const AgentSelectorContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "start", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-[200px] rounded-md border bg-popover p-0 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
AgentSelectorContent.displayName = PopoverPrimitive.Content.displayName;

const AgentSelectorInput = React.forwardRef<
  React.ElementRef<typeof CommandInput>,
  React.ComponentPropsWithoutRef<typeof CommandInput>
>(({ className, ...props }, ref) => (
  <CommandInput
    ref={ref}
    className={cn("h-auto py-3.5", className)}
    {...props}
  />
));
AgentSelectorInput.displayName = "AgentSelectorInput";

const AgentSelectorList = React.forwardRef<
  React.ElementRef<typeof CommandList>,
  React.ComponentPropsWithoutRef<typeof CommandList>
>(({ className, ...props }, ref) => (
  <CommandList ref={ref} className={cn(className)} {...props} />
));
AgentSelectorList.displayName = "AgentSelectorList";

const AgentSelectorGroup = React.forwardRef<
  React.ElementRef<typeof CommandGroup>,
  React.ComponentPropsWithoutRef<typeof CommandGroup>
>(({ className, ...props }, ref) => (
  <CommandGroup ref={ref} className={cn(className)} {...props} />
));
AgentSelectorGroup.displayName = "AgentSelectorGroup";

const AgentSelectorItem = React.forwardRef<
  React.ElementRef<typeof CommandItem>,
  React.ComponentPropsWithoutRef<typeof CommandItem>
>(({ className, ...props }, ref) => (
  <CommandItem ref={ref} className={cn(className)} {...props} />
));
AgentSelectorItem.displayName = "AgentSelectorItem";

export type AgentSelectorNameProps = {
  selectedAgents?: AgentConfig[];
  children?: React.ReactNode;
};

export const AgentSelectorName = ({
  selectedAgents,
  children,
}: AgentSelectorNameProps) => {
  if (children) {
    return <span className="flex-1 truncate text-left">{children}</span>;
  }
  return (
    <span className="flex-1 truncate text-left">
      {selectedAgents && selectedAgents.length > 0
        ? `${selectedAgents.length} agent${selectedAgents.length > 1 ? "s" : ""}`
        : "Select agent"}
    </span>
  );
};

// Export compound component version (for message-list/input-area.tsx)
export {
  AgentSelectorRoot as AgentSelector,
  AgentSelectorTrigger,
  AgentSelectorContent,
  AgentSelectorInput,
  AgentSelectorList,
  AgentSelectorGroup,
  AgentSelectorItem,
};
