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
    <div className="container py-4">
        <div className="d-flex flex-wrap gap-3 justify-content-center">
        {Array.isArray(doctors) && doctors.length > 0 ? (
            doctors.map((doctor, idx) => (
            <div
                key={doctor._id || idx}
                style={{ flex: "0 0 30%", minWidth: "250px" }}
            >
                <DoctorElement doctor={doctor} />
            </div>
            ))
        ) : (
            <p className="text-center">Brak dostępnych doktorów.</p>
        )}
        </div>
    </div>
    )
}