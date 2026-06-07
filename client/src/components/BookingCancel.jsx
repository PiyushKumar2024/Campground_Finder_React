import { useSearchParams, Link } from 'react-router-dom';

const BookingCancel = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');

    return (
        <div className="container py-5" style={{ minHeight: '70vh' }}>
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                        {/* Cancel Header */}
                        <div className="text-center py-5" style={{ background: 'linear-gradient(135deg, #6c757d 0%, #adb5bd 100%)' }}>
                            <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow" style={{ width: '80px', height: '80px' }}>
                                <i className="bi bi-x-lg text-secondary" style={{ fontSize: '2.5rem' }}></i>
                            </div>
                            <h2 className="text-white fw-bold mb-1">Payment Cancelled</h2>
                            <p className="text-white-50 mb-0">No charges were made</p>
                        </div>

                        {/* Info */}
                        <div className="card-body p-4 text-center">
                            <p className="text-muted mb-4">
                                Your payment was not processed and no charges were applied to your card.
                                The booking will be automatically cancelled.
                            </p>

                            <div className="alert alert-light border rounded-3">
                                <i className="bi bi-info-circle text-primary me-2"></i>
                                You can try booking again anytime. Your selected dates may still be available.
                            </div>

                            <div className="d-grid gap-2 mt-4">
                                <Link to="/campgrounds" className="btn btn-success">
                                    <i className="bi bi-compass me-2"></i>Browse Campgrounds
                                </Link>
                                <button onClick={() => window.history.back()} className="btn btn-outline-secondary">
                                    <i className="bi bi-arrow-left me-2"></i>Go Back
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingCancel;
