import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import StatCard from '../shared/StatCard';
import { DollarSign, BookOpen, Building2, Users, TrendingUp, Check, X, Eye, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../../lib/supabase';
import { fetchOwnerBookings, updateBookingStatus } from '../../../../lib/api/bookings';

const REVENUE_DATA = [
  { month: 'Jan', revenue: 0, prev: 0 },
  { month: 'Feb', revenue: 0, prev: 0 },
  { month: 'Mar', revenue: 0, prev: 0 },
  { month: 'Apr', revenue: 0, prev: 0 },
  { month: 'May', revenue: 0, prev: 0 },
  { month: 'Jun', revenue: 0, prev: 0 },
];

const BOOKINGS_DATA = [
  { month: 'Jan', bookings: 0 }, { month: 'Feb', bookings: 0 },
  { month: 'Mar', bookings: 0 }, { month: 'Apr', bookings: 0 },
  { month: 'May', bookings: 0 }, { month: 'Jun', bookings: 0 },
];

const formatNaira = (value: number) => `₦${(value / 1000).toFixed(0)}K`;

interface Props {
  onViewRequests: () => void;
}

interface PendingRequest {
  id: string;
  clientName: string;
  venueName: string;
  eventDate: string;
  eventType: string;
  guestCount: number;
  estimatedBudget: number;
  status: 'pending' | 'accepted' | 'rejected';
}

export default function OwnerDashboardHome({ onViewRequests }: Props) {
  const { user } = useAuth();
  const [venueCount, setVenueCount] = useState(0);
  const [staffCount, setStaffCount] = useState(0);
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    if (!user?.id) return;

    // Fetch owner's venues
    supabase.from('venues').select('id').eq('owner_id', user.id).then(({ data: venueData }) => {
      const vIds = (venueData ?? []).map((v: any) => v.id);
      setVenueCount(vIds.length);

      if (vIds.length > 0) {
        supabase.from('staff_members').select('id', { count: 'exact', head: true }).in('venue_id', vIds)
          .then(({ count }) => setStaffCount(count ?? 0));
      }
    });

    // Fetch bookings for stats and pending requests
    fetchOwnerBookings(user.id).then((rows: any[]) => {
      const revenue = rows.filter((r) => r.status === 'confirmed').reduce((sum: number, r: any) => sum + (r.total_cost ?? 0), 0);
      setTotalRevenue(revenue);

      setRequests(rows.map((r) => ({
        id: r.id,
        clientName: r.profiles?.full_name ?? 'Unknown Client',
        venueName: r.venues?.name ?? '',
        eventDate: r.event_date,
        eventType: r.event_type,
        guestCount: r.guest_count,
        estimatedBudget: r.total_cost ?? 0,
        status: r.status === 'confirmed' ? 'accepted' : r.status === 'cancelled' ? 'rejected' : 'pending',
      })));
    }).catch(() => {});
  }, [user?.id]);

  const handleAccept = async (id: string) => {
    try {
      await updateBookingStatus(id, 'confirmed');
      setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: 'accepted' } : r));
      toast.success('Booking request accepted! Client will be notified.');
    } catch { toast.error('Failed to accept booking.'); }
  };

  const handleReject = async (id: string) => {
    try {
      await updateBookingStatus(id, 'cancelled');
      setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: 'rejected' } : r));
      toast.error('Booking request rejected.');
    } catch { toast.error('Failed to reject booking.'); }
  };

  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const activeBookings = requests.filter((r) => r.status === 'accepted').length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 via-emerald-700 to-teal-800 p-6 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-white blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-1/4 h-32 w-32 rounded-full bg-green-300 blur-2xl" />
        </div>
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="h-4 w-4 text-green-200" />
              <span className="text-green-200 text-sm font-medium">Owner Dashboard</span>
            </div>
            <h2 className="text-2xl font-bold mb-1">Business Overview</h2>
            <p className="text-green-200 text-sm">
              {pendingCount > 0
                ? <>You have <span className="text-white font-semibold">{pendingCount} pending</span> booking request{pendingCount !== 1 ? 's' : ''} awaiting your response</>
                : 'No pending booking requests — all caught up!'}
            </p>
          </div>
          <div className="flex flex-col gap-2 text-right">
            <div>
              <p className="text-green-200 text-xs">Revenue (confirmed bookings)</p>
              <p className="text-white font-bold text-xl">{totalRevenue > 0 ? `₦${(totalRevenue / 1000000).toFixed(1)}M` : '₦0'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<DollarSign className="h-5 w-5 text-white" />}
          label="Total Revenue"
          value={totalRevenue > 0 ? `₦${(totalRevenue / 1000000).toFixed(1)}M` : '₦0'}
          iconBg="bg-gradient-to-br from-emerald-500 to-green-600"
        />
        <StatCard
          icon={<BookOpen className="h-5 w-5 text-white" />}
          label="Accepted Bookings"
          value={activeBookings.toString()}
          iconBg="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          icon={<Building2 className="h-5 w-5 text-white" />}
          label="Event Centers"
          value={venueCount.toString()}
          iconBg="bg-gradient-to-br from-violet-500 to-purple-600"
        />
        <StatCard
          icon={<Users className="h-5 w-5 text-white" />}
          label="Staff Members"
          value={staffCount.toString()}
          iconBg="bg-gradient-to-br from-orange-500 to-amber-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Revenue Trend</p>
              <p className="text-xs text-gray-400">This year vs last year</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={REVENUE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={formatNaira} tick={{ fontSize: 10, fill: '#9ca3af' }} width={52} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(v: number) => [`₦${v.toLocaleString()}`, '']}
                contentStyle={{ borderRadius: 10, border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,.08)' }}
              />
              <Legend iconType="circle" iconSize={8} />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} dot={false} name="This Year" />
              <Line type="monotone" dataKey="prev" stroke="#a7f3d0" strokeWidth={2} dot={false} strokeDasharray="5 5" name="Last Year" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Monthly Bookings</p>
              <p className="text-xs text-gray-400">Jan – Jun 2026</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={BOOKINGS_DATA} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 10, border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,.08)' }}
              />
              <Bar dataKey="bookings" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Bookings" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pending Requests */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">Pending Booking Requests</h3>
            {pendingCount > 0 && (
              <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">{pendingCount}</span>
            )}
          </div>
          <button
            onClick={onViewRequests}
            className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
          >
            <Eye className="h-3.5 w-3.5" /> View All
          </button>
        </div>

        {pendingCount === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <BookOpen className="h-10 w-10 mx-auto mb-3 text-gray-200" />
            <p className="font-medium">No pending requests</p>
            <p className="text-sm mt-1">All caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {requests.filter((r) => r.status === 'pending').slice(0, 5).map((req) => (
              <div key={req.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="h-9 w-9 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-700 font-bold text-sm">{req.clientName.charAt(0)}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm text-gray-900">{req.clientName}</p>
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{req.eventType}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{req.venueName} · {req.guestCount} guests · ₦{req.estimatedBudget.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">{new Date(req.eventDate).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => handleAccept(req.id)}
                    className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                    <Check className="h-3.5 w-3.5" /> Accept
                  </button>
                  <button onClick={() => handleReject(req.id)}
                    className="flex items-center gap-1 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                    <X className="h-3.5 w-3.5" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
