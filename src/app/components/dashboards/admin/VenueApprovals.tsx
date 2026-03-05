import React, { useEffect, useState } from 'react';
import { Building2, MapPin, Phone, Mail, Check, X, Eye } from 'lucide-react';
import { Button } from '../../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { toast } from 'sonner';
import { fetchPendingVenues, fetchAllVenuesAdmin, approveVenue, rejectVenue } from '../../../../lib/api/admin';

type Tab = 'pending' | 'all';

export default function VenueApprovals() {
  const [tab, setTab] = useState<Tab>('pending');
  const [pending, setPending] = useState<any[]>([]);
  const [all, setAll] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([fetchPendingVenues(), fetchAllVenuesAdmin()])
      .then(([p, a]) => { setPending(p); setAll(a); })
      .catch((e) => console.error('[admin] venues load error:', e))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id: string) => {
    try {
      await approveVenue(id);
      toast.success('Venue approved and is now live.');
      load();
      setSelected(null);
    } catch {
      toast.error('Failed to approve venue.');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectVenue(id);
      toast.error('Venue rejected and removed.');
      load();
      setSelected(null);
    } catch {
      toast.error('Failed to reject venue.');
    }
  };

  const venues = tab === 'pending' ? pending : all;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Venue Approvals</h2>
        <p className="text-sm text-gray-500">Review and approve or reject venue registrations</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {(['pending', 'all'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {t === 'pending' ? `Pending (${pending.length})` : `All Venues (${all.length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-xl" />)}
        </div>
      ) : venues.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border">
          <Building2 className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">{tab === 'pending' ? 'No pending venues' : 'No venues registered yet'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {venues.map((v) => (
            <div key={v.id} className="bg-white border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Cover */}
              <div className="h-16 w-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                {v.cover_image && (
                  <img src={v.cover_image} alt={v.name} className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-gray-900">{v.name}</p>
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${v.verified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {v.verified ? 'Active' : 'Pending'}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                  <MapPin className="h-3.5 w-3.5" />{v.city}, {v.state}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  Owner: {v.profiles?.full_name ?? 'N/A'} · {v.profiles?.email ?? ''} · Submitted {new Date(v.created_at).toLocaleDateString('en-NG')}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-shrink-0">
                <Button size="sm" variant="outline" onClick={() => setSelected(v)}>
                  <Eye className="h-3.5 w-3.5 mr-1" /> View
                </Button>
                {!v.verified && (
                  <>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleApprove(v.id)}>
                      <Check className="h-3.5 w-3.5 mr-1" /> Approve
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleReject(v.id)}>
                      <X className="h-3.5 w-3.5 mr-1" /> Reject
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Venue Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 py-2">
              {selected.cover_image && (
                <img src={selected.cover_image} alt={selected.name}
                  className="w-full h-48 object-cover rounded-xl"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              )}
              <div>
                <h3 className="text-lg font-bold">{selected.name}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <MapPin className="h-3.5 w-3.5" />{selected.city}, {selected.state}
                </div>
              </div>
              {selected.description && <p className="text-sm text-gray-600">{selected.description}</p>}
              <div className="p-3 bg-gray-50 rounded-xl space-y-1.5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Owner Info</p>
                <p className="text-sm font-medium">{selected.profiles?.full_name ?? 'N/A'}</p>
                {selected.profiles?.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-3.5 w-3.5" />{selected.profiles.email}
                  </div>
                )}
                {selected.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-3.5 w-3.5" />{selected.phone}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Category</p>
                  <p className="font-medium capitalize">{selected.category}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Max Capacity</p>
                  <p className="font-medium">{selected.max_capacity?.toLocaleString()} guests</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Price From</p>
                  <p className="font-medium text-green-700">₦{selected.price_from?.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Status</p>
                  <p className={`font-medium ${selected.verified ? 'text-green-700' : 'text-amber-700'}`}>
                    {selected.verified ? 'Active' : 'Pending Review'}
                  </p>
                </div>
              </div>
              {!selected.verified && (
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => handleReject(selected.id)}>
                    <X className="h-4 w-4 mr-1.5" /> Reject
                  </Button>
                  <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleApprove(selected.id)}>
                    <Check className="h-4 w-4 mr-1.5" /> Approve Venue
                  </Button>
                </div>
              )}
              {selected.verified && (
                <Button variant="outline" className="w-full" onClick={() => setSelected(null)}>Close</Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
