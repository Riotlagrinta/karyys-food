"use client";

import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/Button";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartPage() {
  const [isMounted, setIsMounted] = useState(false);
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCartStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl text-center space-y-6">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 text-primary">
          <Trash2 className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-brand-light">
          Votre panier est vide
        </h1>
        <p className="text-muted text-lg max-w-md mx-auto">
          Il semblerait que vous n'ayez pas encore ajouté de plats à votre panier. 
          Découvrez notre menu et laissez-vous tenter !
        </p>
        <div className="pt-4">
          <Link href="/menu">
            <Button size="lg" className="rounded-full px-8">
              Découvrir le menu
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-serif font-bold text-brand-light mb-8">
        Votre Panier
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card border border-brand-light/10 rounded-xl overflow-hidden shadow-sm">
            {items.map((item) => (
              <div 
                key={item.id} 
                className="flex flex-col sm:flex-row items-start sm:items-center p-4 sm:p-6 border-b border-brand-light/10 last:border-0 gap-4"
              >
                <div className="relative w-24 h-24 sm:w-20 sm:h-20 rounded-md overflow-hidden bg-muted/20 shrink-0">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-muted text-center p-2">
                      Aucune image
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <h3 className="font-serif font-bold text-lg text-brand-light">
                    {item.name}
                  </h3>
                  <div className="text-primary font-medium">
                    {item.price} FCFA
                  </div>
                  {item.notes && (
                    <p className="text-xs text-muted mt-1 italic">
                      Note : {item.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto mt-4 sm:mt-0 gap-6">
                  <div className="flex items-center space-x-3 bg-background border border-brand-light/20 rounded-full px-1 py-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="w-8 h-8 p-0 rounded-full hover:bg-primary/10"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="font-medium text-sm w-4 text-center">
                      {item.quantity}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="w-8 h-8 p-0 rounded-full hover:bg-primary/10"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-lg hidden sm:block w-24 text-right">
                      {item.price * item.quantity} FCFA
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-muted hover:text-primary transition-colors p-2"
                      aria-label="Supprimer l'article"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end">
            <button 
              onClick={clearCart}
                className="text-sm text-muted hover:text-primary transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> Vider le panier
            </button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-card border border-brand-light/10 rounded-xl p-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-serif font-bold text-brand-light mb-6">
              Résumé de la commande
            </h2>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Sous-total</span>
                <span className="font-medium">{getTotalPrice()} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Frais de livraison</span>
                <span className="text-brand-light italic">Calculés à l'étape suivante</span>
              </div>
              
              <div className="border-t border-brand-light/20 pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-xl text-primary">{getTotalPrice()} FCFA</span>
                </div>
              </div>
            </div>

            <Link href="/order/confirm" className="w-full">
              <Button className="w-full mt-8 flex items-center justify-center gap-2 h-12 text-base">
                Passer la commande <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            
            <div className="mt-4 text-center">
              <Link href="/menu" className="text-sm text-brand-light hover:underline">
                Continuer mes achats
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
