import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth, dashboardPath } from './context/AuthContext';
import { Toaster } from './components/ui/sonner';

// Pages
import LandingPage from './pages/LandingPage';
import BrowseVenuesPage from './pages/BrowseVenuesPage';
import VenueDetailPage from './pages/VenueDetailPage';

// Auth pages
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import EventCenterRegistration from './components/EventCenterRegistration';

// Dashboards
import ClientDashboard from './components/dashboards/ClientDashboard';
import StaffDashboard from './components/dashboards/StaffDashboard';
import OwnerDashboard from './components/dashboards/OwnerDashboard';
import AdminDashboard from './components/dashboards/AdminDashboard';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 32, fontFamily: 'monospace', background: '#fee2e2', minHeight: '100vh' }}>
          <h1 style={{ color: '#991b1b', fontSize: 20, marginBottom: 12 }}>
            App crashed — runtime error:
          </h1>
          <pre style={{ color: '#7f1d1d', whiteSpace: 'pre-wrap', fontSize: 13 }}>
            {this.state.error.message}
            {'\n\n'}
            {this.state.error.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function PrivateRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole: string }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 rounded-full border-4 border-blue-600 border-t-transparent" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== allowedRole) return <Navigate to={dashboardPath(user.role)} replace />;
  return <>{children}</>;
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 rounded-full border-4 border-blue-600 border-t-transparent" /></div>;
  if (user) return <Navigate to={dashboardPath(user.role)} replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/browse" element={<BrowseVenuesPage />} />
      <Route path="/venue/:id" element={<VenueDetailPage />} />

      {/* Auth pages (redirect if already logged in) */}
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <RegistrationPage />
          </PublicOnlyRoute>
        }
      />
      <Route path="/register/event-center" element={<EventCenterRegistration />} />

      {/* Protected Dashboards */}
      <Route
        path="/dashboard/client"
        element={
          <PrivateRoute allowedRole="client">
            <ClientDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/staff"
        element={
          <PrivateRoute allowedRole="staff">
            <StaffDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/owner"
        element={
          <PrivateRoute allowedRole="owner">
            <OwnerDashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/dashboard/admin"
        element={
          <PrivateRoute allowedRole="admin">
            <AdminDashboard />
          </PrivateRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
