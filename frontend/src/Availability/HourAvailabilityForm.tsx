export default function HourAvailabilityForm(props) {
  return (
    <div className="mb-3">
      <div className="form-label mb-2">Godziny konsultacji</div>

      {props.timeRanges.map((tr, i) => (
        <div key={i} className="d-flex align-items-center gap-2 mb-2">
          <input
            type="time"
            className="form-control form-control-sm"
            value={tr.from}
            onChange={(e) =>
              props.updateTimeRange(i, "from", e.target.value)
            }
          />

          <span className="px-1">–</span>

          <input
            type="time"
            className="form-control form-control-sm"
            value={tr.to}
            onChange={(e) =>
              props.updateTimeRange(i, "to", e.target.value)
            }
          />
        </div>
      ))}

      <button
        type="button"
        className="btn btn-link btn-sm px-0"
        onClick={props.addTimeRange}
      >
        Dodaj zakres godzin
      </button>
    </div>
  );
}