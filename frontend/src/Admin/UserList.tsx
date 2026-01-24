import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../Providers/AuthProvider";

export default function UserList(props) {
  const { token } = useContext(AuthContext)

    const onBan = async (id, currentBanStatus) => {
    try {
      const res = await fetch(`http://localhost:8080/users/${id}/ban`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({ banned: !currentBanStatus }),
      });

      if (!res.ok) {
        throw new Error("Nie udało się zmienić statusu bana");
      }

      if (props.fetchUsers) {
        props.fetchUsers();
      } else {
        alert("Status bana zmieniony pomyślnie");
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div>
      {props.users.length === 0 ? (
        <p>Brak użytkowników do wyświetlenia.</p>
      ) : (
        <ul className="list-group">
          {props.users.map(user => (
            <li key={user._id} className="list-group-item d-flex justify-content-between align-items-center flex-column flex-md-row">
              <div>
                <strong>{user.firstName} {user.lastName}</strong> ({user.role})
                {user.role === "DOCTOR" && user.specialization && (
                  <span> — {user.specialization}</span>
                )}
                <br />
                <small className="text-muted">{user.email}</small>
              </div>
                { user.role === "PATIENT" && 
                <button
                  className={`btn btn-sm mt-2 mt-md-0 ${
                    user.banned ? "btn-success" : "btn-danger"
                  }`}
                  onClick={() => onBan(user._id, user.banned)}>
                  {user.banned ? "Cofnij bana użytkownika" : "Banuj użytkownika"}
                </button>
              }
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
