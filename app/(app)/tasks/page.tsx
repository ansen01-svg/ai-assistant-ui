import { TaskExtractor } from "@/components/tasks/task-extractor";
import { TaskList } from "@/components/tasks/task-lists";

export default function TasksPage() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl space-y-8 p-4">
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground">
            Extract from text
          </h2>
          <TaskExtractor />
        </section>
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground">
            Your tasks
          </h2>
          <TaskList />
        </section>
      </div>
    </div>
  );
}
