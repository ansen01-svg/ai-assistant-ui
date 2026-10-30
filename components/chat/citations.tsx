import { FileText } from "lucide-react";
import Link from "next/link";

// [file.pdf, chunk 3] (RAG) or [file.pdf] (attached file read in full)
const CITATION = /\[([^[\]]+?\.(?:pdf|docx|txt|md))(?:, chunk (\d+))?\]/gi;

export function Citations({ content }: { content: string }) {
  const sources = new Map<string, Set<number>>();
  for (const [, file, chunk] of content.matchAll(CITATION)) {
    if (!sources.has(file)) sources.set(file, new Set());
    if (chunk) sources.get(file)!.add(Number(chunk));
  }
  if (sources.size === 0) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {[...sources].map(([file, chunks]) => (
        <Link
          key={file}
          href="/documents"
          className="inline-flex items-center gap-1 rounded-md border bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground hover:bg-muted"
        >
          <FileText className="size-3" />
          {file}
          {chunks.size > 0 && (
            <span className="opacity-60">
              · {[...chunks].sort((a, b) => a - b).join(", ")}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}
