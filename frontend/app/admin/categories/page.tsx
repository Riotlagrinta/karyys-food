import { createClient } from "@/lib/supabase/server";
import AddCategoryModal from "./AddCategoryModal";
import CategoryRow from "./CategoryRow";

export const revalidate = 0;

export default async function AdminCategoriesPage() {
  const supabase = await createClient();

  // Fetch categories with menu_items count
  const { data: categories, error } = await supabase
    .from("categories")
    .select("*, menu_items(id)")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
  }

  const formattedCategories =
    categories?.map((cat) => ({
      id: cat.id,
      name: cat.name,
      description: cat.description,
      created_at: cat.created_at,
      menu_items_count: Array.isArray(cat.menu_items)
        ? cat.menu_items.length
        : 0,
    })) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">
            Catégories
          </h1>
          <p className="text-sm text-muted mt-1">
            Gérez les catégories du menu et organisez les plats de Karyy's Food
          </p>
        </div>
        <AddCategoryModal />
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 text-muted text-sm border-b border-border">
                <th className="p-4 font-medium">Nom</th>
                <th className="p-4 font-medium">Description</th>
                <th className="p-4 font-medium">Plats Associés</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground">
              {formattedCategories.map((category) => (
                <CategoryRow key={category.id} category={category} />
              ))}
              {formattedCategories.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted">
                    Aucune catégorie enregistrée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
