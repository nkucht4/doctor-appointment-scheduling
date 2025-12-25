import { createContext, useEffect, useState } from "react";

export const AvailabilityContext = createContext();

export default function AvailabilityProvider({ children }){
    const [availability, setvAvailability] = useState([]);

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
    fetch("http://localhost:3000/availability")
        .then(a => a.json())
        .then(a => setAppointments(a));

    }, []);

    const getAppointmentsForWeek = (weekDates) => {
        const weekSet = new Set(weekDates.map(d => formatDate(d)));
        return appointments.filter(a => weekSet.has(a.date));
    };

    const getAppointmentsForDay = (date) => {
        return appointments.filter(a => a.date === date);
    };

    return (
        <AppointmentContext.Provider value={{ appointments, getAppointmentsForWeek, formatDate, getAppointmentsForDay}}>
            {children}
        </AppointmentContext.Provider>
    );
}