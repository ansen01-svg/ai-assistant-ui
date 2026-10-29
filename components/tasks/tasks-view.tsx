import { TaskExtractor } from "@/components/tasks/task-extractor";
import { TaskList } from "@/components/tasks/task-lists";

export function TasksView({
  listId,
  title,
}: {
  listId?: string;
  title: string;
}) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl space-y-8 p-4">
        <h1 className="text-lg font-semibold">{title}</h1>
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground">
            Extract from text
          </h2>
          <TaskExtractor listId={listId} />
        </section>
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground">Tasks</h2>
          <TaskList listId={listId ?? null} />
        </section>
      </div>
    </div>
  );
}
