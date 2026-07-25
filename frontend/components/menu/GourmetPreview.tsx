"use client";

import React, { useState } from "react";
import { MenuCard, MenuItem } from "@/components/ui/MenuCard";
import { MenuModal } from "@/components/ui/MenuModal";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface GourmetPreviewProps {
  items: MenuItem[];
}

export function GourmetPreview({ items }: GourmetPreviewProps) {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  if (!items || items.length === 0) {
    return (
      <div className="h-40 bg-muted/20 rounded-2xl flex flex-col items-center justify-center border border-border p-4 text-center">
        <p className="text-muted text-sm italic mb-2">
          Aucun plat disponible pour le moment.
        </p>
        <Link href="/menu">
          <Button variant="outline" size="sm">Découvrir le catalogue</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
