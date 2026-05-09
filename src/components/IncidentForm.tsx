import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, MapPin, Loader2 } from 'lucide-react';
import { reportIncident, classifySeverity } from '../services/incidentService';
import { IncidentType, District, Severity } from '../lib/firebase';

interface IncidentFormProps {
  onClose: () => void;
  userId: string;
  userName: string;
}

const SEVERITY_STYLES: Record<Severity, { label: string; classes: string }> = {
  P1: { label: 'P1 — Critical', classes: 'bg-red-100 text-red-700 border-red-200' },
  P2: { label: 'P2 — High',     classes: 'bg-orange-100 text-orange-700 border-orange-200' },
  P3: { label: 'P3 — Normal',   classes: 'bg-blue-100 text-blue-700 border-blue-200' },
};

export default function IncidentForm({ onClose, userId, userName }: IncidentFormProps) {
  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'other' as IncidentType,
    district: 'Gasabo' as District,
    description: '',
    address: '',
    latitude: 0,
    longitude: 0
  });

  const handleGetLocation = () => {
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData({
          ...formData,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          address: 'Current Location'
        });
        setLocLoading(false);
      },
      () => {
        alert('Could not detect location. Please enter address manually.');
        setLocLoading(false);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await reportIncident({
        type: formData.type,
        description: formData.description,
        location: {
          latitude: formData.latitude,
          longitude: formData.longitude,
          address: formData.address || 'Location provided via report',
          district: formData.district
        },
        reporterId: userId,
        reporterName: userName
      });
      onClose();
    } catch (err) {
      alert('Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 overflow-hidden relative"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <Plus className="w-6 h-6 rotate-45 text-slate-400" />
        </button>

        <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">New Incident Report</h2>
        <p className="text-slate-500 mb-8 font-medium italic">Empowered by the Kigali Smart City Initiative</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Incident Type</label>
            <div className="grid grid-cols-2 gap-4">
              <select 
                className="input-field appearance-none"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as IncidentType})}
                required
              >
                <option value="fire">🔥 Fire / Burning</option>
                <option value="medical">🚑 Medical Emergency</option>
                <option value="crime">👮 Suspicious Activity</option>
                <option value="traffic">🚗 Traffic Accident </option>
                <option value="utilities">⚡ Utility Outage</option>
                <option value="other">🛠️ Other / General</option>
              </select>
              <select 
                className="input-field appearance-none"
                value={formData.district}
                onChange={(e) => setFormData({...formData, district: e.target.value as District})}
                required
              >
                <option value="Gasabo">📍 Gasabo District</option>
                <option value="Nyarugenge">📍 Nyarugenge District</option>
                <option value="Kicukiro">📍 Kicukiro District</option>
              </select>
            </div>
            {(() => {
              const sev = classifySeverity(formData.type);
              const style = SEVERITY_STYLES[sev];
              return (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Auto-classified severity:</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border ${style.classes}`}>
                    {style.label}
                  </span>
                </div>
              );
            })()}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Location / Address</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-4 top-3 h-5 w-5 text-slate-400" />
                <input 
                  type="text" 
                  className="input-field pl-12"
                  placeholder="e.g., 5th Avenue, South Street"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  required
                />
              </div>
              <button 
                type="button"
                onClick={handleGetLocation}
                disabled={locLoading}
                className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-4 rounded-xl text-xs font-bold uppercase tracking-widest whitespace-nowrap hover:bg-emerald-100 transition-colors"
              >
                {locLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Get GPS'}
              </button>
            </div>
            {formData.latitude !== 0 && (
              <p className="text-[10px] text-emerald-600 mt-1 font-bold">Coordinates Locked: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Detailed Description</label>
            <textarea 
              className="input-field min-h-[120px] pt-3 resize-none"
              placeholder="Provide as much detail as possible for the Kigali Ops Command..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>

          <div className="flex gap-4 pt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 btn-secondary h-12"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-[2] btn-primary h-12 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit to District Relay'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
