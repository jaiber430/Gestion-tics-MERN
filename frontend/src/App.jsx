import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/dashboard.jsx";
import ProtectedRoute from './components/ProtectedRoute.jsx'

export default function App() {
  return (
    <Route>
      <Route path="/" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

    </Route>
  );
}
