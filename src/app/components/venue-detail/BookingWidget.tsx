import React, { useState, useMemo } from 'react';
import { Phone, Mail, Heart, Sparkles, Info } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import type { VenueHall } from '../../../data/types';

interface BookingWidgetProps {
  venueName: string;
  priceFrom: number;
  priceTo: number;
  phone: string;
  email: string;
  halls: VenueHall[];
  onHallRecommend?: (hallId: string) => void;
}

const eventTypes = [
  'Wedding', 'Birthday Party', 'Corporate Event', 'Conference',
  'Graduation', 'Naming Ceremony', 'Anniversary', 'Other',
];

export default function BookingWidget({
  venueName,
  priceFrom,
  priceTo,
  phone,
  email,
  halls,
  onHallRecommend,
}: BookingWidgetProps) {
  const [saved, setSaved] = useState(false);
  const [guestCount, setGuestCount] = useState('');
  const [form, setForm] = useState({
    name: '',
    phoneInput: '',
    eventDate: '',
    eventType: '',
  });

  // Smart budget tip: find best hall for guest count
  const recommendedHall = useMemo(() => {
    if (!guestCount) return null;
    const count = parseInt(guestCount);
    if (isNaN(count) || count <= 0) return null;
    // Find smallest hall that fits the guest count
    const fitting = halls
      .filter((h) => h.seatingCapacity >= count)
      .sort((a, b) => a.pricePerDay - b.pricePerDay);
    return fitting[0] || null;
  }, [guestCount, halls]);

  // Notify parent about recommended hall
  React.useEffect(() => {
    if (onHallRecommend) {
      onHallRecommend(recommendedHall?.id || '');
    }
  }, [recommendedHall]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Booking request sent to ${venueName}! They will contact you at ${form.phoneInput}.`);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden sticky top-24">
      {/* Price Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5">
        <div className="flex items-center justify-between mb-1">
          <span className="text-blue-200 text-sm">Price range</span>
          <button
            onClick={() => setSaved(!saved)}
            className="text-blue-200 hover:text-white transition-colors"
          >
            <Heart className={`h-5 w-5 ${saved ? 'fill-red-400 text-red-400' : ''}`} />
          </button>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white">₦{priceFrom.toLocaleString()}</span>
          <span className="text-blue-300 text-sm">to ₦{priceTo.toLocaleString()}</span>
        </div>
        <p className="text-blue-200 text-xs mt-1">Per day pricing · Contact for custom packages</p>
      </div>

      {/* Contact Buttons */}
      <div className="p-5 border-b border-gray-100">
        <div className="grid grid-cols-2 gap-2 mb-3">
          <a
            href={`tel:${phone}`}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 transition-colors text-sm font-medium"
          >
            <Phone className="h-4 w-4" />
            Call
          </a>
          <a
            href={`mailto:${email}`}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors text-sm font-medium"
          >
            <Mail className="h-4 w-4" />
            Email
          </a>
        </div>
      </div>

      {/* Booking Form */}
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        <h3 className="font-semibold text-gray-900 text-sm">Request a Booking</h3>

        <div className="space-y-1.5">
          <Label className="text-xs text-gray-600">Your Name</Label>
          <Input
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="h-9 text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-gray-600">Phone Number</Label>
          <Input
            placeholder="08012345678"
            value={form.phoneInput}
            onChange={(e) => setForm({ ...form, phoneInput: e.target.value })}
            className="h-9 text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-gray-600">Event Date</Label>
          <Input
            type="date"
            value={form.eventDate}
            onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
            className="h-9 text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-gray-600">Event Type</Label>
          <Select value={form.eventType} onValueChange={(v) => setForm({ ...form, eventType: v })}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              {eventTypes.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Smart Guest Count + Budget Tip */}
        <div className="space-y-1.5">
          <Label className="text-xs text-gray-600 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-orange-500" />
            Guest Count (Smart Suggestion)
          </Label>
          <Input
            type="number"
            placeholder="e.g. 200"
            value={guestCount}
            onChange={(e) => setGuestCount(e.target.value)}
            className="h-9 text-sm"
          />
        </div>

        {/* Smart Tip */}
        {recommendedHall && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-orange-800 mb-0.5">
                  Smart Recommendation
                </p>
                <p className="text-xs text-orange-700">
                  For {guestCount} guests, we recommend{' '}
                  <strong>{recommendedHall.name}</strong> (seats{' '}
                  {recommendedHall.seatingCapacity.toLocaleString()}) at{' '}
                  <strong>₦{recommendedHall.pricePerDay.toLocaleString()}/day</strong>.
                </p>
              </div>
            </div>
          </div>
        )}

        {!recommendedHall && guestCount && parseInt(guestCount) > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
            <p className="text-xs text-red-700">
              No hall at this venue currently fits {guestCount} guests seated. Consider checking other venues.
            </p>
          </div>
        )}

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          Send Booking Request
        </Button>

        <p className="text-xs text-gray-400 text-center">
          The venue will contact you within 24 hours.
        </p>
      </form>
    </div>
  );
}
