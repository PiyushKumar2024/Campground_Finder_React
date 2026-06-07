import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { logout, login } from '../redux/featuresRedux/userSlice';
import FavoriteButton from './FavoriteButton';

const UserProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user: currentUser } = useSelector(state => state.user);
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        bio: '',
        phoneNum: ''
    });
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:3000/user/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfile(res.data);
                setFormData({
                    username: res.data.username,
                    email: res.data.email,
                    bio: res.data.bio || '',
                    phoneNum: res.data.phoneNum || ''
                });
            } catch (e) {
                setError('Failed to fetch user profile');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const data = new FormData();
            data.append('username', formData.username);
            data.append('email', formData.email);
            data.append('bio', formData.bio);
            data.append('phoneNum', formData.phoneNum);
            data.append('role', profile.role);
            if (image) data.append('image', image);

            const res = await axios.post(`http://localhost:3000/user/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setProfile(res.data.user);

            // Update Redux and LocalStorage if editing own profile so changes (like image) are reflected immediately
            if (currentUser && currentUser.id === res.data.user.id) {
                const updatedUser = {
                    id: res.data.user.id,
                    username: res.data.user.username,
                    email: res.data.user.email,
                    image: res.data.user.image,
                    role: res.data.user.role
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                dispatch(login({ user: updatedUser, token }));
            }

            setIsEditing(false);
            setError('');
        } catch (e) {
            setError(e.response?.data?.message || 'Update failed');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch(logout());
        navigate('/');
    };

    if (loading) return <div className="container mt-5 text-center"><h2>Loading...</h2></div>;
    if (profile === null) return <div className="container mt-5 text-center"><h2>User not found</h2></div>;

    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow border-0 rounded-4">
                        <div className="card-body text-center p-5">
                            <img
                                src={profile.image?.url || 'https://via.placeholder.com/150'}
                                alt={profile.username}
                                className="rounded-circle mb-4 shadow-sm"
                                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                            />

                            {!isEditing ? (
                                <>
                                    <h2 className="fw-bold mb-1">{profile.username}</h2>
                                    <p className="text-muted mb-3">{profile.email}</p>
                                    <p className="badge bg-secondary text-capitalize mb-3">{profile.role}</p>
                                    <p className="lead mb-4">{profile.bio || 'No bio available'}</p>
                                    <div className="d-flex justify-content-center gap-4 mb-4 text-secondary">
                                        <span><i className="bi bi-telephone-fill me-2"></i>{profile.phoneNum || 'N/A'}</span>
                                        <span><i className="bi bi-calendar-event-fill me-2"></i>Joined: {new Date(profile.joined).toLocaleDateString()}</span>
                                    </div>

                                    {currentUser && currentUser.id === profile._id && (
                                        <div className="d-flex justify-content-center gap-2">
                                            <button className="btn btn-outline-primary px-4" onClick={() => setIsEditing(true)}>
                                                Edit Profile
                                            </button>
                                            <button className="btn btn-danger px-4" onClick={handleLogout}>Logout</button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <form onSubmit={handleSubmit} className="text-start">
                                    {error && <div className="alert alert-danger">{error}</div>}
                                    <div className="form-floating mb-3">
                                        <input type="text" className="form-control" id="username" name="username" value={formData.username} onChange={handleChange} placeholder="Username" />
                                        <label htmlFor="username">Username</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
                                        <label htmlFor="email">Email</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <textarea className="form-control" id="bio" name="bio" value={formData.bio} onChange={handleChange} placeholder="Bio" style={{ height: '100px' }}></textarea>
                                        <label htmlFor="bio">Bio</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input type="text" className="form-control" id="phoneNum" name="phoneNum" value={formData.phoneNum} onChange={handleChange} placeholder="Phone Number" />
                                        <label htmlFor="phoneNum">Phone Number</label>
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label">Profile Image</label>
                                        <input type="file" className="form-control" onChange={handleImageChange} accept="image/*" />
                                    </div>
                                    <div className="d-flex justify-content-end gap-2">
                                        <button type="button" className="btn btn-light" onClick={() => setIsEditing(false)}>Cancel</button>
                                        <button type="submit" className="btn btn-success">Save Changes</button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Campgrounds Section for Hosts */}
            {(profile.role === 'host' || profile.role === 'host+camper' || profile.role === 'admin') && (
                <div className="row justify-content-center mt-5">
                    <div className="col-md-10">
                        <h3 className="text-center mb-4 fw-bold text-secondary">Campgrounds Hosted by {profile.username}</h3>
                        {profile.campgrounds && profile.campgrounds.length > 0 ? (
                            <div className="row g-4">
                                {profile.campgrounds.map(camp => (
                                    <div key={camp._id} className="col-md-6 col-lg-4">
                                        <div className="card h-100 shadow-sm border-0">
                                            <img src={camp.image && camp.image.length > 0 ? camp.image[0].url : 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'} className="card-img-top" alt={camp.name} style={{ height: '200px', objectFit: 'cover' }} />
                                            <div className="card-body">
                                                <h5 className="card-title fw-bold">{camp.name}</h5>
                                                <p className="card-text text-muted text-truncate">{camp.description}</p>
                                                <Link to={`/campgrounds/${camp._id}`} className="btn btn-outline-success btn-sm stretched-link">View Campground</Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-muted py-4">
                                <p className="lead">No campgrounds hosted yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* My Bookings Section */}
            {currentUser && currentUser.id === profile._id && profile.bookings && (() => {
                const activeBookings = profile.bookings.filter(b => b.status !== 'cancelled');
                return (
                    <div className="row justify-content-center mt-5">
                        <div className="col-md-10">
                            <h3 className="text-center mb-4 fw-bold text-secondary">
                                <i className="bi bi-calendar-check me-2"></i>My Bookings
                            </h3>
                            {activeBookings.length > 0 ? (
                                <div className="row g-4">
                                    {activeBookings.map(booking => (
                                        <div key={booking._id} className="col-md-6 col-lg-4">
                                            <div className={`card h-100 shadow-sm border-0 ${booking.status === 'cancelled' ? 'opacity-50' : ''}`}>
                                                {booking.campground && booking.campground.image && booking.campground.image.length > 0 && (
                                                    <img
                                                        src={booking.campground.image[0].url}
                                                        className="card-img-top"
                                                        alt={booking.campground.name}
                                                        style={{ height: '150px', objectFit: 'cover' }}
                                                    />
                                                )}
                                                <div className="card-body">
                                                    <h5 className="card-title fw-bold">
                                                        {booking.campground ? booking.campground.name : 'Campground'}
                                                    </h5>
                                                    <div className="mb-2">
                                                        <span className={`badge ${
                                                            booking.status === 'paid' ? 'bg-primary' :
                                                            booking.status === 'confirmed' ? 'bg-success' :
                                                            booking.status === 'completed' ? 'bg-info' :
                                                            booking.status === 'cancelled' ? 'bg-danger' :
                                                            'bg-warning text-dark'
                                                        }`}>
                                                            {booking.status === 'paid' && <><i className="bi bi-credit-card me-1"></i>Paid</>}
                                                            {booking.status === 'confirmed' && <><i className="bi bi-check-circle me-1"></i>Confirmed</>}
                                                            {booking.status === 'completed' && <><i className="bi bi-check-all me-1"></i>Completed</>}
                                                            {booking.status === 'pending' && <><i className="bi bi-hourglass-split me-1"></i>Awaiting Payment</>}
                                                            {booking.status === 'cancelled' && <><i className="bi bi-x-circle me-1"></i>Cancelled</>}
                                                        </span>
                                                        {booking.status === 'cancelled' && booking.paymentIntentId && (
                                                            <span className="badge bg-light text-muted border ms-2">Refunded</span>
                                                        )}
                                                    </div>
                                                    <p className="card-text small mb-1">
                                                        <i className="bi bi-calendar me-2"></i>
                                                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                                                    </p>
                                                    <p className="card-text fw-bold text-success mb-2">
                                                        ${booking.totalPrice}
                                                    </p>
                                                    {booking.campground && (
                                                        <Link to={`/campgrounds/${booking.campground._id}`} className="btn btn-outline-primary btn-sm me-2">
                                                            View
                                                        </Link>
                                                    )}
                                                    {(booking.status === 'paid' || booking.status === 'confirmed') && (
                                                        <button
                                                            className="btn btn-outline-danger btn-sm"
                                                            onClick={async () => {
                                                                if (!window.confirm('Cancel this booking? A refund will be issued if payment was made.')) return;
                                                                try {
                                                                    const token = localStorage.getItem('token');
                                                                    await axios.delete(`http://localhost:3000/bookings/${booking._id}`, {
                                                                        headers: { Authorization: `Bearer ${token}` }
                                                                    });
                                                                    // Refresh profile
                                                                    const res = await axios.get(`http://localhost:3000/user/${id}`, {
                                                                        headers: { Authorization: `Bearer ${token}` }
                                                                    });
                                                                    setProfile(res.data);
                                                                } catch (e) {
                                                                    setError('Failed to cancel booking');
                                                                }
                                                            }}
                                                        >
                                                            Cancel & Refund
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-muted py-4">
                                    <p className="lead">No bookings yet.</p>
                                    <Link to="/campgrounds" className="btn btn-success">Explore Campgrounds</Link>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })()}

            {/* My Wishlist Section */}
            {currentUser && currentUser.id === profile._id && profile.favorites && (
                <div className="row justify-content-center mt-5">
                    <div className="col-md-10">
                        <h3 className="text-center mb-4 fw-bold text-secondary">
                            <i className="bi bi-heart-fill text-danger me-2"></i>My Wishlist
                        </h3>
                        {profile.favorites.length > 0 ? (
                            <div className="row g-4">
                                {profile.favorites.map(camp => (
                                    <div key={camp._id} className="col-md-6 col-lg-4">
                                        <div className="card h-100 shadow-sm border-0">
                                            <div className="position-relative">
                                                <img
                                                    src={camp.image && camp.image.length > 0 ? camp.image[0].url : 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'}
                                                    className="card-img-top"
                                                    alt={camp.name}
                                                    style={{ height: '200px', objectFit: 'cover' }}
                                                />
                                                <FavoriteButton campgroundId={camp._id} />
                                            </div>
                                            <div className="card-body d-flex flex-column">
                                                <h5 className="card-title fw-bold">{camp.name}</h5>
                                                <p className="card-text text-muted text-truncate">{camp.description}</p>
                                                <p className="card-text fw-bold text-success mb-3">${camp.price} / night</p>
                                                <Link to={`/campgrounds/${camp._id}`} className="btn btn-outline-success mt-auto w-100">View Campground</Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-muted py-4">
                                <p className="lead">Your wishlist is empty.</p>
                                <Link to="/campgrounds" className="btn btn-success">Explore Campgrounds</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
