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

export type Task = ExtractedTask & {
  id: string;
  status: TaskStatus;
  list_id: string | null;
  remind_at: string | null; // ISO datetime
};

export type Extraction = { list_name: string; tasks: ExtractedTask[] };

const BASE = "/tasks";

export function useTasks(listId: string | null) {
  return useQuery({
    queryKey: [...queryKeys.tasks, listId ?? "inbox"],
    queryFn: () => api<Task[]>(listId ? `${BASE}?list_id=${listId}` : BASE),
  });
}

export function useExtractTasks() {
  return useMutation({
    mutationFn: (text: string) =>
      api<Extraction>(`${BASE}/extract`, {
        method: "POST",
        body: JSON.stringify({
          text,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      }),
  });
}

type CreateTasksInput = {
  tasks: ExtractedTask[];
  listId?: string;
  newListName?: string;
};

export function useCreateTasks() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tasks, listId, newListName }: CreateTasksInput) =>
      api<Task[]>(BASE, {
        method: "POST",
        body: JSON.stringify({
          tasks,
          list_id: listId,
          new_list_name: newListName,
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks });
      queryClient.invalidateQueries({ queryKey: queryKeys.taskLists });
    },
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
