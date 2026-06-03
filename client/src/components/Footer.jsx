import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <div className="container-fluid m-0 p-0 mt-5" style={{ background: 'linear-gradient(135deg, var(--neutral-900), var(--primary-900))', color: 'var(--neutral-200)' }}>
            <div className="container">
                <footer className="row py-5 border-top" style={{ borderColor: 'rgba(255,255,255,0.1) !important' }}>
                    <div className="col-lg-4 mb-4">
                        <Link to="/" className="d-flex align-items-center mb-3 text-white text-decoration-none">
                            <i className="bi-compass fs-2 me-2 text-success"></i>
                            <span className="fs-4 fw-bold" style={{ fontFamily: 'var(--font-display)' }}>Explorion</span>
                        </Link>
                        <p className="text-white-50">
                            Discover the best camping spots, share your experiences, and connect with nature. Your next adventure awaits.
                        </p>
                        <p className="text-white-50 mt-4 mb-0">© {new Date().getFullYear()} Explorion Inc.</p>
                    </div>

                    <div className="col-lg-2 offset-lg-2 mb-4">
                        <h5 className="text-white mb-3">Quick Links</h5>
                        <ul className="nav flex-column">
                            <li className="nav-item mb-2"><Link to="/" className="nav-link p-0 text-white-50 hover-glow">Home</Link></li>
                            <li className="nav-item mb-2"><Link to="/campgrounds" className="nav-link p-0 text-white-50 hover-glow">Campgrounds</Link></li>
                            <li className="nav-item mb-2"><Link to="/user/register" className="nav-link p-0 text-white-50 hover-glow">Sign Up</Link></li>
                        </ul>
                    </div>

                    <div className="col-lg-4 mb-4">
                        <h5 className="text-white mb-3">Contact Us</h5>
                        <ul className="nav flex-column mb-3">
                            <li className="nav-item mb-2 text-white-50">
                                <i className="bi bi-geo-alt me-2 text-success"></i>
                                Prayagraj, Uttar Pradesh, India
                            </li>
                            <li className="nav-item mb-2 text-white-50">
                                <i className="bi bi-telephone me-2 text-success"></i>
                                +91 9876543210
                            </li>
                            <li className="nav-item mb-2 text-white-50">
                                <i className="bi bi-envelope me-2 text-success"></i>
                                support@explorion.com
                            </li>
                        </ul>
                        <div className="d-flex gap-3 mt-3">
                            <a href="#" className="text-white-50 hover-glow fs-4"><i className="bi bi-twitter"></i></a>
                            <a href="#" className="text-white-50 hover-glow fs-4"><i className="bi bi-instagram"></i></a>
                            <a href="#" className="text-white-50 hover-glow fs-4"><i className="bi bi-facebook"></i></a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Footer;
