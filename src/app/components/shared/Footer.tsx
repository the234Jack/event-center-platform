import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">EventHub</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Nigeria's leading platform for discovering and booking event centers.
              Find the perfect venue for every occasion.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <span>Lagos, Nigeria</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Phone className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <span>+234 800 EVENT HUB</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Mail className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <span>hello@eventhub.ng</span>
              </div>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Platform
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'Browse Venues', href: '/browse' },
                { label: 'How It Works', href: '/#how-it-works' },
                { label: 'Venue Categories', href: '/browse' },
                { label: 'Popular Locations', href: '/browse' },
                { label: 'Login', href: '/login' },
                { label: 'Register', href: '/register' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Owners */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              For Owners
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'List Your Venue', href: '/register' },
                { label: 'Owner Dashboard', href: '/dashboard/owner' },
                { label: 'Manage Halls', href: '/register/event-center' },
                { label: 'Track Bookings', href: '/dashboard/owner' },
                { label: 'Owner Benefits', href: '/#for-owners' },
                { label: 'Register Staff', href: '/register' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'Help Center', href: '#' },
                { label: 'Contact Us', href: '#' },
                { label: 'Privacy Policy', href: '#' },
                { label: 'Terms of Service', href: '#' },
                { label: 'Cookie Policy', href: '#' },
                { label: 'Report an Issue', href: '#' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} EventHub Nigeria. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-600 bg-gray-800 px-3 py-1 rounded-full">
              🇳🇬 Made for Nigeria
            </span>
            <div className="flex items-center gap-3">
              {['Twitter', 'Instagram', 'LinkedIn', 'Facebook'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-xs text-gray-500 hover:text-white transition-colors"
                  aria-label={social}
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
