import { supabase } from '../supabase';

export async function fetchAdminStats() {
  const [usersRes, venuesRes, pendingRes, bookingsRes] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('venues').select('id', { count: 'exact', head: true }).eq('verified', true),
    supabase.from('venues').select('id', { count: 'exact', head: true }).eq('verified', false),
    supabase.from('bookings').select('id', { count: 'exact', head: true }),
  ]);
  return {
    totalUsers: usersRes.count ?? 0,
    activeVenues: venuesRes.count ?? 0,
    pendingApprovals: pendingRes.count ?? 0,
    totalBookings: bookingsRes.count ?? 0,
  };
}

export async function fetchPendingVenues() {
  const { data, error } = await supabase
    .from('venues')
    .select('*, profiles!owner_id(full_name, email, phone)')
    .eq('verified', false)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchAllVenuesAdmin() {
  const { data, error } = await supabase
    .from('venues')
    .select('*, profiles!owner_id(full_name, email)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function approveVenue(id: string) {
  const { error } = await supabase.from('venues').update({ verified: true }).eq('id', id);
  if (error) throw error;
}

export async function rejectVenue(id: string) {
  const { error } = await supabase.from('venues').delete().eq('id', id);
  if (error) throw error;
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
