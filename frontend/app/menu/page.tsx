import { createClient } from "@/lib/supabase/server";
import MenuClient from "./MenuClient";
import { AIAssistantWidget } from "@/components/ai/AIAssistantWidget";
import { Sparkles } from "lucide-react";

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
    <div className="container mx-auto px-4 py-8 sm:py-10 max-w-7xl">
      {/* Menu Header Banner */}
      <div className="mb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-rose/10 border border-brand-rose/20 text-brand-rose text-xs font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          <span>CARTE GASTRONOMIQUE DU JOUR</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground tracking-tight">
          Notre Menu Gourmand
        </h1>
        <p className="text-muted text-sm sm:text-base max-w-2xl leading-relaxed">
          Pâtisseries artisanales, douceurs sucrées et grands classiques de la cuisine africaine et occidentale. Préparés chaque jour avec amour et fraîcheur.
        </p>
      </div>

      <MenuClient initialCategories={categories} initialItems={menuItems} />
      <AIAssistantWidget />
    </div>
  );
}
