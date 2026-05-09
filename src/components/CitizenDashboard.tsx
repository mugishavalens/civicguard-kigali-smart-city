import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Shield,
  MapPin, 
  Clock, 
  Leaf,
  Info,
  AlertCircle, 
  CheckCircle2, 
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { subscribeToIncidents } from '../services/incidentService';
import { Incident, Severity } from '../lib/firebase';
import { format } from 'date-fns';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { List, Map as MapIcon } from 'lucide-react';

const SEVERITY_STYLES: Record<Severity, { label: string; classes: string }> = {
  P1: { label: 'P1 — Critical', classes: 'bg-red-100 text-red-700 border-red-200' },
  P2: { label: 'P2 — High',     classes: 'bg-orange-100 text-orange-700 border-orange-200' },
  P3: { label: 'P3 — Normal',   classes: 'bg-blue-100 text-blue-700 border-blue-200' },
};

function SeverityBadge({ severity }: { severity?: Severity }) {
  const s = severity ?? 'P3';
  const style = SEVERITY_STYLES[s];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${style.classes}`}>
      {style.label}
    </span>
  );
}

const customIcon = new L.DivIcon({
  className: 'custom-div-icon',
  html: `<div class="w-6 h-6 bg-accent rounded-full border-2 border-white shadow-lg flex items-center justify-center">
          <div class="w-2 h-2 bg-white rounded-full"></div>
         </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

function FitBounds({ incidents }: { incidents: Incident[] }) {
  const map = useMap();

  useEffect(() => {
    if (incidents.length > 0) {
      const validPoints = incidents
        .filter(i => i.location.latitude !== 0)
        .map(i => [i.location.latitude, i.location.longitude] as [number, number]);

      if (validPoints.length > 0) {
        const bounds = L.latLngBounds(validPoints);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      }
    }
  }, [incidents, map]);

  return null;
}

export default function CitizenDashboard({ 
  onNewReport 
}: { 
  onNewReport?: () => void 
}) {
  const { profile } = useAuth();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  useEffect(() => {
    if (profile) {
      const unsubscribe = subscribeToIncidents('citizen', profile.id, (data) => {
        setIncidents(data);
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [profile]);

  return (
    <main className="p-8 flex flex-col gap-8 min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-main flex items-center gap-2">
            <Leaf className="w-6 h-6 text-emerald-600" />
            Citizen Safe-Hub
          </h1>
          <p className="text-text-light text-sm">Kigali Smart City Initiative • Local Community Safety</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-bold text-sm text-text-main">{profile?.name}</p>
            <p className="text-xs text-text-light uppercase font-bold tracking-wider">Citizen Reporter</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center font-bold text-slate-500">
            {profile?.name[0]}
          </div>
        </div>
      </header>

      <div className="stats-grid">
        <StatCard title="Total Submitted" value={incidents.length} />
        <StatCard title="Awaiting Review" value={incidents.filter(i => i.status === 'pending').length} color="text-status-pending" />
        <StatCard title="Being Resolved" value={incidents.filter(i => i.status === 'in-progress').length} color="text-status-active" />
        <StatCard title="Resolved" value={incidents.filter(i => i.status === 'resolved').length} color="text-status-resolved" />
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8">
          <div className="dashboard-card overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <h2 className="font-bold text-lg text-text-main">Report History</h2>
                <div className="flex bg-main-bg p-1 rounded-lg border border-border">
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-accent' : 'text-text-light hover:text-text-main'}`}
                    title="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setViewMode('map')}
                    className={`p-1.5 rounded-md transition-all ${viewMode === 'map' ? 'bg-white shadow-sm text-accent' : 'text-text-light hover:text-text-main'}`}
                    title="Map View"
                  >
                    <MapIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <button 
                onClick={onNewReport}
                className="btn-primary text-xs flex items-center gap-2 bg-emerald-600"
              >
                <Plus className="w-4 h-4" />
                New Incident
              </button>
            </div>

            {viewMode === 'list' ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-xs font-semibold text-text-light uppercase">Incident ID</th>
                    <th className="pb-3 text-xs font-semibold text-text-light uppercase">Type</th>
                    <th className="pb-3 text-xs font-semibold text-text-light uppercase text-center">Severity</th>
                    <th className="pb-3 text-xs font-semibold text-text-light uppercase text-center">Status</th>
                    <th className="pb-3 text-xs font-semibold text-text-light uppercase">Timestamp</th>
                    <th className="pb-3 text-xs font-semibold text-text-light uppercase text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-text-light">Loading...</td>
                    </tr>
                  ) : incidents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-text-light font-medium">
                        No reports filed yet.
                      </td>
                    </tr>
                  ) : (
                    incidents.map((incident) => (
                      <tr 
                        key={incident.id} 
                        className="hover:bg-slate-50 transition-colors cursor-pointer group"
                        onClick={() => setSelectedIncident(incident)}
                      >
                        <td className="py-4 font-bold text-sm">INC-{incident.id.slice(0, 4)}</td>
                        <td className="py-4 text-sm text-text-main font-medium capitalize">{incident.type}</td>
                        <td className="py-4 text-center">
                          <SeverityBadge severity={incident.severity} />
                        </td>
                        <td className="py-4 text-center">
                          <span className={`badge badge-${incident.status}`}>
                            {incident.status.replace('-', ' ')}
                          </span>
                        </td>
                        <td className="py-4 text-xs text-text-light font-medium">
                          {incident.timestamp?.toDate ? format(incident.timestamp.toDate(), 'PP p') : 'Just now'}
                        </td>
                        <td className="py-4 text-right">
                          <button className="text-accent text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            ) : (
              <div className="h-[500px] w-full rounded-xl overflow-hidden relative z-10 border border-border">
                <MapContainer 
                  center={incidents.length > 0 && incidents[0].location.latitude !== 0 ? [incidents[0].location.latitude, incidents[0].location.longitude] : [-1.9441, 30.0619]} 
                  zoom={incidents.length > 0 ? 12 : 10} 
                  className="h-full w-full"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <FitBounds incidents={incidents} />
                  {incidents.map((incident) => (
                    incident.location.latitude !== 0 && (
                      <Marker 
                        key={incident.id} 
                        position={[incident.location.latitude, incident.location.longitude]}
                        icon={customIcon}
                      >
                        <Popup>
                          <div className="p-1 min-w-[200px]">
                            <div className="flex justify-between items-start mb-2">
                              <div className={`badge badge-${incident.status}`}>
                                {incident.status.replace('-', ' ')}
                              </div>
                              <span className="text-[10px] font-bold text-slate-400">INC-{incident.id.slice(0,4)}</span>
                            </div>
                            <h3 className="font-bold text-sm capitalize mb-1 text-slate-900">{incident.type}</h3>
                            <p className="text-xs text-slate-600 mb-3">{incident.description}</p>
                            
                            <div className="border-t border-slate-100 pt-3 flex flex-col gap-1.5">
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center">
                                  <Leaf className="w-2.5 h-2.5 text-emerald-600" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Reporter: {incident.reporterName || 'Anonymous'}</span>
                              </div>
                              <p className="text-[10px] text-slate-400 font-medium">Recorded: {incident.timestamp?.toDate ? format(incident.timestamp.toDate(), 'PP p') : 'Recently'}</p>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    )
                  ))}
                </MapContainer>
              </div>
            )}
          </div>
        </div>

        {/* Kigali Initiatives / Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="dashboard-card bg-emerald-600 text-white border-none relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <Info className="w-5 h-5" />
                Smart City Guidance
              </h3>
              <p className="text-sm opacity-90 leading-relaxed mb-6">
                Your reports directly fuel the <strong>Local Community Safety Monitoring</strong> initiative. Accurate reporting helps district response teams optimize deployment.
              </p>
              <div className="space-y-4">
                <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">Weekly Focus</div>
                  <div className="text-sm font-bold">Waste Management Integrity</div>
                </div>
                <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">Latest Update</div>
                  <div className="text-sm font-bold">Emergency response time reduced by 12%</div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          </div>

          <div className="dashboard-card">
            <h3 className="font-bold text-slate-900 mb-4">Quick Vision</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold font-display">Resilience</div>
                  <p className="text-[11px] text-slate-500">Building community-led safety networks across 35 sectors.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold font-display">Precision</div>
                  <p className="text-[11px] text-slate-500">Real-time geospatial mapping for instant response coordination.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedIncident && (
          <IncidentViewer 
            incident={selectedIncident} 
            onClose={() => setSelectedIncident(null)} 
          />
        )}
      </AnimatePresence>

      <footer className="mt-auto pt-12 pb-4 border-t border-slate-100">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center">
          © {new Date().getFullYear()} CivicGuard Kigali • Kigali Smart City Initiative • Republic of Rwanda
        </p>
      </footer>
    </main>
  );
}

function IncidentViewer({ incident, onClose }: { incident: Incident, onClose: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative text-text-main"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-slate-50 px-8 py-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${
              incident.status === 'resolved' ? 'bg-status-resolved' :
              incident.status === 'in-progress' ? 'bg-accent' :
              incident.status === 'rejected' ? 'bg-red-500' : 'bg-status-pending'
            }`}>
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Incident Details</h2>
              <p className="text-text-light text-xs font-bold uppercase tracking-widest">INC-{incident.id.slice(0, 8)}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-border"
          >
            <Plus className="w-6 h-6 rotate-45 text-text-light" />
          </button>
        </div>

        <div className="p-8 grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-bold text-text-light uppercase tracking-widest mb-1">Status</p>
              <span className={`badge badge-${incident.status}`}>
                {incident.status.replace('-', ' ')}
              </span>
            </div>
            
            <div>
              <p className="text-[10px] font-bold text-text-light uppercase tracking-widest mb-1">Type</p>
              <p className="text-sm font-bold capitalize">{incident.type}</p>
            </div>

            <div>
              <p className="text-[10px] font-bold text-text-light uppercase tracking-widest mb-1">Timestamp</p>
              <div className="flex items-center gap-2 text-sm font-medium">
                <Clock className="w-4 h-4 text-text-light" />
                {incident.timestamp?.toDate ? format(incident.timestamp.toDate(), 'PPPP p') : 'Just now'}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-text-light uppercase tracking-widest mb-1">Location</p>
              <div className="flex items-start gap-2 text-sm font-medium">
                <MapPin className="w-4 h-4 text-text-light mt-0.5" />
                <span>{incident.location.address}</span>
              </div>
              {incident.location.latitude !== 0 && (
                <p className="text-[10px] text-accent mt-1 ml-6 font-bold">GPS: {incident.location.latitude.toFixed(4)}, {incident.location.longitude.toFixed(4)}</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-bold text-text-light uppercase tracking-widest mb-2">Description</p>
              <div className="p-4 bg-slate-50 rounded-2xl border border-border italic text-sm leading-relaxed">
                "{incident.description}"
              </div>
            </div>

            {incident.adminComment && (
              <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">District Response</p>
                </div>
                <p className="text-sm font-medium leading-relaxed">
                  {incident.adminComment}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="px-8 py-6 bg-slate-50 border-t border-border flex justify-end">
          <button 
            onClick={onClose}
            className="btn-secondary px-8"
          >
            Close Viewer
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatCard({ title, value, color }: any) {
  return (
    <div className="bg-white p-5 rounded-xl border border-border shadow-sm">
      <div className="text-[11px] font-bold text-text-light uppercase tracking-wider mb-2">{title}</div>
      <div className={`text-2xl font-bold ${color || 'text-text-main'}`}>{value}</div>
    </div>
  );
}
