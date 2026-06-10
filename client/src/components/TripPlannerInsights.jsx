import React from 'react';

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

const TripPlannerInsights = ({
    showInsights,
    setShowInsights,
    loadingInsights,
    aiInsights,
    handleAttractionClick
}) => {

    // Helper: render **bold** markdown
    const renderMarkdown = (text) => {
        if (!text) return null;
        if (typeof text !== 'string') return text;
        return text.split('**').map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part);
    };

    // Render a single travel option row
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

    return (
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
    );
};

export default TripPlannerInsights;
