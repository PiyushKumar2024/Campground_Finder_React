import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const HostProfile = ({ user, camp }) => {
    const [host, setHost] = useState(user);

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
                    <Link to={`/user/${host._id}`} className="btn btn-sm btn-outline-primary">
                        View Profile
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HostProfile;
