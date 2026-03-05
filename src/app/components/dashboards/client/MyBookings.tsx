import React, { useState, useEffect } from 'react';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Tabs, TabsList, TabsTrigger } from '../../ui/tabs';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '../../ui/alert-dialog';
import { Calendar, MapPin, Users, DollarSign, Eye, X, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../../context/AuthContext';
import { fetchClientBookings, updateBookingStatus } from '../../../../lib/api/bookings';

interface Booking {
  id: string;
  venueName: string;
  hallName: string;
  eventDate: string;
  eventTime: string;
  eventType: string;
  guestCount: number;
  totalCost: number;
  location: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}


const STATUS_STYLES: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-700 border-green-200',
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
};

type FilterTab = 'all' | 'upcoming' | 'past' | 'cancelled';

function isUpcoming(date: string) {
  return new Date(date) >= new Date();
}

interface BookingDetailProps {
  booking: Booking;
  onClose: () => void;
}

function BookingDetail({ booking, onClose }: BookingDetailProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-lg font-bold">Booking Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-3">
          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="font-semibold">{booking.venueName}</p>
            <p className="text-sm text-gray-600">{booking.hallName}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-500 text-xs">Event Type</p>
              <p className="font-medium">{booking.eventType}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Status</p>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[booking.status]}`}>
                {booking.status}
              </span>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Date</p>
              <p className="font-medium">{new Date(booking.eventDate).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Time</p>
              <p className="font-medium">{booking.eventTime}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Guests</p>
              <p className="font-medium">{booking.guestCount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Total Cost</p>
              <p className="font-medium text-green-700">₦{booking.totalCost.toLocaleString()}</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-500 text-xs">Location</p>
              <p className="font-medium">{booking.location}</p>
            </div>
          </div>
        </div>
        <Button className="w-full mt-4" variant="outline" onClick={onClose}>Close</Button>
      </div>
    </div>
  );
}

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [viewBooking, setViewBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    fetchClientBookings(user.id).then((rows) => {
      setBookings(rows.map((r: any) => ({
        id: r.id,
        venueName: r.venues?.name ?? 'Unknown Venue',
        hallName: r.halls?.name ?? 'Unknown Hall',
        eventDate: r.event_date,
        eventTime: r.start_time ? `${r.start_time} – ${r.end_time ?? ''}` : 'TBD',
        eventType: r.event_type,
        guestCount: r.guest_count,
        totalCost: r.total_cost ?? 0,
        location: r.venues?.city ?? '',
        status: r.status === 'confirmed' ? 'confirmed' : r.status as Booking['status'],
      })));
    }).catch(() => {});
  }, [user?.id]);

  const filtered = bookings.filter((b) => {
    if (filter === 'all') return true;
    if (filter === 'cancelled') return b.status === 'cancelled';
    if (filter === 'upcoming') return b.status !== 'cancelled' && isUpcoming(b.eventDate);
    if (filter === 'past') return b.status !== 'cancelled' && !isUpcoming(b.eventDate);
    return true;
  });

  const handleCancel = async (id: string) => {
    try {
      await updateBookingStatus(id, 'cancelled');
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: 'cancelled' } : b));
      toast.success('Booking cancelled successfully.');
    } catch {
      toast.error('Failed to cancel booking. Please try again.');
    }
    setCancelId(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Bookings</h2>
          <p className="text-sm text-gray-500">Track and manage all your event bookings</p>
        </div>
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterTab)} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All ({bookings.length})</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No bookings found</p>
          <p className="text-sm text-gray-400">Try a different filter or make a new booking</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((booking) => (
            <div key={booking.id} className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{booking.venueName}</h4>
                  <p className="text-sm text-gray-500">{booking.hallName}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLES[booking.status]}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 flex-shrink-0 text-blue-500" />
                  <span>{new Date(booking.eventDate).toLocaleDateString('en-NG')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 flex-shrink-0 text-blue-500" />
                  <span>{booking.eventTime}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 flex-shrink-0 text-blue-500" />
                  <span>{booking.guestCount} guests</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4 flex-shrink-0 text-green-500" />
                  <span className="font-semibold text-green-700">₦{booking.totalCost.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
                <MapPin className="h-4 w-4 text-gray-400" />
                {booking.location} · {booking.eventType}
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button size="sm" variant="outline" onClick={() => setViewBooking(booking)}>
                  <Eye className="h-4 w-4 mr-1.5" /> View Details
                </Button>
                {booking.status === 'pending' && isUpcoming(booking.eventDate) && (
                  <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => setCancelId(booking.id)}>
                    <X className="h-4 w-4 mr-1.5" /> Cancel
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Confirmation */}
      <AlertDialog open={cancelId !== null} onOpenChange={(o) => { if (!o) setCancelId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The venue will be notified of your cancellation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Booking</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => cancelId && handleCancel(cancelId)}>
              Yes, Cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Detail Modal */}
      {viewBooking && <BookingDetail booking={viewBooking} onClose={() => setViewBooking(null)} />}
    </div>
  );
}
