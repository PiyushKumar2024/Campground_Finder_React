import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css'
import axios from 'axios'
import Error from './Error'
import { Map, MapStyle, config, Marker} from '@maptiler/sdk';
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
        <>
            <div className="hero-section position-relative text-white d-flex align-items-center justify-content-center" style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '400px'
            }}>
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>
                <div className="container position-relative">
                    <div className="py-4 col-lg-8 mx-auto text-center">
                        <h1 className="display-4 fw-bold">Find Your Next Escape</h1>
                        <p className="lead fs-4">
                            Welcome to YelpCamp! We've gathered a collection of the most beautiful and unique campgrounds from around the globe.
                            Whether you're looking for a scenic spot by the lake or a secluded hideaway in the forest, your next adventure starts here.
                        </p>
                    </div>
                </div>
            </div>

            <div ref={mapRef} className="col-12" style={{ height: '400px', marginBottom: '20px' }}></div>

            <div className="container-fluid p-4 p-md-5">
                <div className="row gy-4">
                    {data && data.map((camp) => (
                        <div className="col-12 col-md-6 col-lg-6 mx-auto" key={camp._id}>
                            <div className="card shadow border-0 rounded-4 overflow-hidden">
                                <div className="row g-0">
                                    <div className="col-md-8">
                                        <div className="card-body d-flex flex-column h-100">
                                            <h5 className="card-title">{camp.name}</h5>
                                            <p className="card-text text-secondary">{camp.description}</p>
                                            <p className="card-text"><small className="text-muted"><i className="bi-geo-alt"></i> {camp.location}</small></p>
                                            <Link to={`/campgrounds/${camp._id}`} className="btn btn-success mt-auto align-self-start">View Details</Link>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <img className="img-fluid w-100 h-100" style={{ objectFit: 'cover', minHeight: '200px' }} src={camp.image.length ? camp.image[0].url : 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'} alt="Camp image" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Home;
