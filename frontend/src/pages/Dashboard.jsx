import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { getPredictionStats } from "../api/endpoints";
import { PieResultChart } from "../components/Charts";
import LoadingSpinner from "../components/LoadingSpinner";
import ResultBadge from "../components/ResultBadge";
import { YIELD_RANGES } from "../components/Charts";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";

export default function Dashboard() {
  const { ensureValidToken } = useAuth();
  const { t, language } = useUI();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    dateRange: "all",
    soilType: "all",
    temperatureRange: "all",
    rainfallRange: "all",
  });

  useEffect(() => {
    const loadStats = async () => {
      const token = await ensureValidToken();
      if (!token) {
        setLoading(false);
        return;
      }

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

  const formatFullDate = (value) => {
    const date = new Date(value);
    if (language === "sw") {
      return date.toLocaleDateString("sw-TZ", { month: "short", day: "numeric", year: "numeric" });
    }
    if (language === "fr") {
      return date.toLocaleDateString("fr-FR", { month: "short", day: "numeric", year: "numeric" });
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const soilLabelMap = {
    Sandy: t("soilSandy"),
    Loamy: t("soilLoamy"),
    Clay: t("soilClay"),
    Silt: t("soilSilt"),
    Peaty: t("soilPeaty"),
  };

  const resultLabelMap = {
    High: t("resultHigh"),
    Medium: t("resultMedium"),
    Low: t("resultLow"),
  };

  const soilOptions = useMemo(() => {
    const history = stats?.recent || [];
    return [...new Set(history.map((item) => item.soil_type))].filter(Boolean);
  }, [stats]);

  const filteredHistory = useMemo(() => {
    const history = stats?.recent || [];
    return history.filter((item) => {
      const itemDate = new Date(item.created_at);

      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const dateRangeCutoff = new Date(now);
      if (filters.dateRange === "7days") dateRangeCutoff.setDate(now.getDate() - 7);
      if (filters.dateRange === "30days") dateRangeCutoff.setDate(now.getDate() - 30);
      if (filters.dateRange === "90days") dateRangeCutoff.setDate(now.getDate() - 90);

      const matchesDate =
        filters.dateRange === "all" ||
        (filters.dateRange === "today" && itemDate >= startOfToday) ||
        (filters.dateRange !== "today" && filters.dateRange !== "all" && itemDate >= dateRangeCutoff);

      const matchesSoil = filters.soilType === "all" || item.soil_type === filters.soilType;

      const temp = Number(item.temperature);
      const rain = Number(item.rainfall);

      const matchesTemp =
        filters.temperatureRange === "all" ||
        (filters.temperatureRange === "cool" && temp < 20) ||
        (filters.temperatureRange === "mild" && temp >= 20 && temp < 25) ||
        (filters.temperatureRange === "warm" && temp >= 25 && temp < 30) ||
        (filters.temperatureRange === "hot" && temp >= 30);

      const matchesRain =
        filters.rainfallRange === "all" ||
        (filters.rainfallRange === "low" && rain < 50) ||
        (filters.rainfallRange === "medium" && rain >= 50 && rain <= 100) ||
        (filters.rainfallRange === "high" && rain > 100);

      return (
        matchesDate &&
        matchesSoil &&
        matchesTemp &&
        matchesRain
      );
    });
  }, [filters, stats]);

  const pieData = useMemo(
    () =>
      (stats?.pie || []).map((entry) => ({
        ...entry,
        resultKey: entry.name,
        name: resultLabelMap[entry.name] || entry.name,
      })),
    [stats, resultLabelMap]
  );

  if (loading) {
    return <LoadingSpinner label={t("loadingAnalytics")} />;
  }

  if (!stats) {
    return <p className="text-center text-sm text-green-700 dark:text-green-300">{t("noAnalytics")}</p>;
  }

  return (
    <div className="mx-auto w-full max-w-screen-xl-custom space-y-6">
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold text-green-700 dark:text-green-300">{t("dashboardTitle")}</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="app-card rounded-xl p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">{t("totalPredictions")}</p>
          <p className="mt-2 text-3xl font-bold text-green-700 dark:text-green-300">{stats.summary.total_predictions || 0}</p>
        </div>
        <PieResultChart data={pieData} title={t("resultDistribution")} />
      </div>

      <div className="app-card rounded-xl p-4 sm:p-5">
        <p className="text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">{t("predictionHistoryFilter")}</p>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <select
            value={filters.dateRange}
            onChange={(e) => setFilters((prev) => ({ ...prev, dateRange: e.target.value }))}
            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            aria-label={t("date")}
          >
            <option value="all">{t("filterAllTime")}</option>
            <option value="today">{t("filterToday")}</option>
            <option value="7days">{t("filterLast7Days")}</option>
            <option value="30days">{t("filterLast30Days")}</option>
            <option value="90days">{t("filterLast90Days")}</option>
          </select>

          <select
            value={filters.soilType}
            onChange={(e) => setFilters((prev) => ({ ...prev, soilType: e.target.value }))}
            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            aria-label={t("soil")}
          >
            <option value="all">{t("filterAllSoilTypes")}</option>
            {soilOptions.map((soil) => (
              <option key={soil} value={soil}>
                {soilLabelMap[soil] || soil}
              </option>
            ))}
          </select>

          <select
            value={filters.temperatureRange}
            onChange={(e) => setFilters((prev) => ({ ...prev, temperatureRange: e.target.value }))}
            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            aria-label={t("temperature")}
          >
            <option value="all">{t("filterTemperatureAll")}</option>
            <option value="cool">{t("filterTemperatureCool")}</option>
            <option value="mild">{t("filterTemperatureMild")}</option>
            <option value="warm">{t("filterTemperatureWarm")}</option>
            <option value="hot">{t("filterTemperatureHot")}</option>
          </select>

          <select
            value={filters.rainfallRange}
            onChange={(e) => setFilters((prev) => ({ ...prev, rainfallRange: e.target.value }))}
            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            aria-label={t("rainfall")}
          >
            <option value="all">{t("filterRainfallAll")}</option>
            <option value="low">{t("filterRainfallLow")}</option>
            <option value="medium">{t("filterRainfallMedium")}</option>
            <option value="high">{t("filterRainfallHigh")}</option>
          </select>
        </div>
      </div>

      <div className="app-card overflow-x-auto rounded-xl p-4">
        <h3 className="mb-4 text-sm font-semibold text-green-700 dark:text-green-300">{t("predictionHistory")}</h3>
        {filteredHistory.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-green-700 dark:border-gray-700 dark:text-green-300">
                <th className="px-3 py-3">{t("date")}</th>
                <th className="px-3 py-3">{t("soil")}</th>
                <th className="px-3 py-3">{t("location")}</th>
                <th className="px-3 py-3">{t("temperature")}°C</th>
                <th className="px-3 py-3">{t("rainfall")}mm</th>
                <th className="px-3 py-3">{t("result")}</th>
                <th className="px-3 py-3">{t("yieldRange")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-100 text-gray-700 hover:bg-gray-50 last:border-0 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <td className="px-3 py-3 text-xs">{formatFullDate(row.created_at)}</td>
                  <td className="px-3 py-3">{soilLabelMap[row.soil_type] || row.soil_type}</td>
                  <td className="px-3 py-3">{row.location}</td>
                  <td className="px-3 py-3">{row.temperature}</td>
                  <td className="px-3 py-3">{row.rainfall}</td>
                  <td className="px-3 py-3">
                    <ResultBadge result={row.result} />
                  </td>
                  <td className="px-3 py-3 text-xs text-gray-600 dark:text-gray-400">
                    {YIELD_RANGES[row.result] || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">{t("noAnalytics")}</p>
        )}
      </div>
    </div>
  );
}
