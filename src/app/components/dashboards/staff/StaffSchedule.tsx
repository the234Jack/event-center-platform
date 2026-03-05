import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '../../ui/tabs';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Calendar, Clock, MapPin, Users, Eye } from 'lucide-react';
import EventDetailModal, { StaffEvent } from './EventDetailModal';

const MOCK_EVENTS: StaffEvent[] = [
  { id: 1, eventName: 'Adeyemi-Okafor Wedding', venueName: 'Grand Palace Event Center', hallName: 'Grand Ballroom', date: '2026-03-05', time: '14:00 - 22:00', clientName: 'Emeka Adeyemi', clientPhone: '+234 803 111 2222', guestCount: 400, eventType: 'Wedding', staffRole: 'Event Coordinator', location: 'Ikeja, Lagos', notes: 'VIP table arrangements required. Bride requests ivory and gold theme.', status: 'upcoming' },
  { id: 2, eventName: 'TechNigeria Summit 2026', venueName: 'Elite Events Hub', hallName: 'Conference Suite A', date: '2026-03-08', time: '09:00 - 17:00', clientName: 'Fatima Al-Hassan', clientPhone: '+234 806 333 4444', guestCount: 200, eventType: 'Conference', staffRole: 'Supervisor', location: 'Victoria Island, Lagos', notes: 'AV equipment check at 8 AM. Catering buffet setup for 100.', status: 'upcoming' },
  { id: 3, eventName: 'Chief Bello\'s 60th Celebration', venueName: 'Nicon Luxury Hall', hallName: 'Nicon Grand', date: '2026-03-12', time: '16:00 - 23:00', clientName: 'Aisha Bello', clientPhone: '+234 802 555 6666', guestCount: 500, eventType: 'Birthday', staffRole: 'Event Coordinator', location: 'Central District, Abuja', notes: 'Traditional attire theme. Jollof cooking station required.', status: 'upcoming' },
  { id: 4, eventName: 'PH Corporate Retreat', venueName: 'Crystal Gardens', hallName: 'Outdoor Pavilion', date: '2026-03-20', time: '10:00 - 16:00', clientName: 'Chidi Okonkwo', clientPhone: '+234 701 777 8888', guestCount: 80, eventType: 'Corporate', staffRole: 'Supervisor', location: 'GRA, Port Harcourt', notes: 'Team-building activities in the afternoon.', status: 'upcoming' },
  { id: 5, eventName: 'Owoeye Anniversary', venueName: 'Ibadan Heritage Hall', hallName: 'Cultural Hall', date: '2026-04-02', time: '15:00 - 21:00', clientName: 'Biodun Owoeye', clientPhone: '+234 808 999 0000', guestCount: 250, eventType: 'Anniversary', staffRole: 'Event Coordinator', location: 'Ring Road, Ibadan', notes: 'Silver anniversary. Photo booth setup required.', status: 'upcoming' },
  { id: 6, eventName: 'Enugu Graduation Ball', venueName: 'Enugu Grand Events', hallName: 'Main Hall', date: '2026-04-15', time: '18:00 - 00:00', clientName: 'Ngozi Eze', clientPhone: '+234 805 112 3344', guestCount: 300, eventType: 'Graduation', staffRole: 'Supervisor', location: 'Independence Layout, Enugu', notes: 'Black tie event. Red carpet entrance.', status: 'upcoming' },
  { id: 7, eventName: 'Bakare Wedding', venueName: 'Ocean View Events', hallName: 'Terrace Hall', date: '2026-02-15', time: '14:00 - 22:00', clientName: 'Kemi Bakare', clientPhone: '+234 803 222 3333', guestCount: 350, eventType: 'Wedding', staffRole: 'Event Coordinator', location: 'Lekki, Lagos', notes: '', status: 'completed' },
  { id: 8, eventName: 'Abuja Trade Expo', venueName: 'Sheraton Abuja Event Wing', hallName: 'Exhibition Hall', date: '2026-02-20', time: '08:00 - 18:00', clientName: 'Dr. Musa Ibrahim', clientPhone: '+234 706 444 5555', guestCount: 400, eventType: 'Conference', staffRole: 'Supervisor', location: 'Maitama, Abuja', notes: '', status: 'completed' },
  { id: 9, eventName: 'Lagos Fashion Show', venueName: 'Grand Palace Event Center', hallName: 'Exhibition Hall', date: '2026-01-25', time: '17:00 - 22:00', clientName: 'Tola Williams', clientPhone: '+234 804 666 7777', guestCount: 150, eventType: 'Party', staffRole: 'Event Coordinator', location: 'Ikeja, Lagos', notes: '', status: 'completed' },
  { id: 10, eventName: 'River State Cultural Festival', venueName: 'Crystal Gardens', hallName: 'Outdoor Pavilion', date: '2026-01-18', time: '10:00 - 20:00', clientName: 'Tamuno Briggs', clientPhone: '+234 803 888 9999', guestCount: 600, eventType: 'Party', staffRole: 'Supervisor', location: 'GRA, Port Harcourt', notes: '', status: 'cancelled' },
];

const STATUS_COLORS: Record<string, string> = {
  upcoming: 'bg-blue-100 text-blue-700',
  'in-progress': 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

function isToday(date: string) {
  const today = new Date().toISOString().split('T')[0];
  return date === today;
}

function isThisWeek(date: string) {
  const now = new Date();
  const d = new Date(date);
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);
  return d >= startOfWeek && d <= endOfWeek;
}

export default function StaffSchedule() {
  const [events, setEvents] = useState<StaffEvent[]>(MOCK_EVENTS);
  const [tab, setTab] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState<StaffEvent | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const filtered = events.filter((e) => {
    if (tab === 'today') return isToday(e.date);
    if (tab === 'week') return isThisWeek(e.date);
    return true;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleMarkComplete = (id: number) => {
    setEvents((prev) => prev.map((e) => e.id === id ? { ...e, status: 'completed' } : e));
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">My Schedule</h2>
        <p className="text-sm text-gray-500">Track your assigned events and responsibilities</p>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="all">All Events</TabsTrigger>
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No events for this period</p>
          <p className="text-sm text-gray-400">Check back later or view all events</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((event) => (
            <div key={event.id} className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{event.eventName}</h4>
                  <p className="text-sm text-gray-500">{event.venueName} · {event.hallName}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[event.status]}`}>
                    {event.status.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  </span>
                  <Badge variant="outline" className="text-xs">{event.staffRole}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-blue-500" />
                  {new Date(event.date).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-blue-500" />
                  {event.time}
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-blue-500" />
                  {event.guestCount} guests
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-blue-500" />
                  {event.location}
                </div>
              </div>

              <Button size="sm" variant="outline" onClick={() => { setSelectedEvent(event); setDetailOpen(true); }}>
                <Eye className="h-4 w-4 mr-1.5" /> View Details
              </Button>
            </div>
          ))}
        </div>
      )}

      <EventDetailModal
        event={selectedEvent}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onMarkComplete={handleMarkComplete}
      />
    </div>
  );
}
