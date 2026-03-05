import React, { useEffect, useState } from 'react';
import { Building2, Users, Clock, Calendar, AlertTriangle } from 'lucide-react';
import StatCard from '../shared/StatCard';
import { fetchAdminStats, fetchPendingVenues } from '../../../../lib/api/admin';

interface Stats { totalUsers: number; activeVenues: number; pendingApprovals: number; totalBookings: number; }

export default function AdminDashboardHome({ onGoToApprovals }: { onGoToApprovals: () => void }) {
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, activeVenues: 0, pendingApprovals: 0, totalBookings: 0 });
  const [pending, setPending] = useState<any[]>([]);

  useEffect(() => {
    fetchAdminStats().then(setStats).catch((e) => console.error('[admin] stats error:', e));
    fetchPendingVenues().then(setPending).catch((e) => console.error('[admin] pending venues error:', e));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Admin Overview</h2>
        <p className="text-sm text-gray-500">Platform health and pending actions</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={<Users className="h-5 w-5" />} label="Total Users" value={stats.totalUsers.toString()} color="blue" />
        <StatCard icon={<Building2 className="h-5 w-5" />} label="Active Venues" value={stats.activeVenues.toString()} color="green" />
        <StatCard icon={<Clock className="h-5 w-5" />} label="Pending Approvals" value={stats.pendingApprovals.toString()} trend={stats.pendingApprovals > 0 ? 'Needs attention' : 'All clear'} trendUp={stats.pendingApprovals === 0} color="orange" />
        <StatCard icon={<Calendar className="h-5 w-5" />} label="Total Bookings" value={stats.totalBookings.toString()} color="purple" />
      </div>

      {pending.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-amber-900">
                {pending.length} venue{pending.length !== 1 ? 's' : ''} awaiting approval
              </p>
              <p className="text-sm text-amber-700 mt-0.5">
                Review and approve or reject pending venue registrations before they go live.
              </p>
              <button
                onClick={onGoToApprovals}
                className="mt-2 text-sm font-medium text-amber-800 underline hover:text-amber-900"
              >
                Review now →
              </button>
            </div>
          </div>
        </div>
      )}

      {pending.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Recent Pending Venues</h3>
          <div className="space-y-3">
            {pending.slice(0, 5).map((v) => (
              <div key={v.id} className="bg-white border rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{v.name}</p>
                  <p className="text-sm text-gray-500">{v.city}, {v.state} · Owner: {v.profiles?.full_name ?? v.profiles?.email ?? 'Unknown'}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Submitted {new Date(v.created_at).toLocaleDateString('en-NG')}</p>
                </div>
                <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">Pending</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {pending.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border">
          <Building2 className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="font-medium text-gray-700">No pending approvals</p>
          <p className="text-sm text-gray-400">All venue registrations have been reviewed.</p>
        </div>
      )}
    </div>
  );
}
