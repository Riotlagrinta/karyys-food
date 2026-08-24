import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { CartIcon } from "@/components/ui/CartIcon";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { User, LogOut, Sparkles } from "lucide-react";
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
      .select("role, full_name")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md transition-all">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo with Official Emblem Image */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-10 h-10 rounded-2xl overflow-hidden border border-border/80 shadow-xs group-hover:scale-105 transition-transform bg-[#FAF7F5]">
            <Image
              src="/Karyys_Logo.jpg"
              alt="Logo Karyy's Food"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
              Karyy&apos;s Food
            </span>
            <span className="text-[10px] text-muted -mt-1 hidden sm:block tracking-wide">
              Pâtisserie &amp; Restauration
            </span>
          </div>
        </Link>

        {/* Navigation Actions */}
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/menu"
            className="px-3.5 py-1.5 rounded-full text-sm font-medium text-muted hover:text-foreground hover:bg-muted/40 transition-all flex items-center gap-1.5"
          >
            <span>Menu Gourmand</span>
            <Sparkles className="w-3.5 h-3.5 text-brand-rose" />
          </Link>

          {profile?.role === "admin" && (
            <Link
              href="/admin/dashboard"
              className="text-xs font-bold px-3 py-1.5 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors shadow-xs"
            >
              Admin
            </Link>
          )}

          {profile?.role === "deliverer" && (
            <Link
              href="/delivery/dashboard"
              className="text-xs font-bold px-3 py-1.5 bg-amber-700 text-white rounded-full hover:bg-amber-800 transition-colors shadow-xs"
            >
              Livreur
            </Link>
          )}

          <div className="h-5 w-px bg-border/60 mx-1 hidden sm:block" />

          <ThemeToggle />
          <NotificationBell userId={user?.id} />
          <CartIcon />

          {user ? (
            <div className="flex items-center gap-2 sm:gap-3 pl-1">
              <Link
                href="/profile"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/80 bg-card/60 hover:bg-muted/40 text-sm font-medium text-foreground transition-all shadow-xs"
                title="Mon profil"
              >
                <User className="w-4 h-4 text-primary" />
                <span className="hidden md:inline max-w-[100px] truncate text-xs font-medium">
                  {profile?.full_name || "Mon Profil"}
                </span>
              </Link>
              <form action={logout} className="hidden sm:block">
                <button
                  type="submit"
                  className="p-2 rounded-full border border-border/60 hover:bg-destructive/10 hover:text-destructive text-muted transition-colors cursor-pointer"
                  title="Déconnexion"
                  aria-label="Déconnexion"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-xs ml-1"
            >
              Connexion
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
