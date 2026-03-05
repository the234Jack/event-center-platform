import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { AlertCircle, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface OwnerRegistrationFormProps {
  onNavigateToLogin: () => void;
  onNavigateToEventCenter: () => void;
}

export default function OwnerRegistrationForm({ onNavigateToEventCenter }: OwnerRegistrationFormProps) {
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', nin: '',
    businessName: '', businessAddress: '', password: '', confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const set = (field: string, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email is required';
    if (!/^[0-9]{11}$/.test(form.phone)) e.phone = 'Phone must be 11 digits';
    if (!/^[0-9]{11}$/.test(form.nin)) e.nin = 'NIN must be 11 digits';
    if (!form.businessName.trim()) e.businessName = 'Business name is required';
    if (!form.businessAddress.trim()) e.businessAddress = 'Business address is required';
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
      const { data, error } = await supabase.auth.signUp({ email: form.email, password: form.password });
      if (error) { setSubmitError(error.message); setLoading(false); return; }
      if (!data.user) { setSubmitError('Registration failed. Please try again.'); setLoading(false); return; }

      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        role: 'owner',
        full_name: form.fullName,
        phone: form.phone,
        nin: form.nin,
        business_name: form.businessName,
        business_address: form.businessAddress,
      });

      if (profileError) { setSubmitError(profileError.message); setLoading(false); return; }

      onNavigateToEventCenter();
    } catch {
      setSubmitError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{submitError}</p>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="font-semibold text-base">Owner Details</h3>
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name <span className="text-red-500">*</span></Label>
          <Input id="fullName" value={form.fullName} onChange={(e) => set('fullName', e.target.value)} className={errors.fullName ? 'border-red-500' : ''} />
          {errors.fullName && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.fullName}</p>}
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
        <div className="space-y-2">
          <Label htmlFor="nin">NIN (11 digits) <span className="text-red-500">*</span></Label>
          <Input id="nin" maxLength={11} value={form.nin} onChange={(e) => set('nin', e.target.value.replace(/\D/g, ''))} className={errors.nin ? 'border-red-500' : ''} />
          {errors.nin && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.nin}</p>}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h3 className="font-semibold text-base">Business Details</h3>
        <div className="space-y-2">
          <Label htmlFor="businessName">Business Name <span className="text-red-500">*</span></Label>
          <Input id="businessName" value={form.businessName} onChange={(e) => set('businessName', e.target.value)} className={errors.businessName ? 'border-red-500' : ''} />
          {errors.businessName && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.businessName}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="businessAddress">Business Address <span className="text-red-500">*</span></Label>
          <Input id="businessAddress" value={form.businessAddress} onChange={(e) => set('businessAddress', e.target.value)} className={errors.businessAddress ? 'border-red-500' : ''} />
          {errors.businessAddress && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.businessAddress}</p>}
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

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800">After registration you'll be directed to add your event center details — halls, facilities, and pricing.</p>
      </div>

      <Button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700">
        {loading ? 'Creating account...' : <><span>Continue to Event Center Registration</span><ArrowRight className="ml-2 h-4 w-4" /></>}
      </Button>
    </form>
  );
}
