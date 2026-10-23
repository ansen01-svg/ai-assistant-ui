import { Suspense } from "react"
import type { Metadata } from "next"

import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = { title: "Log in" }

export default function LoginPage() {
  // LoginForm reads ?next= with useSearchParams, which needs a Suspense boundary
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
