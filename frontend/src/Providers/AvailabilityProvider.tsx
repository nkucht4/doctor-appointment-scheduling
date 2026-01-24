import { createContext, useEffect, useState, useContext } from "react";
import { AuthContext } from "./AuthProvider";

export const AvailabilityContext = createContext();

export default function AvailabilityProvider({ children }){
    const [editFlag, setEditFlag] = useState(false);
    const [editFlag2, setEditFlag2] = useState(false);
    const [availability, setvAvailability] = useState([]);
    const [ absence, setAbsence ] = useState([]);
    const { token, user } = useContext(AuthContext);
    const [ doctorIdAv, setDoctorIdAv ] = useState(user?.role === "DOCTOR" ? parseJwt(token).token : null);
    const [ checkDoc2, setCheckDoc2 ] = useState(false);

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

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

    useEffect(()=>{
        console.log("A", doctorIdAv)
    }, [doctorIdAv])

    useEffect(() => {
    fetch(`http://localhost:8080/availability/doctor/${doctorIdAv}`,
        { headers: {
            Authorization: `Bearer ${token}`
        }}
    )
        .then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  })
        .then(a => setvAvailability(a.map(x=>{return{...x, date_from: formatDate(new Date(x.date_from)),
            date_to: formatDate(new Date(x.date_to))
        }}))).catch(err => {
      console.log(err);
      setvAvailability([]);
    });

    fetch(`http://localhost:8080/absence/doctor/${doctorIdAv}`, { headers: {Authorization: `Bearer ${token}`}})
        .then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  })
        .then(a => setAbsence(a.map(x=>{return{...x, date_from: formatDate(new Date(x.date_from)),
            date_to: formatDate(new Date(x.date_to))
        }}))).catch(err => {
      console.log(err);
      setAbsence([]);
    });

    }, [editFlag, editFlag2, token, doctorIdAv]);

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
        <AvailabilityContext.Provider value={{ availability, getAvailabilityForWeek, setCheckDoc2, getAvailabilityForDay, setEditFlag, setDoctorIdAv, setEditFlag2, doctorIdAv, absence}}>
            {children}
        </AvailabilityContext.Provider>
    );
}