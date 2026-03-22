import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/Landing.css';

console.log('hitted the landing page');

const Home = () => {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const targetText = counter.innerText;
                    const target = parseInt(targetText);

                    if (isNaN(target)) return;

                    const suffix = targetText.replace(target, '');
                    const duration = 2000; // Animation duration in ms
                    const start = performance.now();

                    const animate = (currentTime) => {
                        const elapsed = currentTime - start;
                        const progress = Math.min(elapsed / duration, 1);
                        // Ease out quart function for smooth effect
                        const ease = 1 - Math.pow(1 - progress, 4);

                        counter.innerText = Math.floor(ease * target) + suffix;

                        if (progress < 1) requestAnimationFrame(animate);
                        else counter.innerText = target + suffix;
                    };

                    requestAnimationFrame(animate);
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        const stats = document.querySelectorAll('.stat-item h2');
        stats.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <>
            {/* Hero Section */}
            <div className="hero-section position-relative d-flex align-items-center justify-content-center text-center text-white mb-5" style={{
                background: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '85vh',
                backgroundAttachment: 'fixed'
            }}>
                <div className="container position-relative z-1">
                    <h1 className="display-2 fw-bold mb-4 animate-fadeInUp">Welcome to YelpCamp</h1>
                    <p className="lead fs-3 mb-5 opacity-90 mx-auto animate-fadeInUp delay-100" style={{ maxWidth: '700px' }}>
                        Discover hand-picked campgrounds from around the world.
                    </p>
                    <Link to="/campgrounds" className="btn btn-success btn-lg px-5 py-3 fw-semibold rounded-pill shadow-lg animate-fadeInUp delay-200 hover-lift">
                        Start Exploring
                    </Link>
                </div>
            </div>

            <div className="container pb-5">
                {/* Features Section */}
                <div className="row g-4 mb-5 pb-3">
                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm text-center p-4 hover-lift">
                            <div className="mx-auto mb-4 d-flex align-items-center justify-content-center bg-success bg-opacity-10 rounded-circle" style={{ width: '80px', height: '80px' }}>
                                <i className="bi bi-map text-success fs-1"></i>
                            </div>
                            <h3 className="h4 fw-bold mb-3">Explore Nature</h3>
                            <p className="text-muted mb-0">Find hidden gems and scenic spots curated by our community of outdoor enthusiasts.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm text-center p-4 hover-lift">
                            <div className="mx-auto mb-4 d-flex align-items-center justify-content-center bg-warning bg-opacity-10 rounded-circle" style={{ width: '80px', height: '80px' }}>
                                <i className="bi bi-people text-warning fs-1"></i>
                            </div>
                            <h3 className="h4 fw-bold mb-3">Community Reviews</h3>
                            <p className="text-muted mb-0">Read honest reviews from fellow campers to ensure your next trip is perfect.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm text-center p-4 hover-lift">
                            <div className="mx-auto mb-4 d-flex align-items-center justify-content-center bg-info bg-opacity-10 rounded-circle" style={{ width: '80px', height: '80px' }}>
                                <i className="bi bi-pencil-square text-info fs-1"></i>
                            </div>
                            <h3 className="h4 fw-bold mb-3">Share Experiences</h3>
                            <p className="text-muted mb-0">Create your own campground listings and share your adventures with the world.</p>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="card border-0 bg-white shadow-sm mb-5 overflow-hidden">
                    <div className="card-body p-5">
                        <div className="row text-center divide-cols-md">
                            <div className="col-md-4 mb-4 mb-md-0">
                                <h2 className="display-4 fw-bold text-success mb-1">500+</h2>
                                <p className="text-secondary fw-medium text-uppercase ls-1">Campgrounds</p>
                            </div>
                            <div className="col-md-4 mb-4 mb-md-0 position-relative">
                                <h2 className="display-4 fw-bold text-warning mb-1">10k+</h2>
                                <p className="text-secondary fw-medium text-uppercase ls-1">Happy Campers</p>
                            </div>
                            <div className="col-md-4">
                                <h2 className="display-4 fw-bold text-info mb-1">25k+</h2>
                                <p className="text-secondary fw-medium text-uppercase ls-1">Reviews</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Campgrounds Carousel */}
                <div className="mb-5 pb-3">
                    <h2 className="text-center mb-5 fw-bold display-6">Featured Destinations</h2>
                    <div id="campgroundCarousel" className="carousel slide shadow-lg rounded-4 overflow-hidden" data-bs-ride="carousel">
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <img src="https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" className="d-block w-100" style={{ height: '500px', objectFit: 'cover' }} alt="Forest Camping" />
                                <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-75 rounded-3 p-4 mb-4 mx-auto style={{ maxWidth: '600px' }}">
                                    <h5 className="fs-3 fw-bold">Deep Forest Haven</h5>
                                    <p className="fs-5 mb-0">Experience the tranquility of the deep woods.</p>
                                </div>
                            </div>
                            <div className="carousel-item">
                                <img src="https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" className="d-block w-100" style={{ height: '500px', objectFit: 'cover' }} alt="Mountain View" />
                                <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-75 rounded-3 p-4 mb-4 mx-auto style={{ maxWidth: '600px' }}">
                                    <h5 className="fs-3 fw-bold">Mountain Peak Resort</h5>
                                    <p className="fs-5 mb-0">Breathtaking views from the top of the world.</p>
                                </div>
                            </div>
                            <div className="carousel-item">
                                <img src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" className="d-block w-100" style={{ height: '500px', objectFit: 'cover' }} alt="Lakeside Camping" />
                                <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-75 rounded-3 p-4 mb-4 mx-auto style={{ maxWidth: '600px' }}">
                                    <h5 className="fs-3 fw-bold">Lakeside Paradise</h5>
                                    <p className="fs-5 mb-0">Wake up to the sound of gentle waves.</p>
                                </div>
                            </div>
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#campgroundCarousel" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon bg-dark rounded-circle p-3 bg-opacity-50" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#campgroundCarousel" data-bs-slide="next">
                            <span className="carousel-control-next-icon bg-dark rounded-circle p-3 bg-opacity-50" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="row justify-content-center mb-5 pb-3">
                    <div className="col-lg-8">
                        <h2 className="text-center mb-4 fw-bold">Frequently Asked Questions</h2>
                        <div className="accordion accordion-flush bg-white rounded-3 shadow-sm border p-3" id="faqAccordion">
                            <div className="accordion-item border-bottom">
                                <h2 className="accordion-header" id="headingOne">
                                    <button className="accordion-button fs-5 fw-semibold py-3" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                        Is YelpCamp free to use?
                                    </button>
                                </h2>
                                <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#faqAccordion">
                                    <div className="accordion-body text-muted">
                                        <strong>Yes!</strong> Browsing campgrounds and reading reviews is completely free. You only need an account to post your own campgrounds or reviews.
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item border-bottom">
                                <h2 className="accordion-header" id="headingTwo">
                                    <button className="accordion-button collapsed fs-5 fw-semibold py-3" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                        How do I add a campground?
                                    </button>
                                </h2>
                                <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#faqAccordion">
                                    <div className="accordion-body text-muted">
                                        Once you have registered and logged in, simply click on the "Add Campground" button in the navigation bar or on this page to share your favorite spot.
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingThree">
                                    <button className="accordion-button collapsed fs-5 fw-semibold py-3" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                        Can I edit my reviews?
                                    </button>
                                </h2>
                                <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#faqAccordion">
                                    <div className="accordion-body text-muted">
                                        Currently, you can delete your reviews and post new ones. We are working on an edit feature for future updates!
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className="card border-0 bg-dark text-white rounded-4 overflow-hidden mb-5">
                    <div style={{
                        background: 'linear-gradient(135deg, var(--primary-800) 0%, var(--primary-900) 100%)',
                        padding: '4rem 2rem'
                    }}>
                        <div className="row justify-content-center text-center">
                            <div className="col-lg-8">
                                <h2 className="mb-3 fw-bold">Stay Updated</h2>
                                <p className="mb-4 text-light opacity-75">Subscribe to our newsletter for the latest campground additions and camping tips.</p>
                                <div className="row justify-content-center">
                                    <div className="col-md-9 col-lg-7">
                                        <form className="d-flex gap-2">
                                            <input type="email" className="form-control form-control-lg border-0" placeholder="Enter your email" aria-label="Email" />
                                            <button className="btn btn-warning btn-lg fw-bold" type="button">Subscribe</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center mb-5">
                    <h3 className="fw-bold mb-3">Ready to start your adventure?</h3>
                    <p className="text-muted mb-4">Join thousands of happy campers today.</p>
                    <div className="d-flex justify-content-center gap-3">
                        <Link to="/user/register" className="btn btn-outline-success btn-lg px-4 fw-semibold">Create Account</Link>
                        <Link to="/campgrounds/new" className="btn btn-success btn-lg px-4 fw-semibold shadow-sm">Add Campground</Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;