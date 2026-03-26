import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

import { createPrediction, fetchWeather } from "../api/endpoints";
import LoadingSpinner from "../components/LoadingSpinner";
import PredictionForm from "../components/PredictionForm";
import ResultBadge from "../components/ResultBadge";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";

const IMPORTANT_PHASES = ["vegetative", "flowering"];

const recommendationsByResult = {
  low: ["recommendLow1", "recommendLow2", "recommendLow3", "recommendLow4"],
  medium: ["recommendMedium1", "recommendMedium2", "recommendMedium3", "recommendMedium4"],
  high: ["recommendHigh1", "recommendHigh2", "recommendHigh3", "recommendHigh4"],
};

const initialForm = {
  soil_type: "Sandy",
  days_of_harvest: "",
  location: "",
  temperature: "",
  rainfall: "",
  phases: {
    germination: { irrigation: "No", fertilizer: "No" },
    vegetative: { irrigation: "Yes", fertilizer: "Yes" },
    flowering: { irrigation: "Yes", fertilizer: "Yes" },
    grain_filling: { irrigation: "No", fertilizer: "No" },
    maturity: { irrigation: "No", fertilizer: "No" },
  },
};

const isYes = (value) => String(value).toLowerCase() === "yes";

const deriveModelFlagsFromPhases = (phases) => ({
  irrigation: IMPORTANT_PHASES.some((phase) => isYes(phases?.[phase]?.irrigation)),
  fertilizer_used: IMPORTANT_PHASES.some((phase) => isYes(phases?.[phase]?.fertilizer)),
});

export default function Predict() {
  const { ensureValidToken, accessToken } = useAuth();
  const { t } = useUI();
  const [form, setForm] = useState(initialForm);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [predictLoading, setPredictLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Get username from JWT token
  let username = "";
  if (accessToken) {
    try {
      const decoded = jwtDecode(accessToken);
      username = decoded.username || decoded.user_id || "";
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
  }

  const onWeatherFetch = async ({ useGeo = false, silent = false } = {}) => {
    const token = await ensureValidToken();
    if (!token) {
      if (!silent) {
        toast.error(t("toastSessionExpired"));
      }
      return;
    }

    setWeatherLoading(true);
    try {
      let params = {};
      if (useGeo) {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        params = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
      } else {
        if (!form.location) {
          if (!silent) {
            toast.error(t("toastEnterLocation"));
          }
          return;
        }
        params = { location: form.location };
      }

      const { data } = await fetchWeather(params, token);
      const normalizedRainfall = useGeo ? Number(data.rainfall) * 1000 : data.rainfall;
      setForm((prev) => ({
        ...prev,
        location: data.location || prev.location,
        temperature: data.temperature,
        rainfall: normalizedRainfall,
      }));
      if (!silent) {
        toast.success(t("toastWeatherLoaded"));
      }
      return {
        temperature: data.temperature,
        rainfall: normalizedRainfall,
      };
    } catch (error) {
      if (!silent) {
        toast.error(error.response?.data?.detail || t("toastWeatherFailed"));
      }
      throw error;
    } finally {
      setWeatherLoading(false);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const token = await ensureValidToken();
    if (!token) {
      toast.error(t("toastSessionExpired"));
      return;
    }

    setPredictLoading(true);
    try {
      let weatherData = null;
      if (form.temperature === "" || form.rainfall === "") {
        weatherData = await onWeatherFetch({
          silent: true,
          useGeo: true,
        });
      }
      const payload = {
        soil_type: form.soil_type,
        location: form.location,
        ...deriveModelFlagsFromPhases(form.phases),
        days_of_harvest: Number(form.days_of_harvest),
        temperature: Number(weatherData?.temperature ?? form.temperature),
        rainfall: Number(weatherData?.rainfall ?? form.rainfall),
      };
      const { data } = await createPrediction(payload, token);
      setResult(data.result);
      toast.success(t("toastPredictionSaved"));
    } catch (error) {
      toast.error(error.response?.data?.detail || t("toastPredictionFailed"));
    } finally {
      setPredictLoading(false);
    }
  };

  return (
    <div className="mx-auto grid w-full max-w-screen-xl-custom gap-6">
      <div className="app-card rounded-2xl border border-green-200 p-6 shadow-sm dark:border-gray-700">
        <h1 className="text-2xl font-bold text-green-700 dark:text-green-300">
          {username ? `${t("welcomeGreeting")}, ${username}!` : t("welcome")}
        </h1>
        <p className="mt-4 text-2xl font-bold text-green-700 dark:text-green-300">{t("maizePredictionTitle")}</p>
      </div>

      <div className="min-h-96">
        <PredictionForm
          form={form}
          setForm={setForm}
          onWeatherFetch={onWeatherFetch}
          weatherLoading={weatherLoading}
          onSubmit={onSubmit}
          loading={predictLoading}
        />
      </div>

      {(weatherLoading || predictLoading) && <LoadingSpinner label={t("pleaseWait")} />}

      {result && (
        <div className="app-card rounded-xl p-4">
          <p className="mb-2 text-sm font-semibold text-green-700 dark:text-green-300">{t("predictionResult")}</p>
          <ResultBadge result={result} />

          {recommendationsByResult[String(result).toLowerCase()] && (
            <div className="mt-4 rounded-xl bg-white p-4 text-gray-800 shadow dark:bg-gray-800 dark:text-white">
              <p className="mb-2 text-sm font-semibold">{t("recommendationsTitle")}</p>
              <ul className="list-inside list-disc space-y-1 text-sm">
                {recommendationsByResult[String(result).toLowerCase()].map((itemKey) => (
                  <li key={itemKey}>{t(itemKey)}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
