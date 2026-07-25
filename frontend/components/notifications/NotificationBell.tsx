"use client";

import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Notification = {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export function NotificationBell({ userId }: { userId?: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10);
      
      if (data) setNotifications(data);
    };

    fetchNotifications();

    const channel = supabase
      .channel("public:notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` },
        (payload) => {
          setNotifications((prev) => [payload.new as Notification, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, supabase]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
  };

  if (!userId) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full border border-transparent hover:border-border hover:bg-muted/40 transition-colors text-foreground"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-card" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-card border border-border shadow-xl rounded-2xl z-50 overflow-hidden">
          <div className="p-3 border-b border-border bg-background/60">
            <h3 className="font-semibold text-sm text-foreground">Notifications</h3>
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-center text-sm text-muted">Aucune notification.</p>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => !notif.is_read && markAsRead(notif.id)}
                  className={`p-3 border-b border-border last:border-0 cursor-pointer hover:bg-muted/40 transition-colors ${
                    !notif.is_read ? "bg-brand/5" : ""
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <h4 className={`text-sm ${!notif.is_read ? "font-semibold text-foreground" : "font-medium text-muted"}`}>
                      {notif.title}
                    </h4>
                    {!notif.is_read && <div className="w-2 h-2 bg-brand rounded-full mt-1.5 shrink-0" />}
                  </div>
                  <p className={`text-xs mt-1 ${!notif.is_read ? "text-foreground" : "text-muted"}`}>
                    {notif.message}
                  </p>
                  <p className="text-[10px] text-muted mt-1">
                    {new Date(notif.created_at).toLocaleDateString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
