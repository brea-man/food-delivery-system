import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import AdminDashboard from "./pages/admin/AdminDashboard";
import RestaurantDashboard from "./pages/restaurant/RestaurantDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import HeaderNavbar from "./components/HeaderNavbar";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/restaurant"
          element={
            <ProtectedRoute role="restaurant">
              <RestaurantDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
