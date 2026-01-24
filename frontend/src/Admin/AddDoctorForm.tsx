import { useState } from "react";

export default function AddDoctorForm(props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password.trim()
    ) return;

    props.onAdd({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      specialization: specialization.trim(),
      email: email.trim(),
      password: password,
      role: "DOCTOR"
    });

    setFirstName("");
    setLastName("");
    setSpecialization("");
    setEmail("");
    setPassword("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <div className="mb-2">
        <input
          type="text"
          className="form-control"
          placeholder="Imię"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          required
        />
      </div>
      <div className="mb-2">
        <input
          type="text"
          className="form-control"
          placeholder="Nazwisko"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          required
        />
      </div>
      <div className="mb-2">
        <input
          type="text"
          className="form-control"
          placeholder="Specjalizacja"
          value={specialization}
          onChange={e => setSpecialization(e.target.value)}
        />
      </div>
      <div className="mb-2">
        <input
          type="email"
          className="form-control"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <input
          type="password"
          className="form-control"
          placeholder="Hasło"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>
      <button type="submit" className="btn btn-primary">Dodaj lekarza</button>
    </form>
  );
}
