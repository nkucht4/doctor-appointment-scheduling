import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthProvider";

export const AppointmentContext = createContext();

function parseJwt(token) {
    if (!token) return null;
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Failed to parse JWT:", e);
      return null;
    }
  }

export default function AppointmentProvider({ children }){
    const [editFlag, setEditFlag] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [appointmentsPatient, setAppointmentsPatient] = useState([]);
    const { token, user } = useContext(AuthContext);
    const [ doctorIdAp, setDoctorIdAp ] = useState(user?.role === "DOCTOR" ? parseJwt(token).token : null);
    const [ patientIdAp, setPatientIdAp ] = useState(null);
    const [ doctorCheck, setDoctorCheck] = useState(true);

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
    fetch(`http://localhost:8080/appointment/doctor/${doctorIdAp}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => setAppointments(data.map(x => ({ ...x, date: formatDate(new Date(x.date)) }))))
      .catch(err => {
        console.log(err);
        setAppointments([]);  
      });


}, [editFlag, token, doctorIdAp, patientIdAp]);


    useEffect(()=>{
        console.log(appointments);
    }, [appointments]);

    useEffect(()=>{
        console.log("Patient appoint", appointmentsPatient);
    }, [appointmentsPatient]);

    const getAppointmentsForWeek = (weekDates) => {
        const weekSet = new Set(weekDates.map(d => formatDate(d)));
        return appointments.filter(a => weekSet.has(a.date));
    };

    const getAppointmentsForDay = (date) => {
        return appointments.filter(a => a.date === date);
    };

    return (
        <AppointmentContext.Provider value={{ appointments, getAppointmentsForWeek, setDoctorCheck, appointmentsPatient, formatDate, getAppointmentsForDay, setEditFlag, setDoctorIdAp, setPatientIdAp, setAppointmentsPatient}}>
            {children}
        </AppointmentContext.Provider>
    );
}