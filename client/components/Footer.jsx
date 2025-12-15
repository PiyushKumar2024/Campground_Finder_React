const Footer = () => {
    return (
        <div className="container-fluid bg-light m-0">
            <footer className="row row-cols-5 py-5 my-5 border-top">
                <div className="col">
                    <a href="/" className="d-flex align-items-center mb-3 link-dark text-decoration-none">
                        <svg className="bi me-2" width="40" height="32"><use xlinkHref="#bootstrap"></use></svg>
                    </a>
                    <p className="text-muted">© 2025</p>
                </div>

                <div className="col">

                </div>

                <div className="col">
                    <h5>Section</h5>
                    <ul className="nav flex-column">
                        <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">Home</a></li>
                        <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">Features</a></li>
                        <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">Pricing</a></li>
                        <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">FAQs</a></li>
                        <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">About</a></li>
                    </ul>
                </div>

                <div className="col">
                    <h5>Address</h5>
                    <ul className="nav flex-column">
                        <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">3/231 Tagore Street,Prayagraj,Uttar Pradesh India</a></li>
                    </ul>
                </div>

                <div className="col">
                    <h5>Contact</h5>
                    <ul className="nav flex-column">
                        <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">+912124213424</a></li>
                        <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">fraud@gmail.com</a></li>
                    </ul>
                </div>
            </footer>
        </div>
    );
};

export default Footer;
