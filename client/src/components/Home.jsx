import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css'
import axios from 'axios'
import Error from './Error'
import { Map, MapStyle, config, Marker } from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import * as turf from '@turf/turf';

const MAPTILER_API_KEY = import.meta.env.VITE_MAPTILER_API_KEY;
config.apiKey = MAPTILER_API_KEY;

const Home = () => {
    const [data, setData] = useState(null);
    const [map, setMap] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const mapRef = useRef(null);

    useEffect(() => {
        axios.get('http://localhost:3000/campgrounds')
            .then(response => {
                setData(response.data);
                console.log(response.data);
            })
            .catch(err => {
                setError(err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        if (!data) return;
        const mapInstance = new Map({
            container: mapRef.current,
            center: data[0].campLocation.coordinates,
            projection: "globe",
            style: MapStyle.HYBRID,
            zoom: 3,
            halo: true,
            terrainControl: false,
            scaleControl: true,
            fullscreenControl: "top-left",
            space: {
                preset: "milkyway-bright",
            }
        })
        for (let camp of data) {

        }
        setMap(map);
    }, [data])

    if (isLoading) return (
        <div className="container py-5 mt-5">
            <div className="row g-4 mt-5">
                {[...Array(6)].map((_, i) => (
                    <div className="col-md-6 col-lg-4" key={i}>
                        <div className="card h-100 border-0 shadow-sm">
                            <div className="skeleton" style={{ height: '240px' }}></div>
                            <div className="card-body p-4">
                                <div className="skeleton mb-3" style={{ height: '24px', width: '70%' }}></div>
                                <div className="skeleton mb-4" style={{ height: '16px', width: '40%' }}></div>
                                <div className="skeleton mb-2" style={{ height: '16px', width: '100%' }}></div>
                                <div className="skeleton mb-4" style={{ height: '16px', width: '90%' }}></div>
                                <div className="skeleton mt-auto" style={{ height: '38px', width: '100%', borderRadius: 'var(--radius-lg)' }}></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
    if (error) return <Error err={error} />;

    return (
        <div className="bg-light min-vh-100 d-flex flex-column">
            {/* Hero Section */}
            <div className="hero-section">
                <div className="container position-relative z-1 animate-fade-in">
                    <h1>Find Your Next Escape</h1>
                    <p className="mb-4">
                        Discover hand-picked campgrounds from around the globe. From lakeside retreats to deep forest hideaways.
                    </p>
                    <a href="#campgrounds-list" className="btn btn-success btn-lg px-5 py-3 fw-semibold rounded-pill shadow-lg hover-glow">Explore Now</a>
                </div>
            </div>



            {/* Campgrounds Grid */}
            <div className="container py-5" id="campgrounds-list">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <h2 className="fw-bold text-dark m-0" style={{ fontFamily: 'var(--font-display)' }}>Featured Destinations</h2>
                    <Link to="/campgrounds/new" className="btn btn-success d-flex align-items-center gap-2 px-4 shadow-sm hover-glow">
                        <i className="bi bi-plus-lg"></i> Add Camp
                    </Link>
                </div>

                <div className="row g-4">
                    {data && data.map((camp, index) => (
                        <div className="col-md-6 col-lg-4 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }} key={camp._id}>
                            <div className="card h-100">
                                <div className="card-img-container">
                                    <img
                                        src={camp.image.length ? camp.image[0].url : 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'}
                                        className="card-img-top"
                                        alt={camp.name}
                                    />
                                    <div className="card-img-overlay-bottom d-flex align-items-end">
                                    </div>
                                    <span className="price-badge">
                                        ${camp.price}<small className="fw-normal">/night</small>
                                    </span>
                                </div>
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{camp.name}</h5>
                                    <div className="location-text">
                                        <i className="bi bi-geo-alt-fill"></i>
                                        {camp.location}
                                    </div>
                                    <p className="card-text flex-grow-1">
                                        {camp.description.substring(0, 100)}...
                                    </p>
                                    <Link to={`/campgrounds/${camp._id}`} className="btn btn-outline-success w-100 mt-auto fw-medium">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Map Section */}
            <div className="container mt-5 mb-4 text-center">
                <h3 className="fw-bold text-dark m-0" style={{ fontFamily: 'var(--font-display)' }}>Explore Destinations on Map</h3>
                <p className="text-muted mt-2">Find the perfect spot for your next adventure.</p>
            </div>
            <div className="container-fluid px-0 mb-5 shadow-sm">
                <div ref={mapRef} style={{ height: '450px', width: '100%' }}></div>
            </div>
        </div>
    )
}

export default Home;
