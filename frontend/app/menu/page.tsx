import { createClient } from "@/lib/supabase/server";
import MenuClient from "./MenuClient";
import { AIAssistantWidget } from "@/components/ai/AIAssistantWidget";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const supabase = await createClient();

  const [categoriesResult, menuItemsResult] = await Promise.all([
    supabase.from("categories").select("*").order("name"),
    supabase.from("menu_items").select("*").eq("is_available", true),
  ]);

  const categories = categoriesResult.data || [];
  const menuItems = menuItemsResult.data || [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8 space-y-4">
        <h1 className="text-4xl font-serif font-bold text-brand-light">
          Notre Menu
        </h1>
        <p className="text-muted text-lg max-w-2xl">
          Découvrez nos spécialités, des plats traditionnels africains aux classiques occidentaux en passant par nos délicieuses pâtisseries.
        </p>
      </div>

      <MenuClient initialCategories={categories} initialItems={menuItems} />
      <AIAssistantWidget />
    </div>
  );
}
