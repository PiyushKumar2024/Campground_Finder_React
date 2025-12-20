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
                const response = await axios.post('http://localhost:3000/login', formData);
                console.log("Server response:", response.data); // Debug: Check success
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data));
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
            <div className="row">
                <div className="col-lg-6 mx-auto">
                    <form className="needs-validation bg-white p-4 p-md-5 rounded-3 shadow-sm" noValidate onSubmit={handleSubmit}>
                        <h1 className="text-center mb-4 text-muted">Login</h1>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <div className="form-group mb-3">
                            <label htmlFor="username">Enter username:</label>
                            <input type="text" id="username" name="username" required className="form-control" onChange={handleChange} value={formData.username} />
                            <div className="invalid-feedback">Username is required.</div>
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="password">Enter password:</label>
                            <input type="password" id="password" name="password" required className="form-control" onChange={handleChange} value={formData.password} />
                            <div className="invalid-feedback">Password is required.</div>
                        </div>
                        <button className="btn btn-success" type="submit">Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;