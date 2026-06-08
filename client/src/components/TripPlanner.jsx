import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import * as turf from '@turf/turf';
import { Map, MapStyle, config, Marker, Popup } from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import * as maptilerClient from '@maptiler/client';
import '../css/TripPlanner.css';

config.apiKey = import.meta.env.VITE_MAPTILER_API_KEY;
maptilerClient.config.apiKey = import.meta.env.VITE_MAPTILER_API_KEY;

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper: Get Bootstrap icon class for a transport mode
const getTransportIcon = (mode) => {
    const m = (mode || '').toLowerCase();
    if (['flight', 'airplane', 'air', 'plane'].includes(m)) return 'bi-airplane';
    if (['train', 'railway', 'rail', 'metro'].includes(m)) return 'bi-train-front';
    if (['bus', 'coach', 'shuttle'].includes(m)) return 'bi-bus-front';
    if (['car', 'cab', 'taxi', 'auto', 'drive', 'self-drive'].includes(m)) return 'bi-car-front';
    if (['ferry', 'boat', 'ship'].includes(m)) return 'bi-water';
    if (['walk', 'walking', 'hike'].includes(m)) return 'bi-person-walking';
    return 'bi-signpost-split'; // fallback
};

// Helper: Get CSS class for travel icon background
const getTransportClass = (mode) => {
    const m = (mode || '').toLowerCase();
    if (['flight', 'airplane', 'air', 'plane'].includes(m)) return 'flight';
    if (['train', 'railway', 'rail', 'metro'].includes(m)) return 'train';
    if (['bus', 'coach', 'shuttle'].includes(m)) return 'bus';
    return 'car'; // default
};

