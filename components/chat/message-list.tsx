"use client";

import { useEffect, useRef } from "react";

import { MESSAGE_WIDTH, type ChatMessage } from "@/components/chat/types";
import { cn } from "@/lib/utils";
import { Markdown } from "./markdown";
import { MessageUsage } from "./message-usage";

const STICK_THRESHOLD_PX = 80;

export function MessageList({ messages }: { messages: ChatMessage[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);

  // Follow new content only if the user hasn't scrolled up to read
  function handleScroll() {
    const el = containerRef.current;
    if (!el) return;
    stickToBottom.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < STICK_THRESHOLD_PX;
  }

  useEffect(() => {
    const el = containerRef.current;
    if (el && stickToBottom.current) el.scrollTop = el.scrollHeight;
  }, [messages]);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto"
    >
      <div
        className={cn(
          "mx-auto flex w-full flex-col gap-6 px-4 pt-6 pb-12",
          MESSAGE_WIDTH,
        )}
      >
        {messages.map((m) =>
          m.role === "assistant" ? (
            <AssistantMessage key={m.id} message={m} />
          ) : (
            <div key={m.id} className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl bg-muted px-4 py-2 whitespace-pre-wrap">
                {m.content}
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

function AssistantMessage({ message: m }: { message: ChatMessage }) {
  const isStreaming = m.status === "streaming";

  return (
    <div className="flex gap-3">
      <div className="min-w-0 flex-1 pt-1">
        {m.content ? (
          <Markdown content={m.content} />
        ) : isStreaming ? (
          <span className="text-sm text-muted-foreground">Thinking…</span>
        ) : null}

        {m.status === "error" && (
          <p className="text-sm text-destructive">{m.error}</p>
        )}
        {m.status === "stopped" && (
          <p className="text-xs text-muted-foreground">Stopped</p>
        )}
        {!m.status && <MessageUsage message={m} />}
      </div>
    </div>
  );
}
