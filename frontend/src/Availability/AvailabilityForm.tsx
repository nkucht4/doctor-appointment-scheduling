import { useState, useContext } from "react";
import CyclicForm from "./CyclicForm";
import SingleDayForm from "./SingleDayForm";
import HourAvailabilityForm from "./HourAvailabilityForm";
import ModeForm from "./ModeForm";
import {saveAvailability} from "../consultationServices"
import { AvailabilityContext } from "../Providers/AvailabilityProvider";

const DAYS = [
{ key: 1, label: "Pon" },
{ key: 2, label: "Wt" },
{ key: 3, label: "Śr" },
{ key: 4, label: "Czw" },
{ key: 5, label: "Pt" },
{ key: 6, label: "Sob" },
{ key: 0, label: "Nd" },
];

export default function AvailabilityForm(props){
    const { setEditFlag } = useContext(AvailabilityContext);
    const [mode, setMode] = useState("cyclic");

    const [dateRange, setDateRange] = useState({ from: "", to: "" });
    const [singleDate, setSingleDate] = useState("");
    const [daysMask, setDaysMask] = useState([]);
    const [timeRanges, setTimeRanges] = useState([
    { from: "10:00", to: "16:00" },
    ]);

    const toggleDay = (day) => {
        setDaysMask((prev) =>
        prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    }

    const updateTimeRange = (index, field, value) => {
        const copy = [...timeRanges];
        copy[index][field] = value;
        setTimeRanges(copy);
    }

    const addTimeRange = () => {
        setTimeRanges([...timeRanges, { from: "", to: "" }]);
    }

    const onSubmit = async () => {
        const availability = {
            "doctor_id": "6952741d9101f21909714fc3",
            "date_from": singleDate ? singleDate : dateRange["from"],
            "date_to": singleDate ? singleDate : dateRange["to"],
            "times": timeRanges,
            "day_mask": daysMask
        };
        try {
            const response = await fetch("http://localhost:8080/availability", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(availability)
        })}
        catch (error) {
            console.error("Error:", error.message);
        }
        setEditFlag(p=>!p);
    }

    return (
            <div className="d-flex gap-1 flex-column">
                <h5 class="card-title">Dodaj godziny dostępnosci</h5>
                <ModeForm 
                mode={mode}
                setMode={setMode}/>

                {mode === "cyclic" && (
                <CyclicForm
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                    DAYS={DAYS}
                    daysMask={daysMask}
                    toggleDay={toggleDay}
                />
                )}

                {mode === "single" && (
                <SingleDayForm
                    singleDate={singleDate}
                    setSingleDate={setSingleDate}
                />
                )}

                <HourAvailabilityForm
                timeRanges={timeRanges}
                updateTimeRange={updateTimeRange}
                addTimeRange={addTimeRange}
                />

                <div >
                <button
                    type="button"
                    className="btn btn-dark px-4"
                    onClick={onSubmit}
                >
                    Zapisz dostępność
                </button>
                </div>
            </div>
        );
}
