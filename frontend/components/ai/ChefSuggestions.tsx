"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { MenuItem, MenuCard } from "@/components/ui/MenuCard";

export function ChefSuggestions({
  menuItems,
  onOpenModal,
}: {
  menuItems: MenuItem[];
  onOpenModal: (item: MenuItem) => void;
}) {
  const [suggestions, setSuggestions] = useState<MenuItem[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(() => menuItems.length > 0);

  useEffect(() => {
    if (menuItems.length === 0) return;

    let isMounted = true;
    async function fetchSuggestions() {
      try {
        const response = await fetch("/api/ai/suggest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ menuItems }),
        });

        if (response.ok && isMounted) {
          const data = await response.json();
          if (data.suggested_ids && data.suggested_ids.length > 0) {
            const filteredItems = data.suggested_ids
              .map((id: string) => menuItems.find((item) => item.id === id))
              .filter(Boolean) as MenuItem[];

            setSuggestions(filteredItems);
            setMessage(data.message || "Voici les recommandations personnalisées du Chef :");
          }
        }
      } catch (error) {
        console.error("Failed to load suggestions:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchSuggestions();

    return () => {
      isMounted = false;
    };
  }, [menuItems]);

  if (isLoading) {
    return (
      <div className="bg-card/60 border border-brand-rose/30 rounded-3xl p-6 mb-8 flex items-center justify-center min-h-[140px] shadow-xs backdrop-blur-md">
        <div className="flex flex-col items-center text-primary">
          <Loader2 className="w-7 h-7 animate-spin mb-2 text-brand-rose" />
          <p className="font-medium text-sm text-foreground">
            L&apos;IA prépare la sélection gourmande du jour...
          </p>
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-brand-rose/10 via-primary/5 to-amber-500/10 border border-brand-rose/30 rounded-3xl p-6 mb-10 shadow-md backdrop-blur-md">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-rose to-primary text-white flex items-center justify-center shadow-xs">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-serif font-bold text-foreground">
            Sélection &amp; Suggestions du Chef (IA)
          </h2>
          <p className="text-muted text-xs sm:text-sm mt-0.5">{message}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {suggestions.map((item) => (
          <MenuCard key={`sug-${item.id}`} item={item} onOpenModal={onOpenModal} />
        ))}
      </div>
    </div>
  );
}
