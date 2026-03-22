import '../css/Register.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { login } from '../redux/featuresRedux/userSlice'

const Register = () => {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        bio: '',
        phoneNum: '',
        role: 'camper'
    })
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');//for holding error message from the server
    const dispatch = useDispatch();

    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === true) {
            try {
                const data = new FormData();
                for (const key in formData) {
                    data.append(key, formData[key]);
                }
                if (image) {
                    data.append('image', image);
                }
                const response = await axios.post('http://localhost:3000/user/register', data);
                localStorage.setItem('token', response.data.token); // Keep token for auth
                localStorage.setItem('user', JSON.stringify(response.data.user)); // Store only the user object
                dispatch(login(response.data));
                navigate('/campgrounds');
            } catch (err) {
                //check how the error obj/json looks
                setError(err.response?.data?.message || err.message);
            }
        } else {
            event.stopPropagation();
        }
        form.classList.add('was-validated');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            return { ...prev, [name]: value };
        })
    }

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    }

    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-lg-10 col-xl-9">
                    <div className="card shadow border-0 rounded-4 overflow-hidden">
                        <div className="row g-0">
                            {/* Form Section */}
                            <div className="col-md-6 bg-white order-2 order-md-1">
                                <div className="card-body p-5">
                                    <div className="d-flex align-items-center mb-5">
                                        <div className="bg-success bg-opacity-10 p-2 rounded-3 me-3">
                                            <i className="bi bi-compass-fill text-success fs-3"></i>
                                        </div>
                                        <h3 className="fw-bold m-0 text-dark">YelpCamp</h3>
                                    </div>

                                    <h4 className="fw-bold mb-3">Create an account</h4>
                                    <p className="text-muted mb-4">Join our community of outdoor enthusiasts</p>

                                    {error && <div className="alert alert-danger d-flex align-items-center mb-4"><i className="bi bi-exclamation-circle-fill me-2"></i>{error}</div>}

                                    <form className="needs-validation" noValidate onSubmit={handleSubmit}>
                                        <div className="form-floating mb-3">
                                            <input type="text" id="username" name="username" required className="form-control bg-light border-0" placeholder="Username" onChange={handleChange} value={formData.username} />
                                            <label htmlFor="username">Username</label>
                                            <div className="invalid-feedback">Username is required.</div>
                                        </div>
                                        <div className="form-floating mb-3">
                                            <input type="email" id="email" name="email" required className="form-control bg-light border-0" placeholder="name@example.com" onChange={handleChange} value={formData.email} />
                                            <label htmlFor="email">Email address</label>
                                            <div className="invalid-feedback">A valid email is required.</div>
                                        </div>
                                        <div className="form-floating mb-4">
                                            <input type="password" id="password" name="password" required className="form-control bg-light border-0" placeholder="Password" onChange={handleChange} value={formData.password} />
                                            <label htmlFor="password">Password</label>
                                            <div className="invalid-feedback">Password is required.</div>
                                        </div>
                                        <div className="form-floating mb-3">
                                            <textarea id="bio" name="bio" className="form-control bg-light border-0" placeholder="Bio" style={{ height: '100px' }} onChange={handleChange} value={formData.bio}></textarea>
                                            <label htmlFor="bio">Bio</label>
                                        </div>
                                        <div className="form-floating mb-3">
                                            <input type="text" id="phoneNum" name="phoneNum" className="form-control bg-light border-0" placeholder="Phone Number" pattern="[0-9]{10}" onChange={handleChange} value={formData.phoneNum} />
                                            <label htmlFor="phoneNum">Phone Number</label>
                                            <div className="invalid-feedback">Please enter a valid 10-digit phone number.</div>
                                        </div>
                                        <div className="form-floating mb-4">
                                            <select className="form-select bg-light border-0" id="role" name="role" value={formData.role} onChange={handleChange}>
                                                <option value="camper">Camper</option>
                                                <option value="host">Host</option>
                                                <option value="host+camper">Host + Camper</option>
                                            </select>
                                            <label htmlFor="role">Select Role</label>
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="image" className="form-label text-muted small fw-bold text-uppercase ls-1">Profile Image</label>
                                            <input type="file" className="form-control bg-light border-0" id="image" name="image" onChange={handleImageChange} accept="image/*" />
                                        </div>
                                        <div className="d-grid mb-4">
                                            <button className="btn btn-success btn-lg py-3 fw-semibold" type="submit">Create Account</button>
                                        </div>
                                        <div className="text-center text-muted">
                                            Already have an account? <a href="/user/login" className="text-success fw-semibold text-decoration-none">Sign In</a>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/* Image Section - Hidden on small screens */}
                            <div className="col-md-6 d-none d-md-block position-relative bg-dark order-1 order-md-2">
                                <img
                                    src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                                    alt="Camping Day"
                                    className="w-100 h-100"
                                    style={{ objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
                                />
                                <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>
                                <div className="position-absolute bottom-0 start-0 p-5 text-white">
                                    <h3 className="fw-bold display-6 mb-2">Join the Adventure</h3>
                                    <p className="mb-0 fs-5 opacity-75">Create an account and start sharing your camping experiences.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register;
