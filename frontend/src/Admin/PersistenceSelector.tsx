import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Providers/AuthProvider";

export default function PersistenceSelector() {
  const [mode, setMode] = useState("local");
  const [message, setMessage] = useState("");
  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetch("http://localhost:8080/auth_settings")
      .then((res) => {
        if (!res.ok) throw new Error("Fetch failed");
        return res.json();
      })
      .then((data) => {
        setMode(data.persistenceMode || "local");
      })
      .catch(() => {
        setMessage("Błąd ładowania ustawień");
      });
  }, []);

  const handleSave = () => {
    setMessage("");
    fetch("http://localhost:8080/auth_settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ mode }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Save failed");
        setMessage("Zapisano pomyślnie!");
      })
      .catch(() => {
        setMessage("Błąd zapisu");
      });
  };

  return (
    <div className="mb-4" style={{ maxWidth: 400 }}>
      <select
        className="form-select mb-3"
        value={mode}
        onChange={(e) => setMode(e.target.value)}
      >
        <option value="memory">Memory</option>
        <option value="session">Session</option>
        <option value="local">Local</option>
      </select>
      <button className="btn btn-primary" onClick={handleSave}>
        Zapisz
      </button>
      {message && <div className="mt-3">{message}</div>}
    </div>
  );
}
