import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Shield, MapPin, BarChart3, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';
import landingPhoto from '../assets/landing-photo.svg';
import Footer from './Footer';
import { usePreferences } from '../contexts/PreferencesContext';

export default function LandingPage() {
  const { t } = usePreferences();

  return (
    <div className="bg-main-bg">
      {/* Hero Section */}
      <section className="relative pt-20 pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="hero-pill mb-6">{t('heroBadge')}</span>
              <h1 className="text-6xl font-display font-bold text-text-main leading-[1.1] mb-6">
                {t('heroTitleLine1')} <br />
                <span className="text-accent italic">{t('heroTitleAccent')}</span> {t('heroTitleLine2')}
              </h1>
              <p className="text-xl text-text-light mb-10 max-w-lg leading-relaxed">
                {t('heroText')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/login"
                  className="bg-accent hover:opacity-90 text-white rounded-xl h-14 min-w-[180px] px-8 flex items-center justify-center gap-2 text-lg font-bold shadow-xl shadow-accent/20 transition-all"
                >
                  {t('heroPrimary')} <ChevronRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="btn-secondary h-14 min-w-[200px] max-w-[260px] px-8 rounded-xl font-bold text-lg flex items-center justify-center text-center"
                  style={{ whiteSpace: 'normal', fontWeight: 700 }}
                >
                  {t('heroSecondary')}
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-square bg-panel-soft rounded-[2rem] overflow-hidden rotate-3 shadow-2xl relative">
                <img
                  src="https://www.safarisrwandasafari.com/wp-content/uploads/2022/09/Kigali-Citys-1.jpg"
                  alt="City Safety"
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-accent/40 to-transparent" />
              </div>

              {/* Floating Stat Cards */}
              <div className="absolute -bottom-6 -left-6 bg-panel p-6 rounded-2xl shadow-xl border border-border flex items-center gap-4 max-w-xs animate-bounce-slow">
                <div className="bg-accent-soft p-3 rounded-xl">
                  <CheckCircle2 className="w-6 h-6 text-accent-deep" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-text-main">12,402</div>
                  <div className="text-sm text-text-light font-medium">{t('featureUpdates')}</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="about" className="py-24 bg-main-bg border-y border-border">
        <div className="max-w-7xl mx-auto px-4 text-center mb-16">
          <h2 className="text-3xl font-display font-bold text-text-main mb-4">{t('trustTitle')}</h2>
          <p className="text-text-light max-w-2xl mx-auto">{t('trustText')}</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
          {[
            { icon: Shield, title: t('featureReports'), desc: t('featureReportsText') },
            { icon: MapPin, title: t('featureGeo'), desc: t('featureGeoText') },
            { icon: Clock, title: t('featureUpdates'), desc: t('featureUpdatesText') }
          ].map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="bg-panel p-8 rounded-2xl border border-border shadow-sm"
            >
              <div className="bg-accent-soft w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <f.icon className="w-7 h-7 text-accent-deep" />
              </div>
              <h3 className="text-xl font-bold text-text-main mb-3">{f.title}</h3>
              <p className="text-text-light leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Vision 2026 Section */}
      <section id="contact" className="py-24 bg-main-bg overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-accent-soft rounded-full blur-3xl opacity-50" />
            <h2 className="text-4xl font-display font-bold text-text-main mb-6 relative z-10 leading-tight">
              {t('visionTitle')}
            </h2>
            <div className="space-y-6 relative z-10">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-accent-soft rounded-xl flex items-center justify-center text-accent-deep shrink-0 font-bold">01</div>
                <div>
                  <h4 className="font-bold text-lg">{t('visionOne')}</h4>
                  <p className="text-text-light text-sm">{t('visionOneText')}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-accent-soft rounded-xl flex items-center justify-center text-accent-deep shrink-0 font-bold">02</div>
                <div>
                  <h4 className="font-bold text-lg">{t('visionTwo')}</h4>
                  <p className="text-text-light text-sm">{t('visionTwoText')}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-accent-soft rounded-xl flex items-center justify-center text-accent-deep shrink-0 font-bold">03</div>
                <div>
                  <h4 className="font-bold text-lg">{t('visionThree')}</h4>
                  <p className="text-text-light text-sm">{t('visionThreeText')}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#102728] dark:bg-[#091314] rounded-[3rem] p-12 text-white relative shadow-2xl shadow-emerald-900/20">
            <div className="absolute top-0 right-0 p-8">
              <Shield className="w-12 h-12 text-emerald-500 opacity-20" />
            </div>
            <div className="text-emerald-500 font-bold text-sm tracking-widest uppercase mb-4">{t('impactLabel')}</div>
            <p className="text-3xl font-display font-medium mb-8 leading-relaxed">
              "{t('impactQuote')}"
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#14292a] rounded-full border border-[#244041]" />
              <div>
                <div className="font-bold">Strategy Office</div>
                <div className="text-xs text-[#96afb1] font-medium">Kigali Smart City Initiative</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
