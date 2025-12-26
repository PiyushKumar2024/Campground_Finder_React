import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import '../css/StarRating.css';
import '../css/Campground.css'
import axios from "axios";
import Error from "./Error";
import { useSelector } from "react-redux";
import { Map, MapStyle, config, Marker, Popup } from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import * as turf from '@turf/turf';

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
                zoom: 5,
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


    console.log(camp);
    return (
        <div className="container mt-4" id='parent'>
            <div className="row">
                {/* Map Container */}
                <div ref={mapRef} className="col-12" style={{ height: '600px', marginBottom: '20px',width:'400px' }}></div>
                <div className="col-lg-6 mb-4">
                    <div className="card shadow-sm h-100">

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
                                {camp.image.map((img, index) => (
                                    <div key={img.url} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                        <img src={img.url} className="d-block w-100" style={{ aspectRatio: '16/9', objectFit: 'cover' }} alt={`${camp.name} - image ${index + 1}`} />
                                    </div>
                                ))}
                            </div>
                            {camp.image.length > 1 && (
                                <>
                                    <button className="carousel-control-prev" type="button" data-bs-target="#campgroundCarousel" data-bs-slide="prev">
                                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                        <span className="visually-hidden">Previous</span>
                                    </button>
                                    <button className="carousel-control-next" type="button" data-bs-target="#campgroundCarousel" data-bs-slide="next">
                                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                        <span className="visually-hidden">Next</span>
                                    </button>
                                </>
                            )}
                        </div>

                        <div className="card-body">
                            <h2 className="card-title">{camp.name}</h2>
                            <p className="card-text">{camp.description}</p>
                        </div>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item text-muted">{camp.location}</li>
                            {userDistance && <li className="list-group-item text-success fw-bold">Your Distance: {userDistance.toFixed(2)} km away</li>}
                            {clickedDistance && <li className="list-group-item text-primary fw-bold">Selected Distance: {clickedDistance.toFixed(2)} km</li>}
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
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteReview(review._id)}>Delete</button>
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
