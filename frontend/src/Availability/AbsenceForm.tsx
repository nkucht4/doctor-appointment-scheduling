import { useState } from "react";
import CyclicForm from "./CyclicForm";
import SingleDayForm from "./SingleDayForm";
import ModeForm from "./ModeForm";
import { saveAbsence } from "../consultationServices";

export default function AbsenceForm(){
    const [mode, setMode] = useState("cyclic");

    const [dateRange, setDateRange] = useState({ from: "", to: "" });
    const [singleDate, setSingleDate] = useState("");

    const onSubmit = () => {
            const availability = {
                "date_from": singleDate ? singleDate : dateRange["from"],
                "date_to": singleDate ? singleDate : dateRange["to"],
            };
            saveAbsence(availability);
    }

    return (
        <>
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
                Zapisz niedostępność
            </button>
            </div>
        </>
    )
}