import { LocateFixed } from "lucide-react";
import { useUI } from "../context/UIContext";

const soilTypes = [
  { value: "Sandy", key: "soilSandy" },
  { value: "Loamy", key: "soilLoamy" },
  { value: "Clay", key: "soilClay" },
  { value: "Silt", key: "soilSilt" },
  { value: "Peaty", key: "soilPeaty" },
];

const Toggle = ({ label, value, onChange }) => (
  <div className="app-card flex items-center justify-between rounded-xl p-3">
    <span className="font-medium text-green-700 dark:text-green-300">{label}</span>
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative h-7 w-14 rounded-full transition ${
        value ? "bg-green-600 dark:bg-green-500" : "bg-gray-300 dark:bg-gray-600"
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
          value ? "left-8" : "left-1"
        }`}
      />
    </button>
  </div>
);

export default function PredictionForm({ form, setForm, onWeatherFetch, weatherLoading, onSubmit, loading }) {
  const { t } = useUI();

  return (
    <form
      onSubmit={onSubmit}
      className="app-card grid gap-4 p-6"
    >
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-green-700 dark:text-green-300">{t("soilType")}</span>
        <select
          value={form.soil_type}
          onChange={(e) => setForm((prev) => ({ ...prev, soil_type: e.target.value }))}
          className="app-input"
          required
        >
          {soilTypes.map((soil) => (
            <option key={soil.value} value={soil.value}>
              {t(soil.key)}
            </option>
          ))}
        </select>
      </label>

      <Toggle
        label={t("irrigation")}
        value={form.irrigation}
        onChange={(next) => setForm((prev) => ({ ...prev, irrigation: next }))}
      />
      <Toggle
        label={t("fertilizerUsed")}
        value={form.fertilizer_used}
        onChange={(next) => setForm((prev) => ({ ...prev, fertilizer_used: next }))}
      />

      <label className="grid gap-2">
        <span className="text-sm font-semibold text-green-700 dark:text-green-300">{t("location")}</span>
        <div className="flex gap-2">
          <input
            type="text"
            value={form.location}
            onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
            placeholder={t("locationPlaceholder")}
            className="app-input w-full"
            required
          />
          <button
            type="button"
            onClick={() => onWeatherFetch({ useGeo: true })}
            className="app-btn-primary inline-flex items-center gap-1 text-sm"
          >
            <LocateFixed size={16} /> {t("useMyLocation")}
          </button>
        </div>
      </label>

      <button
        type="button"
        onClick={() => onWeatherFetch({ useGeo: false })}
        disabled={weatherLoading}
        className="app-btn-soft disabled:cursor-not-allowed"
      >
        {weatherLoading ? t("fetchingWeather") : t("fetchWeather")}
      </button>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-green-700 dark:text-green-300">{t("temperature")}</span>
          <input
            type="number"
            value={form.temperature}
            readOnly
            className="app-input app-input-readonly"
            required
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-green-700 dark:text-green-300">{t("rainfall")}</span>
          <input
            type="number"
            value={form.rainfall}
            readOnly
            className="app-input app-input-readonly"
            required
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="app-btn-primary py-3 font-bold disabled:cursor-not-allowed"
      >
        {loading ? t("predicting") : t("predict")}
      </button>
    </form>
  );
}
