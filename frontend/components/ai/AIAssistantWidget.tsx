"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Sparkles, X, Send, Loader2 } from "lucide-react";
import { useAIChatStore } from "@/store/aiChatStore";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_SUGGESTIONS = [
  "🍰 Quel dessert pour ce soir ?",
  "🍲 Un plat traditionnel épicé",
  "⚡ Déjeuner express à emporter",
  "🎂 Gâteau d'anniversaire personnalisé",
];

export function AIAssistantWidget() {
  const { isOpen, closeChat } = useAIChatStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Bonjour et bienvenue chez Karyy's Food ! 👋 Je suis votre Sommelier & Chef Culinaire IA. Des envies sucrées ou salées ? Dites-moi tout !",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg = textToSend.trim();
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
        {
          role: "assistant",
          content: data.reply || "Je suis à votre entière disposition pour régaler vos papilles !",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Désolé, je rencontre une petite difficulté réseau momentanée. Vous pouvez explorer directement notre carte des délices !",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex justify-start p-3 sm:p-6 items-end md:items-start pointer-events-none animate-in fade-in duration-200">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs pointer-events-auto cursor-pointer"
        onClick={closeChat}
      />

      <div className="relative w-full max-w-md bg-card rounded-3xl shadow-2xl border border-border/80 flex flex-col h-[540px] max-h-[85vh] pointer-events-auto overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Gourmet Header with 3D Chef Character */}
        <div className="bg-gradient-to-r from-primary via-brand-brown-light to-brand-rose text-white p-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-2xl overflow-hidden border-2 border-white/40 shadow-sm bg-white/20">
              <Image
                src="/images/3d/chef_ai_avatar_3d.jpg"
                alt="Chef IA Sommelier 3D"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-bold text-base font-serif text-white flex items-center gap-1.5">
                <span>Chef &amp; Sommelier IA</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              </h3>
              <p className="text-[11px] text-white/80">Concierge Culinaire Karyy&apos;s</p>
            </div>
          </div>
          <button
            onClick={closeChat}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors cursor-pointer"
            aria-label="Fermer la discussion"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gradient-to-b from-background/90 to-background/50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[84%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-white rounded-br-xs shadow-xs"
                    : "bg-card border border-border/80 text-foreground rounded-bl-xs shadow-xs"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-card border border-border/80 p-3 rounded-2xl rounded-bl-xs flex items-center gap-2 text-xs text-muted shadow-xs">
                <Loader2 className="w-4 h-4 animate-spin text-brand-rose" />
                <span>Le Chef affine sa suggestion gourmande...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Suggestions */}
        <div className="px-3 py-2 bg-card border-t border-border/40 overflow-x-auto flex gap-1.5 scrollbar-none">
          {QUICK_SUGGESTIONS.map((suggestion, i) => (
            <button
              key={i}
              onClick={() => sendMessage(suggestion)}
              disabled={loading}
              className="text-[11px] font-medium px-3 py-1.5 rounded-full bg-background border border-border/70 text-muted hover:text-foreground hover:border-brand-rose/40 hover:bg-muted/40 transition-all shrink-0 cursor-pointer disabled:opacity-50"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-3 border-t border-border/80 bg-card flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez votre question culinaire..."
            className="flex-1 bg-background border border-border rounded-full px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 bg-primary text-white rounded-full hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
            aria-label="Envoyer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
