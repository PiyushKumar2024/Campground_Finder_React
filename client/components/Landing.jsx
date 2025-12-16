import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../public/css/Landing.css';

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
            <div className="hero-section mb-5">
                <h1 className="display-3 fw-bold">Welcome to YelpCamp</h1>
                <p className="lead fs-4 mb-4">Discover the best camping grounds from around the world</p>
                <Link to="/campgrounds" className="btn btn-lg btn-success fw-bold px-4">View All Campgrounds</Link>
            </div>

            <div className="container">
                {/* Features Section */}
                <div className="row text-center mb-5">
                    <div className="col-md-4 mb-4">
                        <i className="bi bi-map feature-icon"></i>
                        <h3>Explore Nature</h3>
                        <p className="text-muted">Find hidden gems and scenic spots curated by our community.</p>
                    </div>
                    <div className="col-md-4 mb-4">
                        <i className="bi bi-people feature-icon"></i>
                        <h3>Community Reviews</h3>
                        <p className="text-muted">Read honest reviews from fellow campers before you book.</p>
                    </div>
                    <div className="col-md-4 mb-4">
                        <i className="bi bi-pencil-square feature-icon"></i>
                        <h3>Share Experiences</h3>
                        <p className="text-muted">Create your own campgrounds and share your adventures.</p>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="stats-section mb-5 shadow-sm">
                    <div className="row text-center">
                        <div className="col-md-4 mb-3 mb-md-0">
                            <div className="stat-item">
                                <h2 className="counter">500+</h2>
                                <p className="text-muted fw-bold">Campgrounds</p>
                            </div>
                        </div>
                        <div className="col-md-4 mb-3 mb-md-0">
                            <div className="stat-item">
                                <h2>10k+</h2>
                                <p className="text-muted fw-bold">Happy Campers</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="stat-item">
                                <h2>25k+</h2>
                                <p className="text-muted fw-bold">Reviews</p>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="my-5" />

                {/* Campgrounds Carousel */}
                <h2 className="text-center mb-4">Featured Destinations</h2>
                <div id="campgroundCarousel" className="carousel slide mb-5 shadow rounded overflow-hidden" data-bs-ride="carousel">
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img src="https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" className="d-block w-100" alt="Forest Camping" />
                            <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded">
                                <h5>Deep Forest Haven</h5>
                                <p>Experience the tranquility of the deep woods.</p>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img src="https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" className="d-block w-100" alt="Mountain View" />
                            <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded">
                                <h5>Mountain Peak Resort</h5>
                                <p>Breathtaking views from the top of the world.</p>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" className="d-block w-100" alt="Lakeside Camping" />
                            <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded">
                                <h5>Lakeside Paradise</h5>
                                <p>Wake up to the sound of gentle waves.</p>
                            </div>
                        </div>
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#campgroundCarousel" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#campgroundCarousel" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>

                <hr className="my-5" />

                {/* FAQ Section */}
                <div className="row justify-content-center mb-5">
                    <div className="col-lg-8">
                        <h2 className="text-center mb-4">Frequently Asked Questions</h2>
                        <div className="accordion shadow-sm" id="faqAccordion">
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingOne">
                                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                        Is YelpCamp free to use?
                                    </button>
                                </h2>
                                <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#faqAccordion">
                                    <div className="accordion-body">
                                        <strong>Yes!</strong> Browsing campgrounds and reading reviews is completely free. You only need an account to post your own campgrounds or reviews.
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingTwo">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                        How do I add a campground?
                                    </button>
                                </h2>
                                <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#faqAccordion">
                                    <div className="accordion-body">
                                        Once you have registered and logged in, simply click on the "Add Campground" button in the navigation bar or on this page to share your favorite spot.
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingThree">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                        Can I edit my reviews?
                                    </button>
                                </h2>
                                <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#faqAccordion">
                                    <div className="accordion-body">
                                        Currently, you can delete your reviews and post new ones. We are working on an edit feature for future updates!
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Testimonials Carousel */}
                <h2 className="text-center mb-4">What Campers Say</h2>
                <div id="testimonialCarousel" className="carousel slide mb-5" data-bs-ride="carousel">
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <div className="testimonial-card">
                                <i className="bi bi-quote fs-1 text-success"></i>
                                <p className="lead fst-italic mt-3">"YelpCamp changed the way I travel. I found the most amazing secluded spot for my weekend getaway. Highly recommended!"</p>
                                <h5 className="mt-3 fw-bold">- Sarah J.</h5>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <div className="testimonial-card">
                                <i className="bi bi-quote fs-1 text-success"></i>
                                <p className="lead fst-italic mt-3">"The community reviews are a lifesaver. I avoided a muddy campsite thanks to a recent review and found a sunny hill instead."</p>
                                <h5 className="mt-3 fw-bold">- Mike T.</h5>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <div className="testimonial-card">
                                <i className="bi bi-quote fs-1 text-success"></i>
                                <p className="lead fst-italic mt-3">"Booking and sharing my own spots has never been easier. A fantastic platform for outdoor enthusiasts."</p>
                                <h5 className="mt-3 fw-bold">- Emily R.</h5>
                            </div>
                        </div>
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon bg-dark rounded-circle" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="next">
                        <span className="carousel-control-next-icon bg-dark rounded-circle" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>

                {/* Newsletter Section */}
                <div className="newsletter-section mb-5 text-center shadow">
                    <h2 className="mb-3">Stay Updated</h2>
                    <p className="mb-4">Subscribe to our newsletter for the latest campground additions and camping tips.</p>
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <form className="d-flex gap-2">
                                <input type="email" className="form-control" placeholder="Enter your email" aria-label="Email" />
                                <button className="btn btn-light fw-bold" type="button">Subscribe</button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Call to Action / Links */}
                <div className="row justify-content-center mb-5">
                    <div className="col-md-8 text-center">
                        <h3>Ready to start your adventure?</h3>
                        <p className="text-muted mb-4">Join thousands of happy campers today.</p>
                        <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                            <Link to="/register" className="btn btn-outline-success btn-lg px-4 gap-3">Create an Account</Link>
                            <Link to="/campgrounds/new" className="btn btn-success btn-lg px-4">Add a Campground</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;