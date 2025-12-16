import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../public/css/Home.css'
import axios from 'axios'
import Error from './Error'

const Home = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=>{
        axios.get('/campgrounds')
            .then(response=>{
                setData(response.data);
                console.log(response.data);
            })
            .catch(err=>{
                setError(err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);
    
    if (isLoading) return <h1>Loading...</h1>;
    if (error) return <Error err={error} />;

    return (
        <>
            <div className="hero-section">
                <div className="py-4 col-lg-8 mx-auto">
                    <h1 className="display-4" style={{ fontWeight: 500 }}>Find Your Next Escape</h1>
                    <p className="lead">
                        Welcome to YelpCamp! We've gathered a collection of the most beautiful and unique campgrounds from around the globe.
                        Whether you're looking for a scenic spot by the lake or a secluded hideaway in the forest, your next adventure starts here.
                    </p>
                </div>
            </div>

            <div className="container-fluid p-4 p-md-5">
                <div className="row gy-4">
                    {data && data.map((camp) => (
                        <div className="col-12 col-md-6 col-lg-4" key={camp._id}>
                            <div className="card h-100 shadow border-0">
                                <div className="card-img-container">
                                    <img className="card-img-top" style={{ aspectRatio: '16/9', objectFit: 'cover' }} src={camp.image} alt="Camp image" />
                                    <div className="card-img-overlay-bottom">
                                        <i className="bi-geo-alt"></i> {camp.location}
                                    </div>
                                </div>
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{camp.name}</h5>
                                    <p className="card-text text-secondary small">{camp.description.substring(0, 100)}...</p>
                                    <Link to={`/campgrounds/${camp._id}`} className="btn btn-success mt-auto">View Details</Link>
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
