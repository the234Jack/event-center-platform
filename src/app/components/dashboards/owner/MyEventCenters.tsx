import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Checkbox } from '../../ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Building2, MapPin, Plus, Edit, Star, DollarSign, Users, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { venues } from '../../../../data/venues';

const ALL_FACILITIES = ['Air Conditioning', 'Parking', 'Generator', 'Stage', 'Sound System', 'Lighting', 'Tables & Chairs', 'Toilets', 'Catering Kitchen', 'Dressing Room', 'Security', 'WiFi'];

interface EventCenter {
  id: string;
  name: string;
  city: string;
  state: string;
  description: string;
  facilities: string[];
  phone: string;
  email: string;
  hallCount: number;
  totalBookings: number;
  totalRevenue: number;
  status: 'active' | 'pending';
  image: string;
  rating: number;
}

const OWNER_CENTERS: EventCenter[] = [
  {
    id: 'venue-1', name: 'Grand Palace Event Center', city: 'Ikeja', state: 'Lagos', description: 'A premier event center offering world-class facilities for weddings, corporate events, and celebrations of all kinds.',
    facilities: ['Air Conditioning', 'Parking', 'Generator', 'Stage', 'Sound System'], phone: '+234 803 100 0001', email: 'info@grandpalace.ng',
    hallCount: 3, totalBookings: 48, totalRevenue: 4800000, status: 'active', image: venues[0]?.coverImage ?? 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400', rating: 4.8,
  },
  {
    id: 'venue-2', name: 'Elite Events Hub', city: 'Victoria Island', state: 'Lagos', description: 'Modern event hub in the heart of Victoria Island, perfect for corporate gatherings and high-profile events.',
    facilities: ['Air Conditioning', 'Parking', 'WiFi', 'Stage', 'Sound System', 'Lighting'], phone: '+234 803 200 0002', email: 'info@eliteevents.ng',
    hallCount: 4, totalBookings: 62, totalRevenue: 6500000, status: 'active', image: venues[1]?.coverImage ?? 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400', rating: 4.6,
  },
  {
    id: 'venue-7', name: 'Ocean View Events', city: 'Lekki', state: 'Lagos', description: 'Stunning waterfront venue with panoramic views, ideal for outdoor events and exclusive gatherings.',
    facilities: ['Parking', 'Sound System', 'Lighting', 'Security'], phone: '+234 803 300 0007', email: 'info@oceanview.ng',
    hallCount: 2, totalBookings: 18, totalRevenue: 1800000, status: 'pending', image: 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=400', rating: 4.3,
  },
];

interface EditDialogProps {
  center: EventCenter;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updated: EventCenter) => void;
}

function EditDialog({ center, open, onOpenChange, onSave }: EditDialogProps) {
  const [form, setForm] = useState({ ...center });

  const toggleFacility = (f: string) => {
    setForm((p) => ({
      ...p,
      facilities: p.facilities.includes(f) ? p.facilities.filter((x) => x !== f) : [...p.facilities, f],
    }));
  };

  const handleSave = () => {
    onSave(form);
    toast.success('Event center details updated!');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Event Center</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label htmlFor="centerName">Venue Name</Label>
            <Input id="centerName" className="mt-1" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>City</Label>
              <Input className="mt-1" value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} />
            </div>
            <div>
              <Label>Phone</Label>
              <Input className="mt-1" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
            </div>
          </div>
          <div>
            <Label>Email</Label>
            <Input className="mt-1" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea className="mt-1 resize-none" rows={3} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
          </div>
          <div>
            <Label className="mb-2 block">Facilities</Label>
            <div className="grid grid-cols-2 gap-2">
              {ALL_FACILITIES.map((f) => (
                <label key={f} className="flex items-center gap-2 cursor-pointer text-sm p-1.5 rounded hover:bg-gray-50">
                  <Checkbox checked={form.facilities.includes(f)} onCheckedChange={() => toggleFacility(f)} />
                  {f}
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function MyEventCenters() {
  const [centers, setCenters] = useState<EventCenter[]>(OWNER_CENTERS);
  const [editCenter, setEditCenter] = useState<EventCenter | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const handleSave = (updated: EventCenter) => {
    setCenters((prev) => prev.map((c) => c.id === updated.id ? updated : c));
    setEditCenter(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Event Centers</h2>
          <p className="text-sm text-gray-500">{centers.length} registered venues</p>
        </div>
        <Link to="/register/event-center">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" size="sm">
            <Plus className="h-4 w-4 mr-1.5" /> Add New Venue
          </Button>
        </Link>
      </div>

      <div className="space-y-5">
        {centers.map((center) => (
          <div key={center.id} className="bg-white rounded-xl border overflow-hidden hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row">
              {/* Image */}
              <div className="md:w-48 h-40 md:h-auto flex-shrink-0">
                <img src={center.image} alt={center.name} className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400'; }} />
              </div>

              {/* Info */}
              <div className="flex-1 p-5">
                <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{center.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${center.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {center.status.charAt(0).toUpperCase() + center.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="h-3.5 w-3.5" /> {center.city}, {center.state}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-semibold text-gray-700 text-sm">{center.rating}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{center.description}</p>

                <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
                  <div className="text-center p-2 bg-blue-50 rounded-xl">
                    <p className="font-bold text-blue-700">{center.hallCount}</p>
                    <p className="text-xs text-blue-600">Halls</p>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded-xl">
                    <p className="font-bold text-green-700">{center.totalBookings}</p>
                    <p className="text-xs text-green-600">Bookings</p>
                  </div>
                  <div className="text-center p-2 bg-purple-50 rounded-xl">
                    <p className="font-bold text-purple-700">₦{(center.totalRevenue / 1000000).toFixed(1)}M</p>
                    <p className="text-xs text-purple-600">Revenue</p>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" variant="outline" onClick={() => { setEditCenter(center); setEditOpen(true); }}>
                    <Edit className="h-4 w-4 mr-1.5" /> Edit Details
                  </Button>
                  <Link to={`/venue/${center.id}`}>
                    <Button size="sm" variant="outline">
                      <Building2 className="h-4 w-4 mr-1.5" /> View Listing
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editCenter && (
        <EditDialog
          center={editCenter}
          open={editOpen}
          onOpenChange={setEditOpen}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
