// Mirrors the backend Pydantic schemas. Keep in sync with ai_assistant_server/schemas.

export type User = {
  id: string;
  email: string;
  name: string;
  is_active: boolean;
};

export type MessageRole = "user" | "assistant";

export type Attachment = {
  id: string;
  filename: string;
};

export type Message = {
  id: string;
  role: MessageRole;
  content: string;
  model: string | null;
  input_tokens: number | null;
  output_tokens: number | null;
  cost_usd: number | null;
  created_at: string;
  attachments?: Attachment[] | null;
};

export type ChatRequest = {
  conversation_id?: string;
  message: string;
  model: string;
  timezone?: string; // set by useChatStream
  document_ids?: string[];
};

export type ConversationSummary = {
  id: string;
  title: string | null;
  model: string | null;
  created_at: string;
  updated_at: string;
};

export type ConversationDetail = ConversationSummary & {
  messages: Message[];
};

export type LoginInput = { email: string; password: string };
export type RegisterInput = { email: string; name: string; password: string };

// SSE events sent by POST /chat/stream
export type ChatStreamEvent =
  | { event: "start"; data: { conversation_id: string } }
  | { event: "delta"; data: { text: string } }
  | {
      event: "done";
      data: {
        message_id: string;
        input_tokens: number;
        output_tokens: number;
        cost_usd: number | null;
        stop_reason: string | null;
      };
    }
  | { event: "error"; data: { detail: string } }
  | { event: "title"; data: { title: string } }
  | { event: "tool"; data: { name: string; input: Record<string, unknown> } };
