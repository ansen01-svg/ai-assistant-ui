import type { Metadata } from "next"

import { ComingSoon } from "@/components/coming-soon"

export const metadata: Metadata = { title: "Agents" }

export default function AgentsPage() {
  return <ComingSoon href="/agents" />
}
