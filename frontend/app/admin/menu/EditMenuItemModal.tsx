"use client";

import { useState } from "react";
import { Edit2, X, Upload } from "lucide-react";
import { addOrUpdateMenuItem } from "./actions";

export default function EditMenuItemModal({
  item,
  categories,
}: {
  item: any;
  categories: any[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(item.image_url);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await addOrUpdateMenuItem(formData, item.id);

    setIsLoading(false);
    if (result.error) {
      alert(result.error);
    } else {
      setIsOpen(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-muted hover:text-primary hover:bg-muted/40 rounded-xl transition-colors"
        title="Modifier le plat"
      >
        <Edit2 className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm text-left">
          <div className="bg-card rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] border border-border">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h2 className="text-xl font-bold font-serif text-foreground">
                Modifier le Plat
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-muted hover:text-foreground rounded-full hover:bg-muted/40 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <form id={`edit-menu-form-${item.id}`} onSubmit={handleSubmit} className="space-y-4">
                <input type="hidden" name="existing_image_url" value={item.image_url || ""} />

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Nom du plat *
                  </label>
                  <input
                    required
                    name="name"
                    defaultValue={item.name}
                    type="text"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    defaultValue={item.description || ""}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring outline-none transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Prix (FCFA) *
                    </label>
                    <input
                      required
                      name="price"
                      type="number"
                      defaultValue={item.price}
                      min="0"
                      step="100"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Catégorie *
                    </label>
                    <select
                      required
                      name="category_id"
                      defaultValue={item.category_id}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring outline-none transition-all"
                    >
                      <option value="">Sélectionner</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Image du plat
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-border border-dashed rounded-xl cursor-pointer bg-muted/20 hover:bg-muted/40 overflow-hidden relative transition-colors">
                      {previewImage ? (
                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-3 text-muted" />
                          <p className="mb-2 text-sm text-muted">
                            <span className="font-semibold">Cliquez pour remplacer l'image</span>
                          </p>
                        </div>
                      )}
                      <input
                        name="image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <input
                    type="checkbox"
                    name="is_available"
                    id={`edit_is_available_${item.id}`}
                    defaultChecked={item.is_available}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-ring"
                  />
                  <label htmlFor={`edit_is_available_${item.id}`} className="text-sm font-medium text-foreground">
                    Plat disponible
                  </label>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-border bg-muted/20 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-5 py-2.5 text-muted font-medium hover:bg-muted/40 rounded-xl transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                form={`edit-menu-form-${item.id}`}
                disabled={isLoading}
                className="px-5 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                {isLoading ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
