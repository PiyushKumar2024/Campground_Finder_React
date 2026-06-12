import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/Landing.css';

const Landing = () => {

    useEffect(() => {
        document.title = "Explorion | Discover Campgrounds";
        
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
            <div className="hero-section mb-5">
                <div className="container position-relative z-1">
                    <div className="badge bg-success bg-opacity-25 text-white mb-3 px-3 py-2 rounded-pill animate-fade-in border border-success border-opacity-50">🌟 Premium Camping Experience</div>
                    <h1 className="display-2 fw-bold mb-4 animate-fade-in">Welcome to Explorion</h1>
                    <p className="lead fs-3 mb-5 opacity-90 mx-auto animate-fade-in" style={{ animationDelay: '0.2s', maxWidth: '700px' }}>
                        Discover hand-picked campgrounds from around the world.
                    </p>
                    <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                        <Link to="/campgrounds" className="btn btn-success btn-lg px-5 py-3 fw-semibold rounded-pill shadow-lg hover-glow">
                            Start Exploring
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container pb-5">
                {/* Features Section */}
                <div className="row g-4 mb-5 pb-3">
                    <div className="col-md-4">
                        <div className="feature-card h-100">
                            <div className="feature-icon"><i className="bi bi-map"></i></div>
                            <h4>Explore Nature</h4>
                            <p>Find hidden gems and scenic spots curated by our community of outdoor enthusiasts.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="feature-card h-100">
                            <div className="feature-icon"><i className="bi bi-people"></i></div>
                            <h4>Community Reviews</h4>
                            <p>Read honest reviews from fellow campers to ensure your next trip is perfect.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="feature-card h-100">
                            <div className="feature-icon"><i className="bi bi-pencil-square"></i></div>
                            <h4>Share Experiences</h4>
                            <p>Create your own campground listings and share your adventures with the world.</p>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="stats-section shadow-sm mb-5">
                    <div className="row text-center">
                        <div className="col-md-4 stat-item">
                            <h2>45+</h2>
                            <p>Campgrounds</p>
                        </div>
                        <div className="col-md-4 stat-item">
                            <h2>120+</h2>
                            <p>Happy Campers</p>
                        </div>
                        <div className="col-md-4 stat-item">
                            <h2>350+</h2>
                            <p>Reviews</p>
                        </div>
                    </div>
                </div>

                {/* Campgrounds Carousel */}
                <div className="mb-5 pb-3">
                    <h2 className="text-center mb-5 fw-bold display-6">Featured Destinations</h2>
                    <div id="campgroundCarousel" className="carousel slide shadow-lg rounded-4 overflow-hidden" data-bs-ride="carousel">
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <img src="https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-1.2.1&auto=format&fit=crop&w=2400&q=100" className="d-block w-100" style={{ height: '500px', objectFit: 'cover' }} alt="Forest Camping" />
                                <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-75 rounded-3 p-4 mb-4 mx-auto" style={{ maxWidth: '600px', backdropFilter: 'blur(4px)' }}>
                                    <h5 className="display-5 fw-bold text-white text-shadow-sm mb-2">Deep Forest Haven</h5>
                                    <p className="fs-4 mb-0 text-light opacity-100">Experience the tranquility of the deep woods.</p>
                                    <Link to="/campgrounds" className="btn btn-lg btn-success mt-4 px-5 rounded-pill shadow">Explore Destinations</Link>
                                </div>
                            </div>
                            <div className="carousel-item">
                                <img src="https://images.unsplash.com/photo-1533827432537-70133748f5c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=2400&q=100" className="d-block w-100" style={{ height: '500px', objectFit: 'cover' }} alt="Mountain View" />
                                <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-75 rounded-3 p-4 mb-4 mx-auto" style={{ maxWidth: '600px', backdropFilter: 'blur(4px)' }}>
                                    <h5 className="display-5 fw-bold text-white text-shadow-sm mb-2">Mountain Peak Resort</h5>
                                    <p className="fs-4 mb-0 text-light opacity-100">Breathtaking views from the top of the world.</p>
                                    <Link to="/campgrounds" className="btn btn-lg btn-success mt-4 px-5 rounded-pill shadow">Explore Destinations</Link>
                                </div>
                            </div>
                            <div className="carousel-item">
                                <img src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=2400&q=100" className="d-block w-100" style={{ height: '500px', objectFit: 'cover' }} alt="Lakeside Camping" />
                                <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-75 rounded-3 p-4 mb-4 mx-auto" style={{ maxWidth: '600px', backdropFilter: 'blur(4px)' }}>
                                    <h5 className="display-5 fw-bold text-white text-shadow-sm mb-2">Lakeside Paradise</h5>
                                    <p className="fs-4 mb-0 text-light opacity-100">Wake up to the sound of gentle waves.</p>
                                    <Link to="/campgrounds" className="btn btn-lg btn-success mt-4 px-5 rounded-pill shadow">Explore Destinations</Link>
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
                                        Is Explorion free to use?
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

export default Landing;