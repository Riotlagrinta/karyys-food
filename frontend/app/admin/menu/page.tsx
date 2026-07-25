import { createClient } from "@/lib/supabase/server";
import { UtensilsCrossed } from "lucide-react";
import MenuItemRow from "./MenuItemRow";
import AdminMenuActions from "./AdminMenuActions";

export const revalidate = 0;

export default async function AdminMenu() {
  const supabase = await createClient();

  const { data: menuItems, error } = await supabase
    .from("menu_items")
    .select(`*, categories(name)`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching menu items:", error);
  }

  const { data: categories } = await supabase.from("categories").select("*");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">Menu</h1>
          <p className="text-muted text-sm mt-1">Gérez l'ensemble des plats et leur disponibilité</p>
        </div>
        <AdminMenuActions categories={categories || []} />
      </div>

      <div className="bg-card rounded-2xl shadow-xs border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 text-muted text-sm font-semibold border-b border-border">
                <th className="p-4 font-semibold">Plat</th>
                <th className="p-4 font-semibold">Catégorie</th>
                <th className="p-4 font-semibold">Prix</th>
                <th className="p-4 font-semibold text-center">Disponible</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground">
              {menuItems?.map((item) => (
                <MenuItemRow key={item.id} item={item} categories={categories || []} />
              ))}
              {!menuItems?.length && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted">
                    Aucun plat dans le menu.
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
