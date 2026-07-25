import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { AIAssistantWidget } from "@/components/ai/AIAssistantWidget";
import { GourmetPreview } from "@/components/menu/GourmetPreview";
import Link from "next/link";
import { Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();
  const { data: menuItems } = await supabase
    .from("menu_items")
    .select("*")
    .eq("is_available", true)
    .limit(4);

  const featuredItems = menuItems || [];

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 relative min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background via-background to-muted/20">
      <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-brand/10 via-transparent to-transparent blur-3xl" />
      
      <div className="text-center max-w-3xl mb-10 space-y-4">
        <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground tracking-tight">
          Bienvenue chez <span className="text-brand-rose">Karyy's Food</span>
        </h1>
        <p className="text-muted text-lg md:text-xl font-medium max-w-2xl mx-auto">
          Pâtisserie & Restauration Africaine & Occidentale. Commandez vos délices sucrés et plats traditionnels en quelques clics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {/* Section Aperçu du Menu Gourmand */}
        <Card className="lg:col-span-2 border-brand-rose/20 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-2xl font-serif text-brand-rose">
                Aperçu du Menu Gourmand
              </CardTitle>
              <CardDescription>
                Nos spécialités et plats phares préparés du jour
              </CardDescription>
            </div>
            <Link href="/menu">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                Voir tout le menu
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <GourmetPreview items={featuredItems} />
          </CardContent>
          <CardFooter className="pt-4 border-t border-border/50 flex justify-end">
            <Link href="/menu" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-brand-rose hover:bg-brand-rose/90 text-white font-semibold">
                Explorer tout le menu ({featuredItems.length > 0 ? "17+ Plats" : "Menu"})
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Colonne Recherche & Assistant IA */}
        <div className="space-y-6 flex flex-col justify-between">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-xl">Rechercher un plat</CardTitle>
              <CardDescription>
                Envie de quelque chose en particulier ?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/menu" className="w-full inline-block">
                <Button variant="outline" className="w-full justify-start text-muted">
                  <Search className="w-4 h-4 mr-2" />
                  Rechercher dans le catalogue...
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-brand-brown/30 bg-gradient-to-br from-card to-brand-brown/10 p-6 flex-1 flex flex-col justify-center">
            <h3 className="font-serif text-xl font-bold text-foreground mb-2">
              Une commande sur-mesure ?
            </h3>
            <p className="text-sm text-muted mb-4">
              Pâtisseries d'anniversaire, événements ou livraison groupée. Notre assistant IA et notre équipe sont à votre service !
            </p>
            <Link href="/menu">
              <Button variant="outline" className="w-full">
                Commander maintenant
              </Button>
            </Link>
          </Card>
        </div>
      </div>

      <AIAssistantWidget />
    </div>
  );
}
