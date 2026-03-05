import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, Users, Briefcase, Home, ArrowLeft, CheckCircle2 } from 'lucide-react';
import ClientRegistrationForm from './registration/ClientRegistrationForm';
import StaffRegistrationForm from './registration/StaffRegistrationForm';
import OwnerRegistrationForm from './registration/OwnerRegistrationForm';

type Role = 'client' | 'staff' | 'owner';

const ROLES: { value: Role; label: string; icon: React.ElementType; description: string; perks: string[]; gradient: string; border: string; badge: string }[] = [
  {
    value: 'client',
    label: 'Client',
    icon: Users,
    description: 'Find & book event centers for your events',
    perks: ['Browse 500+ venues', 'Compare halls & prices', 'Book & manage events', 'Save favourite venues'],
    gradient: 'from-blue-600 to-blue-700',
    border: 'border-blue-500',
    badge: 'bg-blue-100 text-blue-700',
  },
  {
    value: 'staff',
    label: 'Staff',
    icon: Briefcase,
    description: 'Manage events and coordinate with clients',
    perks: ['View assigned events', 'Manage tasks', 'Access client directory', 'Track your schedule'],
    gradient: 'from-purple-600 to-purple-700',
    border: 'border-purple-500',
    badge: 'bg-purple-100 text-purple-700',
  },
  {
    value: 'owner',
    label: 'Event Center Owner',
    icon: Home,
    description: 'List your venue and grow your business',
    perks: ['List your event centers', 'Manage booking requests', 'Track revenue & analytics', 'Manage staff'],
    gradient: 'from-green-600 to-green-700',
    border: 'border-green-500',
    badge: 'bg-green-100 text-green-700',
  },
];

export default function RegistrationPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const selected = ROLES.find((r) => r.value === selectedRole);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">EventHub</span>
          </Link>
          <Link to="/login" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Sign in instead
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className={`flex items-center gap-2 text-sm font-medium ${!selectedRole ? 'text-blue-600' : 'text-green-600'}`}>
            <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${!selectedRole ? 'bg-blue-600 text-white' : 'bg-green-500 text-white'}`}>
              {selectedRole ? <CheckCircle2 className="h-4 w-4" /> : '1'}
            </div>
            <span className="hidden sm:block">Choose Role</span>
          </div>
          <div className={`flex-1 max-w-16 h-0.5 ${selectedRole ? 'bg-green-400' : 'bg-gray-200'}`} />
          <div className={`flex items-center gap-2 text-sm font-medium ${selectedRole ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${selectedRole ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
            <span className="hidden sm:block">Your Details</span>
          </div>
        </div>

        {!selectedRole ? (
          /* Step 1: Role Selection */
          <div>
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">Create your account</h1>
              <p className="text-gray-500 text-lg">Choose the account type that fits your needs</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {ROLES.map(({ value, label, icon: Icon, description, perks, gradient, border, badge }) => (
                <button
                  key={value}
                  onClick={() => setSelectedRole(value)}
                  className={`group relative bg-white rounded-2xl border-2 border-gray-200 hover:${border} hover:shadow-xl transition-all duration-200 text-left overflow-hidden`}
                >
                  {/* Gradient header */}
                  <div className={`bg-gradient-to-br ${gradient} p-6`}>
                    <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{label}</h3>
                    <p className="text-white/80 text-sm">{description}</p>
                  </div>

                  {/* Perks */}
                  <div className="p-5">
                    <ul className="space-y-2.5">
                      {perks.map((perk) => (
                        <li key={perk} className="flex items-center gap-2.5 text-sm text-gray-600">
                          <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                          {perk}
                        </li>
                      ))}
                    </ul>

                    <div className={`mt-5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${badge}`}>
                      {label} Account
                    </div>
                  </div>

                  <div className="px-5 pb-5">
                    <div className={`w-full py-2.5 rounded-xl bg-gradient-to-r ${gradient} text-white text-sm font-semibold text-center group-hover:shadow-md transition-shadow`}>
                      Register as {label} →
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <p className="text-center text-sm text-gray-500 mt-8">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline font-medium">Sign in here</Link>
            </p>
          </div>
        ) : (
          /* Step 2: Registration Form */
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setSelectedRole(null)}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Change role
              </button>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${selected?.badge}`}>
                {selected && <selected.icon className="h-3.5 w-3.5" />}
                {selected?.label} Account
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border p-8">
              <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${selected?.gradient} flex items-center justify-center mb-5`}>
                {selected && <selected.icon className="h-6 w-6 text-white" />}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {selectedRole === 'client' ? 'Create your client account' :
                 selectedRole === 'staff' ? 'Join as a staff member' :
                 'Register as an event center owner'}
              </h2>
              <p className="text-gray-500 text-sm mb-8">Fill in your details to get started</p>

              {selectedRole === 'client' && (
                <ClientRegistrationForm onNavigateToLogin={() => navigate('/login')} />
              )}
              {selectedRole === 'staff' && (
                <StaffRegistrationForm onNavigateToLogin={() => navigate('/login')} />
              )}
              {selectedRole === 'owner' && (
                <OwnerRegistrationForm
                  onNavigateToLogin={() => navigate('/login')}
                  onNavigateToEventCenter={() => navigate('/register/event-center')}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
