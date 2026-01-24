import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { useAuth } from "../Providers/AuthProvider";
import { AppointmentContext } from "../Providers/AppointmentProvider";
import { AvailabilityContext } from "../Providers/AvailabilityProvider";
import CommentForm from "../Comments/CommentForm";

export default function DoctorElement({ doctor }) {
  const { user, isAuthenticated, token } = useAuth();
  const { setDoctorIdAp } = useContext(AppointmentContext);
  const { setDoctorIdAv } = useContext(AvailabilityContext)
  const [canReview, setCanReview] = useState(false);
  const role = user?.role || 'GUEST';
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [ flag, setFlag ] = useState(true);

  const navigate = useNavigate();

  const handleClick = () => {
    setDoctorIdAp(doctor._id);
    setDoctorIdAv(doctor._id);
    navigate(`/calendar/doctor/${doctor._id}`);
  };

  useEffect(() => {
    if (!isAuthenticated || !(user?.role === "PATIENT" || user?.role === "ADMIN") ) return;

    fetch(`http://localhost:8080/users/doctors/${doctor._id}/can_review`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setCanReview(data.canReview))
      .catch(() => setCanReview(false));

      console.log("Doctor", doctor.lastName, "review", canReview);
  }, [doctor._id, isAuthenticated, flag]);

  return (
    <div className="card h-100 w-100">
      <div className="card-body">
        <h5 className="card-title">
          {doctor.firstName} {doctor.lastName}
        </h5>
        <p className="card-text">
          <strong>Specjalizacja:</strong> {doctor.specialization || "brak danych"}
        </p>

        {isAuthenticated && (user?.role === "PATIENT" || user?.role === "ADMIN") && (
          <>
          <button className="btn btn-primary me-2 mb-1" onClick={handleClick}>
            Zobacz kalendarz lekarza
          </button>

          {canReview && (
            <>
            <button
              className="btn btn-outline-success me-2 mb-1"
              onClick={() => setShowRatingForm(true)}
            >
              Wystaw opinię
            </button>


              {showRatingForm && (
                <CommentForm
                  doctorId={doctor._id}
                  token={token}
                  onClose={() => { setShowRatingForm(false)
                    setFlag(p=>!p);
                  }
                  }
                  onSuccess={() => {
                    setShowRatingForm(false);
                  }}
                />
              )}
            </>
          )}

        <button
          className="btn btn-outline-primary me-2 mb-1"
          onClick={() => navigate(`/doctor/${doctor._id}/reviews`)}>
          Zobacz opinie
        </button>
           </>
        )}
      </div>
    </div>
  );
}