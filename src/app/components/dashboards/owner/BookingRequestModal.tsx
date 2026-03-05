import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Textarea } from '../../ui/textarea';
import { Label } from '../../ui/label';
import { Calendar, Users, DollarSign, MapPin, Phone, Mail, Check, X } from 'lucide-react';
import { toast } from 'sonner';

export interface BookingRequest {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  venueName: string;
  hallName: string;
  eventDate: string;
  eventType: string;
  guestCount: number;
  estimatedBudget: number;
  status: 'pending' | 'accepted' | 'rejected';
  submittedDate: string;
  notes?: string;
}

interface BookingRequestModalProps {
  request: BookingRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: (id: string) => void;
  onReject: (id: string, reason: string) => void;
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

export default function BookingRequestModal({ request, open, onOpenChange, onAccept, onReject }: BookingRequestModalProps) {
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  if (!request) return null;

  const handleAccept = () => {
    onAccept(request.id);
    toast.success('Booking accepted! Client will be notified.');
    onOpenChange(false);
  };

  const handleReject = () => {
    onReject(request.id, rejectionReason);
    toast.error('Booking request rejected.');
    setRejectionReason('');
    setShowRejectForm(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); setShowRejectForm(false); setRejectionReason(''); }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Booking Request Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-center justify-between">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[request.status]}`}>
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </span>
            <Badge variant="outline">{request.eventType}</Badge>
          </div>

          {/* Venue Info */}
          <div className="p-3 bg-blue-50 rounded-xl">
            <p className="text-xs text-blue-600 font-medium mb-1">VENUE & HALL</p>
            <p className="font-semibold text-blue-900">{request.venueName}</p>
            <p className="text-sm text-blue-700">{request.hallName}</p>
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Event Date</p>
                <p className="font-medium">{new Date(request.eventDate).toLocaleDateString('en-NG', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Guest Count</p>
                <p className="font-medium">{request.guestCount} guests</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Budget</p>
                <p className="font-medium text-green-700">₦{request.estimatedBudget.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Submitted</p>
                <p className="font-medium">{new Date(request.submittedDate).toLocaleDateString('en-NG')}</p>
              </div>
            </div>
          </div>

          {request.notes && (
            <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-100">
              <p className="text-xs font-medium text-yellow-800 mb-1">Client Notes</p>
              <p className="text-sm text-yellow-900">{request.notes}</p>
            </div>
          )}

          {/* Client Info */}
          <div className="p-3 bg-gray-50 rounded-xl space-y-2">
            <p className="text-xs text-gray-500 font-medium">CLIENT INFORMATION</p>
            <p className="font-semibold text-sm">{request.clientName}</p>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-gray-400" />
              <a href={`mailto:${request.clientEmail}`} className="text-blue-600 hover:underline">{request.clientEmail}</a>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-gray-400" />
              <a href={`tel:${request.clientPhone}`} className="text-blue-600 hover:underline">{request.clientPhone}</a>
            </div>
          </div>

          {/* Rejection Reason Form */}
          {showRejectForm && (
            <div className="p-4 border border-red-200 rounded-xl bg-red-50">
              <Label className="text-red-800 text-sm font-medium">Reason for rejection (optional)</Label>
              <Textarea className="mt-2 resize-none bg-white" rows={3} placeholder="e.g. Hall already booked for this date..."
                value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} />
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => { setShowRejectForm(false); setRejectionReason(''); }}>Cancel</Button>
                <Button size="sm" className="flex-1 bg-red-600 hover:bg-red-700 text-white" onClick={handleReject}>
                  Confirm Reject
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {request.status === 'pending' && !showRejectForm && (
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1 text-red-600 border-red-200 hover:bg-red-50" onClick={() => setShowRejectForm(true)}>
              <X className="h-4 w-4 mr-1.5" /> Reject
            </Button>
            <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={handleAccept}>
              <Check className="h-4 w-4 mr-1.5" /> Accept Booking
            </Button>
          </div>
        )}

        {request.status !== 'pending' && (
          <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>Close</Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
