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
  Timestamp
} from 'firebase/firestore';
import { db, Incident, IncidentType, IncidentStatus, District } from '../lib/firebase';

export interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
  path: string | null;
  authInfo: any;
}

const handleFirestoreError = (error: any, operationType: FirestoreErrorInfo['operationType'], path: string | null = null) => {
  if (error.code === 'permission-denied') {
    const errorInfo: FirestoreErrorInfo = {
      error: error.message,
      operationType,
      path,
      authInfo: 'Check AuthContext for details'
    };
    console.error('Firestore Error:', JSON.stringify(errorInfo, null, 2));
    throw new Error(`Permission Denied: ${operationType} on ${path || 'collection'}`);
  }
  throw error;
};

export const reportIncident = async (data: {
  type: IncidentType;
  description: string;
  location: { latitude: number; longitude: number; address: string; district?: District };
  reporterId: string;
  reporterName: string;
}) => {
  try {
    const docRef = await addDoc(collection(db, 'incidents'), {
      ...data,
      status: 'pending',
      timestamp: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, 'create', 'incidents');
  }
};

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
  } catch (error) {
    handleFirestoreError(error, 'update', `incidents/${incidentId}`);
  }
};

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

  return onSnapshot(q, (snapshot) => {
    const incidents = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Incident[];
    callback(incidents);
  }, (error) => {
    if (onError) {
      onError(error);
    } else {
      handleFirestoreError(error, 'list', 'incidents');
    }
  });
};
