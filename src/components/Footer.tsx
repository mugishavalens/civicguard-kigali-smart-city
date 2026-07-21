import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Twitter, Facebook, Instagram, Linkedin, ExternalLink } from 'lucide-react';
import { usePreferences } from '../contexts/PreferencesContext';

export default function Footer() {
  const { t } = usePreferences();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: t('footerTwitter'), icon: Twitter, href: 'https://twitter.com/kigalicity' },
    { name: t('footerFacebook'), icon: Facebook, href: 'https://facebook.com/CityofKigali' },
    { name: t('footerInstagram'), icon: Instagram, href: 'https://instagram.com/city_of_kigali' },
    { name: t('footerLinkedin'), icon: Linkedin, href: 'https://linkedin.com/company/city-of-kigali' },
  ];

  return (
    <footer className="border-t border-border bg-main-bg pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 grid gap-12 md:grid-cols-4 mb-16">
        <div className="md:col-span-1">
          <Link to="/" className="flex items-center gap-2 group mb-6">
            <div className="bg-accent p-2 rounded-xl shadow-lg shadow-accent/20 group-hover:scale-110 transition-transform">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-text-main">
              Civic<span className="text-accent">Guard</span>
            </span>
          </Link>
          <p className="text-sm text-text-light max-w-xs leading-relaxed mb-6">
            {t('footerText')}
          </p>
          <div className="flex gap-4">
            {socialLinks.map((social) => (
              <a 
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-panel-soft flex items-center justify-center text-text-light hover:bg-accent hover:text-white transition-all transform hover:-translate-y-1"
                aria-label={`Follow us on ${social.name}`}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-text-main uppercase tracking-widest mb-6">{t('footerPlatform')}</h3>
          <ul className="grid gap-3 text-sm text-text-light">
            <li><Link to="/" className="hover:text-accent transition-colors">{t('navHome')}</Link></li>
            <li><Link to="/login" className="hover:text-accent transition-colors">{t('navReport')}</Link></li>
            <li><a href="/#about" className="hover:text-accent transition-colors">{t('navAbout')}</a></li>
            <li><a href="/#contact" className="hover:text-accent transition-colors">{t('navContact')}</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-text-main uppercase tracking-widest mb-6">Resources</h3>
          <ul className="grid gap-3 text-sm text-text-light">
            <li><a href="#" className="hover:text-accent transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-accent transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-accent transition-colors">Emergency Contacts</a></li>
            <li><a href="#" className="hover:text-accent transition-colors flex items-center gap-1">Kigali Smart City <ExternalLink className="w-3 h-3" /></a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-text-main uppercase tracking-widest mb-6">Contact Us</h3>
          <div className="text-sm text-text-light space-y-3">
            <p>KN 3 Rd, Kigali, Rwanda</p>
            <p>Email: info@kigalicity.gov.rw</p>
            <p>Toll Free: 3260</p>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-8 mt-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-4">
          <p className="text-sm font-medium text-text-light text-center">
            © {currentYear} CivicGuard Kigali • Developed for the{" "}
            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00A1DE] via-[#FAD201] to-[#20603D]">
              Republic of Rwanda
            </span>
          </p>
          <div className="flex gap-6 text-xs font-bold text-text-light uppercase tracking-widest justify-center">

            <a href="#" className="hover:text-accent transition-colors">Privacy</a>
            <a href="#" className="hover:text-accent transition-colors">Terms</a>
            <a href="#" className="hover:text-accent transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
