import { AlertCircleIcon } from "lucide-react";

import { Markdown } from "@/components/chat/markdown";
import type { ChatMessage } from "@/components/chat/types";
import { cn } from "@/lib/utils";

export function MessageItem({ message }: { message: ChatMessage }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="bg-muted max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap wrap-break-word">
          {message.content}
        </div>
      </div>
    );
  }

  const isThinking = message.status === "streaming" && !message.content;

  return (
    <div className="flex flex-col gap-2">
      {isThinking ? (
        <div className="flex gap-1 py-2" aria-label="Assistant is typing">
          {[0, 150, 300].map((delay) => (
            <span
              key={delay}
              className="bg-muted-foreground size-1.5 animate-bounce rounded-full"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
      ) : (
        <Markdown content={message.content} />
      )}

      {message.status === "stopped" && <Note>Stopped</Note>}
      {message.stopReason === "max_tokens" && (
        <Note>Response cut off at the length limit.</Note>
      )}
      {message.status === "error" && (
        <Note className="text-destructive">
          <AlertCircleIcon className="size-3.5" />
          {message.error ?? "Something went wrong."}
        </Note>
      )}
    </div>
  );
}

function Note({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p
      className={cn(
        "text-muted-foreground flex items-center gap-1.5 text-xs",
        className,
      )}
    >
      {children}
    </p>
  );
}
