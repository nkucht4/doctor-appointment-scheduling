import { useContext } from "react";
import { AppointmentContext } from "../Providers/AppointmentProvider";
import ConsultationListElement from "./ConsultationListElement";

export default function ConsultationList(){
    const { appointments } = useContext(AppointmentContext);

    return (
        <div className="p-4">
        {appointments.map((a)=>
            <ConsultationListElement reservation={a}/>)}
        </div>
    )

}