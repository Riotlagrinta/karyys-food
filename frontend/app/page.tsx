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
import { AITriggerButton } from "@/components/ai/AITriggerButton";
import { GourmetPreview } from "@/components/menu/GourmetPreview";
import Link from "next/link";
import Image from "next/image";
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
  Star,
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

      {/* Hero Section with 3D Centerpiece */}
      <section className="w-full max-w-6xl px-4 pt-6 pb-12 sm:pt-12 sm:pb-16 flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* Left Column: Text & CTAs */}
        <div className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-rose/10 border border-brand-rose/30 text-brand-rose dark:text-brand-rose-light text-xs sm:text-sm font-semibold mb-6 shadow-xs">
            <Sparkles className="w-4 h-4 text-brand-rose" />
            <span>Pâtisserie Fine &amp; Saveurs d&apos;Afrique et d&apos;Occident</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.12]">
            L&apos;art de la pâtisserie &amp; des{" "}
            <span className="bg-gradient-to-r from-primary via-brand-brown-light to-brand-rose bg-clip-text text-transparent">
              saveurs gourmandes
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg text-muted max-w-xl font-normal leading-relaxed">
            Gâteaux signatures, viennoiseries dorées et plats traditionnels préparés chaque jour avec passion. Commandez en ligne et faites-vous livrer chaud en quelques clics.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
            <Link href="/menu" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto rounded-full px-8 py-6 text-base font-semibold shadow-md bg-gradient-to-r from-primary to-brand-brown-light hover:opacity-95 text-white gap-2 group cursor-pointer">
                <span>Commander en ligne</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/menu" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto rounded-full px-7 py-6 text-base font-semibold border-border/80 hover:bg-muted/40 gap-2 cursor-pointer"
              >
                <ChefHat className="w-5 h-5 text-brand-rose" />
                <span>Découvrir la carte</span>
              </Button>
            </Link>
          </div>

          {/* Social Proof Mini */}
          <div className="mt-8 flex items-center gap-3 text-xs text-muted">
            <div className="flex -space-x-1.5">
              <div className="w-7 h-7 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center font-bold text-[10px] text-primary">K</div>
              <div className="w-7 h-7 rounded-full bg-brand-rose/20 border-2 border-background flex items-center justify-center font-bold text-[10px] text-brand-rose">F</div>
              <div className="w-7 h-7 rounded-full bg-amber-500/20 border-2 border-background flex items-center justify-center font-bold text-[10px] text-amber-600">★</div>
            </div>
            <div className="flex items-center gap-1">
              <div className="flex text-amber-500">
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
              </div>
              <span className="font-semibold text-foreground">4.9/5</span>
              <span>• Plus de 500 gourmets satisfaits</span>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Gourmet Showcase */}
        <div className="flex-1 w-full max-w-lg relative flex items-center justify-center">
          <div className="relative w-full aspect-square max-w-[420px] rounded-3xl overflow-hidden border border-border/60 bg-gradient-to-tr from-card via-card/80 to-brand-rose/10 shadow-3d-card animate-float-3d">
            <Image
              src="/images/3d/gourmet_hero_3d.jpg"
              alt="Composition 3D Gastronomique Karyy's Food"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
            
            {/* 3D Floating Pill Bottom Left */}
            <div className="absolute bottom-4 left-4 p-2.5 rounded-2xl glass-panel shadow-lg flex items-center gap-2.5 border border-white/40 animate-float-reverse-3d">
              <div className="w-8 h-8 rounded-xl bg-brand-rose text-white flex items-center justify-center shadow-xs">
                <Cake className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-foreground">Créations du Chef</p>
                <p className="text-[9px] text-muted">100% Pâtisserie Artisanale</p>
              </div>
            </div>

            {/* 3D Floating Pill Top Right */}
            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full glass-panel text-[11px] font-bold text-foreground shadow-md border border-white/40 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Cuisine Ouverte</span>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props & Trust Badges */}
      <section className="w-full max-w-6xl px-4 mb-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 w-full">
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

          {/* Sommelier IA Trigger Card */}
          <AITriggerButton
            variant="card"
            className="flex flex-col items-center p-4 rounded-2xl bg-card/60 border border-border/70 backdrop-blur-md shadow-xs transition-all hover:border-brand-rose/60 hover:scale-[1.02] text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-rose/20 to-primary/20 text-brand-rose flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <Bot className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">Sommelier IA</h2>
            <p className="text-xs text-muted mt-0.5">Cliquez pour des conseils</p>
          </AITriggerButton>
        </div>
      </section>

      {/* Main Content Grid: Featured Items & Interactive 3D Sidebar */}
      <section className="w-full max-w-6xl px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Section Aperçu du Menu Gourmand */}
          <Card className="lg:col-span-2 border-border/80 shadow-md bg-card/80 backdrop-blur-md overflow-hidden rounded-3xl">
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
                <Button variant="outline" size="sm" className="rounded-full text-xs gap-1.5 cursor-pointer">
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
                <Button className="w-full sm:w-auto rounded-full px-6 bg-brand-rose hover:bg-brand-rose/90 text-white font-semibold shadow-xs cursor-pointer">
                  Explorer toute la carte
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Right Column: Quick Search & 3D Events Banner */}
          <div className="space-y-6 flex flex-col justify-between">
            {/* Quick Search Card */}
            <Card className="border-border/80 shadow-sm bg-card/80 backdrop-blur-md rounded-3xl">
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
                    className="w-full justify-start text-muted rounded-2xl bg-background/80 hover:bg-muted/40 border-border/80 cursor-pointer"
                  >
                    <Search className="w-4 h-4 mr-2 text-primary" />
                    <span>Rechercher un délice...</span>
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Custom Events / 3D Cloche Delivery Banner */}
            <div className="rounded-3xl p-6 relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-amber-900 text-white shadow-xl flex-1 flex flex-col justify-between border border-primary/40">
              <div className="absolute -bottom-6 -right-6 w-36 h-36 rounded-2xl overflow-hidden opacity-35 pointer-events-none">
                <Image
                  src="/images/3d/cloche_delivery_3d.jpg"
                  alt="Cloche de livraison 3D"
                  fill
                  className="object-cover"
                />
              </div>

              <div>
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
              </div>

              <Link href="/menu" className="w-full relative z-10">
                <Button
                  variant="outline"
                  className="w-full rounded-full bg-white text-primary hover:bg-white/90 font-bold border-0 shadow-md cursor-pointer"
                >
                  Commander pour un événement
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI Modal Drawer (renders only when opened) */}
      <AIAssistantWidget />
    </div>
  );
}
