import { collection, query, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile } from '../lib/firebase';

export const subscribeToUsers = (callback: (users: UserProfile[]) => void) => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef);

  return onSnapshot(q, (snapshot) => {
    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as UserProfile[];
    callback(users);
  });
};

export const updateUserRole = async (userId: string, role: 'citizen' | 'admin') => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, { role });
};

export const deleteUser = async (userId: string) => {
  const userRef = doc(db, 'users', userId);
  await deleteDoc(userRef);
};
