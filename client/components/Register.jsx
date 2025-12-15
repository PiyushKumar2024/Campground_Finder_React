import '../public/css/Register.css'
import { useState } from 'react'

const Register = () => {

    const [formData,setFormData]=useState({
        username:'',
        email:'',
        password:''
    })

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        form.classList.add('was-validated');
    };

    const handleChange=(e)=>{
        const{name,value}=e.target;
        setFormData((prev)=>{
            return {...prev,[name]:value};
        })
    }

    return (
        <div className="container my-5">
            <div className="row">
                <div className="col-lg-6 mx-auto">
                    <form action="/register" method="POST" className="needs-validation bg-white p-4 p-md-5 rounded-3 shadow-sm" noValidate onSubmit={handleSubmit}>
                        <h1 className="text-center mb-4 text-muted">Register</h1>
                        <div className="form-group mb-3">
                            <label htmlFor="username">Enter username:</label>
                            <input type="text" id="username" name="username" required className="form-control" onChange={handleChange} value={formData.username} />
                            <div className="invalid-feedback">Username is required.</div>
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="email">Enter mail:</label>
                            <input type="email" id="email" name="email" required className="form-control" onChange={handleChange} value={formData.email} />
                            <div className="invalid-feedback">A valid email is required.</div>
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="password">Enter password:</label>
                            <input type="password" id="password" name="password" required className="form-control" onChange={handleChange} value={formData.password} />
                            <div className="invalid-feedback">Password is required.</div>
                        </div>
                        <button className="btn btn-success" type="submit">Register</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register;
