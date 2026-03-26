import { Link, NavLink, useNavigate } from "react-router-dom";
import { BarChart3, Moon, Settings, Sun } from "lucide-react";

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
      className={`sticky top-0 z-20 w-full border-b text-green-700 shadow-sm dark:text-green-300 ${
        theme === "dark"
          ? "border-gray-700 bg-gray-800"
          : "border-green-200 bg-green-100"
      }`}
      style={{ overflowX: "hidden" }}
    >
      <div className="mx-auto flex w-[92vw] max-w-screen-xl-custom flex-wrap items-center justify-between gap-2 px-3 py-3 sm:px-4">
        <Link to="/" className="flex items-center gap-2 text-base font-bold tracking-wide sm:text-lg">
          <img src={logoImage} alt="Kilimo Logic logo" className="h-8 w-8 rounded object-contain sm:h-9 sm:w-9" />
          <span className="whitespace-nowrap">Kilimo Logic</span>
        </Link>

        <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto sm:flex-nowrap">
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
            className={`inline-flex h-8 w-14 items-center rounded-full border border-white/30 px-1 transition sm:w-16 ${
              theme === "dark" ? "bg-green-900/60" : "bg-white/20"
            }`}
          >
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full bg-white text-green-700 transition ${
                theme === "dark" ? "translate-x-6 sm:translate-x-8" : "translate-x-0"
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
                  `rounded-md border border-transparent px-2 py-2 text-xs font-semibold transition sm:px-3 sm:text-sm ${
                    isActive ? activeClass : ""
                  }`
                }
              >
                {t("navPredict")}
              </NavLink>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `inline-flex items-center gap-1 rounded-md border border-transparent px-2 py-2 text-xs font-semibold transition sm:px-3 sm:text-sm ${
                    isActive ? activeClass : ""
                  }`
                }
              >
                <BarChart3 size={16} /> {t("navDashboard")}
              </NavLink>
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `inline-flex items-center gap-1 rounded-md border border-transparent px-2 py-2 text-xs font-semibold transition sm:px-3 sm:text-sm ${
                    isActive ? activeClass : ""
                  }`
                }
              >
                <Settings size={16} /> {t("navSettings")}
              </NavLink>
              <button
                type="button"
                onClick={onLogout}
                className="rounded-md border border-green-300 bg-white px-2 py-2 text-xs font-semibold text-green-700 dark:border-gray-600 dark:bg-gray-700 dark:text-green-300 sm:px-3 sm:text-sm"
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
