import { LocateFixed, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useUI } from "../context/UIContext";

const soilTypes = [
  { value: "Sandy", key: "soilSandy" },
  { value: "Loamy", key: "soilLoamy" },
  { value: "Clay", key: "soilClay" },
  { value: "Silt", key: "soilSilt" },
  { value: "Peaty", key: "soilPeaty" },
];

const phases = [
  { key: "germination", titleKey: "phaseGerminationTitle" },
  { key: "vegetative", titleKey: "phaseVegetativeTitle" },
  { key: "flowering", titleKey: "phaseFloweringTitle" },
  { key: "grain_filling", titleKey: "phaseGrainFillingTitle" },
  { key: "maturity", titleKey: "phaseMaturityTitle" },
];

export default function PredictionForm({ form, setForm, onWeatherFetch, weatherLoading, onSubmit, loading }) {
  const { t } = useUI();
  const [step, setStep] = useState(0);

  // Total steps: 0 = soil, 1-5 = phases, 6 = location/weather, 7 = days of harvest
  const totalSteps = 8;
  const isLastStep = step === totalSteps - 1;

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="app-card grid gap-6 p-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-green-700 dark:text-green-300">
            {step === 0 && t("soilType")}
            {step >= 1 && step <= 5 && `${t("phaseLabel")} ${step} - ${t(phases[step - 1].titleKey)}`}
            {step === 6 && t("location")}
            {step === 7 && t("daysOfHarvest")}
          </span>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {step + 1} / {totalSteps}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full bg-green-600 transition-all duration-300"
            style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 0: Soil Type */}
      {step === 0 && (
        <div className="grid gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">{t("soilType")}</p>
          <select
            value={form.soil_type}
            onChange={(e) => setForm((prev) => ({ ...prev, soil_type: e.target.value }))}
            className="app-input text-base"
            required
          >
            {soilTypes.map((soil) => (
              <option key={soil.value} value={soil.value}>
                {t(soil.key)}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Steps 1-5: Growth Phases */}
      {step >= 1 && step <= 5 && (
        <div className="grid gap-4">
          {(() => {
            const phase = phases[step - 1];
            return (
              <section className="rounded-xl bg-white p-4 text-gray-800 shadow dark:bg-gray-800 dark:text-white">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{t(phase.titleKey)}</h3>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-300">
                    {t("phaseLabel")} {step}
                  </span>
                </div>

                <div className="grid gap-4">
                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                      {t("irrigationUsedLabel")}
                    </span>
                    <select
                      value={form.phases[phase.key].irrigation}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          phases: {
                            ...prev.phases,
                            [phase.key]: {
                              ...prev.phases[phase.key],
                              irrigation: e.target.value,
                            },
                          },
                        }))
                      }
                      className="app-input"
                    >
                      <option value="Yes">{t("yes")}</option>
                      <option value="No">{t("no")}</option>
                    </select>
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                      {t("fertilizerAppliedLabel")}
                    </span>
                    <select
                      value={form.phases[phase.key].fertilizer}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          phases: {
                            ...prev.phases,
                            [phase.key]: {
                              ...prev.phases[phase.key],
                              fertilizer: e.target.value,
                            },
                          },
                        }))
                      }
                      className="app-input"
                    >
                      <option value="Yes">{t("yes")}</option>
                      <option value="No">{t("no")}</option>
                    </select>
                  </label>
                </div>
              </section>
            );
          })()}
        </div>
      )}

      {/* Step 6: Location & Weather */}
      {step === 6 && (
        <div className="grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-green-700 dark:text-green-300">{t("location")}</span>
            <div className="flex gap-2">
              <input
                type="text"
                value={form.location}
                placeholder={t("locationPlaceholder")}
                className="app-input app-input-readonly flex-1"
                readOnly
                required
              />
              <button
                type="button"
                onClick={() => onWeatherFetch({ useGeo: true })}
                disabled={weatherLoading}
                className="app-btn-primary inline-flex items-center gap-2 whitespace-nowrap text-sm disabled:cursor-not-allowed"
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
        </div>
      )}

      {/* Step 7: Days of Harvest */}
      {step === 7 && (
        <div className="grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-green-700 dark:text-green-300">{t("daysOfHarvest")}</span>
            <input
              type="number"
              min="1"
              value={form.days_of_harvest}
              onChange={(e) => setForm((prev) => ({ ...prev, days_of_harvest: e.target.value }))}
              placeholder={t("daysOfHarvestPlaceholder")}
              className="app-input text-base"
              required
            />
          </label>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={handlePrev}
          disabled={step === 0}
          className="app-btn-secondary inline-flex items-center justify-center gap-2 py-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft size={18} /> Previous
        </button>

        {isLastStep ? (
          <button
            type="submit"
            disabled={loading}
            className="app-btn-primary inline-flex items-center justify-center gap-2 py-2 font-bold disabled:cursor-not-allowed"
          >
            <CheckCircle size={18} /> {loading ? t("predicting") : t("predict")}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="app-btn-primary inline-flex items-center justify-center gap-2 py-2"
          >
            Next <ChevronRight size={18} />
          </button>
        )}
      </div>
    </form>
  );
}
