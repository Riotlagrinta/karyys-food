"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// Patch pour supprimer l'erreur React 19 inoffensive de next-themes en dev
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const origError = console.error;
  console.error = (...args) => {
    if (typeof args[0] === "string" && args[0].includes("Encountered a script tag while rendering React component")) {
      return; // Ignore l'erreur spécifique à next-themes
    }
    origError.apply(console, args);
  };
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
