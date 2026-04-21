import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export type IncidentStatus = 'pending' | 'in-progress' | 'resolved' | 'rejected';
export type IncidentType = 'fire' | 'medical' | 'crime' | 'traffic' | 'utilities' | 'other';
export type District = 'Gasabo' | 'Nyarugenge' | 'Kicukiro';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'citizen' | 'admin';
  createdAt: any;
}

export interface Incident {
  id: string;
  type: IncidentType;
  location: {
    latitude: number;
    longitude: number;
    address: string;
    district?: District;
  };
  description: string;
  status: IncidentStatus;
  timestamp: any;
  reporterId: string;
  reporterName: string;
  adminComment?: string;
  updatedAt?: any;
}
