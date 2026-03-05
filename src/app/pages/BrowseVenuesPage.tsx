import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { fetchVenues, adaptVenue } from '../../lib/api/venues';
import type { Venue } from '../../data/types';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import VenueCard from '../components/browse/VenueCard';
import VenueFilters from '../components/browse/VenueFilters';
import SmartSuggestions from '../components/browse/SmartSuggestions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

interface Filters {
  location: string;
  type: string;
  guests: string;
  budget: string;
  facilities: string[];
}

function scoreVenue(venue: Venue, filters: Filters): number {
  let score = 0;
  if (filters.location && venue.city.toLowerCase() === filters.location.toLowerCase()) score += 3;
  if (filters.type && venue.category === filters.type) score += 2;
  if (filters.budget) {
    const budget = Number(filters.budget);
    if (venue.priceFrom <= budget) score += 2;
  }
  if (filters.guests) {
    const max = filters.guests.includes('+')
      ? parseInt(filters.guests)
      : parseInt(filters.guests.split('-')[1] || filters.guests);
    if (venue.maxCapacity >= max) score += 2;
  }
  if (filters.facilities.length > 0) {
    const matched = filters.facilities.filter((f) => venue.facilities.includes(f));
    score += matched.length;
  }
  if (venue.featured) score += 1;
  return score;
}

export default function BrowseVenuesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState<string>('featured');
  const [allVenues, setAllVenues] = useState<Venue[]>([]);
  const [filters, setFilters] = useState<Filters>({
    location: searchParams.get('location') || '',
    type: searchParams.get('type') || '',
    guests: searchParams.get('guests') || '',
    budget: searchParams.get('budget') || '',
    facilities: [],
  });

  useEffect(() => {
    fetchVenues()
      .then((rows) => setAllVenues(rows.map((r) => adaptVenue(r))))
      .catch(() => {});
  }, []);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    const params: Record<string, string> = {};
    if (newFilters.location && newFilters.location !== 'all') params.location = newFilters.location;
    if (newFilters.type && newFilters.type !== 'all') params.type = newFilters.type;
    if (newFilters.guests && newFilters.guests !== 'all') params.guests = newFilters.guests;
    if (newFilters.budget) params.budget = newFilters.budget;
    setSearchParams(params);
  };

  const handleReset = () => {
    const reset: Filters = { location: '', type: '', guests: '', budget: '', facilities: [] };
    setFilters(reset);
    setSearchParams({});
  };

  const hasSmartSearch =
    (filters.location && filters.location !== 'all') ||
    (filters.type && filters.type !== 'all') ||
    (filters.guests && filters.guests !== 'all') ||
    filters.budget;

  const filteredAndScored = useMemo(() => {
    let results = allVenues.filter((v) => {
      if (filters.location && filters.location !== 'all') {
        if (v.city.toLowerCase() !== filters.location.toLowerCase()) return false;
      }
      if (filters.type && filters.type !== 'all') {
        if (v.category !== filters.type) return false;
      }
      if (filters.budget) {
        if (v.priceFrom > Number(filters.budget)) return false;
      }
      if (filters.guests && filters.guests !== 'all') {
        const minGuests = parseInt(filters.guests.split('-')[0]);
        if (v.maxCapacity < minGuests) return false;
      }
      if (filters.facilities.length > 0) {
        const hasAll = filters.facilities.every((f) => v.facilities.includes(f));
        if (!hasAll) return false;
      }
      return true;
    });

    const scored = results.map((v) => ({ venue: v, score: scoreVenue(v, filters) }));

    switch (sortBy) {
      case 'price-asc':
        scored.sort((a, b) => a.venue.priceFrom - b.venue.priceFrom);
        break;
      case 'price-desc':
        scored.sort((a, b) => b.venue.priceFrom - a.venue.priceFrom);
        break;
      case 'rating':
        scored.sort((a, b) => b.venue.rating - a.venue.rating);
        break;
      case 'capacity':
        scored.sort((a, b) => b.venue.maxCapacity - a.venue.maxCapacity);
        break;
      default:
        scored.sort((a, b) => b.score - a.score);
    }

    return scored;
  }, [allVenues, filters, sortBy]);

  const maxScore = filteredAndScored.length > 0 ? filteredAndScored[0].score : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Home
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm text-gray-700 font-medium">Browse Venues</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <VenueFilters
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleReset}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Smart Suggestions */}
            {hasSmartSearch && (
              <SmartSuggestions
                location={filters.location !== 'all' ? filters.location : ''}
                type={filters.type !== 'all' ? filters.type : ''}
                guests={filters.guests !== 'all' ? filters.guests : ''}
                budget={filters.budget}
                resultCount={filteredAndScored.length}
                onClear={handleReset}
              />
            )}

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600 text-sm">
                <span className="font-semibold text-gray-900">{filteredAndScored.length}</span>{' '}
                venue{filteredAndScored.length !== 1 ? 's' : ''} found
              </p>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 hidden sm:inline">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-44 h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Best Match</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="capacity">Largest Capacity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Venue Grid */}
            {filteredAndScored.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredAndScored.map(({ venue, score }) => (
                  <VenueCard
                    key={venue.id}
                    venue={venue}
                    bestMatch={hasSmartSearch && score === maxScore && score > 0}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No venues found</h3>
                <p className="text-gray-500 mb-6 max-w-md">
                  Try adjusting your filters — for example, expanding the capacity range or removing some facility requirements.
                </p>
                <button
                  onClick={handleReset}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
