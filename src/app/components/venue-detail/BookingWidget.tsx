import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Mail, Heart, Sparkles, Info, CalendarDays, Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { toast } from 'sonner';
import { format, parseISO, isBefore, startOfToday } from 'date-fns';
import { usePaystackPayment } from 'react-paystack';
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

const PAYSTACK_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY ?? '';

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

  // Paystack: we generate a fresh reference each payment attempt via state
  const [payRef, setPayRef] = useState('');

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

  // ── Paystack config (re-evaluated each render with latest state) ─────────
  const paystackConfig = {
    reference: payRef,
    email: user?.email ?? '',
    amount: (selectedHall?.pricePerDay ?? 0) * 100, // Paystack uses kobo
    publicKey: PAYSTACK_KEY,
    currency: 'NGN' as const,
    metadata: {
      custom_fields: [
        { display_name: 'Venue', variable_name: 'venue_name', value: venueName },
        { display_name: 'Hall', variable_name: 'hall_name', value: selectedHall?.name ?? '' },
        { display_name: 'Event Type', variable_name: 'event_type', value: form.eventType },
        { display_name: 'Event Date', variable_name: 'event_date', value: selectedDate ? format(selectedDate, 'dd MMM yyyy') : '' },
      ],
    },
  };

  const initializePayment = usePaystackPayment(paystackConfig);

  // Triggered once payRef is set (new payment attempt)
  useEffect(() => {
    if (!payRef) return;

    const onSuccess = async (response: { reference: string }) => {
      setSubmitting(true);
      try {
        await createBooking({
          client_id: user!.id,
          venue_id: venueId,
          hall_id: selectedHallId,
          event_date: format(selectedDate!, 'yyyy-MM-dd'),
          start_time: form.startTime || undefined,
          end_time: form.endTime || undefined,
          event_type: form.eventType,
          guest_count: parseInt(guestCount),
          special_requirements: form.specialReqs || undefined,
          total_cost: selectedHall?.pricePerDay,
          payment_reference: response.reference,
          status: 'confirmed',
        });
        toast.success(`🎉 Booking confirmed! Reference: ${response.reference}`);
        // Reset form
        setSelectedHallId('');
        setSelectedDate(undefined);
        setGuestCount('');
        setPayRef('');
        setForm({ eventType: '', startTime: '', endTime: '', specialReqs: '' });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Payment received but booking failed. Contact support.';
        toast.error(msg);
      } finally {
        setSubmitting(false);
      }
    };

    const onClose = () => {
      setPayRef('');
      toast.error('Payment cancelled.');
    };

    initializePayment({ onSuccess, onClose });
  }, [payRef]);

  // ── Validate then trigger Paystack ───────────────────────────────────────
  const handlePayAndBook = (e: React.FormEvent) => {
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
      toast.error('That date is already booked. Please choose another date.');
      return;
    }
    if (!PAYSTACK_KEY) {
      toast.error('Payment gateway not configured. Contact the administrator.');
      return;
    }

    // Generate a unique reference and trigger the useEffect above
    const ref = `EVH-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    setPayRef(ref);
  };

  const amountDisplay = selectedHall
    ? `₦${selectedHall.pricePerDay.toLocaleString()}`
    : null;

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
        <p className="text-blue-200 text-xs mt-1">Per day · Secure payment via Paystack</p>
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
      <form onSubmit={handlePayAndBook} className="p-5 space-y-4">
        <h3 className="font-semibold text-gray-900 text-sm">
          {user ? 'Book & Pay Securely' : 'Book This Venue'}
        </h3>

        {/* Guest Count */}
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
                disabled={(date) => isBefore(date, startOfToday()) || isDateBooked(date)}
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

        {/* Cost Estimator */}
        {selectedHall && form.eventType && parseInt(guestCount) > 0 && (
          <CostEstimator
            eventType={form.eventType}
            guestCount={parseInt(guestCount)}
            venuePrice={selectedHall.pricePerDay}
            venueName={selectedHall.name}
            compact
          />
        )}

        {/* Pay Button */}
        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-green-600 hover:bg-green-700 text-white disabled:opacity-60 font-semibold"
        >
          {submitting ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processing...</>
          ) : user ? (
            amountDisplay
              ? `Pay ${amountDisplay} & Confirm Booking`
              : 'Select a Hall to Pay'
          ) : (
            'Log in to Book'
          )}
        </Button>

        {/* Trust badge */}
        {user && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
            <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
            Secured by Paystack · Cards, Bank Transfer, USSD
          </div>
        )}

        {!user && (
          <p className="text-xs text-gray-400 text-center">
            You need an account to make a booking.
          </p>
        )}
      </form>
    </div>
  );
}
