import { supabase } from '../supabase';
import type { Venue, VenueHall } from '../../data/types';

export function adaptHall(row: HallRow): VenueHall {
  return {
    id: row.id,
    name: row.name,
    type: row.type as 'indoor' | 'outdoor' | 'mixed',
    seatingCapacity: row.seating_capacity,
    standingCapacity: row.standing_capacity,
    sizesqm: row.size_sqm ?? 0,
    airConditioned: row.air_conditioned,
    pricePerHour: row.price_per_hour,
    pricePerDay: row.price_per_day,
    facilities: row.facilities,
    images: row.images,
  };
}

export function adaptVenue(row: VenueRow, halls: HallRow[] = []): Venue {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? '',
    city: row.city,
    state: row.state,
    address: row.address ?? '',
    landmark: row.landmark ?? '',
    category: row.category as Venue['category'],
    rating: row.rating,
    reviewCount: row.review_count,
    priceFrom: row.price_from,
    priceTo: row.price_to,
    maxCapacity: row.max_capacity,
    coverImage: row.cover_image ?? '',
    galleryImages: row.gallery_images,
    halls: halls.map(adaptHall),
    facilities: row.facilities,
    services: row.services,
    phone: row.phone ?? '',
    email: row.email ?? '',
    featured: row.featured,
    verified: row.verified,
    paystackSubaccountCode: row.paystack_subaccount_code ?? undefined,
  };
}

export interface VenueRow {
  id: string; name: string; description: string | null;
  city: string; state: string; address: string | null; landmark: string | null;
  category: string; phone: string | null; email: string | null;
  rating: number; review_count: number;
  price_from: number; price_to: number; max_capacity: number;
  cover_image: string | null; gallery_images: string[];
  facilities: string[]; services: string[];
  featured: boolean; verified: boolean;
  paystack_subaccount_code?: string | null;
}

export interface HallRow {
  id: string; venue_id: string; name: string; type: string;
  seating_capacity: number; standing_capacity: number; size_sqm: number | null;
  air_conditioned: boolean; price_per_hour: number; price_per_day: number;
  facilities: string[]; images: string[];
}

export interface VenueWithHalls extends VenueRow { halls: HallRow[]; }

export async function fetchVenues(filters?: {
  city?: string; category?: string; maxCapacity?: number; maxPrice?: number; featured?: boolean;
}): Promise<VenueWithHalls[]> {
  let query = supabase.from('venues').select('*, halls(*)').eq('verified', true).order('rating', { ascending: false });
  if (filters?.city) query = query.ilike('city', filters.city);
  if (filters?.category) query = query.eq('category', filters.category);
  if (filters?.maxCapacity) query = query.gte('max_capacity', filters.maxCapacity);
  if (filters?.maxPrice) query = query.lte('price_from', filters.maxPrice);
  if (filters?.featured) query = query.eq('featured', true);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as VenueWithHalls[];
}

export async function fetchVenueById(id: string): Promise<VenueWithHalls | null> {
  const [venueRes, hallsRes] = await Promise.all([
    supabase.from('venues').select('*').eq('id', id).single(),
    supabase.from('halls').select('*').eq('venue_id', id).order('price_per_day'),
  ]);
  if (venueRes.error || !venueRes.data) return null;
  return { ...(venueRes.data as VenueRow), halls: (hallsRes.data ?? []) as HallRow[] };
}

export async function fetchSimilarVenues(excludeId: string, city: string, limit = 3): Promise<VenueWithHalls[]> {
  const { data } = await supabase
    .from('venues').select('*, halls(*)')
    .eq('verified', true).eq('city', city).neq('id', excludeId)
    .order('rating', { ascending: false }).limit(limit);
  return (data ?? []) as VenueWithHalls[];
}

export async function fetchFeaturedVenues(): Promise<VenueWithHalls[]> {
  return fetchVenues({ featured: true });
}
