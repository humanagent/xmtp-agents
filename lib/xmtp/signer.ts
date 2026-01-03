import type { Signer } from "@xmtp/browser-sdk";
import { toBytes } from "viem";
import {
  generatePrivateKey,
  privateKeyToAccount,
  type Hex,
} from "viem/accounts";

export function getOrCreateEphemeralAccountKey(): Hex {
  console.log(
    "[getOrCreateEphemeralAccountKey] Generating fresh ephemeral key",
  );

  if (typeof window === "undefined") {
    throw new Error(
      "getOrCreateEphemeralAccountKey can only be called in browser",
    );
  }

  const newKey = generatePrivateKey();
  console.log("[getOrCreateEphemeralAccountKey] Fresh key generated");
  return newKey;
}

export function createEphemeralSigner(privateKey: Hex): Signer {
  console.log("[createEphemeralSigner] Creating signer from private key");
  const account = privateKeyToAccount(privateKey);
  console.log("[createEphemeralSigner] Account created", {
    address: account.address,
  });

  const signer: Signer = {
    type: "EOA",
    getIdentifier: () => {
      const identifier = {
        identifier: account.address.toLowerCase(),
        identifierKind: "Ethereum" as const,
      };
      console.log("[createEphemeralSigner] getIdentifier called", identifier);
      return identifier;
    },
    signMessage: async (message: string) => {
      console.log("[createEphemeralSigner] signMessage called", {
        messageLength: message.length,
      });
      const signature = await account.signMessage({
        message,
      });
      const signatureBytes = toBytes(signature);
      console.log("[createEphemeralSigner] Message signed", {
        signatureLength: signatureBytes.length,
      });
      return signatureBytes;
    },
  };

  return signer;
}
