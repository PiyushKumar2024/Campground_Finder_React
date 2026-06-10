import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const TripPlannerSidebar = ({
    // Origin State & Handlers
    origin,
    originInput,
    setOriginInput,
    locating,
    handleUseMyLocation,
    handleManualLocationSearch,
    handleClearOrigin,

    // Search State & Handlers
    searchMode,
    setSearchMode,
    searchTerm,
    setSearchTerm,
    touristResults,
    setTouristResults,
    isSearchingTourist,
    searchTouristPlaces,
    filteredCamps,
    handleAddStop,

    // Stops State & Handlers
    stops,
    handleClearAllStops,
    optimizeRoute,
    onDragEnd,
    handleRemoveStop,

    // Footer/Insights State
    totalDist,
    error,
    loadingInsights,
    aiInsights,
    setShowInsights,
    fetchInsights
}) => {
    return (
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
                                                <div className="stop-number" style={{ backgroundColor: stop.isTouristSpot ? '#0dcaf0' : '#10b981' }}>
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
                        <p className="mt-3">Search and add destinations to build your trip.</p>
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
    );
};

export default TripPlannerSidebar;
