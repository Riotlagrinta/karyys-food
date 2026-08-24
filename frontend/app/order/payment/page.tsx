"use client";

import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Wallet, ShieldCheck, Loader2 } from "lucide-react";
import { createOrder } from "../actions";
import { useMounted } from "@/hooks/use-mounted";

export default function PaymentPage() {
  const mounted = useMounted();
  const { items, deliveryInfo, getTotalPrice, clearCart } = useCartStore();
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] = useState<"tmoney" | "flooz" | "cash">("tmoney");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (items.length === 0 || !deliveryInfo) {
    router.replace("/cart");
    return null;
  }

  const deliveryFee = 1000;
  const subtotal = getTotalPrice();
  const total = subtotal + deliveryFee;

  const handlePayment = async () => {
    setIsProcessing(true);
    setError("");

    // Simulate payment delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const orderItemsPayload = items.map((item) => ({
        menu_item_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        notes: item.notes,
      }));

      const result = await createOrder(subtotal, deliveryFee, orderItemsPayload, deliveryInfo);

      if (result.error) {
        setError(result.error);
        setIsProcessing(false);
        return;
      }

      if (result.success && result.orderId) {
        clearCart();
        router.push(`/order/${result.orderId}`);
      }
    } catch {
      setError("Une erreur est survenue lors de la création de la commande.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:py-10 max-w-3xl">
      <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-8 text-center">
        Mode de Règlement
      </h1>

      <div className="bg-card/80 backdrop-blur-md border border-border/80 rounded-3xl p-6 sm:p-8 shadow-md space-y-8">
        {/* Total Price Banner */}
        <div className="text-center space-y-1 bg-muted/20 p-6 rounded-2xl border border-border/50">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            Montant total à régler (Livraison incluse)
          </p>
          <div className="text-4xl sm:text-5xl font-extrabold text-primary font-serif">
            {total.toLocaleString()} FCFA
          </div>
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl text-xs sm:text-sm">
            {error}
          </div>
        )}

        {/* Payment Methods Grid */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-foreground">
            Sélectionnez votre mode de paiement :
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* T-Money */}
            <button
              type="button"
              onClick={() => setPaymentMethod("tmoney")}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2.5 cursor-pointer ${
                paymentMethod === "tmoney"
                  ? "border-[#F9C10B] bg-[#F9C10B]/10 shadow-xs"
                  : "border-border bg-background/60 hover:border-[#F9C10B]/50"
              }`}
            >
              <div className="w-12 h-12 bg-[#F9C10B] rounded-2xl flex items-center justify-center text-black font-extrabold text-xl shadow-xs">
                T
              </div>
              <span className="font-bold text-sm text-foreground">T-Money</span>
              <span className="text-[10px] text-muted">Mobile Money</span>
            </button>

            {/* Flooz */}
            <button
              type="button"
              onClick={() => setPaymentMethod("flooz")}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2.5 cursor-pointer ${
                paymentMethod === "flooz"
                  ? "border-[#0070B8] bg-[#0070B8]/10 shadow-xs"
                  : "border-border bg-background/60 hover:border-[#0070B8]/50"
              }`}
            >
              <div className="w-12 h-12 bg-[#0070B8] rounded-2xl flex items-center justify-center text-white font-extrabold text-xl shadow-xs">
                F
              </div>
              <span className="font-bold text-sm text-foreground">Flooz Moov</span>
              <span className="text-[10px] text-muted">Mobile Money</span>
            </button>

            {/* Cash on Delivery */}
            <button
              type="button"
              onClick={() => setPaymentMethod("cash")}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2.5 cursor-pointer ${
                paymentMethod === "cash"
                  ? "border-primary bg-primary/10 shadow-xs"
                  : "border-border bg-background/60 hover:border-primary/50"
              }`}
            >
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary font-bold text-lg shadow-xs">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <span className="font-bold text-sm text-foreground">À la livraison</span>
              <span className="text-[10px] text-muted">Espèces au livreur</span>
            </button>
          </div>
        </div>

        {/* Payment Confirmation Area */}
        <div className="bg-background/60 p-6 rounded-2xl border border-border/60 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-xs text-muted">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>
              {paymentMethod === "cash"
                ? "Paiement en espèces directement au livreur lors de la remise du repas."
                : "Validation immédiate sécurisée par mobile money."}
            </span>
          </div>

          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full sm:w-auto px-12 py-6 text-base font-bold rounded-full shadow-md bg-gradient-to-r from-primary to-brand-brown-light text-white hover:opacity-95"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Traitement de la commande...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                {paymentMethod === "cash" ? "Confirmer la commande" : "Valider le paiement"}
                <CheckCircle2 className="w-5 h-5" />
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
