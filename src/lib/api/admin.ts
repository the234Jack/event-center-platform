import { supabase } from '../supabase';

export async function fetchAdminStats() {
  const [usersRes, venuesRes, pendingRes, bookingsRes] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('venues').select('id', { count: 'exact', head: true }).eq('verified', true),
    supabase.from('venues').select('id', { count: 'exact', head: true }).eq('verified', false),
    supabase.from('bookings').select('id', { count: 'exact', head: true }),
  ]);
  if (usersRes.error) console.error('[admin] profiles count error:', usersRes.error);
  if (venuesRes.error) console.error('[admin] active venues error:', venuesRes.error);
  if (pendingRes.error) console.error('[admin] pending venues error:', pendingRes.error);
  if (bookingsRes.error) console.error('[admin] bookings error:', bookingsRes.error);
  return {
    totalUsers: usersRes.count ?? 0,
    activeVenues: venuesRes.count ?? 0,
    pendingApprovals: pendingRes.count ?? 0,
    totalBookings: bookingsRes.count ?? 0,
  };
}

async function attachOwnerProfiles(venues: any[]) {
  const ownerIds = [...new Set(venues.filter((v) => v.owner_id).map((v) => v.owner_id))];
  let profilesMap: Record<string, any> = {};
  if (ownerIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, email, phone')
      .in('id', ownerIds);
    if (profiles) profilesMap = Object.fromEntries(profiles.map((p) => [p.id, p]));
  }
  return venues.map((v) => ({ ...v, profiles: v.owner_id ? (profilesMap[v.owner_id] ?? null) : null }));
}

export async function fetchPendingVenues() {
  const { data, error } = await supabase
    .from('venues')
    .select('*')
    .eq('verified', false)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return attachOwnerProfiles(data ?? []);
}

export async function fetchAllVenuesAdmin() {
  const { data, error } = await supabase
    .from('venues')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return attachOwnerProfiles(data ?? []);
}

export async function approveVenue(id: string) {
  const { error } = await supabase.from('venues').update({ verified: true }).eq('id', id);
  if (error) throw error;
}

export async function rejectVenue(id: string) {
  const { error } = await supabase.from('venues').delete().eq('id', id);
  if (error) throw error;
}

export async function deleteVenue(id: string) {
  await supabase.from('bookings').delete().eq('venue_id', id);
  await supabase.from('saved_venues').delete().eq('venue_id', id);
  const { error } = await supabase.from('venues').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchAllOwners() {
  const { data: owners, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, phone, state, lga, business_name, business_address, created_at')
    .eq('role', 'owner')
    .order('created_at', { ascending: false });
  if (error) throw error;
  if (!owners || owners.length === 0) return [];

  const ownerIds = owners.map((o) => o.id);
  const { data: venues } = await supabase
    .from('venues')
    .select('id, name, city, state, verified, cover_image, max_capacity, price_from, owner_id, created_at')
    .in('owner_id', ownerIds);

  const venuesByOwner: Record<string, any[]> = {};
  (venues ?? []).forEach((v) => {
    if (!v.owner_id) return;
    (venuesByOwner[v.owner_id] ??= []).push(v);
  });

  return owners.map((o) => ({ ...o, venues: venuesByOwner[o.id] ?? [] }));
}

export async function fetchAllUsers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function updateUserRole(id: string, role: string) {
  const { error } = await supabase.from('profiles').update({ role }).eq('id', id);
  if (error) throw error;
}

export async function fetchAllStaff() {
  const { data, error } = await supabase
    .from('staff_members')
    .select('*, profiles!user_id(full_name, phone, state), venues!venue_id(name, city)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function adminUpdateStaffStatus(id: string, status: 'active' | 'inactive') {
  const { error } = await supabase.from('staff_members').update({ status }).eq('id', id);
  if (error) throw error;
}

export async function adminDeleteStaff(id: string) {
  const { error } = await supabase.from('staff_members').delete().eq('id', id);
  if (error) throw error;
}
