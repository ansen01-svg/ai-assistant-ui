import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type Priority = "low" | "medium" | "high";
export type TaskStatus = "todo" | "done";

export type ExtractedTask = {
  title: string;
  due_date: string | null;
  priority: Priority;
  notes: string | null;
};

export type Task = ExtractedTask & { id: string; status: TaskStatus };

const BASE = "/tasks";

export function useTasks() {
  return useQuery({
    queryKey: queryKeys.tasks,
    queryFn: () => api<Task[]>(BASE),
  });
}

export function useExtractTasks() {
  return useMutation({
    mutationFn: async (text: string) => {
      const data = await api<{ tasks: ExtractedTask[] }>(`${BASE}/extract`, {
        method: "POST",
        body: JSON.stringify({
          text,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });
      return data.tasks;
    },
  });
}

export function useCreateTasks() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tasks: ExtractedTask[]) =>
      api<Task[]>(BASE, {
        method: "POST",
        body: JSON.stringify({ tasks }),
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks }),
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      api<Task>(`${BASE}/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks }),
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api<void>(`${BASE}/${id}`, { method: "DELETE" }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks }),
  });
}
