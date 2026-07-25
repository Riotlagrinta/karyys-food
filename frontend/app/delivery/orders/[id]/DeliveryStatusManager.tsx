"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { markOrderAsDelivered } from "../actions";

export default function DeliveryStatusManager({ orderId }: { orderId: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (!confirm("Confirmer que la commande a bien été remise au client ?")) return;
    
    setIsLoading(true);
    const result = await markOrderAsDelivered(orderId);
    
    if (result?.error) {
      alert(result.error);
      setIsLoading(false);
    }
    // if success, it will redirect
  };

  return (
    <div className="fixed bottom-20 md:bottom-auto left-0 right-0 p-4 bg-card md:bg-transparent border-t md:border-t-0 border-border md:relative md:p-0 md:mt-6 z-40">
      <div className="max-w-md mx-auto w-full">
        <button
          onClick={handleConfirm}
          disabled={isLoading}
          className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-transform active:scale-[0.98] flex items-center justify-center gap-3 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckCircle2 className="w-6 h-6" />
          {isLoading ? "Validation..." : "Confirmer la Livraison"}
        </button>
      </div>
    </div>
  );
}
