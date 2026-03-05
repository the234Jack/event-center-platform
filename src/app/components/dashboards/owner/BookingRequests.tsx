import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger } from '../../ui/tabs';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Calendar, Users, DollarSign, Eye, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import BookingRequestModal, { BookingRequest } from './BookingRequestModal';
import { useAuth } from '../../../context/AuthContext';
import { fetchOwnerBookings, updateBookingStatus } from '../../../../lib/api/bookings';


const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  accepted: 'bg-green-100 text-green-700 border-green-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
};

export default function BookingRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [tab, setTab] = useState('pending');
  const [selectedRequest, setSelectedRequest] = useState<BookingRequest | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    fetchOwnerBookings(user.id).then((rows: any[]) => {
      setRequests(rows.map((r) => ({
        id: r.id,
        clientName: r.profiles?.full_name ?? 'Unknown Client',
        clientEmail: '',
        clientPhone: r.profiles?.phone ?? '',
        venueName: r.venues?.name ?? '',
        hallName: r.halls?.name ?? '',
        eventDate: r.event_date,
        eventType: r.event_type,
        guestCount: r.guest_count,
        estimatedBudget: r.total_cost ?? 0,
        status: r.status === 'confirmed' ? 'accepted' : r.status === 'cancelled' ? 'rejected' : 'pending',
        submittedDate: r.created_at?.split('T')[0] ?? '',
        notes: r.special_requirements ?? undefined,
      })));
    }).catch(() => {});
  }, [user?.id]);

  const filtered = requests.filter((r) => r.status === tab);

  const handleAccept = async (id: string) => {
    try {
      await updateBookingStatus(id, 'confirmed');
      setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: 'accepted' } : r));
      toast.success('Booking accepted! Client will be notified.');
    } catch { toast.error('Failed to accept booking.'); }
  };

  const handleReject = async (id: string, reason: string) => {
    try {
      await updateBookingStatus(id, 'cancelled');
      setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: 'rejected', notes: reason || r.notes } : r));
      toast.error('Booking request rejected.');
    } catch { toast.error('Failed to reject booking.'); }
  };

  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Booking Requests</h2>
        <p className="text-sm text-gray-500">{pendingCount} pending review</p>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="pending">Pending ({requests.filter((r) => r.status === 'pending').length})</TabsTrigger>
          <TabsTrigger value="accepted">Accepted ({requests.filter((r) => r.status === 'accepted').length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({requests.filter((r) => r.status === 'rejected').length})</TabsTrigger>
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No {tab} requests</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((req) => (
            <div key={req.id} className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="font-semibold text-gray-900">{req.clientName}</h4>
                    <Badge variant="outline" className="text-xs">{req.eventType}</Badge>
                  </div>
                  <p className="text-sm text-gray-500">{req.venueName} · {req.hallName}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLES[req.status]}`}>
                  {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-blue-500" />
                  {new Date(req.eventDate).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-blue-500" />
                  {req.guestCount} guests
                </div>
                <div className="flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5 text-green-500" />
                  <span className="font-semibold text-green-700">₦{req.estimatedBudget.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button size="sm" variant="outline" onClick={() => { setSelectedRequest(req); setModalOpen(true); }}>
                  <Eye className="h-4 w-4 mr-1.5" /> View Details
                </Button>
                {req.status === 'pending' && (
                  <>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => { handleAccept(req.id); toast.success('Booking accepted!'); }}>
                      <Check className="h-4 w-4 mr-1.5" /> Accept
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => { handleReject(req.id, ''); toast.error('Booking rejected.'); }}>
                      <X className="h-4 w-4 mr-1.5" /> Reject
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <BookingRequestModal
        request={selectedRequest}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onAccept={handleAccept}
        onReject={handleReject}
      />
    </div>
  );
}
