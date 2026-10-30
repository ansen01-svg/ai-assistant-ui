"use client";

import { api } from "@/lib/api";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

function urlBase64ToUint8Array(base64: string) {
  const padded = (base64 + "=".repeat((4 - (base64.length % 4)) % 4))
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const raw = atob(padded);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

async function getRegistration() {
  return navigator.serviceWorker.register("/sw.js");
}

/** Push notifications for this browser/device. */
export function usePush() {
  const supported = useSyncExternalStore(
    () => () => {},
    () =>
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window,
    () => false,
  );
  const [subscribed, setSubscribed] = useState(false);
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!supported) return;
    getRegistration()
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => {
        setPermission(Notification.permission);
        setSubscribed(Boolean(sub));
      })
      .catch(() => setSubscribed(false));
  }, [supported]);

  const enable = useCallback(async () => {
    setBusy(true);
    try {
      const result = await Notification.requestPermission(); // must come from a click
      setPermission(result);
      if (result !== "granted")
        throw new Error("Notifications are blocked in browser settings");

      const { public_key } = await api<{ public_key: string }>(
        "/push/public-key",
      );
      const reg = await getRegistration();
      const sub =
        (await reg.pushManager.getSubscription()) ??
        (await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(public_key),
        }));
      await api("/push/subscriptions", {
        method: "POST",
        body: JSON.stringify(sub.toJSON()),
      });
      setSubscribed(true);
    } finally {
      setBusy(false);
    }
  }, []);

  const disable = useCallback(async () => {
    setBusy(true);
    try {
      const sub = await (await getRegistration()).pushManager.getSubscription();
      if (sub) {
        await api("/push/unsubscribe", {
          method: "POST",
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setSubscribed(false);
    } finally {
      setBusy(false);
    }
  }, []);

  const sendTest = useCallback(
    () => api<{ sent: number }>("/push/test", { method: "POST" }),
    [],
  );

  return { supported, subscribed, permission, busy, enable, disable, sendTest };
}
