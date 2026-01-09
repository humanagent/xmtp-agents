import type { Conversation, Client } from "@xmtp/browser-sdk";
import { Group, ConsentState, ConsentEntityType } from "@xmtp/browser-sdk";
import type { ContentTypes } from "@/lib/xmtp/client";

/**
 * Get consent state for a Group conversation.
 * NOTE: consentState is a function that returns Promise<ConsentState>, not a property.
 */
export async function getGroupConsentState(
  group: Group,
): Promise<ConsentState> {
  return await group.consentState();
}

/**
 * Check if a Group conversation is denied.
 */
export async function isGroupDenied(group: Group): Promise<boolean> {
  const state = await getGroupConsentState(group);
  return state === ConsentState.Denied;
}

/**
 * Deny a conversation by setting its consent state to Denied.
 */
export async function denyConversation(
  conversation: Conversation,
  client: Client<ContentTypes>,
): Promise<void> {
  await client.preferences.setConsentStates([
    {
      entity: conversation.id,
      entityType: ConsentEntityType.GroupId,
      state: ConsentState.Denied,
    },
  ]);
}

/**
 * Check if a conversation is allowed (not denied/blocked).
 */
export async function isConversationAllowed(
  conversation: Conversation,
  client: Client<ContentTypes>,
): Promise<boolean> {
  if (conversation instanceof Group) {
    return !(await isGroupDenied(conversation));
  }
  return true;
}
