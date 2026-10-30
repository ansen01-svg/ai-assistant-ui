// One place for every TanStack Query key, so invalidation never uses a typo'd key.
export const queryKeys = {
  me: ["me"] as const,
  conversations: ["conversations"] as const,
  conversation: (id: string) => ["conversations", id] as const,
  taskLists: ["task-lists"] as const,
  tasks: ["tasks"] as const,
  documents: ["documents"] as const,
};
