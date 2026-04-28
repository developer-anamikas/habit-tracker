import { useCallback } from "react";
import { apiRequest } from "../utils/api";
import { useAuth } from "../context/AuthContext";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = `${base64String}${padding}`
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

function isPushSupported() {
  return (
    typeof window !== "undefined" &&
    "Notification" in window &&
    "serviceWorker" in navigator &&
    "PushManager" in window
  );
}

export function usePushNotifications() {
  const { token } = useAuth();

  const subscribeDevice = useCallback(async () => {
    if (!token) {
      return { ok: false, reason: "not-authenticated" };
    }

    if (!isPushSupported()) {
      return { ok: false, reason: "unsupported" };
    }

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      return { ok: false, reason: permission };
    }

    const [{ publicKey }, registration] = await Promise.all([
      apiRequest("/api/push/vapid-public-key", { token }),
      navigator.serviceWorker.register("/sw.js"),
    ]);

    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });
    }

    await apiRequest("/api/push/subscribe", {
      method: "POST",
      body: JSON.stringify({ subscription }),
      token,
    });

    return { ok: true };
  }, [token]);

  const unsubscribeDevice = useCallback(async () => {
    if (!token || !isPushSupported()) {
      return;
    }

    const registration = await navigator.serviceWorker.getRegistration();
    const subscription = await registration?.pushManager.getSubscription();

    if (!subscription) {
      return;
    }

    await apiRequest("/api/push/unsubscribe", {
      method: "DELETE",
      body: JSON.stringify({ endpoint: subscription.endpoint }),
      token,
    });

    await subscription.unsubscribe();
  }, [token]);

  return {
    isSupported: isPushSupported(),
    subscribeDevice,
    unsubscribeDevice,
  };
}
