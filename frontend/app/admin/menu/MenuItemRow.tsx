"use client";

import { useTransition, useState } from "react";
import { UtensilsCrossed, Trash2, Loader2 } from "lucide-react";
import { toggleMenuItemStatus, deleteMenuItem } from "./actions";
import EditMenuItemModal from "./EditMenuItemModal";

export default function MenuItemRow({ item, categories = [] }: { item: any; categories?: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);

  const categoryName = Array.isArray(item.categories)
    ? item.categories[0]?.name
    : item.categories?.name;

  const handleDelete = async () => {
    if (confirm(`Voulez-vous vraiment supprimer ou désactiver le plat "${item.name}" ?`)) {
      setIsDeleting(true);
      const res = await deleteMenuItem(item.id);
      setIsDeleting(false);

      if (res?.error) {
        alert(res.error);
      } else if (res?.message) {
        alert(res.message);
      }
    }
  };

  return (
    <tr className={`hover:bg-muted/40 transition-colors ${isPending || isDeleting ? "opacity-50" : ""}`}>
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-muted/30 rounded-xl overflow-hidden shrink-0 border border-border">
            {item.image_url ? (
              <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
            )}
          </div>
          <div>
            <div className="font-semibold text-foreground">{item.name}</div>
            <div className="text-xs text-muted max-w-[200px] truncate">
              {item.description}
            </div>
          </div>
        </div>
      </td>
      <td className="p-4 text-sm text-muted">
        <span className="px-2.5 py-1 bg-muted/30 text-foreground rounded-full text-xs font-medium border border-border">
          {categoryName || "Sans catégorie"}
        </span>
      </td>
      <td className="p-4 font-bold text-foreground">
        {item.price.toLocaleString()} FCFA
      </td>
      <td className="p-4 text-center">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={item.is_available}
            onChange={(e) => {
              const checked = e.target.checked;
              startTransition(() => {
                toggleMenuItemStatus(item.id, checked);
              });
            }}
            disabled={isPending}
          />
          <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-background after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
        </label>
      </td>
      <td className="p-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <EditMenuItemModal item={item} categories={categories} />
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-muted hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors disabled:opacity-50"
            title="Supprimer le plat"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin text-destructive" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </td>
    </tr>
  );
}
