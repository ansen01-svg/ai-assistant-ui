"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CHAT_MODELS, type ChatModel } from "@/lib/config"

type Props = {
  value: ChatModel
  onChange: (model: ChatModel) => void
  disabled?: boolean
}

export function ModelSelect({ value, onChange, disabled }: Props) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as ChatModel)} disabled={disabled}>
      <SelectTrigger size="sm" className="border-none shadow-none" aria-label="Model">
        {/* Show only the label in the trigger, not the description */}
        <SelectValue>{CHAT_MODELS.find((m) => m.id === value)?.label}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {CHAT_MODELS.map((model) => (
          <SelectItem key={model.id} value={model.id}>
            <div className="flex flex-col">
              <span>{model.label}</span>
              <span className="text-muted-foreground text-xs">{model.description}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
