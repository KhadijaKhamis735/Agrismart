import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { getPredictions } from "../api/endpoints";
import LoadingSpinner from "../components/LoadingSpinner";
import ResultBadge from "../components/ResultBadge";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";

const recommendationsByResult = {
  low: ["recommendLow1", "recommendLow2", "recommendLow3", "recommendLow4"],
  medium: ["recommendMedium1", "recommendMedium2", "recommendMedium3", "recommendMedium4"],
  high: ["recommendHigh1", "recommendHigh2", "recommendHigh3", "recommendHigh4"],
};

export default function History() {
  const { ensureValidToken } = useAuth();
  const { t, language } = useUI();
  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadHistory = async () => {
      const token = await ensureValidToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await getPredictions(token);
        setPredictions(data || []);
      } catch {
        toast.error(t("toastHistoryFailed"));
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [ensureValidToken, t]);

  const selectedPrediction = useMemo(
    () => predictions.find((item) => item.id === selectedId) || null,
    [predictions, selectedId]
  );

  const selectedRecommendations = useMemo(() => {
    const resultKey = String(selectedPrediction?.result || "").toLowerCase();
    return recommendationsByResult[resultKey]?.map((key) => t(key)) || [];
  }, [selectedPrediction, t]);

  const formatDate = (value) => {
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

  if (loading) {
    return <LoadingSpinner label={t("loadingAnalytics")} />;
  }

  const onViewPrediction = (predictionId) => {
    setSelectedId(predictionId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="mx-auto w-full max-w-screen-xl-custom space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-green-700 dark:text-green-300">{t("historyTitle")}</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{t("historySubtitle")}</p>
      </div>

      <div className="app-card overflow-x-auto rounded-xl p-4">
        {predictions.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-green-700 dark:border-gray-700 dark:text-green-300">
                <th className="px-3 py-3">{t("date")}</th>
                <th className="px-3 py-3">{t("soil")}</th>
                <th className="px-3 py-3">{t("location")}</th>
                <th className="px-3 py-3">{t("result")}</th>
                <th className="px-3 py-3">{t("historyActions")}</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((row) => (
                <tr
                  key={row.id}
                  className={`border-b border-gray-100 text-gray-700 last:border-0 dark:border-gray-700 dark:text-gray-300 ${
                    row.id === selectedId
                      ? "bg-green-50 dark:bg-gray-800"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <td className="px-3 py-3 text-xs">{formatDate(row.created_at)}</td>
                  <td className="px-3 py-3">{soilLabelMap[row.soil_type] || row.soil_type}</td>
                  <td className="px-3 py-3">{row.location}</td>
                  <td className="px-3 py-3"><ResultBadge result={row.result} /></td>
                  <td className="px-3 py-3">
                    <button
                      type="button"
                      onClick={() => onViewPrediction(row.id)}
                      className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                        row.id === selectedId
                          ? "border border-green-600 bg-green-600 text-white dark:border-green-500 dark:bg-green-500 dark:text-gray-900"
                          : "border border-green-300 bg-white text-green-700 hover:bg-green-50 dark:border-gray-600 dark:bg-gray-700 dark:text-green-300"
                      }`}
                    >
                      {t("historyView")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-300">{t("historyNoData")}</p>
        )}
      </div>

      {isModalOpen && selectedPrediction && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-xl rounded-xl bg-white p-5 shadow-2xl dark:bg-gray-900"
            role="dialog"
            aria-modal="true"
            aria-label={t("historyDetailsTitle")}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-green-700 dark:text-green-300">{t("historyDetailsTitle")}</h2>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-md border border-gray-300 px-2.5 py-1 text-xs font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {t("historyClose")}
              </button>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">{t("result")}</p>
              <div className="mt-2"><ResultBadge result={selectedPrediction.result} /></div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-semibold text-green-700 dark:text-green-300">{t("recommendationsTitle")}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700 dark:text-gray-300">
                {selectedRecommendations.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
