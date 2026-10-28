import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as fbSignOut,
  signInAnonymously
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType, testConnection } from '../firebase/config';
import { UserPublic, UserPrivate, UserRole } from '../types';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  userProfile: UserPublic | null;
  userPrivate: UserPrivate | null;
  loading: boolean;
  isBackendConnected: boolean;
  activeRole: UserRole;
  isAdmin: boolean;
  isModerator: boolean;
  isOrgRep: boolean;
  signInWithGoogle: () => Promise<void>;
  signInQuickEmployee: (displayName?: string, email?: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserPublic>) => Promise<void>;
  updatePrivateSettings: (data: Partial<UserPrivate>) => Promise<void>;
  toggleFollowOrg: (orgId: string) => Promise<void>;
  switchTestingRole: (role: UserRole) => void;
  followedOrgIds: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'demdonpay@gmail.com';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserPublic | null>(null);
  const [userPrivate, setUserPrivate] = useState<UserPrivate | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBackendConnected, setIsBackendConnected] = useState(true);
  // activeRole allows switching between roles for UI verification
  const [overrideRole, setOverrideRole] = useState<UserRole | null>(null);

  useEffect(() => {
    // Test backend connection on boot
    testConnection().then(connected => {
      setIsBackendConnected(connected);
    });

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        await loadUserData(user);
      } else {
        setUserProfile(null);
        setUserPrivate(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadUserData = async (user: FirebaseUser) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      const isUserAdmin = user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

      if (userSnap.exists()) {
        const data = userSnap.data() as UserPublic;
        setUserProfile(data);
      } else {
        // Initial user registration document
        const newProfile: UserPublic = {
          id: user.uid,
          displayName: user.displayName || (user.email ? user.email.split('@')[0] : 'Nigerian Worker'),
          role: isUserAdmin ? 'admin' : 'employee',
          country: 'Nigeria',
          bio: 'Verified employee exploring salary updates on DdP',
          photoURL: user.photoURL || undefined,
          followedOrgIds: ['lasg-org', 'nnpc-org'],
          createdAt: new Date().toISOString(),
        };

        const newPrivate: UserPrivate = {
          email: user.email || 'employee@demdonpay.ng',
          phone: '',
          emailNotifications: true,
          pushNotifications: true,
          digestFrequency: 'immediate',
          updatedAt: new Date().toISOString(),
        };

        try {
          await setDoc(userRef, newProfile);
          const privateRef = doc(db, 'users', user.uid, 'private', 'info');
          await setDoc(privateRef, newPrivate);
        } catch (err) {
          console.warn('Could not persist initial profile directly to firestore:', err);
        }

        setUserProfile(newProfile);
        setUserPrivate(newPrivate);
      }

      // Load private subcollection (isolated from public view)
      try {
        const privateRef = doc(db, 'users', user.uid, 'private', 'info');
        const privateSnap = await getDoc(privateRef);
        if (privateSnap.exists()) {
          setUserPrivate(privateSnap.data() as UserPrivate);
        }
      } catch (err) {
        console.warn('Private info read error:', err);
      }
    } catch (err) {
      console.error('Error loading user data:', err);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Google Sign-in failed:', error);
      // Fallback for popup-blocked or local dev environments
      await signInQuickEmployee('Dem Don Pay User', 'user@demdonpay.ng');
    } finally {
      setLoading(false);
    }
  };

  const signInQuickEmployee = async (displayName = 'Demilade Adeyemi', email = 'demilade.adeyemi@demdonpay.ng') => {
    try {
      setLoading(true);
      // Use Firebase anonymous auth for a valid auth session
      const cred = await signInAnonymously(auth);
      const uid = cred.user.uid;
      const isUserAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

      const profile: UserPublic = {
        id: uid,
        displayName,
        role: isUserAdmin ? 'admin' : 'employee',
        country: 'Nigeria',
        bio: 'Nigerian Public & Private Sector Employee',
        followedOrgIds: ['lasg-org', 'nnpc-org', 'access-bank-org'],
        createdAt: new Date().toISOString(),
      };

      const privateInfo: UserPrivate = {
        email,
        phone: '+234 803 000 1234',
        emailNotifications: true,
        pushNotifications: true,
        digestFrequency: 'immediate',
        updatedAt: new Date().toISOString(),
      };

      try {
        await setDoc(doc(db, 'users', uid), profile);
        await setDoc(doc(db, 'users', uid, 'private', 'info'), privateInfo);
      } catch (err) {
        console.warn('Set doc error during quick sign in:', err);
      }

      setUserProfile(profile);
      setUserPrivate(privateInfo);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'users');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await fbSignOut(auth);
    setUserProfile(null);
    setUserPrivate(null);
    setOverrideRole(null);
  };

  const updateProfile = async (data: Partial<UserPublic>) => {
    if (!firebaseUser && !userProfile) return;
    const uid = firebaseUser?.uid || userProfile?.id;
    if (!uid) return;

    const updated = {
      ...(userProfile as UserPublic),
      ...data,
      updatedAt: new Date().toISOString(),
    };

    try {
      await updateDoc(doc(db, 'users', uid), updated as any);
    } catch (err) {
      console.warn('Updating Firestore profile failed, applying locally:', err);
    }
    setUserProfile(updated);
  };

  const updatePrivateSettings = async (data: Partial<UserPrivate>) => {
    if (!firebaseUser && !userProfile) return;
    const uid = firebaseUser?.uid || userProfile?.id;
    if (!uid) return;

    const updated = {
      ...(userPrivate as UserPrivate),
      ...data,
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'users', uid, 'private', 'info'), updated);
    } catch (err) {
      console.warn('Updating Firestore private info failed, applying locally:', err);
    }
    setUserPrivate(updated);
  };

  const toggleFollowOrg = async (orgId: string) => {
    if (!userProfile) return;
    const currentFollowed = userProfile.followedOrgIds || [];
    const isFollowing = currentFollowed.includes(orgId);
    const updated = isFollowing
      ? currentFollowed.filter(id => id !== orgId)
      : [...currentFollowed, orgId];

    await updateProfile({ followedOrgIds: updated });
  };

  const activeRole: UserRole = useMemo(() => {
    if (overrideRole) return overrideRole;
    if (firebaseUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) return 'admin';
    return userProfile?.role || 'employee';
  }, [overrideRole, firebaseUser, userProfile]);

  const isAdmin = activeRole === 'admin';
  const isModerator = activeRole === 'moderator' || isAdmin;
  const isOrgRep = activeRole === 'org_representative' || isAdmin;

  const followedOrgIds = userProfile?.followedOrgIds || ['lasg-org', 'nnpc-org'];

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        userProfile,
        userPrivate,
        loading,
        isBackendConnected,
        activeRole,
        isAdmin,
        isModerator,
        isOrgRep,
        signInWithGoogle,
        signInQuickEmployee,
        signOut,
        updateProfile,
        updatePrivateSettings,
        toggleFollowOrg,
        switchTestingRole: setOverrideRole,
        followedOrgIds,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
