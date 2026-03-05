import React from 'react';
import { Users, Maximize2, Thermometer, Clock, CalendarDays } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import type { VenueHall } from '../../../data/types';

interface VenueHallsGridProps {
  halls: VenueHall[];
  recommendedHallId?: string;
}

const typeColors: Record<string, string> = {
  indoor: 'bg-blue-50 text-blue-700 border-blue-100',
  outdoor: 'bg-green-50 text-green-700 border-green-100',
  mixed: 'bg-purple-50 text-purple-700 border-purple-100',
};

export default function VenueHallsGrid({ halls, recommendedHallId }: VenueHallsGridProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-gray-900">Available Halls</h2>
        <Badge variant="secondary">{halls.length} hall{halls.length !== 1 ? 's' : ''}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {halls.map((hall) => (
          <div
            key={hall.id}
            className={`rounded-2xl border-2 overflow-hidden transition-all duration-300 hover:shadow-lg ${
              recommendedHallId === hall.id
                ? 'border-orange-300 shadow-orange-100 shadow-md'
                : 'border-gray-100 hover:border-blue-200'
            }`}
          >
            {/* Hall Image */}
            {hall.images.length > 0 && (
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={hall.images[0]}
                  alt={hall.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80';
                  }}
                />
                {recommendedHallId === hall.id && (
                  <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    Recommended
                  </div>
                )}
              </div>
            )}

            <div className="p-5">
              {/* Hall Name + Type */}
              <div className="flex items-start justify-between mb-3 gap-2">
                <h3 className="font-bold text-gray-900 text-lg leading-tight">{hall.name}</h3>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex-shrink-0 capitalize ${typeColors[hall.type]}`}
                >
                  {hall.type}
                </span>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Seating</p>
                    <p className="font-semibold text-gray-800">{hall.seatingCapacity.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4 text-purple-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Standing</p>
                    <p className="font-semibold text-gray-800">{hall.standingCapacity.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Maximize2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Size</p>
                    <p className="font-semibold text-gray-800">{hall.sizesqm.toLocaleString()} m²</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Thermometer className="h-4 w-4 text-orange-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Air Con</p>
                    <p className={`font-semibold ${hall.airConditioned ? 'text-green-600' : 'text-gray-500'}`}>
                      {hall.airConditioned ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="flex gap-3 p-3 bg-gray-50 rounded-xl mb-4">
                <div className="flex-1 text-center">
                  <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-0.5">
                    <Clock className="h-3 w-3" />
                    Per Hour
                  </div>
                  <p className="font-bold text-blue-600">₦{hall.pricePerHour.toLocaleString()}</p>
                </div>
                <div className="w-px bg-gray-200" />
                <div className="flex-1 text-center">
                  <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-0.5">
                    <CalendarDays className="h-3 w-3" />
                    Per Day
                  </div>
                  <p className="font-bold text-blue-600">₦{hall.pricePerDay.toLocaleString()}</p>
                </div>
              </div>

              {/* Facilities */}
              {hall.facilities.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {hall.facilities.map((f) => (
                    <span key={f} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                      {f}
                    </span>
                  ))}
                </div>
              )}

              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="sm">
                Book This Hall
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
