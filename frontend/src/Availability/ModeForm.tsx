export default function ModeForm(props){
    return (
        <div className="d-flex gap-4 mb-4">
                <div className="form-check">
                    <input
                    className="form-check-input"
                    type="radio"
                    checked={props.mode === "cyclic"}
                    onChange={() => props.setMode("cyclic")}
                    id="mode-cyclic"
                    />
                    <label className="form-check-label" htmlFor="mode-cyclic">
                    Cykliczna
                    </label>
                </div>

                <div className="form-check">
                    <input
                    className="form-check-input"
                    type="radio"
                    checked={props.mode === "single"}
                    onChange={() => props.setMode("single")}
                    id="mode-single"
                    />
                    <label className="form-check-label" htmlFor="mode-single">
                    Jednorazowa
                    </label>
                </div>
                </div>
    );
}