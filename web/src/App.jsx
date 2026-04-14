import { Routes, Route, Navigate } from "react-router-dom";
import GuestRoute from "./components/GuestRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <Routes>
      {/* Guest-only routes — redirect to dashboard if already logged in */}
      <Route element={<GuestRoute />}>
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      {/* Protected routes — redirect to signin if not logged in */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>

      {/* Catch-all: redirect to dashboard (which itself redirects to signin if needed) */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
