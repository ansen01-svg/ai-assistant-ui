"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";

import { ApiError, apiRequest, isUnauthorized } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { readSSE } from "@/lib/sse";
import type { ChatRequest, ChatStreamEvent } from "@/types/api";

type DoneData = Extract<ChatStreamEvent, { event: "done" }>["data"];

export type StreamHandlers = {
  onStart: (conversationId: string) => void;
  onDelta: (text: string) => void;
  onTitle?: (title: string) => void;
  onTool?: (name: string) => void;
  onDone: (data: DoneData) => void;
  onError: (message: string) => void;
};

/**
 * Streams a reply from POST /chat/stream.
 * Streaming is local UI state, so it lives here instead of in TanStack Query;
 * the query cache is only told to refresh when the stream finishes.
 */
export function useChatStream() {
  const queryClient = useQueryClient();
  const controllerRef = useRef<AbortController | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  // Abort the request if the component unmounts mid-stream
  useEffect(() => () => controllerRef.current?.abort(), []);

  const send = useCallback(
    async (request: ChatRequest, handlers: StreamHandlers) => {
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;
      setIsStreaming(true);
      let usedTools = false;

      try {
        const res = await apiRequest("/chat/stream", {
          method: "POST",
          body: JSON.stringify({
            ...request,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          }),
          headers: { Accept: "text/event-stream" },
          signal: controller.signal,
        });
        if (!res.body) throw new ApiError(0, "Empty response from server");

        for await (const message of readSSE(res.body)) {
          const event = {
            event: message.event,
            data: JSON.parse(message.data),
          } as ChatStreamEvent;
          switch (event.event) {
            case "start":
              handlers.onStart(event.data.conversation_id);
              break;
            case "delta":
              handlers.onDelta(event.data.text);
              break;
            case "tool":
              usedTools = true;
              handlers.onTool?.(event.data.name);
              break;
            case "title":
              handlers.onTitle?.(event.data.title);
              break;
            case "done":
              handlers.onDone(event.data);
              queryClient.invalidateQueries({
                queryKey: queryKeys.conversations,
                exact: true,
              });
              if (usedTools) {
                // Tools may have created or changed tasks
                queryClient.invalidateQueries({ queryKey: queryKeys.tasks });
                queryClient.invalidateQueries({
                  queryKey: queryKeys.taskLists,
                });
              }
              if (request.document_ids?.length) {
                // Files attached in chat now appear on the Documents page
                queryClient.invalidateQueries({
                  queryKey: queryKeys.documents,
                });
              }
              break;
            case "error":
              handlers.onError(event.data.detail);
              break;
          }
        }
      } catch (error) {
        if (controller.signal.aborted) return; // stopped by the user or unmount
        if (isUnauthorized(error)) queryClient.setQueryData(queryKeys.me, null);
        handlers.onError(
          error instanceof Error ? error.message : "Something went wrong",
        );
      } finally {
        if (controllerRef.current === controller) {
          controllerRef.current = null;
          setIsStreaming(false);
        }
      }
    },
    [queryClient],
  );

  const stop = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setIsStreaming(false);
  }, []);

  return { send, stop, isStreaming };
}
