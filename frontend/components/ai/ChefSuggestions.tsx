"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { MenuItem, MenuCard } from "@/components/ui/MenuCard";

export function ChefSuggestions({ 
  menuItems,
  onOpenModal
}: { 
  menuItems: MenuItem[],
  onOpenModal: (item: MenuItem) => void 
}) {
  const [suggestions, setSuggestions] = useState<MenuItem[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSuggestions() {
      try {
        const response = await fetch("/api/ai/suggest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ menuItems }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.suggested_ids && data.suggested_ids.length > 0) {
            const filteredItems = data.suggested_ids
              .map((id: string) => menuItems.find(item => item.id === id))
              .filter(Boolean) as MenuItem[];
            
            setSuggestions(filteredItems);
            setMessage(data.message || "Voici quelques suggestions pour vous :");
          }
        }
      } catch (error) {
        console.error("Failed to load suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (menuItems.length > 0) {
      fetchSuggestions();
    } else {
      setIsLoading(false);
    }
  }, [menuItems]);

  if (isLoading) {
    return (
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-8 flex items-center justify-center min-h-[150px]">
        <div className="flex flex-col items-center text-primary">
          <Loader2 className="w-8 h-8 animate-spin mb-2" />
          <p className="font-medium">L'IA prépare ses recommandations...</p>
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return null; // Silent fail if no suggestions
  }

  return (
    <div className="bg-gradient-to-r from-primary/10 via-background to-primary/5 border border-primary/20 rounded-2xl p-6 mb-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary text-primary-foreground p-2 rounded-lg">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-serif font-bold text-foreground">Suggestions du Chef (IA)</h2>
          <p className="text-muted text-sm">{message}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {suggestions.map(item => (
          <MenuCard key={`sug-${item.id}`} item={item} onOpenModal={onOpenModal} />
        ))}
      </div>
    </div>
  );
}
