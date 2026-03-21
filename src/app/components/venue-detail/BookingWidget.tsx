import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Mail, Heart, Sparkles, Info, CalendarDays, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { toast } from 'sonner';
import { format, parseISO, isBefore, startOfToday } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { createBooking, fetchHallBookedDates } from '../../../lib/api/bookings';
import { EVENT_TYPES } from '../../../lib/constants';
import type { VenueHall } from '../../../data/types';
import CostEstimator from '../shared/CostEstimator';

interface BookingWidgetProps {
  venueId: string;
  venueName: string;
  priceFrom: number;
  priceTo: number;
  phone: string;
  email: string;
  halls: VenueHall[];
  onHallRecommend?: (hallId: string) => void;
}

export default function BookingWidget({
  venueId,
  venueName,
  priceFrom,
  priceTo,
  phone,
  email,
  halls,
  onHallRecommend,
}: BookingWidgetProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [guestCount, setGuestCount] = useState('');
  const [selectedHallId, setSelectedHallId] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [form, setForm] = useState({ eventType: '', startTime: '', endTime: '', specialReqs: '' });

  // Smart hall recommendation
  const recommendedHall = useMemo(() => {
    if (!guestCount) return null;
    const count = parseInt(guestCount);
    if (isNaN(count) || count <= 0) return null;
    const fitting = halls
      .filter((h) => h.seatingCapacity >= count)
      .sort((a, b) => a.pricePerDay - b.pricePerDay);
    return fitting[0] ?? null;
  }, [guestCount, halls]);

  // Notify parent of recommendation
  useEffect(() => {
    onHallRecommend?.(recommendedHall?.id ?? '');
  }, [recommendedHall]);

  // Fetch booked dates when a hall is selected
  useEffect(() => {
    if (!selectedHallId) { setBookedDates([]); return; }
    fetchHallBookedDates(selectedHallId)
      .then((dates) => setBookedDates(dates.map((d) => parseISO(d))))
      .catch(() => setBookedDates([]));
  }, [selectedHallId]);

  const selectedHall = halls.find((h) => h.id === selectedHallId);

  const isDateBooked = (date: Date) =>
    bookedDates.some((d) => d.toDateString() === date.toDateString());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please log in to make a booking.');
      navigate('/login');
      return;
    }

    if (!selectedHallId) { toast.error('Please select a hall.'); return; }
    if (!selectedDate) { toast.error('Please pick an event date.'); return; }
    if (!form.eventType) { toast.error('Please select an event type.'); return; }
    if (!guestCount || parseInt(guestCount) <= 0) { toast.error('Please enter guest count.'); return; }

    if (isDateBooked(selectedDate)) {
      toast.error('That date is already booked for this hall. Please choose another date.');
      return;
    }

    setSubmitting(true);
    try {
      await createBooking({
        client_id: user.id,
        venue_id: venueId,
        hall_id: selectedHallId,
        event_date: format(selectedDate, 'yyyy-MM-dd'),
        start_time: form.startTime || undefined,
        end_time: form.endTime || undefined,
        event_type: form.eventType,
        guest_count: parseInt(guestCount),
        special_requirements: form.specialReqs || undefined,
        total_cost: selectedHall?.pricePerDay ?? undefined,
      });
      toast.success(`Booking request sent to ${venueName}! Check your dashboard for updates.`);
      // Reset form
      setSelectedHallId('');
      setSelectedDate(undefined);
      setGuestCount('');
      setForm({ eventType: '', startTime: '', endTime: '', specialReqs: '' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit booking. Please try again.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
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
            aria-label={saved ? 'Remove from saved' : 'Save venue'}
          >
            <Heart className={`h-5 w-5 ${saved ? 'fill-red-400 text-red-400' : ''}`} />
          </button>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white">₦{priceFrom.toLocaleString()}</span>
          <span className="text-blue-300 text-sm">to ₦{priceTo.toLocaleString()}</span>
        </div>
        <p className="text-blue-200 text-xs mt-1">Per day · Contact for custom packages</p>
      </div>

      {/* Contact Buttons */}
      <div className="p-5 border-b border-gray-100">
        <div className="grid grid-cols-2 gap-2">
          <a
            href={`tel:${phone}`}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 transition-colors text-sm font-medium"
          >
            <Phone className="h-4 w-4" /> Call
          </a>
          <a
            href={`mailto:${email}`}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors text-sm font-medium"
          >
            <Mail className="h-4 w-4" /> Email
          </a>
        </div>
      </div>

      {/* Booking Form */}
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        <h3 className="font-semibold text-gray-900 text-sm">
          {user ? 'Request a Booking' : 'Book This Venue'}
        </h3>

        {/* Guest Count (smart) */}
        <div className="space-y-1.5">
          <Label className="text-xs text-gray-600 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-orange-500" />
            Guest Count
          </Label>
          <Input
            type="number"
            placeholder="e.g., 200"
            value={guestCount}
            min={1}
            onChange={(e) => setGuestCount(e.target.value)}
            className="h-9 text-sm"
          />
        </div>

        {/* Smart Recommendation */}
        {recommendedHall && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-orange-700">
                For <strong>{guestCount}</strong> guests, we recommend{' '}
                <strong>{recommendedHall.name}</strong> (seats {recommendedHall.seatingCapacity.toLocaleString()}) at{' '}
                <strong>₦{recommendedHall.pricePerDay.toLocaleString()}/day</strong>.
              </p>
            </div>
          </div>
        )}

        {!recommendedHall && guestCount && parseInt(guestCount) > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
            <p className="text-xs text-red-700">
              No hall at this venue fits {guestCount} guests seated. Consider other venues.
            </p>
          </div>
        )}

        {/* Hall Selector */}
        <div className="space-y-1.5">
          <Label className="text-xs text-gray-600">Select Hall</Label>
          <Select value={selectedHallId} onValueChange={setSelectedHallId}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Choose a hall" />
            </SelectTrigger>
            <SelectContent>
              {halls.map((h) => (
                <SelectItem key={h.id} value={h.id}>
                  {h.name} — {h.seatingCapacity.toLocaleString()} seated · ₦{h.pricePerDay.toLocaleString()}/day
                  {h.id === recommendedHall?.id ? ' ⭐' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Picker */}
        <div className="space-y-1.5">
          <Label className="text-xs text-gray-600 flex items-center gap-1">
            <CalendarDays className="h-3 w-3" />
            Event Date
            {selectedHallId && <span className="text-gray-400 ml-1">(booked dates greyed out)</span>}
          </Label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="w-full h-9 px-3 text-sm border border-gray-200 rounded-md bg-white hover:border-gray-300 flex items-center justify-between text-left transition-colors"
              >
                <span className={selectedDate ? 'text-gray-900' : 'text-gray-400'}>
                  {selectedDate ? format(selectedDate, 'dd MMM yyyy') : 'Pick a date'}
                </span>
                <CalendarDays className="h-4 w-4 text-gray-400" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => { setSelectedDate(date); setCalendarOpen(false); }}
                disabled={(date) =>
                  isBefore(date, startOfToday()) || isDateBooked(date)
                }
                modifiers={{ booked: bookedDates }}
                modifiersClassNames={{ booked: 'line-through text-red-400 opacity-60' }}
                initialFocus
              />
              {bookedDates.length > 0 && (
                <p className="text-xs text-gray-400 px-3 pb-3">
                  Strikethrough dates are already booked.
                </p>
              )}
            </PopoverContent>
          </Popover>
        </div>

        {/* Event Type */}
        <div className="space-y-1.5">
          <Label className="text-xs text-gray-600">Event Type</Label>
          <Select value={form.eventType} onValueChange={(v) => setForm({ ...form, eventType: v })}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              {EVENT_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.emoji} {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Time Range */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-600">Start Time</Label>
            <Input
              type="time"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              className="h-9 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-600">End Time</Label>
            <Input
              type="time"
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              className="h-9 text-sm"
            />
          </div>
        </div>

        {/* Special Requirements */}
        <div className="space-y-1.5">
          <Label className="text-xs text-gray-600">Special Requirements (optional)</Label>
          <Input
            placeholder="e.g., setup 2 hours before event"
            value={form.specialReqs}
            onChange={(e) => setForm({ ...form, specialReqs: e.target.value })}
            className="h-9 text-sm"
          />
        </div>

        {/* Cost Estimator — shown when hall + event type + guest count are filled */}
        {selectedHall && form.eventType && parseInt(guestCount) > 0 && (
          <CostEstimator
            eventType={form.eventType}
            guestCount={parseInt(guestCount)}
            venuePrice={selectedHall.pricePerDay}
            venueName={selectedHall.name}
            compact
          />
        )}

        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60"
        >
          {submitting ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending...</>
          ) : user ? (
            'Send Booking Request'
          ) : (
            'Log in to Book'
          )}
        </Button>

        <p className="text-xs text-gray-400 text-center">
          {user
            ? 'The venue will respond within 24 hours.'
            : 'You need an account to make a booking.'}
        </p>
      </form>
    </div>
  );
}
