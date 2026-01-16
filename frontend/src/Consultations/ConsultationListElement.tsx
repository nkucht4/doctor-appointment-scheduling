import { useState, useContext } from "react";
import { AppointmentContext } from "../Providers/AppointmentProvider";
import { AuthContext } from "../Providers/AuthProvider";

export default function ConsultationListElement(props){
    const { setEditFlag } = useContext(AppointmentContext);
    const { token } = useContext(AuthContext);

    const TYPE_LABELS = {
    first: "Pierwsza wizyta",
    control: "Wizyta kontrolna",
    recepta: "Recepta"
    }

    const name = props.reservation
    ? TYPE_LABELS[props.reservation.title] : ""

    const reservation = props.reservation;

    if (!reservation) return null;

    const handlePayment = async () => {
        const res = await fetch(`http://localhost:8080/appointment/${reservation._id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({...reservation, paid: true}),
            }
        );

        if (!res.ok) {
            throw new Error("Failed to update payment status");
        }

        setEditFlag(p=>!p);
    };

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

                { !reservation.paid && ( <>
                <div className="d-flex justify-content-end gap-2">
                <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={handlePayment}
                >
                    Zapłać
                </button>
                </div>
                </>)}
            </div>
            </div>
    )
}