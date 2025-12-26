import { useState } from "react";

export default function ConsultationListElement(props){
    const [ paid, setPaid ] = useState(false);

    const TYPE_LABELS = {
    first: "Pierwsza wizyta",
    control: "Wizyta kontrolna",
    recepta: "Recepta"
    }

    const name = props.reservation
    ? TYPE_LABELS[props.reservation.title] : ""

    const reservation = props.reservation;

    if (!reservation) return null;

    return (
        <div className="card mb-3 shadow-sm">
            <div className="card-body">
                <h5 className="card-title">{name}</h5>
                <p className="card-text mb-1">
                <strong>Pacjent:</strong> {reservation.patient}
                </p>
                <p className="card-text mb-1">
                <strong>Wiek pacjenta:</strong> {reservation.age}
                </p>
                {reservation.notes && (
                <p className="card-text mb-3">
                    <strong>Notatki:</strong> {reservation.notes}
                </p>
                )}

                { !paid && ( <>
                <div className="d-flex justify-content-end gap-2">
                <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => {alert("Zapłacono");
                        setPaid(true);
                    }
                    }
                >
                    Zapłać
                </button>
                </div>
                </>)}
            </div>
            </div>
    )
}