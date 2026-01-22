import DoctorElement from "./DoctorElement";
import { useState, useEffect } from "react";

export default function DoctorList(){
    const [ doctors, setDoctors ] = useState([]);

    useEffect(()=>{
        fetch("http://localhost:8080/users/doctors")
        .then(a => a.json())
        .then(a=>setDoctors(a))
    }, [])

    return (
        <div className="p-4">
        {doctors.map((a)=>
            <DoctorElement doctor={a}/>)}
        </div>
    )

}