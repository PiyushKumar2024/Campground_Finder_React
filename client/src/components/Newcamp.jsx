import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { amenityOptions } from "../config/icons";

const NewCampForm = () => {

    const [formData, setFormData] = useState({
        name: '',
        price: 0,
        location: '',
        description: '',
        authorDesc:'',
        checkin: '',
        checkout: '',
        camprules: [''],
        image: [],
        amenity: []
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
            form.classList.add('was-validated');
            return;
        }

        //multiple submission
        if (loading) return;

        setLoading(true);
        setError(null);

        // We need to use FormData because we are sending a file (binary data).
        // Standard JSON (application/json) cannot handle file uploads.
        const data = new FormData();
        data.append('name', formData.name);
        data.append('price', formData.price);
        data.append('location', formData.location);
        data.append('description', formData.description);
        data.append('authorDesc',formData.authorDesc);
        data.append('checkin', formData.checkin);
        data.append('checkout', formData.checkout);
        for (let i = 0; i < formData.camprules.length; i++) {
            data.append('camprules', formData.camprules[i]);
        }
        // Loop through the FileList and append each file.
        // We use the same key 'image' for all files, which allows the backend (Multer)
        // to receive them as an array of files.
        for (let i = 0; i < formData.amenity.length; i++) {
            data.append('amenity', formData.amenity[i]);
        }
        for (let i = 0; i < formData.image.length; i++) {
            data.append('image', formData.image[i]);
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:3000/campgrounds', data, {
                headers: { Authorization: `Bearer ${token}` },
                //timeout for the request
                timeout: 30000,
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    console.log('Upload progress:', percentCompleted + '%');
                }
            });
            navigate(`/campgrounds/${response.data._id}`);
        } catch (error) {
            setError(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (e) => {
        if (e.target.type === 'file') {
            let imageData = e.target.files;
            if (imageData.length > 5) {
                alert('NO more than 5 imags can be selected');
            }
            const dt = new DataTransfer();
            for (let i = 0; i < imageData.length; i++) {
                if (dt.items.length >= 5) break;
                const image = e.target.files[i];
                if (image.size < 5242880) dt.items.add(image);
                else alert('No file should exceed the 5MB threshold');
            }
            e.target.files = dt.files;
            //the browser's visual representation (the text inside the file input) 
            // doesn't always clear automatically if the resulting list is empty 
            if (e.target.files.length === 0) {
                e.target.value = '';
            }
            imageData = e.target.files;
            setFormData((prev) => ({ ...prev, [e.target.name]: imageData }));
        } else {
            const { name, value } = e.target;
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    }

    const handleAmenity = (e) => {
        if (formData.amenity.includes(e)) {
            const temp = formData.amenity.filter(value => value != e);
            setFormData((prev) => {
                return { ...prev, ['amenity']: temp };
            })
        }
        else {
            //const temp = formData.amenity, you are not creating a copy of the array. 
            // You are creating a reference that points to the exact same array in memory 
            // as your state.
            setFormData((prev) => ({ ...prev, amenity: [...prev.amenity, e] }));
        }
    }

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

    console.log(formData)

    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-lg-10 col-xl-9">
                    <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
                        <div className="row g-0">
                            {/* Image Section - Hidden on small screens */}
                            <div className="col-md-6 d-none d-md-block position-relative bg-dark">
                                <img
                                    src="https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                                    alt="Campground"
                                    className="w-100 h-100"
                                    style={{ objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
                                />
                                <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-25"></div>
                                <div className="position-absolute bottom-0 start-0 p-4 text-white">
                                    <h3 className="fw-bold">Share Your Spot</h3>
                                    <p className="mb-0">Add a new campground to our growing collection.</p>
                                </div>
                            </div>

                            {/* Form Section */}
                            <div className="col-md-6 bg-white">
                                <div className="card-body p-4 p-lg-5">
                                    <div className="d-flex align-items-center mb-4">
                                        <i className="bi bi-compass-fill text-success fs-2 me-2"></i>
                                        <h3 className="fw-bold m-0 text-secondary">YelpCamp</h3>
                                    </div>

                                    <h5 className="mb-4 text-muted">Add a New Campground</h5>

                                    {error && <div className="alert alert-danger d-flex align-items-center"><i className="bi bi-exclamation-circle-fill me-2"></i>{error}</div>}

                                    <form className="needs-validation" noValidate onSubmit={handleSubmit}>
                                        <div className="form-floating mb-3">
                                            <input className="form-control" type="text" id="name" name="name" placeholder="Campground Name" required onChange={handleChange} value={formData.name} />
                                            <label htmlFor="name">Name of campground</label>
                                            <div className="invalid-feedback">Name is required.</div>
                                        </div>

                                        <div className="form-floating mb-3">
                                            <input className="form-control" type="number" id="price" name="price" placeholder="Price" required onChange={handleChange} value={formData.price} />
                                            <label htmlFor="price">Price</label>
                                            <div className="invalid-feedback">Price is required.</div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-floating mb-3">
                                                    <input className="form-control" type="time" id="checkin" name="checkin" placeholder="Check-in Time" required onChange={handleChange} value={formData.checkin} />
                                                    <label htmlFor="checkin">Check-in Time</label>
                                                    <div className="invalid-feedback">Check-in time is required.</div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-floating mb-3">
                                                    <input className="form-control" type="time" id="checkout" name="checkout" placeholder="Check-out Time" required onChange={handleChange} value={formData.checkout} />
                                                    <label htmlFor="checkout">Check-out Time</label>
                                                    <div className="invalid-feedback">Check-out time is required.</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-floating mb-3">
                                            <input className="form-control" type="text" id="location" name="location" placeholder="Location" required onChange={handleChange} value={formData.location} />
                                            <label htmlFor="location">Location</label>
                                            <div className="invalid-feedback">Location is required.</div>
                                        </div>

                                        <div className="form-floating mb-3">
                                            <input className="form-control" type="text" id="description" name="description" placeholder="Description" required onChange={handleChange} value={formData.description} />
                                            <label htmlFor="description">Description of camp:</label>
                                            <div className="invalid-feedback">Description is required.</div>
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

                                        <div className="mb-4">
                                            <label className="form-label text-muted small" htmlFor="image">Upload Images</label>
                                            <input className="form-control" type="file" id="image" name="image" accept="image/*" multiple required onChange={handleChange} />
                                            <div className="invalid-feedback">At least one image is required.</div>
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

                                        <div className="d-grid">
                                            <button className="btn btn-success btn-lg Uploading" type="submit" disabled={loading}>{loading ? 'Uploading...' : 'Add Campground'}</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewCampForm;