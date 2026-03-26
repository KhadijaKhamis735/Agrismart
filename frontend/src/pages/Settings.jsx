import { useEffect, useState } from "react";
import { Edit2, Save, UserRound, X } from "lucide-react";
import toast from "react-hot-toast";

import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";
import { passwordStrength, sanitizeText } from "../utils/security";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const NOTIFICATION_PREF_KEY = "kilimo_notifications_enabled";

export default function Settings() {
  const { ensureValidToken } = useAuth();
  const { t, language, setLanguage, theme, toggleTheme } = useUI();

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);

  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem(NOTIFICATION_PREF_KEY);
    return saved === null ? true : saved === "true";
  });

  const [profile, setProfile] = useState({
    id: "",
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    date_joined: "",
    last_login: "",
  });

  const [draftProfile, setDraftProfile] = useState(profile);

  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_new_password: "",
  });
  const strength = passwordStrength(passwordForm.new_password);

  useEffect(() => {
    localStorage.setItem(NOTIFICATION_PREF_KEY, String(notificationsEnabled));
  }, [notificationsEnabled]);

  useEffect(() => {
    const load = async () => {
      const token = await ensureValidToken();
      if (!token) {
        toast.error(t("toastSessionExpired"));
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/profile/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to load profile");
        }

        const data = await response.json();
        const normalized = {
          id: data.id,
          username: data.username || "",
          email: data.email || "",
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          date_joined: data.date_joined || "",
          last_login: data.last_login || "",
        };

        setProfile(normalized);
        setDraftProfile(normalized);
      } catch {
        toast.error(t("settingsToastLoadFailed"));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [ensureValidToken, t]);

  const onDraftChange = (event) => {
    const { name, value } = event.target;
    setDraftProfile((prev) => ({ ...prev, [name]: sanitizeText(value) }));
  };

  const onSaveProfile = async () => {
    const token = await ensureValidToken();
    if (!token) {
      toast.error(t("toastSessionExpired"));
      return;
    }

    const updates = {};
    ["username", "email", "first_name", "last_name"].forEach((field) => {
      if (draftProfile[field] !== profile[field]) {
        updates[field] = draftProfile[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      toast.success(t("settingsToastNoProfileChanges"));
      setEditingProfile(false);
      return;
    }

    if (Object.prototype.hasOwnProperty.call(updates, "username")) {
      const proceed = window.confirm(t("settingsConfirmUsernameChange"));
      if (!proceed) return;
    }

    setSavingProfile(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/profile/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const payload = await response.json();
      if (!response.ok) {
        const firstError = Object.values(payload || {})?.[0];
        throw new Error(Array.isArray(firstError) ? firstError[0] : t("settingsToastProfileUpdateFailed"));
      }

      const normalized = {
        id: payload.id,
        username: payload.username || "",
        email: payload.email || "",
        first_name: payload.first_name || "",
        last_name: payload.last_name || "",
        date_joined: payload.date_joined || "",
        last_login: payload.last_login || "",
      };

      setProfile(normalized);
      setDraftProfile(normalized);
      setEditingProfile(false);
      toast.success(t("settingsToastProfileUpdated"));

      if (Object.prototype.hasOwnProperty.call(updates, "username")) {
        toast(t("settingsToastUsernameChanged"));
      }
    } catch (error) {
      toast.error(error.message || t("settingsToastProfileUpdateFailed"));
    } finally {
      setSavingProfile(false);
    }
  };

  const onCancelProfileEdit = () => {
    setDraftProfile(profile);
    setEditingProfile(false);
  };

  const onPasswordFieldChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const onChangePassword = async () => {
    const token = await ensureValidToken();
    if (!token) {
      toast.error(t("toastSessionExpired"));
      return;
    }

    if (!passwordForm.current_password || !passwordForm.new_password || !passwordForm.confirm_new_password) {
      toast.error(t("settingsToastFillPasswordFields"));
      return;
    }

    const proceed = window.confirm(t("settingsConfirmPasswordChange"));
    if (!proceed) return;

    setSavingPassword(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/profile/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwordForm),
      });

      const payload = await response.json();
      if (!response.ok) {
        const firstError = Object.values(payload || {})?.[0];
        throw new Error(Array.isArray(firstError) ? firstError[0] : t("settingsToastPasswordUpdateFailed"));
      }

      setPasswordForm({
        current_password: "",
        new_password: "",
        confirm_new_password: "",
      });
      toast.success(t("settingsToastPasswordUpdated"));
    } catch (error) {
      toast.error(error.message || t("settingsToastPasswordUpdateFailed"));
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label={t("pleaseWait")} />;
  }

  return (
    <div className="mx-auto grid w-full max-w-screen-xl-custom gap-6">
      <div className="app-card rounded-2xl border border-green-200 p-6 shadow-sm dark:border-gray-700">
        <h1 className="text-2xl font-bold text-green-700 dark:text-green-300">{t("settingsTitle")}</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{t("settingsSubtitle")}</p>
      </div>

      <div className="grid gap-6">
        <section className="app-card rounded-xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-green-700 dark:text-green-300">
              <UserRound size={18} /> {t("settingsProfileTitle")}
            </h2>
            {!editingProfile && (
              <button type="button" onClick={() => setEditingProfile(true)} className="app-btn-primary inline-flex items-center gap-2 text-sm">
                <Edit2 size={16} /> {t("settingsEdit")}
              </button>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-green-700 dark:text-green-300">{t("username")}</span>
              <input
                type="text"
                name="username"
                value={draftProfile.username}
                onChange={onDraftChange}
                disabled={!editingProfile}
                className={`app-input ${!editingProfile ? "app-input-readonly" : ""}`}
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-green-700 dark:text-green-300">{t("email")}</span>
              <input
                type="email"
                name="email"
                value={draftProfile.email}
                onChange={onDraftChange}
                disabled={!editingProfile}
                className={`app-input ${!editingProfile ? "app-input-readonly" : ""}`}
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-green-700 dark:text-green-300">{t("settingsFirstName")}</span>
              <input
                type="text"
                name="first_name"
                value={draftProfile.first_name}
                onChange={onDraftChange}
                disabled={!editingProfile}
                className={`app-input ${!editingProfile ? "app-input-readonly" : ""}`}
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-green-700 dark:text-green-300">{t("settingsLastName")}</span>
              <input
                type="text"
                name="last_name"
                value={draftProfile.last_name}
                onChange={onDraftChange}
                disabled={!editingProfile}
                className={`app-input ${!editingProfile ? "app-input-readonly" : ""}`}
              />
            </label>
          </div>

          {editingProfile && (
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={onCancelProfileEdit} className="app-btn-secondary inline-flex items-center justify-center gap-2">
                <X size={16} /> {t("settingsCancel")}
              </button>
              <button
                type="button"
                onClick={onSaveProfile}
                disabled={savingProfile}
                className="app-btn-primary inline-flex items-center justify-center gap-2 disabled:cursor-not-allowed"
              >
                <Save size={16} /> {savingProfile ? t("settingsSaving") : t("settingsSaveProfile")}
              </button>
            </div>
          )}
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="app-card rounded-xl p-5">
          <h2 className="mb-4 text-lg font-semibold text-green-700 dark:text-green-300">{t("settingsChangePassword")}</h2>
          <div className="grid gap-3">
            <input
              type="password"
              name="current_password"
              value={passwordForm.current_password}
              onChange={onPasswordFieldChange}
              className="app-input"
              placeholder={t("settingsCurrentPassword")}
            />
            <input
              type="password"
              name="new_password"
              value={passwordForm.new_password}
              onChange={onPasswordFieldChange}
              className="app-input"
              placeholder={t("settingsNewPassword")}
            />
            <input
              type="password"
              name="confirm_new_password"
              value={passwordForm.confirm_new_password}
              onChange={onPasswordFieldChange}
              className="app-input"
              placeholder={t("settingsConfirmNewPassword")}
            />
            <div className="rounded-md border border-gray-200 p-2 dark:border-gray-700">
              <div className="mb-1 h-2 w-full rounded bg-gray-200 dark:bg-gray-700">
                <div className={`h-2 rounded ${strength.color}`} style={{ width: `${strength.percent}%` }} />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300">{t("passwordStrength")}: {t(`passwordStrength${strength.score}`)}</p>
            </div>
            <button
              type="button"
              onClick={onChangePassword}
              disabled={savingPassword}
              className="app-btn-primary inline-flex items-center justify-center gap-2 disabled:cursor-not-allowed"
            >
              <Save size={16} /> {savingPassword ? t("settingsSaving") : t("settingsUpdatePassword")}
            </button>
          </div>
        </section>

        <section className="app-card rounded-xl p-5">
          <h2 className="mb-4 text-lg font-semibold text-green-700 dark:text-green-300">{t("settingsSimpleSystemSettings")}</h2>
          <div className="grid gap-4 text-sm">
            <label className="grid gap-2">
              <span className="font-semibold">{t("navLanguage")}</span>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="app-input">
                <option value="en">{t("langEnglish")}</option>
                <option value="sw">{t("langSwahili")}</option>
                <option value="fr">{t("langFrench")}</option>
              </select>
            </label>

            <div className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-700">
              <span className="font-semibold">{t("navTheme")}</span>
              <button type="button" onClick={toggleTheme} className="app-btn-soft text-xs">
                {theme === "dark" ? t("settingsSwitchToLight") : t("settingsSwitchToDark")}
              </button>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-700">
              <span className="font-semibold">{t("settingsEnableNotifications")}</span>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="h-4 w-4"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
