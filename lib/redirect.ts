/** Only allow same-site relative paths, to prevent open redirects via ?next=https://evil.com */
export function safeRedirect(next: string | null, fallback = "/chat"): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) {
    return fallback
  }
  return next
}
