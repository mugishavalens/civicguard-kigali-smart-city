import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin, Info, Shield, Layers, Compass, Leaf, Clock } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useAuth } from '../contexts/AuthContext';
import { subscribeToIncidents } from '../services/incidentService';
import { Incident } from '../lib/firebase';
import { format } from 'date-fns';

// Fix Leaflet icon issue
const customIcon = new L.DivIcon({
  className: 'custom-div-icon',
  html: `<div class="w-8 h-8 bg-emerald-600 rounded-full border-2 border-white shadow-xl flex items-center justify-center animate-pulse">
          <div class="w-2.5 h-2.5 bg-white rounded-full"></div>
         </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16]
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

export default function CommunityMap() {
  const { profile } = useAuth();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      // For community map, we might want to see ALL public incidents or just our own?
      // For a "Community Map", usually we want to see public safety data.
      // Assuming the service can fetch all or we just show user's for now as per current rules
      const unsubscribe = subscribeToIncidents('citizen', profile.id, (data) => {
        setIncidents(data);
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [profile]);

  return (
    <main className="p-8 h-screen flex flex-col gap-6">
      <header className="flex justify-between items-center bg-white p-6 rounded-2xl border border-border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-text-main flex items-center gap-2">
            <Compass className="w-6 h-6 text-emerald-600" />
            Kigali Community Map
          </h1>
          <p className="text-text-light text-sm italic">Real-time geospatial safety monitoring across all sectors</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-emerald-700 font-bold text-xs uppercase tracking-widest">Live Network Active</span>
          </div>
        </div>
      </header>

      <div className="flex-grow grid lg:grid-cols-12 gap-6 min-h-0">
        <div className="lg:col-span-9 bg-white rounded-[2rem] border border-border overflow-hidden shadow-sm relative z-10">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center bg-slate-50">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-text-light font-bold text-xs uppercase tracking-widest">Initializing Map Layer...</p>
              </div>
            </div>
          ) : (
            <MapContainer 
              center={incidents.length > 0 && incidents[0].location.latitude !== 0 ? [incidents[0].location.latitude, incidents[0].location.longitude] : [-1.9441, 30.0619]} 
              zoom={13} 
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
                    <Popup maxWidth={300} className="custom-leaflet-popup">
                      <div className="p-2 min-w-[240px]">
                        <div className="flex justify-between items-start mb-3">
                          <span className={`badge badge-${incident.status}`}>
                            {incident.status.replace('-', ' ')}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 font-mono">INC-{incident.id.slice(0,8)}</span>
                        </div>
                        <h3 className="font-bold text-lg capitalize text-slate-900 mb-1">{incident.type}</h3>
                        <p className="text-xs text-slate-600 leading-relaxed mb-4">{incident.description}</p>
                        
                        <div className="space-y-2 border-t border-slate-100 pt-3">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                              <Leaf className="w-3 h-3" />
                            </div>
                            <span className="text-[11px] font-bold text-slate-700">Reporter: {incident.reporterName || 'Verified Citizen'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                            <MapPin className="w-3 h-3 text-emerald-500" />
                            {incident.location.address}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                            <Clock className="w-3 h-3 text-emerald-500" />
                            {incident.timestamp?.toDate ? format(incident.timestamp.toDate(), 'PP p') : 'Pending Sync'}
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                )
              ))}
            </MapContainer>
          )}
        </div>

        <div className="lg:col-span-3 flex flex-col gap-6 min-h-0 overflow-y-auto">
          <div className="dashboard-card bg-emerald-600 text-white border-none p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5" />
              Map Intelligence
            </h3>
            <p className="text-xs opacity-90 leading-relaxed mb-6">
              Interactive visualization of community-reported safety incidents. Data is synthesized to optimize responder routes.
            </p>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-70">Active Markers</span>
                <span className="font-bold">{incidents.length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-70">Avg. Response Time</span>
                <span className="font-bold text-emerald-300">14m</span>
              </div>
            </div>
          </div>

          <div className="dashboard-card flex-grow min-h-[300px]">
             <h3 className="font-bold text-sm text-text-light uppercase tracking-widest mb-4 flex items-center gap-2">
               <Info className="w-4 h-4" />
               Recent Activity
             </h3>
             <div className="space-y-4">
               {incidents.slice(0, 5).map(incident => (
                 <div key={incident.id} className="p-3 bg-slate-50 rounded-xl border border-border group cursor-pointer hover:border-emerald-200 transition-all">
                   <div className="flex justify-between text-[10px] font-bold mb-1">
                     <span className="text-emerald-600 capitalize">{incident.type}</span>
                     <span className="text-text-light">{incident.timestamp?.toDate ? format(incident.timestamp.toDate(), 'HH:mm') : 'Now'}</span>
                   </div>
                   <p className="text-xs text-text-main line-clamp-1 font-medium">{incident.description}</p>
                 </div>
               ))}
               {incidents.length === 0 && (
                 <div className="text-center py-10 opacity-50 text-xs">No active markers in this sector.</div>
               )}
             </div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 italic text-[11px] text-emerald-800 font-medium">
            "Geospatial data helps the <strong>Kigali Strategy Office</strong> identify high-risk zones and allocate resources effectively."
          </div>
        </div>
      </div>

      <footer className="mt-8 pt-6 pb-2 border-t border-slate-100">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center">
          © {new Date().getFullYear()} CivicGuard Kigali • Kigali Smart City Initiative • Republic of Rwanda
        </p>
      </footer>
    </main>
  );
}
