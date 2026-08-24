"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Download, X, Share, PlusSquare } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone;
    if (isStandalone) return;

    // Detect iOS Safari asynchronously
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream?: boolean }).MSStream;
    if (isIOS) {
      const hasDismissed = localStorage.getItem("pwa_prompt_dismissed");
      if (!hasDismissed) {
        const timer = setTimeout(() => {
          setShowIOSPrompt(true);
          setIsVisible(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
      return;
    }

    // Detect Android / Chrome install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      const hasDismissed = localStorage.getItem("pwa_prompt_dismissed");
      if (!hasDismissed) {
        setIsVisible(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("pwa_prompt_dismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-[120] animate-in slide-in-from-bottom duration-300">
      <div className="bg-card/95 backdrop-blur-md border border-border/80 rounded-3xl shadow-2xl p-4 flex items-center gap-4 relative overflow-hidden">
        <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-border shrink-0 shadow-md bg-[#FAF7F5]">
          <Image
            src="/Karyys_Logo.jpg"
            alt="Logo Karyy's Food"
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1 pr-6">
          <h4 className="font-bold text-foreground text-sm">Installer Karyy&apos;s Food</h4>
          <p className="text-xs text-muted mt-0.5">
            Accédez au menu &amp; suivez vos livraisons plus rapidement sur smartphone !
          </p>

          {showIOSPrompt ? (
            <div className="mt-2 text-[11px] text-foreground bg-muted/40 p-2 rounded-xl border border-border flex items-center gap-1.5">
              <span>Appuyez sur</span>
              <Share className="w-3.5 h-3.5 inline text-primary" />
              <span>puis sur</span>
              <PlusSquare className="w-3.5 h-3.5 inline text-primary" />
              <span className="font-semibold">&quot;Sur l&apos;écran d&apos;accueil&quot;</span>
            </div>
          ) : (
            <button
              onClick={handleInstallClick}
              className="mt-2.5 flex items-center gap-2 px-3.5 py-1.5 bg-primary text-white text-xs font-semibold rounded-full hover:bg-primary/90 transition-all shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Installer l&apos;application
            </button>
          )}
        </div>

        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1.5 text-muted hover:text-foreground rounded-full hover:bg-muted/40 transition-colors cursor-pointer"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
