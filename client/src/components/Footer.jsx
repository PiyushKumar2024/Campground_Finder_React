/**
 * @file Footer.jsx
 * @description Global footer component.
 * Contains site links, contact information, and social media handles.
 */
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <div className="container-fluid m-0 p-0 mt-5" style={{ background: 'linear-gradient(135deg, var(--neutral-900) 0%, var(--primary-900) 50%, var(--neutral-900) 100%)', color: 'var(--neutral-200)' }}>
            <div className="container">
                <footer className="row py-5 border-top" style={{ borderColor: 'rgba(255,255,255,0.06) !important' }}>
                    <div className="col-lg-4 mb-4">
                        <Link to="/" className="d-flex align-items-center mb-3 text-white text-decoration-none">
                            <i className="bi-compass fs-2 me-2" style={{ color: 'var(--primary-400)' }}></i>
                            <span className="fs-4 fw-bold" style={{ fontFamily: 'var(--font-display)' }}>Explorion</span>
                        </Link>
                        <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                            Discover the best camping spots, share your experiences, and connect with nature. Your next adventure awaits.
                        </p>
                        <p style={{ color: 'rgba(255, 255, 255, 0.5)' }} className="mt-4 mb-0">© {new Date().getFullYear()} Explorion Inc.</p>
                    </div>

                    <div className="col-lg-2 offset-lg-2 mb-4">
                        <h5 className="text-white mb-3" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'var(--font-primary)' }}>Quick Links</h5>
                        <ul className="nav flex-column">
                            <li className="nav-item mb-2"><Link to="/" className="footer-link">Home</Link></li>
                            <li className="nav-item mb-2"><Link to="/campgrounds" className="footer-link">Campgrounds</Link></li>
                            <li className="nav-item mb-2"><Link to="/user/register" className="footer-link">Sign Up</Link></li>
                        </ul>
                    </div>

                    <div className="col-lg-4 mb-4">
                        <h5 className="text-white mb-3" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'var(--font-primary)' }}>Contact Us</h5>
                        <ul className="nav flex-column mb-3">
                            <li className="nav-item mb-2" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                <i className="bi bi-geo-alt me-2" style={{ color: 'var(--primary-400)' }}></i>
                                Prayagraj, Uttar Pradesh, India
                            </li>
                            <li className="nav-item mb-2" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                <i className="bi bi-telephone me-2" style={{ color: 'var(--primary-400)' }}></i>
                                +91 9876543210
                            </li>
                            <li className="nav-item mb-2" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                <i className="bi bi-envelope me-2" style={{ color: 'var(--primary-400)' }}></i>
                                support@explorion.com
                            </li>
                        </ul>
                        <div className="d-flex gap-3 mt-3">
                            <a href="#" className="fs-4 footer-link"><i className="bi bi-twitter"></i></a>
                            <a href="#" className="fs-4 footer-link"><i className="bi bi-instagram"></i></a>
                            <a href="#" className="fs-4 footer-link"><i className="bi bi-facebook"></i></a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Footer;
