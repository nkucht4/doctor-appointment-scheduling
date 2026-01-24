import { useContext, useEffect, useState } from "react";
import UserList from "./UserList";
import AddDoctorForm from "./AddDoctorForm";
import { AuthContext } from "../Providers/AuthProvider";

export default function AdminPanel() {
  const [allUsers, setAllUsers] = useState([]);
  const [message, setMessage] = useState(null); 
  const { token } = useContext(AuthContext);
  const [ change, setChange ] = useState(false);

  const handleAddDoctor = async (doctorData) => {
    const newDoctor = {
      _id: Date.now().toString(),
      ...doctorData,
    };
    setAllUsers((prev) => [...prev, newDoctor]);

    try {
      const response = await fetch("http://localhost:8080/auth/register_doctor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newDoctor), 
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      setMessage({ type: "success", text: `Dodano lekarza: ${doctorData.firstName} ${doctorData.lastName}` });
    } catch (error) {
      console.error("Error:", error.message);
      setMessage({ type: "error", text: `Błąd w dodawaniu lekarza: ${doctorData.firstName} ${doctorData.lastName}` });
    }

    setTimeout(() => setMessage(null), 5000);
  };

  useEffect(() => {
    fetch("http://localhost:8080/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((a) => a.json())
      .then((a) => setAllUsers(a))
      .catch((e) => setMessage({ type: "error", text: "Błąd podczas pobierania użytkowników" }));
  }, [token, change]);

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
      <UserList users={doctors}/>

      <h3 className="mt-4">Pacjenci</h3>
      <UserList users={patients} fetchUsers={()=>{setChange(p=>!p)}}/>
    </div>
  );
}
