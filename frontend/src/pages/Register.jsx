import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { registerUser } from "../api/endpoints";
import { useUI } from "../context/UIContext";

export default function Register() {
  const navigate = useNavigate();
  const { t } = useUI();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await registerUser(form);
      toast.success(t("toastAccountCreated"));
      navigate("/login");
    } catch (error) {
      const payload = error.response?.data;
      const firstError = payload ? Object.values(payload)[0] : null;
      toast.error(firstError?.[0] || t("toastRegisterFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-card mx-auto max-w-md p-6">
      <h1 className="mb-2 text-2xl font-bold text-green-700 dark:text-green-300">{t("registerTitle")}</h1>
      <p className="mb-6 text-sm text-green-700 dark:text-green-300">{t("registerSubtitle")}</p>
      <form onSubmit={onSubmit} className="grid gap-4">
        <input
          type="text"
          value={form.username}
          onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
          placeholder={t("username")}
          className="app-input"
          required
        />
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          placeholder={t("email")}
          className="app-input"
          required
        />
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          placeholder={t("passwordHint")}
          className="app-input"
          minLength={8}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="app-btn-primary disabled:cursor-not-allowed"
        >
          {loading ? t("creatingAccount") : t("register")}
        </button>
      </form>
      <p className="mt-4 text-sm text-green-700 dark:text-green-300">
        {t("alreadyRegistered")} <Link to="/login" className="font-semibold text-green-700 dark:text-green-300">{t("loginButton")}</Link>
      </p>
    </div>
  );
}
