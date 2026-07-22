import React, { useState, useEffect } from 'react';
import { MapPin, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { subscribeToIncidents, reportIncident, classifySeverity } from '../services/incidentService';
import { Incident, IncidentType, District, Severity } from '../lib/firebase';
import { format } from 'date-fns';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import Footer from './Footer';

const SEVERITY_STYLES: Record<Severity, { label: string; classes: string }> = {
  P1: { label: 'P1 — Critical', classes: 'bg-red-100 text-red-700 border-red-200' },
  P2: { label: 'P2 — High', classes: 'bg-orange-100 text-orange-700 border-orange-200' },
  P3: { label: 'P3 — Normal', classes: 'bg-blue-100 text-blue-700 border-blue-200' },
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
  iconAnchor: [12, 12],
});

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    if (lat !== 0) map.setView([lat, lng], 14);
  }, [lat, lng, map]);
  return null;
}

const KIGALI_CENTER: [number, number] = [-1.9441, 30.0619];

export default function CitizenDashboard() {
  const { profile } = useAuth();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | Incident['status']>('all');

  const [formData, setFormData] = useState({
    type: 'other' as IncidentType,
    district: 'Gasabo' as District,
    address: '',
    description: '',
    latitude: 0,
    longitude: 0,
  });
  const [locLoading, setLocLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (profile) {
      const unsubscribe = subscribeToIncidents('citizen', profile.id, (data) => {
        setIncidents(data);
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [profile]);

  const filteredIncidents = incidents.filter((i) => statusFilter === 'all' || i.status === statusFilter);
  const activeCases = incidents.filter((i) => i.status === 'pending' || i.status === 'in-progress').length;

  const handleGetLocation = () => {
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData((prev) => ({
          ...prev,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          address: prev.address || 'Current location',
        }));
        setLocLoading(false);
      },
      () => {
        alert('Could not detect location. Please enter the address manually.');
        setLocLoading(false);
      },
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSubmitting(true);
    try {
      await reportIncident({
        type: formData.type,
        description: formData.description,
        location: {
          latitude: formData.latitude,
          longitude: formData.longitude,
          address: formData.address || 'Location provided via report',
          district: formData.district,
        },
        reporterId: profile.id,
        reporterName: profile.name,
      });
      setFormData({ type: 'other', district: 'Gasabo', address: '', description: '', latitude: 0, longitude: 0 });
    } catch (err) {
      alert('Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  const severity = classifySeverity(formData.type);
  const mapCenter: [number, number] = formData.latitude !== 0 ? [formData.latitude, formData.longitude] : KIGALI_CENTER;

  return (
    <div className="bg-main-bg">
      <section className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 items-center px-4 sm:px-6 pt-14 pb-6 max-w-7xl mx-auto">
        <div>
          <span className="hero-pill">Citizen dashboard</span>
          <h1 className="flex flex-col font-bold leading-[0.95] tracking-tight mt-6 mb-4 text-[clamp(2.75rem,6vw,4.5rem)]">
            Report local
            <span className="text-accent italic">safety incidents</span>
          </h1>
          <p className="text-text-light max-w-lg text-lg leading-relaxed">
            Report local safety incidents and follow every update.
          </p>
          <p className="mt-4 font-medium text-text-light">
            Logged in as citizen: <span className="text-text-main font-bold">{profile?.name}</span>
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-md mt-8">
            <div className="stat-box">
              <strong>{incidents.length}</strong>
              <span>Reports filed</span>
            </div>
            <div className="stat-box">
              <strong>{activeCases}</strong>
              <span>Active cases</span>
            </div>
          </div>
        </div>
        <div className="rounded-[2rem] overflow-hidden shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1489493887464-892be6d1daae?auto=format&fit=crop&w=1500&q=80"
            alt="City neighborhood street used for community safety monitoring"
            className="w-full min-h-[320px] lg:min-h-[420px] object-cover"
          />
        </div>
      </section>

      <section className="grid lg:grid-cols-[0.9fr_1.1fr] gap-6 items-start px-4 sm:px-6 pb-16 max-w-7xl mx-auto">
        <div className="grid gap-4">
          <article className="surface-card" id="report-form">
            <div className="mb-4">
              <p className="text-accent-deep font-bold text-sm uppercase tracking-wide mb-1">New incident report</p>
              <h2 className="text-xl font-bold text-text-main">Provide accurate details so the city team can respond faster.</h2>
            </div>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="field">
                <label>Incident type</label>
                <select
                  className="input-field"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as IncidentType })}
                  required
                >
                  <option value="fire">Fire / Burning</option>
                  <option value="medical">Medical Emergency</option>
                  <option value="crime">Suspicious Activity</option>
                  <option value="traffic">Traffic Accident</option>
                  <option value="utilities">Utility Outage</option>
                  <option value="other">Other / General</option>
                </select>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="field">
                  <label>District</label>
                  <select
                    className="input-field"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value as District })}
                    required
                  >
                    <option value="Gasabo">Gasabo</option>
                    <option value="Nyarugenge">Nyarugenge</option>
                    <option value="Kicukiro">Kicukiro</option>
                  </select>
                </div>
                <div className="field">
                  <label>Location</label>
                  <div className="flex gap-2">
                    <input
                      className="input-field"
                      type="text"
                      placeholder="Kimironko Sector"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={handleGetLocation}
                      disabled={locLoading}
                      className="shrink-0 px-3 rounded-2xl bg-accent-soft text-accent-deep border border-accent/20 text-xs font-bold uppercase tracking-wide"
                    >
                      {locLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'GPS'}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-text-light uppercase tracking-widest">Auto-classified severity:</span>
                <SeverityBadge severity={severity} />
              </div>
              <div className="field">
                <label>Description</label>
                <textarea
                  className="input-field"
                  rows={6}
                  placeholder="Describe what happened, when, and any immediate risks."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-2xl bg-accent text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit incident'}
              </button>
            </form>
          </article>

          <article className="surface-card grid gap-4">
            <div>
              <p className="text-accent-deep font-bold text-sm uppercase tracking-wide mb-1">Location preview</p>
              <h2 className="text-xl font-bold text-text-main">Map view of selected incident area.</h2>
            </div>
            <div className="rounded-2xl overflow-hidden border border-border min-h-[320px] bg-panel-soft">
              <MapContainer center={mapCenter} zoom={formData.latitude !== 0 ? 14 : 12} className="h-[320px] w-full">
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <RecenterMap lat={formData.latitude} lng={formData.longitude} />
                {formData.latitude !== 0 && <Marker position={mapCenter} icon={customIcon} />}
              </MapContainer>
            </div>
            <p className="text-text-light text-sm">
              {formData.latitude !== 0
                ? `Coordinates locked: ${formData.latitude.toFixed(4)}, ${formData.longitude.toFixed(4)}`
                : 'Type a location or use GPS to focus the map around Kigali.'}
            </p>
          </article>
        </div>

        <article className="surface-card">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <p className="text-accent-deep font-bold text-sm uppercase tracking-wide mb-1">My report status</p>
              <h2 className="text-xl font-bold text-text-main">Track the lifecycle of each incident you submitted.</h2>
            </div>
            <select
              className="input-field w-auto min-w-[9rem]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            >
              <option value="all">All</option>
              <option value="pending">Submitted</option>
              <option value="in-progress">In Review</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div className="grid gap-4">
            {loading ? (
              <div className="text-center py-12 text-text-light">Loading...</div>
            ) : filteredIncidents.length === 0 ? (
              <div className="text-center py-12 text-text-light font-medium">No reports filed yet.</div>
            ) : (
              filteredIncidents.map((incident) => (
                <div key={incident.id} className="surface-card !shadow-none !p-5">
                  <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
                    <h3 className="font-bold text-lg capitalize">{incident.type}</h3>
                    <div className="flex items-center gap-2">
                      <SeverityBadge severity={incident.severity} />
                      <span className={`badge badge-${incident.status}`}>{incident.status.replace('-', ' ')}</span>
                    </div>
                  </div>
                  <p className="text-text-light leading-relaxed">{incident.description}</p>
                  <div className="flex items-center justify-between gap-3 flex-wrap mt-3">
                    <span className="inline-flex items-center gap-1.5 text-xs text-text-light font-medium">
                      <MapPin className="w-3.5 h-3.5" /> {incident.location.address}
                    </span>
                    <span className="text-xs text-text-light font-medium">
                      {incident.timestamp?.toDate ? format(incident.timestamp.toDate(), 'PP p') : 'Just now'}
                    </span>
                  </div>
                  {incident.adminComment && (
                    <div className="mt-3 p-3 rounded-xl bg-accent-soft border border-accent/15 flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-accent-deep shrink-0 mt-0.5" />
                      <p className="text-sm text-text-main">{incident.adminComment}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </article>
      </section>

      <Footer />
    </div>
  );
}
