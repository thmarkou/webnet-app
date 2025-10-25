import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useSubscriptionStore } from '../store/subscription/subscriptionStore';
import { useAuthStore } from '../store/auth/authStore';
import { Ionicons } from '@expo/vector-icons';

interface TrialNotificationProps {
  onUpgradePress?: () => void;
}

export default function TrialNotification({ onUpgradePress }: TrialNotificationProps) {
  const { user } = useAuthStore();
  const { 
    getTrialUser, 
    getTrialDaysRemaining, 
    isTrialExpired, 
    getTrialNotifications 
  } = useSubscriptionStore();

  const [trialUser, setTrialUser] = useState<any>(null);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [isExpired, setIsExpired] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (user?.id) {
      const trial = getTrialUser(user.id);
      const days = getTrialDaysRemaining(user.id);
      const expired = isTrialExpired(user.id);
      const trialNotifications = getTrialNotifications(user.id);

      setTrialUser(trial);
      setDaysRemaining(days);
      setIsExpired(expired);
      setNotifications(trialNotifications);
    }
  }, [user?.id, getTrialUser, getTrialDaysRemaining, isTrialExpired, getTrialNotifications]);

  if (!trialUser || !trialUser.isTrialUser) {
    return null; // Not a trial user
  }

  const getNotificationStyle = () => {
    if (isExpired) {
      return styles.expiredNotification;
    } else if (daysRemaining <= 3) {
      return styles.urgentNotification;
    } else if (daysRemaining <= 7) {
      return styles.warningNotification;
    } else {
      return styles.infoNotification;
    }
  };

  const getNotificationIcon = () => {
    if (isExpired) {
      return 'alert-circle';
    } else if (daysRemaining <= 3) {
      return 'warning';
    } else if (daysRemaining <= 7) {
      return 'time';
    } else {
      return 'information-circle';
    }
  };

  const getNotificationText = () => {
    if (isExpired) {
      return 'Η δωρεάν δοκιμή σας έχει λήξει. Παρακαλώ επιλέξτε το πρόγραμμα Premium (€9.99/μήνα).';
    } else if (daysRemaining === 1) {
      return 'Η δωρεάν δοκιμή σας λήγει αύριο! Επιλέξτε το πρόγραμμα Premium (€9.99/μήνα).';
    } else if (daysRemaining <= 5) {
      return `Η δωρεάν δοκιμή σας λήγει σε ${daysRemaining} ημέρες. Επιλέξτε το πρόγραμμα Premium (€9.99/μήνα).`;
    } else if (daysRemaining <= 10) {
      return `Η δωρεάν δοκιμή σας λήγει σε ${daysRemaining} ημέρες. Επιλέξτε το πρόγραμμα Premium (€9.99/μήνα).`;
    } else {
      return `Δωρεάν δοκιμή: ${daysRemaining} ημέρες απομένουν από τα 90.`;
    }
  };

  const handleUpgradePress = () => {
    if (onUpgradePress) {
      onUpgradePress();
    } else {
      Alert.alert(
        'Αναβάθμιση Συνδρομής',
        'Θέλετε να αναβαθμίσετε το πρόγραμμα συνδρομής σας;',
        [
          { text: 'Όχι', style: 'cancel' },
          { text: 'Ναι', onPress: () => {
            // Navigate to subscription screen
            console.log('Navigate to subscription screen');
          }}
        ]
      );
    }
  };

  return (
    <View style={[styles.container, getNotificationStyle()]}>
      <View style={styles.content}>
        <Ionicons 
          name={getNotificationIcon()} 
          size={20} 
          color={isExpired ? '#FFFFFF' : '#333333'} 
          style={styles.icon}
        />
        <Text style={[styles.text, isExpired && styles.expiredText]}>
          {getNotificationText()}
        </Text>
      </View>
      
      {(isExpired || daysRemaining <= 7) && (
        <TouchableOpacity 
          style={[styles.upgradeButton, isExpired && styles.expiredUpgradeButton]} 
          onPress={handleUpgradePress}
        >
          <Text style={[styles.upgradeButtonText, isExpired && styles.expiredUpgradeButtonText]}>
            {isExpired ? 'Επιλέξτε Πρόγραμμα' : 'Αναβάθμιση'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoNotification: {
    backgroundColor: '#E6F7FF',
    borderColor: '#91D5FF',
    borderWidth: 1,
  },
  warningNotification: {
    backgroundColor: '#FFF7E6',
    borderColor: '#FFD591',
    borderWidth: 1,
  },
  urgentNotification: {
    backgroundColor: '#FFE6E6',
    borderColor: '#FFB3B3',
    borderWidth: 1,
  },
  expiredNotification: {
    backgroundColor: '#FF4D4F',
    borderColor: '#FF4D4F',
    borderWidth: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 12,
  },
  text: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    lineHeight: 20,
  },
  expiredText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  upgradeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  expiredUpgradeButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  expiredUpgradeButtonText: {
    color: '#FF4D4F',
  },
});
