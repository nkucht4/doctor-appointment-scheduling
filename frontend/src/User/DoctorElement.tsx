export default function DoctorElement({ doctor }) {
  return (
    <div className="card h-100 shadow-sm mb-3">
      <div className="card-body">
        <h5 className="card-title">
          {doctor.firstName} {doctor.lastName}
        </h5>
        <p className="card-text">
          <strong>Specjalizacja:</strong> {doctor.specialization || "brak danych"}
        </p>
      </div>
    </div>
  );
}