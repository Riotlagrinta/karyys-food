import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, MapPin, Phone, CheckCircle2, User, FileText } from "lucide-react";
import DeliveryStatusManager from "./DeliveryStatusManager";
import { FloatingChat } from "@/components/chat/FloatingChat";

export const revalidate = 0;

export default async function DeliveryOrderDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      *,
      profiles:user_id ( full_name, phone_number ),
      order_items (
        id,
        quantity,
        special_instructions,
        menu_items ( name )
      )
    `)
    .eq("id", id)
    .single();

  if (error || !order) {
    notFound();
  }

  // Security: Ensure the order belongs to this deliverer
  if (order.deliverer_id !== user.id) {
    return (
      <div className="p-6 text-center">
        <p className="text-destructive font-medium">Vous n'êtes pas autorisé à voir cette commande.</p>
        <Link href="/delivery/dashboard" className="text-primary underline mt-4 inline-block">Retour</Link>
      </div>
    );
  }

  const profile = Array.isArray(order.profiles) ? order.profiles[0] : order.profiles;
  const phone = order.contact_phone || profile?.phone_number;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/delivery/dashboard"
          className="p-2 bg-card border border-border rounded-lg text-muted hover:bg-muted/40 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Commande #{order.id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="text-muted text-sm">
            {order.total_amount.toLocaleString()} FCFA
          </p>
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border p-6 space-y-6">
        {/* Client Info */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">{profile?.full_name || "Client Inconnu"}</h2>
              <p className="text-muted text-sm">Client</p>
            </div>
          </div>
          {phone && (
            <a href={`tel:${phone}`} className="w-12 h-12 bg-green-50 dark:bg-green-950/60 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center active:scale-95 transition-transform">
              <Phone className="w-5 h-5" />
            </a>
          )}
        </div>

        <hr className="border-border" />

        {/* Address Info */}
        <div>
          <h3 className="text-sm font-medium text-muted mb-2">Adresse de livraison</h3>
          <div className="flex items-start gap-3 bg-background p-4 rounded-xl border border-border">
            <MapPin className="w-6 h-6 text-muted shrink-0" />
            <p className="text-foreground font-medium">{order.delivery_address || "À emporter"}</p>
          </div>
          {order.delivery_notes && (
            <div className="mt-3 flex items-start gap-3 bg-yellow-50/50 dark:bg-yellow-950/30 p-4 rounded-xl border border-yellow-100 dark:border-yellow-900/50">
              <FileText className="w-5 h-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-800 dark:text-yellow-300 italic">{order.delivery_notes}</p>
            </div>
          )}
        </div>

        <hr className="border-border" />

        {/* Order Items Summary */}
        <div>
          <h3 className="text-sm font-medium text-muted mb-3">Contenu de la commande</h3>
          <ul className="space-y-3">
            {order.order_items?.map((item: any) => {
              const menuItem = Array.isArray(item.menu_items) ? item.menu_items[0] : item.menu_items;
              return (
                <li key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-background text-muted border border-border rounded flex items-center justify-center font-medium text-xs">
                      {item.quantity}x
                    </span>
                    <span className="text-foreground">{menuItem?.name || "Plat inconnu"}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {order.status === "on_route" ? (
        <DeliveryStatusManager orderId={order.id} />
      ) : order.status === "delivered" ? (
        <div className="bg-green-50 dark:bg-green-950/40 border border-green-100 dark:border-green-900/50 text-green-700 dark:text-green-400 p-4 rounded-2xl flex items-center justify-center gap-2 font-medium">
          <CheckCircle2 className="w-6 h-6" />
          Commande livrée
        </div>
      ) : null}

      <FloatingChat orderId={order.id} currentUserId={user.id} />
    </div>
  );
}
