import { createContext, useEffect, useState } from "react";

export const AvailabilityContext = createContext();

export default function AvailabilityProvider({ children }){
    const [editFlag, setEditFlag] = useState(false);
    const [availability, setvAvailability] = useState([]);
    const [ absence, setAbsence ] = useState([]);

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
    fetch("http://localhost:3000/availability")
        .then(a => a.json())
        .then(a => setvAvailability(a));

    fetch("http://localhost:3000/absences")
        .then((res)=>res.json())
        .then(a => setAbsence(a));

    }, [editFlag]);

    const getAvailabilityForWeek = (weekDates) => {
         availability.filter(({ date_from, date_to }) => {
            return weekDateStrings.some(
                (d) => d >= date_from && d <= date_to
            );})
    };

    const normalizeDate = (date) =>
    date instanceof Date ? formatDate(date) : date;

    const getAvailabilityForDay = (date) => {
        const dayStr = normalizeDate(date);
        const dayIndex =
            date instanceof Date
                ? date.getDay()
                : new Date(dayStr).getDay();

        return availability
            .filter(({ date_from, date_to, day_mask }) => {
                if (dayStr < date_from || dayStr > date_to) return false;
                if (!day_mask || day_mask.length === 0) return true;
                return day_mask.includes(dayIndex);
            })
            .flatMap(({ times }) =>
                times.map(t => ({
                    start_hour: t.from,
                    end_hour: t.to
                }))
            );
        };

    return (
        <AvailabilityContext.Provider value={{ availability, getAvailabilityForWeek, getAvailabilityForDay, setEditFlag, absence}}>
            {children}
        </AvailabilityContext.Provider>
    );
}