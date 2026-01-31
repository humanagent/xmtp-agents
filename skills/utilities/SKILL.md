---
name: utilities
description: Shared utilities for XMTP browser SDK in React apps. Use when creating clients, managing consent, or handling content types. Triggers on createXMTPClient, content types, consent, or ephemeral signer.
---

# XMTP utilities

Shared utilities for XMTP browser SDK operations including client creation, consent management, and content types.

## When to apply

Reference these guidelines when:
- Creating XMTP client with codecs
- Managing conversation consent (allow/deny)
- Working with ephemeral signers
- Handling different content types

## Quick reference

- `createXMTPClient(signer, options)` - Create client with codecs
- `createEphemeralSigner(privateKey)` - Create signer from private key
- `getOrCreateEphemeralAccountKey()` - Get/create localStorage key
- `isConversationAllowed(conversation, client)` - Check consent state
- `denyConversation(conversation, client)` - Block a conversation
- `extractMemberAddresses(members)` - Get Ethereum addresses
- `deduplicateConversations(conversations)` - Remove duplicates

## Supported content types

```typescript
import { ReactionCodec } from "@xmtp/content-type-reaction";
import { ReplyCodec } from "@xmtp/content-type-reply";
import { RemoteAttachmentCodec } from "@xmtp/content-type-remote-attachment";
import { TransactionReferenceCodec } from "@xmtp/content-type-transaction-reference";
import { WalletSendCallsCodec } from "@xmtp/content-type-wallet-send-calls";
import { ReadReceiptCodec } from "@xmtp/content-type-read-receipt";
import { MarkdownCodec } from "@xmtp/content-type-markdown";
```

## Implementation snippets

**Create XMTP client:**

```typescript
import { Client } from "@xmtp/browser-sdk";

async function createXMTPClient(
  signer: Signer,
  options?: { env?: "dev" | "production"; appVersion?: string },
): Promise<Client> {
  if (typeof window === "undefined") {
    throw new Error("XMTP client can only be created in browser environment");
  }

  const codecs = [
    new ReactionCodec(),
    new ReplyCodec(),
    new RemoteAttachmentCodec(),
    new TransactionReferenceCodec(),
    new WalletSendCallsCodec(),
    new ReadReceiptCodec(),
    new MarkdownCodec(),
  ];

  return Client.create(signer, {
    env: options?.env ?? "production",
    appVersion: options?.appVersion ?? "xmtp-agents/0",
    codecs,
  });
}
```

**Ephemeral signer:**

```typescript
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { toBytes } from "viem";

function createEphemeralSigner(privateKey: Hex): Signer {
  const account = privateKeyToAccount(privateKey);
  return {
    type: "EOA",
    getIdentifier: () => ({
      identifier: account.address.toLowerCase(),
      identifierKind: "Ethereum",
    }),
    signMessage: async (message: string) => {
      const signature = await account.signMessage({ message });
      return toBytes(signature);
    },
  };
}

function getOrCreateEphemeralAccountKey(): Hex {
  const STORAGE_KEY = "xmtp-ephemeral-account-key";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return stored as Hex;

  const newKey = generatePrivateKey();
  localStorage.setItem(STORAGE_KEY, newKey);
  return newKey;
}

function clearEphemeralAccountKey(): void {
  localStorage.removeItem("xmtp-ephemeral-account-key");
}
```

**Consent management:**

```typescript
import { Group, ConsentState, ConsentEntityType } from "@xmtp/browser-sdk";

async function isConversationAllowed(
  conversation: Conversation,
  client: Client,
): Promise<boolean> {
  if (conversation instanceof Group) {
    const state = await conversation.consentState();
    return state !== ConsentState.Denied;
  }
  return true; // DMs always allowed
}

async function denyConversation(
  conversation: Conversation,
  client: Client,
): Promise<void> {
  await client.preferences.setConsentStates([{
    entity: conversation.id,
    entityType: ConsentEntityType.GroupId,
    state: ConsentState.Denied,
  }]);
}
```

**Deduplication:**

```typescript
function deduplicateConversations<T extends { id: string }>(
  conversations: T[],
): T[] {
  return Array.from(new Map(conversations.map((c) => [c.id, c])).values());
}
```

**Error handling:**

```typescript
function toError(err: unknown): Error {
  return err instanceof Error ? err : new Error(String(err));
}
```

## Key patterns

**Browser-only:** XMTP browser SDK uses OPFS - only works in browser

**Content types:** Register all codecs when creating client to handle different message types

**Consent states:** `Allowed`, `Denied`, `Unknown` - filter UI based on consent

**Ephemeral accounts:** Store private key in localStorage for anonymous users
