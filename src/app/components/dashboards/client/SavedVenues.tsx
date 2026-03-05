import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../ui/button';
import { Heart, MapPin, Star, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../../context/AuthContext';
import { fetchSavedVenues, unsaveVenue } from '../../../../lib/api/bookings';

interface SavedItem {
  id: string;
  venueId: string;
  savedDate: string;
  venue: {
    name: string; city: string; state: string; rating: number;
    review_count: number; price_from: number; cover_image: string | null; verified: boolean;
  };
}

export default function SavedVenues() {
  const { user } = useAuth();
  const [saved, setSaved] = useState<SavedItem[]>([]);

  useEffect(() => {
    if (!user?.id) return;
    fetchSavedVenues(user.id).then((rows: any[]) => {
      setSaved(rows.filter((r) => r.venues).map((r) => ({
        id: r.id,
        venueId: r.venue_id,
        savedDate: r.saved_date,
        venue: r.venues,
      })));
    }).catch(() => {});
  }, [user?.id]);

  const handleRemove = async (id: string, venueId: string) => {
    try {
      if (user?.id) await unsaveVenue(user.id, venueId);
      setSaved((prev) => prev.filter((s) => s.id !== id));
      toast.success('Venue removed from saved list.');
    } catch {
      toast.error('Failed to remove venue.');
    }
  };

  const savedWithData = saved;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Saved Venues</h2>
        <p className="text-sm text-gray-500">{savedWithData.length} venue{savedWithData.length !== 1 ? 's' : ''} saved</p>
      </div>

      {savedWithData.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No saved venues yet</p>
          <p className="text-sm text-gray-400 mb-4">Browse venues and heart the ones you love</p>
          <Link to="/browse">
            <Button>Browse Venues</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {savedWithData.map(({ id, venueId, savedDate, venue }) => (
            <div key={id} className="bg-white rounded-xl border overflow-hidden hover:shadow-md transition-shadow group">
              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={venue.cover_image ?? ''}
                  alt={venue.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=300&fit=crop'; }}
                />
                {venue.verified && (
                  <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">Verified</span>
                )}
                <button
                  onClick={() => handleRemove(id, venueId)}
                  className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors shadow"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{venue.name}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                  <MapPin className="h-3.5 w-3.5" />
                  {venue.city}, {venue.state}
                </div>
                <div className="flex items-center gap-3 text-sm mb-3">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span className="font-medium text-gray-700">{venue.rating}</span>
                    <span className="text-gray-400">({venue.review_count})</span>
                  </div>
                  <span className="text-gray-400">·</span>
                  <span className="text-green-700 font-medium">from ₦{venue.price_from.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-400 mb-3">Saved on {new Date(savedDate).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}</p>

                <div className="flex gap-2">
                  <Link to={`/venue/${venueId}`} className="flex-1">
                    <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> View Venue
                    </Button>
                  </Link>
                  <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50" onClick={() => handleRemove(id, venueId)}>
                    <Heart className="h-3.5 w-3.5 fill-current" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
