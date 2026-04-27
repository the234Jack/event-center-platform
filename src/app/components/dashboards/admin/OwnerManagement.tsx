import React, { useEffect, useState } from 'react';
import { Briefcase, Search, MapPin, Phone, Mail, Building2, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '../../ui/alert-dialog';
import { toast } from 'sonner';
import { fetchAllOwners, deleteVenue } from '../../../../lib/api/admin';

export default function OwnerManagement() {
  const [owners, setOwners] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);

  const load = () => {
    setLoading(true);
    fetchAllOwners()
      .then(setOwners)
      .catch((e) => console.error('[admin] owners load error:', e))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteVenue(pendingDelete.id);
      toast.success(`"${pendingDelete.name}" has been removed.`);
      setPendingDelete(null);
      load();
    } catch (e) {
      console.error('[admin] delete venue error:', e);
      toast.error('Failed to remove venue.');
    }
  };

  const filtered = owners.filter((o) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (o.full_name ?? '').toLowerCase().includes(q) ||
      (o.email ?? '').toLowerCase().includes(q) ||
      (o.business_name ?? '').toLowerCase().includes(q) ||
      o.venues.some((v: any) => v.name.toLowerCase().includes(q) || (v.city ?? '').toLowerCase().includes(q))
    );
  });

  const totalVenues = owners.reduce((sum, o) => sum + o.venues.length, 0);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Owner Management</h2>
        <p className="text-sm text-gray-500">All venue owners and their event centers</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white border rounded-xl p-3">
          <p className="text-xs text-gray-500">Total Owners</p>
          <p className="text-xl font-bold text-gray-900">{owners.length}</p>
        </div>
        <div className="bg-white border rounded-xl p-3">
          <p className="text-xs text-gray-500">Total Venues</p>
          <p className="text-xl font-bold text-gray-900">{totalVenues}</p>
        </div>
        <div className="bg-white border rounded-xl p-3">
          <p className="text-xs text-gray-500">Avg / Owner</p>
          <p className="text-xl font-bold text-gray-900">{owners.length ? (totalVenues / owners.length).toFixed(1) : '0'}</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input className="pl-9" placeholder="Search owner, business, or venue..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-gray-100 animate-pulse rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border">
          <Briefcase className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">{owners.length === 0 ? 'No owners registered yet' : 'No matching owners'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => {
            const isOpen = expanded[o.id] ?? false;
            return (
              <div key={o.id} className="bg-white border rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpanded((s) => ({ ...s, [o.id]: !isOpen }))}
                  className="w-full p-4 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {(o.full_name ?? 'O').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{o.full_name ?? 'Unnamed Owner'}</p>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-500 mt-0.5">
                      {o.business_name && <span className="font-medium text-gray-600">{o.business_name}</span>}
                      {o.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{o.email}</span>}
                      {o.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{o.phone}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      {o.venues.length} venue{o.venues.length !== 1 ? 's' : ''}
                    </span>
                    {isOpen ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t bg-gray-50/50 p-4 space-y-2">
                    {o.venues.length === 0 ? (
                      <p className="text-sm text-gray-400 italic px-2">This owner has no venues yet.</p>
                    ) : (
                      o.venues.map((v: any) => (
                        <div key={v.id} className="flex items-center gap-3 bg-white border rounded-lg p-3">
                          <div className="h-12 w-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                            {v.cover_image && (
                              <img src={v.cover_image} alt={v.name} className="w-full h-full object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-medium text-gray-900 text-sm truncate">{v.name}</p>
                              <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${v.verified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                {v.verified ? 'Active' : 'Pending'}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{v.city}, {v.state}</span>
                              {v.max_capacity > 0 && <span>{v.max_capacity.toLocaleString()} guests</span>}
                              {v.price_from > 0 && <span>From ₦{v.price_from.toLocaleString()}</span>}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50 flex-shrink-0"
                            onClick={() => setPendingDelete({ id: v.id, name: v.name })}
                          >
                            <Trash2 className="h-3.5 w-3.5 sm:mr-1" />
                            <span className="hidden sm:inline">Remove</span>
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this event center?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <span className="font-semibold">{pendingDelete?.name}</span>, all its halls, and any bookings or saved-venue records associated with it. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Yes, remove venue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
