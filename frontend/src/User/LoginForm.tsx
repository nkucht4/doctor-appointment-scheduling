import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Providers/AuthProvider";
import { AppointmentContext } from "../Providers/AppointmentProvider";
import { AvailabilityContext } from "../Providers/AvailabilityProvider";

export default function LoginForm() {
  const navigate = useNavigate();
  const { setEditFlag } = useContext(AppointmentContext);
  const { setEditFlag2 } = useContext(AvailabilityContext);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Nieprawidłowy email lub hasło");
      }
      const data = await response.json();

      login(data.accessToken, data.user, data.refreshToken);
      setEditFlag(p=>!p);
      setEditFlag(p=>!p);

      navigate("/");

      console.log("Logged in");

    } catch (err) {
      setError(err.message || "Wystąpił błąd logowania");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <form
        onSubmit={onSubmit}
        className="card p-4 shadow-sm"
        style={{ width: "100%", maxWidth: 420 }}
      >
        <h4 className="text-center mb-4">Logowanie</h4>

        <div className="mb-3">
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="Hasło"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        {error && (
          <div className="alert alert-danger py-2">{error}</div>
        )}

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Logowanie..." : "Zaloguj się"}
        </button>
      </form>
    </div>
  );
}
