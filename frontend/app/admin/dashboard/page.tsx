import { createClient } from "@/lib/supabase/server";
import { DollarSign, ShoppingBag, Utensils } from "lucide-react";

export const revalidate = 0; // Disable cache for dashboard

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch today's orders
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("total_amount, status, created_at, id")
    .gte("created_at", today.toISOString());

  // Aggregate stats
  let totalRevenue = 0;
  let totalOrders = 0;
  let pendingOrders = 0;

  if (orders) {
    totalOrders = orders.length;
    orders.forEach((o) => {
      if (o.status !== "cancelled") {
        totalRevenue += o.total_amount;
      }
      if (o.status === "pending") {
        pendingOrders += 1;
      }
    });
  }

  // Fetch all time top menu items
  const { data: orderItems, error: itemsError } = await supabase
    .from("order_items")
    .select("quantity, menu_item_id, menu_items(name)");

  const itemCounts: Record<string, { name: string; quantity: number }> = {};
  if (orderItems) {
    orderItems.forEach((item) => {
      const id = item.menu_item_id;
      const name = Array.isArray(item.menu_items)
        ? (item.menu_items[0] as any)?.name
        : (item.menu_items as any)?.name;

      if (!itemCounts[id]) {
        itemCounts[id] = { name: name || "Inconnu", quantity: 0 };
      }
      itemCounts[id].quantity += item.quantity;
    });
  }

  const topItems = Object.values(itemCounts)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-serif text-foreground">
          Vue d'ensemble
        </h1>
        <p className="text-muted mt-1">
          Statistiques de la journée ({today.toLocaleDateString('fr-FR')})
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-2xl shadow-xs border border-border flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted font-semibold uppercase tracking-wider">Chiffre d'affaires</p>
            <h3 className="text-2xl font-bold text-foreground mt-0.5">
              {totalRevenue.toLocaleString()} FCFA
            </h3>
          </div>
        </div>

        <div className="bg-card p-6 rounded-2xl shadow-xs border border-border flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 rounded-xl flex items-center justify-center font-bold">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted font-semibold uppercase tracking-wider">Commandes du jour</p>
            <h3 className="text-2xl font-bold text-foreground mt-0.5">{totalOrders}</h3>
          </div>
        </div>

        <div className="bg-card p-6 rounded-2xl shadow-xs border border-border flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center font-bold">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted font-semibold uppercase tracking-wider">
              Commandes en attente
            </p>
            <h3 className="text-2xl font-bold text-foreground mt-0.5">{pendingOrders}</h3>
          </div>
        </div>
      </div>

      {/* Top Items Table */}
      <div className="bg-card rounded-2xl shadow-xs border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted/20">
          <h2 className="text-lg font-bold text-foreground">
            Plats les plus populaires
          </h2>
        </div>
        <div className="p-6">
          {topItems.length > 0 ? (
            <div className="space-y-3">
              {topItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-background rounded-xl border border-border"
                >
                  <span className="font-semibold text-foreground">{item.name}</span>
                  <span className="text-primary font-bold text-sm bg-primary/10 px-3 py-1 rounded-full">
                    {item.quantity} vendus
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted text-center py-6">
              Aucune donnée de vente pour le moment.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
