"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, Bot, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Bonjour ! 👋 Je suis l'Assistant Culinaire Karyy's Food. Des envies particulières aujourd'hui ? Laissez-moi vous conseiller !",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    const updatedMessages: Message[] = [...messages, { role: "user", content: userMsg }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          userMessage: userMsg,
        }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "Je suis à votre service pour toute question !" },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Désolé, je rencontre une petite difficulté réseau. N'hésitez pas à consulter notre menu !" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Sparkles Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 p-4 bg-gradient-to-r from-primary via-secondary to-rose-700 text-white rounded-full shadow-2xl hover:scale-105 transition-all z-40 flex items-center justify-center gap-2 group border border-border/40"
        aria-label="Assistant IA Karyy's"
      >
        <Sparkles className="w-6 h-6 animate-pulse text-rose-200" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap text-sm font-medium pr-1">
          Conseiller IA
        </span>
      </button>

      {/* Chat Drawer / Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex justify-start p-4 md:p-6 items-end md:items-start pointer-events-none">
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-xs pointer-events-auto"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative w-full max-w-md bg-card rounded-3xl shadow-2xl border border-border flex flex-col h-[520px] max-h-[85vh] pointer-events-auto overflow-hidden animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-amber-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-400/20 rounded-full flex items-center justify-center border border-amber-300/30">
                  <Bot className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-bold text-base font-serif text-amber-100">Karyy's Chef IA</h3>
                  <p className="text-xs text-white/80">Propulsé par IA multi-modèles</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-background to-background/70">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[82%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-white rounded-br-xs shadow-sm"
                        : "bg-background border border-border text-foreground rounded-bl-xs shadow-xs"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-background border border-border p-3 rounded-2xl rounded-bl-xs flex items-center gap-2 text-xs text-muted shadow-xs">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    Karyy's Chef prépare une réponse...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 border-t border-border bg-card flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Une recommandation ou question ?"
                className="flex-1 bg-background border border-border rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2.5 bg-primary text-white rounded-full hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
