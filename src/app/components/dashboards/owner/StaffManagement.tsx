import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Switch } from '../../ui/switch';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '../../ui/alert-dialog';
import { Plus, Trash2, Users, Phone } from 'lucide-react';
import { toast } from 'sonner';
import AddStaffModal, { StaffMember } from './AddStaffModal';
import { useAuth } from '../../../context/AuthContext';
import { fetchStaffMembers, updateStaffStatus, deleteStaffMember } from '../../../../lib/api/staff';
import { supabase } from '../../../../lib/supabase';

const ROLE_LABELS: Record<string, string> = {
  coordinator: 'Event Coordinator',
  supervisor: 'Supervisor',
  cleaner: 'Cleaner',
  security: 'Security',
  catering: 'Catering Staff',
  technician: 'AV Technician',
};

const ROLE_COLORS: Record<string, string> = {
  coordinator: 'bg-blue-100 text-blue-700',
  supervisor: 'bg-purple-100 text-purple-700',
  cleaner: 'bg-gray-100 text-gray-700',
  security: 'bg-red-100 text-red-700',
  catering: 'bg-orange-100 text-orange-700',
  technician: 'bg-green-100 text-green-700',
};

export default function StaffManagement() {
  const { user } = useAuth();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [venueId, setVenueId] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    supabase.from('venues').select('id').eq('owner_id', user.id).then(({ data }) => {
      if (!data?.length) return;
      const ids = data.map((v: any) => v.id);
      setVenueId(ids[0]);
      Promise.all(ids.map((id: string) => fetchStaffMembers(id))).then((results) => {
        const all = results.flat() as any[];
        setStaff(all.map((s) => ({
          id: s.id,
          name: s.profiles?.full_name ?? 'Pending Registration',
          phone: s.profiles?.phone ?? '',
          role: s.role,
          status: s.status,
          joinDate: s.join_date ?? '',
          staffCode: s.staff_code,
        })));
      });
    });
  }, [user?.id]);

  const toggleStatus = async (id: string) => {
    const member = staff.find((s) => s.id === id);
    if (!member) return;
    const newStatus = member.status === 'active' ? 'inactive' : 'active';
    try {
      await updateStaffStatus(id, newStatus);
      setStaff((prev) => prev.map((s) => s.id === id ? { ...s, status: newStatus } : s));
      toast.success(`${member.name} marked as ${newStatus}.`);
    } catch { toast.error('Failed to update status.'); }
  };

  const handleDelete = async (id: string) => {
    const member = staff.find((s) => s.id === id);
    try {
      await deleteStaffMember(id);
      setStaff((prev) => prev.filter((s) => s.id !== id));
      toast.success(`${member?.name ?? 'Staff member'} removed.`);
    } catch { toast.error('Failed to remove staff member.'); }
    setDeleteId(null);
  };

  const activeCount = staff.filter((s) => s.status === 'active').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Staff Management</h2>
          <p className="text-sm text-gray-500">{staff.length} members · {activeCount} active</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white" size="sm" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4 mr-1.5" /> Invite Staff
        </Button>
      </div>

      {staff.length === 0 ? (
        <div className="text-center py-16">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No staff members yet</p>
          <Button className="mt-4" onClick={() => setModalOpen(true)}>Invite First Staff Member</Button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Staff Member</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Role</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Contact</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden xl:table-cell">Staff Code</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Active</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {staff.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm flex-shrink-0">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <p className="text-xs text-gray-400 md:hidden">{ROLE_LABELS[member.role]}</p>
                        <p className="text-xs text-gray-400">Since {new Date(member.joinDate).toLocaleDateString('en-NG', { month: 'short', year: 'numeric' })}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[member.role]}`}>
                      {ROLE_LABELS[member.role]}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="space-y-0.5 text-xs text-gray-600">
                      {member.phone && <div className="flex items-center gap-1"><Phone className="h-3 w-3" />{member.phone}</div>}
                      {!member.phone && <span className="text-gray-400 italic">Not registered yet</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden xl:table-cell">
                    <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{member.staffCode}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <Switch checked={member.status === 'active'} onCheckedChange={() => toggleStatus(member.id)} />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setDeleteId(member.id)}>
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AddStaffModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        venueId={venueId}
        onCreated={(member) => setStaff((prev) => [member, ...prev])}
      />

      <AlertDialog open={deleteId !== null} onOpenChange={(o) => { if (!o) setDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this staff member?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove {staff.find((s) => s.id === deleteId)?.name ?? 'this staff member'} from your staff list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => { if (deleteId) handleDelete(deleteId); }}>
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
