import TimeSlot from "./TimeSlot";

export default function CalendarBody(props){
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }
    const todayStr = formatDate(new Date());
    const now = new Date();

    const getDateTime = (date, timeStr) => {
        const [hours, minutes] = timeStr.split(":").map(Number);
        const dt = new Date(date);
        dt.setHours(hours, minutes, 0, 0);
        return dt;
    }

    const findAppointmentForSlot = (date, time) =>{
        const day = formatDate(date);
        return props.appointments.find(
            a => a.date === day && a.time === time
        );
    }

    const isCurrentTimeSlot = (timeStr, intervalMinutes = 30) => {
        const [hour, minute] = timeStr.split(":").map(Number);

        const slotStart = new Date(now);
        slotStart.setHours(hour, minute, 0, 0);

        const slotEnd = new Date(slotStart);
        slotEnd.setMinutes(slotEnd.getMinutes() + intervalMinutes);

        return now >= slotStart && now < slotEnd;
    }

    return (
        <tbody>
            {props.timeSlots.map((time) => (
            <tr key={time} style={{ height: "60px" }}>
            <th className={isCurrentTimeSlot(time) ? "bg-dark text-light fw-bold" : "table-light"}>{time}</th>
            {props.weekDates.map((date, idx) => {
                const slotDateTime = getDateTime(date, time);
                const hasPassed = slotDateTime < now;
                return (
                    <TimeSlot
                    idx={idx}
                    key={idx}
                    date={date}
                    time={time}
                    reservation={findAppointmentForSlot(date, time)}
                    isToday={todayStr === formatDate(date)}
                    hasPassed={hasPassed}
                    />
                );
                })}
            </tr>
            ))}
        </tbody>
    );
}