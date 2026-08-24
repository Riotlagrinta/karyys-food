"use client";

import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, MapPin, Phone, FileText } from "lucide-react";
import { validateTogoPhoneNumber } from "@/lib/utils/payment-togo";
import { useMounted } from "@/hooks/use-mounted";

export default function OrderConfirmPage() {
  const mounted = useMounted();
  const { items, setDeliveryInfo, deliveryInfo, getTotalPrice } = useCartStore();
  const router = useRouter();

  const [address, setAddress] = useState(deliveryInfo?.address || "");
  const [phone, setPhone] = useState(deliveryInfo?.phone || "");
  const [notes, setNotes] = useState(deliveryInfo?.notes || "");
  const [phoneError, setPhoneError] = useState("");

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (items.length === 0) {
    router.replace("/cart");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim() || !phone.trim()) return;

    const validation = validateTogoPhoneNumber(phone);
    if (!validation.isValid) {
      setPhoneError(validation.error || "Numéro de téléphone invalide.");
      return;
    }

    setPhoneError("");
    setDeliveryInfo({ address, phone: validation.formattedNumber, notes });
    router.push("/order/payment");
  };

  const deliveryFee = 1000;
  const subtotal = getTotalPrice();
  const total = subtotal + deliveryFee;

  return (
    <div className="container mx-auto px-4 py-8 sm:py-10 max-w-4xl">
      <h1 className="text-3xl font-serif font-bold text-foreground mb-8">
        Adresse &amp; Contact de Livraison
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="bg-card/80 backdrop-blur-md border border-border/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
          >
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="address" className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                  Adresse de livraison complète *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <Input
                    id="address"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Quartier, rue, repère, numéro de maison..."
                    className="pl-10 rounded-2xl"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                  Numéro de téléphone (Togo +228) *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <Input
                    id="phone"
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (phoneError) setPhoneError("");
                    }}
                    placeholder="Ex: 90 00 00 00 (T-Money ou Flooz)"
                    className="pl-10 rounded-2xl"
                  />
                </div>
                {phoneError && (
                  <p className="text-destructive text-xs mt-1 pl-1">
                    {phoneError}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="notes" className="block text-xs font-semibold uppercase tracking-wider text-muted">
                  Instructions pour le livreur (Optionnel)
                </label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3 w-4 h-4 text-muted" />
                  <textarea
                    id="notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Code portail, indications spécifiques, appeler à l'arrivée..."
                    className="w-full rounded-2xl border border-border/80 bg-background/80 pl-10 pr-3.5 py-2.5 text-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none transition-all shadow-xs"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full rounded-full py-6 text-base font-bold shadow-md bg-gradient-to-r from-primary to-brand-brown-light text-white flex items-center justify-center gap-2"
            >
              <span>Continuer vers le paiement</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        </div>

        <div className="md:col-span-1">
          <div className="bg-card/80 backdrop-blur-md border border-border/80 rounded-3xl p-6 shadow-sm sticky top-24 space-y-4">
            <h2 className="text-xl font-serif font-bold text-foreground border-b border-border/60 pb-3">
              Récapitulatif
            </h2>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-muted">
                <span>{items.length} {items.length <= 1 ? "article" : "articles"}</span>
                <span className="font-semibold text-foreground">{subtotal.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Frais de livraison</span>
                <span className="font-semibold text-foreground">{deliveryFee.toLocaleString()} FCFA</span>
              </div>
              <div className="pt-3 border-t border-border/60 mt-3 flex justify-between items-center">
                <span className="font-bold text-base text-foreground">Total à régler</span>
                <span className="font-extrabold text-xl text-primary">
                  {total.toLocaleString()} FCFA
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
