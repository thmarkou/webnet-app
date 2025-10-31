/**
 * Admin Authentication Service
 * Handles admin code authentication for sensitive operations
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/realConfig';

const ADMIN_CODE_KEY = 'app_admin_code';
const ADMIN_AUTH_KEY = 'app_admin_authenticated';

// Admin code - CHANGE THIS TO YOUR SECRET CODE
const ADMIN_SECRET_CODE = process.env.EXPO_PUBLIC_ADMIN_CODE || 'WEBNET_ADMIN_2024_SECRET';

/**
 * Verify admin code
 */
export const verifyAdminCode = async (code: string): Promise<boolean> => {
  try {
    // Check against secret code
    if (code === ADMIN_SECRET_CODE) {
      // Store authentication status
      await AsyncStorage.setItem(ADMIN_AUTH_KEY, 'true');
      await AsyncStorage.setItem(ADMIN_CODE_KEY, code);
      
      // Also store in Firestore admin document (if admin document exists)
      try {
        const adminDocRef = doc(db, 'admin', 'auth');
        await setDoc(adminDocRef, {
          adminCode: ADMIN_SECRET_CODE,
          authenticated: true,
          lastAuth: new Date(),
        }, { merge: true });
      } catch (firestoreError) {
        console.log('⚠️ Could not update Firestore admin doc (might not exist yet)');
      }
      
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error verifying admin code:', error);
    return false;
  }
};

/**
 * Check if admin is currently authenticated
 */
export const isAdminAuthenticated = async (): Promise<boolean> => {
  try {
    const authStatus = await AsyncStorage.getItem(ADMIN_AUTH_KEY);
    return authStatus === 'true';
  } catch (error) {
    return false;
  }
};

/**
 * Require admin authentication for sensitive operations
 * Throws error if not authenticated
 */
export const requireAdminAuth = async (): Promise<void> => {
  const isAuthenticated = await isAdminAuthenticated();
  if (!isAuthenticated) {
    throw new Error('ADMIN_REQUIRED: Αυτή η λειτουργία απαιτεί admin authentication');
  }
};

/**
 * Clear admin authentication
 */
export const clearAdminAuth = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(ADMIN_AUTH_KEY);
    await AsyncStorage.removeItem(ADMIN_CODE_KEY);
  } catch (error) {
    console.error('Error clearing admin auth:', error);
  }
};

/**
 * Prompt for admin code (to be used in UI)
 */
export const promptAdminCode = async (): Promise<string | null> => {
  // This should be called from UI component with Alert
  // For now, just return null - UI should handle the prompt
  return null;
};

