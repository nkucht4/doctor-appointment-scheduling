import TimeSlot from "./TimeSlot";
import { useState, useEffect, useContext } from "react";
import ConsultationForm from "../Consultations/ConsultationForm";
import { AppointmentContext } from "../Providers/AppointmentProvider";
import { AvailabilityContext } from "../Providers/AvailabilityProvider";

export default function CalendarBody(props){
    const [ startHour, setStartHour ] = useState(10);
    const [ endHour, setEndHour ] = useState(16);
    const [ availabilityDays, setAvailabilityDays ] = useState([]);
    const [ absenceDays, setAbsenceDays ] = useState([]);
    const [ showNewAppointment, setShowNewAppointment] = useState(false);
    const [ selectedSlot, setSelectedSlot ] = useState({ time: "", date: ""});
    const { absence, availability } = useContext(AvailabilityContext);

    const timeToMinutes = (timeStr) => {
        const [h, m] = timeStr.split(":").map(Number);
        return h * 60 + m;
    };

    const minutesToHour = (minutes) => minutes / 60;

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    useEffect(()=>{
        const weekDateStrings = props.weekDates.map(formatDate);

       
        const filtered_absence = absence.filter(({ date_from, date_to }) => {
        return weekDateStrings.some(
            (d) => d >= date_from && d <= date_to
        );
        });

        setAbsenceDays(filtered_absence);

        const filtered = availability.filter(({ date_from, date_to }) => {
        return weekDateStrings.some(
            (d) => d >= date_from && d <= date_to
        );
        });

        setAvailabilityDays(filtered);
        
        if (filtered.length === 0) {
          setStartHour(10);
          setEndHour(16);
          return;
        }

        let earliest = 24 * 60; 
        let latest = 0;
        filtered.forEach(({ times }) => {
            times.forEach(({ from, to }) => {
                const fromMins = timeToMinutes(from);
                const toMins = timeToMinutes(to);
                if (fromMins < earliest) earliest = fromMins;
                if (toMins > latest) latest = toMins;
            });
            });

            setStartHour(Math.floor(earliest / 60));
            setEndHour(Math.ceil(latest / 60));
        
    }, [props.weekDates, availability, absence]);

    const generateTimeSlots = (intervalMinutes = 30) => {
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
    const todayStr = formatDate(new Date());
    const now = new Date();

    const getDateTime = (date, timeStr) => {
        const [hours, minutes] = timeStr.split(":").map(Number);
        const dt = new Date(date);
        dt.setHours(hours, minutes, 0, 0);
        return dt;
    }

    const findAppointmentStartForSlot = (date, time) => {
        const day = formatDate(date);
        return props.appointments.find(
            a => a.date === day && a.time === time
        );
    };

    const isCurrentTimeSlot = (timeStr, intervalMinutes = 30) => {
        const [hour, minute] = timeStr.split(":").map(Number);

        const slotStart = new Date(now);
        slotStart.setHours(hour, minute, 0, 0);

        const slotEnd = new Date(slotStart);
        slotEnd.setMinutes(slotEnd.getMinutes() + intervalMinutes);

        return now >= slotStart && now < slotEnd;
    }

    const isTimeInRanges = (timeStr, times) => {
    if (!times || times.length === 0) return false;
        const timeMins = timeToMinutes(timeStr);
        return times.some(({ from, to }) => {
            const fromMins = timeToMinutes(from);
            const toMins = timeToMinutes(to);
            return timeMins >= fromMins && timeMins < toMins;
        });
    };

    const isSlotCoveredByAppointment = (dateStr, timeStr, appointments) => {
    const timeMins = timeToMinutes(timeStr);

    return appointments.some(appt => {
        if (appt.date !== dateStr) return false;

        const apptStart = timeToMinutes(appt.time);
        const apptEnd = apptStart + Number(appt.duration);

        return timeMins > apptStart && timeMins < apptEnd;
    });
    };

    return (
        <>
        <tbody>
            {timeSlots.map((time) => (
            <tr key={time} style={{ height: "60px" }}>
            <th className={isCurrentTimeSlot(time) ? "bg-dark text-light fw-bold" : "table-light"}>{time}</th>
            {props.weekDates.map((date, idx) => {
                const slotDateTime = getDateTime(date, time);
                const hasPassed = slotDateTime < now;
                const dayStr = formatDate(date);

                const appointmentStart = findAppointmentStartForSlot(date, time);
                const isCovered = isSlotCoveredByAppointment(dayStr, time, props.appointments);

                if (!appointmentStart && isCovered) {
                return null;
                }

                const rowSpan = appointmentStart ? appointmentStart.duration / 30 : 1;
                
                const dayAvailability = availability.find(({ date_from, date_to, day_mask }) => {
                    if (!(dayStr >= date_from && dayStr <= date_to)) return false;
                    if (!day_mask || day_mask.length === 0) return true;
                    const dayIndex = new Date(date).getDay();
                    return day_mask.includes(dayIndex);
                });

                const availableTimes = dayAvailability ? dayAvailability.times : [];
                const isAvailable = isTimeInRanges(time, availableTimes);

                const isAbsent = absenceDays.find(({ date_from, date_to}) => {
                    if ((dayStr >= date_from && dayStr <= date_to)) return true;
                    else return false;
                })
                return (
                    <TimeSlot
                    idx={idx}
                    key={idx}
                    date={formatDate(date)}
                    time={time}
                    reservation={findAppointmentStartForSlot(date, time)}
                    isToday={todayStr === formatDate(date)}
                    hasPassed={hasPassed}
                    isAvailable={isAvailable}
                    isAbsent={isAbsent}
                    rowSpan={rowSpan}
                    handleChange={(x)=>{setSelectedSlot(x);
                        setShowNewAppointment(true);
                    }}
                    />
                );
                })}
            </tr>
            ))}
        </tbody>
        
        {showNewAppointment && 
        (
            <>
            <div
            className="modal-backdrop fade show"
            onClick={() => setShowNewAppointment(false)}
            />

            <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Nowa konsultacja</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setShowNewAppointment(false)}
                        />
                    </div>

                    <div className="modal-body">
                        <ConsultationForm
                            selectedSlot={selectedSlot}
                            onClose={() => setShowNewAppointment(false)}
                        />
                    </div>
                </div>
            </div>
        </div>
        </>
        )
        }
        </>
    );
}