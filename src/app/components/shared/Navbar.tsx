import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Building2, Menu, X, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '../../context/AuthContext';
import { dashboardPath } from '../../context/AuthContext';
import { cn } from '../ui/utils';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isLanding = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { label: 'Browse Venues', href: '/browse' },
    { label: 'Plan Event', href: '/plan-event' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'For Owners', href: '/#for-owners' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isLanding && !scrolled && !menuOpen
          ? 'bg-transparent'
          : 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md group-hover:bg-blue-700 transition-colors">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span
              className={cn(
                'text-xl font-bold tracking-tight',
                isLanding && !scrolled ? 'text-white' : 'text-gray-900'
              )}
            >
              EventHub
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  isLanding && !scrolled
                    ? 'text-white/90 hover:text-white hover:bg-white/10'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(dashboardPath(user.role))}
                  className={cn(
                    isLanding && !scrolled
                      ? 'text-white/90 hover:text-white hover:bg-white/10'
                      : ''
                  )}
                >
                  Dashboard
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className={cn(
                    isLanding && !scrolled
                      ? 'border-white/40 text-white hover:bg-white/10 bg-transparent'
                      : ''
                  )}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                  className={cn(
                    isLanding && !scrolled
                      ? 'text-white/90 hover:text-white hover:bg-white/10'
                      : ''
                  )}
                >
                  Login
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/register')}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                >
                  Get Started
                  <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={cn(
              'md:hidden p-2 rounded-lg transition-colors',
              isLanding && !scrolled && !menuOpen
                ? 'text-white hover:bg-white/10'
                : 'text-gray-700 hover:bg-gray-100'
            )}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-gray-100 mt-3 flex flex-col gap-2">
              {user ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => navigate(dashboardPath(user.role))}
                    className="w-full"
                  >
                    Dashboard
                  </Button>
                  <Button variant="ghost" onClick={handleLogout} className="w-full">
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => navigate('/login')} className="w-full">
                    Login
                  </Button>
                  <Button
                    onClick={() => navigate('/register')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
