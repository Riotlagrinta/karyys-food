import { NextResponse } from "next/server";
import { generateTextWithFallback } from "@/lib/ai/rotation";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { messages, userMessage } = await req.json();
    const supabase = await createClient();

    // Fetch active menu items for contextual recommendations
    const { data: menuItems } = await supabase
      .from("menu_items")
      .select("name, price, description, categories(name)")
      .eq("is_available", true)
      .limit(10);

    const menuContext = menuItems
      ? menuItems
          .map(
            (item: any) =>
              `- ${item.name} (${item.categories?.name || "Général"}) : ${item.price} FCFA - ${item.description || ""}`
          )
          .join("\n")
      : "Restauration africaine, occidentales et pâtisseries faites maison.";

    const systemPrompt = `
Tu es l'Assistant Virtuel Culinaire officiel du restaurant et pâtisserie "Karyy's Food".
Ton rôle est d'accueillir chaleureusement les clients, de répondre à leurs questions sur nos plats, de suggérer de délicieuses spécialités selon leurs envies et de les guider.

Informations Clés du Restaurant :
- Spécialités : Pâtisseries fines (Forêt Noire, Croissants, Fondant), Cuisine Africaine (Poulet DG, Ayimolou, Fufu, Riz Jollof, Akpan) et Occidentale (Burgers maison, Pizzas, Salades, Spaghetti).
- Boissons : Jus de Bissap, Jus de Gingembre, Cocktails tropicaux.
- Paiement : Espèces à la livraison, T-Money & Flooz.

Extrait du Menu Actuel :
${menuContext}

Règles de réponse :
1. Réponds toujours en français, avec un ton amical, chaleureux, gourmand et professionnel.
2. Reste concis (maximum 2 à 3 phrases par réponse).
3. Si le client cherche une idée de repas, propose-lui un assortiment (plat + boisson ou dessert).
`;

    const prompt = `Historique récent : ${JSON.stringify(messages?.slice(-4) || [])}\nQuestion client : ${userMessage}`;

    const reply = await generateTextWithFallback(prompt, systemPrompt);

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("AI Chatbot Error:", error);
    return NextResponse.json(
      { reply: "Désolé, je rencontre une petite difficulté technique. Comment puis-je vous aider sur le menu ?" },
      { status: 500 }
    );
  }
}
