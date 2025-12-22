import { useState } from "react";

export default function TimeSlot(props) {
    const [showDetails, setShowDetails] = useState(false);

    const handleClick = () => {
        if (props.reservation){
            setShowDetails(p=>!p);
        }
    }

    let className;
    if (props.hasPassed && props.reservation){
        className="bg-secondary"
    }
    else if (props.isToday && !props.reservation)
        className="today-highlight";
    else if (props.reservation)
        className="bg-info";

    return (
        <td key={props.idx} 
        className={className}
        onClick={handleClick}>
        <div className="h-100 w-100 d-flex">
        <div
            className={`flex-fill d-flex align-items-center justify-content-center flex-column`}
            style={{ cursor: "pointer" }}
        >
        {props.reservation && (
            <small className="text-white fw-bold">
            {props.reservation.title}
            </small>
        )}
        {showDetails &&
        <div className="text-white mt-1" style={{ fontSize: '0.8rem' }}>
            <div><strong>Pacjent:</strong> {props.reservation.patient}</div>
            <div><strong>Miejsce:</strong> {props.reservation.location}</div>
        </div>
        }
        </div>
        </div>
        </td>
  );
}