import { Client } from "@xmtp/browser-sdk";
import type { DecodedMessage } from "@xmtp/browser-sdk";
import type { Wallet, HDNodeWallet } from "ethers";
import { getBytes } from "ethers";

// Use any for now since the SDK types are not fully exposed
type Dm = any;

export type XMTPMessage = {
  id: string;
  content: string;
  senderAddress: string; // Actually senderInboxId
  sentAt: Date;
};

function createXMTPSigner(wallet: Wallet | HDNodeWallet) {
  return {
    getAddress: async () => wallet.address,
    signMessage: async (message: string) => {
      const signature = await wallet.signMessage(message);
      return getBytes(signature);
    },
  };
}

export async function createXMTPClient(
  wallet: Wallet | HDNodeWallet
): Promise<Client> {
  console.log("[XMTP] Starting client creation...");
  console.log("[XMTP] Wallet address:", wallet.address);
  
  const signer = createXMTPSigner(wallet);
  console.log("[XMTP] Signer created");
  
  const encryptionKey = new Uint8Array(32);
  console.log("[XMTP] Encryption key generated");
  
  console.log("[XMTP] Calling Client.create...");
  try {
    const client = await Client.create(signer, encryptionKey);
    console.log("[XMTP] Client created successfully!");
    console.log("[XMTP] Inbox ID:", client.inboxId);
    return client;
  } catch (error) {
    console.error("[XMTP] Client creation failed:", error);
    console.error("[XMTP] Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
}

export async function startConversation(
  client: Client,
  agentAddress: string
): Promise<Dm> {
  // Create or get DM with the agent address
  // The SDK will handle finding existing conversations
  const dm = await (client.conversations as any).newDm(agentAddress.toLowerCase());
  return dm;
}

export async function sendMessage(
  conversation: Dm,
  content: string
): Promise<void> {
  await conversation.send(content);
}

export async function getMessages(conversation: Dm): Promise<XMTPMessage[]> {
  await conversation.sync();
  const messages = await conversation.messages();
  
  return messages.map((msg: DecodedMessage) => ({
    id: msg.id,
    content: msg.content as string,
    senderAddress: msg.senderInboxId,
    sentAt: new Date(Number(msg.sentAtNs) / 1_000_000), // Convert from nanoseconds
  }));
}

export async function streamMessages(
  conversation: Dm,
  onMessage: (message: XMTPMessage) => void
): Promise<() => Promise<void>> {
  const stream = await conversation.stream({
    onValue: (message: DecodedMessage) => {
      onMessage({
        id: message.id,
        content: message.content as string,
        senderAddress: message.senderInboxId,
        sentAt: new Date(Number(message.sentAtNs) / 1_000_000),
      });
    },
  });
  
  return async () => {
    await stream.end();
  };
}

export async function getConversations(client: Client): Promise<Dm[]> {
  await client.conversations.sync();
  const conversations = await client.conversations.list();
  // Filter to only return DMs
  return conversations.filter((c): c is Dm => c instanceof Object);
}
