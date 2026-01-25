import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Providers/AuthProvider";

export default function PersistenceSelector() {
  const [mode, setMode] = useState("local");
  const [message, setMessage] = useState("");
  const { token } = useContext(AuthContext);

  useEffect(() => {
    async function fetchMode() {
      try {
        const res = await fetch("http://localhost:8080/auth_settings");
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        setMode(data.persistenceMode || "local");
      } catch {
        setMessage("Błąd ładowania ustawień");
      }
    }
    fetchMode();
  }, []);

  const handleSave = async () => {
    setMessage("");
    try {
      const res = await fetch("http://localhost:8080/auth_settings", {
        method: "POST",
        headers: { "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mode }),
      });
      if (!res.ok) throw new Error("Save failed");
      setMessage("Zapisano pomyślnie!");
    } catch {
      setMessage("Błąd zapisu");
    }
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
