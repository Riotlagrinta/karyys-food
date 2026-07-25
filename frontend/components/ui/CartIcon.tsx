"use client";

import { useCartStore } from "@/store/cartStore";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function CartIcon() {
  const [isMounted, setIsMounted] = useState(false);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const totalItems = getTotalItems();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Link href="/cart" className="relative p-2 rounded-full border border-transparent hover:border-border hover:bg-muted/40 text-muted hover:text-primary transition-colors">
      <ShoppingBag className="w-5 h-5" />
      {isMounted && totalItems > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-primary rounded-full">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
