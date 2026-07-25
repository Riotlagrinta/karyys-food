import groq from "./groq-client";

// Modèles ordonnés par préférence selon les quotas Groq
const MODELS = [
  "llama-3.3-70b-versatile",  // 1er choix : Le plus intelligent
  "llama-3.1-8b-instant",     // 2ème choix : Ultra-rapide (14.4K requêtes/jour)
  "qwen/qwen3.6-27b",         // 3ème choix : Excellente alternative
  "allam-2-7b"                 // 4ème choix : Fallback de secours
];

export async function generateTextWithFallback(prompt: string, systemPrompt?: string): Promise<string> {
  for (const model of MODELS) {
    try {
      const messages = [];
      if (systemPrompt) {
        messages.push({ role: "system", content: systemPrompt });
      }
      messages.push({ role: "user", content: prompt });

      const completion = await groq.chat.completions.create({
        messages: messages as any,
        model: model,
        temperature: 0.7,
        max_tokens: 1024,
      });

      return completion.choices[0]?.message?.content || "";
    } catch (error: any) {
      console.warn(`[AI Rotation] Model ${model} failed:`, error.message);
      
      // If it's a 429 (Rate Limit) or 503 (Service Unavailable), try the next model
      if (error?.status === 429 || error?.status === 503 || error?.message?.includes("rate limit")) {
        console.log(`[AI Rotation] Switching to next model...`);
        continue;
      }
      
      // If it's another error (e.g. invalid auth), throw it
      throw error;
    }
  }

  throw new Error("All Groq models failed or are rate-limited.");
}
