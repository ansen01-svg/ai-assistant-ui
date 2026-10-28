import { Badge } from "@/components/ui/badge";
import type { Priority } from "@/hooks/use-tasks";

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <Badge variant={priority === "high" ? "destructive" : "secondary"}>
      {priority}
    </Badge>
  );
}
