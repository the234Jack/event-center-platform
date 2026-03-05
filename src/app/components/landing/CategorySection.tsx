import React from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../../../data/venues';

export default function CategorySection() {
  const navigate = useNavigate();

  const colorMap: Record<string, string> = {
    wedding: 'from-pink-50 to-rose-50 border-rose-100 hover:border-rose-300',
    conference: 'from-blue-50 to-indigo-50 border-blue-100 hover:border-blue-300',
    party: 'from-yellow-50 to-amber-50 border-amber-100 hover:border-amber-300',
    outdoor: 'from-green-50 to-emerald-50 border-green-100 hover:border-green-300',
    corporate: 'from-gray-50 to-slate-50 border-gray-100 hover:border-gray-300',
    banquet: 'from-purple-50 to-violet-50 border-purple-100 hover:border-purple-300',
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2">
            Explore by Type
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Find Your Perfect Venue Type
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            From intimate gatherings to grand celebrations — we have the ideal space for every occasion.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/browse?type=${cat.id}`)}
              className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 bg-gradient-to-br transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer ${colorMap[cat.id]}`}
            >
              <span className="text-4xl">{cat.icon}</span>
              <div className="text-center">
                <p className="font-semibold text-gray-800 text-sm leading-tight">{cat.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{cat.count} venues</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
