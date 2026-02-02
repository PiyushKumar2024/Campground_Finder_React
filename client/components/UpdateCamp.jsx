import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { amenityOptions } from "../config/icons";

const UpdateCamp = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        price: 0,
        location: '',
        description: '',
        authorDesc: '',
        checkin: '',
        checkout: '',
        camprules: [],
        image: [],
        deleteImages: [],
        uploadImages: [],
        amenity: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:3000/campgrounds/${id}`)
            .then(res => {
                setFormData({
                    name: res.data.name,
                    price: res.data.price,
                    location: res.data.location,
                    description: res.data.description,
                    authorDesc: res.data.authorDesc,
                    checkin: res.data.checkin || '',
                    checkout: res.data.checkout || '',
                    camprules: (res.data.camprules && res.data.camprules.length > 0) ? res.data.camprules : [''],
                    image: res.data.image || [],
                    deleteImages: [],
                    uploadImages: [],
                    amenity: res.data.amenity
                });
                setLoading(false);
            })
            .catch(err => {
                setError('Could not fetch campground data');
                setLoading(false);
            })
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type == 'checkbox') {
            if (checked) {
                setFormData((prev) => ({ ...prev, ['deleteImages']: [...prev.deleteImages, e.target.value] }));
            } else {
                setFormData((prev) => {
                    return { ...prev, ['deleteImages']: prev.deleteImages.filter((img) => img != value) };
                })
            }
        } else if (type === 'file') {
            const dt = new DataTransfer();
            const remainingSlots = 5 - (formData.image.length - formData.deleteImages.length);
            if (files.length > remainingSlots) alert(`No more than 5 images allowed in total. You can add ${remainingSlots} more.`);

            for (let i = 0; i < files.length; i++) {
                if (dt.items.length >= remainingSlots) break;
                const file = files[i];
                if (file.size < 5242880) dt.items.add(file);
                else alert('No file should exceed the 5MB threshold');
            }
            e.target.files = dt.files;
            if (e.target.files.length === 0) e.target.value = '';
            setFormData((prev) => ({ ...prev, uploadImages: e.target.files }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        console.log(formData);
    };

    const handleAmenity = (e) => {
        if (formData.amenity.includes(e)) {
            const temp = formData.amenity.filter(value => value != e);
            setFormData((prev) => {
                return { ...prev, ['amenity']: temp };
            })
        }
        else {
            setFormData((prev) => ({ ...prev, amenity: [...prev.amenity, e] }));
        }
    };

    const handleRuleChange = (e, index) => {
        const { value } = e.target;
        const list = [...formData.camprules];
        list[index] = value;
        setFormData((prev) => ({ ...prev, camprules: list }));
    };

    const addRule = () => {
        setFormData((prev) => ({ ...prev, camprules: [...prev.camprules, ''] }));
    };

    const removeRule = (index) => {
        const list = [...formData.camprules];
        list.splice(index, 1);
        setFormData((prev) => ({ ...prev, camprules: list }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isUpdating) return;
        setIsUpdating(true);

        try {
            const token = localStorage.getItem('token');
            const data = new FormData();
            data.append('name', formData.name);
            data.append('price', formData.price);
            data.append('location', formData.location);
            data.append('description', formData.description);
            data.append('authorDesc',formData.authorDesc);
            data.append('checkin', formData.checkin);
            data.append('checkout', formData.checkout);
            if (formData.camprules) {
                formData.camprules.forEach(rule => data.append('camprules', rule));
            }
            for (let i = 0; i < formData.amenity.length; i++) {
                data.append('amenity', formData.amenity[i]);
            }

            if (formData.deleteImages) {
                formData.deleteImages.forEach(img => data.append('deleteImages', img));
            }

            if (formData.uploadImages) {
                for (let i = 0; i < formData.uploadImages.length; i++) {
                    data.append('image', formData.uploadImages[i]);
                }
            }

            await axios.patch(`http://localhost:3000/campgrounds/${id}`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate(`/campgrounds/${id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed');
            setIsUpdating(false);
        }
    };

    if (loading) return <h1>Loading...</h1>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        // Container with top margin
        <div className="container mt-5 mx-auto">
            {/* Bootstrap Row for grid layout */}
            <div className="row">
                {/* Centered column taking half width on medium screens */}

                <div className="col-md-6 offset-md-3">
                    {/* Card component for containment and shadow */}
                    <div className="card shadow">
                        <div className="card-body">
                            <h2 className="text-center mb-4">Edit Campground</h2>

                            {/* Form with validation disabled for custom handling */}
                            <form onSubmit={handleSubmit} className="needs-validation" noValidate>

                                {/* Name Input */}
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="name">Name</label>
                                    <input className="form-control" type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                                </div>

                                {/* Price Input */}
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="price">Price</label>
                                    <input className="form-control" type="number" id="price" name="price" value={formData.price} onChange={handleChange} required />
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label" htmlFor="checkin">Check-in Time</label>
                                            <input className="form-control" type="time" id="checkin" name="checkin" value={formData.checkin} onChange={handleChange} required />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label" htmlFor="checkout">Check-out Time</label>
                                            <input className="form-control" type="time" id="checkout" name="checkout" value={formData.checkout} onChange={handleChange} required />
                                        </div>
                                    </div>
                                </div>

                                {/* Location Input */}
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="location">Location</label>
                                    <input className="form-control" type="text" id="location" name="location" value={formData.location} onChange={handleChange} required />
                                </div>

                                {/* Description Textarea */}
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="description">Description</label>
                                    <textarea className="form-control" id="description" name="description" value={formData.description} onChange={handleChange} required></textarea>
                                </div>

                                <div className="form-floating mb-3">
                                    <input className="form-control" type="text" id="authorDesc" name="authorDesc" placeholder="Author_desc" required onChange={handleChange} value={formData.authorDesc} />
                                    <label htmlFor="authorDesc">Description of author:</label>
                                    <div className="invalid-feedback">Author description is required.</div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Camp Rules</label>
                                    {formData.camprules.map((rule, index) => (
                                        <div className="input-group mb-2" key={index}>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder={`Rule ${index + 1}`}
                                                value={rule}
                                                onChange={(e) => handleRuleChange(e, index)}
                                                required
                                            />
                                            {formData.camprules.length > 1 && (
                                                <button className="btn btn-outline-danger" type="button" onClick={() => removeRule(index)}>
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={addRule}>
                                        <i className="bi bi-plus-circle me-1"></i> Add Rule
                                    </button>
                                </div>

                                {/* File Upload Input */}
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="image">Add More Images</label>
                                    <input className="form-control" type="file" id="image" name="image" accept="image/*" multiple onChange={handleChange} />
                                </div>

                                {/* Image Deletion Section */}
                                <div className="mb-3">
                                    <p className="text-muted">Select images to delete</p>
                                </div>
                                <div className="row">
                                    {formData.image.map((image, i) => {
                                        return (<div className="col-6 mb-3" key={image.imageId}>
                                            <div className="position-relative">
                                                {/* Hidden checkbox for selection logic */}
                                                <input type="checkbox" id={`image-${i}`} value={image.imageId} onChange={handleChange} checked={formData.deleteImages.includes(image.imageId)} style={{ display: 'none' }} />
                                                {/* Label acts as the clickable area for the image */}
                                                <label htmlFor={`image-${i}`} style={{ cursor: 'pointer', display: 'block' }}>
                                                    {/* Image thumbnail with conditional styling for selection state */}
                                                    <img src={image.url} className="img-thumbnail w-100" alt="#" style={{ opacity: formData.deleteImages.includes(image.imageId) ? 0.5 : 1, border: formData.deleteImages.includes(image.imageId) ? '3px solid #198754' : '1px solid #dee2e6' }} />
                                                    {/* Checkmark overlay when selected */}
                                                    {formData.deleteImages.includes(image.imageId) && (
                                                        <div className="position-absolute top-50 start-50 translate-middle bg-success text-white rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                                            <i className="bi bi-check-lg"></i>
                                                        </div>
                                                    )}
                                                </label>
                                            </div>
                                        </div>)
                                    })}
                                </div>

                                <div className="mb-3">
                                    {amenityOptions.map(cat => {
                                        return (
                                            <div key={cat.name}>
                                                <h6>{cat.name}</h6>
                                                {cat.amenities.map(element => {

                                                    const selected = formData.amenity.includes(element.value);
                                                    return (
                                                        <div key={element.value} style={{ height: 'fit-content', width: 'fit-content' }} onClick={() => handleAmenity(element.value)}>
                                                            {selected ? element.activeIcon : element.passiveIcon}
                                                            <label htmlFor={element.value} className={selected ? 'text-black' : 'text-gray-400'}>{element.label}</label>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )
                                    })}
                                </div>
                                <button className="btn btn-info w-100" disabled={isUpdating}>{isUpdating ? 'Updating...' : 'Update Campground'}</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateCamp;