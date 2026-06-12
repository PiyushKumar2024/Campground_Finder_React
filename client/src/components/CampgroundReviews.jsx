import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CampgroundReviews = ({ camp, setCamp, currentUser, id, setError }) => {

    const handleDeleteReview = async (rid) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/campgrounds/${id}/reviews/${rid}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const res = await axios.get(`/campgrounds/${id}`);
            setCamp(res.data);
        } catch (e) {
            setError(e);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) { // if validity fails
            e.stopPropagation(); // prevent bubbling
            form.classList.add('was-validated'); // adding bs class to show the valid/invalid field styles
            return;
        }
        const rating = form['review[rating]'].value;
        const body = form['review[body]'].value;

        try {
            const token = localStorage.getItem('token');
            await axios.post(`/campgrounds/${id}/reviews`,
                { review: { rating, body } },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const res = await axios.get(`/campgrounds/${id}`);
            setCamp(res.data);
            form.reset();
            form.classList.remove('was-validated');
        } catch (e) {
            setError(e);
        }
    };

    return (
        <div className="mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold m-0">Reviews</h3>
                <span className="badge bg-dark rounded-pill px-3 py-2">{camp.reviews.length} reviews</span>
            </div>

            {currentUser?.username && (
                <div className="card border-0 bg-light mb-4 rounded-4">
                    <div className="card-body p-4">
                        <h5 className="fw-bold mb-3">Leave a Review</h5>
                        <form onSubmit={handleReviewSubmit} className="needs-validation" noValidate>
                            <fieldset className="starability-growRotate mb-3">
                                <input type="radio" id="no-rate" className="input-no-rate" name="review[rating]" value="1" defaultChecked aria-label="No rating." />
                                <input type="radio" id="first-rate1" name="review[rating]" value="1" />
                                <label htmlFor="first-rate1" title="Terrible">1 star</label>
                                <input type="radio" id="first-rate2" name="review[rating]" value="2" />
                                <label htmlFor="first-rate2" title="Not good">2 stars</label>
                                <input type="radio" id="first-rate3" name="review[rating]" value="3" />
                                <label htmlFor="first-rate3" title="Average">3 stars</label>
                                <input type="radio" id="first-rate4" name="review[rating]" value="4" />
                                <label htmlFor="first-rate4" title="Very good">4 stars</label>
                                <input type="radio" id="first-rate5" name="review[rating]" value="5" />
                                <label htmlFor="first-rate5" title="Amazing">5 stars</label>
                            </fieldset>
                            <div className="form-floating mb-3">
                                <textarea className="form-control" name="review[body]" id="reviewBody" style={{ height: '100px' }} placeholder="Write your review here..." required></textarea>
                                <label htmlFor="reviewBody">Share your experience...</label>
                                <div className="invalid-feedback">Review text is required.</div>
                            </div>
                            <button className="btn btn-dark fw-bold px-4">Post Review</button>
                        </form>
                    </div>
                </div>
            )}

            <div className="vertical-scrollable p-0 bg-transparent border-0" style={{ maxHeight: 'none', overflow: 'visible' }}>
                {camp.reviews.map(review => (
                    <div className="card border-0 border-bottom mb-4 rounded-0 bg-transparent" key={review._id}>
                        <div className="card-body px-0 py-3">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                <div className="d-flex align-items-center gap-2">
                                    <div className="bg-secondary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center fw-bold text-secondary" style={{ width: '40px', height: '40px' }}>
                                        {review.author.username[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <h6 className="fw-bold mb-0">
                                            <Link to={`/user/${review.author._id}`} className="text-dark text-decoration-none">{review.author.username}</Link>
                                        </h6>
                                        <div className="text-warning small">
                                            {[...Array(review.rating)].map((_, i) => <i key={i} className="bi bi-star-fill"></i>)}
                                        </div>
                                    </div>
                                </div>
                                {currentUser?.username && currentUser.username === review.author.username && (
                                    <button className="btn btn-sm btn-link text-danger p-0 border-0" onClick={() => handleDeleteReview(review._id)}>
                                        <i className="bi bi-trash"></i>
                                    </button>
                                )}
                            </div>
                            <p className="card-text text-secondary mt-3">{review.body}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CampgroundReviews;
