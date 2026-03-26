import { useState } from "react";
import toast from "react-hot-toast";

import { createPrediction, fetchWeather } from "../api/endpoints";
import LoadingSpinner from "../components/LoadingSpinner";
import PredictionForm from "../components/PredictionForm";
import ResultBadge from "../components/ResultBadge";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";

const initialForm = {
  soil_type: "Sandy",
  irrigation: false,
  fertilizer_used: false,
  days_of_harvest: "",
  location: "",
  temperature: "",
  rainfall: "",
};

export default function Predict() {
  const { ensureValidToken } = useAuth();
  const { t } = useUI();
  const [form, setForm] = useState(initialForm);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [predictLoading, setPredictLoading] = useState(false);
  const [result, setResult] = useState(null);

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
      setForm((prev) => ({
        ...prev,
        location: data.location || prev.location,
        temperature: data.temperature,
        rainfall: data.rainfall,
      }));
      if (!silent) {
        toast.success(t("toastWeatherLoaded"));
      }
      return {
        temperature: data.temperature,
        rainfall: data.rainfall,
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
      // Keep weather retrieval automatic and off the main form controls.
      const weatherData = await onWeatherFetch({
        silent: true,
        useGeo: !form.location,
      });
      const payload = {
        ...form,
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
    <div className="mx-auto grid w-full max-w-3xl gap-6">
      <div className="app-card rounded-2xl border border-green-200 p-6 shadow-sm dark:border-gray-700">
        <h1 className="text-2xl font-bold text-green-700 dark:text-green-300">{t("maizePredictionTitle")}</h1>
        <p className="mt-2 text-sm text-green-700 dark:text-green-300">
          {t("maizePredictionNote")}
        </p>
      </div>

      <PredictionForm
        form={form}
        setForm={setForm}
        onWeatherFetch={onWeatherFetch}
        weatherLoading={weatherLoading}
        onSubmit={onSubmit}
        loading={predictLoading}
      />

      {(weatherLoading || predictLoading) && <LoadingSpinner label={t("pleaseWait")} />}

      {result && (
        <div className="app-card rounded-xl p-4">
          <p className="mb-2 text-sm font-semibold text-green-700 dark:text-green-300">{t("predictionResult")}</p>
          <ResultBadge result={result} />
        </div>
      )}
    </div>
  );
}
