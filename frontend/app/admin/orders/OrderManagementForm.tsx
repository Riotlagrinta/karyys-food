"use client";

import { useState } from "react";
import { updateOrderStatus } from "./actions";

export default function OrderManagementForm({ 
  orderId, 
  currentStatus, 
  currentDelivererId,
  deliverers 
}: { 
  orderId: string, 
  currentStatus: string,
  currentDelivererId?: string,
  deliverers: any[] 
}) {
  const [status, setStatus] = useState(currentStatus);
  const [delivererId, setDelivererId] = useState(currentDelivererId || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Only pass delivererId if status is on_route
    const dId = status === "on_route" ? delivererId : undefined;
    
    await updateOrderStatus(orderId, status, dId);
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-foreground mb-1">
            Statut de la commande
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2.5 border border-border bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-ring outline-none text-foreground"
          >
            <option value="pending">En attente</option>
            <option value="preparing">En préparation (Cuisine)</option>
            <option value="on_route">En route (Livreur)</option>
            <option value="delivered">Livré</option>
            <option value="cancelled">Annulé</option>
          </select>
        </div>

        {status === "on_route" && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <label htmlFor="deliverer" className="block text-sm font-medium text-foreground mb-1">
              Assigner un livreur <span className="text-destructive">*</span>
            </label>
            <select
              id="deliverer"
              required
              value={delivererId}
              onChange={(e) => setDelivererId(e.target.value)}
              className="w-full p-2.5 border border-border bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-ring outline-none text-foreground"
            >
              <option value="" disabled>-- Sélectionner un livreur --</option>
              {deliverers.map(d => (
                <option key={d.id} value={d.id}>{d.full_name || d.id}</option>
              ))}
            </select>
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || (status === "on_route" && !delivererId)}
            className="w-full sm:w-auto px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Mise à jour..." : "Mettre à jour la commande"}
          </button>
        </div>
      </div>
    </form>
  );
}
