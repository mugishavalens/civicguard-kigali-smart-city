import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, LogOut, User, LayoutDashboard, MoonStar, SunMedium } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usePreferences } from '../contexts/PreferencesContext';

export default function Navbar() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const { language, setLanguage, theme, toggleTheme, t } = usePreferences();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="border-b border-border bg-panel/85 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 min-h-16 py-3 flex flex-wrap items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-accent p-2 rounded-lg transition-transform group-hover:rotate-12">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-text-main">
            Civic<span className="text-accent">Guard</span>
          </span>
        </Link>

        <div className="flex flex-wrap items-center justify-center gap-5 text-sm font-medium text-text-main">
          <a href="/">{t('navHome')}</a>
          <a href={user ? '/citizen' : '/login'}>{t('navReport')}</a>
          <a href="/#about">{t('navAbout')}</a>
          <a href="/#contact">{t('navContact')}</a>
          <Link to={user ? (profile?.role === 'admin' ? '/admin' : '/citizen') : '/login'}>{t('navDashboard')}</Link>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-light">
            <span>{t('navLanguage')}</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'fr' | 'rw')}
              className="input-field !w-auto !py-2 !px-3 !text-xs !font-bold"
            >
              <option value="en">EN</option>
              <option value="fr">FR</option>
              <option value="rw">RW</option>
            </select>
          </div>

          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-light"
            title={t('navMode')}
          >
            <span>{t('navMode')}</span>
            <span className="w-10 h-10 rounded-full border border-border bg-main-bg flex items-center justify-center">
              {theme === 'dark' ? <SunMedium className="w-4 h-4 text-accent" /> : <MoonStar className="w-4 h-4 text-accent" />}
            </span>
          </button>

          {user ? (
            <>
              <Link 
                to={profile?.role === 'admin' ? '/admin' : '/citizen'} 
                className="flex items-center gap-2 text-text-light hover:text-accent font-medium transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">{t('navDashboard')}</span>
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
                  title={t('navSignOut')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <Link to="/login" className="btn-primary">
              {t('navSignIn')}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
