import Link from "next/link";
import { Smartphone, Zap, Bell, WifiOff, ArrowLeft } from "lucide-react";

export default function InstallPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/20 via-background to-background py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-brand transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </Link>

        <div className="text-center space-y-3">
          <div className="w-20 h-20 bg-primary text-white rounded-3xl mx-auto flex items-center justify-center font-serif text-4xl font-bold shadow-xl border-4 border-card">
            K
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-foreground">
            Installer Karyy's Food App
          </h1>
          <p className="text-muted max-w-md mx-auto text-sm md:text-base">
            Profitez d'une expérience fluide, rapide et optimisée sur votre smartphone sans passer par les stores.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card p-6 rounded-2xl border border-border shadow-xs flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 rounded-xl flex items-center justify-center mb-3">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-foreground mb-1">Accès Instantané</h3>
            <p className="text-xs text-muted">Lancement en 1 clic depuis votre écran d'accueil.</p>
          </div>

          <div className="bg-card p-6 rounded-2xl border border-border shadow-xs flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-rose-50 dark:bg-rose-950/60 text-primary dark:text-rose-300 rounded-xl flex items-center justify-center mb-3">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-foreground mb-1">Alertes Temps Réel</h3>
            <p className="text-xs text-muted">Notifications pour le suivi de votre commande et du livreur.</p>
          </div>

          <div className="bg-card p-6 rounded-2xl border border-border shadow-xs flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-green-50 dark:bg-green-950/60 text-green-700 dark:text-green-300 rounded-xl flex items-center justify-center mb-3">
              <WifiOff className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-foreground mb-1">Mode Hors-Ligne</h3>
            <p className="text-xs text-muted">Consultez le menu même sans connexion Internet stable.</p>
          </div>
        </div>

        <div className="bg-card rounded-3xl p-6 md:p-8 border border-border shadow-md space-y-6">
          <h2 className="text-xl font-bold font-serif text-foreground flex items-center gap-2">
            <Smartphone className="w-6 h-6 text-primary" />
            Comment installer sur mobile ?
          </h2>

          <div className="space-y-4 text-sm">
            <div className="p-4 bg-background rounded-2xl border border-border space-y-2">
              <h3 className="font-bold text-foreground">📱 Sur Android (Chrome) :</h3>
              <ol className="list-decimal list-inside text-muted space-y-1">
                <li>Appuyez sur le menu (les 3 points en haut à droite).</li>
                <li>Sélectionnez <span className="font-semibold text-primary">"Ajouter à l'écran d'accueil"</span> ou <span className="font-semibold text-primary">"Installer l'application"</span>.</li>
                <li>Validez. L'icône Karyy's Food apparaît sur votre écran !</li>
              </ol>
            </div>

            <div className="p-4 bg-background rounded-2xl border border-border space-y-2">
              <h3 className="font-bold text-foreground">🍏 Sur iPhone (Safari) :</h3>
              <ol className="list-decimal list-inside text-muted space-y-1">
                <li>Appuyez sur le bouton de Partage (carré avec la flèche vers le haut).</li>
                <li>Faites défiler vers le bas et appuyez sur <span className="font-semibold text-primary">"Sur l'écran d'accueil"</span>.</li>
                <li>Appuyez sur <span className="font-semibold text-primary">"Ajouter"</span> en haut à droite.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
