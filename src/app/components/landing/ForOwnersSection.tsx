import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, TrendingUp, Users, BarChart3, Globe } from 'lucide-react';
import { Button } from '../ui/button';

const benefits = [
  { icon: Globe, text: 'Reach thousands of event planners across Nigeria' },
  { icon: BarChart3, text: 'Real-time analytics on bookings and revenue' },
  { icon: Users, text: 'Manage staff, halls, and facilities in one dashboard' },
  { icon: TrendingUp, text: 'Grow your business with smart booking tools' },
];

const stats = [
  { value: '₦2.4M+', label: 'Avg. Monthly Revenue per Owner' },
  { value: '85%', label: 'Occupancy Rate Increase' },
  { value: '300+', label: 'Active Venue Owners' },
];

export default function ForOwnersSection() {
  const navigate = useNavigate();

  return (
    <section id="for-owners" className="py-20 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div>
            <span className="inline-block bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              For Event Center Owners
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
              Own an Event Center?
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Start Earning Today
              </span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              List your venue on EventHub and connect with thousands of clients planning weddings,
              corporate events, and celebrations across Nigeria.
            </p>

            <ul className="space-y-4 mb-10">
              {benefits.map((b, i) => {
                const Icon = b.icon;
                return (
                  <li key={i} className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-4 w-4 text-blue-400" />
                    </div>
                    <span className="text-gray-300 text-sm">{b.text}</span>
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => navigate('/register')}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 font-semibold"
              >
                Register Your Event Center
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button
                onClick={() => navigate('/login')}
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                Owner Login
              </Button>
            </div>
          </div>

          {/* Right: Stats + Visual */}
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-blue-500/10 rounded-3xl blur-3xl" />

            <div className="relative bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
              {/* Stats */}
              <div className="grid grid-cols-1 gap-4 mb-8">
                {stats.map((stat, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10"
                  >
                    <span className="text-gray-400 text-sm">{stat.label}</span>
                    <span className="text-2xl font-bold text-white">{stat.value}</span>
                  </div>
                ))}
              </div>

              {/* Feature list */}
              <div className="space-y-3">
                <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-4">
                  What you get
                </p>
                {[
                  'Free venue listing',
                  'Owner dashboard & analytics',
                  'Hall & facilities management',
                  'Booking request management',
                  'Staff management tools',
                  'Revenue tracking',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
