"use client";

import { useState } from "react";

import { type DocumentItem, useUploadDocument } from "@/hooks/use-documents";

const MAX_FILES = 3;
const MAX_BYTES = 10 * 1024 * 1024;

export function useChatAttachments() {
  const upload = useUploadDocument();
  const [items, setItems] = useState<DocumentItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function add(files: FileList | null) {
    setError(null);
    for (const file of Array.from(files ?? [])) {
      if (items.length >= MAX_FILES)
        return setError(`Up to ${MAX_FILES} files per message`);
      if (file.size > MAX_BYTES) {
        setError(`${file.name} is larger than 10 MB`);
        continue;
      }
      try {
        const doc = await upload.mutateAsync(file);
        setItems((prev) => [...prev, doc]);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
      }
    }
  }

  return {
    items,
    error,
    uploading: upload.isPending,
    add,
    remove: (id: string) => setItems((prev) => prev.filter((d) => d.id !== id)),
    clear: () => setItems([]),
  };
}
