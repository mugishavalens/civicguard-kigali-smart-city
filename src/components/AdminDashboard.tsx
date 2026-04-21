import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Loader2, 
  Filter, 
  Search, 
  MoreHorizontal,
  ChevronRight,
  TrendingUp,
  BarChart,
  MapPin,
  MessageSquare,
  XCircle,
  BarChart3,
  ShieldCheck,
  Flame,
  Activity,
  ShieldAlert,
  Car,
  Zap,
  HelpCircle,
  UserPlus
} from 'lucide-react';
import { 
  BarChart as ReBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { subscribeToIncidents, updateIncidentStatus } from '../services/incidentService';
import { subscribeToUsers } from '../services/userService';
import { Incident, IncidentStatus, UserProfile } from '../lib/firebase';
import { format } from 'date-fns';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { List, Map as MapIcon } from 'lucide-react';

const customIcon = new L.DivIcon({
  className: 'custom-div-icon',
  html: `<div class="w-6 h-6 bg-emerald-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
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

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'fire':
      return (
        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shadow-sm">
          <Flame className="w-5 h-5" />
        </div>
      );
    case 'medical':
      return (
        <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shadow-sm">
          <Activity className="w-5 h-5" />
        </div>
      );
    case 'crime':
      return (
        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm">
          <ShieldAlert className="w-5 h-5" />
        </div>
      );
    case 'traffic':
      return (
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
          <Car className="w-5 h-5" />
        </div>
      );
    case 'utilities':
      return (
        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shadow-sm">
          <Zap className="w-5 h-5" />
        </div>
      );
    default:
      return (
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 shadow-sm">
          <HelpCircle className="w-5 h-5" />
        </div>
      );
  }
};

export default function AdminDashboard() {
  const { profile } = useAuth();
  const location = useLocation();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<IncidentStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribeIncidents: () => void;
    let unsubscribeUsers: () => void;
    
    if (profile) {
      setError(null);
      unsubscribeIncidents = subscribeToIncidents('admin', profile.id, (data) => {
        setIncidents(data);
        setLoading(false);
      }, (err) => {
        console.error("Subscription error:", err);
        setError(err.message || 'Access Denied: Missing Admin Privileges');
        setLoading(false);
      });

      unsubscribeUsers = subscribeToUsers((data) => {
        setUsers(data);
      });
      
      const timer = setTimeout(() => {
        setLoading(false);
      }, 7000);
      
      return () => {
        if (unsubscribeIncidents) unsubscribeIncidents();
        if (unsubscribeUsers) unsubscribeUsers();
        clearTimeout(timer);
      }
    }
  }, [profile]);

  const stats = useMemo(() => {
    const total = incidents.length;
    const pending = incidents.filter(i => i.status === 'pending').length;
    const resolved = incidents.filter(i => i.status === 'resolved').length;
    const inProgress = incidents.filter(i => i.status === 'in-progress').length;
    
    const types = incidents.reduce((acc: any, curr) => {
      acc[curr.type] = (acc[curr.type] || 0) + 1;
      return acc;
    }, {});

    const chartData = Object.keys(types).map(type => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      count: types[type]
    }));

    const pieData = [
      { name: 'Pending', value: pending, color: '#fbbf24' },
      { name: 'In Progress', value: inProgress, color: '#3b82f6' },
      { name: 'Resolved', value: resolved, color: '#10b981' },
      { name: 'Rejected', value: total - pending - resolved - inProgress, color: '#f43f5e' }
    ];

    const districts = incidents.reduce((acc: any, curr) => {
      const d = curr.location.district || 'Unsorted';
      acc[d] = (acc[d] || 0) + 1;
      return acc;
    }, {});

    const districtData = Object.keys(districts).map(name => ({
      name,
      value: districts[name]
    })).sort((a, b) => b.value - a.value);

    return { total, pending, resolved, inProgress, chartData, pieData, districtData };
  }, [incidents]);

  const filteredIncidents = useMemo(() => {
    return incidents.filter(i => {
      const matchesSearch = i.description.toLowerCase().includes(search.toLowerCase()) || 
                            i.reporterName.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'all' || i.status === filter;
      const matchesType = typeFilter === 'all' || i.type === typeFilter;
      const matchesDistrict = districtFilter === 'all' || (i.location.district || 'Unsorted') === districtFilter;
      return matchesSearch && matchesFilter && matchesType && matchesDistrict;
    });
  }, [incidents, search, filter, typeFilter, districtFilter]);

  const handleUpdateStatus = async (status: IncidentStatus, comment: string) => {
    if (!selectedIncident) return;
    try {
      await updateIncidentStatus(selectedIncident.id, status, comment);
      setSelectedIncident(null);
    } catch (err) {
      alert('Update failed');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-red-100 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Access Synchronization Failed</h2>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            The command center was unable to establish a secure link. {error}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full btn-primary h-12 shadow-lg shadow-emerald-600/20"
          >
            Reconnect to Grid
          </button>
        </div>
      </div>
    );
  }

  if (!profile || (loading && incidents.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest animate-pulse">Initializing Kigali Command Center...</p>
        </div>
      </div>
    );
  }

  const currentSection = location.pathname.split('/').pop() || 'admin';

  return (
    <main className="p-8 flex flex-col gap-8 min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center bg-white p-6 rounded-3xl border border-border shadow-md">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-emerald-600 rounded-2xl text-white shadow-xl shadow-emerald-600/20 ring-4 ring-emerald-50">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-text-main tracking-tight uppercase">
              {currentSection === 'admin' ? 'Command Center' : 
               currentSection === 'incidents' ? 'Incident Archive' :
               currentSection === 'users' ? 'Citizen Registry' :
               currentSection === 'analytics' ? 'Intelligence Report' :
               currentSection === 'security' ? 'Security Perimeter' : 'Command Center'}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-text-light text-[10px] font-black uppercase tracking-[0.2em]">Kigali Strategic Response Network</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="hidden md:flex flex-col items-end">
            <p className="font-black text-base text-text-main tracking-tight uppercase leading-none mb-1">{profile?.name}</p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> AUTHORIZED
              </span>
              <p className="text-[10px] text-text-light uppercase font-black tracking-widest leading-none">System Supervisor</p>
            </div>
          </div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-14 h-14 rounded-2xl bg-slate-100 border-2 border-white shadow-lg flex items-center justify-center font-black text-slate-400 group cursor-pointer hover:bg-emerald-600 hover:text-white transition-all overflow-hidden relative"
          >
            <span className="relative z-10">{profile?.name?.charAt(0) || '?'}</span>
            <div className="absolute inset-0 bg-emerald-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </motion.div>
        </div>
      </header>

      {currentSection === 'users' ? (
        <CitizenRegistry users={users} />
      ) : currentSection === 'analytics' ? (
        <IntelligenceReport incidents={incidents} />
      ) : currentSection === 'security' ? (
        <SecurityPerimeter />
      ) : (
        <>
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Total Incidents" 
              value={stats.total} 
              active={filter === 'all' && districtFilter === 'all' && typeFilter === 'all'} 
              onClick={() => {setFilter('all'); setDistrictFilter('all'); setTypeFilter('all');}} 
            />
            <StatCard 
              title="Awaiting Review" 
              value={stats.pending} 
              color="text-status-pending" 
              active={filter === 'pending'} 
              onClick={() => {setFilter('pending'); setDistrictFilter('all'); setTypeFilter('all');}} 
            />
            <StatCard 
              title="Active Response" 
              value={stats.inProgress} 
              color="text-status-active" 
              active={filter === 'in-progress'} 
              onClick={() => {setFilter('in-progress'); setDistrictFilter('all'); setTypeFilter('all');}} 
            />
            <StatCard 
              title="Resolved" 
              value={stats.resolved} 
              color="text-status-resolved" 
              active={filter === 'resolved'} 
              onClick={() => {setFilter('resolved'); setDistrictFilter('all'); setTypeFilter('all');}} 
            />
          </div>

          <div className="grid lg:grid-cols-12 gap-6 items-start">
            {/* Main Feed */}
            <div className="lg:col-span-8 space-y-6">
              <div className="dashboard-card overflow-hidden !p-0">
                <div className="flex justify-between items-center p-6 border-b border-border">
                  <div className="flex items-center gap-4">
                    <h2 className="font-black text-base uppercase tracking-tight text-slate-800">Operational Log</h2>
                    <div className="flex bg-main-bg p-1 rounded-xl border border-border">
                      <button 
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-md text-emerald-600' : 'text-text-light hover:text-text-main'}`}
                        title="List View"
                      >
                        <List className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setViewMode('map')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'map' ? 'bg-white shadow-md text-emerald-600' : 'text-text-light hover:text-text-main'}`}
                        title="Map View"
                      >
                        <MapIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative group">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-light group-focus-within:text-accent transition-colors" />
                      <input 
                        type="text" 
                        placeholder="Search system logs..." 
                        className="bg-main-bg border border-border rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all w-48"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                    {(filter !== 'all' || typeFilter !== 'all' || districtFilter !== 'all') && (
                      <button 
                        className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:bg-rose-50 px-2 py-1 rounded-md"
                        onClick={() => {setFilter('all'); setTypeFilter('all'); setDistrictFilter('all');}}
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  {viewMode === 'list' ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="pb-4 text-[10px] font-black text-text-light uppercase tracking-[0.2em] pl-4">Sector ID</th>
                            <th className="pb-4 text-[10px] font-black text-text-light uppercase tracking-[0.2em]">Asset Type</th>
                            <th className="pb-4 text-[10px] font-black text-text-light uppercase tracking-[0.2em]">Source Entity</th>
                            <th className="pb-4 text-[10px] font-black text-text-light uppercase tracking-[0.2em] text-center">Status</th>
                            <th className="pb-4 text-[10px] font-black text-text-light uppercase tracking-[0.2em] text-right pr-4">Precinct</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {loading ? (
                            <tr>
                              <td colSpan={5} className="py-12 text-center">
                                <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mx-auto mb-4" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Querying Global Matrix...</p>
                              </td>
                            </tr>
                          ) : filteredIncidents.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="py-20 text-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                  <ShieldAlert className="w-8 h-8 text-slate-300" />
                                </div>
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Zone Clear</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No matching reports in this sector.</p>
                              </td>
                            </tr>
                          ) : filteredIncidents.map((incident) => (
                            <tr 
                              key={incident.id} 
                              className="group cursor-pointer hover:bg-emerald-50/50 transition-all border-l-4 border-l-transparent hover:border-l-emerald-500"
                              onClick={() => setSelectedIncident(incident)}
                            >
                              <td className="py-5 font-black text-[11px] text-slate-400 pl-4 uppercase tracking-tighter">INC-{incident.id.slice(0, 8)}</td>
                              <td className="py-5">
                                <div className="flex items-center gap-4">
                                  <div className="shrink-0 group-hover:scale-110 transition-transform duration-300">
                                    {getTypeIcon(incident.type)}
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-xs text-slate-900 font-black uppercase tracking-tight leading-none mb-1">{incident.type}</span>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{incident.reporterId ? 'Citizen Verified' : 'System Generated'}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-5 text-xs text-text-main font-black uppercase tracking-tight whitespace-nowrap">{incident.reporterName}</td>
                              <td className="py-5 text-center">
                                <span className={`badge badge-${incident.status} !px-4 !py-1.5 shadow-sm border border-black/5`}>
                                  {incident.status.replace('-', ' ')}
                                </span>
                              </td>
                              <td className="py-5 text-right pr-4">
                                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50/50 px-3 py-1.5 rounded-lg border border-emerald-100 uppercase tracking-widest">{incident.location.district || 'Unsorted'}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="h-[600px] w-full relative z-10 border border-border rounded-xl overflow-hidden shadow-2xl ring-8 ring-slate-100/50">
                      <MapContainer 
                        center={[-1.9441, 30.0619]} 
                        zoom={12} 
                        className="h-full w-full"
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <FitBounds incidents={filteredIncidents} />
                        {filteredIncidents.map((incident) => (
                          incident.location.latitude !== 0 && (
                            <Marker 
                              key={incident.id} 
                              position={[incident.location.latitude, incident.location.longitude]}
                              icon={customIcon}
                            >
                              <Popup>
                                <div className="p-3 min-w-[180px] bg-white rounded-2xl">
                                  <div className={`badge badge-${incident.status} mb-3 w-full text-center shadow-sm`}>
                                    {incident.status.replace('-', ' ')}
                                  </div>
                                  <h3 className="font-black text-sm uppercase tracking-tight mb-1">{incident.type}</h3>
                                  <p className="text-[10px] font-bold text-slate-500 line-clamp-2 leading-relaxed mb-4">{incident.description}</p>
                                  <button 
                                    onClick={() => setSelectedIncident(incident)}
                                    className="w-full py-2.5 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-95"
                                  >
                                    Inspect Unit
                                  </button>
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
            </div>

            {/* Info Area */}
            <div className="lg:col-span-4 space-y-8">
              <div className="dashboard-card !p-0 overflow-hidden">
                <div className="p-6 border-b border-border bg-slate-50/50">
                  <h2 className="font-black text-sm uppercase tracking-widest text-slate-800">System Distribution</h2>
                </div>
                <div className="p-6">
                  <div className="h-[200px] cursor-pointer">
                    <ResponsiveContainer width="100%" height="100%">
                      <ReBarChart 
                        data={stats.chartData} 
                        layout="vertical" 
                        barSize={14}
                        onClick={(data) => {
                          if (data && data.activeLabel) {
                            setTypeFilter(String(data.activeLabel).toLowerCase());
                          }
                        }}
                      >
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={80} axisLine={false} tickLine={false} style={{ fontSize: '10px', fill: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }} />
                        <Tooltip 
                          cursor={{fill: '#f1f5f9', radius: 4}}
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)', padding: '12px' }}
                        />
                        <Bar 
                          dataKey="count" 
                          fill="#10b981" 
                          radius={[0, 6, 6, 0]} 
                          activeBar={<Bar fill="#059669" radius={[0, 6, 6, 0]} />}
                        />
                      </ReBarChart>
                    </ResponsiveContainer>
                  </div>
                  {typeFilter !== 'all' && (
                    <button 
                      className="w-full mt-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 hover:bg-rose-50 rounded-xl transition-all border border-rose-100 flex items-center justify-center gap-2"
                      onClick={() => setTypeFilter('all')}
                    >
                      <XCircle className="w-3 h-3" /> Lift Distribution Lock
                    </button>
                  )}
                </div>
              </div>

              <div className="dashboard-card !p-0 overflow-hidden">
                <div className="p-6 border-b border-border bg-slate-50/50">
                  <h2 className="font-black text-sm uppercase tracking-widest text-emerald-600">Smart City Architecture</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <HealthNode label="DISTRICT RELAY" details="Kigali Metro Fiber" status="Locked" color="text-emerald-600" />
                    <HealthNode label="RESPONSE CLUSTER" details="Emergency Dispatch API" status="Syncing" color="text-amber-500" />
                    
                    <div className="mt-8 pt-8 border-t border-dashed border-slate-200">
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex flex-col">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Load Balance</p>
                          <p className="text-xs font-black text-slate-800 uppercase tracking-tighter">District Density</p>
                        </div>
                        {districtFilter !== 'all' && (
                          <button 
                            className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline"
                            onClick={() => setDistrictFilter('all')}
                          >
                            Reset Ops
                          </button>
                        )}
                      </div>
                      <div className="space-y-4">
                        {stats.districtData.map((d, i) => (
                          <div 
                            key={i} 
                            className={`flex flex-col gap-2 p-3 rounded-2xl transition-all cursor-pointer group relative ${districtFilter === d.name ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/20' : 'bg-slate-50 hover:bg-slate-100'}`}
                            onClick={() => setDistrictFilter(d.name)}
                          >
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                              <span className={districtFilter === d.name ? 'text-white' : 'text-slate-800'}>{d.name}</span>
                              <span className={districtFilter === d.name ? 'text-emerald-100' : 'text-slate-400'}>{d.value} Units</span>
                            </div>
                            <div className={`w-full h-1.5 rounded-full overflow-hidden ${districtFilter === d.name ? 'bg-white/20' : 'bg-slate-200'}`}>
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${(d.value / (stats.total || 1)) * 100}%` }}
                                className={`h-full rounded-full ${districtFilter === d.name ? 'bg-white' : 'bg-emerald-500'}`} 
                              />
                            </div>
                            {districtFilter === d.name && (
                              <div className="absolute top-2 right-2">
                                <CheckCircle2 className="w-3 h-3 text-emerald-100" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Details Modal */}
      <AnimatePresence>
        {selectedIncident && (
          <IncidentInspector 
            incident={selectedIncident} 
            onClose={() => setSelectedIncident(null)} 
            onUpdate={handleUpdateStatus} 
          />
        )}
      </AnimatePresence>

      <footer className="mt-auto pt-12 pb-4 border-t border-slate-100">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center">
          © {new Date().getFullYear()} CivicGuard Kigali • Kigali Strategic Response Network • Republic of Rwanda
        </p>
      </footer>
    </main>
  );
}

function StatCard({ title, value, color, active, onClick }: any) {
  return (
    <motion.div 
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`relative p-8 rounded-[2rem] border-2 transition-all cursor-pointer overflow-hidden flex flex-col justify-between h-40 shadow-xl ${
        active 
        ? 'bg-slate-900 border-slate-900 text-white shadow-slate-900/20' 
        : 'bg-white border-transparent hover:border-emerald-500/30'
      }`}
    >
      {active && (
        <motion.div 
          layoutId="stat-active-glow"
          className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/20 blur-[60px]"
        />
      )}
      <div className={`text-[10px] font-black uppercase tracking-[0.3em] ${active ? 'text-emerald-400' : 'text-slate-400'}`}>{title}</div>
      <div className="flex items-end justify-between relative z-10">
        <div className={`text-5xl font-black tracking-tighter ${active ? 'text-white' : color || 'text-slate-900'}`}>{value}</div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${active ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-400'}`}>
          <ChevronRight className={`w-6 h-6 transition-transform ${active ? 'rotate-90' : ''}`} />
        </div>
      </div>
    </motion.div>
  );
}

