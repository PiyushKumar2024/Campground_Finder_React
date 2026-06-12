import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';

const BookingSuccess = () => {
    const [searchParams] = useSearchParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        const verifyPayment = async () => {
            if (!sessionId) {
                setError('No session ID found');
                setLoading(false);
                return;
            }

            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`/bookings/verify/${sessionId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBooking(res.data.booking);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to verify payment');
            } finally {
                setLoading(false);
            }
        };

        verifyPayment();
    }, [sessionId]);

    if (loading) {
        return (
            <div className="container py-5 text-center" style={{ minHeight: '70vh' }}>
                <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '50vh' }}>
                    <div className="spinner-border text-success mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
                        <span className="visually-hidden">Verifying payment...</span>
                    </div>
                    <h4 className="text-muted">Verifying your payment...</h4>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-5 text-center" style={{ minHeight: '70vh' }}>
                <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '50vh' }}>
                    <i className="bi bi-exclamation-triangle-fill text-warning" style={{ fontSize: '4rem' }}></i>
                    <h3 className="mt-3">Something went wrong</h3>
                    <p className="text-muted">{error}</p>
                    <Link to="/campgrounds" className="btn btn-outline-success mt-3">Browse Campgrounds</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5" style={{ minHeight: '70vh' }}>
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                        {/* Success Header */}
                        <div className="text-center py-5" style={{ background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' }}>
                            <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow" style={{ width: '80px', height: '80px' }}>
                                <i className="bi bi-check-lg text-success" style={{ fontSize: '2.5rem' }}></i>
                            </div>
                            <h2 className="text-white fw-bold mb-1">Payment Successful!</h2>
                            <p className="text-white-50 mb-0">Your booking has been confirmed</p>
                        </div>

                        {/* Booking Details */}
                        {booking && (
                            <div className="card-body p-4">
                                <h5 className="fw-bold mb-3">
                                    <i className="bi bi-tree-fill text-success me-2"></i>
                                    {booking.campground?.name || 'Campground'}
                                </h5>
                                {booking.campground?.location && (
                                    <p className="text-muted mb-3">
                                        <i className="bi bi-geo-alt-fill me-1"></i>
                                        {booking.campground.location}
                                    </p>
                                )}

                                <hr />

                                <div className="row g-3 my-3">
                                    <div className="col-6">
                                        <div className="text-muted small">Check-in</div>
                                        <div className="fw-bold">{new Date(booking.startDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                                    </div>
                                    <div className="col-6">
                                        <div className="text-muted small">Check-out</div>
                                        <div className="fw-bold">{new Date(booking.endDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                                    </div>
                                </div>

                                <div className="bg-light rounded-3 p-3 d-flex justify-content-between align-items-center mb-3">
                                    <span className="text-muted">Total Paid</span>
                                    <span className="fs-4 fw-bold text-success">${booking.totalPrice}</span>
                                </div>

                                <div className="d-flex justify-content-center align-items-center mb-3">
                                    <span className={`badge ${booking.status === 'paid' ? 'bg-primary' : 'bg-success'} rounded-pill px-3 py-2`}>
                                        <i className="bi bi-check-circle me-1"></i>
                                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                    </span>
                                </div>

                                <hr />

                                <div className="d-grid gap-2 mt-3">
                                    {booking.campground?._id && (
                                        <Link to={`/campgrounds/${booking.campground._id}`} className="btn btn-outline-success">
                                            <i className="bi bi-arrow-left me-2"></i>Back to Campground
                                        </Link>
                                    )}
                                    <Link to="/campgrounds" className="btn btn-success">
                                        <i className="bi bi-compass me-2"></i>Explore More Campgrounds
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingSuccess;
