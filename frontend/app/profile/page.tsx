import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { LogOut, Package, User } from "lucide-react";
import { logout } from "@/app/auth/actions";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch orders
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900/50";
      case "processing":
        return "bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-900/50";
      case "delivered":
        return "bg-green-100 dark:bg-green-950/60 text-green-800 dark:text-green-300 border-green-200 dark:border-green-900/50";
      case "cancelled":
        return "bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 border-red-200 dark:border-red-900/50";
      default:
        return "bg-background text-muted border-brand-light/20";
    }
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case "pending":
        return "En attente";
      case "processing":
        return "En préparation";
      case "ready":
        return "Prête";
      case "delivering":
        return "En cours de livraison";
      case "delivered":
        return "Livrée";
      case "cancelled":
        return "Annulée";
      default:
        return status;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar / Profile Info */}
        <div className="w-full md:w-1/3 lg:w-1/4">
          <div className="bg-card border border-brand-light/10 rounded-xl p-6 shadow-sm sticky top-24">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-20 h-20 bg-brand-light/20 rounded-full flex items-center justify-center text-brand mb-4">
                <User className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-serif font-bold text-brand-light">
                {profile?.full_name || "Utilisateur"}
              </h2>
              <p className="text-sm text-muted">{user.email}</p>
              {profile?.phone_number && (
                <p className="text-sm text-muted mt-1">{profile.phone_number}</p>
              )}
            </div>

            <div className="space-y-4 pt-6 border-t border-brand-light/10">
              <form action={logout}>
                <Button variant="outline" className="w-full flex items-center justify-center gap-2 text-primary border-border hover:bg-primary/10 hover:text-primary">
                  <LogOut className="w-4 h-4" /> Déconnexion
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Main Content / Orders */}
        <div className="w-full md:w-2/3 lg:w-3/4 space-y-6">
          <h1 className="text-3xl font-serif font-bold text-brand-light mb-6 flex items-center gap-2">
            <Package className="w-8 h-8 text-brand" /> 
            Mes Commandes
          </h1>

          {!orders || orders.length === 0 ? (
            <div className="bg-card border border-brand-light/10 rounded-xl p-8 text-center">
              <p className="text-muted mb-4">Vous n'avez pas encore passé de commande.</p>
              <Link href="/menu">
                <Button>Voir le menu</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-card border border-brand-light/10 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-brand-light/30">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-bold text-lg text-brand-light">
                        Commande #{order.id.slice(0, 8)}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {translateStatus(order.status)}
                      </span>
                    </div>
                    <div className="text-sm text-muted space-y-1">
                      <p>Date : {new Date(order.created_at).toLocaleDateString('fr-FR', { 
                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}</p>
                      <p className="font-medium text-foreground">Total : <span className="text-primary">{order.total_amount} FCFA</span></p>
                    </div>
                  </div>
                  <div>
                    <Button variant="outline" size="sm" disabled>
                      Détails
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
