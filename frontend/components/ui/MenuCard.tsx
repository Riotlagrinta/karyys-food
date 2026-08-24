"use client";

import { useCartStore } from "@/store/cartStore";
import { Button } from "./Button";
import { Plus, Check } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  category_id: string;
}

interface MenuCardProps {
  item: MenuItem;
  onOpenModal: (item: MenuItem) => void;
}

export function MenuCard({ item, onOpenModal }: MenuCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [justAdded, setJustAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image_url: item.image_url,
      quantity: 1,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div
      onClick={() => onOpenModal(item)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-card p-4 transition-all duration-300 hover:border-brand-rose/50 hover:shadow-xl hover:-translate-y-1 cursor-pointer h-full"
    >
      <div className="flex-1 space-y-3">
        {/* Dish Image Frame */}
        <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted/20 relative shadow-inner">
          {item.image_url ? (
            <Image
              src={item.image_url}
              alt={item.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-108"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-muted font-medium bg-muted/30">
              Karyy&apos;s Délices
            </div>
          )}

          {/* Floating Price Pill */}
          <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full bg-background/90 backdrop-blur-md border border-border/70 text-foreground font-bold text-xs shadow-xs">
            {item.price.toLocaleString()} FCFA
          </div>
        </div>

        {/* Dish Title & Description */}
        <div className="pt-1">
          <h3 className="font-serif text-lg font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {item.name}
          </h3>
          <p className="text-xs sm:text-sm text-muted line-clamp-2 mt-1 leading-relaxed">
            {item.description || "Préparé avec les meilleurs ingrédients par Karyy's Food."}
          </p>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between">
        <span className="text-xs font-semibold text-brand-rose">
          Détails &amp; personnalisation
        </span>
        <Button
          size="sm"
          onClick={handleQuickAdd}
          className={`rounded-full w-9 h-9 p-0 flex items-center justify-center transition-all duration-300 shadow-xs ${
            justAdded
              ? "bg-emerald-600 text-white scale-105"
              : "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105"
          }`}
          aria-label={`Ajouter ${item.name} au panier`}
          title={`Ajouter ${item.name}`}
        >
          {justAdded ? (
            <Check className="w-4 h-4 animate-in zoom-in" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
