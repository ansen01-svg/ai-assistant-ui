import type { Metadata } from "next";

import { RegisterForm } from "@/components/auth/register-form";
import { Wordmark } from "@/components/brand";

export const metadata: Metadata = { title: "Sign up" };

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center">
      <Wordmark className="mb-8 text-4xl" />
      <div className="w-full">
        <RegisterForm />
      </div>
    </div>
  );
}
