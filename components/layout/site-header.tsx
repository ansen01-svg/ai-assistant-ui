"use client"

import { usePathname } from "next/navigation"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { mainNav, secondaryNav } from "@/lib/nav"

export function SiteHeader() {
  const pathname = usePathname()
  const section = [...mainNav, ...secondaryNav].find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  )

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
      <h1 className="text-sm font-medium">{section?.title ?? "AI Assistant"}</h1>
    </header>
  )
}
