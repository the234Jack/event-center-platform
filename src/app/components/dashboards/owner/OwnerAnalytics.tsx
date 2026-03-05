import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { TrendingUp, DollarSign, Star } from 'lucide-react';

const MONTHLY_DATA_12 = [
  { month: 'Jan', revenue: 580000, bookings: 12 },
  { month: 'Feb', revenue: 720000, bookings: 18 },
  { month: 'Mar', revenue: 650000, bookings: 14 },
  { month: 'Apr', revenue: 890000, bookings: 22 },
  { month: 'May', revenue: 1050000, bookings: 28 },
  { month: 'Jun', revenue: 980000, bookings: 25 },
  { month: 'Jul', revenue: 1120000, bookings: 30 },
  { month: 'Aug', revenue: 1350000, bookings: 35 },
  { month: 'Sep', revenue: 1100000, bookings: 29 },
  { month: 'Oct', revenue: 1280000, bookings: 33 },
  { month: 'Nov', revenue: 1450000, bookings: 38 },
  { month: 'Dec', revenue: 1800000, bookings: 45 },
];

const EVENT_TYPE_DATA = [
  { name: 'Wedding', value: 38, color: '#3b82f6' },
  { name: 'Corporate', value: 22, color: '#8b5cf6' },
  { name: 'Birthday', value: 18, color: '#f59e0b' },
  { name: 'Conference', value: 12, color: '#10b981' },
  { name: 'Other', value: 10, color: '#6b7280' },
];

const HALL_UTILIZATION = [
  { hall: 'Grand Ballroom', utilization: 85, capacity: 1000 },
  { hall: 'Premium Hall', utilization: 72, capacity: 500 },
  { hall: 'Conference Suite', utilization: 60, capacity: 200 },
  { hall: 'Exhibition Hall', utilization: 78, capacity: 800 },
  { hall: 'Terrace Hall', utilization: 55, capacity: 300 },
];

const REVENUE_BREAKDOWN = [
  { venue: 'Grand Palace', hall: 'Grand Ballroom', bookings: 22, revenue: 2640000 },
  { venue: 'Elite Events Hub', hall: 'Grand Hall', bookings: 18, revenue: 1980000 },
  { venue: 'Grand Palace', hall: 'Premium Hall', bookings: 15, revenue: 1200000 },
  { venue: 'Elite Events Hub', hall: 'Conference Suite A', bookings: 12, revenue: 720000 },
  { venue: 'Ocean View Events', hall: 'Terrace Hall', bookings: 8, revenue: 560000 },
];

const formatNaira = (value: number) => `₦${(value / 1000).toFixed(0)}K`;

function filterData(data: typeof MONTHLY_DATA_12, range: string) {
  if (range === '3') return data.slice(-3);
  if (range === '6') return data.slice(-6);
  return data;
}

export default function OwnerAnalytics() {
  const [range, setRange] = useState('12');

  const filtered = filterData(MONTHLY_DATA_12, range);
  const totalRevenue = filtered.reduce((s, m) => s + m.revenue, 0);
  const totalBookings = filtered.reduce((s, m) => s + m.bookings, 0);
  const topMonth = [...filtered].sort((a, b) => b.revenue - a.revenue)[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Analytics</h2>
          <p className="text-sm text-gray-500">Performance overview across all your venues</p>
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
                <p className="text-xs text-gray-500">Total Revenue</p>
                <p className="text-xl font-bold text-gray-900">₦{(totalRevenue / 1000000).toFixed(2)}M</p>
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
                <p className="text-xs text-gray-500">Top Month</p>
                <p className="text-xl font-bold text-gray-900">{topMonth?.month ?? '-'}</p>
                <p className="text-xs text-yellow-600">₦{topMonth ? (topMonth.revenue / 1000).toFixed(0) : 0}K revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trend */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Monthly Revenue Trend</CardTitle>
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
        {/* Bookings by Event Type */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Bookings by Event Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={180}>
                <PieChart>
                  <Pie data={EVENT_TYPE_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={3}>
                    {EVENT_TYPE_DATA.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => [`${v}%`, '']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {EVENT_TYPE_DATA.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-semibold">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hall Utilization */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Hall Utilization Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={HALL_UTILIZATION} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="hall" tick={{ fontSize: 10 }} width={85} />
                <Tooltip formatter={(v: number) => [`${v}%`, 'Utilization']} />
                <Bar dataKey="utilization" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Revenue Breakdown by Hall</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium text-gray-500">Venue</th>
                  <th className="text-left py-2 font-medium text-gray-500">Hall</th>
                  <th className="text-right py-2 font-medium text-gray-500">Bookings</th>
                  <th className="text-right py-2 font-medium text-gray-500">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {REVENUE_BREAKDOWN.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="py-3 font-medium">{row.venue}</td>
                    <td className="py-3 text-gray-600">{row.hall}</td>
                    <td className="py-3 text-right">{row.bookings}</td>
                    <td className="py-3 text-right font-semibold text-green-700">₦{row.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
