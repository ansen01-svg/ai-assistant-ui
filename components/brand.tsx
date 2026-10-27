import { cn } from "@/lib/utils";
import { Outfit } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"], weight: "500" });

const ACCENT = "#C8704F";

/** The two-dot accent that sits above the "y". */
function Accent({ className }: { className?: string }) {
  return (
    <svg viewBox="-1 5 21 15" aria-hidden className={className}>
      <circle cx="4" cy="12" r="4.2" fill={ACCENT} />
      <path
        d="M9.5 18.5c0-6.8 4.2-12.2 10-12.2 0 6.8-4.2 12.2-10 12.2z"
        fill={ACCENT}
      />
    </svg>
  );
}

/** Single-letter "b" mark. Inherits text colour, so it works in light and dark mode. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="6 3 32 33"
      role="img"
      aria-label="Bobby"
      className={cn("size-8", className)}
    >
      <rect x="8" y="6" width="5" height="28" rx="2.5" fill="currentColor" />
      <circle
        cx="20.5"
        cy="25"
        r="6.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
      />
      <circle cx="27.5" cy="8.5" r="2.6" fill={ACCENT} />
      <path
        d="M31 12.5c0-4.2 2.6-7.5 6.2-7.5 0 4.2-2.6 7.5-6.2 7.5z"
        fill={ACCENT}
      />
    </svg>
  );
}

/** Full "bobby" wordmark. Size it with a text class, e.g. text-2xl. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      aria-label="Bobby"
      className={cn(
        outfit.className,
        "inline-flex items-start leading-none tracking-tight",
        className,
      )}
    >
      bobby
      <Accent className="ml-[0.08em] mt-[0.12em] h-[0.34em] w-auto" />
    </span>
  );
}
