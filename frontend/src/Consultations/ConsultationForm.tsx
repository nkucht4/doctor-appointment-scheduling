import { useState, useContext, useEffect } from "react";
import { saveAppointment } from "../consultationServices";
import { AppointmentContext } from "../Providers/AppointmentProvider";
import { AvailabilityContext } from "../Providers/AvailabilityProvider";

export default function ConsultationForm(props) {
    const { getAppointmentsForDay } = useContext(AppointmentContext);
    const { getAvailabilityForDay } = useContext(AvailabilityContext);
    const [ appointmentsToday, setAppointmentsToday ] = useState([]);
    const [ available, setAvailable ] = useState([]);

    useEffect(()=>{
        setAppointmentsToday(getAppointmentsForDay(props.selectedSlot.date));
        setAvailable(getAvailabilityForDay(props.selectedSlot.date))
    
    }, []);

    const [form, setForm] = useState({
        date: props.selectedSlot.date,
        time: props.selectedSlot.time,
        duration: "",
        title: "",
        patient: "",
        gender: "",
        age: "",
        notes: "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value/*, files */} = e.target;
        setForm({
            ...form,
            [name]: /*files ? files : */value,
        });
    };

    const timeToMinutes = (timeStr) => {
        const [h, m] = timeStr.split(":").map(Number);
        return h * 60 + m;
    };

    const hasOverlap = () => {
        const newStart = timeToMinutes(form.time);
        const newEnd = newStart + Number(form.duration);

        return appointmentsToday.some(a => {
            const existingStart = timeToMinutes(a.time);
            const existingEnd = existingStart + Number(a.duration);

            return newStart < existingEnd && newEnd > existingStart;
        });
    };

    const isWithinAvailability = () => {
        if (!form.duration || !form.time) return false; 

        const newStart = timeToMinutes(form.time);
        const newEnd = newStart + Number(form.duration);

        return available.some(({ start_hour, end_hour }) => {
            const availableStart = timeToMinutes(start_hour);
            const availableEnd = timeToMinutes(end_hour);
            return newStart >= availableStart && newEnd <= availableEnd;
        });
    };

    const validate = () => {
        const newErrors = {};

        if (!form.duration) newErrors.duration = "Wybierz długość konsultacji";
        if (!form.title) newErrors.title = "Wybierz typ konsultacji";
        if (!form.patient.trim()) newErrors.patient = "Podaj imię i nazwisko";
        if (!form.gender) newErrors.gender = "Wybierz płeć";
        if (!form.age || form.age < 0 || form.age > 120)
            newErrors.age = "Podaj poprawny wiek";

        if (form.duration && hasOverlap()) {
            newErrors.duration = "Termin koliduje z inną konsultacją";}

        if (form.duration && !isWithinAvailability()) {
            newErrors.duration = "Termin jest poza dostępnymi godzinami";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        saveAppointment(form);
        props.onClose();
    };


    return (
        <form className="container mt-4" onSubmit={handleSubmit} noValidate>
            <h4>Formularz konsultacji</h4>

            <div className="mb-3">
                <label className="form-label">Długość konsultacji</label>
                <select
                    className={`form-select ${errors.duration && "is-invalid"}`}
                    name="duration"
                    onChange={handleChange}
                >
                    <option value="">Wybierz</option>
                    <option value="30">30 minut</option>
                    <option value="60">60 minut</option>
                    <option value="90">90 minut</option>
                    <option value="120">120 minut</option>
                </select>
                <div className="invalid-feedback">{errors.duration}</div>
            </div>

            <div className="mb-3">
                <label className="form-label">Typ konsultacji</label>
                <select
                    className={`form-select ${errors.title && "is-invalid"}`}
                    name="title"
                    onChange={handleChange}
                >
                    <option value="">Wybierz</option>
                    <option value="first">Pierwsza wizyta</option>
                    <option value="control">Wizyta kontrolna</option>
                    <option value="recepta">Recepta</option>
                </select>
                <div className="invalid-feedback">{errors.title}</div>
            </div>

            <div className="mb-3">
                <label className="form-label">Imię i nazwisko</label>
                <input
                    type="text"
                    className={`form-control ${errors.patient && "is-invalid"}`}
                    name="patient"
                    onChange={handleChange}
                    required
                />
                <div className="invalid-feedback">{errors.patient}</div>
            </div>

            <div className="mb-3">
                <label className="form-label">Płeć</label>
                <select
                    className={`form-select ${errors.gender && "is-invalid"}`}
                    name="gender"
                    onChange={handleChange}
                >
                    <option value="">Wybierz</option>
                    <option value="female">Kobieta</option>
                    <option value="male">Mężczyzna</option>
                    <option value="other">Inna</option>
                </select>
                <div className="invalid-feedback">{errors.gender}</div>
            </div>

            <div className="mb-3">
                <label className="form-label">Wiek</label>
                <input
                    type="number"
                    className={`form-control ${errors.age && "is-invalid"}`}
                    name="age"
                    onChange={handleChange}
                    required
                />
                <div className="invalid-feedback">{errors.age}</div>
            </div>

            <div className="mb-3">
                <label className="form-label">Informacje do lekarza</label>
                <textarea
                    className={`form-control`}
                    name="notes"
                    rows="4"
                    onChange={handleChange}
                />
            </div>

            {/*<div className="mb-3">
                <label className="form-label">Dokumenty (opcjonalnie)</label>
                <input
                    type="file"
                    className="form-control"
                    name="files"
                    multiple
                    accept=".pdf,.jpg,.png"
                    onChange={handleChange}
                />
            </div>*/}

            <button type="submit" className="btn btn-primary">
                Wyślij
            </button>
        </form>
    );
}
