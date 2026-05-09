import { collection, query, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile } from '../lib/firebase';

/**
 * Subscribe to real-time user profile updates from Firestore.
 * Used by the Admin dashboard to populate the Citizen Registry.
 *
 * @param {(users: UserProfile[]) => void} callback - Invoked on every snapshot update.
 * @returns {() => void} Unsubscribe function to detach the listener.
 */
export const subscribeToUsers = (callback: (users: UserProfile[]) => void) => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef);

  return onSnapshot(q, (snapshot) => {
    const users = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
    })) as UserProfile[];
    callback(users);
  });
};

/**
 * Update the role of a citizen user (citizen ↔ admin).
 * Only callable by an authorized admin session.
 *
 * @param {string} userId - Firestore document ID of the user to update.
 * @param {'citizen' | 'admin'} role - New role to assign.
 * @returns {Promise<void>}
 */
export const updateUserRole = async (userId: string, role: 'citizen' | 'admin') => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, { role });
};

/**
 * Delete a user profile document from Firestore.
 * Note: This removes the Firestore record only — Firebase Auth account
 * must be removed separately via the Admin SDK.
 *
 * @param {string} userId - Firestore document ID of the user to delete.
 * @returns {Promise<void>}
 */
export const deleteUser = async (userId: string) => {
  const userRef = doc(db, 'users', userId);
  await deleteDoc(userRef);
};
