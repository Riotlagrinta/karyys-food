"use client";

import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/Button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, CheckCircle2, ArrowRight, Wallet } from "lucide-react";
import { createOrder } from "../actions";

export default function PaymentPage() {
  const { items, deliveryInfo, getTotalPrice, clearCart } = useCartStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"tmoney" | "flooz" | "cash">("tmoney");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

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
      const orderItemsPayload = items.map(item => ({
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
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue lors du paiement.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-serif font-bold text-foreground mb-8 text-center">
        Paiement
      </h1>

      <div className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm space-y-8">
        
        {/* Résumé du montant */}
        <div className="text-center space-y-2">
          <p className="text-muted">Montant à payer</p>
          <div className="text-4xl font-bold text-primary">{total} FCFA</div>
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 border border-border text-destructive rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Moyens de paiement */}
        <div className="space-y-4">
          <h3 className="font-medium">Choisissez votre moyen de paiement :</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => setPaymentMethod("tmoney")}
              className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${
                paymentMethod === "tmoney" 
                  ? "border-[#F9C10B] bg-[#F9C10B]/10" 
                  : "border-border bg-background hover:border-[#F9C10B]/50"
              }`}
            >
              <div className="w-12 h-12 bg-[#F9C10B] rounded-full flex items-center justify-center text-black font-bold text-lg">
                T
              </div>
              <span className="font-medium">T-Money</span>
            </button>

            <button
              onClick={() => setPaymentMethod("flooz")}
              className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${
                paymentMethod === "flooz" 
                  ? "border-[#0070B8] bg-[#0070B8]/10" 
                  : "border-border bg-background hover:border-[#0070B8]/50"
              }`}
            >
              <div className="w-12 h-12 bg-[#0070B8] rounded-full flex items-center justify-center text-white font-bold text-lg">
                F
              </div>
              <span className="font-medium">Flooz</span>
            </button>

            <button
              onClick={() => setPaymentMethod("cash")}
              className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${
                paymentMethod === "cash" 
                  ? "border-primary bg-primary/10" 
                  : "border-border bg-background hover:border-primary/50"
              }`}
            >
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-white font-bold text-lg">
                <Wallet className="w-6 h-6 text-foreground" />
              </div>
              <span className="font-medium">À la livraison</span>
            </button>
          </div>
        </div>

        {/* Simulation de l'interface de paiement */}
        <div className="bg-muted/10 p-6 rounded-lg border border-border text-center space-y-4">
          <p className="text-sm text-muted">
            {paymentMethod === "cash" 
              ? "Vous paierez le livreur en espèces à la réception de votre commande."
              : "Cliquez sur payer pour simuler une validation de paiement réussie."}
          </p>
          
          <Button 
            onClick={handlePayment} 
            disabled={isProcessing}
            className="w-full sm:w-auto px-12 h-12 text-base"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Traitement...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                {paymentMethod === "cash" ? "Confirmer la commande" : "Payer maintenant"}
                <CheckCircle2 className="w-5 h-5" />
              </span>
            )}
          </Button>
        </div>

      </div>
    </div>
  );
}
