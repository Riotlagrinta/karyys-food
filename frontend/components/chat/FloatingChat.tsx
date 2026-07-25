"use client";

import React, { useEffect, useState, useRef } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getMessages, sendMessage } from "./actions";

type Message = {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  profiles: {
    full_name: string;
    role: string;
  };
};

export function FloatingChat({ orderId, currentUserId }: { orderId: string; currentUserId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const supabase = createClient();

  useEffect(() => {
    if (!isOpen) return;

    // Fetch initial messages
    const fetchMsgs = async () => {
      const data = await getMessages(orderId);
      setMessages(data as any);
      setLoading(false);
    };
    fetchMsgs();

    // Subscribe to new messages
    const channel = supabase
      .channel(`chat_${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `order_id=eq.${orderId}`,
        },
        async (payload) => {
          // Fetch the profile for the new message since payload only has the raw row
          const { data: profileData } = await supabase
            .from("profiles")
            .select("full_name, role")
            .eq("id", payload.new.sender_id)
            .single();

          const newMsg: Message = {
            id: payload.new.id,
            content: payload.new.content,
            created_at: payload.new.created_at,
            sender_id: payload.new.sender_id,
            profiles: profileData as any,
          };

          setMessages((prev) => [...prev, newMsg]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isOpen, orderId, supabase]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const content = newMessage;
    setNewMessage(""); // Optimistic clear
    await sendMessage(orderId, content);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-primary text-primary-foreground rounded-full shadow-lg hover:opacity-95 transition-transform hover:scale-105 z-50 flex items-center justify-center"
        aria-label="Ouvrir le chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Drawer / Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Chat Container */}
          <div className="relative w-full max-w-md h-full bg-card shadow-2xl flex flex-col animate-in slide-in-from-right-full duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-background">
              <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                Discussion
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-muted/40 text-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50">
              {loading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : messages.length === 0 ? (
                <p className="text-center text-muted py-4">Aucun message pour le moment. Dites bonjour !</p>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.sender_id === currentUserId;
                  return (
                    <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-xs font-medium text-foreground">
                          {isMe ? "Vous" : msg.profiles?.full_name || "Utilisateur"}
                        </span>
                        {!isMe && (
                          <span className="text-[10px] uppercase text-muted border border-border rounded px-1">
                            {msg.profiles?.role === "admin" ? "Support" : msg.profiles?.role}
                          </span>
                        )}
                      </div>
                        <div 
                        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                          isMe 
                            ? "bg-primary text-primary-foreground rounded-br-sm" 
                            : "bg-card border border-border text-foreground rounded-bl-sm"
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                      </div>
                      <span className="text-[10px] text-muted mt-1">
                        {new Date(msg.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 border-t border-border bg-card flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Écrivez un message..."
                className="flex-1 bg-background border border-border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="p-2 rounded-full bg-primary text-primary-foreground hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
