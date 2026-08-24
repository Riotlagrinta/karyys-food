import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Navbar } from "@/components/ui/Navbar";
import { MobileNav } from "@/components/ui/MobileNav";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { NotificationListener } from "@/components/notifications/NotificationListener";
import { PWAInstallPrompt } from "@/components/pwa/PWAInstallPrompt";
import { Analytics } from "@vercel/analytics/next";
import { createClient } from "@/lib/supabase/server";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Karyy's Food — Pâtisserie & Restauration Gourmande",
  description: "PWA moderne de commande en ligne, pâtisseries fines artisanales et plats traditionnels africains & occidentaux.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Karyy's Food",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF7F5" },
    { media: "(prefers-color-scheme: dark)", color: "#181310" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html
      lang="fr"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary/20">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NotificationListener />
          <PWAInstallPrompt />
          <Navbar />
          <main className="flex-1 flex flex-col pb-20 md:pb-8">
            {children}
          </main>
          <MobileNav isAuthenticated={!!user} />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
