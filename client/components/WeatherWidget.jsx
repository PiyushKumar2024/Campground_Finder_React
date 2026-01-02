import { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherWidget = ({ lat, lng }) => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // Using Open-Meteo API (Free, no key required)
                const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
                const res = await axios.get(url);
                setWeather(res.data);
                setLoading(false);
            } catch (e) {
                console.error("Failed to fetch weather", e);
                setError(true);
                setLoading(false);
            }
        };

        if (lat && lng) {
            fetchWeather();
        }
    }, [lat, lng]);

    if (loading) return (
        <div className="card shadow-sm mb-3">
            <div className="card-body text-center py-3">
                <div className="spinner-border spinner-border-sm text-secondary" role="status">
                    <span className="visually-hidden">Loading weather...</span>
                </div>
            </div>
        </div>
    );

    if (error || !weather) return null;

    const { current, daily } = weather;
    const { temperature_2m, weather_code, relative_humidity_2m, apparent_temperature, wind_speed_10m } = current;
    const maxTemp = daily.temperature_2m_max[0];
    const minTemp = daily.temperature_2m_min[0];

    // Map WMO codes to Bootstrap Icons
    const getIcon = (code) => {
        if (code === 0) return 'bi-sun-fill text-warning'; // Clear sky
        if (code >= 1 && code <= 3) return 'bi-cloud-sun-fill text-secondary'; // Partly cloudy
        if (code >= 45 && code <= 48) return 'bi-cloud-fog2-fill text-secondary'; // Fog
        if (code >= 51 && code <= 67) return 'bi-cloud-drizzle-fill text-info'; // Drizzle/Rain
        if (code >= 71 && code <= 77) return 'bi-snow2 text-info'; // Snow
        if (code >= 80 && code <= 82) return 'bi-cloud-rain-heavy-fill text-primary'; // Showers
        if (code >= 95 && code <= 99) return 'bi-cloud-lightning-rain-fill text-warning'; // Thunderstorm
        return 'bi-cloud-fill text-secondary';
    };

    const getConditionText = (code) => {
         if (code === 0) return 'Clear Sky';
         if (code >= 1 && code <= 3) return 'Partly Cloudy';
         if (code >= 45 && code <= 48) return 'Foggy';
         if (code >= 51 && code <= 67) return 'Rainy';
         if (code >= 71 && code <= 77) return 'Snowy';
         if (code >= 80 && code <= 82) return 'Showers';
         if (code >= 95 && code <= 99) return 'Thunderstorm';
         return 'Cloudy';
    }

    return (
        <div className="card shadow-sm mb-3 border-0" style={{background: 'linear-gradient(to right, #f8f9fa, #ffffff)'}}>
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h6 className="text-muted mb-1 text-uppercase small fw-bold">Local Weather</h6>
                        <div className="d-flex align-items-center">
                            <h2 className="mb-0 fw-bold me-2">{temperature_2m}°C</h2>
                            <div className="d-flex flex-column">
                                <small className="text-muted" style={{fontSize: '0.8rem'}}>H: {maxTemp}°</small>
                                <small className="text-muted" style={{fontSize: '0.8rem'}}>L: {minTemp}°</small>
                            </div>
                        </div>
                        <p className="mb-0 text-secondary small">{getConditionText(weather_code)}</p>
                    </div>
                    <i className={`bi ${getIcon(weather_code)}`} style={{ fontSize: '3rem' }}></i>
                </div>
                
                <div className="row text-center border-top pt-2">
                    <div className="col-4 border-end">
                        <small className="text-muted d-block" style={{fontSize: '0.7rem'}}>FEELS LIKE</small>
                        <span className="fw-bold small">{apparent_temperature}°</span>
                    </div>
                    <div className="col-4 border-end">
                        <small className="text-muted d-block" style={{fontSize: '0.7rem'}}>HUMIDITY</small>
                        <span className="fw-bold small">{relative_humidity_2m}%</span>
                    </div>
                    <div className="col-4">
                        <small className="text-muted d-block" style={{fontSize: '0.7rem'}}>WIND</small>
                        <span className="fw-bold small">{wind_speed_10m} km/h</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherWidget;