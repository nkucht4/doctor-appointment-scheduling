import { Link, Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <>
      <nav className="navbar navbar-expand navbar-light bg-light px-3">
        <Link className="navbar-brand" to="/">
          Doctor Calendar
        </Link>

        <Link className="navbar-brand" to="/doctors">
              Lista lekarzy
            </Link>

        <div className="ms-auto d-flex gap-3 align-items-center">
              <Link to="/login" className="nav-link">
                Logowanie
              </Link>
              <Link to="/register" className="nav-link">
                Rejestracja
              </Link>
        </div>
      </nav>

      <main className="container mt-4" style={{ maxWidth: 420 }}>
        <Outlet />
      </main>
    </>
  );
}
