import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import toast from 'react-hot-toast';
import { auth, hasFirebaseConfig } from '../firebase/config.js';
import { adminsSeed } from '../data/demoData.js';
import { createDocument, findUserByEmail, getDocument } from '../services/firestoreService.js';

const AuthContext = createContext(null);

const demoSessionKey = 'educrm_demo_user';

const readStoredUser = () => {
  const saved = localStorage.getItem(demoSessionKey);
  if (!saved || saved === 'undefined' || saved === 'null') return null;

  try {
    return JSON.parse(saved);
  } catch {
    localStorage.removeItem(demoSessionKey);
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasFirebaseConfig || !auth) {
      setUser(readStoredUser());
      setLoading(false);
      return undefined;
    }

    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      const email = firebaseUser.email || '';
      const isDirector = email.toLowerCase().includes('director');
      const profile = (await getDocument('users', firebaseUser.uid)) || (await findUserByEmail(email));
      const fallbackProfile = {
        uid: firebaseUser.uid,
        fullName: firebaseUser.displayName || (isDirector ? 'Direktor' : 'Admin'),
        email,
        role: isDirector ? 'director' : 'admin',
        status: 'active',
      };
      const mergedProfile = { ...fallbackProfile, ...profile, uid: firebaseUser.uid };

      if (!profile) {
        await createDocument('users', { ...mergedProfile, id: firebaseUser.uid });
      }

      setUser({
        uid: mergedProfile.uid,
        email: mergedProfile.email,
        fullName: mergedProfile.fullName,
        role: mergedProfile.role,
        status: mergedProfile.status,
      });
      setLoading(false);
    });
  }, []);

  const login = async ({ email, password }) => {
    if (!hasFirebaseConfig || !auth) {
      const role = email.toLowerCase().includes('director') ? 'director' : 'admin';
      const demoUser = adminsSeed.find((item) => item.role === role) || {
        id: `demo-${role}`,
        fullName: role === 'director' ? 'Direktor' : 'Admin',
        email,
        role,
        status: 'active',
      };
      localStorage.setItem(demoSessionKey, JSON.stringify(demoUser));
      setUser(demoUser);
      toast.success(role === 'director' ? 'Direktor sifatida kirdingiz' : 'Admin sifatida kirdingiz');
      return demoUser;
    }

    await setPersistence(auth, browserLocalPersistence);
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
  };

  const logout = async () => {
    if (auth) await signOut(auth);
    localStorage.removeItem(demoSessionKey);
    setUser(null);
    toast.success('Tizimdan chiqdingiz');
  };

  const value = useMemo(() => ({ user, loading, login, logout, isDirector: user?.role === 'director' }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
