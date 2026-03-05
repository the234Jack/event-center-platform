import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { AlertCircle, Eye, EyeOff, Info } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface StaffRegistrationFormProps {
  onNavigateToLogin: () => void;
}

const STAFF_ROLES = [
  { value: 'coordinator', label: 'Event Coordinator' },
  { value: 'supervisor', label: 'Supervisor' },
  { value: 'cleaner', label: 'Cleaning Staff' },
  { value: 'security', label: 'Security' },
  { value: 'catering', label: 'Catering Staff' },
  { value: 'technician', label: 'Technician' },
];

interface Venue { id: string; name: string; city: string; }

export default function StaffRegistrationForm({ onNavigateToLogin }: StaffRegistrationFormProps) {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    staffRole: '', venueId: '', staffCode: '', password: '', confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [venues, setVenues] = useState<Venue[]>([]);

  // Load venues from DB for the event center dropdown
  useEffect(() => {
    supabase.from('venues').select('id, name, city').order('name')
      .then(({ data }) => { if (data) setVenues(data); });
  }, []);

  const set = (field: string, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required';
    if (!form.lastName.trim()) e.lastName = 'Last name is required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email is required';
    if (!/^[0-9]{11}$/.test(form.phone)) e.phone = 'Phone must be 11 digits';
    if (!form.staffRole) e.staffRole = 'Staff role is required';
    if (!form.venueId) e.venueId = 'Event center is required';
    if (!form.staffCode.trim()) e.staffCode = 'Staff invite code is required';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitError('');
    setLoading(true);

    try {
      // 1. Validate staff code exists for this venue and is unclaimed
      const { data: staffRecord, error: codeError } = await supabase
        .from('staff_members')
        .select('id, user_id')
        .eq('staff_code', form.staffCode.trim().toUpperCase())
        .eq('venue_id', form.venueId)
        .single();

      if (codeError || !staffRecord) {
        setSubmitError('Invalid invite code for the selected event center. Please check with your manager.');
        setLoading(false);
        return;
      }

      if (staffRecord.user_id) {
        setSubmitError('This invite code has already been used. Please request a new one.');
        setLoading(false);
        return;
      }

      // 2. Create auth user (trigger will auto-create profile from metadata)
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            role: 'staff',
            full_name: `${form.firstName} ${form.lastName}`,
            phone: form.phone,
          },
        },
      });
      if (error) { setSubmitError(error.message); setLoading(false); return; }
      if (!data.user) { setSubmitError('Registration failed. Please try again.'); setLoading(false); return; }

      // 3. Link staff record to this user
      await supabase
        .from('staff_members')
        .update({ user_id: data.user.id, role: form.staffRole as any })
        .eq('id', staffRecord.id);

      onNavigateToLogin();
    } catch {
      setSubmitError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
        <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">Staff Registration</p>
          <p>You need a staff invite code from your event center owner to register. The code must match the selected event center.</p>
        </div>
      </div>

      {submitError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{submitError}</p>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="font-semibold text-base">Personal Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(['firstName', 'lastName'] as const).map((field) => (
            <div key={field} className="space-y-2">
              <Label htmlFor={field}>{field === 'firstName' ? 'First' : 'Last'} Name <span className="text-red-500">*</span></Label>
              <Input id={field} value={form[field]} onChange={(e) => set(field, e.target.value)} className={errors[field] ? 'border-red-500' : ''} />
              {errors[field] && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors[field]}</p>}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
            <Input id="email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className={errors.email ? 'border-red-500' : ''} />
            {errors.email && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.email}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
            <Input id="phone" type="tel" placeholder="08012345678" value={form.phone} onChange={(e) => set('phone', e.target.value)} className={errors.phone ? 'border-red-500' : ''} />
            {errors.phone && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.phone}</p>}
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h3 className="font-semibold text-base">Work Details</h3>
        <div className="space-y-2">
          <Label>Staff Role <span className="text-red-500">*</span></Label>
          <Select value={form.staffRole} onValueChange={(v) => set('staffRole', v)}>
            <SelectTrigger className={errors.staffRole ? 'border-red-500' : ''}><SelectValue placeholder="Select your role" /></SelectTrigger>
            <SelectContent>{STAFF_ROLES.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}</SelectContent>
          </Select>
          {errors.staffRole && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.staffRole}</p>}
        </div>
        <div className="space-y-2">
          <Label>Event Center <span className="text-red-500">*</span></Label>
          <Select value={form.venueId} onValueChange={(v) => set('venueId', v)}>
            <SelectTrigger className={errors.venueId ? 'border-red-500' : ''}><SelectValue placeholder="Select your event center" /></SelectTrigger>
            <SelectContent>
              {venues.map((v) => <SelectItem key={v.id} value={v.id}>{v.name} — {v.city}</SelectItem>)}
            </SelectContent>
          </Select>
          {errors.venueId && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.venueId}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="staffCode">Staff Invite Code <span className="text-red-500">*</span></Label>
          <Input id="staffCode" placeholder="e.g. STAFF-ABC123" value={form.staffCode} onChange={(e) => set('staffCode', e.target.value.toUpperCase())} className={errors.staffCode ? 'border-red-500' : ''} />
          <p className="text-xs text-gray-500">Contact your event center manager to get this code</p>
          {errors.staffCode && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.staffCode}</p>}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h3 className="font-semibold text-base">Password</h3>
        <div className="space-y-2">
          <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
          <div className="relative">
            <Input id="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => set('password', e.target.value)} className={errors.password ? 'border-red-500' : ''} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
          </div>
          {errors.password && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.password}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password <span className="text-red-500">*</span></Label>
          <div className="relative">
            <Input id="confirmPassword" type={showConfirm ? 'text' : 'password'} value={form.confirmPassword} onChange={(e) => set('confirmPassword', e.target.value)} className={errors.confirmPassword ? 'border-red-500' : ''} />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
          </div>
          {errors.confirmPassword && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.confirmPassword}</p>}
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700">
        {loading ? 'Creating account...' : 'Register as Staff'}
      </Button>
    </form>
  );
}
