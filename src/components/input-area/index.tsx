import { useIsMobile } from "@hooks/use-mobile";
import { Button } from "@ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@ui/dialog";
import {
	ArrowUpIcon,
	Loader2Icon,
	MetadataIcon,
	PlusIcon,
	XIcon,
} from "@ui/icons";
import { Textarea } from "@ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui/tooltip";
import { useToast } from "@ui/toast";
import type { Conversation } from "@xmtp/browser-sdk";
import { Group } from "@xmtp/browser-sdk";
import { AnimatePresence, motion } from "framer-motion";
import {
	type ComponentProps,
	type HTMLAttributes,
	type KeyboardEventHandler,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { type AgentConfig, AI_AGENTS } from "@/agent-registry/agents";
import { cn } from "@/lib/utils";
import { useConversationsContext } from "@/src/contexts/xmtp-conversations-context";
import { PlusPanel } from "./plus-panel";

export type Message = {
	id: string;
	role: "user" | "assistant";
	content: string;
	sentAt?: Date;
};

function MetadataDialog({
	open,
	onOpenChange,
	conversation,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	conversation: Conversation | null;
}) {
	const [metadata, setMetadata] = useState<string>("");
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (open && conversation) {
			void (async () => {
				setIsLoading(true);
				try {
					console.log("[Metadata] Fetching conversation metadata");
					const members = await conversation.members();
					const isGroup = conversation instanceof Group;
					const conversationData = {
						id: conversation.id,
						...(isGroup
							? {
									name: (conversation as Group).name,
									description: (conversation as Group).description,
								}
							: {}),
						members: members.map((member) => ({
							inboxId: member.inboxId,
							accountIdentifiers: member.accountIdentifiers,
							installationIds: member.installationIds,
							permissionLevel: member.permissionLevel,
							consentState: member.consentState,
						})),
					};
					setMetadata(JSON.stringify(conversationData, null, 2));
					console.log("[Metadata] Conversation metadata fetched successfully");
				} catch (err) {
					console.error("[Metadata] Error fetching metadata:", err);
					setMetadata(
						JSON.stringify(
							{
								error:
									err instanceof Error
										? err.message
										: "Failed to fetch metadata",
							},
							null,
							2,
						),
					);
				} finally {
					setIsLoading(false);
				}
			})();
		}
	}, [open, conversation]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
				<DialogHeader className="flex-shrink-0">
					<DialogTitle>Conversation Metadata</DialogTitle>
					<DialogDescription>
						JSON details of the conversation including id, members, and other
						metadata.
					</DialogDescription>
				</DialogHeader>
				<div className="flex-1 min-h-0 overflow-hidden flex flex-col">
					{isLoading ? (
						<div className="py-8 text-center text-muted-foreground">
							Loading metadata...
						</div>
					) : (
						<pre className="flex-1 min-h-0 overflow-auto rounded border border-zinc-800 bg-zinc-950 p-4 text-[10px]">
							<code className="block whitespace-pre-wrap break-words">
								{metadata || "No data available"}
							</code>
						</pre>
					)}
				</div>
				<DialogFooter className="flex-shrink-0">
					<Button variant="ghost" onClick={() => onOpenChange(false)}>
						Close
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

type PromptInputProps = HTMLAttributes<HTMLFormElement>;

const PromptInput = ({ className, ...props }: PromptInputProps) => (
	<form
		className={cn(
			"w-full overflow-hidden rounded border border-zinc-800 bg-black",
			className,
		)}
		{...props}
	/>
);

type PromptInputTextareaProps = ComponentProps<typeof Textarea> & {
	minHeight?: number;
	maxHeight?: number;
	disableAutoResize?: boolean;
	resizeOnNewLinesOnly?: boolean;
};

const PromptInputTextarea = ({
	onChange,
	onKeyDown,
	className,
	placeholder = "What would you like to know?",
	minHeight: _minHeight = 48,
	maxHeight: _maxHeight = 164,
	disableAutoResize = false,
	resizeOnNewLinesOnly = false,
	...props
}: PromptInputTextareaProps) => {
	const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
		onKeyDown?.(e);

		if (e.key === "Enter") {
			if (e.nativeEvent.isComposing) {
				return;
			}

			if (e.shiftKey) {
				return;
			}

			e.preventDefault();
			const form = e.currentTarget.form;
			if (form) {
				form.requestSubmit();
			}
		}
	};

	return (
		<Textarea
			className={cn(
				"w-full resize-none rounded-none border-none p-3 shadow-none outline-hidden ring-0",
				disableAutoResize
					? "field-sizing-fixed"
					: resizeOnNewLinesOnly
						? "field-sizing-fixed"
						: "field-sizing-content max-h-[6lh]",
				"bg-transparent dark:bg-transparent",
				"focus-visible:ring-0",
				className,
			)}
			name="message"
			onChange={(e) => {
				onChange?.(e);
			}}
			onKeyDown={handleKeyDown}
			placeholder={placeholder}
			{...props}
		/>
	);
};

