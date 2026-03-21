import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Star, Heart, BadgeCheck } from 'lucide-react';
import { Badge } from '../ui/badge';
import { cn } from '../ui/utils';
import type { Venue } from '../../../data/types';

interface VenueCardProps {
  venue: Venue;
  bestMatch?: boolean;
  avgPrice?: number;
  className?: string;
}

const categoryLabels: Record<string, string> = {
  wedding: 'Wedding',
  conference: 'Conference',
  party: 'Party',
  outdoor: 'Outdoor',
  corporate: 'Corporate',
  banquet: 'Banquet',
};

function getBudgetTier(price: number, avg: number): { label: string; className: string } | null {
  if (avg <= 0) return null;
  const ratio = price / avg;
  if (ratio < 0.75) return { label: '🟢 Great Value', className: 'bg-green-100 text-green-700 border border-green-200' };
  if (ratio > 1.30) return { label: '💎 Premium', className: 'bg-purple-100 text-purple-700 border border-purple-200' };
  return null;
}

export default function VenueCard({ venue, bestMatch, avgPrice, className }: VenueCardProps) {
  const [liked, setLiked] = useState(false);
  const [imgError, setImgError] = useState(false);
  const budgetTier = avgPrice ? getBudgetTier(venue.priceFrom, avgPrice) : null;

  return (
    <Link
      to={`/venue/${venue.id}`}
      className={cn(
        'group block bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300',
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {!imgError ? (
          <img
            src={venue.coverImage}
            alt={venue.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-4xl opacity-40">🏛️</span>
          </div>
        )}

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {venue.verified && (
            <span className="flex items-center gap-1 bg-white/95 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
              <BadgeCheck className="h-3 w-3" />
              Verified
            </span>
          )}
          {bestMatch && (
            <span className="bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
              Best Match
            </span>
          )}
        </div>

        {/* Heart */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setLiked(!liked);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white shadow-sm transition-colors"
          aria-label="Save to favorites"
        >
          <Heart
            className={cn(
              'h-4 w-4 transition-colors',
              liked ? 'fill-red-500 text-red-500' : 'text-gray-600'
            )}
          />
        </button>

        {/* Category tag */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-blue-600/90 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
            {categoryLabels[venue.category] || venue.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-gray-900 text-base leading-tight group-hover:text-blue-600 transition-colors line-clamp-1">
            {venue.name}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium text-gray-800">{venue.rating}</span>
            <span className="text-xs text-gray-400">({venue.reviewCount})</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="line-clamp-1">
            {venue.address}, {venue.city}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-gray-500 text-sm">
            <Users className="h-3.5 w-3.5" />
            <span>Up to {venue.maxCapacity.toLocaleString()} guests</span>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">From</p>
            <p className="text-sm font-bold text-blue-600">
              ₦{venue.priceFrom.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Halls count */}
        <div className="mt-3 pt-3 border-t border-gray-50 flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="text-xs">
            {venue.halls.length} hall{venue.halls.length > 1 ? 's' : ''}
          </Badge>
          {budgetTier && (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${budgetTier.className}`}>
              {budgetTier.label}
            </span>
          )}
          <div className="flex gap-1 flex-wrap">
            {venue.facilities.slice(0, 3).map((f) => (
              <span key={f} className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                {f}
              </span>
            ))}
            {venue.facilities.length > 3 && (
              <span className="text-xs text-gray-400">+{venue.facilities.length - 3}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
