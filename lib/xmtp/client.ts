import { Client, type Signer } from "@xmtp/browser-sdk";
import { MarkdownCodec } from "@xmtp/content-type-markdown";
import { ReactionCodec } from "@xmtp/content-type-reaction";
import { ReadReceiptCodec } from "@xmtp/content-type-read-receipt";
import { RemoteAttachmentCodec } from "@xmtp/content-type-remote-attachment";
import { ReplyCodec } from "@xmtp/content-type-reply";
import { TransactionReferenceCodec } from "@xmtp/content-type-transaction-reference";
import { WalletSendCallsCodec } from "@xmtp/content-type-wallet-send-calls";
import type { Hex } from "viem";
import { createEphemeralSigner } from "./signer";

export async function createXMTPClient(
  accountKey: Hex,
  options?: {
    env?: "production" | "dev" | "local";
    loggingLevel?: "off" | "error" | "warn" | "info" | "debug";
    dbEncryptionKey?: Uint8Array;
  },
): Promise<Client> {
  console.log("[createXMTPClient] Starting client creation", {
    accountKeyLength: accountKey.length,
    env: options?.env ?? "dev",
    hasDbEncryptionKey: !!options?.dbEncryptionKey,
  });

  try {
    console.log("[createXMTPClient] Creating signer...");
    const signer = createEphemeralSigner(accountKey);
    console.log("[createXMTPClient] Signer created");

    const identifier = signer.getIdentifier();
    console.log("[createXMTPClient] Signer identifier", identifier);

    console.log("[createXMTPClient] Initializing codecs...");
    const codecs = [
      new ReactionCodec(),
      new ReplyCodec(),
      new RemoteAttachmentCodec(),
      new TransactionReferenceCodec(),
      new WalletSendCallsCodec(),
      new ReadReceiptCodec(),
      new MarkdownCodec(),
    ];
    console.log("[createXMTPClient] Codecs initialized", {
      count: codecs.length,
    });

    console.log("[createXMTPClient] Calling Client.create...");
    const client = await Client.create(signer, {
      env: options?.env ?? "dev",
      loggingLevel: options?.loggingLevel ?? "warn",
      dbEncryptionKey: options?.dbEncryptionKey,
      appVersion: "xmtp-agents/0.1.0",
      codecs,
    });

    console.log("[createXMTPClient] Client created successfully", {
      inboxId: client.inboxId,
      installationId: client.installationId,
    });

    return client;
  } catch (error) {
    console.error("[createXMTPClient] Error creating client", {
      error,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
}
