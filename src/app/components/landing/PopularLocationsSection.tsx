import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { popularLocations } from '../../../data/venues';

export default function PopularLocationsSection() {
  const navigate = useNavigate();
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2">
            Explore by City
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Popular Locations
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Discover event centers in Nigeria's most vibrant cities.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {popularLocations.map((loc) => (
            <button
              key={loc.city}
              onClick={() => navigate(`/browse?location=${loc.city}`)}
              onMouseEnter={() => setHoveredCity(loc.city)}
              onMouseLeave={() => setHoveredCity(null)}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer"
            >
              {/* Image */}
              <img
                src={loc.image}
                alt={loc.city}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80';
                }}
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                <div className="flex items-center gap-1 mb-1">
                  <MapPin className="h-3.5 w-3.5 text-white/80" />
                  <span className="text-white/70 text-xs">{loc.state}</span>
                </div>
                <p className="text-white font-bold text-lg leading-tight">{loc.city}</p>
                <p className="text-white/70 text-xs mt-0.5">
                  {loc.venueCount} venue{loc.venueCount !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Hover Overlay */}
              <div
                className={`absolute inset-0 bg-blue-600/20 transition-opacity duration-300 ${
                  hoveredCity === loc.city ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
