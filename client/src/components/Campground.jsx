import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import '../css/StarRating.css';
import '../css/Campground.css';
import axios from "axios";
import Error from "./Error";
import { useSelector } from "react-redux";
import { amenityOptions } from "../config/icons";
import HostProfile from "./hostprofile";
import WeatherWidget from "./WeatherWidget";
import BookingCalendar from "./BookingCalendar";
import FavoriteButton from "./FavoriteButton";
import CampgroundMap from "./CampgroundMap";
import CampgroundReviews from "./CampgroundReviews";

const Campground = () => {
    const { id } = useParams();
    const [camp, setCamp] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setloading] = useState(true);
    const { user: currentUser } = useSelector((state) => state.user);

    const navigate = useNavigate();

    useEffect(() => {
        if (!id || id === 'undefined') {
            setError({ message: 'Invalid Campground ID', status: 400 });
            setloading(false);
            return;
        }
        try {
            axios.get(`/campgrounds/${id}`)
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
            await axios.delete(`/campgrounds/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/campgrounds');
        } catch (error) {
            setError(error);
        }
    }

    if (loading) return <h1>Loading...</h1>;
    if (error) return <Error err={error} />;

    return (
        <div className="container py-5">
            {/* Header Section */}
            <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center">
                    <h1 className="fw-bold display-5 mb-2">{camp.name}</h1>
                    <FavoriteButton campgroundId={camp._id} isAbsolute={false} />
                </div>
                <div className="d-flex align-items-center gap-3 text-muted">
                    <span><i className="bi bi-geo-alt-fill text-primary me-1"></i> {camp.location}</span>
                    <span className="text-muted">|</span>
                    {camp.reviews.length > 0 ? (
                        <span className="text-warning">
                            <i className="bi bi-star-fill me-1"></i>
                            <span className="text-dark fw-bold">{(camp.reviews.reduce((acc, r) => acc + r.rating, 0) / camp.reviews.length).toFixed(1)}</span>
                            <span className="text-muted ms-1">({camp.reviews.length} reviews)</span>
                        </span>
                    ) : (
                        <span>No reviews yet</span>
                    )}
                </div>
            </div>

            {/* Gallery Section - Carousel */}
            <div className="mb-5 rounded-4 overflow-hidden shadow-sm position-relative">
                <div id="campgroundCarousel" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-indicators">
                        {camp.image.map((img, index) => (
                            <button
                                key={index}
                                type="button"
                                data-bs-target="#campgroundCarousel"
                                data-bs-slide-to={index}
                                className={index === 0 ? 'active' : ''}
                                aria-current={index === 0 ? 'true' : 'false'}
                                aria-label={`Slide ${index + 1}`}
                            ></button>
                        ))}
                    </div>
                    <div className="carousel-inner">
                        {camp.image.length > 0 ? (
                            camp.image.map((img, index) => (
                                <div key={img.url} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                    <img src={img.url} className="d-block w-100" style={{ height: '500px', objectFit: 'cover' }} alt={`${camp.name}`} />
                                </div>
                            ))
                        ) : (
                            <div className="carousel-item active">
                                <img src="https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg" className="d-block w-100" style={{ height: '500px', objectFit: 'cover' }} alt="Campground" />
                            </div>
                        )}
                    </div>
                    {camp.image.length > 1 && (
                        <>
                            <button className="carousel-control-prev" type="button" data-bs-target="#campgroundCarousel" data-bs-slide="prev">
                                <span className="carousel-control-prev-icon bg-dark rounded-circle p-3 bg-opacity-25" aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#campgroundCarousel" data-bs-slide="next">
                                <span className="carousel-control-next-icon bg-dark rounded-circle p-3 bg-opacity-25" aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="row g-5">
                {/* Main Content - Left Column */}
                <div className="col-lg-8">
                    {/* Description */}
                    <div className="mb-5">
                        <h3 className="fw-bold mb-3">About this spot</h3>
                        <p className="text-secondary fs-5" style={{ lineHeight: '1.8' }}>{camp.description}</p>
                    </div>

                    <hr className="my-5 border-secondary-subtle" />

                    {/* Amenities */}
                    <div className="mb-5">
                        <h3 className="fw-bold mb-4">Amenities</h3>
                        <div className="row row-cols-1 row-cols-md-2 g-3">
                            {amenityOptions.map(cat => (
                                <div key={cat.name} className="col">
                                    <h6 className="fw-bold mb-3 text-uppercase text-muted small ls-1">{cat.name}</h6>
                                    {cat.amenities.filter(element => camp.amenity.includes(element.value)).length > 0 ? (
                                        <div className="d-flex flex-wrap gap-2">
                                            {cat.amenities.filter(element => camp.amenity.includes(element.value)).map(element => (
                                                <div key={element.value} className="d-flex align-items-center gap-2 px-3 py-2 bg-light rounded-pill border">
                                                    {element.activeIcon}
                                                    <span className="fw-medium">{element.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-muted fst-italic small">None available</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <hr className="my-5 border-secondary-subtle" />

                    {/* Map */}
                    <CampgroundMap camp={camp} />

                    <hr className="my-5 border-secondary-subtle" />

                    {/* Reviews */}
                    <CampgroundReviews
                        camp={camp}
                        setCamp={setCamp}
                        currentUser={currentUser}
                        id={id}
                        setError={setError}
                    />
                </div>

                {/* Sidebar - Right Column */}
                <div className="col-lg-4">
                    <div className="sticky-top" style={{ top: '2rem', zIndex: 10 }}>
                        {/* Booking Card */}
                        <div className="card border shadow-lg rounded-4 overflow-hidden mb-4">
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-baseline mb-4 border-bottom pb-3">
                                    <h2 className="mb-0 fw-bold">${camp.price} <span className="fs-6 text-muted fw-normal">/ night</span></h2>
                                    {camp.bookingCount !== undefined && (
                                        <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill">
                                            {camp.bookingCount} booked
                                        </span>
                                    )}
                                </div>

                                <BookingCalendar
                                    campgroundId={camp._id}
                                    pricePerNight={camp.price}
                                    currentUser={currentUser}
                                />

                                {camp.checkin && (
                                    <div className="mt-3 pt-3 border-top d-flex justify-content-between text-muted small">
                                        <span>Check-in: <span className="fw-bold text-dark">{camp.checkin}</span></span>
                                        <span>Check-out: <span className="fw-bold text-dark">{camp.checkout}</span></span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Host Profile Card */}
                        <div className="mb-4">
                            <HostProfile user={camp.author} camp={camp} />
                        </div>

                        {/* Edit Controls */}
                        {currentUser && currentUser.username === camp.author.username && (
                            <div className="d-grid gap-2">
                                <Link to={`/campgrounds/edit/${camp._id}`} className="btn btn-outline-dark fw-bold">Edit Campground</Link>
                                <button className="btn btn-danger fw-bold" onClick={handleDeleteCamp}>Delete Campground</button>
                            </div>
                        )}

                        {/* Weather Widget (Mini) */}
                        {camp.campLocation && camp.campLocation.coordinates && (
                            <div className="mt-4">
                                <WeatherWidget lat={camp.campLocation.coordinates[1]} lng={camp.campLocation.coordinates[0]} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Campground;
