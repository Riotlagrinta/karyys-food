import { createClient } from "@/lib/supabase/server";
import AddDelivererModal from "./AddDelivererModal";

export const revalidate = 0;

export default async function AdminDeliverers() {
  const supabase = await createClient();

  const { data: deliverers, error } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, created_at")
    .eq("role", "deliverer")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching deliverers:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-serif text-primary">Livreurs</h1>
        <AddDelivererModal />
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 text-muted text-sm border-b border-border">
                <th className="p-4 font-medium">Nom</th>
                <th className="p-4 font-medium">ID Livreur</th>
                <th className="p-4 font-medium">Date de création</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {deliverers?.map((deliverer) => (
                <tr key={deliverer.id} className="hover:bg-muted/40 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-foreground">
                      {deliverer.full_name || "Livreur Inconnu"}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted font-mono">
                    {deliverer.id}
                  </td>
                  <td className="p-4 text-sm text-muted">
                    {new Date(deliverer.created_at).toLocaleDateString("fr-FR")}
                  </td>
                </tr>
              ))}
              {!deliverers?.length && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-muted">
                    Aucun livreur trouvé. Ajoutez-en un nouveau !
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
