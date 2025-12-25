import { useState } from "react";
import CyclicForm from "./CyclicForm";
import SingleDayForm from "./SingleDayForm";
import HourAvailabilityForm from "./HourAvailabilityForm";
import ModeForm from "./ModeForm";
import {saveAvailability} from "../consultationServices"

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

    const onSubmit = () => {
        const availability = {
            "date_from": singleDate ? singleDate : dateRange["from"],
            "date_to": singleDate ? singleDate : dateRange["to"],
            "times": timeRanges,
            "day_mask": daysMask
        };
        saveAvailability(availability);
    }

    return (
            <div className="card p-4">
                
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

                <div className="mt-4">
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
