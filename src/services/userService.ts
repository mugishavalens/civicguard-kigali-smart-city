import {collection, doc, getDocs, query} from 'firebase/firestore';
import {db, UserProfile} from '../lib/firebase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

interface BackendUser {
  id: number;
  uid: string;
  email: string;
  name: string;
  role: 'citizen' | 'admin';
  phone?: string | null;
  location?: string | null;
  created_at?: string;
}

const mapBackendUser = (user: BackendUser): UserProfile => ({
  id: user.uid,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.created_at || null,
});

export const upsertUserToBackend = async (profile: Pick<UserProfile, 'id' | 'name' | 'email' | 'role'>) => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      uid: profile.id,
      email: profile.email,
      name: profile.name,
      role: profile.role,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.error || 'Failed to sync user to backend');
  }

  return mapBackendUser(await response.json());
};

export const fetchUsers = async (): Promise<UserProfile[]> => {
  const response = await fetch(`${API_BASE_URL}/users`);

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.error || 'Failed to fetch users');
  }

  const users = await response.json();
  return users.map(mapBackendUser);
};

export const syncFirestoreUsersToBackend = async () => {
  const usersRef = collection(db, 'users');
  const snapshot = await getDocs(query(usersRef));
  const profiles = snapshot.docs.map((entry) => ({
    id: entry.id,
    ...entry.data(),
  })) as UserProfile[];

  await Promise.all(profiles.map((profile) => upsertUserToBackend(profile)));
  return profiles.length;
};

export const subscribeToUsers = (
  callback: (users: UserProfile[]) => void,
  onError?: (error: Error) => void,
) => {
  let stopped = false;

  const refresh = async (backfill = false) => {
    try {
      if (backfill) {
        await syncFirestoreUsersToBackend();
      }

      const users = await fetchUsers();
      if (!stopped) {
        callback(users);
      }
    } catch (error) {
      if (onError) {
        onError(error as Error);
        return;
      }

      throw error;
    }
  };

  refresh(true).catch((error) => {
    if (onError) {
      onError(error as Error);
    } else {
      console.error('Failed to load users from backend', error);
    }
  });

  const intervalId = window.setInterval(() => {
    refresh(false).catch((error) => {
      if (onError) {
        onError(error as Error);
      } else {
        console.error('Failed to refresh users from backend', error);
      }
    });
  }, 5000);

  return () => {
    stopped = true;
    window.clearInterval(intervalId);
  };
};

export const updateUserRole = async (userId: string, role: 'citizen' | 'admin') => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({role}),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.error || 'Failed to update user role');
  }
};

export const deleteUser = async (userId: string) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.error || 'Failed to delete user');
  }
};
