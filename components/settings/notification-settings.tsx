"use client";

import { Button } from "@/components/ui/button";
import { usePush } from "@/hooks/use-push";
import { toast } from "sonner";

export function NotificationSettings() {
  const { supported, subscribed, permission, busy, enable, disable, sendTest } =
    usePush();

  async function run(action: () => Promise<unknown>) {
    try {
      await action();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  }

  async function test() {
    const { sent } = await sendTest();
    if (sent) toast.success("Test notification sent");
    else toast.error("No devices subscribed");
  }

  return (
    <section className="space-y-3 rounded-lg border p-4">
      <div>
        <h2 className="font-medium">Reminders</h2>
        <p className="text-muted-foreground text-sm">
          Get task reminders on this device, even when Bobby is closed.
        </p>
      </div>
      {!supported ? (
        <p className="text-muted-foreground text-sm">
          Not supported in this browser. On iPhone, add Bobby to your Home
          Screen first.
        </p>
      ) : permission === "denied" ? (
        <p className="text-destructive text-sm">
          Notifications are blocked. Allow them in your browser settings.
        </p>
      ) : (
        <div className="flex gap-2">
          <Button
            disabled={busy}
            onClick={() => run(subscribed ? disable : enable)}
          >
            {subscribed ? "Turn off on this device" : "Enable notifications"}
          </Button>
          {subscribed && (
            <Button variant="outline" disabled={busy} onClick={() => run(test)}>
              Send test
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
