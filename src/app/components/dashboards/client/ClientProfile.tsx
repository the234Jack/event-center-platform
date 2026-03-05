import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Checkbox } from '../../ui/checkbox';
import { Progress } from '../../ui/progress';
import { User, Mail, Phone, MapPin, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../../lib/supabase';

const NIGERIAN_STATES = ['Lagos', 'Abuja (FCT)', 'Rivers', 'Oyo', 'Kano', 'Enugu', 'Anambra', 'Delta', 'Ogun', 'Kaduna'];
const EVENT_TYPES = ['Wedding', 'Corporate', 'Birthday', 'Conference', 'Anniversary', 'Party', 'Graduation'];

interface ProfileData {
  fullName: string;
  phone: string;
  state: string;
  city: string;
  bio: string;
  preferredEventTypes: string[];
}

export default function ClientProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData>({
    fullName: '',
    phone: '',
    state: '',
    city: '',
    bio: '',
    preferredEventTypes: [],
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    supabase.from('profiles').select('full_name, phone, state, city').eq('id', user.id).single()
      .then(({ data }) => {
        if (data) setProfile((p) => ({
          ...p,
          fullName: data.full_name ?? '',
          phone: data.phone ?? '',
          state: data.state ?? '',
          city: data.city ?? '',
        }));
      });
  }, [user?.id]);

  const updateField = (field: keyof ProfileData, value: string) => {
    setProfile((p) => ({ ...p, [field]: value }));
  };

  const toggleEventType = (type: string) => {
    setProfile((p) => ({
      ...p,
      preferredEventTypes: p.preferredEventTypes.includes(type)
        ? p.preferredEventTypes.filter((t) => t !== type)
        : [...p.preferredEventTypes, type],
    }));
  };

  const completionFields = [profile.fullName, profile.phone, profile.state, profile.city, profile.bio, profile.preferredEventTypes.length > 0 ? 'ok' : ''];
  const completion = Math.round((completionFields.filter(Boolean).length / completionFields.length) * 100);

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    const { error } = await supabase.from('profiles').update({
      full_name: profile.fullName,
      phone: profile.phone,
      state: profile.state,
      city: profile.city,
    }).eq('id', user.id);
    setSaving(false);
    if (error) { toast.error('Failed to save profile.'); return; }
    toast.success('Profile updated successfully!');
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">My Profile</h2>
        <p className="text-sm text-gray-500">Keep your information up to date</p>
      </div>

      {/* Avatar + Completion */}
      <div className="bg-white rounded-xl border p-6 mb-6 flex items-center gap-5">
        <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
          {profile.fullName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900">{profile.fullName || 'Your Name'}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Profile completion</span>
              <span className="font-medium">{completion}%</span>
            </div>
            <Progress value={completion} className="h-1.5" />
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl border p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName" className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> Full Name</Label>
            <Input id="fullName" className="mt-1" value={profile.fullName} onChange={(e) => updateField('fullName', e.target.value)} placeholder="Enter your full name" />
          </div>
          <div>
            <Label htmlFor="email" className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> Email Address</Label>
            <Input id="email" className="mt-1 bg-gray-50 text-gray-500" value={user?.email ?? ''} readOnly />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone" className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> Phone Number</Label>
            <Input id="phone" className="mt-1" value={profile.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="+234 800 000 0000" />
          </div>
          <div>
            <Label className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> State</Label>
            <Select value={profile.state} onValueChange={(v) => updateField('state', v)}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Select state" /></SelectTrigger>
              <SelectContent>
                {NIGERIAN_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="city">City / Area</Label>
          <Input id="city" className="mt-1" value={profile.city} onChange={(e) => updateField('city', e.target.value)} placeholder="e.g. Ikeja" />
        </div>

        <div>
          <Label>Preferred Event Types</Label>
          <p className="text-xs text-gray-500 mb-2">Select event types you frequently organize</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {EVENT_TYPES.map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-colors">
                <Checkbox
                  checked={profile.preferredEventTypes.includes(type)}
                  onCheckedChange={() => toggleEventType(type)}
                />
                <span className="text-sm">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="bio">About You</Label>
          <Textarea id="bio" className="mt-1 resize-none" rows={3}
            value={profile.bio}
            onChange={(e) => updateField('bio', e.target.value)}
            placeholder="Tell venues a bit about yourself and your events..." />
        </div>

        <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
