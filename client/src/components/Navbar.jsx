/**
 * @file Navbar.jsx
 * @description Main navigation bar component.
 * Displays routing links, handles scroll effects, and manages user authentication state (login/logout).
 */
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import { logout } from '../redux/featuresRedux/userSlice';
import { useState, useEffect } from 'react';

const Navbar = () => {

    const { isLoggedIn, user } = useSelector((state) => state.user);
    const dispatch=useDispatch();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout=()=>{
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch(logout());
        navigate('/');
    }

    return (
        <nav className={`navbar sticky-top navbar-expand-md ${scrolled ? 'scrolled' : ''} mb-2`}>
            <div className="container-fluid">
                <Link to="/" className="navbar-brand">
                    <i className="bi-compass me-1"></i>
                    Explorion
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
                    aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item"><NavLink to="/" className="nav-link" end>Home</NavLink></li>
                        <li className="nav-item"><NavLink to="/campgrounds" className="nav-link" end>Campgrounds</NavLink></li>
                        <li className="nav-item">
                            <NavLink to="/trip-planner" className="nav-link">
                                <i className="bi bi-compass me-1"></i>Trip Planner
                            </NavLink>
                        </li>
                        <li className="nav-item"><NavLink to="/campgrounds/new" className="nav-link">New Camp</NavLink></li>
                    </ul>
                    <div className="d-flex align-items-center gap-2">
                        {!isLoggedIn ? (
                            <>
                                <Link to="/user/register" className="btn btn-success px-3">
                                    <i className="bi bi-person-plus-fill me-1"></i> Register
                                </Link>
                                <Link to="/user/login" className="btn btn-outline-dark px-3">
                                    <i className="bi bi-box-arrow-in-right me-1"></i> Login
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to={`/user/${user?.id}`} className="me-2">
                                    <img 
                                        src={user?.image?.url || 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg'} 
                                        alt="Profile" 
                                        className="rounded-circle"
                                        style={{ width: '38px', height: '38px', objectFit: 'cover', border: '2px solid var(--primary-400)' }}
                                    />
                                </Link>
                                <button className="btn btn-outline-dark" onClick={handleLogout}>
                                    <i className="bi bi-box-arrow-right me-1"></i> Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
