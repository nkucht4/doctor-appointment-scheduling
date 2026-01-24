import { Link, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Providers/AuthProvider";

export default function Layout() {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const role = user?.role || 'GUEST';

  function renderLinksByRole(role) {
    switch(role) {
      case 'ADMIN':
        return (
          <>
             <Link className="navbar-brand" to="/">
          Doctor Calendar
        </Link>

            <Link className="navbar-brand" to="/admin_panel">
              Panel Admina
            </Link>

            <Link className="navbar-brand" to="/doctors_harmonogram">
              Harmonogram lekarzy
            </Link>

                    <div className="ms-auto d-flex gap-3 align-items-center">
            <>

                <span className="navbar-text me-3">
                {user?.firstName} {user?.lastName}
                </span>
              

              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={logout}
              >
                Wyloguj
              </button>
            </>
        </div>

          </>
        );
      case 'DOCTOR':
        return (
          <>
            <Link className="navbar-brand" to="/">
          Doctor Calendar
        </Link>

            <Link className="navbar-brand" to={`/calendar/doctor/${user?.id}`}>
              Mój harmonogram
            </Link>

            <Link className="navbar-brand" to={`/doctor/${user?.id}/reviews`}>
              Moje opinie
            </Link>

        <div className="ms-auto d-flex gap-3 align-items-center">
            <>

                <span className="navbar-text me-3">
                {user?.firstName} {user?.lastName}
                </span>
                
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={logout}
              >
                Wyloguj
              </button>
            </>
        </div>
          </>
        );
      case 'PATIENT':
        return (
          <>
            <Link className="navbar-brand" to="/">
          Doctor Calendar
        </Link>


            <Link className="navbar-brand" to="/doctors_harmonogram">
              Harmonogramy lekarzy
            </Link>

        <div className="ms-auto d-flex gap-3 align-items-center">
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
        </div>
          </>
        );
      default: 
        return (
          <>
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
          </>
        );
    }
  }


  return (
    <>
      <nav className="navbar navbar-expand navbar-light bg-light px-3">
       { isAuthenticated ? renderLinksByRole(role) : renderLinksByRole('GUEST') }
      </nav>

      <main className="container mt-3">
        <Outlet />
      </main>
    </>
  );
}
