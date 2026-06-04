import { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import '../css/Home.css'
import axios from 'axios'
import Error from './Error'
import SearchFilterBar from './SearchFilterBar'
import Pagination from './Pagination'
import { Map, MapStyle, config, Marker, Popup } from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';

const MAPTILER_API_KEY = import.meta.env.VITE_MAPTILER_API_KEY;
config.apiKey = MAPTILER_API_KEY;

const Home = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [data, setData] = useState(null);
    const [pagination, setPagination] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mapView, setMapView] = useState(false);
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef([]);
    const debounceRef = useRef(null);

    // Initialize filters from URL search params (so links are shareable)
    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        amenities: searchParams.get('amenities') ? searchParams.get('amenities').split(',') : [],
        sort: searchParams.get('sort') || 'newest',
        page: Number(searchParams.get('page')) || 1,
    });

    // Build query string from filters
    const buildQueryString = useCallback((f) => {
        const params = new URLSearchParams();
        if (f.search) params.set('search', f.search);
        if (f.minPrice) params.set('minPrice', f.minPrice);
        if (f.maxPrice) params.set('maxPrice', f.maxPrice);
        if (f.amenities.length > 0) params.set('amenities', f.amenities.join(','));
        if (f.sort && f.sort !== 'newest') params.set('sort', f.sort);
        if (f.page > 1) params.set('page', f.page);
        return params.toString();
    }, []);

    // Fetch campgrounds whenever filters change (with debounce for search)
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        const fetchData = () => {
            setIsLoading(true);
            const queryString = buildQueryString(filters);
            setSearchParams(queryString ? new URLSearchParams(queryString) : {}, { replace: true });

            axios.get(`http://localhost:3000/campgrounds${queryString ? '?' + queryString : ''}`)
                .then(response => {
                    setData(response.data.campgrounds);
                    setPagination(response.data.pagination);
                })
                .catch(err => {
                    setError(err);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        };

        debounceRef.current = setTimeout(fetchData, 300);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [filters, buildQueryString, setSearchParams]);

    const handleFilterChange = (updates) => {
        setFilters(prev => ({ ...prev, ...updates }));
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
        document.getElementById('campgrounds-list')?.scrollIntoView({ behavior: 'smooth' });
    };

    // Map initialization & marker management
    useEffect(() => {
        if (!mapView || !data || data.length === 0 || !mapRef.current) return;

        // Clean up previous markers
        markersRef.current.forEach(m => m.remove());
        markersRef.current = [];

        // Create map if it doesn't exist yet
        if (!mapInstanceRef.current) {
            mapInstanceRef.current = new Map({
                container: mapRef.current,
                style: MapStyle.STREETS,
                center: data[0].campLocation.coordinates,
                zoom: 3,
                terrainControl: false,
                scaleControl: true,
                fullscreenControl: "top-left",
            });
        }

        const mapInstance = mapInstanceRef.current;

        // Add markers for each campground
        const bounds = [];
        for (const camp of data) {
            if (!camp.campLocation || !camp.campLocation.coordinates) continue;

            const coords = camp.campLocation.coordinates;
            bounds.push(coords);

            // Custom HTML price marker
            const el = document.createElement('div');
            el.className = 'camp-marker';
            el.innerHTML = `<span>$${camp.price}</span>`;

            // Popup with campground preview card
            const imgUrl = camp.image.length
                ? camp.image[0].url
                : 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg';

            const popup = new Popup({
                offset: 25,
                maxWidth: '280px',
                closeButton: true,
            }).setHTML(`
                <div class="map-popup">
                    <img src="${imgUrl}" alt="${camp.name}" />
                    <div class="map-popup-body">
                        <h6>${camp.name}</h6>
                        <p class="map-popup-location"><i class="bi bi-geo-alt-fill"></i> ${camp.location}</p>
                        <div class="map-popup-footer">
                            <span class="map-popup-price">$${camp.price}<small>/night</small></span>
                            <a href="/campgrounds/${camp._id}" class="map-popup-link">View Details →</a>
                        </div>
                    </div>
                </div>
            `);

            const marker = new Marker({ element: el })
                .setLngLat(coords)
                .setPopup(popup)
                .addTo(mapInstance);

            markersRef.current.push(marker);
        }

        // Fit map to show all markers with smooth animation
        if (bounds.length > 1) {
            const lngs = bounds.map(b => b[0]);
            const lats = bounds.map(b => b[1]);
            mapInstance.fitBounds(
                [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
                { padding: 60, maxZoom: 12, duration: 1000 }
            );
        } else if (bounds.length === 1) {
            mapInstance.flyTo({ center: bounds[0], zoom: 10, duration: 1000 });
        }

        return () => {
            markersRef.current.forEach(m => m.remove());
            markersRef.current = [];
        };
    }, [data, mapView]);

    // Cleanup map on unmount
    useEffect(() => {
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    // Skeleton loading state
    if (isLoading && !data) return (
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

            {/* Search & Filter Bar */}
            <div className="container">
                <SearchFilterBar filters={filters} onFilterChange={handleFilterChange} />
            </div>

            {/* Campgrounds Content */}
            <div className="container py-4" id="campgrounds-list">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold text-dark m-0" style={{ fontFamily: 'var(--font-display)' }}>
                            {filters.search ? `Results for "${filters.search}"` : 'Featured Destinations'}
                        </h2>
                        {pagination && (
                            <p className="results-count m-0 mt-1">
                                Showing <strong>{data.length}</strong> of <strong>{pagination.totalResults}</strong> campgrounds
                            </p>
                        )}
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        {/* View Toggle: Grid / Map */}
                        <div className="view-toggle">
                            <button
                                className={`view-toggle-btn ${!mapView ? 'active' : ''}`}
                                onClick={() => setMapView(false)}
                                title="Grid view"
                            >
                                <i className="bi bi-grid-3x3-gap-fill"></i>
                            </button>
                            <button
                                className={`view-toggle-btn ${mapView ? 'active' : ''}`}
                                onClick={() => setMapView(true)}
                                title="Map view"
                            >
                                <i className="bi bi-map-fill"></i>
                            </button>
                        </div>
                        <Link to="/campgrounds/new" className="btn btn-success d-flex align-items-center gap-2 px-4 shadow-sm hover-glow">
                            <i className="bi bi-plus-lg"></i> Add Camp
                        </Link>
                    </div>
                </div>

                {/* Loading overlay for filter changes */}
                {isLoading && data && (
                    <div className="text-center py-4">
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}

                {/* MAP VIEW */}
                {mapView ? (
                    <div className="map-view-container animate-fade-in">
                        <div ref={mapRef} className="map-view-canvas"></div>
                        {data && data.length === 0 && (
                            <div className="map-empty-overlay">
                                <i className="bi bi-geo-alt"></i>
                                <p>No campgrounds match your filters</p>
                            </div>
                        )}
                    </div>
                ) : (
                    /* GRID VIEW */
                    <>
                        {!isLoading && data && data.length === 0 ? (
                            <div className="no-results">
                                <div className="no-results-icon">
                                    <i className="bi bi-search"></i>
                                </div>
                                <h3>No campgrounds found</h3>
                                <p>Try adjusting your filters or search terms to find what you're looking for.</p>
                                <button
                                    className="btn btn-outline-success px-4"
                                    onClick={() => handleFilterChange({
                                        search: '',
                                        minPrice: '',
                                        maxPrice: '',
                                        amenities: [],
                                        sort: 'newest',
                                        page: 1
                                    })}
                                >
                                    <i className="bi bi-arrow-counterclockwise me-2"></i>
                                    Clear All Filters
                                </button>
                            </div>
                        ) : (
                            <div className="row g-4">
                                {data && data.map((camp, index) => (
                                    <div className="col-md-6 col-lg-4 animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }} key={camp._id}>
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
                        )}

                        {/* Pagination */}
                        {pagination && pagination.totalPages > 1 && (
                            <Pagination
                                currentPage={pagination.currentPage}
                                totalPages={pagination.totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default Home;
