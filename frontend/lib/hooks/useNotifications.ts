"use client";

import { useEffect, useState } from "react";

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
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
        } catch (e) {
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
