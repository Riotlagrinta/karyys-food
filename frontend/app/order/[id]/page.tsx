import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock, MapPin, Package } from "lucide-react";
import { FloatingChat } from "@/components/chat/FloatingChat";

export const dynamic = "force-dynamic";

export default async function OrderTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const orderId = resolvedParams.id;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: order } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        id,
        quantity,
        unit_price,
        notes,
        menu_items (
          name,
          image_url
        )
      )
    `)
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Commande introuvable</h1>
        <p className="text-muted mb-8">Cette commande n'existe pas ou vous n'y avez pas accès.</p>
        <Link href="/profile">
          <Button>Retour à mes commandes</Button>
        </Link>
      </div>
    );
  }

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "pending":
        return {
          text: "En attente de validation",
          color: "text-amber-700 dark:text-amber-300",
          bg: "bg-amber-50 dark:bg-amber-950/40",
          icon: Clock,
          progress: 25,
        };
      case "processing":
      case "preparing":
        return {
          text: "En cuisine",
          color: "text-blue-700 dark:text-blue-300",
          bg: "bg-blue-50 dark:bg-blue-950/40",
          icon: Package,
          progress: 50,
        };
      case "on_route":
      case "delivering":
        return {
          text: "En cours de livraison",
          color: "text-indigo-700 dark:text-indigo-300",
          bg: "bg-indigo-50 dark:bg-indigo-950/40",
          icon: MapPin,
          progress: 75,
        };
      case "delivered":
        return {
          text: "Livrée",
          color: "text-green-700 dark:text-green-300",
          bg: "bg-green-50 dark:bg-green-950/40",
          icon: CheckCircle2,
          progress: 100,
        };
      case "cancelled":
        return {
          text: "Annulée",
          color: "text-red-700 dark:text-red-300",
          bg: "bg-red-50 dark:bg-red-950/40",
          icon: CheckCircle2,
          progress: 0,
        };
      default:
        return {
          text: "Statut inconnu",
          color: "text-muted",
          bg: "bg-muted/20",
          icon: Clock,
          progress: 0,
        };
    }
  };

  const statusInfo = getStatusDisplay(order.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl space-y-8">
      <Link href="/profile" className="inline-flex items-center text-sm text-muted hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Retour aux commandes
      </Link>

      <div className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm">
        <div className="text-center space-y-4 mb-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${statusInfo.bg} ${statusInfo.color} mb-2`}>
            <StatusIcon className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground">
            Commande Confirmée !
          </h1>
          <p className="text-muted">
            Numéro de commande : <span className="font-mono font-medium text-foreground">#{order.id.split('-')[0]}</span>
          </p>
        </div>

        {/* Barre de progression */}
        <div className="mb-10">
          <div className="flex justify-between mb-2 text-sm font-medium">
            <span className={statusInfo.progress >= 25 ? "text-primary" : "text-muted"}>Reçue</span>
            <span className={statusInfo.progress >= 50 ? "text-primary" : "text-muted"}>En cuisine</span>
            <span className={statusInfo.progress >= 75 ? "text-primary" : "text-muted"}>En route</span>
            <span className={statusInfo.progress >= 100 ? "text-primary" : "text-muted"}>Livrée</span>
          </div>
          <div className="w-full bg-muted/20 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-1000 ease-in-out"
              style={{ width: `${statusInfo.progress}%` }}
            ></div>
          </div>
          <p className={`text-center mt-4 font-medium ${statusInfo.color}`}>
            Statut actuel : {statusInfo.text}
          </p>
        </div>

        <div className="border-t border-border pt-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Détails de livraison */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-foreground">Détails de livraison</h3>
            <div className="bg-muted/5 p-4 rounded-lg space-y-2 text-sm border border-border">
              <p><span className="text-muted">Adresse :</span> <br/>{order.delivery_address}</p>
              <p><span className="text-muted">Téléphone :</span> <br/>{order.contact_phone}</p>
              {order.delivery_notes && (
                <p><span className="text-muted">Instructions :</span> <br/>{order.delivery_notes}</p>
              )}
            </div>
          </div>

          {/* Résumé de la commande */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-foreground">Résumé des articles</h3>
            <div className="space-y-3">
              {order.order_items.map((item: any) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.quantity}x {item.menu_items?.name}</span>
                  <span className="font-medium">{item.unit_price * item.quantity} FCFA</span>
                </div>
              ))}
              <div className="border-t border-border pt-3 flex justify-between font-bold">
                <span>Total payé</span>
                <span className="text-primary text-lg">{order.total_amount} FCFA</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FloatingChat orderId={order.id} currentUserId={user.id} />
    </div>
  );
}
