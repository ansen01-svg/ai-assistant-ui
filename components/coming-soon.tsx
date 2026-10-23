import { Badge } from "@/components/ui/badge"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { findNavItem } from "@/lib/nav"

/** Placeholder for sections on the roadmap. Replace the page with the real feature when built. */
export function ComingSoon({ href }: { href: string }) {
  const item = findNavItem(href)
  if (!item) return null

  return (
    <Empty className="flex-1">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <item.icon />
        </EmptyMedia>
        <EmptyTitle className="flex items-center gap-2">
          {item.title} <Badge variant="secondary">Coming in {item.version}</Badge>
        </EmptyTitle>
        <EmptyDescription>{item.description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
