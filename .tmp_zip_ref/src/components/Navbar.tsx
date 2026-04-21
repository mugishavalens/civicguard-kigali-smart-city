import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, LogOut, User, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-accent p-2 rounded-lg transition-transform group-hover:rotate-12">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-text-main">
            Civic<span className="text-accent">Guard</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link 
                to={profile?.role === 'admin' ? '/admin' : '/citizen'} 
                className="flex items-center gap-2 text-text-light hover:text-accent font-medium transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <div className="h-4 w-[1px] bg-border" />
              <div className="flex items-center gap-3 bg-main-bg px-3 py-1.5 rounded-full border border-border">
                <User className="w-4 h-4 text-text-light" />
                <span className="text-sm font-medium text-text-main hidden sm:inline">
                  {profile?.name}
                </span>
                <button 
                  onClick={handleLogout}
                  className="p-1 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <Link to="/login" className="btn-primary">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
