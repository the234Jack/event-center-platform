import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../../ui/sheet';
import { useAuth } from '../../../context/AuthContext';
import {
  Building2, LogOut, Menu, LayoutDashboard, Calendar, Heart, User,
  ClipboardList, Users, BarChart3, Home, TrendingUp,
  CheckSquare, BookOpen, Bell,
} from 'lucide-react';
import { cn } from '../../ui/utils';

type Role = 'client' | 'staff' | 'owner';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: Record<Role, NavItem[]> = {
  client: [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: 'bookings', label: 'My Bookings', icon: <Calendar className="h-4 w-4" /> },
    { id: 'saved', label: 'Saved Venues', icon: <Heart className="h-4 w-4" /> },
    { id: 'profile', label: 'Profile', icon: <User className="h-4 w-4" /> },
  ],
  staff: [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: 'schedule', label: 'My Schedule', icon: <Calendar className="h-4 w-4" /> },
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare className="h-4 w-4" /> },
    { id: 'clients', label: 'Client Directory', icon: <Users className="h-4 w-4" /> },
  ],
  owner: [
    { id: 'overview', label: 'Overview', icon: <Home className="h-4 w-4" /> },
    { id: 'requests', label: 'Booking Requests', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'centers', label: 'My Event Centers', icon: <Building2 className="h-4 w-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'staff', label: 'Staff Management', icon: <Users className="h-4 w-4" /> },
  ],
};

const ROLE_CONFIG: Record<Role, { gradient: string; activeClass: string; avatarGradient: string; label: string; badgeClass: string }> = {
  client: {
    gradient: 'from-blue-600 to-blue-700',
    activeClass: 'bg-blue-600/10 text-blue-700 font-semibold',
    avatarGradient: 'from-blue-500 to-blue-700',
    label: 'Client Portal',
    badgeClass: 'bg-blue-100 text-blue-700',
  },
  staff: {
    gradient: 'from-purple-600 to-purple-700',
    activeClass: 'bg-purple-600/10 text-purple-700 font-semibold',
    avatarGradient: 'from-purple-500 to-purple-700',
    label: 'Staff Portal',
    badgeClass: 'bg-purple-100 text-purple-700',
  },
  owner: {
    gradient: 'from-green-600 to-emerald-700',
    activeClass: 'bg-green-600/10 text-green-700 font-semibold',
    avatarGradient: 'from-green-500 to-emerald-700',
    label: 'Owner Portal',
    badgeClass: 'bg-green-100 text-green-700',
  },
};

interface SidebarContentProps {
  role: Role;
  activeSection: string;
  onSectionChange: (s: string) => void;
  onClose?: () => void;
}

function SidebarContent({ role, activeSection, onSectionChange, onClose }: SidebarContentProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const navItems = NAV_ITEMS[role];
  const config = ROLE_CONFIG[role];
  const initials = user?.email?.charAt(0).toUpperCase() ?? 'U';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Logo Header with gradient accent */}
      <div className={`bg-gradient-to-r ${config.gradient} p-5`}>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-sm tracking-wide">EventHub</p>
            <p className="text-white/70 text-xs">{config.label}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto mt-2">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Navigation</p>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => { onSectionChange(item.id); onClose?.(); }}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left',
              activeSection === item.id
                ? config.activeClass
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800 font-medium'
            )}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-3 p-2 rounded-lg bg-gray-50">
          <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${config.avatarGradient} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400">Logged in as</p>
            <p className="text-xs font-semibold text-gray-700 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

interface DashboardLayoutProps {
  role: Role;
  activeSection: string;
  onSectionChange: (s: string) => void;
  title: string;
  children: React.ReactNode;
}

export default function DashboardLayout({
  role, activeSection, onSectionChange, title, children,
}: DashboardLayoutProps) {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const config = ROLE_CONFIG[role];
  const initials = user?.email?.charAt(0).toUpperCase() ?? 'U';

  return (
    <div className="flex h-screen bg-gray-50/80 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col w-60 border-r flex-shrink-0 shadow-sm">
        <SidebarContent role={role} activeSection={activeSection} onSectionChange={onSectionChange} />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b px-4 md:px-6 py-3.5 flex items-center justify-between flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-60">
                <SidebarContent
                  role={role}
                  activeSection={activeSection}
                  onSectionChange={onSectionChange}
                  onClose={() => setMobileOpen(false)}
                />
              </SheetContent>
            </Sheet>
            <div>
              <h1 className="text-base font-bold text-gray-900">{title}</h1>
              <p className="text-xs text-gray-400 hidden sm:block">{config.label}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors hidden sm:block">
              <Bell className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 hidden sm:block">{user?.email}</span>
              <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${config.avatarGradient} flex items-center justify-center text-white text-xs font-bold`}>
                {initials}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
