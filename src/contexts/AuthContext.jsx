import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import toast from 'react-hot-toast';
import { auth } from '../firebase/config.js';
import { getDocument } from '../services/firestoreService.js';

const AuthContext = createContext(null);

const STORAGE_KEY = 'educrm_user';

const safeParse = (data) => {
  try {
    if (!data || data === 'undefined' || data === 'null') return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => safeParse(localStorage.getItem(STORAGE_KEY)));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setUser(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
        setLoading(false);
        return;
      }

      const profile = await getDocument('users', firebaseUser.uid);

      if (!profile) {
        toast.error('Foydalanuvchi Firestore da topilmadi');
        setUser(null);
        setLoading(false);
        return;
      }

      const finalUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        fullName: profile.fullName,
        role: profile.role,
        status: profile.status,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(finalUser));
      setUser(finalUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async ({ email, password }) => {
    if (!auth) {
      throw new Error('Firebase ulanmagan');
    }

    await setPersistence(auth, browserLocalPersistence);

    const credential = await signInWithEmailAndPassword(auth, email, password);

    const profile = await getDocument('users', credential.user.uid);

    if (!profile) {
      throw new Error('User Firestore da yo‘q');
    }

    const finalUser = {
      uid: credential.user.uid,
      email: credential.user.email,
      fullName: profile.fullName,
      role: profile.role,
      status: profile.status,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(finalUser));
    setUser(finalUser);

    toast.success('Muvaffaqiyatli kirildi');

    return finalUser;
  };

  const logout = async () => {
    if (auth) await signOut(auth);
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    toast.success('Tizimdan chiqdingiz');
  };

  const value = useMemo(() => ({
    user,
    loading,
    login,
    logout,
    isDirector: user?.role === 'director',
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);