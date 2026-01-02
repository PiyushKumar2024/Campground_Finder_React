import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { logout, login } from '../redux/featuresRedux/userSlice';

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
    if (profile===null) return <div className="container mt-5 text-center"><h2>User not found</h2></div>;

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
                                        <textarea className="form-control" id="bio" name="bio" value={formData.bio} onChange={handleChange} placeholder="Bio" style={{height: '100px'}}></textarea>
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
            {profile.role === 'host' && (
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
        </div>
    );
};

export default UserProfile;