type PromptInputToolbarProps = HTMLAttributes<HTMLDivElement>;

const PromptInputToolbar = ({
	className,
	...props
}: PromptInputToolbarProps) => (
	<div
		className={cn("flex items-center justify-between p-1", className)}
		{...props}
	/>
);

type PromptInputToolsProps = HTMLAttributes<HTMLDivElement>;

const PromptInputTools = ({ className, ...props }: PromptInputToolsProps) => (
	<div
		className={cn(
			"flex items-center gap-1",
			"[&_button:first-child]:rounded-bl-xl",
			className,
		)}
		{...props}
	/>
);

type PromptInputSubmitProps = ComponentProps<typeof Button>;

const PromptInputSubmit = ({
	className,
	variant = "default",
	size = "icon",
	children,
	...props
}: PromptInputSubmitProps) => {
	return (
		<Button
			className={cn("gap-1.5 rounded", className)}
			size={size}
			type="submit"
			variant={variant}
			{...props}
		>
			{children}
		</Button>
	);
};

export function InputArea({
	selectedAgents,
	setSelectedAgents,
	sendMessage,
	messages: _messages,
	conversation,
	openAgentsDialog,
	onOpenAgentsDialogChange,
}: {
	selectedAgents?: AgentConfig[];
	setSelectedAgents?: (agents: AgentConfig[]) => void;
	sendMessage?: (content: string, agents?: AgentConfig[]) => void;
	messages?: Message[];
	conversation?: Conversation | null;
	openAgentsDialog?: boolean;
	onOpenAgentsDialogChange?: (open: boolean) => void;
}) {
	const [input, setInput] = useState("");
	const [plusPanelOpen, setPlusPanelOpen] = useState(false);
	const [metadataOpen, setMetadataOpen] = useState(false);
	const [conversationAgents, setConversationAgents] = useState<AgentConfig[]>(
		[],
	);
	const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
	const [confirmAddAgentOpen, setConfirmAddAgentOpen] = useState(false);
	const [agentToAdd, setAgentToAdd] = useState<AgentConfig | null>(null);
	const [isAddingAgent, setIsAddingAgent] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const panelRef = useRef<HTMLDivElement>(null);
	const isSubmittingRef = useRef(false);
	const isGroup = conversation instanceof Group;
	const isMobile = useIsMobile();
	const { refreshConversations } = useConversationsContext();
	const { showToast } = useToast();

	// Keyboard shortcut: CMD/CTRL + K to open plus panel
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				setPlusPanelOpen((prev) => !prev);
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, []);

	// Close panel when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				panelRef.current &&
				!panelRef.current.contains(event.target as Node)
			) {
				setPlusPanelOpen(false);
				onOpenAgentsDialogChange?.(false);
			}
		};

		if (plusPanelOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [plusPanelOpen, onOpenAgentsDialogChange]);

	// Sync openAgentsDialog prop with plusPanelOpen state
	useEffect(() => {
		if (openAgentsDialog) {
			setPlusPanelOpen(true);
			onOpenAgentsDialogChange?.(false); // Reset the external state
		}
	}, [openAgentsDialog, onOpenAgentsDialogChange]);

	// Determine context mode:
	// Chat Area Mode: selectedAgents provided AND conversation is null/undefined (conversation not started)
	// Message List Mode: conversation provided AND selectedAgents not provided (conversation ongoing)
	const isChatAreaMode =
		selectedAgents !== undefined && setSelectedAgents !== undefined;
	const isMessageListMode =
		conversation !== undefined && selectedAgents === undefined;

	console.log("[InputArea] Mode detection:", {
		hasSelectedAgents: selectedAgents !== undefined,
		hasSetSelectedAgents: setSelectedAgents !== undefined,
		hasConversation: conversation !== undefined,
		isChatAreaMode,
		isMessageListMode,
		conversationId: conversation?.id,
	});

	// Multi-agent mode: use props (for chat area)
	// Single-agent mode: use internal state (for message list)
	const isMultiAgentMode = isChatAreaMode;

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

	const [singleAgent, setSingleAgent] = useState<AgentConfig | undefined>(
		() => {
			if (!isMultiAgentMode && liveAgents.length > 0) {
				return liveAgents[0];
			}
			return undefined;
		},
	);

	const currentSelectedAgents = isMultiAgentMode
		? selectedAgents
		: singleAgent
			? [singleAgent]
			: [];

	useEffect(() => {
		if (!conversation) {
			setConversationAgents([]);
			if (!isMultiAgentMode) {
				setSingleAgent(undefined);
			}
			return;
		}

		if (!isMultiAgentMode) {
			setSingleAgent(undefined);
		}

		const loadConversationAgents = async () => {
			try {
				console.log(
					"[InputArea] Loading conversation agents for conversation:",
					conversation.id,
				);
				const members = await conversation.members();
				const memberAddresses = new Set(
					members.flatMap((member) =>
						member.accountIdentifiers
							.filter((id) => id.identifierKind === "Ethereum")
							.map((id) => id.identifier.toLowerCase()),
					),
				);

				console.log(
					"[InputArea] Member addresses:",
					Array.from(memberAddresses),
				);

				const agents = AI_AGENTS.filter((agent) =>
					memberAddresses.has(agent.address.toLowerCase()),
				);

				console.log(
					"[InputArea] Found agents:",
					agents.map((a) => a.name),
				);

				setConversationAgents(agents);

				if (!isMultiAgentMode && agents.length > 0) {
					console.log("[InputArea] Setting singleAgent to:", agents[0].name);
					setSingleAgent(agents[0]);
				} else if (!isMultiAgentMode && agents.length === 0) {
					console.log(
						"[InputArea] No agents found in conversation, clearing singleAgent",
					);
					setSingleAgent(undefined);
				}
			} catch (error) {
				console.error("[InputArea] Error loading conversation agents:", error);
				setConversationAgents([]);
				if (!isMultiAgentMode) {
					setSingleAgent(undefined);
				}
			}
		};

		void loadConversationAgents();
	}, [conversation, isMultiAgentMode]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: shuffleArray is a stable function defined above
	const suggestedActions = useMemo(() => {
		if (currentSelectedAgents.length === 0) {
			return [];
		}

		const allSuggestions: string[] = currentSelectedAgents
			.flatMap((agent) => agent.suggestions || [])
			.filter((suggestion): suggestion is string => Boolean(suggestion));

		if (allSuggestions.length === 0) {
			return [];
		}

		const shuffled = shuffleArray(allSuggestions);
		return shuffled.slice(0, 4);
	}, [currentSelectedAgents]);

	const handleAddAgent = (agent: AgentConfig) => {
		if (isMultiAgentMode) {
			const agents = selectedAgents || [];
			const setAgents = setSelectedAgents as (agents: AgentConfig[]) => void;
			// Check if agent is already selected
			const isAlreadySelected = agents.some((a) => a.address === agent.address);
			if (!isAlreadySelected) {
				// Add to array instead of replace
				setAgents([...agents, agent]);
			}
		} else {
			console.log(
				"[InputArea] handleAddAgent called in single-agent mode with agent:",
				agent.name,
			);
			console.log("[InputArea] Current conversation:", conversation?.id);
			if (conversation) {
				// If conversation exists and it's a group, show confirmation dialog
				if (isGroup && conversation instanceof Group) {
					setAgentToAdd(agent);
					setConfirmAddAgentOpen(true);
					setPlusPanelOpen(false);
					onOpenAgentsDialogChange?.(false);
					return;
				} else {
					console.log(
						"[InputArea] Conversation is not a group, cannot add agent",
					);
				}
				setPlusPanelOpen(false);
				onOpenAgentsDialogChange?.(false);
				textareaRef.current?.focus();
				return;
			}
			console.log(
				"[InputArea] No conversation, setting singleAgent to:",
				agent.name,
			);
			setSingleAgent(agent);
			setPlusPanelOpen(false);
			onOpenAgentsDialogChange?.(false);
			textareaRef.current?.focus();
		}

		textareaRef.current?.focus();
	};

	const handleConfirmAddAgent = async () => {
		if (!agentToAdd || !conversation || !(conversation instanceof Group)) {
			return;
		}

		setIsAddingAgent(true);
		try {
			console.log(
				"[InputArea] Adding agent to existing group conversation:",
				agentToAdd.name,
			);
			await conversation.addMembersByIdentifiers([
				{
					identifier: agentToAdd.address.toLowerCase(),
					identifierKind: "Ethereum" as const,
				},
			]);
			console.log("[InputArea] Agent added to group successfully");
			showToast(`Added ${agentToAdd.name} to the conversation`, "success");
			void refreshConversations();
			setConfirmAddAgentOpen(false);
			setAgentToAdd(null);
		} catch (error) {
			console.error(
				"[InputArea] Error adding agent to conversation:",
				error,
			);
			showToast(
				`Failed to add ${agentToAdd.name}. Please try again.`,
				"error",
			);
		} finally {
			setIsAddingAgent(false);
		}
	};

	const handleRemoveAgent = (address: string) => {
		if (isMultiAgentMode) {
			const agents = selectedAgents || [];
			const setAgents = setSelectedAgents as (agents: AgentConfig[]) => void;
			setAgents(agents.filter((a) => a.address !== address));
		}
	};

	const handleSelectMember = (address: string) => {
		// Check if member is already selected
		if (!selectedMembers.includes(address.toLowerCase())) {
			setSelectedMembers((prev) => [...prev, address.toLowerCase()]);
		}
	};

	const handleRemoveMember = (address: string) => {
		setSelectedMembers((prev) => prev.filter((a) => a !== address));
	};

	const truncateAddress = (address: string): string => {
		if (address.length <= 10) return address;
		return `${address.slice(0, 6)}...${address.slice(-4)}`;
	};

	const appendAgentMentions = (message: string): string => {
		// Use conversationAgents if available (existing conversation), otherwise use selected agents
		const agentsToMention =
			conversationAgents.length > 0
				? conversationAgents
				: currentSelectedAgents;

		if (agentsToMention.length === 0) {
			return message;
		}
		const mentions = agentsToMention.map((agent) => `@${agent.name}`).join(" ");
		return `${message} ${mentions}`;
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		e.stopPropagation();

		if (isSubmittingRef.current) {
			return;
		}

		const messageContent = input.trim();

		if (!messageContent || !sendMessage) {
			return;
		}

		if (isMultiAgentMode && currentSelectedAgents.length === 0) {
			return;
		}

		isSubmittingRef.current = true;

		try {
			const messageToSend = appendAgentMentions(messageContent);
			console.log("[InputArea] Sending message with mentions:", messageToSend);
			sendMessage?.(
				messageToSend,
				isMultiAgentMode ? currentSelectedAgents : undefined,
			);
			setInput("");
		} catch {
			// Error handling - sendMessage callback handles errors
		} finally {
			setTimeout(() => {
				isSubmittingRef.current = false;
			}, 100);
		}
	};

	const handleSuggestionClick = (suggestion: string) => {
		if (sendMessage) {
			const messageToSend = appendAgentMentions(suggestion);
			console.log(
				"[InputArea] Sending suggestion with mentions:",
				messageToSend,
			);
			sendMessage(
				messageToSend,
				isMultiAgentMode ? currentSelectedAgents : undefined,
			);
		}
	};

	return (
		<div
			className={`relative flex w-full flex-col ${isMultiAgentMode ? "gap-2" : "gap-4"}`}
		>
			{suggestedActions.length > 0 &&
				!input.trim() &&
				isChatAreaMode &&
				!conversation && (
					<div className="grid w-full gap-2 sm:grid-cols-2">
						{suggestedActions.map((suggestedAction, index) => (
							<motion.div
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 10 }}
								initial={{ opacity: 0, y: 10 }}
								key={suggestedAction}
								transition={{ delay: 0.05 * index, duration: 0.15 }}
							>
								<Button
									className="h-auto w-full whitespace-normal p-3 text-left"
									onClick={() => {
										handleSuggestionClick(suggestedAction);
									}}
									type="button"
									variant="outline"
								>
									{suggestedAction}
								</Button>
							</motion.div>
						))}
					</div>
				)}
			<div className="relative" ref={panelRef}>
				<PlusPanel
					open={plusPanelOpen}
					agents={liveAgents}
					selectedAgents={currentSelectedAgents}
					onSelectAgent={handleAddAgent}
					selectedMembers={selectedMembers}
					onSelectMember={handleSelectMember}
					isGroup={isGroup}
					group={isGroup ? (conversation as Group) : null}
					onClose={() => {
						setPlusPanelOpen(false);
						onOpenAgentsDialogChange?.(false);
						textareaRef.current?.focus();
					}}
				/>
				<PromptInput
					className={`rounded border border-zinc-800 bg-black transition-all duration-200 focus-within:border-zinc-700 hover:border-zinc-700 ${isMultiAgentMode ? "p-2" : "p-3"}`}
					onSubmit={handleSubmit}
				>
					<div className="flex items-start gap-2">
						<Button
							type="button"
							variant="ghost"
							className={cn(
								"shrink-0 p-0 transition-colors duration-200 active:scale-[0.97]",
								plusPanelOpen
									? "text-accent hover:text-accent"
									: "text-muted-foreground hover:text-foreground",
								isMobile ? "h-10 w-10" : "h-8 w-8",
							)}
							onClick={() => setPlusPanelOpen((prev) => !prev)}
						>
							<PlusIcon size={isMobile ? 20 : 16} />
						</Button>
						<PromptInputTextarea
							className={`grow resize-none border-0! border-none! bg-transparent text-xs outline-none ring-0 [-ms-overflow-style:none] [scrollbar-width:none] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 [&::-webkit-scrollbar]:hidden ${isMultiAgentMode ? "px-1 py-1 min-h-[24px] max-h-[120px]" : "p-2"}`}
							placeholder="Send a message..."
							value={input}
							onChange={(e) => {
								setInput(e.target.value);
							}}
							ref={textareaRef}
						/>
					</div>
					<PromptInputToolbar className="border-top-0! border-t-0! p-0 shadow-none dark:border-0 dark:border-transparent!">
						<PromptInputTools className="gap-0 sm:gap-0.5">
							<AnimatePresence mode="popLayout">
								{(currentSelectedAgents.length > 0 ||
									selectedMembers.length > 0) && (
									<motion.div
										initial={{ opacity: 0, width: 0 }}
										animate={{ opacity: 1, width: "auto" }}
										exit={{ opacity: 0, width: 0 }}
										transition={{ duration: 0.2 }}
										className="flex items-center gap-1.5 overflow-hidden flex-wrap"
									>
										{/* Agent chips */}
										{currentSelectedAgents.map((agent) => (
											<motion.div
												key={`agent-${agent.address}`}
												initial={{ opacity: 0, scale: 0.8 }}
												animate={{ opacity: 1, scale: 1 }}
												exit={{ opacity: 0, scale: 0.8 }}
												transition={{ duration: 0.15 }}
												className="inline-flex items-center gap-1 rounded bg-zinc-800 px-2 py-0.5 text-xs text-foreground h-6"
											>
												{agent.image ? (
													<img
														alt={agent.name}
														className="h-4 w-4 shrink-0 rounded object-cover"
														src={agent.image}
													/>
												) : (
													<div className="h-4 w-4 shrink-0 rounded bg-muted" />
												)}
												<span>{agent.name}</span>
												{isMultiAgentMode && (
													<button
														type="button"
														onClick={() => {
															handleRemoveAgent(agent.address);
														}}
														className="rounded hover:bg-zinc-700 p-0.5 transition-colors duration-200 active:scale-[0.97]"
													>
														<XIcon size={12} />
													</button>
												)}
											</motion.div>
										))}

										{/* Member chips */}
										{selectedMembers.map((address) => (
											<motion.div
												key={`member-${address}`}
												initial={{ opacity: 0, scale: 0.8 }}
												animate={{ opacity: 1, scale: 1 }}
												exit={{ opacity: 0, scale: 0.8 }}
												transition={{ duration: 0.15 }}
												className="inline-flex items-center gap-1 rounded bg-zinc-800 px-2 py-0.5 text-xs text-foreground h-6"
											>
												<span>{truncateAddress(address)}</span>
												<button
													type="button"
													onClick={() => {
														handleRemoveMember(address);
													}}
													className="rounded hover:bg-zinc-700 p-0.5 transition-colors duration-200 active:scale-[0.97]"
												>
													<XIcon size={12} />
												</button>
											</motion.div>
										))}
									</motion.div>
								)}
							</AnimatePresence>
						</PromptInputTools>

						<div className="flex items-center gap-1">
							{!isMobile && conversation && (
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											className={
												isMultiAgentMode ? "h-7 w-7 p-0" : "h-8 w-8 p-0"
											}
											variant="ghost"
											type="button"
											onClick={() => setMetadataOpen(true)}
										>
											<MetadataIcon size={isMultiAgentMode ? 12 : 14} />
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										View {isGroup ? "group" : "conversation"} metadata
									</TooltipContent>
								</Tooltip>
							)}
							<PromptInputSubmit
								className={`rounded bg-accent text-accent-foreground transition-all duration-200 hover:bg-accent/90 hover:shadow-[0_0_12px_rgba(207,28,15,0.4)] active:scale-[0.97] disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none ${isMobile ? "size-10" : isMultiAgentMode ? "size-7" : "size-8"}`}
								disabled={
									!input.trim() ||
									(isMultiAgentMode && currentSelectedAgents.length === 0)
								}
							>
								<ArrowUpIcon
									size={isMobile ? 16 : isMultiAgentMode ? 12 : 14}
								/>
							</PromptInputSubmit>
						</div>
					</PromptInputToolbar>
				</PromptInput>
			</div>
			{conversation && (
				<MetadataDialog
					open={metadataOpen}
					onOpenChange={setMetadataOpen}
					conversation={conversation}
				/>
			)}
			<Dialog open={confirmAddAgentOpen} onOpenChange={setConfirmAddAgentOpen}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Add agent to conversation</DialogTitle>
						<DialogDescription>
							{agentToAdd && (
								<div className="flex items-center gap-3 mt-2">
									{agentToAdd.image ? (
										<img
											alt={agentToAdd.name}
											className="h-12 w-12 shrink-0 rounded object-cover"
											src={agentToAdd.image}
										/>
									) : (
										<div className="h-12 w-12 shrink-0 rounded bg-muted" />
									)}
									<div className="flex flex-col flex-1 min-w-0">
										<span className="text-sm font-medium text-foreground">
											{agentToAdd.name}
										</span>
										{agentToAdd.tagline && (
											<span className="text-xs text-muted-foreground">
												{agentToAdd.tagline}
											</span>
										)}
									</div>
								</div>
							)}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="ghost"
							onClick={() => {
								setConfirmAddAgentOpen(false);
								setAgentToAdd(null);
							}}
							disabled={isAddingAgent}
						>
							Cancel
						</Button>
						<Button
							className="bg-accent text-accent-foreground hover:bg-accent/90"
							onClick={handleConfirmAddAgent}
							disabled={isAddingAgent}
						>
							{isAddingAgent ? (
								<>
									<Loader2Icon
										className="mr-2 h-4 w-4 animate-spin"
										size={16}
									/>
									Adding...
								</>
							) : (
								"Add agent"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
