"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  UtensilsCrossed,
  FolderTree,
  Users,
  LineChart,
  LogOut,
  Home,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Commandes", href: "/admin/orders", icon: ShoppingCart },
    { name: "Menu", href: "/admin/menu", icon: UtensilsCrossed },
    { name: "Catégories", href: "/admin/categories", icon: FolderTree },
    { name: "Utilisateurs", href: "/admin/users", icon: Users },
    { name: "Analytics", href: "/admin/analytics", icon: LineChart },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-card text-foreground transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 border-r border-border shadow-sm ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 flex items-center justify-between border-b border-border">
          <h1 className="text-2xl font-bold font-serif text-primary">
            Karyy's Admin
          </h1>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary font-bold shadow-sm"
                    : "hover:bg-muted/60 text-muted hover:text-foreground font-medium"
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-border space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors hover:bg-muted/60 text-muted hover:text-foreground font-medium"
          >
            <Home className="w-5 h-5" />
            Retour au site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors hover:bg-muted/60 text-muted hover:text-foreground font-medium text-left"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-background text-foreground">
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between md:hidden shadow-xs">
          <h2 className="text-xl font-bold font-serif text-primary">Admin</h2>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-muted hover:text-foreground hover:bg-muted/60 rounded-xl transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
