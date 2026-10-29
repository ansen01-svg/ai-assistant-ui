import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type TaskList = { id: string; name: string };

export function useTaskLists() {
  return useQuery({
    queryKey: queryKeys.taskLists,
    queryFn: () => api<TaskList[]>("/task-lists"),
  });
}

export function useTaskList(id: string) {
  return useQuery({
    queryKey: [...queryKeys.taskLists, id],
    queryFn: () => api<TaskList>(`/task-lists/${id}`),
  });
}

export function useDeleteTaskList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api<void>(`/task-lists/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.taskLists });
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks });
    },
  });
}
