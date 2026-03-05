import React from 'react';
import { Sparkles, X } from 'lucide-react';

interface SmartSuggestionsProps {
  location: string;
  type: string;
  guests: string;
  budget: string;
  resultCount: number;
  onClear: () => void;
}

const typeLabels: Record<string, string> = {
  wedding: 'Wedding',
  conference: 'Conference',
  party: 'Party',
  outdoor: 'Outdoor Event',
  corporate: 'Corporate Event',
  banquet: 'Banquet',
};

export default function SmartSuggestions({
  location,
  type,
  guests,
  budget,
  resultCount,
  onClear,
}: SmartSuggestionsProps) {
  const hasFilters = location || type || guests || budget;
  if (!hasFilters) return null;

  const parts: string[] = [];
  if (type) parts.push(`<strong>${typeLabels[type] || type}</strong> venues`);
  if (location) parts.push(`in <strong>${location}</strong>`);
  if (guests) parts.push(`for <strong>${guests} guests</strong>`);
  if (budget) parts.push(`within <strong>₦${Number(budget).toLocaleString()}</strong> budget`);

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-4 mb-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm mb-1">
              Smart Search Active
            </p>
            <p
              className="text-blue-100 text-sm"
              dangerouslySetInnerHTML={{
                __html: `Showing ${resultCount} result${resultCount !== 1 ? 's' : ''} for ${parts.join(' ')}`,
              }}
            />
            {resultCount === 0 && (
              <p className="text-blue-200 text-xs mt-1">
                Try adjusting your filters for more results.
              </p>
            )}
          </div>
        </div>
        <button
          onClick={onClear}
          className="text-blue-200 hover:text-white transition-colors flex-shrink-0 p-1"
          aria-label="Clear filters"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
