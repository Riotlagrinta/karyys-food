"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import { createDelivererAccount } from "./actions";

export default function AddDelivererModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await createDelivererAccount(formData);
    
    setIsLoading(false);
    if (result.error) {
      alert(result.error);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
      >
        <Plus className="w-5 h-5" />
        Ajouter un livreur
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col border border-border">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h2 className="text-xl font-bold font-serif text-foreground">Nouveau Livreur</h2>
              <button onClick={() => setIsOpen(false)} className="p-2 text-muted hover:bg-muted/40 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <form id="deliverer-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Nom complet</label>
                  <input required name="full_name" type="text" className="w-full p-2.5 border border-border bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-ring outline-none text-foreground" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                  <input required name="email" type="email" className="w-full p-2.5 border border-border bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-ring outline-none text-foreground" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Mot de passe</label>
                  <input required name="password" type="password" minLength={6} className="w-full p-2.5 border border-border bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-ring outline-none text-foreground" />
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-border bg-muted/20 flex justify-end gap-3">
              <button type="button" onClick={() => setIsOpen(false)} className="px-5 py-2.5 text-muted font-medium hover:bg-muted/40 rounded-lg transition-colors">
                Annuler
              </button>
              <button type="submit" form="deliverer-form" disabled={isLoading} className="px-5 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
                {isLoading ? "Création..." : "Créer le compte"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
