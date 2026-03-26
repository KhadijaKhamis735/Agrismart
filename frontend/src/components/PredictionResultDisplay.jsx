import ResultBadge from "./ResultBadge";
import { useUI } from "../context/UIContext";

const yieldMessageKeys = {
  Low: "predictionYieldLow",
  Medium: "predictionYieldMedium",
  High: "predictionYieldHigh",
};

export default function PredictionResultDisplay({ result, username, recommendations }) {
  const { t } = useUI();

  if (!result) return null;

  const messageKey = yieldMessageKeys[result];
  const yieldMessage = messageKey ? t(messageKey) : "";

  return (
    <div className="space-y-4">
      {/* Main Result Card */}
      <div className="app-card rounded-xl bg-gradient-to-br from-green-50 to-blue-50 p-6 dark:from-gray-800 dark:to-gray-700">
        {/* Personalized Greeting */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {username ? `${t("welcomeGreeting")}, ${username}` : t("welcome")}
          </p>
        </div>

        {/* Result Badge */}
        <div className="mb-4 inline-block">
          <ResultBadge result={result} />
        </div>

        {/* Yield Prediction Message */}
        {yieldMessage && (
          <div className="mt-4 rounded-lg border-2 border-green-200 bg-white p-4 dark:border-green-700 dark:bg-gray-900">
            <p className="text-sm leading-relaxed text-gray-800 dark:text-gray-200">
              {yieldMessage}
            </p>
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs sm:gap-3">
          <div className="rounded bg-green-100 px-2 py-2 dark:bg-green-900">
            <p className="font-semibold text-green-700 dark:text-green-300">{t("resultHigh")}</p>
            <p className="text-xs text-green-600 dark:text-green-400">&gt; 5.67 t/ac</p>
          </div>
          <div className="rounded bg-yellow-100 px-2 py-2 dark:bg-yellow-900">
            <p className="font-semibold text-yellow-700 dark:text-yellow-300">{t("resultMedium")}</p>
            <p className="text-xs text-yellow-600 dark:text-yellow-400">3.34-5.67 t/ac</p>
          </div>
          <div className="rounded bg-red-100 px-2 py-2 dark:bg-red-900">
            <p className="font-semibold text-red-700 dark:text-red-300">{t("resultLow")}</p>
            <p className="text-xs text-red-600 dark:text-red-400">&lt; 3.34 t/ac</p>
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      {recommendations && recommendations.length > 0 && (
        <div className="app-card rounded-xl p-4">
          <p className="mb-3 text-sm font-semibold text-green-700 dark:text-green-300">
            {t("recommendationsTitle")}
          </p>
          <ul className="space-y-2">
            {recommendations.map((itemKey, idx) => (
              <li key={idx} className="flex gap-3 text-sm text-gray-700 dark:text-gray-300">
                <span className="mt-0.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-600 dark:bg-green-400" />
                <span>{itemKey}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
