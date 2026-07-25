import { NextResponse } from "next/server";
import { generateTextWithFallback } from "@/lib/ai/rotation";

export async function POST(req: Request) {
  try {
    const { menuItems } = await req.json();

    if (!menuItems || menuItems.length === 0) {
      return NextResponse.json({ suggestions: [], message: "" }, { status: 400 });
    }

    const systemPrompt = `
Tu es un chef cuisinier togolais virtuel dans un restaurant nommé "Karyy's Food". 
Le client regarde actuellement le menu. 
Tu dois choisir EXACTEMENT 3 plats parmis la liste des plats disponibles fournis, qui feraient un bon repas. 
Retourne ta réponse UNIQUEMENT en JSON avec ce format exact, sans aucun autre texte autour :
{
  "message": "Phrase d'accroche courte et gourmande (ex: Laissez-vous tenter par nos spécialités locales...)",
  "suggested_ids": ["id-du-plat-1", "id-du-plat-2", "id-du-plat-3"]
}
`;

    // Simplifier les items pour le prompt pour économiser des tokens
    const availableItems = menuItems.map((item: any) => ({
      id: item.id,
      name: item.name,
      category: item.category?.name || "Général",
      description: item.description
    }));

    const prompt = `Voici la liste des plats disponibles :\n${JSON.stringify(availableItems, null, 2)}\n\nFais tes 3 choix de plats.`;

    const aiResponse = await generateTextWithFallback(prompt, systemPrompt);
    
    // Nettoyer la réponse pour s'assurer que c'est du JSON valide
    const jsonStr = aiResponse.replace(/```json/g, "").replace(/```/g, "").trim();
    const result = JSON.parse(jsonStr);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("AI Suggestion Error:", error);
    return NextResponse.json({ error: "Failed to generate suggestions" }, { status: 500 });
  }
}
