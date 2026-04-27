import React, { useState } from 'react';
import DashboardLayout from './shared/DashboardLayout';
import AdminDashboardHome from './admin/AdminDashboardHome';
import VenueApprovals from './admin/VenueApprovals';
import UserManagement from './admin/UserManagement';
import OwnerManagement from './admin/OwnerManagement';
import AdminStaffManagement from './admin/AdminStaffManagement';

type Section = 'overview' | 'venues' | 'owners' | 'users' | 'staff';

const SECTION_TITLES: Record<Section, string> = {
  overview: 'Admin Overview',
  venues: 'Venue Approvals',
  owners: 'Owner Management',
  users: 'User Management',
  staff: 'Staff Management',
};

export default function AdminDashboard() {
  const [section, setSection] = useState<Section>('overview');

  return (
    <DashboardLayout
      role="admin"
      activeSection={section}
      onSectionChange={(s) => setSection(s as Section)}
      title={SECTION_TITLES[section]}
    >
      {section === 'overview' && <AdminDashboardHome onGoToApprovals={() => setSection('venues')} />}
      {section === 'venues' && <VenueApprovals />}
      {section === 'owners' && <OwnerManagement />}
      {section === 'users' && <UserManagement />}
      {section === 'staff' && <AdminStaffManagement />}
    </DashboardLayout>
  );
}
