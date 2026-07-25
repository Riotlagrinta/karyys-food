"use client";

import { useCartStore } from "@/store/cartStore";
import { Button } from "./Button";
import { Plus } from "lucide-react";
import Image from "next/image";

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

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image_url: item.image_url,
      quantity: 1,
    });
  };

  return (
    <div
      onClick={() => onOpenModal(item)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-4 transition-all hover:border-brand-light/50 hover:shadow-lg cursor-pointer h-full"
    >
      <div className="flex-1 space-y-3">
        <div className="aspect-[4/3] w-full overflow-hidden rounded-md bg-muted/20 relative">
          {item.image_url ? (
            <Image
              src={item.image_url}
              alt={item.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted">
              Aucune image
            </div>
          )}
        </div>
        <div>
          <h3 className="font-serif text-lg font-bold text-foreground line-clamp-1">
            {item.name}
          </h3>
          <p className="text-sm text-muted line-clamp-2 mt-1">
            {item.description}
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="font-bold text-primary">{item.price} FCFA</span>
        <Button
          size="sm"
          onClick={handleQuickAdd}
          className="rounded-full w-8 h-8 p-0 flex items-center justify-center bg-primary text-primary-foreground hover:opacity-95"
          aria-label={`Ajouter ${item.name} au panier`}
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
