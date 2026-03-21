import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles, Users, DollarSign, MapPin, ChevronRight,
  Lightbulb, Star, CheckCircle2, AlertCircle, Loader2,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import { fetchVenues, adaptVenue } from '../../lib/api/venues';
import type { Venue, VenueHall } from '../../data/types';
import { EVENT_TYPES, EVENT_REQUIREMENTS, LAGOS_ZONES } from '../../lib/constants';
import CostEstimator from '../components/shared/CostEstimator';

interface PlannerForm {
  eventType: string;
  guestCount: string;
  budget: string;
  zoneId: string;
}

interface ScoredVenue {
  venue: Venue;
  score: number;
  maxScore: number;
  matchPct: number;
  recommendedHall: VenueHall | null;
  categoryMatch: boolean;
  facilityMatches: string[];
  budgetOk: boolean;
  capacityOk: boolean;
}

function venueMatchesZone(venue: Venue, zoneId: string): boolean {
  if (!zoneId || zoneId === 'all') return true;
  const zone = LAGOS_ZONES.find((z) => z.id === zoneId);
  if (!zone || zone.areas.length === 0) return true;
  const city = venue.city.toLowerCase();
  const address = (venue.address ?? '').toLowerCase();
  return (zone.areas as readonly string[]).some(
    (area) => city.includes(area.toLowerCase()) || address.includes(area.toLowerCase())
  );
}

function scoreVenue(venue: Venue, form: PlannerForm): ScoredVenue {
  const req = EVENT_REQUIREMENTS[form.eventType] ?? EVENT_REQUIREMENTS['Other'];
  const guestCount = parseInt(form.guestCount) || 0;
  const budget = parseInt(form.budget) || 0;
  let score = 0;
  let maxScore = 0;

  // 1. Category match (0–20 pts)
  maxScore += 20;
  const catIdx = req.preferredCategory.indexOf(venue.category);
  if (catIdx === 0) score += 20;
  else if (catIdx === 1) score += 12;
  else if (catIdx >= 2) score += 6;
  const categoryMatch = catIdx >= 0;

  // 2. Facility match (up to 30 pts, normalised)
  const totalFacilityWeight = Object.values(req.facilityWeights).reduce((s, w) => s + w, 0) || 1;
  maxScore += 30;
  const facilityMatches: string[] = [];
  let facilityScore = 0;
  for (const [fac, weight] of Object.entries(req.facilityWeights)) {
    if (venue.facilities.includes(fac)) {
      facilityScore += weight;
      facilityMatches.push(fac);
    }
  }
  score += Math.round((facilityScore / totalFacilityWeight) * 30);

  // 3. Budget match (0–20 pts)
  maxScore += 20;
  let budgetOk = false;
  if (budget > 0) {
    if (venue.priceFrom <= budget) {
      budgetOk = true;
      score += venue.priceFrom <= budget * 0.7 ? 20 : 10;
    }
  } else {
    score += 10; // no budget set — neutral
    budgetOk = true;
  }

  // 4. Capacity match (0–20 pts)
  maxScore += 20;
  let capacityOk = false;
  let recommendedHall: VenueHall | null = null;
  if (guestCount > 0) {
    const fitting = venue.halls
      .filter((h) => h.seatingCapacity >= guestCount)
      .sort((a, b) => a.pricePerDay - b.pricePerDay);
    if (fitting.length > 0) {
      recommendedHall = fitting[0];
      score += 20;
      capacityOk = true;
    } else if (venue.maxCapacity >= guestCount) {
      score += 8;
      capacityOk = true;
    }
  } else {
    score += 10;
    capacityOk = true;
    if (venue.halls.length > 0) recommendedHall = venue.halls[0];
  }

  // 5. Zone match (0–10 pts)
  maxScore += 10;
  if (venueMatchesZone(venue, form.zoneId)) score += 10;

  // 6. Featured bonus (0–5)
  maxScore += 5;
  if (venue.featured) score += 5;

  const matchPct = Math.min(100, Math.round((score / maxScore) * 100));
  return { venue, score, maxScore, matchPct, recommendedHall, categoryMatch, facilityMatches, budgetOk, capacityOk };
}

