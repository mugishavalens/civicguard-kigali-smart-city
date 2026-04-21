import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  MapPin, 
  Users, 
  PieChart, 
  ShieldCheck, 
  FileText, 
  History,
  LogOut,
  Plus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  role: 'citizen' | 'admin';
  onNewReport?: () => void;
}

export default function Sidebar({ role, onNewReport }: SidebarProps) {
  const { logout, profile } = useAuth();

  const links = role === 'admin' ? [
    { to: '/admin', icon: BarChart3, label: 'Command Center' },
    { to: '/admin/incidents', icon: FileText, label: 'Incident Reports' },
    { to: '/admin/users', icon: Users, label: 'Citizen Registry' },
    { to: '/admin/analytics', icon: PieChart, label: 'System Analytics' },
    { to: '/admin/security', icon: ShieldCheck, label: 'Security Logs' },
  ] : [
    { to: '/citizen', icon: History, label: 'My Reports' },
    { to: '/citizen/map', icon: MapPin, label: 'Community Map' },
  ];

  return (
    <aside className="w-64 bg-side-bg text-white h-screen fixed left-0 top-0 flex flex-col p-6 z-50">
      <div className="flex items-center gap-3 mb-10 group cursor-pointer">
        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center transition-transform group-hover:rotate-12 group-hover:bg-accent group-hover:text-white">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-extrabold tracking-tight leading-tight">CivicGuard</span>
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Kigali Smart City</span>
        </div>
      </div>

      {role === 'citizen' && (
        <button 
          onClick={onNewReport}
          className="w-full bg-accent hover:bg-accent/90 text-white rounded-xl py-3 px-4 font-bold text-sm flex items-center justify-center gap-2 mb-8 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          File New Report
        </button>
      )}

      <nav className="flex-grow">
        <ul className="space-y-1">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink 
                to={link.to}
                end
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors
                  ${isActive ? 'bg-white/10 text-accent font-bold' : 'text-text-light hover:bg-white/5 hover:text-white'}
                `}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto space-y-4">
        <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${role === 'admin' ? 'bg-amber-500/20 text-amber-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Access Level</span>
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {role === 'admin' ? 'Authorized Admin' : 'Verified Citizen'}
            </span>
          </div>
        </div>

        <div className="mb-6 p-4 rounded-xl bg-white/5 text-[11px] border border-white/5">
          <p className="opacity-50 mb-2 uppercase tracking-widest font-bold">System Status</p>
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-status-resolved shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            Production v2.4.0
          </div>
        </div>

        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-text-light hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
