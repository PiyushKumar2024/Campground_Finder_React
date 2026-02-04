import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import '../css/StarRating.css';
import '../css/Campground.css';
import axios from "axios";
import Error from "./Error";
import { useSelector } from "react-redux";
import { Map, MapStyle, config, Marker, Popup } from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import * as turf from '@turf/turf';
import { amenityOptions } from "../config/icons";
import HostProfile from "./hostprofile";
import WeatherWidget from "./WeatherWidget";
import BookingCalendar from "./BookingCalendar";

const MAPTILER_API_KEY = import.meta.env.VITE_MAPTILER_API_KEY;
config.apiKey = MAPTILER_API_KEY;

const Campground = () => {
    const { id } = useParams();
    const [camp, setCamp] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setloading] = useState(true);
    const [map, setMap] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [userDistance, setUserDistance] = useState(null);
    const [clickedDistance, setClickedDistance] = useState(null);
    const [clickedLocation, setClickedLocation] = useState(null);
    const { user: currentUser } = useSelector((state) => state.user);
    const mapRef = useRef(null);
    const locRef = useRef(null);
    const clickedMarkerRef = useRef(null);
    const userMarkerRef = useRef(null);

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

    console.log(camp);

    useEffect(() => {
        if (!camp || !camp.campLocation) return;
        if (camp.campLocation) {
            const mapInstance = new Map({
                container: mapRef.current,
                projection: "globe",
                style: MapStyle.HYBRID,
                center: camp.campLocation.coordinates,
                zoom: 10,
                pitch: 60,
                bearing: -17.6,
                terrainControl: false,
                scaleControl: true,
                fullscreenControl: "top-left",
                terrain: true,
                terrainExaggeration: 1.5,
                space: {
                    preset: "milkyway-bright",
                }
            })

            new Marker()
                .setLngLat(camp.campLocation.coordinates)
                .setPopup(new Popup().setHTML(`<h6>${camp.name}</h6><p>${camp.location}</p>`))
                .addTo(mapInstance);

            mapInstance.on('click', (e) => {
                setClickedLocation([e.lngLat.lng, e.lngLat.lat])
            });

            // Add the line source and layer once the map is loaded
            mapInstance.on('load', () => {
                mapInstance.addSource('route', {
                    'type': 'geojson',
                    'data': {
                        'type': 'Feature',
                        'properties': {},
                        'geometry': { 'type': 'LineString', 'coordinates': [] }
                    }
                });
                mapInstance.addLayer({
                    'id': 'route',
                    'type': 'line',
                    'source': 'route',
                    'layout': { 'line-join': 'round', 'line-cap': 'round' },
                    'paint': { 'line-color': '#3887be', 'line-width': 5, 'line-dasharray': [2, 2], 'line-opacity': 0.75 }
                });
            });

            setMap(mapInstance);

            return () => {
                mapInstance.remove();
                setMap(null);
            };
        }
    }, [camp])

    useEffect(() => {
        if (!map || !navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition((position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            setUserLocation([longitude, latitude]);
            if (userMarkerRef.current) {
                userMarkerRef.current.setLngLat([longitude, latitude]);
            } else {
                userMarkerRef.current = new Marker().setLngLat([longitude, latitude]).addTo(map);
            }
        }, (error) => {
            alert('Cannot get your location');
        });
    }, [map])

    useEffect(() => {
        if (camp && camp.campLocation && userLocation) {
            const from = turf.point(userLocation);
            const to = turf.point(camp.campLocation.coordinates);
            const calculatedDistance = turf.distance(from, to, { units: 'kilometers' });
            setUserDistance(calculatedDistance);
        }
    }, [camp, userLocation]);

    useEffect(() => {
        if (!clickedLocation || !map || !camp) return;
        const from = turf.point(camp.campLocation.coordinates);
        const to = turf.point(clickedLocation)
        const distance = turf.distance(from, to, { units: "kilometers" });
        setClickedDistance(distance);

        if (clickedMarkerRef.current) {
            clickedMarkerRef.current.setLngLat(clickedLocation);
        } else {
            clickedMarkerRef.current = new Marker({ color: '#FF0000' })
                .setLngLat(clickedLocation)
                .addTo(map);
        }

        const route = map.getSource('route');
        if (route) {
            route.setData(turf.lineString([camp.campLocation.coordinates, clickedLocation]));
        }
    }, [clickedLocation, map, camp])

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

    const handleDeleteReview = async (rid) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3000/campgrounds/${id}/reviews/${rid}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const res = await axios.get(`http://localhost:3000/campgrounds/${id}`);
            setCamp(res.data);
        } catch (e) {
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

    return (
        <div className="container py-5">
            {/* Header Section */}
            <div className="mb-4">
                <h1 className="fw-bold display-5 mb-2">{camp.name}</h1>
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
                    <div className="mb-5">
                        <h3 className="fw-bold mb-3">Where you'll be</h3>
                        <div ref={mapRef} className="rounded-4 overflow-hidden shadow-sm" style={{ height: '400px', width: '100%' }}></div>
                        <div className="mt-3 d-flex gap-3">
                            {userDistance &&
                                <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2">
                                    <i className="bi bi-cursor-fill me-2"></i>{userDistance.toFixed(1)} km away
                                </span>
                            }
                            {clickedDistance &&
                                <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-2">
                                    <i className="bi bi-geo me-2"></i>Selected: {clickedDistance.toFixed(1)} km
                                </span>
                            }
                        </div>
                    </div>

                    <hr className="my-5 border-secondary-subtle" />

                    {/* Reviews */}
                    <div className="mb-5">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h3 className="fw-bold m-0">Reviews</h3>
                            <span className="badge bg-dark rounded-pill px-3 py-2">{camp.reviews.length} reviews</span>
                        </div>

                        {currentUser && (
                            <div className="card border-0 bg-light mb-4 rounded-4">
                                <div className="card-body p-4">
                                    <h5 className="fw-bold mb-3">Leave a Review</h5>
                                    <form onSubmit={handleReviewSubmit} className="needs-validation" noValidate>
                                        <fieldset className="starability-growRotate mb-3">
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
                                        <div className="form-floating mb-3">
                                            <textarea className="form-control" name="review[body]" id="reviewBody" style={{ height: '100px' }} placeholder="Write your review here..." required></textarea>
                                            <label htmlFor="reviewBody">Share your experience...</label>
                                            <div className="invalid-feedback">Review text is required.</div>
                                        </div>
                                        <button className="btn btn-dark fw-bold px-4">Post Review</button>
                                    </form>
                                </div>
                            </div>
                        )}

                        <div className="vertical-scrollable p-0 bg-transparent border-0" style={{ maxHeight: 'none', overflow: 'visible' }}>
                            {camp.reviews.map(review => (
                                <div className="card border-0 border-bottom mb-4 rounded-0 bg-transparent" key={review._id}>
                                    <div className="card-body px-0 py-3">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="bg-secondary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center fw-bold text-secondary" style={{ width: '40px', height: '40px' }}>
                                                    {review.author.username[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <h6 className="fw-bold mb-0">
                                                        <Link to={`/user/${review.author._id}`} className="text-dark text-decoration-none">{review.author.username}</Link>
                                                    </h6>
                                                    <div className="text-warning small">
                                                        {[...Array(review.rating)].map((_, i) => <i key={i} className="bi bi-star-fill"></i>)}
                                                    </div>
                                                </div>
                                            </div>
                                            {currentUser && currentUser.username === review.author.username && (
                                                <button className="btn btn-sm btn-link text-danger p-0 border-0" onClick={() => handleDeleteReview(review._id)}>
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            )}
                                        </div>
                                        <p className="card-text text-secondary mt-3">{review.body}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
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
