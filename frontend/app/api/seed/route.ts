import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const CATEGORIES = [
  { id: '11111111-1111-1111-1111-111111111111', name: 'Pâtisseries', description: 'Nos délices sucrés et gâteaux sur commande' },
  { id: '22222222-2222-2222-2222-222222222222', name: 'Restauration Africaine', description: 'Plats traditionnels savoureux' },
  { id: '33333333-3333-3333-3333-333333333333', name: 'Restauration Occidentale', description: 'Burgers, pizzas et classiques internationaux' },
  { id: '55555555-5555-5555-5555-555555555555', name: 'Boissons', description: 'Jus naturels, cocktails et boissons rafraîchissantes' },
];

const MENU_ITEMS = [
  // Pâtisseries
  { id: '44444444-4444-4444-4444-444444444441', category_id: '11111111-1111-1111-1111-111111111111', name: 'Forêt Noire', description: 'Gâteau au chocolat, cerises et crème chantilly', price: 15000, is_available: true, image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop' },
  { id: '44444444-4444-4444-4444-444444444442', category_id: '11111111-1111-1111-1111-111111111111', name: 'Croissants (x5)', description: 'Pur beurre, faits maison chaque matin', price: 3000, is_available: true, image_url: 'https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=400&h=300&fit=crop' },
  { id: '44444444-4444-4444-4444-444444444447', category_id: '11111111-1111-1111-1111-111111111111', name: 'Fondant au Chocolat', description: 'Cœur coulant au chocolat noir 70%', price: 5000, is_available: true, image_url: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop' },
  { id: '44444444-4444-4444-4444-444444444448', category_id: '11111111-1111-1111-1111-111111111111', name: 'Tarte aux Fruits', description: 'Fruits frais de saison sur crème pâtissière', price: 8000, is_available: true, image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop' },

  // Restauration Africaine
  { id: '44444444-4444-4444-4444-444444444443', category_id: '22222222-2222-2222-2222-222222222222', name: 'Poulet DG', description: 'Mélange de poulet, frites de plantain et légumes sautés', price: 8000, is_available: true, image_url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=300&fit=crop' },
  { id: '44444444-4444-4444-4444-444444444444', category_id: '22222222-2222-2222-2222-222222222222', name: 'Ayimolou', description: 'Riz et haricots avec sauce tomate pimentée togolaise', price: 2500, is_available: true, image_url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop' },
  { id: '44444444-4444-4444-4444-444444444449', category_id: '22222222-2222-2222-2222-222222222222', name: 'Fufu & Sauce Arachide', description: 'Pâte de manioc avec sauce arachide au poulet fumé', price: 3500, is_available: true, image_url: 'https://images.unsplash.com/photo-1567364816519-cbc9c4ffe1eb?w=400&h=300&fit=crop' },
  { id: '44444444-4444-4444-4444-444444444450', category_id: '22222222-2222-2222-2222-222222222222', name: 'Riz Jollof', description: 'Riz parfumé aux tomates, épices et poulet grillé', price: 4000, is_available: true, image_url: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&h=300&fit=crop' },
  { id: '44444444-4444-4444-4444-444444444451', category_id: '22222222-2222-2222-2222-222222222222', name: 'Grillades de Brochettes', description: 'Brochettes de bœuf marinées aux épices africaines', price: 5000, is_available: true, image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop' },
  { id: '44444444-4444-4444-4444-444444444452', category_id: '22222222-2222-2222-2222-222222222222', name: 'Akpan', description: 'Bouillie de maïs fermenté avec lait sucré', price: 1500, is_available: true, image_url: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=300&fit=crop' },

  // Restauration Occidentale
  { id: '44444444-4444-4444-4444-444444444445', category_id: '33333333-3333-3333-3333-333333333333', name: "Burger Karyy's", description: 'Steak haché, cheddar fondant, salade, sauce secrète maison', price: 4500, is_available: true, image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop' },
  { id: '44444444-4444-4444-4444-444444444446', category_id: '33333333-3333-3333-3333-333333333333', name: 'Pizza Margherita', description: 'Sauce tomate, mozzarella fondante, basilic frais', price: 5000, is_available: true, image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop' },
  { id: '44444444-4444-4444-4444-444444444453', category_id: '33333333-3333-3333-3333-333333333333', name: 'Spaghetti Bolognaise', description: 'Pâtes al dente avec sauce bolognaise maison', price: 3500, is_available: true, image_url: 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=400&h=300&fit=crop' },
  { id: '44444444-4444-4444-4444-444444444454', category_id: '33333333-3333-3333-3333-333333333333', name: 'Salade César', description: 'Romaine croquante, croutons, parmesan, sauce César', price: 3000, is_available: true, image_url: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop' },

  // Boissons
  { id: '44444444-4444-4444-4444-444444444455', category_id: '55555555-5555-5555-5555-555555555555', name: 'Jus de Bissap', description: 'Hibiscus frais, sucré et glacé - la boisson emblématique', price: 1000, is_available: true, image_url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop' },
  { id: '44444444-4444-4444-4444-444444444456', category_id: '55555555-5555-5555-5555-555555555555', name: 'Jus de Gingembre', description: 'Gingembre frais pressé avec citron et menthe', price: 1000, is_available: true, image_url: 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=400&h=300&fit=crop' },
  { id: '44444444-4444-4444-4444-444444444457', category_id: '55555555-5555-5555-5555-555555555555', name: 'Cocktail Tropical', description: 'Mangue, ananas, passion - un voyage exotique', price: 2000, is_available: true, image_url: 'https://images.unsplash.com/photo-1546171753-97d7676e4602?w=400&h=300&fit=crop' },
];

export async function GET() {
  try {
    // Utiliser le service_role pour contourner les RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Insérer les catégories (upsert pour éviter les doublons)
    const { error: catError } = await supabase
      .from("categories")
      .upsert(CATEGORIES, { onConflict: "id" });

    if (catError) {
      console.error("Category seed error:", catError);
      return NextResponse.json({ error: "Erreur catégories", details: catError.message }, { status: 500 });
    }

    // 2. Insérer les plats (upsert pour éviter les doublons)
    const { error: itemError } = await supabase
      .from("menu_items")
      .upsert(MENU_ITEMS, { onConflict: "id" });

    if (itemError) {
      console.error("Menu items seed error:", itemError);
      return NextResponse.json({ error: "Erreur menu_items", details: itemError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `✅ Seed terminé ! ${CATEGORIES.length} catégories et ${MENU_ITEMS.length} plats ajoutés.`,
      categories: CATEGORIES.length,
      menuItems: MENU_ITEMS.length,
    });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