function MatchBar({ pct }: { pct: number }) {
  const color = pct >= 75 ? 'bg-green-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-400';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-xs font-bold ${pct >= 75 ? 'text-green-700' : pct >= 50 ? 'text-amber-700' : 'text-red-600'}`}>
        {pct}%
      </span>
    </div>
  );
}

export default function SmartPlannerPage() {
  const navigate = useNavigate();
  const [allVenues, setAllVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searched, setSearched] = useState(false);
  const [form, setForm] = useState<PlannerForm>({ eventType: '', guestCount: '', budget: '', zoneId: 'all' });

  useEffect(() => {
    fetchVenues()
      .then((rows) => setAllVenues(rows.map((r) => adaptVenue(r, r.halls ?? []))))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const results = useMemo<ScoredVenue[]>(() => {
    if (!searched || !form.eventType) return [];
    const budget = parseInt(form.budget) || 0;
    const guestCount = parseInt(form.guestCount) || 0;

    return allVenues
      .filter((v) => {
        // Hard filter: over-budget venues excluded
        if (budget > 0 && v.priceFrom > budget) return false;
        // Hard filter: cannot possibly seat guests
        if (guestCount > 0 && v.maxCapacity < guestCount) return false;
        // Zone filter (soft — already scored, but exclude completely wrong zone when user selected one)
        if (form.zoneId !== 'all' && !venueMatchesZone(v, form.zoneId)) return false;
        return true;
      })
      .map((v) => scoreVenue(v, form))
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }, [allVenues, form, searched]);

  const selectedEventType = EVENT_TYPES.find((e) => e.value === form.eventType);
  const selectedZone = LAGOS_ZONES.find((z) => z.id === form.zoneId);
  const requirements = form.eventType ? EVENT_REQUIREMENTS[form.eventType] : null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.eventType) return;
    setSearched(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            <Sparkles className="h-4 w-4" />
            AI-Powered Event Planner
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Find the Perfect Venue for Your Event
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Tell us about your event and we'll rank Lagos venues by how well they match your needs — considering capacity, facilities, budget, and location.
          </p>
        </div>

        {/* Planner Form */}
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Event Type */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">Event Type *</Label>
              <Select value={form.eventType} onValueChange={(v) => setForm({ ...form, eventType: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.emoji} {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Guest Count */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-gray-400" /> Guest Count
              </Label>
              <Input
                type="number"
                placeholder="e.g., 200"
                min={1}
                value={form.guestCount}
                onChange={(e) => setForm({ ...form, guestCount: e.target.value })}
              />
            </div>

            {/* Budget */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-gray-400" /> Max Budget (₦)
              </Label>
              <Input
                type="number"
                placeholder="e.g., 500000"
                min={0}
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
              />
              {form.budget && (
                <p className="text-xs text-gray-400">₦{Number(form.budget).toLocaleString()}</p>
              )}
            </div>

            {/* Lagos Zone */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-gray-400" /> Lagos Zone
              </Label>
              <Select value={form.zoneId} onValueChange={(v) => setForm({ ...form, zoneId: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LAGOS_ZONES.map((z) => (
                    <SelectItem key={z.id} value={z.id}>
                      {z.emoji} {z.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="submit"
              disabled={!form.eventType || loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Loading venues...</>
              ) : (
                <><Sparkles className="h-4 w-4 mr-2" /> Find Best Venues</>
              )}
            </Button>
            {searched && (
              <button
                type="button"
                onClick={() => { setSearched(false); setForm({ eventType: '', guestCount: '', budget: '', zoneId: 'all' }); }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {/* Event Tips Panel */}
        {form.eventType && requirements && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-2">
                  {selectedEventType?.emoji} Tips for Your {selectedEventType?.label}
                </h3>
                <ul className="space-y-1">
                  {requirements.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                      <span className="text-amber-500 mt-0.5">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="text-xs text-amber-700 font-medium mr-1">Key facilities:</span>
                  {requirements.recommendedFacilities.slice(0, 5).map((f) => (
                    <span key={f} className="text-xs bg-amber-100 border border-amber-300 text-amber-800 px-2 py-0.5 rounded-full">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {searched && (
          <>
            {results.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                <AlertCircle className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No matching venues found</h3>
                <p className="text-gray-500 text-sm mb-4">
                  Try increasing your budget, reducing guest count, or selecting a broader zone.
                </p>
                <button
                  onClick={() => navigate('/browse')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Browse all venues →
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {results.length} Recommended Venue{results.length !== 1 ? 's' : ''}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Ranked by how well they match your {selectedEventType?.label} requirements
                      {selectedZone && selectedZone.id !== 'all' ? ` in ${selectedZone.name}` : ''}
                    </p>
                  </div>
                  <Link
                    to="/browse"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    Browse all <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <div className="space-y-4">
                  {results.map((result, idx) => (
                    <VenueResultCard key={result.venue.id} result={result} rank={idx + 1} />
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* Cost Estimator — shown after search when we have event type + guest count */}
        {searched && form.eventType && parseInt(form.guestCount) > 0 && (
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-lg font-bold text-gray-900">Budget Breakdown</h2>
              <span className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">
                Full Event Cost
              </span>
            </div>
            <CostEstimator
              eventType={form.eventType}
              guestCount={parseInt(form.guestCount)}
              venueName={results[0]?.venue.name}
              venuePrice={results[0]?.recommendedHall?.pricePerDay ?? results[0]?.venue.priceFrom}
            />
          </div>
        )}

        {/* CTA when not searched */}
        {!searched && !loading && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            {[
              { emoji: '💍', title: 'Wedding', desc: '300+ guests, dressing room, stage', query: 'Wedding' },
              { emoji: '💼', title: 'Corporate Event', desc: 'Sound system, parking, power backup', query: 'Corporate Event' },
              { emoji: '🎂', title: 'Birthday Party', desc: 'Flexible layout, lighting, sound', query: 'Birthday Party' },
            ].map((ex) => (
              <button
                key={ex.title}
                type="button"
                onClick={() => { setForm((f) => ({ ...f, eventType: ex.query })); }}
                className="bg-white rounded-xl border border-gray-100 p-4 text-left hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="text-2xl mb-2">{ex.emoji}</div>
                <p className="font-semibold text-gray-900 text-sm">{ex.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{ex.desc}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

function VenueResultCard({ result, rank }: { result: ScoredVenue; rank: number }) {
  const { venue, matchPct, recommendedHall, categoryMatch, facilityMatches, budgetOk } = result;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="sm:w-48 h-40 sm:h-auto flex-shrink-0 bg-gray-100 relative overflow-hidden">
          {venue.coverImage ? (
            <img
              src={venue.coverImage}
              alt={venue.name}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">🏛️</div>
          )}
          <div className="absolute top-2 left-2">
            <span className={`
              text-xs font-bold px-2 py-1 rounded-full
              ${rank === 1 ? 'bg-amber-400 text-amber-900' : rank === 2 ? 'bg-gray-200 text-gray-700' : rank === 3 ? 'bg-orange-200 text-orange-800' : 'bg-blue-100 text-blue-700'}
            `}>
              #{rank}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h3 className="font-bold text-gray-900 text-base">{venue.name}</h3>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                <MapPin className="h-3.5 w-3.5" />
                {venue.address ? `${venue.address}, ` : ''}{venue.city}
              </p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium text-gray-700">{venue.rating}</span>
            </div>
          </div>

          {/* Match bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500 font-medium">Match score</span>
              <span className="text-xs text-gray-500">{matchPct}% compatible</span>
            </div>
            <MatchBar pct={matchPct} />
          </div>

          {/* Signals */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {categoryMatch && (
              <span className="flex items-center gap-1 text-xs bg-green-50 border border-green-200 text-green-700 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="h-3 w-3" /> Ideal venue type
              </span>
            )}
            {budgetOk && (
              <span className="flex items-center gap-1 text-xs bg-blue-50 border border-blue-200 text-blue-700 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="h-3 w-3" /> Within budget
              </span>
            )}
            {facilityMatches.slice(0, 3).map((f) => (
              <span key={f} className="text-xs bg-gray-50 border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                ✓ {f}
              </span>
            ))}
            {facilityMatches.length > 3 && (
              <span className="text-xs text-gray-400">+{facilityMatches.length - 3} more</span>
            )}
          </div>

          {/* Recommended hall */}
          {recommendedHall && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 mb-3 text-xs text-blue-800">
              <span className="font-semibold">Recommended hall:</span>{' '}
              {recommendedHall.name} · {recommendedHall.seatingCapacity.toLocaleString()} seated · ₦{recommendedHall.pricePerDay.toLocaleString()}/day
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400">From</p>
              <p className="text-sm font-bold text-blue-600">₦{venue.priceFrom.toLocaleString()}</p>
            </div>
            <Link
              to={`/venue/${venue.id}`}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              View Venue <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
