import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  User, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, UserProfile } from '../lib/firebase';
import { upsertUserToBackend } from '../services/userService';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (intendedRole?: 'citizen' | 'admin') => Promise<void>;
  signInEmail: (email: string, pass: string) => Promise<void>;
  signUpEmail: (email: string, pass: string, name: string, intendedRole: 'citizen' | 'admin') => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setUser(user);
        if (user) {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const existingProfile = { id: user.uid, ...docSnap.data() } as UserProfile;
            setProfile(existingProfile);
            upsertUserToBackend(existingProfile).catch((err) => {
              console.error('Backend profile sync failed (non-fatal)', err);
            });
          } else {
            // New user registration
            const selectedRole = localStorage.getItem('civicguard_intended_role') || 'citizen';
            const newProfile: UserProfile = {
              id: user.uid,
              name: user.displayName || 'Anonymous',
              email: user.email || '',
              role: selectedRole as 'citizen' | 'admin',
              createdAt: serverTimestamp(),
            };
            await setDoc(docRef, newProfile);
            setProfile(newProfile);
            localStorage.removeItem('civicguard_intended_role');
            upsertUserToBackend(newProfile).catch((err) => {
              console.error('Backend profile sync failed (non-fatal)', err);
            });
          }
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error('Failed to initialize user profile', error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (intendedRole?: 'citizen' | 'admin') => {
    if (intendedRole) {
      localStorage.setItem('civicguard_intended_role', intendedRole);
    }
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signInEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signUpEmail = async (email: string, pass: string, name: string, role: 'citizen' | 'admin') => {
    localStorage.setItem('civicguard_intended_role', role);
    const { user } = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(user, { displayName: name });
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signInEmail, signUpEmail, resetPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
