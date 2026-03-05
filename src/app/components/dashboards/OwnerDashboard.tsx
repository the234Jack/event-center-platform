import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from './shared/DashboardLayout';
import OwnerDashboardHome from './owner/OwnerDashboardHome';
import BookingRequests from './owner/BookingRequests';
import MyEventCenters from './owner/MyEventCenters';
import OwnerAnalytics from './owner/OwnerAnalytics';
import StaffManagement from './owner/StaffManagement';

const SECTION_TITLES: Record<string, string> = {
  overview: 'Overview',
  requests: 'Booking Requests',
  centers: 'My Event Centers',
  analytics: 'Analytics',
  staff: 'Staff Management',
};

export default function OwnerDashboard() {
  const [section, setSection] = useState('overview');

  return (
    <DashboardLayout role="owner" activeSection={section} onSectionChange={setSection} title={SECTION_TITLES[section]}>
      {section === 'overview' && <OwnerDashboardHome onViewRequests={() => setSection('requests')} />}
      {section === 'requests' && <BookingRequests />}
      {section === 'centers' && <MyEventCenters />}
      {section === 'analytics' && <OwnerAnalytics />}
      {section === 'staff' && <StaffManagement />}
    </DashboardLayout>
  );
}
