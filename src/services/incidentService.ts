import {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db, Incident, IncidentType, IncidentStatus, District, Severity } from '../lib/firebase';
import { incidentManager } from './alertService';
import { getPrimaryStreamUrl } from './cctvService';

export interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
  path: string | null;
  authInfo: any;
}

/**
 * Map an incident type to a CSMS severity level.
 * P1 = Critical (immediate threat to life), P2 = High (significant risk),
 * P3 = Normal (routine or low-urgency incident).
 * @param {IncidentType} type - The incident category submitted by the citizen.
 * @returns {Severity} Assigned severity: P1, P2, or P3.
 */
export const classifySeverity = (type: IncidentType): Severity => {
  switch (type) {
    case 'fire':
    case 'medical':
      return 'P1';
    case 'crime':
      return 'P2';
    default:
      return 'P3';
  }
};

/**
 * Handle Firestore operation errors with structured logging.
 * @param {any} error - The raw error from Firestore.
 * @param {FirestoreErrorInfo['operationType']} operationType - Operation that failed.
 * @param {string | null} path - Firestore path involved.
 */
const handleFirestoreError = (
  error: any,
  operationType: FirestoreErrorInfo['operationType'],
  path: string | null = null
) => {
  if (error.code === 'permission-denied') {
    const errorInfo: FirestoreErrorInfo = {
      error: error.message,
      operationType,
      path,
      authInfo: 'Check AuthContext for details',
    };
    console.error('Firestore Error:', JSON.stringify(errorInfo, null, 2));
    throw new Error(`Permission Denied: ${operationType} on ${path || 'collection'}`);
  }
  throw error;
};

/**
 * Submit a new incident report to Firestore.
 * Automatically classifies severity (P1–P3), attaches a simulated CCTV
 * stream URL for the incident's district, and persists the record.
 *
 * @param {object} data - Incident payload from the citizen submission form.
 * @param {IncidentType} data.type - Type of incident.
 * @param {string} data.description - Detailed description.
 * @param {{ latitude: number; longitude: number; address: string; district?: District }} data.location - Location details.
 * @param {string} data.reporterId - UID of the reporting citizen.
 * @param {string} data.reporterName - Display name of the reporting citizen.
 * @returns {Promise<string | undefined>} Firestore document ID of the created incident.
 */
export const reportIncident = async (data: {
  type: IncidentType;
  description: string;
  location: { latitude: number; longitude: number; address: string; district?: District };
  reporterId: string;
  reporterName: string;
}) => {
  try {
    const severity = classifySeverity(data.type);

    let cctvStreamUrl: string | null = null;
    if (data.location.district) {
      cctvStreamUrl = await getPrimaryStreamUrl(data.location.district);
    }

    const docRef = await addDoc(collection(db, 'incidents'), {
      ...data,
      severity,
      status: 'pending',
      cctvStreamUrl: cctvStreamUrl || '',
      timestamp: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log(
      `[IncidentService] New incident created: INC-${docRef.id.slice(0, 8)} | ` +
      `Type: ${data.type} | Severity: ${severity} | CCTV: ${cctvStreamUrl || 'unavailable'}`
    );

    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, 'create', 'incidents');
  }
};

/**
 * Update the status of an existing incident and notify all registered observers.
 * Triggers AlertService (SMS simulation) and OfficerDashboard (Socket.IO simulation)
 * via the IncidentManager Observer pattern.
 *
 * @param {string} incidentId - Firestore document ID of the incident.
 * @param {IncidentStatus} status - New status to apply.
 * @param {string} [adminComment] - Optional comment from the reviewing officer.
 * @returns {Promise<void>}
 */
export const updateIncidentStatus = async (
  incidentId: string,
  status: IncidentStatus,
  adminComment?: string
) => {
  try {
    const docRef = doc(db, 'incidents', incidentId);
    await updateDoc(docRef, {
      status,
      adminComment: adminComment || '',
      updatedAt: serverTimestamp(),
    });

    const partialIncident = {
      id: incidentId,
      status,
      adminComment: adminComment || '',
    } as Incident;

    incidentManager.notify(partialIncident);
  } catch (error) {
    handleFirestoreError(error, 'update', `incidents/${incidentId}`);
  }
};

/**
 * Subscribe to real-time incident updates from Firestore.
 * Admins receive all incidents; citizens receive only their own.
 * Implements the Observer pattern via Firestore onSnapshot listeners.
 *
 * @param {'citizen' | 'admin'} role - Role of the requesting user.
 * @param {string} userId - UID of the requesting user.
 * @param {(incidents: Incident[]) => void} callback - Called on every update.
 * @param {(error: any) => void} [onError] - Optional error handler.
 * @returns {() => void} Unsubscribe function to detach the listener.
 */
export const subscribeToIncidents = (
  role: 'citizen' | 'admin',
  userId: string,
  callback: (incidents: Incident[]) => void,
  onError?: (error: any) => void
) => {
  const incidentsRef = collection(db, 'incidents');
  let q;

  if (role === 'admin') {
    q = query(incidentsRef, orderBy('timestamp', 'desc'));
  } else {
    q = query(
      incidentsRef,
      where('reporterId', '==', userId),
      orderBy('timestamp', 'desc')
    );
  }

  return onSnapshot(
    q,
    (snapshot) => {
      const incidents = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
      })) as Incident[];
      callback(incidents);
    },
    (error) => {
      if (onError) {
        onError(error);
      } else {
        handleFirestoreError(error, 'list', 'incidents');
      }
    }
  );
};
