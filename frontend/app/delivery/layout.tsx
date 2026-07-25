import Link from "next/link";
import { LogOut, Map, History } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { logout } from "@/app/auth/actions";

export default async function DeliveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 md:pb-0 flex flex-col md:flex-row">
      {/* Top Header Mobile */}
      <header className="bg-card border-b border-border p-4 sticky top-0 z-10 flex justify-between items-center md:hidden">
        <h1 className="font-serif text-xl font-bold text-primary">Karyy's Rider</h1>
        <form action={logout}>
          <button type="submit" className="text-muted hover:text-red-500 transition-colors p-2">
            <LogOut className="w-5 h-5" />
          </button>
        </form>
      </header>

      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border min-h-screen fixed">
        <div className="p-6 border-b border-border">
          <h1 className="font-serif text-2xl font-bold text-primary">Karyy's Rider</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/delivery/dashboard"
            className="flex items-center gap-3 px-4 py-3 text-muted hover:bg-muted/40 hover:text-primary rounded-lg transition-colors font-medium"
          >
            <Map className="w-5 h-5" />
            Mes Courses
          </Link>
          <Link
            href="/delivery/history"
            className="flex items-center gap-3 px-4 py-3 text-muted hover:bg-muted/40 hover:text-primary rounded-lg transition-colors font-medium"
          >
            <History className="w-5 h-5" />
            Historique
          </Link>
        </nav>
        <div className="p-4 border-t border-border">
          <form action={logout}>
            <button type="submit" className="flex items-center gap-3 px-4 py-3 text-muted hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 rounded-lg transition-colors w-full font-medium">
              <LogOut className="w-5 h-5" />
              Déconnexion
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <div className="max-w-md mx-auto md:max-w-3xl">
          {children}
        </div>
      </main>

      {/* Bottom Navigation Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around p-3 pb-safe z-50">
        <Link
          href="/delivery/dashboard"
          className="flex flex-col items-center gap-1 text-muted hover:text-primary dark:hover:text-amber-200 p-2"
        >
          <Map className="w-6 h-6" />
          <span className="text-[10px] font-medium">Courses</span>
        </Link>
        <Link
          href="/delivery/history"
          className="flex flex-col items-center gap-1 text-muted hover:text-primary dark:hover:text-amber-200 p-2"
        >
          <History className="w-6 h-6" />
          <span className="text-[10px] font-medium">Historique</span>
        </Link>
      </nav>
    </div>
  );
}
