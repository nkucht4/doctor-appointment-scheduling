import { useContext, useEffect, useState } from "react";
import UserList from "./UserList";
import AddDoctorForm from "./AddDoctorForm";
import { AuthContext } from "../Providers/AuthProvider";
import PersistenceSelector from "./PersistenceSelector";

export default function AdminPanel() {
  const { token } = useContext(AuthContext);

  const [allUsers, setAllUsers] = useState([]);
  const [message, setMessage] = useState(null);
  const [refreshToggle, setRefreshToggle] = useState(false);

  const clearMessage = () => {
    setTimeout(() => setMessage(null), 5000);
  };

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:8080/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((users) => {
        setAllUsers(users);
      })
      .catch(() => {
        setMessage({ type: "error", text: "Błąd podczas pobierania użytkowników" });
        clearMessage();
      });
  }, [token, refreshToggle]);

  const handleAddDoctor = (doctorData) => {
    const newDoctor = {
      _id: Date.now().toString(),
      ...doctorData,
    };

    setAllUsers((prev) => [...prev, newDoctor]);

    fetch("http://localhost:8080/auth/register_doctor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newDoctor),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Server error: ${response.statusText}`);
        }
        setMessage({
          type: "success",
          text: `Dodano lekarza: ${doctorData.firstName} ${doctorData.lastName}`,
        });
        clearMessage();
      })
      .catch((error) => {
        console.error("Error:", error.message);
        setMessage({
          type: "error",
          text: `Błąd w dodawaniu lekarza: ${doctorData.firstName} ${doctorData.lastName}`,
        });
        clearMessage();
      });
  };

  const doctors = allUsers.filter((u) => u.role === "DOCTOR");
  const patients = allUsers.filter((u) => u.role === "PATIENT");

  return (
    <div>
      <h2>Panel administratora</h2>

      {message && (
        <div
          style={{
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "5px",
            color: message.type === "success" ? "green" : "red",
            border: `1px solid ${message.type === "success" ? "green" : "red"}`,
          }}
        >
          {message.text}
        </div>
      )}

      <AddDoctorForm onAdd={handleAddDoctor} />

      <h3>Lekarze</h3>
      <UserList users={doctors} />

      <h3 className="mt-4">Pacjenci</h3>
      <UserList users={patients} fetchUsers={() => setRefreshToggle((prev) => !prev)} />

      <h3 className="mt-4">Tryb perzystencji</h3>
      <PersistenceSelector />
    </div>
  );
}
