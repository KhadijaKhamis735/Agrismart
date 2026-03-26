import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";
import { sanitizeText } from "../utils/security";

export default function Login() {
  const { login, loading } = useAuth();
  const { t } = useUI();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await login(sanitizeText(form.username), form.password);
      toast.success(t("toastWelcome"));
      navigate("/predict");
    } catch (error) {
      toast.error(error.response?.data?.detail || t("toastLoginFailed"));
    }
  };

  return (
    <div className="app-card mx-auto max-w-md p-6">
      <h1 className="mb-2 text-2xl font-bold text-green-700 dark:text-green-300">{t("loginTitle")}</h1>
      <p className="mb-6 text-sm text-green-700 dark:text-green-300">{t("loginSubtitle")}</p>
      <form onSubmit={onSubmit} className="grid gap-4">
        <input
          type="text"
          value={form.username}
          onChange={(e) => setForm((prev) => ({ ...prev, username: sanitizeText(e.target.value) }))}
          placeholder={t("username")}
          className="app-input"
          required
        />
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          placeholder={t("password")}
          className="app-input"
          required
        />
        <button type="submit" className="app-btn-primary">
          {t("loginButton")}
        </button>
      </form>
      {loading && <LoadingSpinner label={t("authenticating")} />}
      <p className="mt-4 text-sm text-green-700 dark:text-green-300">
        {t("noAccount")} <Link to="/register" className="font-semibold text-green-700 dark:text-green-300">{t("register")}</Link>
      </p>
    </div>
  );
}
