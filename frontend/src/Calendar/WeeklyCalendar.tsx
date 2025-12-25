import { useState, useEffect, useContext } from "react";
import CalendarBody from "./CalendarBody";
import CalendarControls from "./CalendarControls";
import CalendarHeader from "./CalendarHeader";
import { AppointmentContext } from "../Providers/AppointmentProvider";


export default function WeeklyCalendar(props) {
    const { appointments, getAppointmentsForWeek, formatDate } = useContext(AppointmentContext);
    const getStartOfWeek = (date) => {
        const d = new Date(date);
        const day = d.getDay() || 7;
        d.setDate(d.getDate() - day + 1);
        d.setHours(0, 0, 0, 0);
        return d;
    }

    const [currentWeek, setCurrentWeek] = useState(getStartOfWeek(props.initialDate));

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

    return (
        <div className="container-fluid">
            <CalendarControls
                goPrevWeek={goPrevWeek}
                goNextWeek={goNextWeek}
                weekDates={weekDates}/>

            <div className="table-responsive">
                <table className="table table-bordered text-center align-middle">
                    <CalendarHeader
                    weekDates={weekDates}/>

                    <CalendarBody
                    weekDates={weekDates}
                    appointments={getAppointmentsForWeek(weekDates)}
                    />
                </table>
            </div>
        </div>
        );
}