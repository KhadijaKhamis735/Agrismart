import { Navigate, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { useUI } from "./context/UIContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Predict from "./pages/Predict";
import Register from "./pages/Register";
import Settings from "./pages/Settings";

function App() {
  const { theme } = useUI();

  return (
    <div
      className={`flex min-h-screen w-screen max-w-screen flex-col transition-colors ${
        theme === "dark"
          ? "bg-gray-900"
          : "bg-gray-100"
      }`}
      style={{ scrollbarGutter: "stable", overflowX: "hidden" }}
    >
      <Navbar />
      <main className="mx-auto w-[92vw] max-w-screen-xl-custom flex-1 px-3 py-5 sm:px-4 sm:py-8 lg:px-6">
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
            element={<Navigate to="/login" replace />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
