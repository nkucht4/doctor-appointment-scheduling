import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { useAuth } from "../Providers/AuthProvider";
import { AppointmentContext } from "../Providers/AppointmentProvider";
import { AvailabilityContext } from "../Providers/AvailabilityProvider";

export default function DoctorElement({ doctor }) {
  const { user, isAuthenticated } = useAuth();
  const { setDoctorIdAp } = useContext(AppointmentContext);
  const { setDoctorIdAv } = useContext(AvailabilityContext)
  const role = user?.role || 'GUEST';

  const navigate = useNavigate();

  const handleClick = () => {
    setDoctorIdAp(doctor._id);
    setDoctorIdAv(doctor._id);
    navigate(`/calendar/doctor/${doctor._id}`);
  };

  return (
    <div className="card h-100 w-100">
      <div className="card-body">
        <h5 className="card-title">
          {doctor.firstName} {doctor.lastName}
        </h5>
        <p className="card-text">
          <strong>Specjalizacja:</strong> {doctor.specialization || "brak danych"}
        </p>

        {isAuthenticated && user?.role === "PATIENT" && (
          <button className="btn btn-primary" onClick={handleClick}>
            Zobacz kalendarz lekarza
          </button>
        )}
      </div>
    </div>
  );
}