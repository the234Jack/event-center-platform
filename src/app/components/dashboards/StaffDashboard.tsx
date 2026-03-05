import React, { useState, useEffect } from 'react';
import { Calendar, CheckSquare, Users, TrendingUp, ArrowRight, Clock, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from './shared/DashboardLayout';
import StatCard from './shared/StatCard';
import StaffSchedule from './staff/StaffSchedule';
import TaskManager from './staff/TaskManager';
import ClientDirectory from './staff/ClientDirectory';
import { supabase } from '../../../lib/supabase';

const SECTION_TITLES: Record<string, string> = {
  overview: 'Overview',
  schedule: 'My Schedule',
  tasks: 'Task Manager',
  clients: 'Client Directory',
};

const STATUS_COLORS: Record<string, string> = {
  upcoming: 'bg-blue-100 text-blue-700 border border-blue-200',
  'in-progress': 'bg-amber-100 text-amber-700 border border-amber-200',
  completed: 'bg-green-100 text-green-700 border border-green-200',
};

const QUICK_ACTIONS = [
  { label: 'Full Schedule', icon: Calendar, section: 'schedule', color: 'text-blue-600 bg-blue-50', desc: 'All upcoming events' },
  { label: 'Manage Tasks', icon: CheckSquare, section: 'tasks', color: 'text-purple-600 bg-purple-50', desc: 'Track your work' },
  { label: 'Client Directory', icon: Users, section: 'clients', color: 'text-green-600 bg-green-50', desc: 'Contact list' },
];

export default function StaffDashboard() {
  const { user } = useAuth();
  const [section, setSection] = useState('overview');
  const [todayEvents, setTodayEvents] = useState<any[]>([]);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [eventsThisMonth, setEventsThisMonth] = useState(0);

  useEffect(() => {
    if (!user?.id) return;
    supabase.from('staff_members').select('id, venue_id, venues(name)').eq('user_id', user.id).single()
      .then(({ data: sm }) => {
        if (!sm?.venue_id) return;
        const today = new Date().toISOString().split('T')[0];
        const monthStart = today.slice(0, 7) + '-01';
        const monthEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0];

        // Today's events
        supabase.from('bookings').select('id, event_type, event_date, start_time, end_time, status, venues(name)')
          .eq('venue_id', sm.venue_id).eq('event_date', today)
          .then(({ data }) => setTodayEvents((data ?? []).map((b: any) => ({
            id: b.id,
            eventName: b.event_type + ' Event',
            time: b.start_time && b.end_time ? `${b.start_time} - ${b.end_time}` : 'All Day',
            venueName: (sm as any).venues?.name ?? '',
            status: b.status === 'confirmed' ? 'upcoming' : 'upcoming',
          }))));

        // Events this month
        supabase.from('bookings').select('id', { count: 'exact', head: true })
          .eq('venue_id', sm.venue_id).gte('event_date', monthStart).lte('event_date', monthEnd)
          .then(({ count }) => setEventsThisMonth(count ?? 0));

        // Pending tasks
        supabase.from('tasks').select('id', { count: 'exact', head: true })
          .eq('staff_id', sm.id).eq('completed', false)
          .then(({ count }) => setPendingTasks(count ?? 0));
      }).catch(() => {});
  }, [user?.id]);

  const firstName = user?.email?.split('@')[0] ?? 'Staff';

  return (
    <DashboardLayout role="staff" activeSection={section} onSectionChange={setSection} title={SECTION_TITLES[section]}>
      {section === 'overview' && (
        <div className="space-y-6">
          {/* Welcome Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-purple-700 to-violet-800 p-6 text-white">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-white blur-3xl translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-purple-300 blur-2xl" />
            </div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="h-4 w-4 text-purple-200" />
                <span className="text-purple-200 text-sm font-medium">Staff Dashboard</span>
              </div>
              <h2 className="text-2xl font-bold mb-1">Good day, {firstName}!</h2>
              <p className="text-purple-200 text-sm">
                You have <span className="text-white font-semibold">{todayEvents.length} event{todayEvents.length !== 1 ? 's' : ''}</span> today. Stay on top of your schedule.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={<Calendar className="h-5 w-5 text-white" />}
              label="Today's Events"
              value={todayEvents.length.toString()}
              iconBg="bg-gradient-to-br from-blue-500 to-blue-600"
            />
            <StatCard
              icon={<CheckSquare className="h-5 w-5 text-white" />}
              label="Pending Tasks"
              value={pendingTasks.toString()}
              iconBg="bg-gradient-to-br from-amber-500 to-orange-500"
            />
            <StatCard
              icon={<Users className="h-5 w-5 text-white" />}
              label="Events This Month"
              value={eventsThisMonth.toString()}
              iconBg="bg-gradient-to-br from-purple-500 to-violet-600"
            />
            <StatCard
              icon={<TrendingUp className="h-5 w-5 text-white" />}
              label="My Role"
              value="Staff"
              iconBg="bg-gradient-to-br from-emerald-500 to-green-600"
            />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-4">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={() => setSection(action.section)}
                  className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 text-left"
                >
                  <div className={`h-10 w-10 rounded-xl ${action.color} flex items-center justify-center mb-3`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">{action.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{action.desc}</p>
                </button>
              );
            })}
          </div>

          {/* Today's Schedule */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-500" /> Today's Events
              </h3>
              <button
                onClick={() => setSection('schedule')}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
              >
                Full schedule <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="divide-y divide-gray-50">
              {todayEvents.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <Calendar className="h-10 w-10 mx-auto mb-3 text-gray-200" />
                  <p className="font-medium">No events today</p>
                  <p className="text-sm mt-1">Enjoy your free time!</p>
                </div>
              ) : (
                todayEvents.map((ev) => (
                  <div key={ev.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                        <Calendar className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-900">{ev.eventName}</p>
                        <p className="text-xs text-gray-500">{ev.venueName}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3" /> {ev.time}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${STATUS_COLORS[ev.status]}`}>
                      {ev.status.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {section === 'schedule' && <StaffSchedule />}
      {section === 'tasks' && <TaskManager />}
      {section === 'clients' && <ClientDirectory />}
    </DashboardLayout>
  );
}
