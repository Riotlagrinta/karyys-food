import * as React from "react";
import Link from "next/link";
import { CartIcon } from "@/components/ui/CartIcon";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { User, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/auth/actions";

export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-0 bg-transparent backdrop-blur-md transition-all shadow-none">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-serif text-2xl font-bold text-brand">
            Karyy's Food
          </span>
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/menu"
            className="text-sm font-medium text-muted hover:text-brand transition-colors"
          >
            Menu
          </Link>

          {profile?.role === "admin" && (
            <Link
              href="/admin/dashboard"
              className="text-xs font-bold px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-xs"
            >
              Dashboard Admin
            </Link>
          )}

          {profile?.role === "deliverer" && (
            <Link
              href="/delivery/dashboard"
              className="text-xs font-bold px-3 py-1.5 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors shadow-xs"
            >
              Espace Livreur
            </Link>
          )}
          
          <ThemeToggle />
          <NotificationBell userId={user?.id} />
          <CartIcon />

          {user ? (
            <div className="flex items-center gap-4">
              <Link
                href="/profile"
                className="flex items-center gap-2 text-sm font-medium text-muted hover:text-brand transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">Mon Profil</span>
              </Link>
              <form action={logout} className="hidden sm:block">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-primary transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline">Déconnexion</span>
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium text-muted hover:text-brand transition-colors"
            >
              Connexion
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
