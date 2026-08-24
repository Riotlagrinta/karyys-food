"use client";

import React, { useState } from "react";
import { MenuCard, MenuItem } from "@/components/ui/MenuCard";
import { MenuModal } from "@/components/ui/MenuModal";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Sparkles, ArrowRight } from "lucide-react";

interface GourmetPreviewProps {
  items: MenuItem[];
}

export function GourmetPreview({ items }: GourmetPreviewProps) {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  if (!items || items.length === 0) {
    return (
      <div className="py-12 px-4 rounded-2xl bg-card/50 border border-border flex flex-col items-center justify-center text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Sparkles className="w-6 h-6 text-brand-rose" />
        </div>
        <p className="text-foreground font-serif text-lg font-bold">
          Notre carte est en cours d&apos;actualisation
        </p>
        <p className="text-muted text-sm max-w-sm">
          Découvrez l&apos;ensemble de nos douceurs et plats directement sur le catalogue complet.
        </p>
        <Link href="/menu">
          <Button variant="outline" size="sm" className="rounded-full gap-2 mt-2">
            <span>Explorer le menu</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {items.slice(0, 4).map((item) => (
          <MenuCard
            key={item.id}
            item={item}
            onOpenModal={(itemToOpen) => setSelectedItem(itemToOpen)}
          />
        ))}
      </div>

      {selectedItem && (
        <MenuModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </>
  );
}
