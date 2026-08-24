"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, Loader2, ChefHat } from "lucide-react";

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
  const [isOpen, setIsOpen] = useState(false);
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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

  return (
    <>
      {/* Floating Glowing Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 md:bottom-6 left-6 p-3.5 sm:p-4 bg-gradient-to-r from-primary via-brand-brown-light to-brand-rose text-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all z-40 flex items-center justify-center gap-2 group border border-white/20 cursor-pointer"
        aria-label="Conseiller Culinaire IA Karyy's"
        title="Discuter avec le Chef IA"
      >
        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse text-amber-200" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap text-xs sm:text-sm font-bold pr-1">
          Chef IA
        </span>
      </button>

      {/* Chat Drawer / Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex justify-start p-3 sm:p-6 items-end md:items-start pointer-events-none">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs pointer-events-auto animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative w-full max-w-md bg-card rounded-3xl shadow-2xl border border-border/80 flex flex-col h-[540px] max-h-[85vh] pointer-events-auto overflow-hidden animate-in slide-in-from-bottom duration-300">
            {/* Gourmet Header */}
            <div className="bg-gradient-to-r from-primary via-brand-brown-light to-brand-rose text-white p-4 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30 backdrop-blur-xs">
                  <ChefHat className="w-5 h-5 text-amber-200" />
                </div>
                <div>
                  <h3 className="font-bold text-base font-serif text-white">
                    Chef &amp; Sommelier IA
                  </h3>
                  <p className="text-[11px] text-white/80">Karyy&apos;s Food Concierge</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
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
      )}
    </>
  );
}
