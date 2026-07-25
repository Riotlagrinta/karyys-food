"use client";

import { useCartStore } from "@/store/cartStore";
import { MenuItem } from "./MenuCard";
import { Button } from "./Button";
import { X, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

interface MenuModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export function MenuModal({ item, onClose }: MenuModalProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  // Reset state when modal opens with a new item
  useEffect(() => {
    if (item) {
      setQuantity(1);
      setNotes("");
    }
  }, [item]);

  if (!item) return null;

  const handleAdd = () => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image_url: item.image_url,
      quantity,
      notes: notes.trim() !== "" ? notes.trim() : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm p-4">
      <div 
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-card border border-border shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-background/80 p-2 text-foreground hover:bg-muted/60 transition-colors border border-border"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative h-64 w-full bg-muted/20">
          {item.image_url ? (
            <Image
              src={item.image_url}
              alt={item.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted">
              Aucune image
            </div>
          )}
        </div>

        <div className="p-6 space-y-6">
          <div>
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-serif text-2xl font-bold text-foreground">
                {item.name}
              </h2>
              <span className="font-bold text-primary text-xl whitespace-nowrap">
                {item.price} FCFA
              </span>
            </div>
            <p className="text-muted mt-2">{item.description}</p>
          </div>

          <div className="space-y-3">
            <label htmlFor="notes" className="text-sm font-medium text-foreground">
              Instructions spéciales (optionnel)
            </label>
            <textarea
              id="notes"
              rows={3}
              placeholder="Ex: Sans piment, supplément fromage..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center space-x-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-10 h-10 p-0 rounded-full"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="font-medium text-lg w-4 text-center text-foreground">{quantity}</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-10 h-10 p-0 rounded-full"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <Button onClick={handleAdd} className="px-8">
              Ajouter - {item.price * quantity} FCFA
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
