import { useContext, useState } from "react";
import { AuthContext } from "../Providers/AuthProvider";

export default function CommentForm(props) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useContext(AuthContext);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:8080/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctor_id: props.doctorId,
          rating,
          comment,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit rating");
      }

      props.onSuccess && props.onSuccess();
      props.onClose();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Wystaw opinię</h5>
            <button type="button" className="btn-close" onClick={props.onClose} />
          </div>

          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Ocena (1-5)</label>
                <select
                  className="form-select"
                  value={rating}
                  onChange={e => setRating(Number(e.target.value))}
                  disabled={loading}
                  required
                >
                  {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Komentarz (opcjonalny)</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  disabled={loading}
                  placeholder="Napisz opinię..."
                />
              </div>

              {error && <div className="alert alert-danger">{error}</div>}

              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={props.onClose} disabled={loading}>
                  Anuluj
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Wysyłanie..." : "Wyślij"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
