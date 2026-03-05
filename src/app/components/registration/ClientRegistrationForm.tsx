import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { AlertCircle, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface ClientRegistrationFormProps {
  onNavigateToLogin: () => void;
}

const NIGERIAN_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
  'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT','Gombe','Imo',
  'Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa',
  'Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara',
];

const getPasswordStrength = (p: string) => {
  if (!p) return { strength: 0, label: '', color: '' };
  if (p.length < 6) return { strength: 1, label: 'Weak', color: 'bg-red-500' };
  if (p.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)) return { strength: 3, label: 'Strong', color: 'bg-green-500' };
  return { strength: 2, label: 'Medium', color: 'bg-yellow-500' };
};

export default function ClientRegistrationForm({ onNavigateToLogin }: ClientRegistrationFormProps) {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', nin: '',
    dateOfBirth: '', gender: '', password: '', confirmPassword: '',
    state: '', lga: '', address: '', acceptTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const set = (field: string, value: string | boolean) => {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required';
    if (!form.lastName.trim()) e.lastName = 'Last name is required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email is required';
    if (!/^[0-9]{11}$/.test(form.phone)) e.phone = 'Phone must be 11 digits';
    if (!/^[0-9]{11}$/.test(form.nin)) e.nin = 'NIN must be 11 digits';
    if (!form.dateOfBirth) e.dateOfBirth = 'Date of birth is required';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!form.state) e.state = 'State is required';
    if (!form.lga.trim()) e.lga = 'LGA is required';
    if (!form.address.trim()) e.address = 'Address is required';
    if (!form.acceptTerms) e.acceptTerms = 'You must accept the terms and conditions';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitError('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            role: 'client',
            full_name: `${form.firstName} ${form.lastName}`,
            phone: form.phone,
            nin: form.nin,
            date_of_birth: form.dateOfBirth,
            gender: form.gender || null,
            state: form.state,
            city: form.lga,
          },
        },
      });
      if (error) { setSubmitError(error.message); setLoading(false); return; }
      if (!data.user) { setSubmitError('Registration failed. Please try again.'); setLoading(false); return; }

      onNavigateToLogin();
    } catch {
      setSubmitError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const strength = getPasswordStrength(form.password);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nin">NIN (11 digits) <span className="text-red-500">*</span></Label>
            <Input id="nin" maxLength={11} value={form.nin} onChange={(e) => set('nin', e.target.value.replace(/\D/g, ''))} className={errors.nin ? 'border-red-500' : ''} />
            {errors.nin && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.nin}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth <span className="text-red-500">*</span></Label>
            <Input id="dateOfBirth" type="date" value={form.dateOfBirth} onChange={(e) => set('dateOfBirth', e.target.value)} className={errors.dateOfBirth ? 'border-red-500' : ''} />
            {errors.dateOfBirth && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.dateOfBirth}</p>}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Gender (Optional)</Label>
          <Select value={form.gender} onValueChange={(v) => set('gender', v)}>
            <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
            <SelectContent>
              {['male','female','other','prefer-not-to-say'].map((g) => <SelectItem key={g} value={g}>{g.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}</SelectItem>)}
            </SelectContent>
          </Select>
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
          {form.password && (
            <div className="space-y-1">
              <div className="flex gap-1">{[1,2,3].map((l) => <div key={l} className={`h-1 flex-1 rounded ${l <= strength.strength ? strength.color : 'bg-gray-200'}`} />)}</div>
              <p className="text-xs text-gray-500">{strength.label}</p>
            </div>
          )}
          {errors.password && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.password}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password <span className="text-red-500">*</span></Label>
          <div className="relative">
            <Input id="confirmPassword" type={showConfirm ? 'text' : 'password'} value={form.confirmPassword} onChange={(e) => set('confirmPassword', e.target.value)} className={errors.confirmPassword ? 'border-red-500' : ''} />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
          </div>
          {form.confirmPassword && form.password === form.confirmPassword && <p className="text-xs text-green-600 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" />Passwords match</p>}
          {errors.confirmPassword && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.confirmPassword}</p>}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h3 className="font-semibold text-base">Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>State <span className="text-red-500">*</span></Label>
            <Select value={form.state} onValueChange={(v) => set('state', v)}>
              <SelectTrigger className={errors.state ? 'border-red-500' : ''}><SelectValue placeholder="Select state" /></SelectTrigger>
              <SelectContent>{NIGERIAN_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
            {errors.state && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.state}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lga">LGA <span className="text-red-500">*</span></Label>
            <Input id="lga" value={form.lga} onChange={(e) => set('lga', e.target.value)} className={errors.lga ? 'border-red-500' : ''} />
            {errors.lga && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.lga}</p>}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Residential Address <span className="text-red-500">*</span></Label>
          <Input id="address" value={form.address} onChange={(e) => set('address', e.target.value)} className={errors.address ? 'border-red-500' : ''} />
          {errors.address && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.address}</p>}
        </div>
      </div>

      <div className="pt-4 border-t space-y-3">
        <div className="flex items-start gap-2">
          <Checkbox id="acceptTerms" checked={form.acceptTerms} onCheckedChange={(c) => set('acceptTerms', c as boolean)} className={errors.acceptTerms ? 'border-red-500' : ''} />
          <Label htmlFor="acceptTerms" className="text-sm font-normal cursor-pointer leading-relaxed">
            I accept the <button type="button" className="text-blue-600 hover:underline">Terms & Conditions</button> and <button type="button" className="text-blue-600 hover:underline">Privacy Policy</button>
          </Label>
        </div>
        {errors.acceptTerms && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.acceptTerms}</p>}
      </div>

      <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
        {loading ? 'Creating account...' : 'Register as Client'}
      </Button>
    </form>
  );
}
