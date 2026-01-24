import WeeklyCalendar from "../Calendar/WeeklyCalendar";
import AvailabilityForm from "../Availability/AvailabilityForm";
import AbsenceForm from "../Availability/AbsenceForm";
import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AvailabilityContext } from "../Providers/AvailabilityProvider";
import { useAuth } from "../Providers/AuthProvider";
import { AppointmentContext } from "../Providers/AppointmentProvider";

export default function CalendarView(){
    const { doctorId } = useParams();
    const [showPanel, setShowPanel] = useState(false);
    const { setDoctorIdAv } = useContext(AvailabilityContext)
    const { setDoctorIdAp } = useContext(AppointmentContext)
    const { user } = useAuth();
    const role = user?.role || 'GUEST';

    useEffect(()=>{
        setDoctorIdAv(doctorId);
        setDoctorIdAp(doctorId);
    }, [doctorId]);

    return (
        <div className="container-fluid">

            <div className="d-flex justify-content-end mb-2 p-2">
                { user?.role === "DOCTOR" &&
                <button
                    className="btn btn-link p-0 text-secondary text-decoration-none"
                    onClick={() => setShowPanel(v => !v)}
                >
                    {showPanel ? "Ukryj edycję kalendarza" : "Edytyj kalendarz"}
                </button>
                }
            </div>

            <div className="row g-3">
                <div className={`col-12 ${showPanel ? "col-lg-9" : "col-lg-12"}`}>
                    <WeeklyCalendar initialDate={new Date()} />
                </div>

                {user?.role === "DOCTOR" && showPanel && (
                    <div className="col-12 col-lg-3">
                        <div className="card p-4 gap-3">
                            <AvailabilityForm />
                            <AbsenceForm />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}