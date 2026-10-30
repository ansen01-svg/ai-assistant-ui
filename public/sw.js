// Service worker: shows push notifications even when Bobby isn't open
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(data.title ?? "Bobby", {
      body: data.body,
      tag: data.tag,
      icon: "/android-chrome-192x192.png",
      requireInteraction: true, // stays until clicked (desktop)
      data: { url: data.url ?? "/tasks" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = new URL(event.notification.data?.url ?? "/", self.location.origin)
    .href;
  event.waitUntil(
    (async () => {
      const windows = await clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      const open = windows.find((w) => w.url.startsWith(self.location.origin));
      if (open) {
        await open.focus();
        return open.navigate(url);
      }
      return clients.openWindow(url);
    })(),
  );
});
