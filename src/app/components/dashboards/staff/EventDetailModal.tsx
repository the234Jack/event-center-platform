import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Calendar, Clock, MapPin, Users, Phone, User, Briefcase, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export interface StaffEvent {
  id: number;
  eventName: string;
  venueName: string;
  hallName: string;
  date: string;
  time: string;
  clientName: string;
  clientPhone: string;
  guestCount: number;
  eventType: string;
  staffRole: string;
  location: string;
  notes: string;
  status: 'upcoming' | 'in-progress' | 'completed' | 'cancelled';
}

interface EventDetailModalProps {
  event: StaffEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMarkComplete: (id: number) => void;
}

const STATUS_STYLES: Record<string, string> = {
  upcoming: 'bg-blue-100 text-blue-700',
  'in-progress': 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function EventDetailModal({ event, open, onOpenChange, onMarkComplete }: EventDetailModalProps) {
  if (!event) return null;

  const handleMarkComplete = () => {
    onMarkComplete(event.id);
    toast.success(`"${event.eventName}" marked as completed!`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-left">{event.eventName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-center justify-between">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[event.status]}`}>
              {event.status.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            </span>
            <Badge variant="outline">{event.eventType}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">{event.venueName}</p>
                <p className="text-gray-500">{event.hallName}</p>
                <p className="text-gray-400 text-xs">{event.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <Calendar className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">{new Date(event.date).toLocaleDateString('en-NG', { weekday: 'short', month: 'long', day: 'numeric' })}</p>
                <div className="flex items-center gap-1 text-gray-500 mt-0.5">
                  <Clock className="h-3.5 w-3.5" />{event.time}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-blue-500 flex-shrink-0" />
              <span>{event.guestCount} guests expected</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Briefcase className="h-4 w-4 text-blue-500 flex-shrink-0" />
              <span>Your role: <span className="font-medium">{event.staffRole}</span></span>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 mb-2 font-medium">CLIENT INFORMATION</p>
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span>{event.clientName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <a href={`tel:${event.clientPhone}`} className="text-blue-600 hover:underline">{event.clientPhone}</a>
              </div>
            </div>
          </div>

          {event.notes && (
            <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-100">
              <p className="text-xs font-medium text-yellow-800 mb-1">Notes</p>
              <p className="text-sm text-yellow-900">{event.notes}</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Close</Button>
          {event.status === 'upcoming' && (
            <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={handleMarkComplete}>
              <CheckCircle2 className="h-4 w-4 mr-2" /> Mark Complete
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
