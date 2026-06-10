import React, { useEffect, useRef, useState } from 'react';
import { Map, MapStyle, Marker, Popup } from '@maptiler/sdk';
import * as turf from '@turf/turf';

const CampgroundMap = ({ camp }) => {
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [userDistance, setUserDistance] = useState(null);
    const [clickedDistance, setClickedDistance] = useState(null);
    const [clickedLocation, setClickedLocation] = useState(null);

    const clickedMarkerRef = useRef(null);
    const userMarkerRef = useRef(null);

    // Initialize Map
    useEffect(() => {
        if (!camp || !camp.campLocation || !mapRef.current) return;

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
        });

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
    }, [camp]);

    // Handle User Location
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
            // Silently fail or handle error if needed
        });
    }, [map]);

    // Calculate User Distance
    useEffect(() => {
        if (camp && camp.campLocation && userLocation) {
            const from = turf.point(userLocation);
            const to = turf.point(camp.campLocation.coordinates);
            const calculatedDistance = turf.distance(from, to, { units: 'kilometers' });
            setUserDistance(calculatedDistance);
        }
    }, [camp, userLocation]);

    // Handle Clicked Location and Route
    useEffect(() => {
        if (!clickedLocation || !map || !camp) return;
        const from = turf.point(camp.campLocation.coordinates);
        const to = turf.point(clickedLocation);
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
    }, [clickedLocation, map, camp]);

    return (
        <div className="mb-5">
            <h3 className="fw-bold mb-1">Where you'll be</h3>
            <p className="text-muted mb-3" style={{ fontSize: '0.95rem' }}>{camp.location}</p>
            <div className="map-detail-wrapper">
                <div ref={mapRef} className="map-detail-canvas"></div>
                {(userDistance || clickedDistance) && (
                    <div className="map-detail-info">
                        {userDistance &&
                            <span className="map-info-badge">
                                <i className="bi bi-cursor-fill"></i>{userDistance.toFixed(1)} km from you
                            </span>
                        }
                        {clickedDistance &&
                            <span className="map-info-badge map-info-badge-secondary">
                                <i className="bi bi-geo"></i>{clickedDistance.toFixed(1)} km to pin
                            </span>
                        }
                    </div>
                )}
            </div>
            <p className="text-muted mt-2" style={{ fontSize: '0.8rem' }}><i className="bi bi-info-circle me-1"></i>Click anywhere on the map to measure distance from the campground</p>
        </div>
    );
};

export default CampgroundMap;
