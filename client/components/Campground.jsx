import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import '../css/StarRating.css';
import axios from "axios";
import Error from "./Error";
import { useSelector } from "react-redux";

const Campground = () => {
    const { id } = useParams();
    const [camp, setCamp] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setloading] = useState(true);
    const { user: currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();

    //cant use async in use effect
    useEffect(() => {
        if (!id || id === 'undefined') {
            setError({ message: 'Invalid Campground ID', status: 400 });
            setloading(false);
            return;
        }
        try {
            axios.get(`http://localhost:3000/campgrounds/${id}`)
                .then((response) => {
                    setCamp(response.data);
                    setloading(false);
                })
                .catch((e) => {
                    setError(e);
                    setloading(false);
                })
        } catch (error) {
            setError(error);
            setloading(false);
        }
    }, [id])

    const handleDeleteCamp = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3000/campgrounds/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/campgrounds');
        } catch (error) {
            setError(error);
        }
    }

    const handleDeleteReview=async(rid)=>{
        try{
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3000/campgrounds/${id}/reviews/${rid}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const res = await axios.get(`http://localhost:3000/campgrounds/${id}`);
            setCamp(res.data);
        }catch(e){
            setError(e);
        }
    }

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {//if validity fails
            e.stopPropagation();//prevent bubbling
            form.classList.add('was-validated');//adding bs class to show the valid/invalid field styles
            return;
        }
        const rating = form['review[rating]'].value;
        const body = form['review[body]'].value;

        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:3000/campgrounds/${id}/reviews`, 
                { review: { rating, body } },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const res = await axios.get(`http://localhost:3000/campgrounds/${id}`);
            setCamp(res.data);
            form.reset();
            form.classList.remove('was-validated');
        } catch (e) {
            setError(e);
        }
    }

    if (loading) return <h1>Loading...</h1>;
    if (error) return <Error err={error} />;


    console.log(camp);
    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-lg-6 mb-4">
                    <div className="card shadow-sm h-100">
                        <img src={camp.image} className="card-img-top" alt="campground image" style={{ aspectRatio: '16/9', objectFit: 'cover' }} />
                        <div className="card-body">
                            <h2 className="card-title">{camp.name}</h2>
                            <p className="card-text">{camp.description}</p>
                        </div>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item text-muted">{camp.location}</li>
                            <li className="list-group-item">${camp.price} per night</li>
                            <li className="list-group-item">Created by:{camp.author.username}</li>
                        </ul>
                        {currentUser && currentUser.username === camp.author.username && (
                            <div className="card-body">
                                <Link to={`/campgrounds/edit/${camp._id}`} className="btn btn-info">Edit</Link>
                                <button className="btn btn-danger" onClick={handleDeleteCamp}>Delete</button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="col-lg-6">
                    {currentUser && (
                        <div className="card shadow-sm mb-4">
                            <div className="card-body">
                                <h4 className="card-title">Leave a Review</h4>
                                <form onSubmit={handleReviewSubmit} className="needs-validation" noValidate>
                                    <fieldset className="starability-growRotate">
                                        <input type="radio" id="no-rate" className="input-no-rate" name="review[rating]" value="1" defaultChecked aria-label="No rating." />
                                        <input type="radio" id="first-rate1" name="review[rating]" value="1" />
                                        <label htmlFor="first-rate1" title="Terrible">1 star</label>
                                        <input type="radio" id="first-rate2" name="review[rating]" value="2" />
                                        <label htmlFor="first-rate2" title="Not good">2 stars</label>
                                        <input type="radio" id="first-rate3" name="review[rating]" value="3" />
                                        <label htmlFor="first-rate3" title="Average">3 stars</label>
                                        <input type="radio" id="first-rate4" name="review[rating]" value="4" />
                                        <label htmlFor="first-rate4" title="Very good">4 stars</label>
                                        <input type="radio" id="first-rate5" name="review[rating]" value="5" />
                                        <label htmlFor="first-rate5" title="Amazing">5 stars</label>
                                    </fieldset>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="review[body]">Review</label>
                                        <textarea className="form-control" name="review[body]" id="review[body]" rows="3" required></textarea>
                                        <div className="invalid-feedback">Review text is required.</div>
                                    </div>
                                    <button className="btn btn-success">Submit Review</button>
                                </form>
                            </div>
                        </div>
                    )}

                    {camp.reviews.map(review => (
                        <div className="card mb-3" key={review._id}>
                            <div className="card-body">
                                <h5>Rating</h5>
                                <p className="starability-result" data-rating={review.rating}>
                                    Rated: {review.rating} stars
                                </p>
                                <p className="card-text">{review.body}</p>
                                <p className="card-text">By:{review.author.username}</p>
                                {currentUser && currentUser.username === review.author.username && (
                                    <button className="btn btn-sm btn-danger" onClick={()=>handleDeleteReview(review._id)}>Delete</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Campground;
