export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1"

export const CHAT_MODELS = [
  { id: "claude-sonnet-5-5", label: "Sonnet 5.5", description: "Balanced speed and quality" },
  { id: "claude-opus-5-5", label: "Opus 5.5", description: "Most capable" },
  { id: "claude-haiku-5-5", label: "Haiku 5.5", description: "Fastest and cheapest" },
] as const

export type ChatModel = (typeof CHAT_MODELS)[number]["id"]

export const DEFAULT_MODEL: ChatModel = "claude-sonnet-5-5"
