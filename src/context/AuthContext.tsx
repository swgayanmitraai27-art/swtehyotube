'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithCustomToken, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile as firebaseUpdateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { UserProfile } from '@/types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isYouTubeConnected: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name?: string) => Promise<void>;
  connectYouTubeChannel: () => void;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for 1-click OAuth callback token in URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const authToken = urlParams.get('auth_token');
      if (authToken) {
        signInWithCustomToken(auth, authToken)
          .then(() => {
            urlParams.delete('auth_token');
            const remainingQuery = urlParams.toString();
            const newUrl = window.location.pathname + (remainingQuery ? `?${remainingQuery}` : '');
            window.history.replaceState({}, document.title, newUrl);
          })
          .catch((err) => {
            console.error('Failed to sign in with custom token from OAuth callback:', err);
          });
      }
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Sync & listen to user document in Firestore in real-time
        const userDocRef = doc(db, 'users', currentUser.uid);

        const unsubDoc = onSnapshot(userDocRef, async (snap) => {
          if (snap.exists()) {
            setProfile(snap.data() as UserProfile);
          } else {
            // Auto-provision initial 50 Free Trial Credits
            const initialProfile: UserProfile = {
              uid: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || 'Creator',
              photoURL: currentUser.photoURL || '',
              credits: 50,
              plan: 'free',
              autoPilotEnabled: false,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            };
            await setDoc(userDocRef, initialProfile);
            setProfile(initialProfile);
          }
          setLoading(false);
        });

        return () => unsubDoc();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      // Directly redirect to branded Google OAuth Screen with SW REPLY logo & YouTube scopes
      window.location.href = `/api/auth/google-url${user?.uid ? `?uid=${user.uid}` : ''}`;
    } catch (error) {
      console.error('Google Sign In Error:', error);
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email.trim(), pass);
    } catch (error: any) {
      console.error('Sign in with email error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name?: string) => {
    try {
      setLoading(true);
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      if (name && cred.user) {
        await firebaseUpdateProfile(cred.user, { displayName: name });
      }
    } catch (error: any) {
      console.error('Sign up with email error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const connectYouTubeChannel = () => {
    if (!user) {
      window.location.href = '/api/auth/google-url';
      return;
    }
    // Redirect to backend OAuth generation with user's UID in state
    window.location.href = `/api/auth/google-url?uid=${user.uid}`;
  };

  const logout = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (!user) return;
    const snap = await getDoc(doc(db, 'users', user.uid));
    if (snap.exists()) {
      setProfile(snap.data() as UserProfile);
    }
  };

  const isYouTubeConnected = Boolean(profile?.channelId);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isYouTubeConnected,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        connectYouTubeChannel,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
