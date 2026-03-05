import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Checkbox } from '../../ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Building2, MapPin, Plus, Edit, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../../lib/supabase';

const ALL_FACILITIES = ['Air Conditioning', 'Parking', 'Generator', 'Stage', 'Sound System', 'Lighting', 'Tables & Chairs', 'Toilets', 'Catering Kitchen', 'Dressing Room', 'Security', 'WiFi'];

interface VenueRow {
  id: string;
  name: string;
  city: string;
  state: string;
  description: string | null;
  facilities: string[];
  phone: string | null;
  email: string | null;
  cover_image: string | null;
  verified: boolean;
  max_capacity: number | null;
  halls: { id: string }[];
}

function EditDialog({ venue, open, onOpenChange, onSave }: {
  venue: VenueRow;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSave: (id: string, updates: Partial<VenueRow>) => void;
}) {
  const [form, setForm] = useState({
    name: venue.name,
    city: venue.city,
    phone: venue.phone ?? '',
    email: venue.email ?? '',
    description: venue.description ?? '',
    facilities: venue.facilities ?? [],
  });
  const [saving, setSaving] = useState(false);

  const toggleFacility = (f: string) => {
    setForm((p) => ({
      ...p,
      facilities: p.facilities.includes(f) ? p.facilities.filter((x) => x !== f) : [...p.facilities, f],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from('venues').update({
      name: form.name, city: form.city, phone: form.phone,
      email: form.email, description: form.description, facilities: form.facilities,
    }).eq('id', venue.id);
    setSaving(false);
    if (error) { toast.error('Failed to save changes.'); return; }
    toast.success('Event center updated!');
    onSave(venue.id, { name: form.name, city: form.city, phone: form.phone, email: form.email, description: form.description, facilities: form.facilities });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Edit Event Center</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label>Venue Name</Label>
            <Input className="mt-1" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
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
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function MyEventCenters() {
  const { user } = useAuth();
  const [venues, setVenues] = useState<VenueRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editVenue, setEditVenue] = useState<VenueRow | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from('venues')
      .select('id, name, city, state, description, facilities, phone, email, cover_image, verified, max_capacity, halls(id)')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => { setVenues((data ?? []) as VenueRow[]); setLoading(false); });
  }, [user?.id]);

  const handleSave = (id: string, updates: Partial<VenueRow>) => {
    setVenues((prev) => prev.map((v) => v.id === id ? { ...v, ...updates } : v));
    setEditVenue(null);
  };

  if (loading) return (
    <div className="space-y-3">{[...Array(2)].map((_, i) => <div key={i} className="h-40 bg-gray-100 animate-pulse rounded-xl" />)}</div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Event Centers</h2>
          <p className="text-sm text-gray-500">{venues.length} registered venue{venues.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/register/event-center">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" size="sm">
            <Plus className="h-4 w-4 mr-1.5" /> Add New Venue
          </Button>
        </Link>
      </div>

      {venues.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border">
          <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-800 font-semibold">No event centers yet</p>
          <p className="text-sm text-gray-500 mt-1 mb-4">Register your first event center to start receiving bookings.</p>
          <Link to="/register/event-center">
            <Button className="bg-green-600 hover:bg-green-700 text-white">Register Event Center</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {venues.map((venue) => (
            <div key={venue.id} className="bg-white rounded-xl border overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-48 h-40 md:h-auto flex-shrink-0 bg-gray-100 flex items-center justify-center">
                  {venue.cover_image ? (
                    <img src={venue.cover_image} alt={venue.name} className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  ) : (
                    <Building2 className="h-10 w-10 text-gray-300" />
                  )}
                </div>

                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900">{venue.name}</h3>
                        {venue.verified ? (
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">Active</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Pending Approval
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin className="h-3.5 w-3.5" /> {venue.city}, {venue.state}
                      </div>
                    </div>
                  </div>

                  {venue.description && <p className="text-sm text-gray-600 mb-4 line-clamp-2">{venue.description}</p>}

                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="text-center p-2 bg-blue-50 rounded-xl">
                      <p className="font-bold text-blue-700">{venue.halls?.length ?? 0}</p>
                      <p className="text-xs text-blue-600">Halls</p>
                    </div>
                    <div className="text-center p-2 bg-purple-50 rounded-xl">
                      <p className="font-bold text-purple-700">{venue.max_capacity?.toLocaleString() ?? '—'}</p>
                      <p className="text-xs text-purple-600">Max Capacity</p>
                    </div>
                  </div>

                  {!venue.verified && (
                    <p className="text-xs text-amber-700 mb-3 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                      Awaiting admin approval before appearing on the public listing.
                    </p>
                  )}

                  <Button size="sm" variant="outline" onClick={() => setEditVenue(venue)}>
                    <Edit className="h-4 w-4 mr-1.5" /> Edit Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editVenue && (
        <EditDialog
          venue={editVenue}
          open={!!editVenue}
          onOpenChange={(o) => { if (!o) setEditVenue(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
