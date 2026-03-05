import React, { useEffect, useState } from 'react';
import { Users, Search, Building2, CheckCircle2, XCircle, Trash2, AlertCircle } from 'lucide-react';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { toast } from 'sonner';
import { fetchAllStaff, adminUpdateStaffStatus, adminDeleteStaff } from '../../../../lib/api/admin';

const ROLE_LABELS: Record<string, string> = {
  coordinator: 'Event Coordinator', supervisor: 'Supervisor', cleaner: 'Cleaner',
  security: 'Security', catering: 'Catering Staff', technician: 'AV Technician',
};

type FilterStatus = 'all' | 'active' | 'inactive';

export default function AdminStaffManagement() {
  const [staff, setStaff] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetchAllStaff().then(setStaff).catch((e) => console.error('[admin] staff load error:', e)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleToggleStatus = async (id: string, current: string) => {
    const next = current === 'active' ? 'inactive' : 'active';
    try {
      await adminUpdateStaffStatus(id, next);
      setStaff((prev) => prev.map((s) => s.id === id ? { ...s, status: next } : s));
      toast.success(`Staff member ${next === 'active' ? 'reactivated' : 'deactivated'}.`);
    } catch {
      toast.error('Failed to update status.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminDeleteStaff(id);
      setStaff((prev) => prev.filter((s) => s.id !== id));
      setDeleteId(null);
      toast.success('Staff member removed.');
    } catch {
      toast.error('Failed to remove staff member.');
    }
  };

  const filtered = staff.filter((s) => {
    const name = (s.profiles?.full_name ?? '').toLowerCase();
    const venue = (s.venues?.name ?? '').toLowerCase();
    const q = search.toLowerCase();
    const matchSearch = !q || name.includes(q) || venue.includes(q) || s.role.includes(q);
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = { all: staff.length, active: staff.filter(s => s.status === 'active').length, inactive: staff.filter(s => s.status === 'inactive').length };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Staff Management</h2>
        <p className="text-sm text-gray-500">All staff across all venues — HR overview</p>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {(['all', 'active', 'inactive'] as FilterStatus[]).map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${statusFilter === s ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {s.charAt(0).toUpperCase() + s.slice(1)} ({counts[s]})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input className="pl-9" placeholder="Search by name, venue or role..."
          value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border">
          <Users className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No staff members found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Staff Member</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Role</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Venue</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Joined</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-700 flex-shrink-0">
                        {(s.profiles?.full_name ?? 'S').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{s.profiles?.full_name ?? 'Pending Registration'}</p>
                        <p className="text-xs text-gray-400 font-mono">{s.staff_code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full">
                      {ROLE_LABELS[s.role] ?? s.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Building2 className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                      <span>{s.venues?.name ?? '—'}</span>
                    </div>
                    <p className="text-xs text-gray-400 ml-5">{s.venues?.city ?? ''}</p>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-gray-400 text-xs">
                    {new Date(s.join_date ?? s.created_at).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${s.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {s.status === 'active' ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                      {s.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline"
                        className={s.status === 'active' ? 'text-amber-600 border-amber-200 hover:bg-amber-50' : 'text-green-600 border-green-200 hover:bg-green-50'}
                        onClick={() => handleToggleStatus(s.id, s.status)}>
                        {s.status === 'active' ? 'Deactivate' : 'Reactivate'}
                      </Button>
                      {deleteId === s.id ? (
                        <div className="flex items-center gap-1">
                          <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => handleDelete(s.id)}>Confirm</Button>
                          <Button size="sm" variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
                        </div>
                      ) : (
                        <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50"
                          onClick={() => setDeleteId(s.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-2 bg-gray-50 border-t text-xs text-gray-400">
            Showing {filtered.length} of {staff.length} staff members
          </div>
        </div>
      )}

      {/* Info note */}
      <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700">
        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <p>Deactivating a staff member prevents them from logging in and accessing their dashboard. Removing a staff member is permanent.</p>
      </div>
    </div>
  );
}
