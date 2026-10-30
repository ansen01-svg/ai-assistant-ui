import { FileText, X } from "lucide-react";

type Item = { id: string; filename: string };

export function AttachmentChips({
  items,
  onRemove,
}: {
  items: Item[];
  onRemove?: (id: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((a) => (
        <span
          key={a.id}
          className="inline-flex max-w-56 items-center gap-1 rounded-md border bg-background px-2 py-1 text-xs"
        >
          <FileText className="size-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate">{a.filename}</span>
          {onRemove && (
            <button
              type="button"
              aria-label={`Remove ${a.filename}`}
              onClick={() => onRemove(a.id)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="size-3" />
            </button>
          )}
        </span>
      ))}
    </div>
  );
}
