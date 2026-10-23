"use client"

import { useState } from "react"
import { ArrowUpIcon, SquareIcon } from "lucide-react"

import { ModelSelect } from "@/components/chat/model-select"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { ChatModel } from "@/lib/config"

const MAX_LENGTH = 32_000 // matches backend ChatRequest.message max_length

type Props = {
  onSend: (text: string) => void
  onStop: () => void
  isStreaming: boolean
  model: ChatModel
  onModelChange: (model: ChatModel) => void
  autoFocus?: boolean
}

export function ChatInput({ onSend, onStop, isStreaming, model, onModelChange, autoFocus }: Props) {
  const [text, setText] = useState("")
  const canSend = text.trim().length > 0 && !isStreaming

  function submit() {
    if (!canSend) return
    onSend(text.trim())
    setText("")
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Enter sends, Shift+Enter adds a new line; ignore Enter while an IME is composing
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
      className="bg-background focus-within:ring-ring/50 rounded-2xl border p-2 shadow-sm focus-within:ring-[3px]"
    >
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything..."
        maxLength={MAX_LENGTH}
        autoFocus={autoFocus}
        rows={1}
        className="max-h-60 min-h-11 resize-none border-none bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent"
      />
      <div className="flex items-center justify-between">
        <ModelSelect value={model} onChange={onModelChange} disabled={isStreaming} />
        {isStreaming ? (
          <Button type="button" size="icon" className="rounded-full" onClick={onStop} aria-label="Stop">
            <SquareIcon className="fill-current" />
          </Button>
        ) : (
          <Button type="submit" size="icon" className="rounded-full" disabled={!canSend} aria-label="Send">
            <ArrowUpIcon />
          </Button>
        )}
      </div>
    </form>
  )
}