const TripPlanner = () => {
    // State
    const [allCampgrounds, setAllCampgrounds] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchMode, setSearchMode] = useState('campgrounds');
    const [touristResults, setTouristResults] = useState([]);
    const [isSearchingTourist, setIsSearchingTourist] = useState(false);
    const [stops, setStops] = useState([]);

    // User Location State
    const [originInput, setOriginInput] = useState('');
    const [origin, setOrigin] = useState(null); // { name, coordinates: [lng, lat] }
    const [locating, setLocating] = useState(false);

    // AI Insights State
    const [aiInsights, setAiInsights] = useState(null);
    const [loadingInsights, setLoadingInsights] = useState(false);
    const [showInsights, setShowInsights] = useState(false);
    const [error, setError] = useState(null);

    // Map Refs
    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const markersRef = useRef([]);
    const routeLineRef = useRef(null);
    const attractionMarkerRef = useRef(null);

    // 1. Fetch lightweight campgrounds data
    useEffect(() => {
        const fetchCamps = async () => {
            try {
                const res = await axios.get(`${API_BASE}/campgrounds/coordinates`);
                setAllCampgrounds(res.data);
            } catch (err) {
                console.error("Failed to load campgrounds", err);
            }
        };
        fetchCamps();
    }, []);

    // 2. Initialize Map
    useEffect(() => {
        if (!mapContainer.current || mapRef.current) return;

        mapRef.current = new Map({
            container: mapContainer.current,
            style: MapStyle.OUTDOOR,
            center: [0, 20],
            zoom: 2,
        });

        mapRef.current.on('load', () => {
            mapRef.current.addSource('route', {
                type: 'geojson',
                data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [] } }
            });
            mapRef.current.addLayer({
                id: 'route-line',
                type: 'line',
                source: 'route',
                layout: { 'line-join': 'round', 'line-cap': 'round' },
                paint: { 'line-color': '#198754', 'line-width': 4, 'line-dasharray': [1, 0] }
            });

            mapRef.current.addSource('first-mile', {
                type: 'geojson',
                data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [] } }
            });
            mapRef.current.addLayer({
                id: 'first-mile-line',
                type: 'line',
                source: 'first-mile',
                layout: { 'line-join': 'round', 'line-cap': 'round' },
                paint: { 'line-color': '#0d6efd', 'line-width': 3, 'line-dasharray': [2, 4] }
            });
        });

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    // 3. Update Map Markers and Lines when stops or origin change
    useEffect(() => {
        if (!mapRef.current) return;

        // Clear existing markers
        markersRef.current.forEach(m => m.remove());
        markersRef.current = [];
        if (attractionMarkerRef.current) {
            attractionMarkerRef.current.remove();
            attractionMarkerRef.current = null;
        }

        // Add Origin Marker
        if (origin) {
            const el = document.createElement('div');
            el.innerHTML = '<i class="bi bi-house-door-fill text-primary" style="font-size: 1.5rem; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));"></i>';
            const marker = new Marker({ element: el })
                .setLngLat(origin.coordinates)
                .setPopup(new Popup({ offset: 25 }).setHTML(`<h6>Start: ${origin.name}</h6>`))
                .addTo(mapRef.current);
            markersRef.current.push(marker);
        }

        // Add Stop Markers
        stops.forEach((stop, idx) => {
            const el = document.createElement('div');
            el.className = 'stop-number';
            el.style.backgroundColor = stop.isTouristSpot ? '#0dcaf0' : '#198754';
            if (stop.isTouristSpot) {
                el.innerHTML = '<i class="bi bi-star-fill" style="font-size: 0.8rem"></i>';
            } else {
                el.innerText = idx + 1;
            }

            const marker = new Marker({ element: el })
                .setLngLat(stop.campLocation.coordinates)
                .setPopup(new Popup({ offset: 25 }).setHTML(`<h6>${idx + 1}. ${stop.name}</h6>`))
                .addTo(mapRef.current);
            markersRef.current.push(marker);
        });

        // Update Routes
        if (mapRef.current.getSource('route') && mapRef.current.getSource('first-mile')) {
            if (stops.length > 0) {
                const stopCoords = stops.map(s => s.campLocation.coordinates);
                mapRef.current.getSource('route').setData({
                    type: 'Feature',
                    properties: {},
                    geometry: { type: 'LineString', coordinates: stopCoords }
                });

                if (origin) {
                    mapRef.current.getSource('first-mile').setData({
                        type: 'Feature',
                        properties: {},
                        geometry: { type: 'LineString', coordinates: [origin.coordinates, stopCoords[0]] }
                    });
                } else {
                    mapRef.current.getSource('first-mile').setData({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [] } });
                }

                // Fit bounds
                let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
                const updateBounds = (coord) => {
                    if (coord[0] < minLng) minLng = coord[0];
                    if (coord[1] < minLat) minLat = coord[1];
                    if (coord[0] > maxLng) maxLng = coord[0];
                    if (coord[1] > maxLat) maxLat = coord[1];
                };
                if (origin) updateBounds(origin.coordinates);
                stopCoords.forEach(c => updateBounds(c));

                if (minLng !== Infinity) {
                    mapRef.current.fitBounds([[minLng, minLat], [maxLng, maxLat]], { padding: 50, maxZoom: 10 });
                }
            } else {
                mapRef.current.getSource('route').setData({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [] } });
                mapRef.current.getSource('first-mile').setData({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [] } });
                if (origin) {
                    mapRef.current.flyTo({ center: origin.coordinates, zoom: 8 });
                }
            }
        }
    }, [stops, origin]);

    // Handlers
    const handleAddStop = (camp) => {
        if (!stops.find(s => s._id === camp._id)) {
            setStops([...stops, camp]);
            setSearchTerm('');
            setTouristResults([]);
        }
    };

    const searchTouristPlaces = async () => {
        if (!searchTerm) return;
        setIsSearchingTourist(true);
        try {
            const res = await axios.get(`${API_BASE}/api/places/search?q=${searchTerm}`);
            setTouristResults(res.data);
        } catch (err) {
            console.error("Failed to fetch tourist places", err);
        } finally {
            setIsSearchingTourist(false);
        }
    };

    const handleRemoveStop = (id) => {
        setStops(stops.filter(s => s._id !== id));
        setAiInsights(null);
        setShowInsights(false);
    };

    const handleClearAllStops = () => {
        setStops([]);
        setAiInsights(null);
        setShowInsights(false);
    };

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(stops);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setStops(items);
        setAiInsights(null);
        setShowInsights(false);
    };

    // Location Handlers
    const handleUseMyLocation = () => {
        setLocating(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { longitude, latitude } = position.coords;
                try {
                    const res = await maptilerClient.geocoding.reverse([longitude, latitude]);
                    const placeName = res.features[0]?.place_name || "Your Location";
                    setOrigin({ name: placeName, coordinates: [longitude, latitude] });
                    setOriginInput('');
                } catch (err) {
                    setError("Failed to resolve location name.");
                } finally {
                    setLocating(false);
                }
            }, () => {
                setError("Location access denied.");
                setLocating(false);
            });
        } else {
            setError("Geolocation is not supported by your browser");
            setLocating(false);
        }
    };

    const handleManualLocationSearch = async () => {
        if (!originInput) return;
        setLocating(true);
        try {
            const res = await maptilerClient.geocoding.forward(originInput);
            if (res.features && res.features.length > 0) {
                setOrigin({
                    name: res.features[0].place_name,
                    coordinates: res.features[0].geometry.coordinates
                });
                setOriginInput('');
            } else {
                setError("Location not found.");
            }
        } catch (err) {
            setError("Error finding location.");
        } finally {
            setLocating(false);
        }
    };

    const handleClearOrigin = () => {
        setOrigin(null);
        setAiInsights(null);
        setShowInsights(false);
    };

    const handleAttractionClick = (attr) => {
        if (!attr.coordinates || attr.coordinates.length !== 2) return;

        if (attractionMarkerRef.current) {
            attractionMarkerRef.current.remove();
        }

        const marker = new Marker({ color: '#dc3545' })
            .setLngLat(attr.coordinates)
            .setPopup(new Popup({ offset: 25 }).setHTML(`<h6>${attr.name}</h6><p class="small mb-0">${attr.description || ''}</p>`))
            .addTo(mapRef.current);

        attractionMarkerRef.current = marker;
        marker.togglePopup();
        mapRef.current.flyTo({ center: attr.coordinates, zoom: 12, padding: { bottom: 400 } });
    };

    const optimizeRoute = () => {
        if (stops.length < 3) return;

        let startPoint = origin ? origin.coordinates : stops[0].campLocation.coordinates;
        let unvisited = [...stops];
        let optimized = [];

        if (!origin) {
            optimized.push(unvisited.shift());
            startPoint = optimized[0].campLocation.coordinates;
        }

        while (unvisited.length > 0) {
            let nearestIdx = 0;
            let minDistance = Infinity;
            const from = turf.point(startPoint);

            for (let i = 0; i < unvisited.length; i++) {
                const to = turf.point(unvisited[i].campLocation.coordinates);
                const distance = turf.distance(from, to, { units: 'kilometers' });
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestIdx = i;
                }
            }

            const nextStop = unvisited.splice(nearestIdx, 1)[0];
            optimized.push(nextStop);
            startPoint = nextStop.campLocation.coordinates;
        }

        setStops(optimized);
        setAiInsights(null);
        setShowInsights(false);
    };

    // Fetch AI Insights
    const fetchInsights = async () => {
        if (stops.length === 0) return;

        setLoadingInsights(true);
        setShowInsights(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const payload = {
                stops: stops.map(s => ({ name: s.name, location: s.location, coordinates: s.campLocation.coordinates }))
            };

            if (origin) {
                payload.origin = origin;
            }

            const res = await axios.post(`${API_BASE}/api/trip/insights`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setAiInsights(res.data);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to generate insights. Try again.");
            setShowInsights(false);
        } finally {
            setLoadingInsights(false);
        }
    };

    // Helper: render **bold** markdown
    const renderMarkdown = (text) => {
        if (!text) return null;
        if (typeof text !== 'string') return text;
        return text.split('**').map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part);
    };

    // Render a single travel option row (reused for firstMile and legs)
    const renderTravelOption = (opt, i) => (
        <div key={i} className="travel-option">
            <div className={`travel-icon ${getTransportClass(opt.mode)}`}>
                <i className={`bi ${getTransportIcon(opt.mode)}`}></i>
            </div>
            <div className="travel-details">
                <div className="fw-bold">
                    {opt.mode}
                    {opt.bookingUrl && (
                        <a href={opt.bookingUrl} target="_blank" rel="noopener noreferrer" className="ms-2 badge bg-primary text-white text-decoration-none fw-normal">
                            <i className="bi bi-box-arrow-up-right me-1"></i>Book
                        </a>
                    )}
                    <span className="float-end travel-cost">{opt.cost}</span>
                </div>
                <div className="small text-muted">{opt.duration} {opt.provider ? `• ${opt.provider}` : ''}</div>
                {opt.notes && <div className="small text-muted fst-italic">{opt.notes}</div>}
            </div>
        </div>
    );

    const filteredCamps = allCampgrounds.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.location.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5);

    // Calculate straight-line total distance
    let totalDist = 0;
    if (origin && stops.length > 0) {
        totalDist += turf.distance(turf.point(origin.coordinates), turf.point(stops[0].campLocation.coordinates), { units: 'kilometers' });
    }
    for (let i = 0; i < stops.length - 1; i++) {
        totalDist += turf.distance(turf.point(stops[i].campLocation.coordinates), turf.point(stops[i + 1].campLocation.coordinates), { units: 'kilometers' });
    }

    return (
        <div className="trip-planner-container">
            {/* LEFT PANEL */}
            <div className="trip-planner-sidebar">
                <div className="sidebar-header">
                    <h4 className="mb-0"><i className="bi bi-compass me-2"></i>Smart Trip Planner</h4>
                    <p className="small mb-0 text-white-50">AI-powered routes & prices</p>

                    {/* Origin Setup */}
                    {origin ? (
                        <div className="user-location-badge mt-3 d-flex justify-content-between align-items-center">
                            <span><i className="bi bi-geo-alt-fill me-1"></i> {origin.name}</span>
                            <button className="btn btn-sm text-white ms-2 p-0" onClick={handleClearOrigin}><i className="bi bi-x-circle"></i></button>
                        </div>
                    ) : (
                        <div className="location-prompt-card">
                            <h6 className="mb-2">Where are you starting from?</h6>
                            <button className="btn btn-sm btn-light w-100 mb-2" onClick={handleUseMyLocation} disabled={locating}>
                                {locating ? <span className="spinner-border spinner-border-sm"></span> : <><i className="bi bi-crosshair me-1"></i> Use My Location</>}
                            </button>
                            <div className="d-flex align-items-center">
                                <hr className="flex-grow-1" style={{ borderColor: 'rgba(255,255,255,0.5)' }} />
                                <span className="mx-2 small">OR</span>
                                <hr className="flex-grow-1" style={{ borderColor: 'rgba(255,255,255,0.5)' }} />
                            </div>
                            <div className="location-input-group">
                                <input
                                    type="text"
                                    placeholder="Enter city..."
                                    value={originInput}
                                    onChange={(e) => setOriginInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleManualLocationSearch()}
                                />
                                <button className="btn btn-primary" onClick={handleManualLocationSearch} disabled={!originInput || locating}>Set</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Search */}
                <div className="planner-search-container">
                    <div className="d-flex mb-2 gap-2">
                        <button
                            className={`btn btn-sm flex-fill ${searchMode === 'campgrounds' ? 'btn-success' : 'btn-outline-success'}`}
                            onClick={() => { setSearchMode('campgrounds'); setSearchTerm(''); setTouristResults([]); }}
                        >
                            🏕️ Campgrounds
                        </button>
                        <button
                            className={`btn btn-sm flex-fill ${searchMode === 'tourist' ? 'btn-info text-white' : 'btn-outline-info'}`}
                            onClick={() => { setSearchMode('tourist'); setSearchTerm(''); }}
                        >
                            <i className="bi bi-stars"></i> Tourist Spots
                        </button>
                    </div>
                    <div className="d-flex gap-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder={searchMode === 'campgrounds' ? "Search campgrounds..." : "Search tourist spots (e.g. Eiffel Tower)..."}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && searchMode === 'tourist' && searchTouristPlaces()}
                        />
                        {searchMode === 'tourist' && (
                            <button className="btn btn-info text-white" onClick={searchTouristPlaces} disabled={!searchTerm || isSearchingTourist}>
                                {isSearchingTourist ? <span className="spinner-border spinner-border-sm"></span> : <i className="bi bi-search"></i>}
                            </button>
                        )}
                    </div>

                    {((searchTerm && searchMode === 'campgrounds') || (touristResults.length > 0 && searchMode === 'tourist')) && (
                        <div className="search-results-dropdown mt-2">
                            {searchMode === 'campgrounds' ? filteredCamps.map(camp => (
                                <div key={camp._id} className="search-result-item" onClick={() => handleAddStop(camp)}>
                                    <img src={camp.image[0]?.url} alt="" className="search-result-img" />
                                    <div>
                                        <div className="fw-bold">{camp.name}</div>
                                        <div className="small text-muted">{camp.location}</div>
                                    </div>
                                    <i className="bi bi-plus-circle ms-auto text-success fs-5"></i>
                                </div>
                            )) : touristResults.map(place => (
                                <div key={place._id} className="search-result-item" onClick={() => handleAddStop(place)}>
                                    <img
                                        src={place.image[0]?.url || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop'}
                                        alt=""
                                        className="search-result-img"
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop'; }}
                                    />
                                    <div>
                                        <div className="fw-bold text-info">{place.name}</div>
                                        <div className="small text-muted">{place.location}</div>
                                    </div>
                                    <i className="bi bi-plus-circle ms-auto text-info fs-5"></i>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Stops List */}
                <div className="stops-container">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0">Trip Stops ({stops.length})</h6>
                        <div className="d-flex gap-2">
                            {stops.length > 0 && (
                                <button className="btn btn-sm btn-outline-danger" onClick={handleClearAllStops}>
                                    <i className="bi bi-trash me-1"></i>Clear All
                                </button>
                            )}
                            {stops.length > 2 && (
                                <button className="btn btn-sm btn-outline-secondary" onClick={optimizeRoute}>
                                    <i className="bi bi-magic me-1"></i> Optimize
                                </button>
                            )}
                        </div>
                    </div>

                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="stops-list">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    {stops.map((stop, index) => (
                                        <Draggable key={stop._id} draggableId={stop._id} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    className={`stop-card ${snapshot.isDragging ? 'is-dragging' : ''}`}
                                                >
                                                    <div {...provided.dragHandleProps} className="drag-handle">
                                                        <i className="bi bi-grip-vertical fs-5"></i>
                                                    </div>
                                                    <div className="stop-number" style={{ backgroundColor: stop.isTouristSpot ? '#0dcaf0' : '#198754' }}>
                                                        {stop.isTouristSpot ? <i className="bi bi-star-fill text-white small"></i> : index + 1}
                                                    </div>
                                                    <div className="stop-info">
                                                        <div className={`fw-bold text-truncate ${stop.isTouristSpot ? 'text-info' : ''}`}>{stop.name}</div>
                                                        <div className="small text-muted text-truncate">{stop.location}</div>
                                                    </div>
                                                    <button className="btn text-danger p-1 ms-2" onClick={() => handleRemoveStop(stop._id)}>
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>

                    {stops.length === 0 && (
                        <div className="text-center text-muted mt-5">
                            <i className="bi bi-map display-4 text-light"></i>
                            <p className="mt-3">Search and add campgrounds to build your trip.</p>
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="trip-summary-footer">
                    <div className="d-flex justify-content-between mb-3 text-muted small">
                        <span><i className="bi bi-signpost-split me-1"></i> {stops.length} Stops</span>
                        <span><i className="bi bi-rulers me-1"></i> ~{Math.round(totalDist)} km (direct)</span>
                    </div>
                    {error && <div className="alert alert-danger py-2 small">{error}</div>}
                    <button
                        className="btn btn-success w-100"
                        disabled={stops.length === 0 || loadingInsights}
                        onClick={aiInsights ? () => setShowInsights(true) : fetchInsights}
                    >
                        {loadingInsights ? (
                            <><span className="spinner-border spinner-border-sm me-2"></span> Generating AI Insights...</>
                        ) : aiInsights ? (
                            <><i className="bi bi-eye me-2"></i> View AI Insights</>
                        ) : (
                            <><i className="bi bi-stars me-2"></i> Get AI Insights</>
                        )}
                    </button>
                </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="trip-planner-main">
                <div ref={mapContainer} className="map-container" />

                {/* AI Insights Sliding Panel */}
                <div className={`ai-insights-panel ${showInsights ? 'open' : ''}`}>
                    <div className="insights-header">
                        <h5 className="mb-0"><i className="bi bi-stars text-warning me-2"></i>AI Trip Intelligence</h5>
                        <button className="insights-close-btn" onClick={() => setShowInsights(false)}>
                            <i className="bi bi-x-circle-fill"></i>
                        </button>
                    </div>

                    <div className="insights-content">
                        {loadingInsights ? (
                            <div className="cards-grid">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="insight-card p-4">
                                        <div className="skeleton skeleton-title"></div>
                                        <div className="skeleton skeleton-text"></div>
                                        <div className="skeleton skeleton-text"></div>
                                        <div className="skeleton skeleton-text short"></div>
                                        <hr />
                                        <div className="skeleton skeleton-text"></div>
                                        <div className="skeleton skeleton-text"></div>
                                    </div>
                                ))}
                            </div>
                        ) : aiInsights ? (
                            <>
                                {/* Section 1: Trip Overview */}
                                <div className="mb-2">
                                    <h4 className="insights-section-title"><i className="bi bi-info-circle text-primary me-2"></i>Trip Overview</h4>
                                    <div className="px-3">
                                        <p className="mb-2"><strong>Total Distance:</strong> {aiInsights.tripSummary?.totalDistance || 'N/A'}</p>
                                        <p className="mb-2"><strong>Best Time:</strong> {renderMarkdown(aiInsights.tripSummary?.bestTimeToVisit)}</p>
                                        {aiInsights.tripSummary?.visaPermitInfo && <p className="mb-2"><strong>Visa/Permits:</strong> {renderMarkdown(aiInsights.tripSummary.visaPermitInfo)}</p>}
                                        {aiInsights.tripSummary?.currencyInfo && <p className="mb-2"><strong>Currency:</strong> {renderMarkdown(aiInsights.tripSummary.currencyInfo)}</p>}

                                        {aiInsights.tripSummary?.packingTips?.length > 0 && (
                                            <>
                                                <h6 className="mt-3 text-muted fw-bold">Packing Tips:</h6>
                                                <ul className="mb-0 text-muted">
                                                    {aiInsights.tripSummary.packingTips.map((tip, i) => <li key={i}>{renderMarkdown(tip)}</li>)}
                                                </ul>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Section 2: Travel Routes & Logistics */}
                                <div>
                                    <h4 className="insights-section-title"><i className="bi bi-map text-success me-2"></i>Travel Routes & Logistics</h4>
                                    <div className="cards-grid">
                                        {/* First Mile */}
                                        {aiInsights.firstMile && (
                                            <div className="insight-card border-primary">
                                                <div className="insight-card-header bg-primary text-white">
                                                    <i className="bi bi-house-door-fill me-2"></i>Getting to Start: {aiInsights.firstMile.to}
                                                </div>
                                                <div className="insight-card-body">
                                                    <p className="small text-muted"><i className="bi bi-rulers me-1"></i> {aiInsights.firstMile.distance} from {aiInsights.firstMile.from}</p>
                                                    {aiInsights.firstMile.travelOptions?.map(renderTravelOption)}
                                                    {aiInsights.firstMile.recommendation && (
                                                        <div className="alert alert-primary mt-3 py-2 small mb-0">
                                                            <strong>AI Rec:</strong> {aiInsights.firstMile.recommendation}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Legs */}
                                        {aiInsights.legs?.map((leg, idx) => (
                                            <div key={idx} className="insight-card">
                                                <div className="insight-card-header">
                                                    <i className="bi bi-signpost-split-fill text-success me-2"></i>Leg {idx + 1}: {leg.from} to {leg.to}
                                                </div>
                                                <div className="insight-card-body">
                                                    <p className="small text-muted"><i className="bi bi-rulers me-1"></i> {leg.distance} • <i className="bi bi-clock me-1"></i> {leg.driveTime}</p>
                                                    {leg.travelOptions?.map(renderTravelOption)}
                                                    {leg.routeSuggestion && (
                                                        <div className="alert alert-light border mt-3 py-2 small mb-0">
                                                            <strong>Route:</strong> {leg.routeSuggestion}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Section 3: Nearby Attractions */}
                                {(aiInsights.attractions?.length > 0 || aiInsights.stopInsights?.length > 0) && (
                                    <div>
                                        <h4 className="insights-section-title"><i className="bi bi-camera text-info me-2"></i>Nearby Attractions</h4>
                                        <div className="cards-grid">
                                            {/* Stop Attractions */}
                                            {aiInsights.stopInsights?.map((stop, idx) => (
                                                <div key={idx} className="insight-card">
                                                    <div className="insight-card-header">
                                                        <i className="bi bi-geo-alt-fill text-danger me-2"></i>{stop.stopName} Attractions
                                                    </div>
                                                    <div className="insight-card-body p-0">
                                                        <ul className="list-group list-group-flush">
                                                            {stop.nearbyAttractions?.map((attr, i) => (
                                                                <li
                                                                    key={i}
                                                                    className="list-group-item"
                                                                    style={{ cursor: attr.coordinates ? 'pointer' : 'default' }}
                                                                    onClick={() => handleAttractionClick(attr)}
                                                                >
                                                                    <div className="d-flex justify-content-between align-items-center">
                                                                        <strong className={`text-dark ${attr.coordinates ? 'text-decoration-underline' : ''}`}>{attr.name}</strong>
                                                                        <span className="badge bg-light text-dark border">{attr.distance}</span>
                                                                    </div>
                                                                    <div className="small text-muted mt-1">{attr.description}</div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Top Recommendations */}
                                            {aiInsights.attractions?.length > 0 && (
                                                <div className="insight-card border-info">
                                                    <div className="insight-card-header bg-info text-white">
                                                        <i className="bi bi-stars me-2"></i>Top Recommendations
                                                    </div>
                                                    <div className="insight-card-body p-0">
                                                        <ul className="list-group list-group-flush">
                                                            {aiInsights.attractions.map((attr, idx) => (
                                                                <li key={idx} className="list-group-item d-flex justify-content-between align-items-center" style={{ cursor: 'pointer' }} onClick={() => handleAttractionClick(attr)}>
                                                                    <div>
                                                                        <h6 className="mb-0 text-primary" style={{ textDecoration: 'underline' }}>{attr.name}</h6>
                                                                        <small className="text-muted">{attr.description}</small>
                                                                    </div>
                                                                    <i className="bi bi-geo-alt-fill text-danger fs-5"></i>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TripPlanner;
