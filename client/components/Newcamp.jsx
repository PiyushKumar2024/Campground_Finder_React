import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NewCampForm = () => {

    const [formData,setFormData]=useState({
        name:'',
        price:0,
        location:'',
        description:'',
        image:[]
    });
    const [error,setError]=useState(null);
    const [loading,setLoading]=useState(false);
    const navigate=useNavigate();

    const handleSubmit =async(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
            form.classList.add('was-validated');
            return;
        }

        //multiple submission
        if(loading) return;

        setLoading(true);
        setError(null);

        // We need to use FormData because we are sending a file (binary data).
        // Standard JSON (application/json) cannot handle file uploads.
        const data = new FormData();
        data.append('name', formData.name);
        data.append('price', formData.price);
        data.append('location', formData.location);
        data.append('description', formData.description);
        // Loop through the FileList and append each file.
        // We use the same key 'image' for all files, which allows the backend (Multer)
        // to receive them as an array of files.
        for (let i = 0; i < formData.image.length; i++) {
            data.append('image', formData.image[i]);
        }

        try{
            const token = localStorage.getItem('token');
            const response=await axios.post('http://localhost:3000/campgrounds', data, {
                headers: { Authorization: `Bearer ${token}` },
                //timeout for the request
                timeout:30000,
                onUploadProgress:(progressEvent)=>{
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    console.log('Upload progress:', percentCompleted + '%');
                }
            });
            navigate(`/campgrounds/${response.data._id}`);
        }catch(error){
            setError(error.response?.data?.message || error.message);
        }finally{
            setLoading(false);
        }
    }

    const handleChange=async (e)=>{
        if(e.target.type==='file'){
            let imageData=e.target.files;
            if(imageData.length>5){
                alert('NO more than 5 imags can be selected');
            }
            const dt=new DataTransfer();
            for(let i=0;i<imageData.length;i++){
                if(dt.items.length>=5) break;
                const image=e.target.files[i];
                if(image.size<5242880)dt.items.add(image);
                else alert('No file should exceed the 5MB threshold');
            }
            e.target.files=dt.files;
            //the browser's visual representation (the text inside the file input) 
            // doesn't always clear automatically if the resulting list is empty 
            if (e.target.files.length === 0) {
                e.target.value = '';
            }
            imageData=e.target.files;
            setFormData((prev)=>({...prev,[e.target.name]:imageData}));
        }else{
        const {name,value}=e.target;
        setFormData((prev)=>({...prev,[name]:value}));
        }
    }

    return (
        <div className="container my-5">
            <div className="row">
                <div className="col-lg-6 mx-auto">
                    <div className="card shadow-sm">
                        <div className="card-body p-4 p-md-5">
                            <h1 className="card-title text-center mb-4">Add a New Campground</h1>
                            {error && <div className="alert alert-danger">{error}</div>}

                            {/* Form element with 'needs-validation' for Bootstrap validation styles. 
                                'noValidate' prevents default browser validation bubbles so we can use custom styles. */}
                            <form className="needs-validation" noValidate onSubmit={handleSubmit}>

                                {/* Name Input Section */}
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="name">Name of campground</label>

                                    {/* Controlled input linked to formData.name. 'required' triggers validation error if empty. */}
                                    <input className="form-control" type="text" id="name" name="name" required onChange={handleChange} value={formData.name}/>

                                        {/* Displayed only when form is submitted and input is invalid */}
                                        <div className="invalid-feedback">Name is required.</div>
                                </div>

                                {/* Price Input Section */}
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="price">Price</label>
                                    <input className="form-control" type="number" id="price" name="price" required onChange={handleChange} value={formData.price}/>
                                        <div className="invalid-feedback">Price is required.</div>
                                </div>

                                {/* Location Input Section */}
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="location">Location</label>
                                    <input className="form-control" type="text" id="location" name="location" required onChange={handleChange} value={formData.location}/>
                                        <div className="invalid-feedback">Location is required.</div>
                                </div>

                                {/* Description Input Section */}
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="description">Description</label>
                                    <input className="form-control" type="text" id="description" name="description" required onChange={handleChange} value={formData.description}/>
                                        <div className="invalid-feedback">Description is required.</div>
                                </div>

                                {/* File Upload Section */}
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="image">Upload Image:</label>
                                    {/* 'multiple' allows selecting multiple files. 'accept' restricts selection to image types. */}
                                    <input className="form-control" type="file" id="image" name="image" accept="image/*" multiple required onChange={handleChange}/>
                                        <div className="invalid-feedback">Atleast one image is required.</div>
                                </div>
                                
                                {/* Submit Button: Disabled during loading state to prevent duplicate submissions */}
                                <button className="btn btn-success w-100 py-2 mt-3 Uploading" type="submit" disabled={loading}>{loading?'Uploading':'Add'}</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewCampForm;