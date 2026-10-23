import { GuestGuard } from "@/components/auth/auth-guard";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GuestGuard>
      <main className="bg-muted/40 flex min-h-svh items-center justify-center p-4">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </GuestGuard>
  );
}
