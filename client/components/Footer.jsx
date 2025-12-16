import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <div className="container-fluid bg-light m-0">
            <footer className="row row-cols-5 py-5 my-5 border-top">
                <div className="col">
                    <Link to="/" className="d-flex align-items-center mb-3 link-dark text-decoration-none">
                        <svg className="bi me-2" width="40" height="32"><use xlinkHref="#bootstrap"></use></svg>
                    </Link>
                    <p className="text-muted">© 2025</p>
                </div>

                <div className="col">

                </div>

                <div className="col">
                    <h5>Section</h5>
                    <ul className="nav flex-column">
                        <li className="nav-item mb-2"><Link to="/campgrounds" className="nav-link p-0 text-muted">Home</Link></li>
                        <li className="nav-item mb-2"><Link to="#" className="nav-link p-0 text-muted">Features</Link></li>
                        <li className="nav-item mb-2"><Link to="#" className="nav-link p-0 text-muted">Pricing</Link></li>
                        <li className="nav-item mb-2"><Link to="#" className="nav-link p-0 text-muted">FAQs</Link></li>
                        <li className="nav-item mb-2"><Link to="/" className="nav-link p-0 text-muted">About</Link></li>
                    </ul>
                </div>

                <div className="col">
                    <h5>Address</h5>
                    <ul className="nav flex-column">
                        <li className="nav-item mb-2"><p className="nav-link p-0 text-muted">3/231 Tagore Street,Prayagraj,Uttar Pradesh India</p></li>
                    </ul>
                </div>

                <div className="col">
                    <h5>Contact</h5>
                    <ul className="nav flex-column">
                        <li className="nav-item mb-2"><p className="nav-link p-0 text-muted">+912124213424</p></li>
                        <li className="nav-item mb-2"><p className="nav-link p-0 text-muted">fraud@gmail.com</p></li>
                    </ul>
                </div>
            </footer>
        </div>
    );
};

export default Footer;
