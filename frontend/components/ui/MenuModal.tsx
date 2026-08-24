"use client";

import { useCartStore } from "@/store/cartStore";
import { MenuItem } from "./MenuCard";
import { Button } from "./Button";
import { X, Minus, Plus, ShoppingBag, Check } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface MenuModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export function MenuModal({ item, onClose }: MenuModalProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [isAdded, setIsAdded] = useState(false);

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
    setIsAdded(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const totalPrice = item.price * quantity;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-card border border-border/80 shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-background/80 backdrop-blur-md p-2.5 text-foreground hover:bg-muted/70 transition-colors border border-border/60 shadow-xs cursor-pointer"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Dish Image Header */}
        <div className="relative h-64 sm:h-72 w-full bg-muted/20">
          {item.image_url ? (
            <Image
              src={item.image_url}
              alt={item.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted font-medium bg-muted/30">
              Karyy&apos;s Délices Gourmands
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 -mt-6 relative">
          <div>
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground leading-tight">
                {item.name}
              </h2>
              <span className="font-extrabold text-primary text-xl sm:text-2xl whitespace-nowrap">
                {item.price.toLocaleString()} FCFA
              </span>
            </div>
            <p className="text-sm text-muted mt-2 leading-relaxed">
              {item.description || "Spécialité préparée avec soin et passion par notre chef cuisinier."}
            </p>
          </div>

          {/* Special Instructions Input */}
          <div className="space-y-2">
            <label htmlFor="notes" className="text-xs font-semibold uppercase tracking-wider text-muted">
              Instructions spéciales (optionnel)
            </label>
            <textarea
              id="notes"
              rows={2}
              placeholder="Ex: Sans piment, plus cuit, garniture à part..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-2xl border border-border/80 bg-background/80 px-3.5 py-2.5 text-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none transition-all shadow-xs"
            />
          </div>

          {/* Quantity and Add Action */}
          <div className="flex items-center justify-between pt-4 border-t border-border/60 gap-4">
            <div className="flex items-center space-x-3 bg-background border border-border rounded-full p-1 shadow-xs">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-9 h-9 p-0 rounded-full hover:bg-muted/60"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Diminuer la quantité"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="font-bold text-base w-6 text-center text-foreground">
                {quantity}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-9 h-9 p-0 rounded-full hover:bg-muted/60"
                onClick={() => setQuantity(quantity + 1)}
                aria-label="Augmenter la quantité"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <Button
              onClick={handleAdd}
              disabled={isAdded}
              className="flex-1 rounded-full py-6 text-sm sm:text-base font-semibold shadow-md bg-gradient-to-r from-primary to-brand-brown-light hover:opacity-95 text-white gap-2"
            >
              {isAdded ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Ajouté au panier !</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>Ajouter • {totalPrice.toLocaleString()} FCFA</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
