import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Building2, Eye, EyeOff, AlertCircle, ArrowRight, Users, Briefcase, Home, Star, Shield, Zap } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { dashboardPath } from '../context/AuthContext';
import type { UserRole } from '../../lib/database.types';

const ROLE_CARDS = [
  { value: 'client' as UserRole, label: 'Client', icon: Users, desc: 'Browse & book venues', color: 'border-blue-200 bg-blue-50 text-blue-700' },
  { value: 'staff' as UserRole, label: 'Staff', icon: Briefcase, desc: 'Manage events', color: 'border-purple-200 bg-purple-50 text-purple-700' },
  { value: 'owner' as UserRole, label: 'Owner', icon: Home, desc: 'Manage your centers', color: 'border-green-200 bg-green-50 text-green-700' },
];

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setLoginError('');

    if (!email.trim()) { setLoginError('Email is required.'); return; }
    if (password.length < 6) { setLoginError('Password must be at least 6 characters.'); return; }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setLoginError(error.message); setLoading(false); return; }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (!profile) {
        setLoginError('Account profile not found. Please register first.');
        setLoading(false);
        return;
      }

      navigate(dashboardPath(profile.role as UserRole));
    } catch {
      setLoginError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 h-64 w-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-20 right-20 h-48 w-48 rounded-full bg-blue-300 blur-3xl" />
        </div>
        <div className="relative">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl">EventHub</span>
          </Link>
        </div>
        <div className="relative space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">Nigeria's Premier Event Center Platform</h1>
            <p className="text-blue-200 text-lg">Connect with 500+ verified event centers across all 36 states.</p>
          </div>
          <div className="space-y-4">
            {[
              { icon: Shield, text: 'Verified venues with full facility details' },
              { icon: Zap, text: 'Instant booking requests and confirmations' },
              { icon: Star, text: 'Trusted by 10,000+ event organizers' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-4 w-4 text-blue-200" />
                </div>
                <p className="text-blue-100 text-sm">{text}</p>
              </div>
            ))}
          </div>
          <div className="p-5 bg-white/10 backdrop-blur rounded-2xl border border-white/20">
            <p className="text-blue-100 text-sm italic mb-3">
              "EventHub made it so easy to find the perfect venue for our wedding. Booked Grand Palace within an hour!"
            </p>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-blue-400 flex items-center justify-center text-white text-sm font-bold">A</div>
              <div>
                <p className="text-white text-sm font-medium">Amaka Okonkwo</p>
                <p className="text-blue-300 text-xs">Lagos, Nigeria</p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative flex gap-6 text-center">
          {[['500+', 'Venues'], ['36', 'States'], ['10K+', 'Events']].map(([val, label]) => (
            <div key={label}>
              <p className="text-2xl font-bold text-white">{val}</p>
              <p className="text-blue-300 text-xs">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 bg-white overflow-y-auto">
        <div className="w-full max-w-md mx-auto">
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">EventHub</span>
          </Link>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-gray-500 mt-2">Sign in to your account to continue</p>
          </div>

          {/* Role display (informational) */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">Available account types</p>
            <div className="grid grid-cols-3 gap-3">
              {ROLE_CARDS.map(({ value, label, icon: Icon, desc, color }) => (
                <div key={value} className={`p-3 rounded-xl border text-center ${color}`}>
                  <Icon className="h-5 w-5 mx-auto mb-1.5" />
                  <p className="text-xs font-semibold">{label}</p>
                  <p className="text-xs opacity-70 hidden sm:block">{desc}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">Your dashboard is determined by your registered role</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {loginError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{loginError}</p>
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
              <Input
                id="email" type="email" placeholder="you@example.com"
                className="mt-1.5 h-11" value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email" required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                <button type="button" className="text-xs text-blue-600 hover:underline">Forgot password?</button>
              </div>
              <div className="relative">
                <Input
                  id="password" type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••" className="h-11 pr-11"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password" required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>Sign In <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
