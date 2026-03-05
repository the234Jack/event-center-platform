import React from 'react';
import { Search, LayoutList, CalendarCheck } from 'lucide-react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Search Event Centers',
    description:
      'Enter your location, event type, and number of guests. Our smart search instantly shows you matching venues across Nigeria.',
    color: 'bg-blue-600',
    lightColor: 'bg-blue-50',
    textColor: 'text-blue-600',
  },
  {
    number: '02',
    icon: LayoutList,
    title: 'Compare Halls & Facilities',
    description:
      'Browse detailed information about each venue — hall sizes, seating capacities, available facilities, and transparent pricing.',
    color: 'bg-purple-600',
    lightColor: 'bg-purple-50',
    textColor: 'text-purple-600',
  },
  {
    number: '03',
    icon: CalendarCheck,
    title: 'Book Your Venue',
    description:
      'Contact the venue directly or submit a booking request. Confirm your date, negotiate pricing, and host your perfect event.',
    color: 'bg-green-600',
    lightColor: 'bg-green-50',
    textColor: 'text-green-600',
  },
];

export default function HowItWorksSection() {
  const navigate = useNavigate();
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2">
            Simple Process
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            How EventHub Works
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Find and book your ideal event center in three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector Lines (desktop) */}
          <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200" />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="flex flex-col items-center text-center relative">
                {/* Step Number */}
                <div className="relative mb-6">
                  <div
                    className={`w-20 h-20 rounded-2xl ${step.color} flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <span
                    className={`absolute -top-3 -right-3 w-7 h-7 rounded-full ${step.lightColor} ${step.textColor} text-xs font-bold flex items-center justify-center border-2 border-white shadow-sm`}
                  >
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button
            onClick={() => navigate('/browse')}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-10"
          >
            Start Searching Now
          </Button>
        </div>
      </div>
    </section>
  );
}
