import { useContext } from "react";
import { AppointmentContext } from "../Providers/AppointmentProvider";

function DayHeader(props) {
    const className = props.isToday ? "bg-dark text-white" : "";

    return (
        <th className={className}>
            <div className="fw-bold">{props.label}</div>
            <div>{props.date.toLocaleDateString()}</div>
            <div className="fw-normal"><small>Konsultacje: {props.appointments}</small></div>
        </th>
    );
}

export default function CalendarHeader(props){
    const { getAppointmentsForDay, formatDate } = useContext(AppointmentContext);
    const days = ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Nd"];
    const todayStr = formatDate(new Date());

    return (
        <thead className="table-light">
            <tr>
                <th style={{ width: "80px" }}></th>
                {props.weekDates.map((date, idx) => {
                const dateStr = formatDate(date);
                return (
                    <DayHeader
                    key={idx}
                    date={date}
                    label={days[idx]}
                    isToday={dateStr === todayStr}
                    appointments={getAppointmentsForDay(dateStr).length}
                    />
                );
                })}
            </tr>
        </thead>
    )
}