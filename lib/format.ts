// "YYYY-MM-DD" parsed as a local date (new Date("2026-10-30") would be UTC).
export function formatDueDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

/** "Today, 9:00 AM", "Tomorrow, 6:30 PM" or "31 Oct, 9:00 AM" in the user's local time. */
export function formatReminder(iso: string): string {
  const date = new Date(iso);
  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return `Today, ${time}`;
  if (date.toDateString() === tomorrow.toDateString())
    return `Tomorrow, ${time}`;
  return `${date.toLocaleDateString([], { day: "numeric", month: "short" })}, ${time}`;
}
