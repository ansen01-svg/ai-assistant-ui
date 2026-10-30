"use client";

import { FileText, Loader2, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  type DocumentItem,
  type DocumentStatus,
  useDeleteDocument,
  useDocuments,
  useUploadDocument,
} from "@/hooks/use-documents";
import { formatBytes } from "@/lib/format";

const ACCEPT = ".pdf,.docx,.txt,.md";
const MAX_BYTES = 10 * 1024 * 1024;

const STATUS: Record<
  DocumentStatus,
  { label: string; variant: "default" | "secondary" | "destructive" }
> = {
  pending: { label: "Queued", variant: "secondary" },
  processing: { label: "Processing", variant: "secondary" },
  ready: { label: "Ready", variant: "default" },
  failed: { label: "Failed", variant: "destructive" },
};

export function DocumentsView() {
  const { data: docs = [], isLoading } = useDocuments();
  const upload = useUploadDocument();
  const remove = useDeleteDocument();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    setError(null);
    for (const file of Array.from(files ?? [])) {
      if (file.size > MAX_BYTES) {
        setError(`${file.name} is larger than 10 MB`);
        continue;
      }
      try {
        await upload.mutateAsync(file);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
      }
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleDelete(doc: DocumentItem) {
    if (
      confirm(
        `Delete "${doc.filename}"? Bobby will no longer be able to search it.`,
      )
    ) {
      remove.mutate(doc.id);
    }
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-3xl space-y-6 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold">Documents</h1>
            <p className="text-sm text-muted-foreground">
              PDF, DOCX, TXT or MD up to 10 MB. Ask Bobby questions about them
              in chat.
            </p>
          </div>
          <Button
            onClick={() => inputRef.current?.click()}
            disabled={upload.isPending}
          >
            {upload.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Upload />
            )}
            Upload
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            multiple
            hidden
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : docs.length === 0 ? (
          <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
            No documents yet. Upload one to get started.
          </div>
        ) : (
          <ul className="divide-y rounded-lg border">
            {docs.map((doc) => {
              const status = STATUS[doc.status];
              return (
                <li key={doc.id} className="flex items-center gap-3 p-3">
                  <FileText className="size-5 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {doc.filename}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatBytes(doc.size_bytes)}
                      {doc.status === "ready" &&
                        ` · ${doc.chunk_count} ${doc.chunk_count === 1 ? "chunk" : "chunks"}`}
                      {doc.error && ` · ${doc.error}`}
                    </p>
                  </div>
                  <Badge variant={status.variant}>
                    {(doc.status === "pending" ||
                      doc.status === "processing") && (
                      <Loader2 className="animate-spin" />
                    )}
                    {status.label}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${doc.filename}`}
                    onClick={() => handleDelete(doc)}
                  >
                    <Trash2 />
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
