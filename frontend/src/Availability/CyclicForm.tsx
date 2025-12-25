export default function CyclicForm(props) {
  return (
    <>
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <label className="form-label">Od</label>
          <input
            type="date"
            className="form-control"
            value={props.dateRange.from}
            onChange={(e) =>
              props.setDateRange({
                ...props.dateRange,
                from: e.target.value,
              })
            }
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Do</label>
          <input
            type="date"
            className="form-control"
            value={props.dateRange.to}
            onChange={(e) =>
              props.setDateRange({
                ...props.dateRange,
                to: e.target.value,
              })
            }
          />
        </div>
      </div>
        
    {props.DAYS && 
      <div className="mb-3">
        <div className="form-label mb-2">Dni konsultacji</div>
        <div className="d-flex flex-wrap gap-2">
          {props.DAYS.map((d) => {
            const active = props.daysMask.includes(d.key);
            return (
              <button
                key={d.key}
                type="button"
                className={`btn btn-sm ${
                  active ? "btn-primary" : "btn-outline-secondary"
                }`}
                onClick={() => props.toggleDay(d.key)}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      </div>}
    </>
  );
}