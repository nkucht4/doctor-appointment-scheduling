import { useContext } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { AuthContext } from "./Providers/AuthProvider";

export default function DoctorCalendarRoute() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const { doctorId } = useParams();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "DOCTOR" && user.id !== doctorId) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
