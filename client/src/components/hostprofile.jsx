import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const HostProfile = ({ user, camp }) => {
    const [host, setHost] = useState(user);
    const [showCampgrounds, setShowCampgrounds] = useState(false);

    useEffect(() => {
        const fetchHost = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token && user?._id) {
                    const res = await axios.get(`http://localhost:3000/user/${user._id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setHost(res.data);
                }
            } catch (e) {
                console.error("Failed to fetch host details");
            }
        };
        fetchHost();
    }, [user]);

    if (!host) return null;

    return (
        <div className="card shadow-sm mb-3">
            <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                    <img
                        src={host.image?.url || 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg'}
                        alt={host.username}
                        className="rounded-circle me-3 border"
                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                    />
                    <div>
                        <h5 className="card-title mb-0 fw-bold">{host.username}</h5>
                        <small className="text-muted">Joined: {host.joined ? new Date(host.joined).toLocaleDateString() : 'N/A'}</small>
                    </div>
                </div>

                <h6 className="card-subtitle mb-2 text-muted small text-uppercase">About the Host</h6>
                <p className="card-text fst-italic small text-secondary">
                    "{host.bio || 'No bio available.'}"
                </p>

                <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                    <div className="d-flex align-items-center">
                        <i className="bi bi-map-fill text-success me-2"></i>
                        <span className="fw-bold me-1">{host.campgrounds?.length || 0}</span>
                        <span className="text-muted small">Campgrounds</span>
                    </div>
                    <div>
                        {host.campgrounds?.length > 0 && (
                            <button
                                className="btn btn-sm btn-outline-success me-2"
                                onClick={() => setShowCampgrounds(!showCampgrounds)}
                            >
                                {showCampgrounds ? 'Hide' : 'Show All'}
                            </button>
                        )}
                        <Link to={`/user/${host._id}`} className="btn btn-sm btn-outline-primary">
                            View Profile
                        </Link>
                    </div>
                </div>

                {/* Campgrounds List */}
                {showCampgrounds && host.campgrounds?.length > 0 && (
                    <div className="mt-3 pt-3 border-top">
                        <h6 className="text-muted small text-uppercase mb-3">
                            <i className="bi bi-collection me-2"></i>
                            All Campgrounds by {host.username}
                        </h6>
                        <div className="row g-2">
                            {host.campgrounds.map((campground) => (
                                <div key={campground._id} className="col-12">
                                    <Link
                                        to={`/campground/${campground._id}`}
                                        className="text-decoration-none"
                                    >
                                        <div className="d-flex align-items-center p-2 rounded hover-bg-light border">
                                            <img
                                                src={campground.image?.[0]?.url || 'https://via.placeholder.com/60x60?text=Camp'}
                                                alt={campground.name}
                                                className="rounded me-3"
                                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                            />
                                            <div className="flex-grow-1">
                                                <h6 className="mb-0 text-dark">{campground.name}</h6>
                                                <small className="text-muted">
                                                    <i className="bi bi-geo-alt me-1"></i>
                                                    {campground.location}
                                                </small>
                                            </div>
                                            <div className="text-end">
                                                <span className="badge bg-success">₹{campground.price}/night</span>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HostProfile;
