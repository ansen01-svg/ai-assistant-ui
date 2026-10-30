"use client";

import {
  ArrowUpIcon,
  Loader2Icon,
  PaperclipIcon,
  SquareIcon,
} from "lucide-react";
import { useRef, useState } from "react";

import { AttachmentChips } from "@/components/chat/attachment-chips";
import { ModelSelect } from "@/components/chat/model-select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChatAttachments } from "@/hooks/use-chat-attachments";
import type { ChatModel } from "@/lib/config";
import type { Attachment } from "@/types/api";

const MAX_LENGTH = 32_000; // matches backend ChatRequest.message max_length
const DEFAULT_PROMPT = "Summarize the attached document.";

type Props = {
  onSend: (text: string, attachments: Attachment[]) => void;
  onStop: () => void;
  isStreaming: boolean;
  model: ChatModel;
  onModelChange: (model: ChatModel) => void;
  autoFocus?: boolean;
};

export function ChatInput({
  onSend,
  onStop,
  isStreaming,
  model,
  onModelChange,
  autoFocus,
}: Props) {
  const attachments = useChatAttachments();
  const fileRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState("");

  const hasContent = text.trim().length > 0 || attachments.items.length > 0;
  const canSend = hasContent && !isStreaming && !attachments.uploading;

  function submit() {
    if (!canSend) return;
    const files = attachments.items.map(({ id, filename }) => ({
      id,
      filename,
    }));
    onSend(text.trim() || DEFAULT_PROMPT, files);
    setText("");
    attachments.clear();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Enter sends, Shift+Enter adds a new line; ignore Enter while an IME is composing
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="bg-background focus-within:ring-ring/50 rounded-2xl border p-2 shadow-sm focus-within:ring-[3px]"
    >
      {(attachments.items.length > 0 || attachments.error) && (
        <div className="space-y-1 px-1 pb-1">
          <AttachmentChips
            items={attachments.items}
            onRemove={attachments.remove}
          />
          {attachments.error && (
            <p className="text-destructive text-xs">{attachments.error}</p>
          )}
        </div>
      )}

      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={
          attachments.items.length > 0
            ? "Ask about the file..."
            : "Ask anything..."
        }
        maxLength={MAX_LENGTH}
        autoFocus={autoFocus}
        rows={1}
        className="max-h-60 min-h-11 resize-none border-none bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent"
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label="Attach file"
            disabled={isStreaming || attachments.uploading}
            onClick={() => fileRef.current?.click()}
          >
            {attachments.uploading ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <PaperclipIcon />
            )}
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.docx,.txt,.md"
            multiple
            hidden
            onChange={(e) => {
              attachments.add(e.target.files);
              e.target.value = "";
            }}
          />
          <ModelSelect
            value={model}
            onChange={onModelChange}
            disabled={isStreaming}
          />
        </div>

        {isStreaming ? (
          <Button
            type="button"
            size="icon"
            className="rounded-full"
            onClick={onStop}
            aria-label="Stop"
          >
            <SquareIcon className="fill-current" />
          </Button>
        ) : (
          <Button
            type="submit"
            size="icon"
            className="rounded-full"
            disabled={!canSend}
            aria-label="Send"
          >
            <ArrowUpIcon />
          </Button>
        )}
      </div>
    </form>
  );
}
