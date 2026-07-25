import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ChevronLeft, MapPin, Phone, Clock, FileText } from "lucide-react";
import Link from "next/link";
import { updateOrderStatus } from "../actions";
import { FloatingChat } from "@/components/chat/FloatingChat";

export const revalidate = 0;

export default async function AdminOrderDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch order details
  const { data: order, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      profiles:user_id (
        full_name,
        phone_number
      ),
      order_items (
        id,
        quantity,
        unit_price,
        special_instructions,
        menu_items (
          name,
          image_url
        )
      )
    `
    )
    .eq("id", id)
    .single();

  if (error || !order) {
    notFound();
  }

  // Fetch deliverers
  const { data: deliverers } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("role", "deliverer");

  const profile = Array.isArray(order.profiles) ? order.profiles[0] : order.profiles;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-950/60 text-yellow-800 dark:text-yellow-300 rounded-full text-sm font-medium">En attente</span>;
      case "preparing":
        return <span className="px-3 py-1 bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">En préparation</span>;
      case "on_route":
        return <span className="px-3 py-1 bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 rounded-full text-sm font-medium">En route</span>;
      case "delivered":
        return <span className="px-3 py-1 bg-green-100 dark:bg-green-950/60 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">Livré</span>;
      case "cancelled":
        return <span className="px-3 py-1 bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 rounded-full text-sm font-medium">Annulé</span>;
      default:
        return <span className="px-3 py-1 bg-muted/20 text-muted rounded-full text-sm font-medium">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/orders"
          className="p-2 bg-card border border-border rounded-lg text-muted hover:bg-muted/40 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-serif text-primary">
            Commande #{order.id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="text-muted text-sm">
            Passée le {new Date(order.created_at).toLocaleString("fr-FR")}
          </p>
        </div>
        <div className="ml-auto">
          {getStatusBadge(order.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column (Customer & Delivery Info) */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Client</h2>
            <div className="space-y-3 text-sm">
              <p className="font-medium text-foreground">{profile?.full_name || "Client Inconnu"}</p>
              <div className="flex items-start gap-2 text-muted">
                <Phone className="w-4 h-4 mt-0.5" />
                <span>{order.contact_phone || profile?.phone_number || "Non renseigné"}</span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Livraison</h2>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-2 text-muted">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{order.delivery_address || "À emporter"}</span>
              </div>
              {order.delivery_notes && (
                <div className="flex items-start gap-2 text-muted">
                  <FileText className="w-4 h-4 mt-0.5 shrink-0" />
                  <span className="italic">{order.delivery_notes}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Paiement</h2>
            <div className="space-y-2 text-sm text-muted">
              <p>Méthode : <span className="font-medium text-foreground capitalize">{order.payment_method}</span></p>
              <p>Montant total : <span className="font-bold text-primary text-lg">{order.total_amount.toLocaleString()} FCFA</span></p>
            </div>
          </div>
        </div>

        {/* Right Column (Items & Actions) */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">Articles commandés</h2>
            </div>
            <div className="divide-y divide-border">
              {order.order_items?.map((item: any) => {
                const menuItem = Array.isArray(item.menu_items) ? item.menu_items[0] : item.menu_items;
                return (
                  <div key={item.id} className="p-6 flex gap-4">
                    <div className="w-16 h-16 bg-muted/30 rounded-lg overflow-hidden shrink-0">
                      {menuItem?.image_url ? (
                        <img src={menuItem.image_url} alt={menuItem.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted">
                          <UtensilsCrossed className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-foreground">{menuItem?.name || "Plat inconnu"}</h3>
                          <p className="text-sm text-muted">Quantité : {item.quantity}</p>
                        </div>
                        <p className="font-medium text-foreground">{(item.unit_price * item.quantity).toLocaleString()} FCFA</p>
                      </div>
                      {item.special_instructions && (
                        <p className="mt-2 text-sm text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 p-2 rounded border border-amber-100 dark:border-amber-900/50">
                          Note : {item.special_instructions}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Gestion du Statut</h2>
            
            <OrderManagementForm 
              orderId={order.id} 
              currentStatus={order.status} 
              currentDelivererId={order.deliverer_id}
              deliverers={deliverers || []} 
            />
          </div>
        </div>
      </div>
      <FloatingChat orderId={order.id} currentUserId={user.id} />
    </div>
  );
}

// Just to avoid missing UtensilsCrossed error
import { UtensilsCrossed } from "lucide-react";
import OrderManagementForm from "../OrderManagementForm";
