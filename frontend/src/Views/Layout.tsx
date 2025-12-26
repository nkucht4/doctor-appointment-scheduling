import { Link, Outlet } from "react-router-dom"

export default function Layout(){
    return (
        <>
            <nav className="navbar navbar-expand navbar-light bg-light px-3">
                <Link className="navbar-brand" to="/">
                    Calendar
                </Link>

                <div className="ms-auto">
                    <Link
                        to="/consultation_list"
                        className="nav-link"
                        aria-label="Consultations"
                    >
                        <i className="bi bi-cart"></i>
                    </Link>
                </div>
            </nav>

            <main className="container mt-3">
                <Outlet />
            </main>
        </>
    )
}