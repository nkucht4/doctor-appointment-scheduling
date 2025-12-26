import { useState } from "react";

export default function TimeSlot(props) {
    const [showDetails, setShowDetails] = useState(false);

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

    const name = props.reservation
    ? TYPE_LABELS[props.reservation.title] : ""

    let className;
    if (props.isAbsent){
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
    else if (props.reservation)
        className=COLORS[props.reservation.title]

    const handleCancel = () => {
        //setShowDetails(false);
    }

    return (
        <td key={props.idx} 
        className={className}
        onClick={handleClick}
        rowSpan={props.rowSpan || 1} 
        style={(isEmptyClickable || props.reservation) ? { cursor: "pointer" } : {}}
        >
        <div className="h-100 w-100 d-flex">
        <div
            className={`flex-fill d-flex align-items-center justify-content-center flex-column`}
        >
        {props.reservation && (
            <small className="text-white fw-bold">
            {name}
            </small>
        )}
        {showDetails &&
        <div className="text-white mt-1" style={{ fontSize: '0.8rem' }}>
            <div><strong>Pacjent:</strong> {props.reservation.patient}</div>
            <div><strong>Wiek pacjenta:</strong> {props.reservation.age}</div>
            <div><strong>Notatki:</strong> {props.reservation.notes}</div>

            <button
            type="button"
            className="btn btn-link p-0"
            onClick={handleCancel}
            >Odwołaj wizytę</button>
        </div>
        }
        </div>
        </div>
        </td>
  );
}