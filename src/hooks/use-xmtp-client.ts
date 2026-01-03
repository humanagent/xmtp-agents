import type { Client } from "@xmtp/browser-sdk";
import { useEffect, useState } from "react";
import { createXMTPClient } from "@/lib/xmtp/client";
import { getOrCreateEphemeralAccountKey } from "@/lib/xmtp/signer";

export function useXMTPClient() {
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    let mounted = true;
    let clientRef: Client | null = null;

    const init = async () => {
      try {
        console.log("[useXMTPClient] Initializing...");
        setIsLoading(true);
        setError(null);

        await new Promise((resolve) => setTimeout(resolve, 100));

        console.log("[useXMTPClient] Getting ephemeral account key...");
        const accountKey = getOrCreateEphemeralAccountKey();
        console.log("[useXMTPClient] Account key obtained");

        console.log("[useXMTPClient] Creating XMTP client...");
        const xmtpClient = await createXMTPClient(accountKey);
        console.log("[useXMTPClient] XMTP client created");
        clientRef = xmtpClient;

        if (mounted) {
          setClient(xmtpClient);
          setIsLoading(false);
          console.log("[useXMTPClient] Client set in state");
        } else {
          console.log("[useXMTPClient] Component unmounted, closing client");
          xmtpClient.close();
        }
      } catch (err) {
        console.error("[useXMTPClient] Failed to initialize:", {
          error: err,
          errorMessage: err instanceof Error ? err.message : String(err),
          errorStack: err instanceof Error ? err.stack : undefined,
        });
        if (mounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setIsLoading(false);
        }
      }
    };

    init();

    return () => {
      mounted = false;
      if (clientRef) {
        clientRef.close();
      }
    };
  }, []);

  return { client, isLoading, error };
}
