import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LandingPage from './components/LandingPage';
import CitizenDashboard from './components/CitizenDashboard';
import CommunityMap from './components/CommunityMap';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import IncidentForm from './components/IncidentForm';
import { useState } from 'react';

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
  const [isReportFormOpen, setIsReportFormOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {!user && <Navbar />}
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/citizen/*" 
            element={
              <ProtectedRoute role="citizen">
                <div className="flex">
                  <Sidebar role="citizen" onNewReport={() => setIsReportFormOpen(true)} />
                  <div className="flex-grow pl-64">
                    <Routes>
                      <Route index element={<CitizenDashboard onNewReport={() => setIsReportFormOpen(true)} />} />
                      <Route path="map" element={<CommunityMap />} />
                    </Routes>
                  </div>
                  <AnimatePresence>
                    {isReportFormOpen && profile && (
                      <IncidentForm 
                        onClose={() => setIsReportFormOpen(false)} 
                        userId={profile.id} 
                        userName={profile.name} 
                      />
                    )}
                  </AnimatePresence>
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute role="admin">
                <div className="flex">
                  <Sidebar role="admin" />
                  <div className="flex-grow pl-64">
                    <Routes>
                      <Route path="*" element={<AdminDashboard />} />
                    </Routes>
                  </div>
                </div>
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
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
