import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Real Firebase configuration - Replace with your actual Firebase project config
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "your-api-key-here",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "your-app-id",
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-XXXXXXXXXX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

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
