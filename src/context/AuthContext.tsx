import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

type Role = 'USER' | 'HOST' | null;

type AuthContextValue = {
  firebaseUser: User | null;
  role: Role;
  loading: boolean;
  signupWithRole: (params: {
    role: 'USER' | 'HOST';
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data() as { role?: Role };
        setRole((data.role as Role) || 'USER');
      } else {
        setRole('USER');
        await setDoc(ref, {
          uid: user.uid,
          email: user.email,
          name: user.displayName ?? '',
          role: 'USER',
          createdAt: serverTimestamp(),
        });
      }
      setLoading(false);
    });

    return unsub;
  }, []);

  const signupWithRole: AuthContextValue['signupWithRole'] = async ({
    role,
    name,
    email,
    password,
  }) => {
    setLoading(true);
    const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });

    const ref = doc(db, 'users', cred.user.uid);
    await setDoc(ref, {
      uid: cred.user.uid,
      email,
      name,
      role,
      createdAt: serverTimestamp(),
    });

    setLoading(false);
  };

  const login: AuthContextValue['login'] = async (email, password) => {
    setLoading(true);
    const { signInWithEmailAndPassword } = await import('firebase/auth');
    await signInWithEmailAndPassword(auth, email, password);
    setLoading(false);
  };

  const logout = async () => {
    await auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ firebaseUser, role, loading, signupWithRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
