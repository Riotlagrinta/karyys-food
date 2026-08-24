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
import {
  Search,
  Sparkles,
  ArrowRight,
  Cake,
  Clock,
  ShieldCheck,
  Bot,
  Flame,
  ChefHat,
} from "lucide-react";

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
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-start overflow-hidden">
      {/* Background Ambience Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-full max-w-6xl h-96 bg-gradient-to-b from-brand-rose/15 via-primary/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-72 right-[-10%] -z-10 w-80 h-80 bg-brand-rose-light/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-96 left-[-10%] -z-10 w-80 h-80 bg-brand-brown/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="w-full max-w-6xl px-4 pt-8 pb-12 sm:pt-14 sm:pb-16 flex flex-col items-center text-center">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-rose/10 border border-brand-rose/30 text-brand-rose dark:text-brand-rose-light text-xs sm:text-sm font-semibold mb-6 shadow-xs animate-in fade-in slide-in-from-top-4 duration-500">
          <Sparkles className="w-4 h-4 text-brand-rose" />
          <span>Pâtisserie Fine &amp; Saveurs d&apos;Afrique et d&apos;Occident</span>
        </div>

        {/* Main Heading */}
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground max-w-4xl leading-[1.12]">
          L&apos;art de la pâtisserie &amp; des{" "}
          <span className="bg-gradient-to-r from-primary via-brand-brown-light to-brand-rose bg-clip-text text-transparent">
            saveurs gourmandes
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-base sm:text-lg md:text-xl text-muted max-w-2xl font-normal leading-relaxed">
          Gâteaux d&apos;exception, viennoiseries dorées et plats traditionnels préparés chaque jour avec passion. Commandez en ligne et faites-vous livrer en un instant.
        </p>

        {/* Action CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
          <Link href="/menu" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto rounded-full px-8 py-6 text-base font-semibold shadow-md bg-gradient-to-r from-primary to-brand-brown-light hover:opacity-95 text-white gap-2 group">
              <span>Commander en ligne</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/menu" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto rounded-full px-7 py-6 text-base font-semibold border-border/80 hover:bg-muted/40 gap-2"
            >
              <ChefHat className="w-5 h-5 text-brand-rose" />
              <span>Découvrir la carte</span>
            </Button>
          </Link>
        </div>

        {/* Value Props & Trust Badges */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 w-full">
          <div className="flex flex-col items-center p-4 rounded-2xl bg-card/60 border border-border/70 backdrop-blur-md shadow-xs transition-all hover:border-brand-rose/40 hover:scale-[1.02]">
            <div className="w-10 h-10 rounded-xl bg-brand-rose/10 text-brand-rose flex items-center justify-center mb-2.5">
              <Cake className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-foreground">100% Artisanal</h2>
            <p className="text-xs text-muted mt-0.5">Pâtisseries &amp; plats frais</p>
          </div>

          <div className="flex flex-col items-center p-4 rounded-2xl bg-card/60 border border-border/70 backdrop-blur-md shadow-xs transition-all hover:border-primary/40 hover:scale-[1.02]">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2.5">
              <Clock className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-foreground">Livraison Rapide</h2>
            <p className="text-xs text-muted mt-0.5">Suivi en temps réel</p>
          </div>

          <div className="flex flex-col items-center p-4 rounded-2xl bg-card/60 border border-border/70 backdrop-blur-md shadow-xs transition-all hover:border-amber-500/40 hover:scale-[1.02]">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-foreground">Qualité Premium</h2>
            <p className="text-xs text-muted mt-0.5">Ingrédients nobles</p>
          </div>

          <div className="flex flex-col items-center p-4 rounded-2xl bg-card/60 border border-border/70 backdrop-blur-md shadow-xs transition-all hover:border-brand-rose/40 hover:scale-[1.02]">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-rose/20 to-primary/20 text-brand-rose flex items-center justify-center mb-2.5">
              <Bot className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-foreground">Sommelier IA</h2>
            <p className="text-xs text-muted mt-0.5">Conseils personnalisés</p>
          </div>
        </div>
      </section>

      {/* Main Content Grid: Featured Items & Interactive Sidebar */}
      <section className="w-full max-w-6xl px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Section Aperçu du Menu Gourmand */}
          <Card className="lg:col-span-2 border-border/80 shadow-md bg-card/80 backdrop-blur-md overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/40">
              <div>
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-500" />
                  <CardTitle className="text-2xl font-serif text-foreground">
                    Coups de Cœur du Chef
                  </CardTitle>
                </div>
                <CardDescription className="mt-1">
                  Nos meilleures créations et spécialités préparées du jour
                </CardDescription>
              </div>
              <Link href="/menu" className="hidden sm:inline-block">
                <Button variant="outline" size="sm" className="rounded-full text-xs gap-1.5">
                  <span>Tout voir</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="pt-6">
              <GourmetPreview items={featuredItems} />
            </CardContent>
            <CardFooter className="pt-4 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-muted">
                {featuredItems.length > 0
                  ? `${featuredItems.length} plats phares disponibles aujourd'hui`
                  : "Catalogue complet disponible"}
              </span>
              <Link href="/menu" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto rounded-full px-6 bg-brand-rose hover:bg-brand-rose/90 text-white font-semibold shadow-xs">
                  Explorer toute la carte
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Right Column: Quick Search & Custom Order Banner */}
          <div className="space-y-6 flex flex-col justify-between">
            {/* Quick Search Card */}
            <Card className="border-border/80 shadow-sm bg-card/80 backdrop-blur-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-serif">Recherche express</CardTitle>
                <CardDescription>
                  Une envie gourmande précise ?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/menu" className="w-full inline-block">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-muted rounded-xl bg-background/80 hover:bg-muted/40 border-border/80"
                  >
                    <Search className="w-4 h-4 mr-2 text-primary" />
                    <span>Rechercher un délice...</span>
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Custom Events / Catering Banner */}
            <div className="rounded-3xl p-6 relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-amber-900 text-white shadow-xl flex-1 flex flex-col justify-center border border-primary/40">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-rose/20 rounded-full blur-2xl pointer-events-none" />
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold w-fit mb-3 backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Service Traiteur &amp; Événements</span>
              </div>

              <h2 className="font-serif text-2xl font-bold text-white mb-2 leading-tight">
                Une commande sur-mesure ?
              </h2>
              <p className="text-sm text-white/80 mb-5 leading-relaxed">
                Gâteaux d&apos;anniversaire personnalisés, réceptions d&apos;entreprise ou buffets festifs. Notre équipe et le Chef IA vous accompagnent !
              </p>

              <Link href="/menu" className="w-full">
                <Button
                  variant="outline"
                  className="w-full rounded-full bg-white text-primary hover:bg-white/90 font-bold border-0 shadow-md"
                >
                  Commander pour un événement
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Floating AI Sommelier */}
      <AIAssistantWidget />
    </div>
  );
}
