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
        description: '',
        image: [],
        deleteImages:[],
        uploadImages: []
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
                    description: res.data.description,
                    image: res.data.image || [],
                    deleteImages:[],
                    uploadImages: []
                });
                setLoading(false);
            })
            .catch(err => {
                setError('Could not fetch campground data');
                setLoading(false);
            })
    }, [id]);

    const handleChange = (e) => {
        const {name,value,type,checked,files}=e.target;
        if(type=='checkbox'){
            if(checked){
                setFormData((prev)=>({...prev,['deleteImages']:[...prev.deleteImages,e.target.value]}));
            }else{
                setFormData((prev)=>{
                    return {...prev,['deleteImages']:prev.deleteImages.filter((img)=>img!=value)};
                })
            }
        }else if(type === 'file'){
            setFormData((prev)=>({...prev, uploadImages: files}));
        }else{
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        console.log(formData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const data = new FormData();
            data.append('name', formData.name);
            data.append('price', formData.price);
            data.append('location', formData.location);
            data.append('description', formData.description);
            
            if(formData.deleteImages){
                formData.deleteImages.forEach(img => data.append('deleteImages', img));
            }
            
            if(formData.uploadImages){
                for(let i=0; i<formData.uploadImages.length; i++){
                    data.append('image', formData.uploadImages[i]);
                }
            }

            await axios.patch(`http://localhost:3000/campgrounds/${id}`, data, {
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
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="image">Add More Images</label>
                                    <input className="form-control" type="file" id="image" name="image" multiple onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <p className="text-muted">Select images to delete</p>
                                </div>
                                <div className="row">
                                    {formData.image.map((image, i) => {
                                            return(<div className="col-6 mb-3" key={image.imageId}>
                                                <div className="position-relative">
                                                    <input type="checkbox" id={`image-${i}`} value={image.imageId} onChange={handleChange} checked={formData.deleteImages.includes(image.imageId)} style={{ display: 'none' }}/>
                                                        <label htmlFor={`image-${i}`} style={{ cursor: 'pointer', display: 'block' }}>
                                                            <img src={image.url} className="img-thumbnail w-100" alt="#" style={{ opacity: formData.deleteImages.includes(image.imageId) ? 0.5 : 1, border: formData.deleteImages.includes(image.imageId) ? '3px solid #198754' : '1px solid #dee2e6' }} />
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