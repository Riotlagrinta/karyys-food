"use client";

import { useState } from "react";
import { Edit2, X, Loader2 } from "lucide-react";
import { updateCategory } from "./actions";

interface Category {
  id: string;
  name: string;
  description: string | null;
}

export default function EditCategoryModal({ category }: { category: Category }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await updateCategory(category.id, formData);

    setLoading(false);
    if (res?.error) {
      setError(res.error);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-muted hover:text-primary hover:bg-background rounded-lg transition-colors"
        title="Modifier la catégorie"
      >
        <Edit2 className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card rounded-2xl max-w-md w-full p-6 shadow-xl relative border border-brand-light/10">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 text-muted hover:text-foreground rounded-full hover:bg-background transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold font-serif text-foreground mb-4">
              Modifier la Catégorie
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Nom de la catégorie *
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={category.name}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-brand-light/20 bg-background text-foreground placeholder:text-muted focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={category.description || ""}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-brand-light/20 bg-background text-foreground placeholder:text-muted focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 text-muted font-medium hover:bg-background rounded-xl transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
