import { Client, type Dm } from "@xmtp/browser-sdk";

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
