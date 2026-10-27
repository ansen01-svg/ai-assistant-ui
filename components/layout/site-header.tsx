"use client";

import { useParams, usePathname } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useConversation } from "@/hooks/use-conversations";
import { mainNav, secondaryNav } from "@/lib/nav";

export function SiteHeader() {
  const pathname = usePathname();
  const params = useParams<{ id?: string }>();

  const conversationId = pathname.startsWith("/chat/") ? params.id : undefined;
  const conversation = useConversation(conversationId);

  const section = [...mainNav, ...secondaryNav].find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
  const title = conversation.data?.title ?? section?.title ?? "AI Assistant";

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />
      <h1 className="truncate text-sm font-medium">{title}</h1>
    </header>
  );
}
