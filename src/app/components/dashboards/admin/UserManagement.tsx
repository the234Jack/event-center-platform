import React, { useEffect, useState } from 'react';
import { Users, Search, Shield, User, Briefcase, Building2 } from 'lucide-react';
import { Input } from '../../ui/input';
import { fetchAllUsers } from '../../../../lib/api/admin';

const ROLE_BADGE: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  client:  { label: 'Client',  className: 'bg-blue-100 text-blue-700',   icon: <User className="h-3 w-3" /> },
  staff:   { label: 'Staff',   className: 'bg-purple-100 text-purple-700', icon: <Briefcase className="h-3 w-3" /> },
  owner:   { label: 'Owner',   className: 'bg-green-100 text-green-700',  icon: <Building2 className="h-3 w-3" /> },
  admin:   { label: 'Admin',   className: 'bg-slate-200 text-slate-800',  icon: <Shield className="h-3 w-3" /> },
};

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllUsers()
      .then(setUsers)
      .catch((e) => console.error('[admin] users load error:', e))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch = !q || (u.full_name ?? '').toLowerCase().includes(q) || u.id.toLowerCase().includes(q);
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const counts = users.reduce((acc, u) => { acc[u.role] = (acc[u.role] ?? 0) + 1; return acc; }, {} as Record<string, number>);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">User Management</h2>
        <p className="text-sm text-gray-500">All registered users on the platform</p>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-2">
        {['all', 'client', 'staff', 'owner', 'admin'].map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
              roleFilter === r ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
            }`}
          >
            {r === 'all' ? `All (${users.length})` : `${r.charAt(0).toUpperCase() + r.slice(1)} (${counts[r] ?? 0})`}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input className="pl-9" placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-gray-100 animate-pulse rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border">
          <Users className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No users found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Role</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Location</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((u) => {
                const badge = ROLE_BADGE[u.role] ?? ROLE_BADGE.client;
                return (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${
                          u.role === 'admin' ? 'bg-slate-700' : u.role === 'owner' ? 'bg-green-600' : u.role === 'staff' ? 'bg-purple-600' : 'bg-blue-600'
                        }`}>
                          {(u.full_name ?? 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{u.full_name ?? 'Unnamed User'}</p>
                          <p className="text-xs text-gray-400">{u.phone ?? '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${badge.className}`}>
                        {badge.icon}{badge.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-500">
                      {u.lga && u.state ? `${u.lga}, ${u.state}` : '—'}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-400 text-xs">
                      {new Date(u.created_at).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="px-4 py-2 bg-gray-50 border-t text-xs text-gray-400">
            Showing {filtered.length} of {users.length} users
          </div>
        </div>
      )}
    </div>
  );
}
