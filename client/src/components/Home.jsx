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

    if (isLoading) return <h1>Loading...</h1>;
    if (error) return <Error err={error} />;

    return (
        <div className="bg-light min-vh-100 d-flex flex-column">
            {/* Hero Section */}
            <div className="hero-section position-relative d-flex align-items-center justify-content-center text-center text-white" style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '60vh'
            }}>
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>
                <div className="container position-relative z-1">
                    <h1 className="display-3 fw-bold mb-3">Find Your Next Escape</h1>
                    <p className="lead fs-4 mb-4 text-light opacity-75 mx-auto" style={{ maxWidth: '700px' }}>
                        Discover hand-picked campgrounds from around the globe. From lakeside retreats to deep forest hideaways.
                    </p>
                    <a href="#campgrounds-list" className="btn btn-light btn-lg px-5 fw-semibold rounded-pill shadow-sm">Explore Now</a>
                </div>
            </div>

            {/* Map Section */}
            <div className="container-fluid px-0">
                <div ref={mapRef} style={{ height: '400px', width: '100%' }}></div>
            </div>

            {/* Campgrounds Grid */}
            <div className="container py-5" id="campgrounds-list">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold text-dark m-0">Featured Destinations</h2>
                    <Link to="/campgrounds/new" className="btn btn-primary d-flex align-items-center gap-2">
                        <i className="bi bi-plus-lg"></i> Add Camp
                    </Link>
                </div>

                <div className="row g-4">
                    {data && data.map((camp) => (
                        <div className="col-md-6 col-lg-4" key={camp._id}>
                            <div className="card h-100 border-0 shadow-sm hover-lift overflow-hidden">
                                <div className="position-relative">
                                    <img
                                        src={camp.image.length ? camp.image[0].url : 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'}
                                        className="card-img-top"
                                        alt={camp.name}
                                        style={{ height: '240px', objectFit: 'cover' }}
                                    />
                                    <div className="position-absolute top-0 end-0 m-3">
                                        <span className="badge bg-white text-dark shadow-sm px-3 py-2 rounded-pill fw-bold">
                                            ${camp.price}<small>/night</small>
                                        </span>
                                    </div>
                                </div>
                                <div className="card-body d-flex flex-column p-4">
                                    <h5 className="card-title fw-bold mb-2">{camp.name}</h5>
                                    <div className="text-muted small mb-3 d-flex align-items-center gap-1">
                                        <i className="bi bi-geo-alt-fill text-primary"></i>
                                        {camp.location}
                                    </div>
                                    <p className="card-text text-secondary mb-4 flex-grow-1" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                                        {camp.description.substring(0, 100)}...
                                    </p>
                                    <Link to={`/campgrounds/${camp._id}`} className="btn btn-outline-primary w-100 mt-auto fw-medium">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Home;
