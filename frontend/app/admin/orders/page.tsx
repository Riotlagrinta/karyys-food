import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Eye } from "lucide-react";

export const revalidate = 0;

export default async function AdminOrders() {
  const supabase = await createClient();

  const { data: orders, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      total_amount,
      status,
      created_at,
      payment_method,
      delivery_address,
      profiles:user_id (
        full_name,
        avatar_url
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-950/60 text-yellow-800 dark:text-yellow-300 rounded-full text-xs font-medium border border-yellow-200 dark:border-yellow-900/50">En attente</span>;
      case "preparing":
        return <span className="px-3 py-1 bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 rounded-full text-xs font-medium border border-blue-200 dark:border-blue-900/50">En préparation</span>;
      case "on_route":
        return <span className="px-3 py-1 bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 rounded-full text-xs font-medium border border-purple-200 dark:border-purple-900/50">En route</span>;
      case "delivered":
        return <span className="px-3 py-1 bg-green-100 dark:bg-green-950/60 text-green-800 dark:text-green-300 rounded-full text-xs font-medium border border-green-200 dark:border-green-900/50">Livré</span>;
      case "cancelled":
        return <span className="px-3 py-1 bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 rounded-full text-xs font-medium border border-red-200 dark:border-red-900/50">Annulé</span>;
      default:
        return <span className="px-3 py-1 bg-muted/30 text-muted rounded-full text-xs font-medium border border-border">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-serif text-foreground">Commandes</h1>
      </div>

      <div className="bg-card rounded-2xl shadow-xs border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 text-muted text-sm font-semibold border-b border-border">
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Client</th>
                <th className="p-4 font-semibold">Montant</th>
                <th className="p-4 font-semibold">Statut</th>
                <th className="p-4 font-semibold">Paiement</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground">
              {orders?.map((order) => {
                const profile = Array.isArray(order.profiles) ? order.profiles[0] : order.profiles;
                return (
                  <tr key={order.id} className="hover:bg-muted/40 transition-colors">
                    <td className="p-4 text-sm text-muted">
                      {new Date(order.created_at).toLocaleString("fr-FR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-foreground">
                        {profile?.full_name || "Client Inconnu"}
                      </div>
                      <div className="text-xs text-muted max-w-[200px] truncate">
                        {order.delivery_address || "À emporter"}
                      </div>
                    </td>
                    <td className="p-4 font-bold text-foreground">
                      {order.total_amount.toLocaleString()} FCFA
                    </td>
                    <td className="p-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="p-4 text-sm text-muted">
                      {order.payment_method}
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center justify-center p-2 text-muted hover:text-primary hover:bg-primary/10 rounded-xl transition-colors"
                        title="Voir les détails"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}

              {!orders?.length && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted">
                    Aucune commande trouvée.
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
