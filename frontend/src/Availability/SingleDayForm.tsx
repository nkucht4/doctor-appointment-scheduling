export default function SingleDayForm(props) {
  return (
    <div className="mb-3">
      <label className="form-label">Data konsultacji</label>
      <input
        type="date"
        className="form-control"
        value={props.singleDate}
        onChange={(e) => props.setSingleDate(e.target.value)}
      />
    </div>
  );
}