function CitizenRegistry({ users }: { users: UserProfile[] }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8"
    >
      <div className="bg-white p-10 rounded-[3rem] border border-border shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] -mr-32 -mt-32" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 relative z-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-2">Citizen Registry</h2>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full">{users.length} Assets</span>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-tight">Verified Contributors</p>
            </div>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <button className="flex-grow md:flex-none px-6 py-4 rounded-2xl bg-slate-100 text-slate-900 text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Verify Batch
            </button>
            <button className="flex-grow md:flex-none px-8 py-4 rounded-full bg-slate-900 text-white text-xs font-black uppercase tracking-widest hover:shadow-2xl hover:shadow-slate-900/30 transition-all flex items-center justify-center gap-2 group">
              Export Archive <TrendingUp className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {users.map((user) => (
            <motion.div 
              key={user.id} 
              whileHover={{ y: -8 }}
              className="p-8 rounded-[2.5rem] border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-2xl transition-all group border-b-8 border-b-transparent hover:border-b-emerald-600"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-3xl bg-white border-2 border-slate-100 flex items-center justify-center text-3xl font-black text-emerald-600 shadow-xl group-hover:scale-110 transition-transform mb-6 ring-8 ring-slate-100/50">
                  {user.name?.charAt(0) || '?'}
                </div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-1 group-hover:text-emerald-600 transition-colors uppercase">{user.name}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">{user.email}</p>
                
                <div className="w-full pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {user.role}
                  </div>
                  <button className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-500 transition-all">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function IntelligenceReport({ incidents }: { incidents: Incident[] }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 bg-white p-10 rounded-[3rem] border border-border shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-1">Temporal Load</h3>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">7-Day Moving Average</p>
            </div>
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="w-3 h-3 rounded-full bg-slate-200" />
            </div>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={[
                { name: 'MON', v: 45 }, { name: 'TUE', v: 52 }, { name: 'WED', v: 38 },
                { name: 'THU', v: 65 }, { name: 'FRI', v: 48 }, { name: 'SAT', v: 32 }, { name: 'SUN', v: 28 }
              ]}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                <Tooltip 
                  cursor={{fill: '#f8fafc', radius: 10}}
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', background: '#1e293b', color: '#fff' }}
                />
                <Bar dataKey="v" fill="url(#barGradient)" radius={[10, 10, 10, 10]} />
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-emerald-500/10 mix-blend-overlay" />
          <h3 className="text-2xl font-black uppercase tracking-tighter mb-10 relative z-10">Asset Allocation</h3>
          <div className="h-[300px] relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'EMERGENCY', value: 45 },
                    { name: 'MAINTENANCE', value: 25 },
                    { name: 'SECURITY', value: 30 }
                  ]}
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#3b82f6" />
                  <Cell fill="#f43f5e" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-10 space-y-4 relative z-10">
            {['EMERGENCY', 'MAINTENANCE', 'SECURITY'].map((label, idx) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${idx === 0 ? 'bg-emerald-500' : idx === 1 ? 'bg-blue-500' : 'bg-rose-500'}`} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
                </div>
                <span className="text-xs font-black">{(idx + 1) * 20}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SecurityPerimeter() {
  const [logs] = useState([
    { id: 1, action: "Admin Escalation", target: "Kigali Command Center", time: "0s ago", status: "Verified", type: "CRITICAL" },
    { id: 2, action: "Authentication Handshake", target: "Gasabo Grid Relay", time: "4m ago", status: "Success", type: "INFO" },
    { id: 3, action: "Data Invariant Check", target: "Firestore Archive", time: "12m ago", status: "Secure", type: "INFO" },
    { id: 4, action: "Route Validation", target: "Protected Navigation", time: "1h ago", status: "Passed", type: "INFO" },
    { id: 5, action: "Permission Sync", target: "IAM Layer 2", time: "2h ago", status: "Active", type: "INFO" },
  ]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-12 rounded-[3.5rem] border border-border shadow-2xl relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-16 relative z-10">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-emerald-400 shadow-2xl shadow-emerald-500/20 ring-8 ring-slate-50">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">Security Perimeter</h2>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs text-slate-500 font-black uppercase tracking-[0.4em]">Active Node Monitoring</p>
            </div>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-8 bg-slate-50 p-6 rounded-3xl border border-slate-100">
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Grid Health</p>
            <p className="text-xl font-black text-emerald-600 uppercase tracking-tighter">Fully Secure</p>
          </div>
          <div className="w-px h-12 bg-slate-200" />
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Encrypted</p>
            <p className="text-xl font-black text-slate-900 uppercase tracking-tighter">TLS v1.3</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        {logs.map((log) => (
          <motion.div 
            key={log.id} 
            whileHover={{ x: 10 }}
            className="group flex items-center gap-10 py-6 px-10 bg-slate-50/50 hover:bg-slate-900 hover:text-white transition-all rounded-[2rem] border border-slate-100 hover:border-slate-800"
          >
            <div className="w-24 text-[10px] font-black text-slate-400 group-hover:text-emerald-400 font-mono tracking-tighter uppercase">{log.time}</div>
            <div className="flex-grow">
              <div className="text-lg font-black tracking-tight uppercase mb-0.5">{log.action}</div>
              <div className="text-[10px] font-black text-slate-400 group-hover:text-slate-500 uppercase tracking-widest">{log.target}</div>
            </div>
            <div className="flex items-center gap-6">
              {log.type === 'CRITICAL' && <AlertCircle className="w-5 h-5 text-rose-500 animate-pulse" />}
              <span className="px-6 py-2 bg-white text-slate-900 group-hover:bg-emerald-500 group-hover:text-white text-[10px] font-black uppercase tracking-widest rounded-full border border-slate-200 group-hover:border-emerald-400 transition-all">
                {log.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function HealthNode({ label, details, status, color }: any) {
  return (
    <div className="p-3 border border-border rounded-lg bg-main-bg">
      <div className="text-[10px] font-bold text-accent mb-1 uppercase tracking-tight">{label}</div>
      <div className="text-xs text-text-main flex justify-between items-center">
        {details}
        <span className={`flex items-center gap-1.5 font-bold ${color}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {status}
        </span>
      </div>
    </div>
  );
}

function IncidentInspector({ incident, onClose, onUpdate }: { incident: Incident, onClose: () => void, onUpdate: (s: IncidentStatus, c: string) => void }) {
  const [status, setStatus] = useState<IncidentStatus>(incident.status);
  const [comment, setComment] = useState(incident.adminComment || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onUpdate(status, comment);
    setIsSubmitting(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-end bg-slate-900/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="h-full w-full max-w-xl bg-white shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-slate-100 p-2 rounded-lg">
              <AlertCircle className="w-5 h-5 text-slate-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Incident Details</h2>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CaseID: {incident.id}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <XCircle className="w-6 h-6 text-slate-300" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-8 space-y-8">
          {/* Reporter Info */}
          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Informant</h3>
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-lg">
                {incident.reporterName?.charAt(0) || 'C'}
              </div>
              <div>
                <div className="font-bold text-slate-900">{incident.reporterName || 'External Reporter'}</div>
                <div className="text-sm text-slate-500">Citizen Reporter</div>
              </div>
            </div>
          </section>

          {/* Description */}
          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Incident Logic</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 p-1 bg-slate-100 rounded text-slate-400"><Filter className="w-3.5 h-3.5" /></div>
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase">Category</div>
                  <div className="text-slate-900 font-medium">{incident.type.charAt(0).toUpperCase() + incident.type.slice(1)}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 p-1 bg-slate-100 rounded text-slate-400"><MapPin className="w-3.5 h-3.5" /></div>
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase">Location & Sector</div>
                  <div className="text-slate-900 font-medium">
                    {incident.location.address} 
                    {incident.location.district && (
                      <span className="ml-2 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold border border-emerald-100">
                        {incident.location.district} District
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 border-l-4 border-primary-600 p-6 rounded-r-2xl">
                <div className="text-xs font-bold text-primary-600 uppercase mb-2">Narrative</div>
                <p className="text-slate-700 leading-relaxed font-medium">
                  "{incident.description}"
                </p>
              </div>
            </div>
          </section>

          {/* Controls */}
          <section className="pt-6 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Authority Action</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-3 text-center sm:text-left">Set Operational Status</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['pending', 'in-progress', 'resolved', 'rejected'] as IncidentStatus[]).map((s) => (
                    <button 
                      key={s}
                      onClick={() => setStatus(s)}
                      className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase transition-all ${
                        status === s 
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20 ring-2 ring-primary-600/20' 
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {s.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Official Commentary / Instructions</label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-3 h-4 w-4 text-slate-400" />
                  <textarea 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary-600/10 focus:border-primary-600"
                    placeholder="Enter notes for the citizen or internal logs..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="p-8 border-t border-slate-100 bg-slate-50">
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full btn-primary h-14 flex items-center justify-center gap-3 text-lg"
          >
            {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Commit Changes <ChevronRight className="w-5 h-5" /></>}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ShieldIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
