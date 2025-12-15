const Navbar = ({ currentUser }) => {
    return (
        <nav className="navbar sticky-top navbar-expand-md navbar-light bg-white shadow-sm mb-2">
            <div className="container-fluid">
                <a href="/" className="navbar-brand fw-bold text-secondary">
                    <i className="bi-compass me-1"></i>
                    Yelp Camp
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
                    aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item"><a href="/" className="nav-link">Home</a></li>
                        <li className="nav-item"><a href="/campgrounds" className="nav-link">Campgrounds</a></li>
                        <li className="nav-item"><a href="/campgrounds/new" className="nav-link">New Camp</a></li>
                    </ul>
                    <div className="d-flex">
                        {!currentUser ? (
                            <>
                                <a href="/register" className="btn btn-success me-2">
                                    <i className="bi bi-person-plus-fill"></i> Register
                                </a>
                                <a href="/login" className="btn btn-outline-dark me-2">
                                    <i className="bi bi-box-arrow-in-right"></i> Login
                                </a>
                            </>
                        ) : (
                            <a href="/logout" className="btn btn-outline-dark me-2">
                                <i className="bi bi-person-plus-fill"></i> Logout
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
