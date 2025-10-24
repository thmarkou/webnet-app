import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/auth/authStore';
import { useNotificationStore } from '../../store/notifications/notificationStore';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { user, logout } = useAuthStore();
  const { unreadCount } = useNotificationStore();

  const actionCards = [
    {
      id: 'appointments',
      title: 'Τα Ραντεβού Μου',
      description: 'Δείτε τα επερχόμενα και προηγούμενα ραντεβού σας',
      icon: '📅',
      screen: 'AppointmentsList'
    },
    {
      id: 'notifications',
      title: 'Ειδοποιήσεις',
      description: 'Δείτε ενημερώσεις και επιβεβαιώσεις ραντεβού',
      icon: '🔔',
      screen: 'Notifications'
    },
    {
      id: 'find',
      title: 'Βρείτε Επαγγελματίες',
      description: 'Αναζητήστε τις υπηρεσίες που χρειάζεστε',
      icon: '🔍',
      screen: 'FindProfessionals'
    },
    {
      id: 'friends',
      title: 'Φίλοι',
      description: 'Συνδεθείτε με άλλους χρήστες',
      icon: '👥',
      screen: 'Friends'
    },
    {
      id: 'database',
      title: 'Διαχείριση Βάσης',
      description: 'Διαχείριση δεδομένων και αρχικοποίηση',
      icon: '🗄️',
      screen: 'DatabaseManagement'
    }
  ];

  const overviewMetrics = [
    { label: 'Κλεισμένα Ραντεβού', value: '12', color: '#3b82f6' },
    { label: 'Αυτό το Μήνα', value: '8', color: '#3b82f6' },
    { label: 'Μέση Αξιολόγηση', value: '4.8', color: '#3b82f6' },
    { label: 'Ξοδεύτηκε', value: '€1,200', color: '#3b82f6' }
  ];

  const handleLogout = () => {
    logout();
    // Navigation will be handled automatically by the RootNavigator
    // when isAuthenticated becomes false
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Action Cards */}
        <View style={styles.actionCardsContainer}>
          {actionCards.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={styles.actionCard}
              onPress={() => navigation.navigate(card.screen)}
              activeOpacity={0.8}
            >
              <View style={styles.actionCardContent}>
                <View style={styles.actionIcon}>
                  <Text style={styles.actionIconText}>{card.icon}</Text>
                  {/* Notification Badge for Notifications card */}
                  {card.id === 'notifications' && unreadCount > 0 && (
                    <View style={styles.notificationBadge}>
                      <Text style={styles.notificationBadgeText}>
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={styles.actionText}>
                  <Text style={styles.actionTitle}>{card.title}</Text>
                  <Text style={styles.actionDescription}>{card.description}</Text>
                </View>
                <Text style={styles.actionArrow}>→</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Overview Section */}
        <View style={styles.overviewContainer}>
          <Text style={styles.overviewTitle}>Overview</Text>
          <View style={styles.overviewGrid}>
            {overviewMetrics.map((metric, index) => (
              <View key={index} style={styles.overviewCard}>
                <Text style={[styles.overviewValue, { color: metric.color }]}>
                  {metric.value}
                </Text>
                <Text style={styles.overviewLabel}>{metric.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={styles.logoutText}>Αποσύνδεση</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  actionCardsContainer: {
    padding: 16,
  },
  actionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f3f4',
  },
  actionCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  actionIconText: {
    fontSize: 24,
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  notificationBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  actionArrow: {
    fontSize: 20,
    color: '#3b82f6',
    fontWeight: '600',
  },
  overviewContainer: {
    padding: 16,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  overviewCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f3f4',
  },
  overviewValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  logoutContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});