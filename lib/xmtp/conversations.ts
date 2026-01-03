import { Client, type Dm, type Group } from "@xmtp/browser-sdk";
import { AI_AGENTS } from "@/lib/agents";

export async function findOrCreateDmWithAddress(
  client: Client,
  agentAddress: string,
): Promise<Dm> {
  const inboxId = await client.findInboxIdByIdentifier({
    identifier: agentAddress.toLowerCase(),
    identifierKind: "Ethereum",
  });

  if (!inboxId) {
    throw new Error(`Address ${agentAddress} is not registered on XMTP`);
  }

  const existingDm = await client.conversations.getDmByInboxId(inboxId);
  if (existingDm) {
    return existingDm;
  }

  const newDm = await client.conversations.newDmWithIdentifier({
    identifier: agentAddress.toLowerCase(),
    identifierKind: "Ethereum",
  });

  return newDm;
}

export async function createGroupWithAgentAddresses(
  client: Client,
  agentAddresses: string[],
): Promise<Group> {
  if (agentAddresses.length === 0) {
    throw new Error("At least one agent address is required");
  }

  const identifiers = agentAddresses.map((address) => ({
    identifier: address.toLowerCase(),
    identifierKind: "Ethereum" as const,
  }));

  const agentNames = agentAddresses
    .map((addr) => {
      const agent = AI_AGENTS.find(
        (a) => a.address.toLowerCase() === addr.toLowerCase(),
      );
      return agent?.name || addr.slice(0, 6);
    })
    .join(", ");

  const groupName =
    agentAddresses.length === 1
      ? agentNames
      : `${agentNames} (${agentAddresses.length})`;

  const group = await client.conversations.newGroupWithIdentifiers(
    identifiers,
    {
      name: groupName,
      description: `Group chat with ${agentAddresses.length} agent${agentAddresses.length > 1 ? "s" : ""}`,
    },
  );

  return group;
}
