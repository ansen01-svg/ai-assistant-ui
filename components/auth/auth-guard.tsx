"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useMe } from "@/hooks/use-auth"

function FullScreen({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-svh flex-col items-center justify-center gap-4">{children}</div>
}

/** Renders children only for logged-in users; otherwise redirects to /login. */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: user, isPending, isError, refetch } = useMe()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (user === null) router.replace(`/login?next=${encodeURIComponent(pathname)}`)
  }, [user, pathname, router])

  if (isError) {
    return (
      <FullScreen>
        <p className="text-muted-foreground text-sm">Cannot reach the server.</p>
        <Button variant="outline" onClick={() => refetch()}>
          Try again
        </Button>
      </FullScreen>
    )
  }

  if (isPending || !user) {
    return (
      <FullScreen>
        <Spinner className="size-6" />
      </FullScreen>
    )
  }

  return children
}

/** Inverse of AuthGuard for /login and /register: logged-in users go to the app. */
export function GuestGuard({ children }: { children: React.ReactNode }) {
  const { data: user, isPending } = useMe()
  const router = useRouter()

  useEffect(() => {
    if (user) router.replace("/chat")
  }, [user, router])

  if (isPending || user) {
    return (
      <FullScreen>
        <Spinner className="size-6" />
      </FullScreen>
    )
  }

  return children
}
