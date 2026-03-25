import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getPredictionStats } from "../api/endpoints";
import { PieResultChart, SoilBarChart, TrendLineChart } from "../components/Charts";
import LoadingSpinner from "../components/LoadingSpinner";
import ResultBadge from "../components/ResultBadge";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";

const SummaryCard = ({ title, value }) => (
  <div className="app-card rounded-xl p-4">
    <p className="text-xs font-semibold uppercase text-green-700 dark:text-green-300">{title}</p>
    <p className="mt-2 text-2xl font-bold text-green-700 dark:text-green-300">{value || "-"}</p>
  </div>
);

export default function Dashboard() {
  const { ensureValidToken } = useAuth();
  const { t, language } = useUI();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      const token = await ensureValidToken();
      if (!token) return;

      try {
        const { data } = await getPredictionStats(token);
        setStats(data);
      } catch {
        toast.error(t("toastDashboardFailed"));
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [ensureValidToken, t]);

  const formatDate = (value) => {
    const locale = language === "sw" ? "sw-TZ" : language === "fr" ? "fr-FR" : "en-US";
    return new Date(value).toLocaleString(locale);
  };

  if (loading) {
    return <LoadingSpinner label={t("loadingAnalytics")} />;
  }

  if (!stats) {
    return <p className="text-center text-sm text-green-700 dark:text-green-300">{t("noAnalytics")}</p>;
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-5">
      <h1 className="text-2xl font-bold text-green-700 dark:text-green-300">{t("dashboardTitle")}</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard title={t("totalPredictions")} value={stats.summary.total_predictions} />
        <SummaryCard title={t("mostCommonResult")} value={stats.summary.most_common_result} />
        <div className="app-card rounded-xl p-4">
          <p className="text-xs font-semibold uppercase text-green-700 dark:text-green-300">{t("latestResult")}</p>
          <div className="mt-3">
            <ResultBadge result={stats.summary.latest_result} />
          </div>
        </div>
        <SummaryCard
          title={t("lastPredictionDate")}
          value={
            stats.summary.last_prediction_date
              ? formatDate(stats.summary.last_prediction_date)
              : "-"
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PieResultChart data={stats.pie} title={t("resultDistribution")} />
        <TrendLineChart data={stats.line} title={t("predictionTrend")} />
      </div>

      <SoilBarChart data={stats.bar} title={t("resultsBySoilType")} />

      <div className="app-card overflow-x-auto rounded-xl p-4">
        <h3 className="mb-3 text-sm font-semibold text-green-700 dark:text-green-300">{t("lastTenPredictions")}</h3>
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-green-700 dark:border-gray-700 dark:text-green-300">
              <th className="py-2">{t("date")}</th>
              <th className="py-2">{t("soil")}</th>
              <th className="py-2">{t("location")}</th>
              <th className="py-2">{t("temperature")}</th>
              <th className="py-2">{t("rainfall")}</th>
              <th className="py-2">{t("result")}</th>
            </tr>
          </thead>
          <tbody>
            {stats.recent.map((row) => (
              <tr key={row.id} className="border-b border-gray-100 text-green-700 last:border-0 dark:border-gray-700 dark:text-green-300">
                <td className="py-2">{formatDate(row.created_at)}</td>
                <td className="py-2">{row.soil_type}</td>
                <td className="py-2">{row.location}</td>
                <td className="py-2">{row.temperature}</td>
                <td className="py-2">{row.rainfall}</td>
                <td className="py-2">
                  <ResultBadge result={row.result} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
