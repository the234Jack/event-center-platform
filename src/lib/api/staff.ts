import { supabase } from '../supabase';

export async function fetchStaffMembers(venueId: string) {
  const { data, error } = await supabase
    .from('staff_members')
    .select(`*, profiles(full_name, phone)`)
    .eq('venue_id', venueId)
    .order('join_date', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createStaffInvite(venueId: string, role: string) {
  // Generate a unique staff code
  const code = `STAFF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const { data, error } = await supabase
    .from('staff_members')
    .insert({ venue_id: venueId, role, staff_code: code, status: 'active' })
    .select().single();
  if (error) throw error;
  return data;
}

export async function updateStaffStatus(staffId: string, status: 'active' | 'inactive') {
  const { error } = await supabase
    .from('staff_members').update({ status }).eq('id', staffId);
  if (error) throw error;
}

export async function deleteStaffMember(staffId: string) {
  const { error } = await supabase.from('staff_members').delete().eq('id', staffId);
  if (error) throw error;
}

export async function fetchStaffTasks(staffId: string) {
  const { data, error } = await supabase
    .from('tasks').select('*').eq('staff_id', staffId)
    .order('due_date', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function createTask(staffId: string, task: {
  title: string; priority: string; due_date?: string; category?: string; notes?: string;
}) {
  const { data, error } = await supabase
    .from('tasks').insert({ ...task, staff_id: staffId }).select().single();
  if (error) throw error;
  return data;
}

export async function updateTask(taskId: string, updates: { completed?: boolean; title?: string; priority?: string }) {
  const { error } = await supabase.from('tasks').update(updates).eq('id', taskId);
  if (error) throw error;
}

export async function deleteTask(taskId: string) {
  const { error } = await supabase.from('tasks').delete().eq('id', taskId);
  if (error) throw error;
}
