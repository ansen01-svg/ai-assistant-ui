import type { Metadata } from "next"

import { ComingSoon } from "@/components/coming-soon"

export const metadata: Metadata = { title: "Tasks" }

export default function TasksPage() {
  return <ComingSoon href="/tasks" />
}
