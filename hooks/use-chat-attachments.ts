"use client";

import { useState } from "react";

import { type DocumentItem, useUploadDocument } from "@/hooks/use-documents";

const MAX_FILES = 3;
const IMAGE = /\.(png|jpe?g|webp|gif)$/i;
const MAX_DOC_BYTES = 10 * 1024 * 1024;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export function useChatAttachments() {
  const upload = useUploadDocument();
  const [items, setItems] = useState<DocumentItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function add(files: FileList | null) {
    setError(null);
    let count = items.length; // `items` is stale inside this loop
    for (const file of Array.from(files ?? [])) {
      if (count >= MAX_FILES) {
        setError(`Up to ${MAX_FILES} files per message`);
        return;
      }
      const limit = IMAGE.test(file.name) ? MAX_IMAGE_BYTES : MAX_DOC_BYTES;
      if (file.size > limit) {
        setError(`${file.name} is larger than ${limit / 1024 / 1024} MB`);
        continue;
      }
      try {
        const doc = await upload.mutateAsync(file);
        setItems((prev) => [...prev, doc]);
        count++;
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
