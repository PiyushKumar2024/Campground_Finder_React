import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateCamp = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        price: 0,
        location: '',
        description: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get(`http://localhost:3000/campgrounds/${id}`)
            .then(res => {
                setFormData({
                    name: res.data.name,
                    price: res.data.price,
                    location: res.data.location,
                    description: res.data.description
                });
                setLoading(false);
            })
            .catch(err => {
                setError('Could not fetch campground data');
                setLoading(false);
            })
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:3000/campgrounds/${id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate(`/campgrounds/${id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed');
        }
    };

    if (loading) return <h1>Loading...</h1>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <div className="card shadow">
                        <div className="card-body">
                            <h2 className="text-center mb-4">Edit Campground</h2>
                            <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="name">Name</label>
                                    <input className="form-control" type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="price">Price</label>
                                    <input className="form-control" type="number" id="price" name="price" value={formData.price} onChange={handleChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="location">Location</label>
                                    <input className="form-control" type="text" id="location" name="location" value={formData.location} onChange={handleChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="description">Description</label>
                                    <textarea className="form-control" id="description" name="description" value={formData.description} onChange={handleChange} required></textarea>
                                </div>
                                <button className="btn btn-info w-100">Update Campground</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateCamp;