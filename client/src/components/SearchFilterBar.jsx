import { useState } from 'react';
import { amenityOptions } from '../config/icons';
import '../css/SearchFilterBar.css';

const SearchFilterBar = ({ filters, onFilterChange }) => {
    const [filtersOpen, setFiltersOpen] = useState(false);

    // Count active filters (excluding search and sort since they're always visible)
    const activeFilterCount = [
        filters.amenities.length > 0,
        filters.minPrice !== '',
        filters.maxPrice !== '',
    ].filter(Boolean).length;

    const hasAnyFilter = filters.search || filters.minPrice || filters.maxPrice || filters.amenities.length > 0;

    const handleAmenityToggle = (value) => {
        const updated = filters.amenities.includes(value)
            ? filters.amenities.filter(a => a !== value)
            : [...filters.amenities, value];
        onFilterChange({ amenities: updated, page: 1 });
    };

    const handleClearAll = () => {
        onFilterChange({
            search: '',
            minPrice: '',
            maxPrice: '',
            amenities: [],
            sort: 'newest',
            page: 1
        });
    };

    const removeFilter = (type, value) => {
        switch (type) {
            case 'search':
                onFilterChange({ search: '', page: 1 });
                break;
            case 'minPrice':
                onFilterChange({ minPrice: '', page: 1 });
                break;
            case 'maxPrice':
                onFilterChange({ maxPrice: '', page: 1 });
                break;
            case 'amenity':
                onFilterChange({
                    amenities: filters.amenities.filter(a => a !== value),
                    page: 1
                });
                break;
            default:
                break;
        }
    };

    // Get the label for an amenity value
    const getAmenityLabel = (value) => {
        for (const cat of amenityOptions) {
            const found = cat.amenities.find(a => a.value === value);
            if (found) return found.label;
        }
        return value;
    };

    return (
        <div className="search-filter-bar">
            {/* Search Row: search input + sort + filter toggle */}
            <div className="search-row">
                <div className="search-input-wrapper">
                    <i className="bi bi-search"></i>
                    <input
                        type="text"
                        placeholder="Search campgrounds by name, location..."
                        value={filters.search}
                        onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
                    />
                </div>

                <div className="sort-select-wrapper">
                    <select
                        value={filters.sort}
                        onChange={(e) => onFilterChange({ sort: e.target.value, page: 1 })}
                    >
                        <option value="newest">Newest First</option>
                        <option value="price_asc">Price: Low → High</option>
                        <option value="price_desc">Price: High → Low</option>
                    </select>
                </div>

                <button
                    className={`filter-toggle-btn ${filtersOpen ? 'active' : ''}`}
                    onClick={() => setFiltersOpen(!filtersOpen)}
                >
                    <i className="bi bi-sliders"></i>
                    Filters
                    {activeFilterCount > 0 && (
                        <span className="filter-count-badge">{activeFilterCount}</span>
                    )}
                </button>
            </div>

            {/* Expandable Filter Panel */}
            <div className={`filter-panel ${filtersOpen ? 'open' : ''}`}>
                {/* Price Range */}
                <div className="price-range-section">
                    <div className="filter-section-label">Price Range (per night)</div>
                    <div className="price-inputs">
                        <div className="price-input-wrapper">
                            <span>$</span>
                            <input
                                type="number"
                                placeholder="Min"
                                min="0"
                                value={filters.minPrice}
                                onChange={(e) => onFilterChange({ minPrice: e.target.value, page: 1 })}
                            />
                        </div>
                        <span className="price-divider">—</span>
                        <div className="price-input-wrapper">
                            <span>$</span>
                            <input
                                type="number"
                                placeholder="Max"
                                min="0"
                                value={filters.maxPrice}
                                onChange={(e) => onFilterChange({ maxPrice: e.target.value, page: 1 })}
                            />
                        </div>
                    </div>
                </div>

                {/* Amenity Chips */}
                <div className="amenity-chips-section">
                    <div className="filter-section-label">Amenities</div>
                    <div className="amenity-chips-grid">
                        {amenityOptions.map(cat =>
                            cat.amenities.map(amenity => {
                                const isSelected = filters.amenities.includes(amenity.value);
                                return (
                                    <div
                                        key={amenity.value}
                                        className={`amenity-chip ${isSelected ? 'selected' : ''}`}
                                        onClick={() => handleAmenityToggle(amenity.value)}
                                    >
                                        {isSelected ? amenity.activeIcon : amenity.passiveIcon}
                                        {amenity.label}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* Active Filters Bar */}
            {hasAnyFilter && (
                <div className="active-filters-bar">
                    {filters.search && (
                        <span className="active-filter-pill">
                            Search: "{filters.search}"
                            <button onClick={() => removeFilter('search')}>✕</button>
                        </span>
                    )}
                    {filters.minPrice && (
                        <span className="active-filter-pill">
                            Min: ${filters.minPrice}
                            <button onClick={() => removeFilter('minPrice')}>✕</button>
                        </span>
                    )}
                    {filters.maxPrice && (
                        <span className="active-filter-pill">
                            Max: ${filters.maxPrice}
                            <button onClick={() => removeFilter('maxPrice')}>✕</button>
                        </span>
                    )}
                    {filters.amenities.map(a => (
                        <span key={a} className="active-filter-pill">
                            {getAmenityLabel(a)}
                            <button onClick={() => removeFilter('amenity', a)}>✕</button>
                        </span>
                    ))}
                    <button className="clear-all-btn" onClick={handleClearAll}>
                        Clear all
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchFilterBar;
