import type { Client, Conversation } from "@xmtp/browser-sdk";

export async function createGroupWithAgentAddresses(
  client: Client,
  agentAddresses: string[],
): Promise<Conversation> {
  console.log(
    "[createGroupWithAgentAddresses] Creating group with addresses:",
    agentAddresses,
  );

  const group = await client.conversations.newGroupWithIdentifiers(
    agentAddresses.map((address) => ({
      identifier: address.toLowerCase(),
      identifierKind: "Ethereum" as const,
    })),
    {
      name: `Group with ${agentAddresses.length} agent${agentAddresses.length > 1 ? "s" : ""}`,
      description: "Group conversation with AI agents",
    },
  );

  console.log("[createGroupWithAgentAddresses] Group created:", group.id);

  return group;
}
