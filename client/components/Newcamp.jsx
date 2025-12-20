import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NewCampForm = () => {

    const [formData,setFormData]=useState({
        name:'',
        price:0,
        location:'',
        description:''
    });
    const [error,setError]=useState(null);
    const navigate=useNavigate();

    const handleSubmit =async(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
            form.classList.add('was-validated');
            return;
        }
        try{
            const token = localStorage.getItem('token');
            const response=await axios.post('http://localhost:3000/campgrounds', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate(`/campgrounds/${response.data.id}`);
        }catch(error){
            setError(error.response?.data?.message || error.message);
        }
    }

    const handleChange=(e)=>{
        const {name,value}=e.target;
        setFormData((prev)=>({...prev,[name]:value}));
    }

    return (
        <div className="container my-5">
            <div className="row">
                <div className="col-lg-6 mx-auto">
                    <div className="card shadow-sm">
                        <div className="card-body p-4 p-md-5">
                            <h1 className="card-title text-center mb-4">Add a New Campground</h1>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form action="/campgrounds" method="POST" className="needs-validation" noValidate onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="name">Name of campground</label>
                                    <input className="form-control" type="text" id="name" name="name" required onChange={handleChange} value={formData.name}/>
                                        <div className="invalid-feedback">Name is required.</div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="price">Price</label>
                                    <input className="form-control" type="number" id="price" name="price" required onChange={handleChange} value={formData.price}/>
                                        <div className="invalid-feedback">Price is required.</div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="location">Location</label>
                                    <input className="form-control" type="text" id="location" name="location" required onChange={handleChange} value={formData.location}/>
                                        <div className="invalid-feedback">Location is required.</div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="description">Description</label>
                                    <input className="form-control" type="text" id="description" name="description" required onChange={handleChange} value={formData.description}/>
                                        <div className="invalid-feedback">Description is required.</div>
                                </div>
                                <button className="btn btn-success w-100 py-2 mt-3" type="submit">Add</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewCampForm;