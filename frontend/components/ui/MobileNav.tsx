"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, UtensilsCrossed, ShoppingBag, User } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useMounted } from "@/hooks/use-mounted";

interface MobileNavProps {
  isAuthenticated?: boolean;
}

export function MobileNav({ isAuthenticated = false }: MobileNavProps) {
  const pathname = usePathname();
  const mounted = useMounted();
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const totalItems = getTotalItems();

  const navItems = [
    {
      label: "Accueil",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      label: "Menu",
      href: "/menu",
      icon: UtensilsCrossed,
      isActive: pathname.startsWith("/menu"),
    },
    {
      label: "Panier",
      href: "/cart",
      icon: ShoppingBag,
      isActive: pathname.startsWith("/cart"),
      badge: mounted && totalItems > 0 ? totalItems : null,
    },
    {
      label: isAuthenticated ? "Compte" : "Connexion",
      href: isAuthenticated ? "/profile" : "/login",
      icon: User,
      isActive: pathname.startsWith("/profile") || pathname.startsWith("/login") || pathname.startsWith("/register"),
    },
  ];

  return (
    <nav
      aria-label="Navigation mobile"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-card/90 backdrop-blur-xl border-t border-border/80 shadow-2xl safe-area-pb"
    >
      <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 transition-all duration-200 ${
                item.isActive
                  ? "text-primary font-bold"
                  : "text-muted hover:text-foreground font-medium"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${item.isActive ? "scale-110" : ""}`} />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 inline-flex items-center justify-center min-w-[16px] h-4 px-1 text-[9px] font-extrabold text-white bg-gradient-to-r from-rose-500 to-brand-rose rounded-full ring-2 ring-card shadow-xs">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 tracking-tight ${item.isActive ? "text-primary font-semibold" : ""}`}>
                {item.label}
              </span>
              {item.isActive && (
                <span className="absolute bottom-1 w-5 h-0.5 bg-primary rounded-full animate-in fade-in zoom-in" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
