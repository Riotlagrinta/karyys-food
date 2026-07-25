import { createClient } from "@/lib/supabase/server";
import { History, PackageCheck } from "lucide-react";

export const revalidate = 0;

export default async function DeliveryHistory() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: orders, error } = await supabase
    .from("orders")
    .select(`
      id,
      total_amount,
      delivery_address,
      created_at,
      profiles:user_id ( full_name )
    `)
    .eq("deliverer_id", user.id)
    .eq("status", "delivered")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching history:", error);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todaysDeliveries = orders?.filter(o => new Date(o.created_at) >= today).length || 0;

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-serif text-foreground mb-1">Historique</h1>
        <p className="text-muted text-sm">
          Aujourd'hui : <span className="font-bold text-primary">{todaysDeliveries} course{todaysDeliveries !== 1 ? 's' : ''}</span>
        </p>
      </div>

      <div className="space-y-3">
        {orders?.map((order) => {
          const profile = Array.isArray(order.profiles) ? order.profiles[0] : order.profiles;
          
          return (
            <div key={order.id} className="bg-card rounded-xl shadow-sm border border-border p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 dark:bg-green-950/60 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center shrink-0">
                    <PackageCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-foreground text-sm">
                      {profile?.full_name || "Client"}
                    </h2>
                    <p className="text-xs text-muted">
                      {new Date(order.created_at).toLocaleString("fr-FR")}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-foreground text-sm">{order.total_amount.toLocaleString()} FCFA</p>
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium">Livré</p>
                </div>
              </div>
            </div>
          );
        })}

        {(!orders || orders.length === 0) && (
          <div className="bg-card rounded-2xl border border-dashed border-border p-10 flex flex-col items-center justify-center text-center mt-8">
            <History className="w-12 h-12 text-muted mb-3" />
            <p className="text-foreground font-medium">Historique vide</p>
            <p className="text-sm text-muted mt-1">Vos livraisons terminées apparaîtront ici.</p>
          </div>
        )}
      </div>
    </div>
  );
}
