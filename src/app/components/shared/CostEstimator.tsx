import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Calculator, AlertTriangle, Info } from 'lucide-react';
import {
  CATERING_PER_HEAD,
  DECOR_COST,
  MC_DJ_COST,
  PHOTOGRAPHY_COST,
  GENERATOR_COST_TIERS,
  SECURITY_COST_TIERS,
  GUEST_OVERFLOW_FACTOR,
  type CostRange,
} from '../../../lib/constants';

interface CostEstimatorProps {
  eventType: string;
  guestCount: number;
  venuePrice?: number;      // pricePerDay of selected hall or venue priceFrom
  venueName?: string;
  compact?: boolean;        // compact mode for BookingWidget
}

interface LineItem {
  icon: string;
  label: string;
  range: CostRange;
  note?: string;
  skipped?: boolean;        // e.g. catering for a concert
}

function fmt(n: number) {
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `₦${(n / 1_000).toFixed(0)}K`;
  return `₦${n.toLocaleString()}`;
}

function getTierCost(
  tiers: Array<{ upTo: number; cost: CostRange }>,
  guests: number
): CostRange {
  return (tiers.find((t) => guests <= t.upTo) ?? tiers[tiers.length - 1]).cost;
}

export default function CostEstimator({
  eventType,
  guestCount,
  venuePrice,
  venueName,
  compact = false,
}: CostEstimatorProps) {
  const [expanded, setExpanded] = useState(!compact);

  const { items, totalMin, totalMax, overflowGuests, overflowFactor } = useMemo(() => {
    const catering = CATERING_PER_HEAD[eventType] ?? CATERING_PER_HEAD['Other'];
    const decor = DECOR_COST[eventType] ?? DECOR_COST['Other'];
    const mcDj = MC_DJ_COST[eventType] ?? MC_DJ_COST['Other'];
    const photography = PHOTOGRAPHY_COST[eventType] ?? PHOTOGRAPHY_COST['Other'];
    const generator = getTierCost(GENERATOR_COST_TIERS, guestCount);
    const security = getTierCost(SECURITY_COST_TIERS, guestCount);
    const factor = GUEST_OVERFLOW_FACTOR[eventType] ?? 1.2;
    const overflowGuests = Math.round(guestCount * factor);
    // Use overflow guests for catering cost to be realistic
    const effectiveGuests = overflowGuests;

    const lines: LineItem[] = [
      venuePrice !== undefined
        ? { icon: '🏛️', label: 'Venue / Hall', range: { min: venuePrice, max: venuePrice }, note: venueName }
        : null,
      catering.min === 0
        ? { icon: '🍽️', label: 'Catering', range: { min: 0, max: 0 }, skipped: true, note: 'N/A for ticketed events' }
        : {
            icon: '🍽️',
            label: 'Catering',
            range: { min: catering.min * effectiveGuests, max: catering.max * effectiveGuests },
            note: `₦${(catering.min / 1000).toFixed(0)}K–₦${(catering.max / 1000).toFixed(0)}K/head × ${effectiveGuests} guests`,
          },
      { icon: '🎨', label: 'Décor & Styling', range: decor },
      { icon: '🎤', label: 'MC / DJ / Entertainment', range: mcDj },
      { icon: '📸', label: 'Photography & Video', range: photography },
      { icon: '⚡', label: 'Generator & Fuel', range: generator, note: 'Power backup for event duration' },
      { icon: '🔒', label: 'Security', range: security },
    ].filter(Boolean) as LineItem[];

    let totalMin = 0;
    let totalMax = 0;
    for (const item of lines) {
      if (!item.skipped) {
        totalMin += item.range.min;
        totalMax += item.range.max;
      }
    }

    return { items: lines, totalMin, totalMax, overflowGuests, overflowFactor: factor };
  }, [eventType, guestCount, venuePrice, venueName]);

  if (!eventType || guestCount <= 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Calculator className="h-4 w-4 text-emerald-700" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">
              Estimated Total Event Cost
            </p>
            <p className="text-xs text-gray-500">
              {fmt(totalMin)} – {fmt(totalMax)} · {guestCount} guests invited
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-emerald-700 hidden sm:block">
            {fmt(totalMin)}–{fmt(totalMax)}
          </span>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-100">
          {/* Overflow warning */}
          {overflowFactor > 1.0 && (
            <div className="mx-5 mt-4 mb-2 flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl p-3">
              <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800">
                <span className="font-semibold">Nigerian event tip:</span> {eventType} events typically
                see <strong>{Math.round((overflowFactor - 1) * 100)}% more guests</strong> than invited.
                Catering is calculated for <strong>{overflowGuests} guests</strong> to avoid running short.
              </p>
            </div>
          )}

          {/* Line items */}
          <div className="px-5 pb-2 mt-3">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-50">
                {items.map((item) => (
                  <tr key={item.label} className={item.skipped ? 'opacity-40' : ''}>
                    <td className="py-2.5 pr-2 w-7 text-base leading-none">{item.icon}</td>
                    <td className="py-2.5 text-gray-700 font-medium">
                      {item.label}
                      {item.note && (
                        <span className="block text-xs text-gray-400 font-normal">{item.note}</span>
                      )}
                    </td>
                    <td className="py-2.5 text-right text-gray-900 font-semibold whitespace-nowrap">
                      {item.skipped ? (
                        <span className="text-gray-400 font-normal text-xs">N/A</span>
                      ) : item.range.min === item.range.max ? (
                        fmt(item.range.min)
                      ) : (
                        <span>
                          {fmt(item.range.min)}<span className="text-gray-400 font-normal"> – </span>{fmt(item.range.max)}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-200">
                  <td className="pt-3 pb-2 text-base">💰</td>
                  <td className="pt-3 pb-2 font-bold text-gray-900">Total Estimate</td>
                  <td className="pt-3 pb-2 text-right font-bold text-emerald-700 text-base whitespace-nowrap">
                    {fmt(totalMin)} – {fmt(totalMax)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-2 px-5 pb-4 mt-1">
            <Info className="h-3.5 w-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-400">
              Estimates based on Lagos 2024–2025 market rates. Actual costs vary by vendor, season, and negotiation.
              Venue price is confirmed; all other items are indicative.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
