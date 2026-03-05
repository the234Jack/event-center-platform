import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const nigerianCities = ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Enugu', 'Kano', 'Kaduna', 'Benin City', 'Warri', 'Aba'];
const eventTypes = [
  { value: 'wedding', label: 'Wedding' },
  { value: 'conference', label: 'Conference' },
  { value: 'party', label: 'Party / Birthday' },
  { value: 'corporate', label: 'Corporate Event' },
  { value: 'banquet', label: 'Banquet / Dinner' },
  { value: 'outdoor', label: 'Outdoor Event' },
];
const guestRanges = ['1-50', '50-100', '100-200', '200-500', '500-1000', '1000+'];

export default function HeroSection() {
  const [location, setLocation] = useState('');
  const [eventType, setEventType] = useState('');
  const [guests, setGuests] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (eventType) params.set('type', eventType);
    if (guests) params.set('guests', guests);
    navigate(`/browse?${params.toString()}`);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600&q=80')",
        }}
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/55 to-black/70" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-400/30 backdrop-blur-sm text-blue-200 text-sm font-medium px-4 py-1.5 rounded-full mb-8">
          <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
          Nigeria's #1 Event Center Platform
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
          Find the Perfect
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            Event Center
          </span>
          <br />
          for Your Next Event
        </h1>

        <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
          Discover and compare event centers, halls, and venues for weddings,
          conferences, parties, and corporate events across Nigeria.
        </p>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-2xl p-3 max-w-4xl mx-auto mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* Location */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <MapPin className="h-4 w-4 text-blue-500 flex-shrink-0" />
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="border-0 bg-transparent p-0 h-auto shadow-none focus:ring-0 text-sm">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {nigerianCities.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Event Type */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <Calendar className="h-4 w-4 text-blue-500 flex-shrink-0" />
              <Select value={eventType} onValueChange={setEventType}>
                <SelectTrigger className="border-0 bg-transparent p-0 h-auto shadow-none focus:ring-0 text-sm">
                  <SelectValue placeholder="Event type" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Guests */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors flex-1">
                <Users className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <Select value={guests} onValueChange={setGuests}>
                  <SelectTrigger className="border-0 bg-transparent p-0 h-auto shadow-none focus:ring-0 text-sm">
                    <SelectValue placeholder="Guest count" />
                  </SelectTrigger>
                  <SelectContent>
                    {guestRanges.map((g) => (
                      <SelectItem key={g} value={g}>{g} guests</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white h-10 px-5 rounded-xl shadow-md flex-shrink-0"
              >
                <Search className="h-4 w-4 mr-1.5" />
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
          <Button
            onClick={() => navigate('/browse')}
            size="lg"
            className="bg-white text-gray-900 hover:bg-gray-50 shadow-lg font-semibold px-8"
          >
            Browse Venues
          </Button>
          <Button
            onClick={() => navigate('/register')}
            size="lg"
            variant="outline"
            className="border-white/50 text-white hover:bg-white/10 bg-transparent font-semibold px-8"
          >
            List Your Event Center
          </Button>
        </div>

        {/* Stats */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-white/80">
          {[
            { number: '500+', label: 'Verified Venues' },
            { number: '36', label: 'States Covered' },
            { number: '10,000+', label: 'Events Hosted' },
            { number: '98%', label: 'Satisfaction Rate' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-white">{stat.number}</p>
              <p className="text-sm text-white/60 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50">
        <span className="text-xs">Scroll to explore</span>
        <div className="h-8 w-5 border-2 border-white/30 rounded-full flex items-start justify-center pt-1">
          <div className="h-1.5 w-1 bg-white/50 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
