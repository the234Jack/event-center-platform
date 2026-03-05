import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Calendar, Star, Heart, DollarSign, Plus, Building2, Eye, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from './shared/DashboardLayout';
import StatCard from './shared/StatCard';
import MyBookings from './client/MyBookings';
import BookingModal from './client/BookingModal';
import SavedVenues from './client/SavedVenues';
import ClientProfile from './client/ClientProfile';
import { fetchClientBookings, fetchSavedVenues } from '../../../lib/api/bookings';

const SECTION_TITLES: Record<string, string> = {
  overview: 'Overview',
  bookings: 'My Bookings',
  saved: 'Saved Venues',
  profile: 'Profile Settings',
};

const STATUS_STYLES: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-700 border border-green-200',
  pending: 'bg-amber-100 text-amber-700 border border-amber-200',
  cancelled: 'bg-red-100 text-red-600 border border-red-200',
};

const QUICK_ACTIONS = [
  { label: 'Browse Venues', desc: 'Discover top venues', icon: Building2, href: '/browse', color: 'text-blue-600 bg-blue-50' },
  { label: 'My Bookings', desc: 'View & manage', icon: Calendar, section: 'bookings', color: 'text-purple-600 bg-purple-50' },
  { label: 'Saved Venues', desc: 'Your favourites', icon: Heart, section: 'saved', color: 'text-red-500 bg-red-50' },
];

export default function ClientDashboard() {
  const { user } = useAuth();
  const [section, setSection] = useState('overview');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    if (!user?.id) return;
    const today = new Date().toISOString().split('T')[0];
    fetchClientBookings(user.id).then((rows) => {
      setTotalBookings(rows.length);
      setUpcomingCount(rows.filter((r: any) => (r.status === 'confirmed' || r.status === 'pending') && r.event_date >= today).length);
      setTotalSpent(rows.filter((r: any) => r.status === 'confirmed').reduce((sum: number, r: any) => sum + (r.total_cost ?? 0), 0));
      setRecentBookings(rows.slice(0, 3).map((r: any) => ({
        id: r.id,
        venueName: r.venues?.name ?? 'Unknown Venue',
        hallName: r.halls?.name ?? '',
        eventDate: r.event_date,
        eventType: r.event_type,
        status: r.status === 'confirmed' ? 'confirmed' : r.status === 'cancelled' ? 'cancelled' : 'pending',
      })));
    }).catch(() => {});
    fetchSavedVenues(user.id).then((rows) => setSavedCount(rows.length)).catch(() => {});
  }, [user?.id]);

  const firstName = user?.email?.split('@')[0] ?? 'there';
  const totalSpentFormatted = totalSpent >= 1_000_000 ? `₦${(totalSpent / 1_000_000).toFixed(1)}M` : totalSpent >= 1_000 ? `₦${(totalSpent / 1_000).toFixed(0)}K` : `₦${totalSpent}`;

  return (
    <DashboardLayout role="client" activeSection={section} onSectionChange={setSection} title={SECTION_TITLES[section]}>
      {section === 'overview' && (
        <div className="space-y-6">
          {/* Welcome Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-6 text-white">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-white blur-3xl translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-blue-300 blur-2xl" />
            </div>
            <div className="relative flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-4 w-4 text-blue-200" />
                  <span className="text-blue-200 text-sm font-medium">Client Dashboard</span>
                </div>
                <h2 className="text-2xl font-bold mb-1">Welcome back, {firstName}!</h2>
                <p className="text-blue-200 text-sm">Manage your bookings and discover amazing venues across Nigeria</p>
              </div>
              <button
                onClick={() => setBookingModalOpen(true)}
                className="flex items-center gap-2 bg-white text-blue-700 font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-50 transition-colors text-sm"
              >
                <Plus className="h-4 w-4" /> Book a Venue
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={<Calendar className="h-5 w-5 text-white" />}
              label="Total Bookings"
              value={totalBookings.toString()}
              iconBg="bg-gradient-to-br from-blue-500 to-blue-600"
            />
            <StatCard
              icon={<Calendar className="h-5 w-5 text-white" />}
              label="Upcoming Events"
              value={upcomingCount.toString()}
              iconBg="bg-gradient-to-br from-emerald-500 to-green-600"
            />
            <StatCard
              icon={<Heart className="h-5 w-5 text-white" />}
              label="Saved Venues"
              value={savedCount.toString()}
              iconBg="bg-gradient-to-br from-rose-500 to-red-600"
            />
            <StatCard
              icon={<DollarSign className="h-5 w-5 text-white" />}
              label="Total Spent"
              value={totalSpentFormatted}
              iconBg="bg-gradient-to-br from-violet-500 to-purple-600"
            />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-4">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              const inner = (
                <div className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 text-left w-full">
                  <div className={`h-10 w-10 rounded-xl ${action.color} flex items-center justify-center mb-3`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">{action.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{action.desc}</p>
                </div>
              );
              return action.href ? (
                <Link key={action.label} to={action.href}>{inner}</Link>
              ) : (
                <button key={action.label} onClick={() => setSection(action.section!)}>{inner}</button>
              );
            })}
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Recent Bookings</h3>
              <button
                onClick={() => setSection('bookings')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                View all <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="divide-y divide-gray-50">
              {recentBookings.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <Calendar className="h-10 w-10 mx-auto mb-3 text-gray-200" />
                  <p className="font-medium text-sm">No bookings yet</p>
                </div>
              ) : recentBookings.map((b) => (
                <div key={b.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-900">{b.venueName}</p>
                      <p className="text-xs text-gray-500">{b.hallName} · {b.eventType} · {new Date(b.eventDate).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[b.status]}`}>
                    {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Discover CTA */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-slate-300 text-sm">Discover Top Venues</span>
              </div>
              <p className="font-bold text-lg">500+ verified event centers across Nigeria</p>
              <p className="text-slate-400 text-sm mt-1">Lagos, Abuja, Port Harcourt, Ibadan and more</p>
            </div>
            <Link to="/browse">
              <button className="bg-white text-slate-900 font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-100 transition-colors text-sm flex items-center gap-2">
                Browse Venues <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      )}

      {section === 'bookings' && <MyBookings />}
      {section === 'saved' && <SavedVenues />}
      {section === 'profile' && <ClientProfile />}

      <BookingModal open={bookingModalOpen} onOpenChange={setBookingModalOpen} />
    </DashboardLayout>
  );
}
