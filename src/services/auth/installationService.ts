/**
 * Installation Service
 * Manages one-user-per-installation system
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

const INSTALLATION_ID_KEY = 'app_installation_id';

/**
 * Get or create unique installation ID
 * This ensures one user per installation
 */
export const getInstallationId = async (): Promise<string> => {
  try {
    // Try to get existing installation ID
    let installationId = await AsyncStorage.getItem(INSTALLATION_ID_KEY);
    
    if (installationId) {
      return installationId;
    }
    
    // Create new installation ID
    // Combine device info for uniqueness
    const deviceId = Device.modelId || 'unknown';
    const osVersion = Device.osVersion || 'unknown';
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    
    installationId = `install_${Platform.OS}_${deviceId}_${osVersion}_${timestamp}_${random}`;
    
    // Store for future use
    await AsyncStorage.setItem(INSTALLATION_ID_KEY, installationId);
    
    console.log('✅ Created installation ID:', installationId);
    return installationId;
  } catch (error) {
    console.error('Error getting installation ID:', error);
    // Fallback: use timestamp-based ID
    return `install_fallback_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }
};

/**
 * Check if installation already has a user
 */
export const hasInstallationUser = async (): Promise<boolean> => {
  try {
    const installationId = await getInstallationId();
    const userJson = await AsyncStorage.getItem('app_current_user');
    
    if (userJson) {
      const user = JSON.parse(userJson);
      return user.installationId === installationId;
    }
    
    return false;
  } catch (error) {
    return false;
  }
};

/**
 * Link user to installation
 */
export const linkUserToInstallation = async (userId: string): Promise<void> => {
  try {
    const installationId = await getInstallationId();
    await AsyncStorage.setItem('app_current_user', JSON.stringify({
      userId,
      installationId,
      linkedAt: new Date().toISOString()
    }));
    console.log('✅ User linked to installation:', userId, installationId);
  } catch (error) {
    console.error('Error linking user to installation:', error);
  }
};

