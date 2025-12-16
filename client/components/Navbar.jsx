import { Link, NavLink } from 'react-router-dom';

const Navbar = ({ currentUser }) => {
    return (
        <nav className="navbar sticky-top navbar-expand-md navbar-light bg-white shadow-sm mb-2">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand fw-bold text-secondary">
                    <i className="bi-compass me-1"></i>
                    Yelp Camp
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
                    aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item"><NavLink to="/" className="nav-link" end>Home</NavLink></li>
                        <li className="nav-item"><NavLink to="/campgrounds" className="nav-link" end>Campgrounds</NavLink></li>
                        <li className="nav-item"><NavLink to="/campgrounds/new" className="nav-link">New Camp</NavLink></li>
                    </ul>
                    <div className="d-flex">
                        {!currentUser ? (
                            <>
                                <Link to="/register" className="btn btn-success me-2">
                                    <i className="bi bi-person-plus-fill"></i> Register
                                </Link>
                                <Link to="/login" className="btn btn-outline-dark me-2">
                                    <i className="bi bi-box-arrow-in-right"></i> Login
                                </Link>
                            </>
                        ) : (
                            <Link to="/logout" className="btn btn-outline-dark me-2">
                                <i className="bi bi-person-plus-fill"></i> Logout
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
