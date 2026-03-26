import { LocateFixed } from "lucide-react";
import { useUI } from "../context/UIContext";

const soilTypes = [
  { value: "Sandy", key: "soilSandy" },
  { value: "Loamy", key: "soilLoamy" },
  { value: "Clay", key: "soilClay" },
  { value: "Silt", key: "soilSilt" },
  { value: "Peaty", key: "soilPeaty" },
];

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

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-green-700 dark:text-green-300">{t("irrigation")}</span>
          <select
            value={String(form.irrigation)}
            onChange={(e) => setForm((prev) => ({ ...prev, irrigation: e.target.value === "true" }))}
            className="app-input"
          >
            <option value="true">{t("yes")}</option>
            <option value="false">{t("no")}</option>
          </select>
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-green-700 dark:text-green-300">{t("fertilizerUsed")}</span>
          <select
            value={String(form.fertilizer_used)}
            onChange={(e) => setForm((prev) => ({ ...prev, fertilizer_used: e.target.value === "true" }))}
            className="app-input"
          >
            <option value="true">{t("yes")}</option>
            <option value="false">{t("no")}</option>
          </select>
        </label>
      </div>

      <label className="grid gap-2">
        <span className="text-sm font-semibold text-green-700 dark:text-green-300">{t("daysOfHarvest")}</span>
        <input
          type="number"
          min="1"
          value={form.days_of_harvest}
          onChange={(e) => setForm((prev) => ({ ...prev, days_of_harvest: e.target.value }))}
          placeholder={t("daysOfHarvestPlaceholder")}
          className="app-input"
          required
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-semibold text-green-700 dark:text-green-300">{t("location")}</span>
        <div className="flex gap-2">
          <input
            type="text"
            value={form.location}
            placeholder={t("locationPlaceholder")}
            className="app-input app-input-readonly w-full"
            readOnly
            required
          />
          <button
            type="button"
            onClick={() => onWeatherFetch({ useGeo: true })}
            disabled={weatherLoading}
            className="app-btn-primary inline-flex items-center gap-1 text-sm disabled:cursor-not-allowed"
          >
            <LocateFixed size={16} /> {weatherLoading ? t("fetchingWeather") : t("useMyLocation")}
          </button>
        </div>
      </label>

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
