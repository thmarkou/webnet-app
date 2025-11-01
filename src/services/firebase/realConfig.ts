import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence, getAuth, Auth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Real Firebase configuration - Replace with your actual Firebase project config
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyDtu2OcFaIQ6WbcSuUBjXznZeCZvii-V28",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "webnetapp-dev.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "webnetapp-dev",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "webnetapp-dev.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "270224209631",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:270224209631:web:4148c7d04048a2f1c29b6a",
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-VBHXL8YDP7"
};

// Initialize Firebase (only if not already initialized)
let app: FirebaseApp;
try {
  const existingApps = getApps();
  if (existingApps.length > 0) {
    app = existingApps[0];
  } else {
    app = initializeApp(firebaseConfig);
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
  // Fallback: try to initialize anyway
  app = initializeApp(firebaseConfig);
}

// Initialize Firebase services (lazy initialization)
let _db: Firestore | null = null;
let _auth: Auth | null = null;

export const db: Firestore = (() => {
  if (!_db) {
    try {
      _db = getFirestore(app);
    } catch (error) {
      console.error('Firestore initialization error:', error);
      throw error;
    }
  }
  return _db;
})();

export const auth: Auth = (() => {
  if (!_auth) {
    try {
      // Use initializeAuth with AsyncStorage persistence for React Native
      // This ensures auth state persists between app sessions
      _auth = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage)
      });
    } catch (error: any) {
      // If auth is already initialized, use getAuth instead
      if (error.code === 'auth/already-initialized' || error.message?.includes('already initialized')) {
        _auth = getAuth(app);
      } else {
        console.error('Auth initialization error:', error);
        throw error;
      }
    }
  }
  return _auth;
})();

// Database collections
export const COLLECTIONS = {
  USERS: 'users',
  PROFESSIONALS: 'professionals',
  APPOINTMENTS: 'appointments',
  REVIEWS: 'reviews',
  NOTIFICATIONS: 'notifications',
  CATEGORIES: 'categories',
  CITIES: 'cities',
  MESSAGES: 'messages',
  FRIENDS: 'friends',
  SUBSCRIPTIONS: 'subscriptions'
} as const;

// Database indexes for better performance
export const INDEXES = {
  USERS_BY_EMAIL: 'users_email',
  PROFESSIONALS_BY_CATEGORY: 'professionals_category',
  APPOINTMENTS_BY_USER: 'appointments_userId',
  APPOINTMENTS_BY_PROFESSIONAL: 'appointments_professionalId',
  REVIEWS_BY_PROFESSIONAL: 'reviews_professionalId',
  NOTIFICATIONS_BY_USER: 'notifications_userId'
} as const;

export default app;
