import { Link, Outlet } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../Providers/AuthProvider";
import NotificationBell from "../Notifications/NotificationBell";
import { NotificationsList } from "../Notifications/NotificationsList";

export default function Layout() {
  const { isAuthenticated, logout, user, token } = useContext(AuthContext);
  const role = user?.role || 'GUEST';
  
  const [unreadCount, setUnreadCount] = useState(0);
  const [showList, setShowList] = useState(false);

  const fetchUnreadCount = async () => {
    if (!token) return;

    const res = await fetch("http://localhost:8080/notifications/unread-count", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setUnreadCount(data.count || 0);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
    }
  }, [isAuthenticated, token]);

  const toggleNotifications = async () => {
    setShowList(prev => !prev);

    if (!showList) {
      await fetch("http://localhost:8080/notifications/read-all", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUnreadCount(0);
    }
  };

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
              
              <NotificationBell count={unreadCount} onClick={toggleNotifications} />
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

      {showList && <NotificationsList show={showList}/>}


      <main className="container mt-3">
        <Outlet />
      </main>
    </>
  );
}
