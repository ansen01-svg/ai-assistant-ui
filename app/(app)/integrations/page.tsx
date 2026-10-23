import type { Metadata } from "next"

import { ComingSoon } from "@/components/coming-soon"

export const metadata: Metadata = { title: "Integrations" }

export default function IntegrationsPage() {
  return <ComingSoon href="/integrations" />
}
