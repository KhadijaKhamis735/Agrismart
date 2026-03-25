import { Navigate, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import { useUI } from "./context/UIContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Predict from "./pages/Predict";
import Register from "./pages/Register";

function App() {
  const { isAuthenticated } = useAuth();
  const { theme } = useUI();

  return (
    <div
      className={`min-h-screen transition-colors ${
        theme === "dark"
          ? "bg-gray-900"
          : "bg-gray-100"
      }`}
    >
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/predict" replace /> : <Login />} />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/predict" replace /> : <Register />}
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
            path="*"
            element={<Navigate to={isAuthenticated ? "/predict" : "/login"} replace />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
