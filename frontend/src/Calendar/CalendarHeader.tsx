function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function DayHeader(props) {
    const className = props.isToday ? "bg-dark text-white" : "";

    return (
        <th className={className}>
            <div className="fw-bold">{props.label}</div>
            <div>{props.date.toLocaleDateString()}</div>
        </th>
    );
}

export default function CalendarHeader(props){
    const days = ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Nd"];
    const todayStr = formatDate(new Date());

    return (
        <thead className="table-light">
            <tr>
                <th style={{ width: "80px" }}></th>
                {props.weekDates.map((date, idx) => {
                const dateStr = formatDate(date);
                return (
                    <DayHeader
                    key={idx}
                    date={date}
                    label={days[idx]}
                    isToday={dateStr === todayStr}
                    />
                );
                })}
            </tr>
        </thead>
    )
}