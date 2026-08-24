"use client";

import { useState, useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

function getNotificationPermissionSnapshot(): NotificationPermission {
  if (typeof window !== "undefined" && "Notification" in window) {
    return Notification.permission;
  }
  return "default";
}

export function useNotifications() {
  const browserPermission = useSyncExternalStore(
    emptySubscribe,
    getNotificationPermissionSnapshot,
    () => "default" as NotificationPermission
  );

  const [overridePermission, setOverridePermission] = useState<NotificationPermission | null>(null);

  const permission = overridePermission ?? browserPermission;

  const requestPermission = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      const result = await Notification.requestPermission();
      setOverridePermission(result);
      return result;
    }
    return "denied";
  };

  const sendBrowserNotification = (title: string, body: string, url?: string) => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      const notif = new Notification(title, {
        body,
        icon: "/Karyys_Logo.jpg",
      });

      if ("vibrate" in navigator) {
        try {
          navigator.vibrate([200, 100, 200]);
        } catch {
          // Vibration ignore if restricted
        }
      }

      if (url) {
        notif.onclick = () => {
          window.focus();
          window.location.href = url;
        };
      }
    }
  };

  return { permission, requestPermission, sendBrowserNotification };
}
