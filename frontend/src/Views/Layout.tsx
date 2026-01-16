import { Link, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Providers/AuthProvider";

export default function Layout() {
  const { isAuthenticated, logout, user } = useContext(AuthContext);

  return (
    <>
      <nav className="navbar navbar-expand navbar-light bg-light px-3">
        <Link className="navbar-brand" to="/">
          Doctor Calendar
        </Link>

        <div className="ms-auto d-flex gap-3 align-items-center">
          {isAuthenticated ? (
            <>

                <span className="navbar-text me-3">
                {user?.firstName} {user?.lastName}
                </span>
                
              <Link to="/consultation_list" className="nav-link" aria-label="Consultations" > <i className="bi bi-cart"></i> </Link>

              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={logout}
              >
                Wyloguj
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Logowanie
              </Link>
              <Link to="/register" className="nav-link">
                Rejestracja
              </Link>
            </>
          )}
        </div>
      </nav>

      <main className="container mt-3">
        <Outlet />
      </main>
    </>
  );
}
