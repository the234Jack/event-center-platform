import React, { useState, useEffect, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Skeleton } from '../../ui/skeleton';
import { TrendingUp, DollarSign, Star, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../../context/AuthContext';
import { fetchOwnerBookings } from '../../../../lib/api/bookings';

const EVENT_COLORS: Record<string, string> = {
  Wedding: '#3b82f6',
  'Birthday Party': '#f59e0b',
  'Corporate Event': '#8b5cf6',
  Conference: '#10b981',
  Graduation: '#f97316',
  'Naming Ceremony': '#ec4899',
  'Funeral/Wake': '#6b7280',
  'Religious Event': '#14b8a6',
  'Concert/Show': '#ef4444',
  'Product Launch': '#6366f1',
  Anniversary: '#84cc16',
  Other: '#94a3b8',
};

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatNaira = (value: number) => `₦${(value / 1000).toFixed(0)}K`;

interface MonthStat { month: string; revenue: number; bookings: number; }
interface EventTypeStat { name: string; value: number; color: string; }
interface HallStat { hall: string; bookings: number; revenue: number; }

export default function OwnerAnalytics() {
  const { user } = useAuth();
  const [range, setRange] = useState('6');
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState<MonthStat[]>([]);
  const [eventTypeData, setEventTypeData] = useState<EventTypeStat[]>([]);
  const [hallData, setHallData] = useState<HallStat[]>([]);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    fetchOwnerBookings(user.id)
      .then((rows) => {
        // Build monthly stats for current year
        const year = new Date().getFullYear();
        const monthly: Record<number, { revenue: number; bookings: number }> = {};
        for (let m = 0; m < 12; m++) monthly[m] = { revenue: 0, bookings: 0 };

        const eventCounts: Record<string, number> = {};
        const hallCounts: Record<string, { bookings: number; revenue: number }> = {};

        rows.forEach((r) => {
          const date = new Date(r.event_date as string);
          if (date.getFullYear() === year) {
            const m = date.getMonth();
            monthly[m].bookings += 1;
            if (r.status === 'confirmed') {
              monthly[m].revenue += (r.total_cost as number) ?? 0;
            }
          }
          // Event type distribution
          const etype = (r.event_type as string) ?? 'Other';
          eventCounts[etype] = (eventCounts[etype] ?? 0) + 1;

          // Hall utilisation
          const hallName = (r.halls as { name: string } | null)?.name ?? 'Unknown Hall';
          if (!hallCounts[hallName]) hallCounts[hallName] = { bookings: 0, revenue: 0 };
          hallCounts[hallName].bookings += 1;
          if (r.status === 'confirmed') {
            hallCounts[hallName].revenue += (r.total_cost as number) ?? 0;
          }
        });

        setMonthlyData(
          MONTH_LABELS.map((label, i) => ({
            month: label,
            revenue: monthly[i].revenue,
            bookings: monthly[i].bookings,
          }))
        );

        const total = Object.values(eventCounts).reduce((s, v) => s + v, 0) || 1;
        setEventTypeData(
          Object.entries(eventCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 7)
            .map(([name, count]) => ({
              name,
              value: Math.round((count / total) * 100),
              color: EVENT_COLORS[name] ?? '#94a3b8',
            }))
        );

        setHallData(
          Object.entries(hallCounts)
            .sort((a, b) => b[1].bookings - a[1].bookings)
            .slice(0, 6)
            .map(([hall, stats]) => ({ hall, ...stats }))
        );
      })
      .catch(() => toast.error('Failed to load analytics data.'))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const filtered = useMemo(() => {
    const n = parseInt(range);
    const now = new Date().getMonth();
    const indices: number[] = [];
    for (let i = n - 1; i >= 0; i--) {
      indices.unshift((now - i + 12) % 12);
    }
    return indices.map((i) => monthlyData[i] ?? { month: MONTH_LABELS[i], revenue: 0, bookings: 0 });
  }, [monthlyData, range]);

  const totalRevenue = filtered.reduce((s, m) => s + m.revenue, 0);
  const totalBookings = filtered.reduce((s, m) => s + m.bookings, 0);
  const topMonth = [...filtered].sort((a, b) => b.revenue - a.revenue)[0];

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
        <Skeleton className="h-72 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Analytics</h2>
          <p className="text-sm text-gray-500">Real-time performance from your bookings</p>
        </div>
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">Last 3 Months</SelectItem>
            <SelectItem value="6">Last 6 Months</SelectItem>
            <SelectItem value="12">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Confirmed Revenue</p>
                <p className="text-xl font-bold text-gray-900">
                  {totalRevenue >= 1_000_000
                    ? `₦${(totalRevenue / 1_000_000).toFixed(2)}M`
                    : `₦${(totalRevenue / 1000).toFixed(0)}K`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Bookings</p>
                <p className="text-xl font-bold text-gray-900">{totalBookings}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Best Month</p>
                <p className="text-xl font-bold text-gray-900">{topMonth?.month ?? '—'}</p>
                {topMonth?.revenue > 0 && (
                  <p className="text-xs text-yellow-600">₦{(topMonth.revenue / 1000).toFixed(0)}K revenue</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {totalBookings === 0 ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex items-center gap-3 text-amber-700">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">No booking data yet for this period. Data will appear here once you receive bookings.</p>
        </div>
      ) : (
        <>
          {/* Revenue Trend */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Monthly Revenue (Confirmed Bookings)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={filtered}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={formatNaira} tick={{ fontSize: 11 }} width={60} />
                  <Tooltip formatter={(v: number) => [`₦${v.toLocaleString()}`, 'Revenue']} />
                  <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4 }} name="Revenue" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Event Type Breakdown */}
            {eventTypeData.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Bookings by Event Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <ResponsiveContainer width="50%" height={180}>
                      <PieChart>
                        <Pie data={eventTypeData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={3}>
                          {eventTypeData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v: number) => [`${v}%`, '']} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex-1 space-y-2">
                      {eventTypeData.map((item) => (
                        <div key={item.name} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                            <span className="truncate max-w-[100px]">{item.name}</span>
                          </div>
                          <span className="font-semibold">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Hall Bookings */}
            {hallData.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Bookings by Hall</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={hallData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis type="number" tick={{ fontSize: 11 }} />
                      <YAxis type="category" dataKey="hall" tick={{ fontSize: 10 }} width={90} />
                      <Tooltip formatter={(v: number) => [v, 'Bookings']} />
                      <Bar dataKey="bookings" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Revenue by Hall Table */}
          {hallData.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Revenue Breakdown by Hall</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-medium text-gray-500">Hall</th>
                        <th className="text-right py-2 font-medium text-gray-500">Bookings</th>
                        <th className="text-right py-2 font-medium text-gray-500">Revenue (confirmed)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {hallData.map((row) => (
                        <tr key={row.hall} className="hover:bg-gray-50">
                          <td className="py-3 font-medium">{row.hall}</td>
                          <td className="py-3 text-right">{row.bookings}</td>
                          <td className="py-3 text-right font-semibold text-green-700">
                            ₦{row.revenue.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
