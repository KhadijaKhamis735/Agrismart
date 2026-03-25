import { Link, NavLink, useNavigate } from "react-router-dom";
import { BarChart3, Moon, Sun } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";
import logoImage from "../assets/hero.png";

const activeClass = "text-green-50 bg-green-600";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { language, setLanguage, theme, toggleTheme, t } = useUI();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      className={`sticky top-0 z-20 border-b text-green-700 shadow-sm dark:text-green-300 ${
        theme === "dark"
          ? "border-gray-700 bg-gray-800"
          : "border-green-200 bg-green-100"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold tracking-wide">
          <img src={logoImage} alt="Kilimo Logic logo" className="h-9 w-9 rounded object-contain" />
          <span>Kilimo Logic</span>
        </Link>

        <div className="flex items-center gap-2">
          <select
            aria-label={t("navLanguage")}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="rounded-md border border-green-300 bg-white px-2 py-1 text-xs font-semibold text-green-700 outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-green-300"
          >
            <option value="en" className="text-green-700">🇬🇧 {t("langEnglish")}</option>
            <option value="sw" className="text-green-700">🇹🇿 {t("langSwahili")}</option>
            <option value="fr" className="text-green-700">🇫🇷 {t("langFrench")}</option>
          </select>

          <button
            type="button"
            aria-label={t("navTheme")}
            onClick={toggleTheme}
            className={`inline-flex h-8 w-16 items-center rounded-full border border-white/30 px-1 transition ${
              theme === "dark" ? "bg-green-900/60" : "bg-white/20"
            }`}
          >
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full bg-white text-green-700 transition ${
                theme === "dark" ? "translate-x-8" : "translate-x-0"
              }`}
            >
              {theme === "dark" ? <Moon size={14} /> : <Sun size={14} />}
            </span>
          </button>

          {isAuthenticated && (
            <>
            <NavLink
              to="/predict"
              className={({ isActive }) =>
                `rounded-md border border-transparent px-3 py-2 text-sm font-semibold transition ${
                  isActive ? activeClass : "hover:bg-green-200 dark:hover:bg-gray-700"
                }`
              }
            >
              {t("navPredict")}
            </NavLink>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `inline-flex items-center gap-1 rounded-md border border-transparent px-3 py-2 text-sm font-semibold transition ${
                  isActive ? activeClass : "hover:bg-green-200 dark:hover:bg-gray-700"
                }`
              }
            >
              <BarChart3 size={16} /> {t("navDashboard")}
            </NavLink>
            <button
              type="button"
              onClick={onLogout}
              className="rounded-md border border-green-300 bg-white px-3 py-2 text-sm font-semibold text-green-700 hover:bg-green-100 dark:border-gray-600 dark:bg-gray-700 dark:text-green-300 dark:hover:bg-gray-600"
            >
              {t("navLogout")}
            </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
