import type { Metadata } from "next";
import { Suspense } from "react";

import { LoginForm } from "@/components/auth/login-form";
import { Wordmark } from "@/components/brand";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center">
      <Wordmark className="mb-8 text-4xl" />
      {/* LoginForm reads ?next= with useSearchParams, which needs a Suspense boundary */}
      <Suspense>
        <div className="w-full">
          <LoginForm />
        </div>
      </Suspense>
    </div>
  );
}
