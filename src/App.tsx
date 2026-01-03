import { ChatArea, ConversationView } from "@components/chat-area/index";
import { Sidebar } from "@components/sidebar/sidebar";
import { useXMTPClient } from "@hooks/use-xmtp-client";
import { useXMTPConversations } from "@hooks/use-xmtp-conversations";
import { SidebarInset, SidebarProvider } from "@ui/sidebar";
import { Routes, Route, useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import type { Conversation } from "@xmtp/browser-sdk";
import { Loader2Icon } from "@ui/icons";

export default function App() {
  const { client } = useXMTPClient();
  const { conversations, setSelectedConversation, selectedConversation } = useXMTPConversations((client ?? null) as any);
  const location = useLocation();

  // Clear conversation when on home route
  useEffect(() => {
    if (location.pathname === "/") {
      setSelectedConversation(null);
    }
  }, [location.pathname, setSelectedConversation]);

  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        <Routes>
          <Route path="/" element={<ChatArea />} />
          <Route
            path="/chat/:conversationId"
            element={
              <ConversationRoute
                conversations={conversations}
                setSelectedConversation={setSelectedConversation}
                selectedConversation={selectedConversation}
                client={client}
              />
            }
          />
        </Routes>
      </SidebarInset>
    </SidebarProvider>
  );
}

function ConversationRoute({
  conversations,
  setSelectedConversation,
  selectedConversation,
  client,
}: {
  conversations: Conversation[];
  setSelectedConversation: (conversation: Conversation | null) => void;
  selectedConversation: Conversation | null;
  client: any;
}) {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedConversation, setFetchedConversation] =
    useState<Conversation | null>(null);
  const hasSetConversation = useRef(false);

  useEffect(() => {
    if (!client || !conversationId) {
      return;
    }

    const conversation = conversations.find((c) => c.id === conversationId);

    if (conversation) {
      setSelectedConversation(conversation);
      setFetchedConversation(conversation);
      hasSetConversation.current = true;
      setIsLoading(false);
    } else if (conversations.length > 0) {
      // Conversations loaded but this one doesn't exist, navigate to home
      navigate("/", { replace: true });
    }
  }, [conversationId, conversations, client, setSelectedConversation, navigate]);

  // Fetch conversation by ID if not found in array
  useEffect(() => {
    if (!client || !conversationId) {
      console.log("[ConversationRoute] Skipping fetch - no client or conversationId", {
        hasClient: !!client,
        conversationId,
      });
      return;
    }

    const conversation = conversations.find((c) => c.id === conversationId);

    if (conversation) {
      console.log("[ConversationRoute] Conversation found in array, skipping fetch");
      return;
    }

    if (hasSetConversation.current) {
      console.log("[ConversationRoute] Already set conversation, skipping fetch");
      return;
    }

    const fetchConversation = async () => {
      try {
        setIsLoading(true);
        console.log(
          "[ConversationRoute] Conversation not in array, fetching by ID:",
          conversationId,
        );

        // Sync conversations first to ensure it's in local database
        await client.conversations.sync();
        console.log("[ConversationRoute] Conversations synced");

        // Try to fetch by ID
        const foundConversation =
          await client.conversations.getConversationById(conversationId);

        if (foundConversation) {
          console.log(
            "[ConversationRoute] Conversation found by ID:",
            foundConversation.id,
          );
          setSelectedConversation(foundConversation);
          setFetchedConversation(foundConversation);
          hasSetConversation.current = true;
        } else {
          console.log(
            "[ConversationRoute] Conversation not found, navigating to home",
          );
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error(
          "[ConversationRoute] Error fetching conversation:",
          error,
        );
        navigate("/", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    void fetchConversation();
  }, [
    client,
    conversationId,
    conversations,
    navigate,
    setSelectedConversation,
  ]);

  // Reset ref when route changes
  useEffect(() => {
    hasSetConversation.current = false;
    setFetchedConversation(null);
  }, [location.pathname]);

  if (!conversationId) {
    return null;
  }

  const conversation =
    conversations.find((c) => c.id === conversationId) || fetchedConversation;

  // Ensure selectedConversation matches the route conversation before rendering
  const isConversationReady =
    selectedConversation?.id === conversationId && conversation;

  if (isLoading) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2Icon size={24} className="animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (!conversation) {
    return null;
  }

  // Wait for selectedConversation to match before rendering
  if (!isConversationReady) {
    console.log("[ConversationRoute] Waiting for selectedConversation to match", {
      conversationId,
      selectedConversationId: selectedConversation?.id,
      hasConversation: !!conversation,
      hasClient: !!client,
      isLoading,
    });
    return (
      <div className="flex h-dvh items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2Icon size={24} className="animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading conversation...</p>
        </div>
      </div>
    );
  }

  console.log("[ConversationRoute] Rendering ConversationView", {
    conversationId,
    selectedConversationId: selectedConversation?.id,
    hasClient: !!client,
  });

  return <ConversationView conversation={conversation} />;
}
