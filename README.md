# Agent Mini App Hooks

Minimal React hooks for building XMTP agent mini apps. Simple, composable hooks for all XMTP operations.

## Quick Start

```tsx
import { useClient } from "@/src/xmtp-hooks/use-client";
import { useConversations } from "@/src/xmtp-hooks/use-conversations";
import { useConversation } from "@/src/xmtp-hooks/use-conversation";

function MyAgentApp() {
  const { client, isLoading } = useClient();
  const { conversations } = useConversations(client);
  const { messages, send } = useConversation(conversationId, client);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id}>{msg.content}</div>
      ))}
      <button onClick={() => send("Hello!")}>Send</button>
    </div>
  );
}
```

## Hooks API

### `useClient()`

Initialize XMTP client. Returns singleton client instance with ephemeral account key stored in localStorage.

**Import:**

```tsx
import { useClient } from "@/src/xmtp-hooks/use-client";
```

**Returns:**

- `client` - `Client<ContentTypes> | null` - XMTP Client instance (null if loading/error)
- `isLoading` - `boolean` - Loading state
- `error` - `Error | null` - Error if initialization fails

**Example:**

```tsx
const { client, isLoading, error } = useClient();
```

**Notes:**

- Client is a singleton - multiple calls return the same instance
- Uses ephemeral account key stored in localStorage
- Automatically handles initialization and error states

---

### `useConversations(client)`

List and manage all conversations. Automatically filters blocked conversations and streams updates.

**Import:**

```tsx
import { useConversations } from "@/src/xmtp-hooks/use-conversations";
```

**Parameters:**

- `client` - `Client<ContentTypes> | null` - XMTP Client (from `useClient`)

**Returns:**

- `conversations` - `Conversation[]` - Array of allowed conversations
- `isLoading` - `boolean` - Loading state
- `error` - `Error | null` - Error if fetch fails
- `refresh` - `() => Promise<void>` - Manually refresh conversations list

**Example:**

```tsx
const { client } = useClient();
const { conversations, isLoading, refresh } = useConversations(client);

// Refresh conversations
await refresh();
```

**Notes:**

- Automatically filters out denied/blocked group conversations
- Streams new conversations in real-time
- Deduplicates conversations by ID

---

### `useConversation(conversationId, client)`

All-in-one hook for conversation operations. Handles messages, sending, members, and group operations.

**Import:**

```tsx
import { useConversation } from "@/src/xmtp-hooks/use-conversation";
```

**Parameters:**

- `conversationId` - `string | null | undefined` - Conversation ID
- `client` - `Client<ContentTypes> | null` - XMTP Client (from `useClient`)

**Returns:**

- `conversation` - `Conversation | null` - The conversation object
- `messages` - `Message[]` - All messages in conversation (with role: "user" | "assistant")
- `send` - `(content: string) => Promise<void>` - Send a text message
- `isLoading` - `boolean` - Loading state
- `error` - `Error | null` - Error if operation fails
- `isGroup` - `boolean` - True if group conversation
- `members` - `GroupMember[]` - Members (empty array for DM)
- `addMember` - `(address: string) => Promise<void>` - Add member by Ethereum address (group only)
- `removeMember` - `(inboxId: string) => Promise<void>` - Remove member by inbox ID (group only)

**Message Type:**

```tsx
type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sentAt?: Date;
};
```

**Example:**

```tsx
const { client } = useClient();
const {
  conversation,
  messages,
  send,
  isGroup,
  members,
  addMember,
  removeMember,
} = useConversation(conversationId, client);

// Send message
await send("Hello!");

// Add member to group
if (isGroup) {
  await addMember("0x123...");
}

// Remove member from group
if (isGroup) {
  await removeMember("inboxId123");
}
```

**Notes:**

- Messages are automatically assigned roles based on sender
- Streams new messages in real-time
- Only loads string content messages (filters other content types)
- Automatically loads members for group conversations

---

### `useConversationMembers(conversationId, client)`

Get members in a conversation. Returns raw XMTP members data.

**Import:**

```tsx
import { useConversationMembers } from "@/src/xmtp-hooks/use-conversation-members";
```

**Parameters:**

- `conversationId` - `string | null | undefined` - Conversation ID
- `client` - `Client<ContentTypes> | null` - XMTP Client (from `useClient`)

**Returns:**

- `members` - `GroupMember[]` - Members in conversation
- `isLoading` - `boolean` - Loading state
- `error` - `Error | null` - Error if fetch fails

**Example:**

```tsx
import { useConversationMembers } from "@/src/xmtp-hooks/use-conversation-members";
import { matchAgentsFromMembers } from "@/src/xmtp-hooks/utils";
import { AI_AGENTS } from "@/src/xmtp-hooks/agents";

const { client } = useClient();
const { members, isLoading } = useConversationMembers(conversationId, client);

// Match agents from members (business logic in utility)
const agents = matchAgentsFromMembers(members, AI_AGENTS);
```

---

### `useAgentSelection()`

Simple state hook for managing selected agents.

**Import:**

```tsx
import { useAgentSelection } from "@/src/xmtp-hooks/use-agent-selection";
```

**Returns:**

- `selectedAgents` - `AgentConfig[]` - Array of selected agents
- `setSelectedAgents` - `(agents: AgentConfig[]) => void` - Set agents directly
- `addAgent` - `(agent: AgentConfig) => void` - Add agent (prevents duplicates)
- `removeAgent` - `(address: string) => void` - Remove agent by address
- `clearSelection` - `() => void` - Clear all selected agents

**Example:**

```tsx
import { useAgentSelection } from "@/src/xmtp-hooks/use-agent-selection";
import { AI_AGENTS } from "@/src/xmtp-hooks/agents";

const { selectedAgents, addAgent, removeAgent, clearSelection } =
  useAgentSelection();

// Add agent
addAgent(AI_AGENTS[0]);

// Remove agent
removeAgent("0x123...");

// Clear all
clearSelection();
```

## Utilities

### Agent Configuration

**Import:**

```tsx
import {
  AI_AGENTS,
  getAgentByAddress,
  getAgentById,
  type AgentConfig,
} from "@/src/xmtp-hooks/agents";
```

**AgentConfig Type:**

```tsx
type AgentConfig = {
  name: string;
  address: string;
  networks: string[];
  live: boolean;
  image?: string;
  domain?: string;
  category?: string;
  description?: string;
};
```

**Functions:**

- `AI_AGENTS` - Array of all available agent configurations
- `getAgentByAddress(address: string)` - Find agent by Ethereum address
- `getAgentById(id: string)` - Find agent by name or domain

### Utility Functions

**Import:**

```tsx
import {
  matchAgentsFromMembers,
  extractMemberAddresses,
  assignMessageRole,
  createGroupWithAgentAddresses,
  isConversationAllowed,
  denyConversation,
  clearEphemeralAccountKey,
  type ContentTypes,
} from "@/src/xmtp-hooks/utils";
```

**Functions:**

- `matchAgentsFromMembers(members, agentList)` - Match group members to agent configs
- `extractMemberAddresses(members)` - Extract Ethereum addresses from members
- `assignMessageRole(message, clientInboxId)` - Assign "user" or "assistant" role to message
- `createGroupWithAgentAddresses(client, addresses)` - Create group with agent addresses
- `isConversationAllowed(conversation, client)` - Check if conversation is allowed (not denied)
- `denyConversation(conversation, client)` - Deny/block a group conversation
- `clearEphemeralAccountKey()` - Clear stored ephemeral account key
