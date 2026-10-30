"use client";

import { PriorityBadge } from "@/components/tasks/priority-badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  useDeleteTask,
  useTasks,
  useUpdateTaskStatus,
} from "@/hooks/use-tasks";
import { formatDueDate, formatReminder } from "@/lib/format";
import { cn } from "@/lib/utils";
import { BellIcon, Trash2 } from "lucide-react";

export function TaskList({ listId }: { listId: string | null }) {
  const { data: tasks, isPending, error } = useTasks(listId);
  const updateStatus = useUpdateTaskStatus();
  const deleteTask = useDeleteTask();

  if (isPending)
    return <p className="text-sm text-muted-foreground">Loading tasks…</p>;
  if (error) return <p className="text-sm text-destructive">{error.message}</p>;
  if (tasks.length === 0)
    return <p className="text-sm text-muted-foreground">No tasks yet.</p>;

  return (
    <ul className="space-y-2">
      {tasks.map((task) => {
        const done = task.status === "done";
        return (
          <li
            key={task.id}
            className="flex items-start gap-3 rounded-lg border p-3"
          >
            <Checkbox
              className="mt-1"
              checked={done}
              onCheckedChange={(checked) =>
                updateStatus.mutate({
                  id: task.id,
                  status: checked ? "done" : "todo",
                })
              }
              aria-label={done ? "Mark as not done" : "Mark as done"}
            />
            <div className="min-w-0 flex-1 space-y-1">
              <p
                className={cn(
                  "font-medium",
                  done && "text-muted-foreground line-through",
                )}
              >
                {task.title}
              </p>
              {(task.due_date || task.remind_at) && (
                <p className="flex flex-wrap items-center gap-x-3 text-sm text-muted-foreground">
                  {task.due_date && (
                    <span>Due {formatDueDate(task.due_date)}</span>
                  )}
                  {task.remind_at && (
                    <span className="inline-flex items-center gap-1">
                      <BellIcon className="size-3.5" aria-hidden />
                      {formatReminder(task.remind_at)}
                    </span>
                  )}
                </p>
              )}
              {task.notes && (
                <p className="text-sm text-muted-foreground">{task.notes}</p>
              )}
            </div>
            <PriorityBadge priority={task.priority} />
            <Button
              variant="ghost"
              size="icon"
              aria-label="Delete task"
              onClick={() => deleteTask.mutate(task.id)}
            >
              <Trash2 />
            </Button>
          </li>
        );
      })}
    </ul>
  );
}
