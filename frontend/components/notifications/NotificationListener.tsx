"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Bell, X } from "lucide-react";
import { useNotifications } from "@/lib/hooks/useNotifications";

interface ToastNotification {
  id: string;
  title: string;
  message: string;
}

export function NotificationListener() {
  const [activeToast, setActiveToast] = useState<ToastNotification | null>(null);
  const supabase = createClient();
  const { sendBrowserNotification } = useNotifications();

  // Play subtle sound using Web Audio API
  const playChime = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.warn("Audio play blocked or unavailable", e);
    }
  };

  useEffect(() => {
    // Register Service Worker for PWA
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("Service Worker registered successfully:", reg.scope))
        .catch((err) => console.error("Service Worker registration failed:", err));
    }

    let channel: any;

    const setupRealtime = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      channel = supabase
        .channel(`user_notifications_${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            const newNotif = {
              id: payload.new.id,
              title: payload.new.title || "Karyy's Food",
              message: payload.new.message || "Nouvelle mise à jour !",
            };

            setActiveToast(newNotif);
            playChime();
            sendBrowserNotification(newNotif.title, newNotif.message);

            // Auto dismiss toast after 5 seconds
            setTimeout(() => {
              setActiveToast((current) => (current?.id === newNotif.id ? null : current));
            }, 5000);
          }
        )
        .subscribe();
    };

    setupRealtime();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [supabase, sendBrowserNotification]);

  if (!activeToast) return null;

  return (
    <div className="fixed top-5 right-5 z-[200] max-w-sm w-full animate-in slide-in-from-top duration-300">
      <div className="bg-card border border-border rounded-2xl shadow-xl p-4 flex items-start gap-3 relative overflow-hidden">
        {/* Accent Bar */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary" />

        <div className="w-10 h-10 bg-muted/40 text-primary rounded-full flex items-center justify-center shrink-0 mt-0.5">
          <Bell className="w-5 h-5" />
        </div>

        <div className="flex-1 pr-6">
          <h4 className="font-bold text-foreground text-sm">{activeToast.title}</h4>
          <p className="text-xs text-muted mt-1 leading-relaxed">{activeToast.message}</p>
        </div>

        <button
          onClick={() => setActiveToast(null)}
          className="absolute top-3 right-3 p-1 text-muted hover:text-foreground rounded-full hover:bg-muted/40 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
