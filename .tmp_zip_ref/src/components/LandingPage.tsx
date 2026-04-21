import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Shield, MapPin, BarChart3, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-semibold mb-6">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Official Kigali Smart City Initiative
              </div>
              <h1 className="text-6xl font-display font-bold text-text-main leading-[1.1] mb-6">
                Kigali <br />
                <span className="text-emerald-600 italic">CivicGuard</span> Portal.
              </h1>
              <p className="text-xl text-text-light mb-10 max-w-lg leading-relaxed">
                Empowering the <strong>Kigali Smart City Initiative</strong>. Connect directly with district authorities to report community safety concerns, utility disruptions, or emergencies in real-time.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/login" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-14 px-8 flex items-center gap-2 text-lg font-bold shadow-xl shadow-emerald-500/20 transition-all">
                  Report Incident <ChevronRight className="w-5 h-5" />
                </Link>
                <Link to="/login" className="btn-secondary h-14 px-8 flex items-center text-lg">
                  Authority Access
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-square bg-slate-100 rounded-[2rem] overflow-hidden rotate-3 shadow-2xl relative">
                <img 
                  src="https://picsum.photos/seed/city/800/800" 
                  alt="City Safety" 
                  className="w-full h-full object-cover grayscale opacity-80"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-accent/40 to-transparent" />
              </div>
              
              {/* Floating Stat Cards */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-border flex items-center gap-4 max-w-xs animate-bounce-slow">
                <div className="bg-emerald-50 p-3 rounded-xl">
                  <CheckCircle2 className="w-6 h-6 text-status-resolved" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-text-main">12,402</div>
                  <div className="text-sm text-text-light font-medium">Incidents Resolved</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-main-bg border-y border-border">
        <div className="max-w-7xl mx-auto px-4 text-center mb-16">
          <h2 className="text-3xl font-display font-bold text-text-main mb-4">Built for Transparency</h2>
          <p className="text-text-light max-w-2xl mx-auto">
            Our platform bridges the gap between citizens and administration with a secure, real-time ecosystem.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
          {[
            { icon: Shield, title: "Verified Reports", desc: "Identity verification ensures every report is authentic and actionable." },
            { icon: MapPin, title: "Geospatial Data", desc: "Precise location tracking helps first responders find the exact site instantly." },
            { icon: Clock, title: "Live Updates", desc: "Citizens receive status updates as their reports move from pending to resolved." }
          ].map((f, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-2xl border border-border shadow-sm"
            >
              <div className="bg-main-bg w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <f.icon className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-text-main mb-3">{f.title}</h3>
              <p className="text-text-light leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Vision 2026 Section */}
      <section className="py-24 bg-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-emerald-100 rounded-full blur-3xl opacity-50" />
            <h2 className="text-4xl font-display font-bold text-text-main mb-6 relative z-10 leading-tight">
              Kigali 2026: <br />
              The <span className="text-emerald-600">Smart City</span> Vision.
            </h2>
            <div className="space-y-6 relative z-10">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0 font-bold">01</div>
                <div>
                  <h4 className="font-bold text-lg">Integrated Monitoring</h4>
                  <p className="text-text-light text-sm">Deployment of IoT sensors across all districts for immediate utility and safety data extraction.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0 font-bold">02</div>
                <div>
                  <h4 className="font-bold text-lg">Community Resilience</h4>
                  <p className="text-text-light text-sm">Training 500+ local response leaders to act on data insights generated by CivicGuard.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0 font-bold">03</div>
                <div>
                  <h4 className="font-bold text-lg">Data Governance</h4>
                  <p className="text-text-light text-sm">Establishing a transparent, blockchain-verified ledger for public accountability in incident response.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative shadow-2xl shadow-emerald-900/20">
            <div className="absolute top-0 right-0 p-8">
              <Shield className="w-12 h-12 text-emerald-500 opacity-20" />
            </div>
            <div className="text-emerald-500 font-bold text-sm tracking-widest uppercase mb-4">Strategic Impact</div>
            <p className="text-3xl font-display font-medium mb-8 leading-relaxed">
              "CivicGuard is not just a reporting tool; it's the digital pulse of Kigali, ensuring no community concern stays unheard."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-800 rounded-full border border-slate-700" />
              <div>
                <div className="font-bold">Strategy Office</div>
                <div className="text-xs text-slate-400 font-medium">Kigali Smart City Initative</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
