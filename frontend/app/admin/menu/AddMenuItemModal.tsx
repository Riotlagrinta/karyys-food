"use client";

import { useState } from "react";
import { X, Upload } from "lucide-react";
import { addOrUpdateMenuItem } from "./actions";

export default function AddMenuItemModal({
  isOpen,
  onClose,
  categories,
}: {
  isOpen: boolean;
  onClose: () => void;
  categories: any[];
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await addOrUpdateMenuItem(formData);
    
    setIsLoading(false);
    if (result.error) {
      alert(result.error);
    } else {
      onClose();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] border border-brand-light/10">
        <div className="flex justify-between items-center p-6 border-b border-brand-light/10">
          <h2 className="text-xl font-bold font-serif text-foreground">Nouveau Plat</h2>
          <button onClick={onClose} className="p-2 text-muted hover:bg-background rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="menu-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Nom du plat</label>
              <input required name="name" type="text" className="w-full p-2.5 border border-brand-light/20 bg-background text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none placeholder:text-muted" />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Description</label>
              <textarea name="description" rows={3} className="w-full p-2.5 border border-brand-light/20 bg-background text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none placeholder:text-muted"></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Prix (FCFA)</label>
                <input required name="price" type="number" min="0" step="100" className="w-full p-2.5 border border-brand-light/20 bg-background text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Catégorie</label>
                <select required name="category_id" className="w-full p-2.5 border border-brand-light/20 bg-background text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none">
                  <option value="">Sélectionner</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Image du plat</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-brand-light/20 border-dashed rounded-lg cursor-pointer bg-background hover:bg-background/80 overflow-hidden relative transition-colors">
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-3 text-muted" />
                      <p className="mb-2 text-sm text-muted"><span className="font-semibold">Cliquez pour uploader</span> ou glissez-déposez</p>
                      <p className="text-xs text-muted">PNG, JPG jusqu'à 5MB</p>
                    </div>
                  )}
                  <input name="image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <input type="checkbox" name="is_available" id="is_available" defaultChecked className="w-4 h-4 text-primary bg-background border-brand-light/20 rounded focus:ring-primary" />
              <label htmlFor="is_available" className="text-sm font-medium text-foreground">Rendre disponible immédiatement</label>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-brand-light/10 bg-background flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-muted font-medium hover:bg-card rounded-lg transition-colors">
            Annuler
          </button>
          <button type="submit" form="menu-form" disabled={isLoading} className="px-5 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
            {isLoading ? "Enregistrement..." : "Enregistrer le plat"}
          </button>
        </div>
      </div>
    </div>
  );
}
