"use client";

import { PriorityBadge } from "@/components/tasks/priority-badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCreateTasks, useExtractTasks } from "@/hooks/use-tasks";
import { formatDueDate } from "@/lib/format";
import { useState } from "react";

export function TaskExtractor() {
  const [text, setText] = useState("");
  const extract = useExtractTasks();
  const createTasks = useCreateTasks();
  const extracted = extract.data ?? [];

  function save() {
    createTasks.mutate(extracted, {
      onSuccess: () => {
        extract.reset();
        setText("");
      },
    });
  }

  return (
    <div className="space-y-4">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste meeting notes, an email, or a brain dump…"
        rows={5}
        maxLength={10_000}
        className="max-h-64 overflow-y-auto"
      />
      <Button
        onClick={() => extract.mutate(text)}
        disabled={!text.trim() || extract.isPending}
      >
        {extract.isPending ? "Extracting…" : "Extract tasks"}
      </Button>

      {extract.error && (
        <p className="text-sm text-destructive">{extract.error.message}</p>
      )}
      {extract.data?.length === 0 && (
        <p className="text-sm text-muted-foreground">No tasks found.</p>
      )}

      {extracted.length > 0 && (
        <div className="space-y-2">
          <ul className="space-y-2">
            {extracted.map((task, i) => (
              <li
                key={i}
                className="space-y-1 rounded-lg border border-dashed p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium">{task.title}</p>
                  <PriorityBadge priority={task.priority} />
                </div>
                {task.due_date && (
                  <p className="text-sm text-muted-foreground">
                    Due {formatDueDate(task.due_date)}
                  </p>
                )}
                {task.notes && (
                  <p className="text-sm text-muted-foreground">{task.notes}</p>
                )}
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <Button onClick={save} disabled={createTasks.isPending}>
              {createTasks.isPending
                ? "Saving…"
                : `Save ${extracted.length} task${extracted.length > 1 ? "s" : ""}`}
            </Button>
            <Button variant="ghost" onClick={() => extract.reset()}>
              Discard
            </Button>
          </div>
          {createTasks.error && (
            <p className="text-sm text-destructive">
              {createTasks.error.message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
