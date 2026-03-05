import React from 'react';
import { ShieldCheck, ListChecks, CalendarCheck, MapPin, Building2, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: 'Verified Venues',
    description: 'Every listed venue is manually reviewed and verified before going live on the platform.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: ListChecks,
    title: 'Detailed Hall Info',
    description: 'Full hall specifications including capacity, size, facilities, and pricing — no surprises.',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    icon: CalendarCheck,
    title: 'Easy Venue Discovery',
    description: 'Smart filters and intelligent search help you find the perfect venue in minutes.',
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    icon: MapPin,
    title: 'Nigerian-Focused',
    description: 'Built specifically for Nigeria — Naira pricing, local locations, and Nigerian event culture.',
    color: 'text-red-600',
    bg: 'bg-red-50',
  },
  {
    icon: Building2,
    title: 'Multi-Hall Support',
    description: 'Compare multiple halls within a single venue to find the perfect fit for your event size.',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  {
    icon: BarChart3,
    title: 'Owner Dashboard',
    description: 'Full management tools for venue owners — analytics, bookings, staff, and revenue tracking.',
    color: 'text-teal-600',
    bg: 'bg-teal-50',
  },
];

export default function PlatformFeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2">
            Why EventHub
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Everything You Need in One Platform
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Built for event planners and venue owners with the features that matter most.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="group p-6 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
