import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../Providers/AuthProvider";

export default function DoctorCommentsList() {
	const { doctorId } = useParams();
	const [ratings, setRatings] = useState([]);
	const { token, user } = useContext(AuthContext)
	const [ flag, setFlag ] = useState(false)

	useEffect(() => {
		if (!doctorId) return;

		fetch(`http://localhost:8080/ratings/doctor/${doctorId}`,
				{
				headers: { Authorization: `Bearer ${token}` }
				}
		)
			.then(res => res.ok ? res.json() : [])
			.then(data => setRatings(data))
			.catch(() => setRatings([]));
	}, [doctorId, flag]);

	if (!ratings.length) return <p>Brak ocen dla tego lekarza.</p>;

	const renderStars = (count) => {
		const stars = [];
		for (let i = 0; i < 5; i++) {
			stars.push(
				<i
					key={i}
					className={`bi bi-star${i < count ? '-fill' : ''}`}
					style={{ color: '#ffc107' }}
					aria-hidden="true"
				></i>
			);
		}
		return stars;
	};

	 const handleDelete = async (ratingId) => {

		try {
			const res = await fetch(`http://localhost:8080/ratings/${ratingId}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!res.ok) {
				throw new Error("Nie udało się usunąć komentarza");
			}
			setFlag(p=>!p);
		} catch (err) {
			alert(err.message || "Błąd podczas usuwania komentarza");
		}
	};

		return (
		<div>
			<h4 className="text-center mb-4">Opinie pacjentów:</h4>
			<ul className="list-group d-flex flex-column align-items-center">
				{ratings.map(({ _id, rating, comment, patient_id, createdAt }) => {
					const isOwnComment = user && patient_id?._id === user.id;

					return (
						<li
							key={_id}
							className="list-group-item w-75 my-3"
							style={{ borderRadius: "8px" }}
						>
							<div className="mb-1">
								<strong>{patient_id?.firstName} {patient_id?.lastName}</strong>{" "}
								<small className="text-muted">({new Date(createdAt).toLocaleDateString("pl-PL")})</small>
							</div>
							<div className="mb-1">
								Ocena: {renderStars(rating)} <span>({rating} / 5)</span>
							</div>
							<div className="mb-2">{comment || ""}</div>
							{(isOwnComment || user?.role === "ADMIN") && (
								<button
									className="btn btn-link p-0 text-danger"
									onClick={() => handleDelete(_id)}
									style={{ fontSize: "0.9rem" }}
								>
									Usuń komentarz
								</button>
							)}
						</li>
					);
				})}
			</ul>
		</div>
	);
}
