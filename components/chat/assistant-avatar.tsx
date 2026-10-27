import { LogoMark } from "@/components/brand";
import { cn } from "@/lib/utils";

export function AssistantAvatar({ thinking = false }: { thinking?: boolean }) {
  return (
    <div
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full border bg-background",
        thinking && "animate-pulse",
      )}
    >
      <LogoMark className="size-5" />
    </div>
  );
}
