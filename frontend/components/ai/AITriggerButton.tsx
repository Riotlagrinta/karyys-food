"use client";

import React from "react";
import { useAIChatStore } from "@/store/aiChatStore";
import { Sparkles } from "lucide-react";
import Image from "next/image";

interface AITriggerButtonProps {
  variant?: "navbar" | "hero" | "card";
  className?: string;
  children?: React.ReactNode;
}

export function AITriggerButton({
  variant = "navbar",
  className = "",
  children,
}: AITriggerButtonProps) {
  const openChat = useAIChatStore((state) => state.openChat);

  if (variant === "navbar") {
    return (
      <button
        onClick={openChat}
        className={`relative p-2 rounded-full border border-border/80 bg-card/60 backdrop-blur-md hover:bg-muted/40 text-foreground transition-all duration-300 hover:scale-105 active:scale-95 shadow-xs cursor-pointer flex items-center gap-1.5 ${className}`}
        aria-label="Ouvrir le Sommelier IA"
        title="Conseiller Culinaire IA"
      >
        <div className="relative w-5 h-5 rounded-full overflow-hidden shrink-0 border border-brand-rose/40">
          <Image
            src="/images/3d/chef_ai_avatar_3d.jpg"
            alt="Chef IA"
            fill
            className="object-cover"
          />
        </div>
        <span className="hidden lg:inline text-xs font-semibold text-foreground pr-1">
          Chef IA
        </span>
      </button>
    );
  }

  if (variant === "hero") {
    return (
      <button
        onClick={openChat}
        className={`rounded-full px-7 py-4 text-base font-semibold border border-border/80 bg-card/80 hover:bg-muted/40 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${className}`}
      >
        {children || (
          <>
            <Sparkles className="w-5 h-5 text-brand-rose" />
            <span>Demander au Chef IA</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={openChat}
      className={`cursor-pointer transition-all ${className}`}
    >
      {children}
    </button>
  );
}
