export default function CalendarControls(props){
    return (
        <div className="d-flex justify-content-between align-items-center mb-3">
            <button className="btn btn-outline-primary" onClick={props.goPrevWeek}>
                Previous Week
            </button>
            <div className="fw-bold">
                {props.weekDates[0].toLocaleDateString()} - {props.weekDates[6].toLocaleDateString()}
            </div>
            <button className="btn btn-outline-primary" onClick={props.goNextWeek}>
                Next week
            </button>
        </div>
    )
}