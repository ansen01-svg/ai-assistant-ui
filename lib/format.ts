// "YYYY-MM-DD" parsed as a local date (new Date("2026-10-30") would be UTC).
export function formatDueDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}
