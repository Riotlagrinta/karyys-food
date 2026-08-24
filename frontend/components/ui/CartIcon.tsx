"use client";

import { useCartStore } from "@/store/cartStore";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useMounted } from "@/hooks/use-mounted";

export function CartIcon() {
  const mounted = useMounted();
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const totalItems = getTotalItems();

  return (
    <Link
      href="/cart"
      className="relative p-2.5 rounded-full border border-border/80 bg-card/60 backdrop-blur-md hover:bg-muted/40 text-foreground hover:text-primary transition-all duration-300 hover:scale-105 active:scale-95 shadow-xs cursor-pointer group"
      aria-label={`Panier (${mounted ? totalItems : 0} articles)`}
    >
      <ShoppingBag className="w-4 h-4 text-foreground/80 group-hover:text-primary transition-colors" />
      {mounted && totalItems > 0 && (
        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-extrabold text-white bg-gradient-to-br from-rose-500 to-brand-rose rounded-full ring-2 ring-background animate-in zoom-in shadow-xs">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Link>
  );
}
