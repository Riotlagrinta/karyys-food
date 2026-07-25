"use client";

import { useState } from "react";
import { BarChart3, TrendingUp, Sparkles, PieChart, Loader2, Award, Zap, CheckCircle2 } from "lucide-react";
import { generateAIAssessment } from "./actions";

interface DailySale {
  day: string;
  dateStr: string;
  amount: number;
  count: number;
}

interface AnalyticsChartsProps {
  dailySales: DailySale[];
  categoryMap: Record<string, number>;
  totalRevenue: number;
  totalOrders: number;
}

export default function AnalyticsCharts({
  dailySales,
  categoryMap,
  totalRevenue,
  totalOrders,
}: AnalyticsChartsProps) {
  const [aiReport, setAiReport] = useState<{
    healthScore?: string;
    summary?: string;
    starDish?: string;
    growthTip?: string;
  } | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Trouver le montant maximal pour déterminer l'échelle du graphique à barres
  const maxAmount = Math.max(...dailySales.map((d) => d.amount), 10000);

  // Calcul du total des catégories pour les pourcentages
  const totalCatAmount = Object.values(categoryMap).reduce((a, b) => a + b, 0) || 1;
  const categoriesList = Object.entries(categoryMap).map(([name, amount]) => ({
    name,
    amount: Math.round(amount),
    percentage: Math.round((amount / totalCatAmount) * 100),
  }));

  const handleGenerateAIReport = async () => {
    setIsLoadingAI(true);
    setError(null);
    const res = await generateAIAssessment();

    setIsLoadingAI(false);
    if (res?.error) {
      setError(res.error);
    } else if (res?.reportData) {
      setAiReport(res.reportData);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Graphique Principal : Chiffre d'Affaires sur 7 jours */}
      <div className="bg-card p-6 md:p-8 rounded-2xl shadow-xs border border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 text-primary rounded-xl">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold font-serif text-foreground">
                Évolution des Ventes (7 Derniers Jours)
              </h2>
            </div>
            <p className="text-xs text-muted mt-1">
              Histogramme dynamique du chiffre d'affaires quotidien en FCFA
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider block">Total Hebdomadaire</span>
            <span className="text-2xl font-bold text-primary">
              {totalRevenue.toLocaleString()} FCFA
            </span>
          </div>
        </div>

        {/* Visualisation SVG des barres de ventes */}
        <div className="pt-8 pb-4">
          <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 px-2 sm:px-6 border-b border-border pb-2">
            {dailySales.map((d, index) => {
              const heightPercent = maxAmount > 0 ? Math.max(10, Math.round((d.amount / maxAmount) * 100)) : 10;
              const isPeakDay = d.amount === maxAmount && maxAmount > 0;

              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2 group relative">
                  {/* Tooltip au survol */}
                  <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background text-xs py-1 px-2.5 rounded-lg shadow-lg whitespace-nowrap z-20 pointer-events-none font-medium">
                    {d.amount.toLocaleString()} FCFA ({d.count} comm.)
                  </div>

                  {/* Valeur affichée sur la barre si espace suffisant */}
                  <span className="text-[10px] font-bold text-muted hidden sm:block">
                    {d.amount > 0 ? `${(d.amount / 1000).toFixed(0)}k` : "0"}
                  </span>

                  {/* La barre de hauteur dynamique */}
                  <div className="w-full max-w-[48px] bg-muted/30 rounded-t-xl overflow-hidden flex items-end h-full">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-xl transition-all duration-500 ${
                        isPeakDay
                          ? "bg-gradient-to-t from-primary to-amber-500 shadow-md"
                          : "bg-primary/80 hover:bg-primary"
                      }`}
                    />
                  </div>

                  {/* Libellé du jour */}
                  <span className="text-xs font-semibold text-foreground capitalize">
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Grille secondaire : Répartition par Catégorie + Module d'Analyse IA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Catégories / Camembert de Répartition */}
        <div className="bg-card p-6 md:p-8 rounded-2xl shadow-xs border border-border flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 rounded-xl">
                <PieChart className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold font-serif text-foreground">
                Répartition des Ventes par Catégorie
              </h2>
            </div>

            <div className="space-y-4">
              {categoriesList.length > 0 ? (
                categoriesList.map((cat, idx) => {
                  const colors = [
                    "bg-primary",
                    "bg-amber-600",
                    "bg-rose-500",
                    "bg-emerald-600",
                    "bg-purple-600",
                  ];
                  const colorClass = colors[idx % colors.length];

                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-sm font-semibold">
                        <span className="text-foreground">{cat.name}</span>
                        <span className="text-muted">
                          {cat.amount.toLocaleString()} FCFA ({cat.percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-3 bg-muted/30 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${Math.max(5, cat.percentage)}%` }}
                          className={`h-full ${colorClass} rounded-full transition-all duration-500`}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-muted text-sm italic py-4">
                  Aucune vente enregistrée dans cette période.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Panneau d'Analyse IA Décisionnelle */}
        <div className="bg-card p-6 md:p-8 rounded-2xl shadow-xs border border-border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 rounded-xl">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold font-serif text-foreground">
                  Rapport Synthétique IA
                </h2>
              </div>
              <button
                onClick={handleGenerateAIReport}
                disabled={isLoadingAI}
                className="flex items-center gap-2 bg-primary text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-colors shadow-xs disabled:opacity-50"
              >
                {isLoadingAI ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyse...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Générer Analyse
                  </>
                )}
              </button>
            </div>

            {error && (
            <div className="p-4 bg-destructive/10 border border-border text-destructive text-sm rounded-xl mb-4">
              {error}
            </div>
          )}

          {aiReport ? (
            <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between p-3 bg-muted/20 rounded-xl border border-border">
                  <span className="text-xs font-semibold text-muted">Score de Santé :</span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs rounded-full border border-emerald-200 dark:border-emerald-900/50">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {aiReport.healthScore || "Excellent"}
                  </span>
                </div>

                <div className="p-4 bg-amber-50/60 dark:bg-amber-950/30 rounded-xl border border-amber-200/60 dark:border-amber-900/40">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 mb-1 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4" />
                    Résumé des Ventes
                  </h4>
                  <p className="text-sm text-foreground font-medium">
                    {aiReport.summary}
                  </p>
                </div>

                <div className="p-4 bg-rose-50/60 dark:bg-rose-950/30 rounded-xl border border-rose-200/60 dark:border-rose-900/40">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300 mb-1 flex items-center gap-1.5">
                    <Award className="w-4 h-4" />
                    Plats & Catégorie Star
                  </h4>
                  <p className="text-sm text-foreground font-medium">
                    {aiReport.starDish}
                  </p>
                </div>

                <div className="p-4 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-200/60 dark:border-blue-900/40">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300 mb-1 flex items-center gap-1.5">
                    <Zap className="w-4 h-4" />
                    Conseil Stratégique IA
                  </h4>
                  <p className="text-sm text-foreground font-medium">
                    {aiReport.growthTip}
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-48 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center p-6">
                <Sparkles className="w-8 h-8 text-muted mb-2" />
                <p className="text-foreground font-medium text-sm">
                  Cliquez sur "Générer Analyse"
                </p>
                <p className="text-xs text-muted mt-1">
                  L'intelligence artificielle synthétisera vos performances sous forme de métriques et recommandations.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
