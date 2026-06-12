/**
 * @file TripPlanner.jsx
 * @description AI-Powered Trip Planner.
 * Allows users to search for destinations, build an itinerary via drag-and-drop,
 * and fetch AI-generated insights via the Gemini API.
 */
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

import TripPlannerSidebar from './TripPlannerSidebar';
import TripPlannerInsights from './TripPlannerInsights';

const TripPlanner = () => {
    // State
    const [allCampgrounds, setAllCampgrounds] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchMode, setSearchMode] = useState('campgrounds');
    const [touristResults, setTouristResults] = useState([]);
    const [isSearchingTourist, setIsSearchingTourist] = useState(false);
    const [stops, setStops] = useState([]);

    useEffect(() => {
        document.title = "Explorion | AI Trip Planner";
    }, []);

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
                paint: { 'line-color': '#10b981', 'line-width': 4, 'line-dasharray': [1, 0] }
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
                paint: { 'line-color': '#3b82f6', 'line-width': 3, 'line-dasharray': [2, 4] }
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
            el.style.backgroundColor = stop.isTouristSpot ? '#0dcaf0' : '#10b981';
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
            <TripPlannerSidebar
                origin={origin}
                originInput={originInput}
                setOriginInput={setOriginInput}
                locating={locating}
                handleUseMyLocation={handleUseMyLocation}
                handleManualLocationSearch={handleManualLocationSearch}
                handleClearOrigin={handleClearOrigin}
                searchMode={searchMode}
                setSearchMode={setSearchMode}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                touristResults={touristResults}
                setTouristResults={setTouristResults}
                isSearchingTourist={isSearchingTourist}
                searchTouristPlaces={searchTouristPlaces}
                filteredCamps={filteredCamps}
                handleAddStop={handleAddStop}
                stops={stops}
                handleClearAllStops={handleClearAllStops}
                optimizeRoute={optimizeRoute}
                onDragEnd={onDragEnd}
                handleRemoveStop={handleRemoveStop}
                totalDist={totalDist}
                error={error}
                loadingInsights={loadingInsights}
                aiInsights={aiInsights}
                setShowInsights={setShowInsights}
                fetchInsights={fetchInsights}
            />

            {/* RIGHT PANEL */}
            <div className="trip-planner-main">
                <div ref={mapContainer} className="map-container" />

                {/* AI Insights Sliding Panel */}
                <TripPlannerInsights
                    showInsights={showInsights}
                    setShowInsights={setShowInsights}
                    loadingInsights={loadingInsights}
                    aiInsights={aiInsights}
                    handleAttractionClick={handleAttractionClick}
                />
            </div>
        </div>
    );
};

export default TripPlanner;
