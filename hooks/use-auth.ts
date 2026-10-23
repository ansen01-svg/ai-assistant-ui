"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { api, isUnauthorized } from "@/lib/api"
import { queryKeys } from "@/lib/query-keys"
import type { LoginInput, RegisterInput, User } from "@/types/api"

/** Current user. `null` = not logged in, `undefined` = still loading. */
export function useMe() {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: async () => {
      try {
        return await api<User>("/auth/me")
      } catch (error) {
        if (isUnauthorized(error)) return null
        throw error
      }
    },
    staleTime: 5 * 60_000,
  })
}

export function useLogin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: LoginInput) =>
      api<User>("/auth/login", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: (user) => queryClient.setQueryData(queryKeys.me, user),
  })
}

export function useRegister() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: RegisterInput) =>
      api<User>("/auth/register", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: (user) => queryClient.setQueryData(queryKeys.me, user),
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => api<void>("/auth/logout", { method: "POST" }),
    // Clear cached data even if the request fails, so nothing from this user lingers
    onSettled: () => {
      queryClient.clear()
      queryClient.setQueryData(queryKeys.me, null)
    },
  })
}
