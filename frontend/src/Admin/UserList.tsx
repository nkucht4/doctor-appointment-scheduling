import { useState, useEffect } from "react";

export default function UserList(props) {
    const onBan = (id) =>{
        return // TO DO
    }

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
              <button className="btn btn-danger btn-sm mt-2 mt-md-0" onClick={() => onBan(user._id)}>
                Banuj użytkownika
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
