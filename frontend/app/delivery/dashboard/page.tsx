import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { MapPin, Navigation, Package } from "lucide-react";

export const revalidate = 0;

export default async function DeliveryDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch assigned orders with status "delivering"
  const { data: orders, error } = await supabase
    .from("orders")
    .select(`
      id,
      total_amount,
      delivery_address,
      contact_phone,
      created_at,
      profiles:user_id ( full_name )
    `)
    .eq("deliverer_id", user.id)
    .eq("status", "on_route")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching assigned orders:", error);
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-serif text-foreground mb-1">Courses en cours</h1>
        <p className="text-muted text-sm">
          Vous avez {orders?.length || 0} commande{orders?.length !== 1 ? 's' : ''} à livrer
        </p>
      </div>

      <div className="space-y-4">
        {orders?.map((order) => {
          const profile = Array.isArray(order.profiles) ? order.profiles[0] : order.profiles;
          
          return (
            <div key={order.id} className="bg-card rounded-2xl shadow-sm border border-border p-5 active:scale-[0.98] transition-transform">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-foreground">
                      {profile?.full_name || "Client"}
                    </h2>
                    <p className="text-sm font-mono text-muted">#{order.id.slice(0, 8).toUpperCase()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{order.total_amount.toLocaleString()} FCFA</p>
                </div>
              </div>

              <div className="bg-muted/30 p-3 rounded-xl mb-4 flex items-start gap-3 border border-border">
                <MapPin className="w-5 h-5 text-muted mt-0.5 shrink-0" />
                <p className="text-sm text-foreground">{order.delivery_address || "À emporter"}</p>
              </div>

              <Link
                href={`/delivery/orders/${order.id}`}
                className="flex items-center justify-center gap-2 w-full bg-primary text-white py-3.5 rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-xs"
              >
                <Navigation className="w-5 h-5" />
                Démarrer la course
              </Link>
            </div>
          );
        })}

        {(!orders || orders.length === 0) && (
          <div className="bg-card rounded-2xl border border-dashed border-border p-10 flex flex-col items-center justify-center text-center">
            <Package className="w-12 h-12 text-muted mb-3" />
            <p className="text-foreground font-medium">Aucune course pour le moment</p>
            <p className="text-sm text-muted mt-1">En attente de nouvelles commandes...</p>
          </div>
        )}
      </div>
    </div>
  );
}
