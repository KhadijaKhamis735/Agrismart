import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { registerUser } from "../api/endpoints";
import { useUI } from "../context/UIContext";
import { passwordStrength, sanitizeText } from "../utils/security";

export default function Register() {
  const navigate = useNavigate();
  const { t } = useUI();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const strength = passwordStrength(form.password);

  const validatePasswords = () => {
    if (form.password !== form.confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    if (form.password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    
    if (!validatePasswords()) {
      toast.error(passwordError);
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        username: sanitizeText(form.username),
        email: sanitizeText(form.email).toLowerCase(),
        password: form.password,
      });
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
          onChange={(e) => setForm((prev) => ({ ...prev, username: sanitizeText(e.target.value) }))}
          placeholder={t("username")}
          className="app-input"
          required
        />
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: sanitizeText(e.target.value) }))}
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
        <input
          type="password"
          value={form.confirmPassword}
          onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
          placeholder={t("confirmPassword")}
          className={`app-input ${passwordError && form.confirmPassword ? "border-red-500" : ""}`}
          minLength={8}
          required
        />
        {passwordError && form.confirmPassword && (
          <p className="text-xs text-red-600 dark:text-red-400">{passwordError}</p>
        )}
        <div className="rounded-md border border-gray-200 p-2 dark:border-gray-700">
          <div className="mb-1 h-2 w-full rounded bg-gray-200 dark:bg-gray-700">
            <div className={`h-2 rounded ${strength.color}`} style={{ width: `${strength.percent}%` }} />
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300">{t("passwordStrength")}: {t(`passwordStrength${strength.score}`)}</p>
        </div>
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
