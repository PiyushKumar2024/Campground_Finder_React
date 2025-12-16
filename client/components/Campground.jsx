import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import '../public/css/StarRating.css';
import axios from "axios";
import Error from "./Error";

const Campground = ({ camp, currentUser }) => {
    const {id}=useParams();
    const [camp,setCamp]=useEffect();

    axios.get(`/campgrounds/${id}`)
        .then(res=>{
            setCamp(res);
        })
        .catch(err=>{
            return <Error err={err}/>
        })

        
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
                                <form className="d-inline" action={`/campgrounds/${camp._id}?_method=DELETE`} method="POST">
                                    <button className="btn btn-danger">Delete</button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>

                <div className="col-lg-6">
                    {currentUser && (
                        <div className="card shadow-sm mb-4">
                            <div className="card-body">
                                <h4 className="card-title">Leave a Review</h4>
                                <form action={`/campgrounds/${camp.id}/reviews`} method="POST" className="needs-validation" noValidate>
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
                                    <form action={`/campgrounds/${camp._id}/reviews/${review._id}?_method=DELETE`} method="POST">
                                        <button className="btn btn-sm btn-danger">Delete</button>
                                    </form>
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
