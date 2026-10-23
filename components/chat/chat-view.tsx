"use client";

import { ChatInput } from "@/components/chat/chat-input";
import { MessageList } from "@/components/chat/message-list";
import {
  INPUT_WIDTH,
  MESSAGE_WIDTH,
  type ChatMessage,
} from "@/components/chat/types";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { useMe } from "@/hooks/use-auth";
import { useChatStream } from "@/hooks/use-chat-stream";
import { useConversation } from "@/hooks/use-conversations";
import { ApiError } from "@/lib/api";
import { CHAT_MODELS, DEFAULT_MODEL, type ChatModel } from "@/lib/config";
import { queryKeys } from "@/lib/query-keys";
import { cn } from "@/lib/utils";
import type { ConversationDetail } from "@/types/api";
import { useQueryClient } from "@tanstack/react-query";
import { MessageSquareOffIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const SUGGESTIONS = [
  "Explain how RAG works in simple terms",
  "Write a FastAPI endpoint that returns JSON",
  "Give me a checklist for a production launch",
];

const isChatModel = (value: string | null | undefined): value is ChatModel =>
  CHAT_MODELS.some((m) => m.id === value);

function newMessage(
  role: ChatMessage["role"],
  content: string,
  extra?: Partial<ChatMessage>,
): ChatMessage {
  return {
    id: crypto.randomUUID(), // temporary id until the server returns the real one
    role,
    content,
    model: null,
    input_tokens: null,
    output_tokens: null,
    cost_usd: null,
    created_at: new Date().toISOString(),
    ...extra,
  };
}

/** Chat screen. Without conversationId it is a new chat; the first reply creates the conversation. */
export function ChatView({ conversationId }: { conversationId?: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user } = useMe();
  const conversation = useConversation(conversationId);
  const { send, stop, isStreaming } = useChatStream();

  // Server messages are shown until the first send; after that, local state owns the list
  // (it holds the streaming draft). Remounting via key={id} resets it.
  const [localMessages, setLocalMessages] = useState<ChatMessage[] | null>(
    null,
  );
  const [selectedModel, setSelectedModel] = useState<ChatModel | null>(null);

  const messages: ChatMessage[] =
    localMessages ?? conversation.data?.messages ?? [];
  const savedModel = conversation.data?.model;
  const model =
    selectedModel ?? (isChatModel(savedModel) ? savedModel : DEFAULT_MODEL);

  function updateMessage(id: string, update: (m: ChatMessage) => ChatMessage) {
    setLocalMessages(
      (prev) => prev?.map((m) => (m.id === id ? update(m) : m)) ?? prev,
    );
  }

  async function handleSend(text: string) {
    const history = messages;
    const userMessage = newMessage("user", text);
    const draft = newMessage("assistant", "", { status: "streaming", model });
    setLocalMessages([...history, userMessage, draft]);

    let activeId = conversationId;
    let replyText = "";

    await send(
      { conversation_id: conversationId, message: text, model },
      {
        onStart: (id) => {
          activeId = id;
        },
        onDelta: (chunk) => {
          replyText += chunk;
          updateMessage(draft.id, (m) => ({
            ...m,
            content: m.content + chunk,
          }));
        },
        onDone: (data) => {
          const reply: ChatMessage = {
            ...draft,
            id: data.message_id,
            content: replyText,
            status: undefined,
            stopReason: data.stop_reason,
            input_tokens: data.input_tokens,
            output_tokens: data.output_tokens,
            cost_usd: data.cost_usd,
          };
          updateMessage(draft.id, () => reply);

          // First reply of a new chat: seed the cache, then move to the conversation's URL
          if (!conversationId && activeId) {
            const now = new Date().toISOString();
            queryClient.setQueryData<ConversationDetail>(
              queryKeys.conversation(activeId),
              {
                id: activeId,
                title: text.slice(0, 60),
                model,
                created_at: now,
                updated_at: now,
                messages: [...history, userMessage, reply],
              },
            );
            router.replace(`/chat/${activeId}`);
          } else if (activeId) {
            queryClient.invalidateQueries({
              queryKey: queryKeys.conversation(activeId),
            });
          }
        },
        onError: (detail) => {
          updateMessage(draft.id, (m) => ({
            ...m,
            status: "error",
            error: detail,
          }));
          toast.error(detail);
          // The user message may already be saved, so refresh the sidebar
          if (activeId)
            queryClient.invalidateQueries({
              queryKey: queryKeys.conversations,
              exact: true,
            });
        },
      },
    );
  }

  function handleStop() {
    stop();
    setLocalMessages(
      (prev) =>
        prev?.map((m) =>
          m.status === "streaming" ? { ...m, status: "stopped" } : m,
        ) ?? prev,
    );
  }

  if (conversation.isError) {
    const notFound =
      conversation.error instanceof ApiError &&
      [404, 422].includes(conversation.error.status);
    return (
      <Empty className="flex-1">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <MessageSquareOffIcon />
          </EmptyMedia>
          <EmptyTitle>
            {notFound ? "Conversation not found" : "Couldn't load conversation"}
          </EmptyTitle>
          <EmptyDescription>
            {notFound
              ? "It may have been deleted."
              : conversation.error.message}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link href="/chat" className={buttonVariants()}>
            New chat
          </Link>
        </EmptyContent>
      </Empty>
    );
  }

  const isLoading = Boolean(conversationId) && conversation.isPending;
  const isEmpty = !isLoading && messages.length === 0;

  const input = (
    <ChatInput
      onSend={handleSend}
      onStop={handleStop}
      isStreaming={isStreaming}
      model={model}
      onModelChange={setSelectedModel}
      autoFocus
    />
  );

  if (isEmpty) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          {user
            ? `Hi ${user.name.split(" ")[0]}, how can I help?`
            : "How can I help?"}
        </h2>
        <div className={cn("w-full", INPUT_WIDTH)}>{input}</div>
        <div className={cn("flex flex-wrap justify-center gap-2", INPUT_WIDTH)}>
          {SUGGESTIONS.map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => handleSend(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {isLoading ? (
        <div
          className={cn(
            "mx-auto flex w-full flex-1 flex-col gap-6 px-4 py-6",
            MESSAGE_WIDTH,
          )}
        >
          <Skeleton className="ml-auto h-10 w-1/2 rounded-2xl" />
          <Skeleton className="h-24 w-3/4" />
          <Skeleton className="ml-auto h-10 w-1/3 rounded-2xl" />
        </div>
      ) : (
        <MessageList messages={messages} />
      )}
      <div className={cn("mx-auto w-full px-4 pt-2 pb-4", INPUT_WIDTH)}>
        {input}
        <p className="text-muted-foreground mt-2 text-center text-xs">
          AI can make mistakes. Check important information.
        </p>
      </div>
    </div>
  );
}
