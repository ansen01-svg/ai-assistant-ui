"use client";

import { TasksView } from "@/components/tasks/tasks-view";
import { useTaskList } from "@/hooks/use-task-lists";
import { useParams } from "next/navigation";

export default function TaskListPage() {
  const { listId } = useParams<{ listId: string }>();
  const { data: list, error } = useTaskList(listId);

  if (error)
    return <p className="p-4 text-sm text-destructive">{error.message}</p>;
  return <TasksView listId={listId} title={list?.name ?? ""} />;
}
