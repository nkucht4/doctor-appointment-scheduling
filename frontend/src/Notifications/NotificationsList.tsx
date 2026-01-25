import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../Providers/AuthProvider";

export function NotificationsList(props) {
  const [ notifications, setNotifications ] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
      if (!token) return;
  
      fetch("http://localhost:8080/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(setNotifications);
    }, [token, props.show]);

  return (
    <div
      className="border rounded p-3 bg-white shadow overflow-auto"
      style={{
        position: "fixed",
        top: 60,
        right: 20,
        width: 320,
        maxHeight: 400,
        zIndex: 1050,
      }}
    >
      <h6>Powiadomienia</h6>
      {notifications.length === 0 && <div>Brak powiadomień</div>}
      {notifications.length > 0 &&
      <ul className="list-group list-group-flush">
        {notifications.map((n, i) => (
          <li key={i} className="list-group-item">
            {n.message} <br />
            <small className="text-muted">{new Date(n.date).toLocaleString()}</small>
          </li>
        ))}
      </ul>
}
    </div>
  );
}
