import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { createStaffInvite } from '../../../../lib/api/staff';

export interface StaffMember {
  id: string;
  name: string;
  phone: string;
  role: string;
  status: 'active' | 'inactive';
  joinDate: string;
  staffCode: string;
}

const ROLES = [
  { value: 'coordinator', label: 'Event Coordinator' },
  { value: 'supervisor', label: 'Supervisor' },
  { value: 'cleaner', label: 'Cleaner' },
  { value: 'security', label: 'Security' },
  { value: 'catering', label: 'Catering Staff' },
  { value: 'technician', label: 'AV Technician' },
];

interface AddStaffModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  venueId: string;
  onCreated: (member: StaffMember) => void;
}

export default function AddStaffModal({ open, onOpenChange, venueId, onCreated }: AddStaffModalProps) {
  const [role, setRole] = useState('');
  const [roleError, setRoleError] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);

  const handleClose = () => {
    setRole('');
    setRoleError('');
    setGeneratedCode('');
    setCopied(false);
    onOpenChange(false);
  };

  const handleGenerate = async () => {
    if (!role) { setRoleError('Please select a role'); return; }
    setLoading(true);
    try {
      const record = await createStaffInvite(venueId, role);
      setGeneratedCode(record.staff_code);
      const newMember: StaffMember = {
        id: record.id,
        name: 'Pending Registration',
        phone: '',
        role: record.role,
        status: 'active',
        joinDate: record.join_date ?? new Date().toISOString().split('T')[0],
        staffCode: record.staff_code,
      };
      onCreated(newMember);
    } catch {
      toast.error('Failed to generate invite code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Staff Invite Code</DialogTitle>
        </DialogHeader>

        {!generatedCode ? (
          <div className="space-y-4 py-2">
            <p className="text-sm text-gray-500">
              Select a role and generate a unique invite code. Share it with your staff member so they can register.
            </p>
            <div>
              <Label>Staff Role <span className="text-red-500">*</span></Label>
              <Select value={role} onValueChange={(v) => { setRole(v); setRoleError(''); }}>
                <SelectTrigger className={`mt-1 ${roleError ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                </SelectContent>
              </Select>
              {roleError && <p className="text-red-500 text-xs mt-1">{roleError}</p>}
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={handleClose}>Cancel</Button>
              <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={handleGenerate} disabled={loading}>
                {loading ? 'Generating...' : 'Generate Code'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            <p className="text-sm text-gray-600">Invite code created! Share it with the staff member:</p>
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
              <span className="text-xl font-mono font-bold text-green-800 flex-1 tracking-widest">{generatedCode}</span>
              <button onClick={copyCode} className="p-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-500">The staff member must use this code along with your event center when registering.</p>
            <Button className="w-full" onClick={handleClose}>Done</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
