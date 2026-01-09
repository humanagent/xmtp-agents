import { AI_AGENTS } from "@/agent-registry/agents";

export interface ConversationMetadata {
  name: string;
  description: string;
}

export async function generateConversationMetadata(
  firstMessage: string,
  agentAddresses: string[],
): Promise<ConversationMetadata> {
  return getFallbackMetadata(agentAddresses);
}

function getFallbackMetadata(agentAddresses: string[]): ConversationMetadata {
  const agentNames = agentAddresses
    .map((addr) => {
      const normalizedAddr = addr.toLowerCase();
      return AI_AGENTS.find(
        (agent) => agent.address.toLowerCase() === normalizedAddr,
      );
    })
    .filter((agent): agent is NonNullable<typeof agent> => agent !== undefined)
    .map((agent) => agent.name);

  if (agentNames.length > 0) {
    const name =
      agentNames.length === 1
        ? `Chat with ${agentNames[0]}`
        : `Chat with ${agentNames.join(", ")}`;
    return { name, description: `Conversation with ${agentNames.join(", ")}` };
  }

  return { name: "Agent Group", description: "Group conversation" };
}
