import { useState, useEffect } from "react";
import CalendarBody from "./CalendarBody";
import CalendarControls from "./CalendarControls";
import CalendarHeader from "./CalendarHeader";

const days = ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Nd"];

function generateTimeSlots(startHour = 10, endHour = 16, intervalMinutes = 30) {
    const slots = [];
    let current = startHour * 60;
    const end = endHour * 60;


    while (current < end) {
        const h = Math.floor(current / 60)
        .toString()
        .padStart(2, "0");
        const m = (current % 60).toString().padStart(2, "0");
        slots.push(`${h}:${m}`);
        current += intervalMinutes;
    }
    return slots;
}

const timeSlots = generateTimeSlots();

function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay() || 7;
    d.setDate(d.getDate() - day + 1);
    d.setHours(0, 0, 0, 0);
    return d;
}

export default function WeeklyCalendar(props) {
    const [currentWeek, setCurrentWeek] = useState(getStartOfWeek(props.initialDate));
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
    fetch("/appointments.json")
        .then(a => a.json())
        .then(setAppointments);
    }, []);

    useEffect(()=>{
        console.log(appointments);
    }, [appointments]);

    const weekDates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(currentWeek);
        d.setDate(currentWeek.getDate() + i);
        return d;
    });

    const goPrevWeek = () => {
        const d = new Date(currentWeek);
        d.setDate(d.getDate() - 7);
        setCurrentWeek(d);
    };

    const goNextWeek = () => {
        const d = new Date(currentWeek);
        d.setDate(d.getDate() + 7);
        setCurrentWeek(d);
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const getAppointmentsForWeek = () => {
        const weekSet = new Set(weekDates.map(d => formatDate(d)));
        return appointments.filter(a => weekSet.has(a.date));
    };

    return (
        <div className="container-fluid">
            <CalendarControls
                goPrevWeek={goPrevWeek}
                goNextWeek={goNextWeek}
                weekDates={weekDates}/>

            <div className="table-responsive">
                <table className="table table-bordered text-center align-middle">
                    <CalendarHeader
                    weekDates={weekDates}
                    days={days}/>

                    <CalendarBody
                    timeSlots={timeSlots}
                    weekDates={weekDates}
                    appointments={getAppointmentsForWeek()}
                    />
                </table>
            </div>
        </div>
        );
}