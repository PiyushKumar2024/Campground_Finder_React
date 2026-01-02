import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../redux/featuresRedux/userSlice';
import '../css/Landing.css';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [error, setError] = useState(location.state?.message || '');
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    // Check if there is a 'from' path in the state, otherwise default to /campgrounds
    const from = location.state?.from?.pathname || '/campgrounds';

    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        console.log("Form submitted with data:", formData); // Debug: Check if function runs

        if (form.checkValidity() === true) {
            try {
                console.log("Sending request to server..."); // Debug: Check if axios starts
                const response = await axios.post('http://localhost:3000/user/login', formData);
                console.log("Server response:", response.data); // Debug: Check success
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                dispatch(login(response.data));
                //replaces the current entry in the history stack
                console.log("Navigating to:", from); // Debug: Check navigation
                navigate(from, { replace: true });
            } catch (err) {
                console.error("Login Error:", err); // Debug: Check for errors
                setError(err.response?.data?.message || err.message);
            }
        } else {
            event.stopPropagation();
        }
        form.classList.add('was-validated');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-lg-10 col-xl-9">
                    <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
                        <div className="row g-0">
                            {/* Image Section - Hidden on small screens */}
                            <div className="col-md-6 d-none d-md-block position-relative bg-dark">
                                <img 
                                    src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                                    alt="Camping Night" 
                                    className="w-100 h-100"
                                    style={{ objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
                                />
                                <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-25"></div>
                                <div className="position-absolute bottom-0 start-0 p-4 text-white">
                                    <h3 className="fw-bold">Welcome Back!</h3>
                                    <p className="mb-0">Plan your next escape into nature.</p>
                                </div>
                            </div>

                            {/* Form Section */}
                            <div className="col-md-6 bg-white">
                                <div className="card-body p-4 p-lg-5">
                                    <div className="d-flex align-items-center mb-4">
                                        <i className="bi bi-compass-fill text-success fs-2 me-2"></i>
                                        <h3 className="fw-bold m-0 text-secondary">YelpCamp</h3>
                                    </div>
                                    
                                    <h5 className="mb-4 text-muted">Login to your account</h5>

                                    {error && <div className="alert alert-danger d-flex align-items-center"><i className="bi bi-exclamation-circle-fill me-2"></i>{error}</div>}

                                    <form className="needs-validation" noValidate onSubmit={handleSubmit}>
                                        <div className="form-floating mb-3">
                                            <input type="text" id="username" name="username" required className="form-control" placeholder="Username" onChange={handleChange} value={formData.username} />
                                            <label htmlFor="username">Username</label>
                                            <div className="invalid-feedback">Username is required.</div>
                                        </div>
                                        <div className="form-floating mb-4">
                                            <input type="password" id="password" name="password" required className="form-control" placeholder="Password" onChange={handleChange} value={formData.password} />
                                            <label htmlFor="password">Password</label>
                                            <div className="invalid-feedback">Password is required.</div>
                                        </div>
                                        <div className="d-grid">
                                            <button className="btn btn-success btn-lg" type="submit">Login</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;