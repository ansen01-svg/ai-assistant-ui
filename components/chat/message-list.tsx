"use client";

import { useEffect, useRef } from "react";

import { MessageItem } from "@/components/chat/message-item";
import { MESSAGE_WIDTH, type ChatMessage } from "@/components/chat/types";
import { cn } from "@/lib/utils";

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
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
}
