import { supabase } from '../supabase';

export interface BookingInsert {
  client_id: string; venue_id: string; hall_id: string;
  event_date: string; start_time?: string; end_time?: string;
  event_type: string; guest_count: number;
  special_requirements?: string; total_cost?: number;
}

export async function createBooking(data: BookingInsert) {
  // Check for an existing confirmed/pending booking for the same hall on the same date
  const { data: clash } = await supabase
    .from('bookings')
    .select('id')
    .eq('hall_id', data.hall_id)
    .eq('event_date', data.event_date)
    .in('status', ['pending', 'confirmed'])
    .maybeSingle();

  if (clash) {
    throw new Error('This hall is already booked for that date. Please choose a different date or hall.');
  }

  const { data: booking, error } = await supabase.from('bookings').insert(data).select().single();
  if (error) throw error;
  return booking;
}

/** Returns all booked dates (ISO strings) for a hall so the calendar can grey them out. */
export async function fetchHallBookedDates(hallId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('event_date')
    .eq('hall_id', hallId)
    .in('status', ['pending', 'confirmed']);
  if (error) throw error;
  return (data ?? []).map((r) => r.event_date as string);
}

export async function fetchClientBookings(clientId: string) {
  const { data, error } = await supabase
    .from('bookings')
    .select(`*, venues(name, city), halls(name)`)
    .eq('client_id', clientId)
    .order('event_date', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchOwnerBookings(ownerId: string) {
  // Get all venues owned by this owner, then get bookings for those venues
  const { data: venues } = await supabase
    .from('venues').select('id').eq('owner_id', ownerId);
  if (!venues?.length) return [];

  const venueIds = venues.map((v) => v.id);
  const { data, error } = await supabase
    .from('bookings')
    .select(`*, venues(name, city), halls(name), profiles(full_name, phone)`)
    .in('venue_id', venueIds)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function updateBookingStatus(bookingId: string, status: 'confirmed' | 'cancelled') {
  const { error } = await supabase
    .from('bookings').update({ status }).eq('id', bookingId);
  if (error) throw error;
}

export async function fetchSavedVenues(clientId: string) {
  const { data, error } = await supabase
    .from('saved_venues')
    .select(`*, venues(*)`)
    .eq('client_id', clientId)
    .order('saved_date', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function saveVenue(clientId: string, venueId: string) {
  const { error } = await supabase
    .from('saved_venues').insert({ client_id: clientId, venue_id: venueId });
  if (error) throw error;
}

export async function unsaveVenue(clientId: string, venueId: string) {
  const { error } = await supabase
    .from('saved_venues')
    .delete().eq('client_id', clientId).eq('venue_id', venueId);
  if (error) throw error;
}
