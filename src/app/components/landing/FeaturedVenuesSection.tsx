import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { fetchFeaturedVenues, adaptVenue } from '../../../lib/api/venues';
import type { Venue } from '../../../data/types';
import VenueCard from '../browse/VenueCard';

export default function FeaturedVenuesSection() {
  const [featured, setFeatured] = useState<Venue[]>([]);

  useEffect(() => {
    fetchFeaturedVenues()
      .then((rows) => setFeatured(rows.slice(0, 6).map((r) => adaptVenue(r))))
      .catch(() => {});
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2">
              Top Picks
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Featured Event Centers
            </h2>
            <p className="text-gray-500 mt-2 max-w-md">
              Handpicked premium venues trusted by thousands of event planners across Nigeria.
            </p>
          </div>
          <Link
            to="/browse"
            className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors group flex-shrink-0"
          >
            View All Venues
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid — skeleton while loading */}
        {featured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-gray-100 animate-pulse aspect-[4/3]" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
