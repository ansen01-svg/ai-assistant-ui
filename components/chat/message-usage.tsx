import type { ChatMessage } from "@/components/chat/types";

const numberFormat = new Intl.NumberFormat("en-US");

function formatCost(usd: number) {
  return usd < 0.01 ? `$${usd.toFixed(4)}` : `$${usd.toFixed(2)}`;
}

export function MessageUsage({ message }: { message: ChatMessage }) {
  if (message.input_tokens == null || message.output_tokens == null) {
    return null;
  }

  return (
    <p className="mt-1 text-xs tabular-nums text-muted-foreground">
      {numberFormat.format(message.input_tokens)} in ·{" "}
      {numberFormat.format(message.output_tokens)} out
      {message.cost_usd != null && ` · ${formatCost(message.cost_usd)}`}
    </p>
  );
}
