"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useMounted } from "@/hooks/use-mounted";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return <div className="w-10 h-10 rounded-full bg-muted/20 animate-pulse" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative p-2.5 rounded-full border border-border/80 bg-card/60 backdrop-blur-md hover:bg-muted/40 transition-all duration-300 text-foreground hover:scale-105 active:scale-95 shadow-xs cursor-pointer"
      aria-label="Changer de thème"
      title={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 text-brand-brown-light transition-transform duration-300 -rotate-12 hover:rotate-0" />
      )}
    </button>
  );
}
