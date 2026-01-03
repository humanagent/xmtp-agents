import { generatePrivateKey } from "viem/accounts";
import type { PrivateKey } from "./signer";

export function getOrCreateEphemeralAccountKey(): PrivateKey {
  if (typeof window === "undefined") {
    throw new Error(
      "Ephemeral account key can only be created in browser environment",
    );
  }

  // always generate a new ephemeral identity
  const accountKey = generatePrivateKey();

  return accountKey;
}
