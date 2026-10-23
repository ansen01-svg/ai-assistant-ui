"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api"
import { queryKeys } from "@/lib/query-keys"
import type { ConversationDetail, ConversationSummary } from "@/types/api"

export function useConversations() {
  return useQuery({
    queryKey: queryKeys.conversations,
    queryFn: () => api<ConversationSummary[]>("/conversations?limit=50"),
  })
}

export function useConversation(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.conversation(id ?? ""),
    queryFn: () => api<ConversationDetail>(`/conversations/${id}`),
    enabled: Boolean(id),
  })
}

export function useDeleteConversation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api<void>(`/conversations/${id}`, { method: "DELETE" }),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.conversation(id), exact: true })
      queryClient.setQueryData<ConversationSummary[]>(queryKeys.conversations, (old) =>
        old?.filter((c) => c.id !== id)
      )
    },
  })
}
