import { Navigate, Route, Routes } from "react-router-dom";
import { Moon, Sun } from "lucide-react";

import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import { useAuth } from "./context/AuthContext";
import { useUI } from "./context/UIContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Predict from "./pages/Predict";
import Register from "./pages/Register";
import Settings from "./pages/Settings";

function App() {
  const { theme, language, setLanguage, toggleTheme, t } = useUI();
  const { isAuthenticated } = useAuth();

  return (
    <div
      className={`flex min-h-screen w-screen max-w-screen transition-colors ${
        theme === "dark"
          ? "bg-gray-900"
          : "bg-gray-100"
      }`}
      style={{ scrollbarGutter: "stable", overflowX: "hidden" }}
    >
      <div className="fixed right-3 top-3 z-30 flex items-center gap-2 sm:right-5 sm:top-4">
        <select
          aria-label={t("navLanguage")}
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="rounded-md border border-green-300 bg-white px-2 py-1.5 text-xs font-semibold text-green-700 outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-green-300 sm:text-sm"
        >
          <option value="en">🇬🇧 {t("langEnglish")}</option>
          <option value="sw">🇹🇿 {t("langSwahili")}</option>
          <option value="fr">🇫🇷 {t("langFrench")}</option>
        </select>

        <button
          type="button"
          aria-label={t("navTheme")}
          onClick={toggleTheme}
          className="inline-flex h-8 w-14 items-center rounded-full border border-white/30 px-1 transition sm:w-16"
        >
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full bg-white text-green-700 transition ${
              theme === "dark" ? "translate-x-6 sm:translate-x-8" : "translate-x-0"
            }`}
          >
            {theme === "dark" ? <Moon size={14} /> : <Sun size={14} />}
          </span>
        </button>
      </div>

      {isAuthenticated && <Sidebar />}
      <main
        className={`flex-1 ${
          isAuthenticated
            ? "w-full px-3 py-16 sm:px-4 sm:py-16 lg:px-6"
            : "mx-auto w-[92vw] max-w-screen-xl-custom px-3 py-16 sm:px-4 sm:py-16 lg:px-6"
        }`}
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/register"
            element={<Register />}
          />
          <Route
            path="/predict"
            element={
              <ProtectedRoute>
                <Predict />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
