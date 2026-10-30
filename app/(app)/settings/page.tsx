import { NotificationSettings } from "@/components/settings/notification-settings";

export default function SettingsPage() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto w-full max-w-2xl space-y-6 px-4 py-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-muted-foreground text-sm">
            Manage how Bobby works for you.
          </p>
        </div>
        <NotificationSettings />
      </div>
    </div>
  );
}
