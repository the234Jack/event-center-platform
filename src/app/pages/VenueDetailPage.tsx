import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, MapPin, Star, BadgeCheck, Users, Building2, Phone, Mail
} from 'lucide-react';
import { fetchVenueById, fetchSimilarVenues, adaptVenue } from '../../lib/api/venues';
import type { Venue } from '../../data/types';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import VenueGallery from '../components/venue-detail/VenueGallery';
import VenueHallsGrid from '../components/venue-detail/VenueHallsGrid';
import VenueFacilitiesIcons from '../components/venue-detail/VenueFacilitiesIcons';
import BookingWidget from '../components/venue-detail/BookingWidget';
import VenueCard from '../components/browse/VenueCard';
import { Badge } from '../components/ui/badge';

const categoryLabels: Record<string, string> = {
  wedding: 'Wedding', conference: 'Conference', party: 'Party',
  outdoor: 'Outdoor', corporate: 'Corporate', banquet: 'Banquet',
};

export default function VenueDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recommendedHallId, setRecommendedHallId] = useState('');
  const [venue, setVenue] = useState<Venue | null>(null);
  const [similarVenues, setSimilarVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    fetchVenueById(id)
      .then((row) => {
        if (!row) { setLoading(false); return; }
        const adapted = adaptVenue(row, row.halls);
        setVenue(adapted);
        return fetchSimilarVenues(id, row.city, 3);
      })
      .then((rows) => {
        if (rows) setSimilarVenues(rows.map((r) => adaptVenue(r)));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 pt-32 flex justify-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 pt-32 text-center">
          <div className="text-6xl mb-4">🏛️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Venue Not Found</h1>
          <p className="text-gray-500 mb-6">The venue you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/browse')}
            className="text-blue-600 hover:underline font-medium"
          >
            Browse all venues →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Link to="/" className="text-gray-400 hover:text-blue-600 transition-colors">Home</Link>
          <span className="text-gray-300">/</span>
          <Link
            to="/browse"
            className="text-gray-400 hover:text-blue-600 transition-colors"
          >
            Browse Venues
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-700 font-medium truncate max-w-xs">{venue.name}</span>
        </div>

        {/* Venue Name Header */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            {venue.verified && (
              <span className="flex items-center gap-1 text-blue-600 bg-blue-50 border border-blue-100 text-xs font-semibold px-2.5 py-1 rounded-full">
                <BadgeCheck className="h-3.5 w-3.5" />
                Verified
              </span>
            )}
            <Badge variant="secondary" className="text-xs capitalize">
              {categoryLabels[venue.category] || venue.category}
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">{venue.name}</h1>
          <div className="flex flex-wrap items-center gap-5 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-blue-500" />
              <span>{venue.address}, {venue.city}, {venue.state}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-gray-800">{venue.rating}</span>
              <span className="text-gray-400">({venue.reviewCount} reviews)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-blue-500" />
              <span>Up to {venue.maxCapacity.toLocaleString()} guests</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-blue-500" />
              <span>{venue.halls.length} hall{venue.halls.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="mb-10">
          <VenueGallery images={venue.galleryImages} venueName={venue.name} />
        </div>

        {/* Main Layout: Content + Booking Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Venue</h2>
              <p className="text-gray-600 leading-relaxed text-base">{venue.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {venue.landmark && (
                  <span className="text-sm text-gray-500 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-gray-400" />
                    Near: {venue.landmark}
                  </span>
                )}
              </div>
            </section>

            {/* Contact Info */}
            <section className="grid grid-cols-2 gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
              <a
                href={`tel:${venue.phone}`}
                className="flex items-center gap-3 group"
              >
                <div className="h-10 w-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Phone className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                    {venue.phone}
                  </p>
                </div>
              </a>
              <a
                href={`mailto:${venue.email}`}
                className="flex items-center gap-3 group"
              >
                <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Mail className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                    {venue.email}
                  </p>
                </div>
              </a>
            </section>

            {/* Halls */}
            <VenueHallsGrid halls={venue.halls} recommendedHallId={recommendedHallId} />

            {/* Facilities */}
            <VenueFacilitiesIcons facilities={venue.facilities} services={venue.services} />
          </div>

          {/* Right: Booking Widget */}
          <div className="lg:col-span-1">
            <BookingWidget
              venueName={venue.name}
              priceFrom={venue.priceFrom}
              priceTo={venue.priceTo}
              phone={venue.phone}
              email={venue.email}
              halls={venue.halls}
              onHallRecommend={setRecommendedHallId}
            />
          </div>
        </div>

        {/* Similar Venues */}
        {similarVenues.length > 0 && (
          <section className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Similar Venues in {venue.city}</h2>
                <p className="text-gray-500 text-sm mt-1">You might also like these venues</p>
              </div>
              <Link
                to={`/browse?location=${venue.city}`}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View all in {venue.city} →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {similarVenues.map((v) => (
                <VenueCard key={v.id} venue={v} />
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
}
