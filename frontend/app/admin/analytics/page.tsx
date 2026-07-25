import { getAnalyticsData } from "./actions";
import AnalyticsCharts from "./AnalyticsCharts";

export const revalidate = 0;

export default async function AdminAnalyticsPage() {
  const analytics = await getAnalyticsData();

  if (analytics.error) {
    return (
      <div className="p-8 text-center text-destructive bg-destructive/10 rounded-2xl border border-border">
        <p>{analytics.error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-serif text-foreground">
          Rapports Visuels & IA
        </h1>
        <p className="text-muted text-sm mt-1">
          Graphiques d'évolution des ventes, répartition par catégorie et recommandations stratégiques IA
        </p>
      </div>

      <AnalyticsCharts
        dailySales={analytics.dailySales || []}
        categoryMap={analytics.categoryMap || {}}
        totalRevenue={analytics.totalRevenue || 0}
        totalOrders={analytics.totalOrders || 0}
      />
    </div>
  );
}
