import React from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { LAGOS_ZONES, VENUE_CATEGORIES, GUEST_RANGES } from '../../../lib/constants';

interface Filters {
  location: string;
  type: string;
  guests: string;
  budget: string;
  facilities: string[];
}

interface VenueFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onReset: () => void;
}

const facilityOptions = [
  'Parking Space', 'Toilets', 'Power Supply', 'Stage',
  'Sound System', 'Lighting', 'Dressing Room', 'AC',
];

export default function VenueFilters({ filters, onChange, onReset }: VenueFiltersProps) {
  const update = (partial: Partial<Filters>) => onChange({ ...filters, ...partial });

  const toggleFacility = (facility: string) => {
    const current = filters.facilities;
    const updated = current.includes(facility)
      ? current.filter((f) => f !== facility)
      : [...current, facility];
    update({ facilities: updated });
  };

  const hasActiveFilters =
    (filters.location && filters.location !== 'all') ||
    (filters.type && filters.type !== 'all') ||
    (filters.guests && filters.guests !== 'all') ||
    filters.budget ||
    filters.facilities.length > 0;

  const selectedZone = filters.location || 'all';

  return (
    <aside className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
          {hasActiveFilters && (
            <span className="h-2 w-2 rounded-full bg-blue-600" />
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors"
          >
            <X className="h-3 w-3" />
            Reset all
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Lagos Zone Selector */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Lagos Zone</Label>
          <div className="grid grid-cols-1 gap-1.5">
            {LAGOS_ZONES.map((zone) => {
              const isActive = selectedZone === zone.id;
              return (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => update({ location: zone.id })}
                  className={`
                    flex items-center gap-2.5 w-full px-3 py-2 rounded-xl border text-left
                    transition-all duration-150 text-sm font-medium
                    ${isActive ? zone.activeColor + ' shadow-sm' : zone.color + ' hover:opacity-80'}
                  `}
                >
                  <span className="text-base leading-none">{zone.emoji}</span>
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{zone.name}</p>
                    <p className={`text-xs truncate ${isActive ? 'opacity-80' : 'opacity-60'}`}>
                      {zone.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Event Type */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Event Type</Label>
          <Select value={filters.type} onValueChange={(v) => update({ type: v })}>
            <SelectTrigger>
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {VENUE_CATEGORIES.map((t) => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Guest Count */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Guest Count</Label>
          <Select value={filters.guests} onValueChange={(v) => update({ guests: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Any capacity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any capacity</SelectItem>
              {GUEST_RANGES.map((g) => (
                <SelectItem key={g} value={g}>{g} guests</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Max Budget */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Max Budget (₦)</Label>
          <Input
            type="number"
            placeholder="e.g. 500000"
            value={filters.budget}
            onChange={(e) => update({ budget: e.target.value })}
          />
          {filters.budget && (
            <p className="text-xs text-gray-400">Up to ₦{Number(filters.budget).toLocaleString()}</p>
          )}
        </div>

        {/* Facilities */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">Facilities</Label>
          <div className="space-y-2">
            {facilityOptions.map((facility) => (
              <div key={facility} className="flex items-center gap-2">
                <Checkbox
                  id={`f-${facility}`}
                  checked={filters.facilities.includes(facility)}
                  onCheckedChange={() => toggleFacility(facility)}
                />
                <label
                  htmlFor={`f-${facility}`}
                  className="text-sm text-gray-600 cursor-pointer"
                >
                  {facility}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
