import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@ui/command";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@ui/dialog";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type AgentSelectorProps = ComponentProps<typeof Dialog>;

export const AgentSelector = (props: AgentSelectorProps) => (
  <Dialog {...props} />
);

export type AgentSelectorTriggerProps = ComponentProps<typeof DialogTrigger>;

export const AgentSelectorTrigger = (props: AgentSelectorTriggerProps) => (
  <DialogTrigger {...props} />
);

export type AgentSelectorContentProps = ComponentProps<typeof DialogContent> & {
  title?: ReactNode;
};

export const AgentSelectorContent = ({
  className,
  children,
  title = "Agent Selector",
  ...props
}: AgentSelectorContentProps) => (
  <DialogContent className={cn("p-0", className)} {...props}>
    <DialogTitle className="sr-only">{title}</DialogTitle>
    <Command className="**:data-[slot=command-input-wrapper]:h-auto">
      {children}
    </Command>
  </DialogContent>
);

export type AgentSelectorDialogProps = ComponentProps<typeof CommandDialog>;

export const AgentSelectorDialog = (props: AgentSelectorDialogProps) => (
  <CommandDialog {...props} />
);

export type AgentSelectorInputProps = ComponentProps<typeof CommandInput>;

export const AgentSelectorInput = ({
  className,
  ...props
}: AgentSelectorInputProps) => (
  <CommandInput className={cn("h-auto py-3.5", className)} {...props} />
);

export type AgentSelectorListProps = ComponentProps<typeof CommandList>;

export const AgentSelectorList = (props: AgentSelectorListProps) => (
  <CommandList {...props} />
);

export type AgentSelectorEmptyProps = ComponentProps<typeof CommandEmpty>;

export const AgentSelectorEmpty = (props: AgentSelectorEmptyProps) => (
  <CommandEmpty {...props} />
);

export type AgentSelectorGroupProps = ComponentProps<typeof CommandGroup>;

export const AgentSelectorGroup = (props: AgentSelectorGroupProps) => (
  <CommandGroup {...props} />
);

export type AgentSelectorItemProps = ComponentProps<typeof CommandItem>;

export const AgentSelectorItem = (props: AgentSelectorItemProps) => (
  <CommandItem {...props} />
);

export type AgentSelectorShortcutProps = ComponentProps<typeof CommandShortcut>;

export const AgentSelectorShortcut = (props: AgentSelectorShortcutProps) => (
  <CommandShortcut {...props} />
);

export type AgentSelectorSeparatorProps = ComponentProps<
  typeof CommandSeparator
>;

export const AgentSelectorSeparator = (props: AgentSelectorSeparatorProps) => (
  <CommandSeparator {...props} />
);

export type AgentSelectorLogoProps = {
  className?: string;
  provider:
    | "moonshotai-cn"
    | "lucidquery"
    | "moonshotai"
    | "zai-coding-plan"
    | "alibaba"
    | "xai"
    | "vultr"
    | "nvidia"
    | "upstage"
    | "groq"
    | "github-copilot"
    | "mistral"
    | "vercel"
    | "nebius"
    | "deepseek"
    | "alibaba-cn"
    | "google-vertex-anthropic"
    | "venice"
    | "chutes"
    | "cortecs"
    | "github-models"
    | "togetherai"
    | "azure"
    | "baseten"
    | "huggingface"
    | "opencode"
    | "fastrouter"
    | "google"
    | "google-vertex"
    | "cloudflare-workers-ai"
    | "inception"
    | "wandb"
    | "openai"
    | "zhipuai-coding-plan"
    | "perplexity"
    | "openrouter"
    | "zenmux"
    | "v0"
    | "iflowcn"
    | "synthetic"
    | "deepinfra"
    | "zhipuai"
    | "submodel"
    | "zai"
    | "inference"
    | "requesty"
    | "morph"
    | "lmstudio"
    | "anthropic"
    | "aihubmix"
    | "fireworks-ai"
    | "modelscope"
    | "llama"
    | "scaleway"
    | "amazon-bedrock"
    | "cerebras"
    | (string & {});
};

export const AgentSelectorLogo = ({
  provider,
  className,
}: AgentSelectorLogoProps) => (
  <img
    alt={`${provider} logo`}
    className={cn("size-3 dark:invert", className)}
    height={12}
    src={`https://models.dev/logos/${provider}.svg`}
    width={12}
  />
);

export type AgentSelectorLogoGroupProps = ComponentProps<"div">;

export const AgentSelectorLogoGroup = ({
  className,
  ...props
}: AgentSelectorLogoGroupProps) => (
  <div
    className={cn(
      "-space-x-1 flex shrink-0 items-center [&>img]:rounded-full [&>img]:bg-background [&>img]:p-px [&>img]:ring-1 dark:[&>img]:bg-foreground",
      className,
    )}
    {...props}
  />
);

export type AgentSelectorNameProps = ComponentProps<"span">;

export const AgentSelectorName = ({
  className,
  ...props
}: AgentSelectorNameProps) => (
  <span className={cn("flex-1 truncate text-left", className)} {...props} />
);
