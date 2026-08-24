"use client";

import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/Button";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, Clock, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMounted } from "@/hooks/use-mounted";

export default function CartPage() {
  const mounted = useMounted();
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCartStore();

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[55vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-2xl text-center space-y-6">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-brand-rose/10 text-brand-rose shadow-inner">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
          Votre panier est vide
        </h1>
        <p className="text-muted text-base sm:text-lg max-w-md mx-auto leading-relaxed">
          Vous n&apos;avez pas encore ajouté de délices à votre sélection. Laissez-vous tenter par nos spécialités fraîches du jour !
        </p>
        <div className="pt-2">
          <Link href="/menu">
            <Button size="lg" className="rounded-full px-8 py-6 text-base font-semibold shadow-md bg-gradient-to-r from-primary to-brand-brown-light text-white">
              Découvrir la carte
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = getTotalPrice();

  return (
    <div className="container mx-auto px-4 py-8 sm:py-10 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
            Votre Panier Gourmand
          </h1>
          <p className="text-muted text-sm mt-1">
            Vérifiez vos délices et personnalisations avant de valider.
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs sm:text-sm text-muted hover:text-destructive transition-colors flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-full hover:bg-destructive/10"
        >
          <Trash2 className="w-4 h-4" />
          <span>Vider tout</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card/80 backdrop-blur-md border border-border/80 rounded-3xl overflow-hidden shadow-sm">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center p-4 sm:p-5 border-b border-border/50 last:border-0 gap-4 transition-colors hover:bg-muted/20"
              >
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-muted/20 shrink-0 shadow-inner">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-muted text-center p-2">
                      Karyy&apos;s
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="font-serif font-bold text-lg text-foreground truncate">
                    {item.name}
                  </h3>
                  <div className="text-primary font-bold text-sm">
                    {item.price.toLocaleString()} FCFA
                  </div>
                  {item.notes && (
                    <p className="text-xs text-muted italic bg-muted/40 px-2.5 py-1 rounded-lg w-fit mt-1">
                      Note : {item.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto mt-2 sm:mt-0 gap-4 sm:gap-6">
                  {/* Quantity selector */}
                  <div className="flex items-center space-x-2 bg-background border border-border rounded-full p-1 shadow-xs">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="w-8 h-8 p-0 rounded-full hover:bg-muted/60"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label="Diminuer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </Button>
                    <span className="font-bold text-sm w-5 text-center text-foreground">
                      {item.quantity}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="w-8 h-8 p-0 rounded-full hover:bg-muted/60"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Augmenter"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-base sm:text-lg text-foreground min-w-[80px] text-right">
                      {(item.price * item.quantity).toLocaleString()} FCFA
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-muted hover:text-destructive transition-colors p-2 rounded-full hover:bg-destructive/10 cursor-pointer"
                      aria-label={`Supprimer ${item.name}`}
                      title="Supprimer l'article"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Upselling Box */}
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-brand-rose/10 via-primary/5 to-transparent border border-brand-rose/20 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-rose/20 text-brand-rose flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <p className="text-xs sm:text-sm text-foreground font-medium">
                Envie d&apos;une boisson fraîche ou d&apos;une gourmandise en plus ?
              </p>
            </div>
            <Link href="/menu">
              <Button variant="outline" size="sm" className="rounded-full text-xs shrink-0">
                Compléter ma commande
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="lg:col-span-1">
          <div className="bg-card/80 backdrop-blur-md border border-border/80 rounded-3xl p-6 shadow-md sticky top-24 space-y-6">
            <h2 className="text-xl font-serif font-bold text-foreground">
              Résumé de la commande
            </h2>

            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between text-muted">
                <span>Sous-total ({items.length} {items.length <= 1 ? "article" : "articles"})</span>
                <span className="font-semibold text-foreground">{totalPrice.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Frais de livraison</span>
                <span className="text-xs italic text-brand-rose font-medium">Calculés à l&apos;adresse</span>
              </div>

              {/* Time & Trust Badges */}
              <div className="pt-2 space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted bg-background/60 p-2.5 rounded-xl border border-border/50">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  <span>Préparation &amp; expédition : 20-35 min</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted bg-background/60 p-2.5 rounded-xl border border-border/50">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Paiement T-Money, Flooz ou à la livraison</span>
                </div>
              </div>

              <div className="border-t border-border/60 pt-4 mt-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-base text-foreground">Total estimé</span>
                  <span className="font-extrabold text-2xl text-primary">
                    {totalPrice.toLocaleString()} FCFA
                  </span>
                </div>
              </div>
            </div>

            <Link href="/order/confirm" className="w-full block">
              <Button className="w-full rounded-full py-6 text-base font-bold shadow-md bg-gradient-to-r from-primary to-brand-brown-light hover:opacity-95 text-white flex items-center justify-center gap-2">
                <span>Passer la commande</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <div className="text-center pt-1">
              <Link href="/menu" className="text-xs text-muted hover:text-foreground transition-colors hover:underline">
                ← Continuer mes achats
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
