"use client";

import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, MapPin, Phone } from "lucide-react";
import { validateTogoPhoneNumber } from "@/lib/utils/payment-togo";

export default function OrderConfirmPage() {
  const { items, setDeliveryInfo, deliveryInfo, getTotalPrice } = useCartStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  const [address, setAddress] = useState(deliveryInfo?.address || "");
  const [phone, setPhone] = useState(deliveryInfo?.phone || "");
  const [notes, setNotes] = useState(deliveryInfo?.notes || "");
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

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

  const deliveryFee = 1000; // Fixed delivery fee for now
  const subtotal = getTotalPrice();
  const total = subtotal + deliveryFee;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-serif font-bold text-brand-light mb-8">
        Adresse de livraison
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="bg-card border border-brand-light/10 rounded-xl p-6 shadow-sm space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="address" className="block text-sm font-medium mb-1">
                  Adresse de livraison complète *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                  <Input
                    id="address"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Quartier, rue, repère..."
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">
                  Numéro de téléphone *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                  <Input
                    id="phone"
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (phoneError) setPhoneError("");
                    }}
                    placeholder="Ex: 90 00 00 00"
                    className="pl-10"
                  />
                </div>
                {phoneError && (
                  <p className="text-red-500 text-xs mt-1 pl-1">
                    {phoneError}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium mb-1">
                  Instructions pour le livreur (Optionnel)
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Code portail, interphone, appeler en arrivant..."
                  className="w-full rounded-md border border-brand-light/30 bg-transparent px-3 py-2 text-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rose resize-none"
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-base flex items-center justify-center gap-2">
              Continuer vers le paiement <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        </div>

        <div className="md:col-span-1">
          <div className="bg-card border border-brand-light/10 rounded-xl p-6 shadow-sm sticky top-24 space-y-4">
            <h2 className="text-xl font-serif font-bold text-brand-light border-b border-brand-light/10 pb-4">
              Résumé
            </h2>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted">
                <span>{items.length} article(s)</span>
                <span>{subtotal} FCFA</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Livraison</span>
                <span>{deliveryFee} FCFA</span>
              </div>
              <div className="pt-4 border-t border-brand-light/10 mt-4 flex justify-between items-center">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-xl text-primary">{total} FCFA</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
