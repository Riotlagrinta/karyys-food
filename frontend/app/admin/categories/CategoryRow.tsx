"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import EditCategoryModal from "./EditCategoryModal";
import { deleteCategory } from "./actions";

interface CategoryWithCount {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  menu_items_count: number;
}

export default function CategoryRow({ category }: { category: CategoryWithCount }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (
      !confirm(
        `Êtes-vous sûr de vouloir supprimer la catégorie "${category.name}" ?`
      )
    ) {
      return;
    }

    setLoading(true);
    setError(null);

    const res = await deleteCategory(category.id);
    setLoading(false);

    if (res?.error) {
      setError(res.error);
    }
  };

  return (
    <>
      <tr className="hover:bg-muted/40 transition-colors">
        <td className="p-4 font-medium text-foreground">{category.name}</td>
        <td className="p-4 text-muted max-w-xs truncate">
          {category.description || "—"}
        </td>
        <td className="p-4">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50">
            {category.menu_items_count}{" "}
            {category.menu_items_count > 1 ? "plats" : "plat"}
          </span>
        </td>
        <td className="p-4 text-right">
          <div className="flex items-center justify-end gap-2">
            <EditCategoryModal category={category} />
            <button
              onClick={handleDelete}
              disabled={loading}
              className="p-2 text-muted hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50"
              title="Supprimer la catégorie"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-destructive" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </td>
      </tr>

      {error && (
        <tr>
          <td colSpan={4} className="px-4 py-2 bg-destructive/10 text-destructive text-sm">
            {error}
          </td>
        </tr>
      )}
    </>
  );
}
