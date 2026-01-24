import { AppointmentContext } from "../Providers/AppointmentProvider";
import { AuthContext } from "../Providers/AuthProvider";
import ConsultationListElement from "./ConsultationListElement";
import { useState, useEffect, useContext } from "react";

export default function ConsultationList(){
    const [ appointments, setAppointments ] = useState([])
    const { token } = useContext(AuthContext);
    const { parseJwt } = useContext(AppointmentContext);
    const [ flag, setFlag ] = useState(true);
    
    useEffect(()=>{
        const patientId = parseJwt(token).id;
        fetch(`http://localhost:8080/appointment/patient/${patientId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        }).then(r=>r.json())
        .then(r=>setAppointments(r));
    }, [flag]);


    return (
        <div className="p-4">
        {appointments.map((a)=>
            <ConsultationListElement onPay={()=>{setFlag(p=>!p)}} reservation={a}/>)}
        </div>
    )

}