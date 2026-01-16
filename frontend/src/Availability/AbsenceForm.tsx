import { useState, useContext } from "react";
import CyclicForm from "./CyclicForm";
import SingleDayForm from "./SingleDayForm";
import ModeForm from "./ModeForm";
import { saveAbsence } from "../consultationServices";
import { AvailabilityContext } from "../Providers/AvailabilityProvider";
import { AuthContext } from "../Providers/AuthProvider";

export default function AbsenceForm(){
    const [mode, setMode] = useState("cyclic");
    const { setEditFlag } = useContext(AvailabilityContext);
    const [dateRange, setDateRange] = useState({ from: "", to: "" });
    const [singleDate, setSingleDate] = useState("");
    const { token } = useContext(AuthContext);

    const onSubmit = async () => {
            const availability = {
                "doctor_id": "6952741d9101f21909714fc3",
                "date_from": singleDate ? singleDate : dateRange["from"],
                "date_to": singleDate ? singleDate : dateRange["to"],
            };
            
            try {
                const response = await fetch("http://localhost:8080/absence", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(availability)
            });

             if (!response.ok) {
                const text = await response.text();
                throw new Error(text);
            }

            }
            catch (error) {
                console.error("Error:", error.message);
            }

            setEditFlag(p=>!p);
    }

    return (
        <div>
            <h5 class="card-title">Dodaj dni nieobecnośći</h5>
            <ModeForm setMode={setMode} mode={mode}/>

            {mode === "cyclic" && (
            <CyclicForm
                dateRange={dateRange}
                setDateRange={setDateRange}
            />
            )}

            {mode === "single" && (
            <SingleDayForm
                singleDate={singleDate}
                setSingleDate={setSingleDate}
            />
            )}

            <div className="mt-4">
            <button
                type="button"
                className="btn btn-dark px-4"
                onClick={onSubmit}
            >
                Dodaj nieobecność
            </button>
            </div>
        </div>
    )
}