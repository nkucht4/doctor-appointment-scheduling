import { useState, useContext } from "react";
import { AppointmentContext } from "../Providers/AppointmentProvider";
import { AuthContext } from "../Providers/AuthProvider";

export default function TimeSlot(props) {
    const [showDetails, setShowDetails] = useState(false);
    const { setEditFlag } = useContext(AppointmentContext);
    const { token } = useContext(AuthContext);
    const { user } = useContext(AuthContext);

    const isDoctor = user?.role === "DOCTOR";
    const isPatient = user?.role === "PATIENT";

    const isOwner = (isDoctor && String(props.reservation?.doctor_id) === String(user.id)) || 
                (isPatient && String(props.reservation?.patient_id) === String(user.id));

    const isEmptyClickable =
        !props.reservation &&
        !props.isAbsent &&
        props.isAvailable &&
        !props.hasPassed;

    const handleClick = () => {
        if (props.reservation){
            setShowDetails(p=>!p);
        }
        else if (isEmptyClickable){
            props.handleChange({time : props.time, date : props.date});
        }
    }

    const TYPE_LABELS = {
    first: "Pierwsza wizyta",
    control: "Wizyta kontrolna",
    recepta: "Recepta"
    }

    const COLORS = {
        first: "bg-info",
        control: "bg-primary",
        recepta: "bg-danger"
    }

    const name = isOwner && props.reservation ? TYPE_LABELS[props.reservation.title] || "" : "";

    let className;
    if (props.isAbsent && props.isToday){
        className="absent-today";
    }
    else if (props.isAbsent && !props.isToday){
        className="absent-highlight";
    }
    else if (!props.isAvailable && !props.isToday){
        className="not-available-highlight";
    }
    else if (!props.isAvailable && props.isToday){
        className="not-available-today-highlight";
    }
    else if (props.hasPassed && props.reservation){
        className="bg-secondary"
    }
    else if (props.isToday && !props.reservation)
        className="today-highlight";
    else if (props.reservation && isOwner && COLORS[props.reservation.title]) {
    className = COLORS[props.reservation.title];
    } else if (props.reservstion){
    className = "bg-secondary"; 
    }

    const handleCancel = async () => {
        if (!props.reservation?._id) return;

        try {
        const response = await fetch(
        `http://localhost:8080/appointment/${props.reservation._id}`,
        { method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            }
         }
        );

        if (!response.ok) {
        throw new Error("Failed to cancel appointment");
        }

        setEditFlag(p=>!p);
        
        } catch (error) {
            console.error("Cancel error:", error.message);
        }
    };

    const handleDownload = async () => {
        if (!props.reservation?._id) return;

        try {
            const response = await fetch(`http://localhost:8080/appointment/${props.reservation._id}/file`, 
                {headers: {
                    Authorization: `Bearer ${token}`,
                }}
            );

            if (!response.ok) {
            throw new Error('Failed to download file');
            }

            const blob = await response.blob();

            const contentType = response.headers.get('Content-Type') || 'application/octet-stream';
            let extension = '';
            if (contentType.includes('pdf')) extension = '.pdf';
            else if (contentType.includes('jpeg') || contentType.includes('jpg')) extension = '.jpg';
            else if (contentType.includes('png')) extension = '.png';

            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;

            a.download = `file${extension}`;

            document.body.appendChild(a);
            a.click();
            a.remove();

            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Download error:', error.message);
        }
        };


    return (
        <td key={props.idx} 
        className={className}
        onClick={handleClick}
        rowSpan={props.rowSpan || 1} 
        style={(isEmptyClickable || (props.reservation && isDoctor)) ? { cursor: "pointer" } : {}}
        >
        <div className="h-100 w-100 d-flex">
        <div
            className={`flex-fill d-flex align-items-center justify-content-center flex-column`}
        >
        {props.reservation  && isOwner && (
            <small className="text-white fw-bold">
            {name}
            </small>
        )}

        {props.reservation && !isOwner && (
        <small className="text-muted fst-italic">
            Termin zajęty
        </small>
        )}
        {showDetails && isOwner && (
        <div className="text-white mt-1" style={{ fontSize: '0.8rem' }}>
            <div><strong>Pacjent:</strong> {props.reservation.patient}</div>
            <div><strong>Wiek pacjenta:</strong> {props.reservation.age}</div>
            <div><strong>Notatki:</strong> {props.reservation.notes}</div>

            { props.reservation.file && <>
            <button
            type="button"
            className="btn btn-link p-0 text-light"
            onClick={handleDownload}
            >Pobierz plik</button> <br/> </>}

            <button
            type="button"
            className="btn btn-link p-0 text-light"
            onClick={handleCancel}
            >Odwołaj wizytę</button>
        </div>)
        }
        </div>
        </div>
        </td>
  );
}