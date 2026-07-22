import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PreferencesProvider } from './contexts/PreferencesContext';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import CitizenDashboard from './components/CitizenDashboard';
import CommunityMap from './components/CommunityMap';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import ErrorBoundary from './components/ErrorBoundary';

const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role?: 'citizen' | 'admin' }) => {
  const { user, profile, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>
  );
  
  if (!user) return <Navigate to="/login" />;
  
  if (role && profile?.role !== role) {
    return <Navigate to={profile?.role === 'admin' ? '/admin' : '/citizen'} />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  const { user, profile } = useAuth();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/citizen/*"
            element={
              <ProtectedRoute role="citizen">
                <Routes>
                  <Route index element={<CitizenDashboard />} />
                  <Route path="map" element={<CommunityMap />} />
                </Routes>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute role="admin">
                <Routes>
                  <Route path="*" element={<AdminDashboard />} />
                </Routes>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              user ? (
                <Navigate to={profile?.role === 'admin' ? '/admin' : '/citizen'} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <PreferencesProvider>
      <AuthProvider>
        <Router>
          <ErrorBoundary>
            <AppRoutes />
          </ErrorBoundary>
        </Router>
      </AuthProvider>
    </PreferencesProvider>
  );
}
