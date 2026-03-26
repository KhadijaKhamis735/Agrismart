import { BarChart3, LogOut, Settings, Sprout } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";
import logoImage from "../assets/hero.png";

const navItems = [
  { to: "/dashboard", labelKey: "navDashboard", icon: BarChart3 },
  { to: "/predict", labelKey: "navPredict", icon: Sprout },
  { to: "/settings", labelKey: "navSettings", icon: Settings },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const { theme, t } = useUI();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      className={`flex w-full flex-col border-b px-4 py-4 md:min-h-screen md:w-64 md:border-b-0 md:border-r md:px-5 md:py-6 ${
        theme === "dark" ? "border-gray-700 bg-gray-900" : "border-green-200 bg-green-50"
      }`}
    >
      <div className="mb-6 flex items-center gap-2 md:mb-8">
        <img src={logoImage} alt="Kilimo Logic logo" className="h-9 w-9 rounded object-contain" />
        <span className="text-lg font-bold text-green-700 dark:text-green-300">Kilimo Logic</span>
      </div>

      <nav className="flex flex-1 flex-col items-start gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `inline-flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-semibold transition ${
                  isActive
                    ? "bg-green-600 text-green-50"
                    : "text-green-700 hover:bg-green-100 dark:text-green-300 dark:hover:bg-gray-800"
                }`
              }
            >
              <Icon size={15} />
              {t(item.labelKey)}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-6 md:mt-auto">
        <button
          type="button"
          onClick={onLogout}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300"
        >
          <LogOut size={14} />
          {t("navLogout")}
        </button>
      </div>
    </aside>
  );
}
