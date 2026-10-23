import type { Message } from "@/types/api";

export type MessageStatus = "streaming" | "stopped" | "error";

/** Input box width. */
export const INPUT_WIDTH = "max-w-3xl";
/** Message column width: narrower than the input, for comfortable reading. */
export const MESSAGE_WIDTH = "max-w-2xl";

/** A saved message, or one still streaming in the UI. */
export type ChatMessage = Message & {
  status?: MessageStatus;
  error?: string;
  stopReason?: string | null;
};
