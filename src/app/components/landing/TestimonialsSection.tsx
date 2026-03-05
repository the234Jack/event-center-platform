import React from 'react';
import { Star, Quote } from 'lucide-react';
import { testimonials } from '../../../data/venues';

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2">
            Success Stories
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            What Our Users Say
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Thousands of events successfully organised through EventHub.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
            >
              {/* Background Quote */}
              <Quote className="absolute top-4 right-4 h-12 w-12 text-blue-50 fill-blue-50" />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-600 text-sm leading-relaxed mb-6 relative">
                "{t.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="h-11 w-11 rounded-full object-cover border-2 border-blue-100"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80';
                  }}
                />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.eventType}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
