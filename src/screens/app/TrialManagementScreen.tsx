import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/auth/authStore';
import { useSubscriptionStore } from '../../store/subscription/subscriptionStore';
import { trialService, TrialUser } from '../../services/subscription/trialService';
import { Ionicons } from '@expo/vector-icons';

export default function TrialManagementScreen() {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const { checkTrialExpirations } = useSubscriptionStore();

  const [trialUsers, setTrialUsers] = useState<TrialUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTrialUsers: 0,
    activeTrials: 0,
    expiredTrials: 0,
    expiringSoon: 0,
  });

  useEffect(() => {
    loadTrialData();
  }, []);

  const loadTrialData = async () => {
    setIsLoading(true);
    try {
      // Check for expirations and get notifications
      const notifications = checkTrialExpirations();
      
      // Get all trial users
      const allTrialUsers = trialService.getAllTrialUsers();
      setTrialUsers(allTrialUsers);
      
      // Get statistics
      const trialStats = trialService.getTrialStatistics();
      setStats(trialStats);
      
      // Show notifications if any
      if (notifications.length > 0) {
        Alert.alert(
          'Ειδοποιήσεις Δοκιμής',
          `Βρέθηκαν ${notifications.length} νέες ειδοποιήσεις για λήξη δοκιμών.`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error loading trial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('el-GR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getTrialStatusColor = (trialUser: TrialUser) => {
    if (trialUser.isExpired) return '#FF4D4F';
    if (trialUser.daysRemaining <= 1) return '#FF4D4F';
    if (trialUser.daysRemaining <= 5) return '#FF7A00';
    if (trialUser.daysRemaining <= 10) return '#FFA500';
    return '#52C41A';
  };

  const getTrialStatusText = (trialUser: TrialUser) => {
    if (trialUser.isExpired) return 'Λήξει';
    if (trialUser.daysRemaining <= 1) return 'Κρίσιμο';
    if (trialUser.daysRemaining <= 5) return 'Σύντομα';
    if (trialUser.daysRemaining <= 10) return 'Προσοχή';
    return 'Ενεργό';
  };

  const renderTrialUser = (trialUser: TrialUser) => (
    <View key={trialUser.userId} style={styles.trialUserCard}>
      <View style={styles.trialUserHeader}>
        <View style={styles.trialUserInfo}>
          <Text style={styles.trialUserName}>{trialUser.name}</Text>
          <Text style={styles.trialUserEmail}>{trialUser.email}</Text>
        </View>
        <View style={[styles.trialStatusBadge, { backgroundColor: getTrialStatusColor(trialUser) }]}>
          <Text style={styles.trialStatusText}>{getTrialStatusText(trialUser)}</Text>
        </View>
      </View>
      
      <View style={styles.trialUserDetails}>
        <View style={styles.trialDetailRow}>
          <Ionicons name="calendar" size={16} color="#666" />
          <Text style={styles.trialDetailLabel}>Έναρξη:</Text>
          <Text style={styles.trialDetailValue}>{formatDate(trialUser.trialStartDate)}</Text>
        </View>
        
        <View style={styles.trialDetailRow}>
          <Ionicons name="time" size={16} color="#666" />
          <Text style={styles.trialDetailLabel}>Λήξη:</Text>
          <Text style={styles.trialDetailValue}>{formatDate(trialUser.trialEndDate)}</Text>
        </View>
        
        <View style={styles.trialDetailRow}>
          <Ionicons name="hourglass" size={16} color="#666" />
          <Text style={styles.trialDetailLabel}>Απομένουν:</Text>
          <Text style={[styles.trialDetailValue, { color: getTrialStatusColor(trialUser) }]}>
            {trialUser.daysRemaining} ημέρες
          </Text>
        </View>
      </View>
    </View>
  );

  const renderStatsCard = (title: string, value: number, color: string, icon: string) => (
    <View style={[styles.statsCard, { borderLeftColor: color }]}>
      <View style={styles.statsContent}>
        <Ionicons name={icon as any} size={24} color={color} />
        <View style={styles.statsText}>
          <Text style={styles.statsValue}>{value}</Text>
          <Text style={styles.statsTitle}>{title}</Text>
        </View>
      </View>
    </View>
  );

  if (user?.role !== 'admin') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Διαχείριση Δοκιμών</Text>
        </View>
        <View style={styles.accessDeniedContainer}>
          <Ionicons name="lock-closed" size={48} color="#FF4D4F" />
          <Text style={styles.accessDeniedTitle}>Πρόσβαση Απαγορευμένη</Text>
          <Text style={styles.accessDeniedText}>
            Μόνο οι διαχειριστές μπορούν να έχουν πρόσβαση σε αυτή τη σελίδα.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Διαχείριση Δοκιμών</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Φόρτωση δεδομένων δοκιμών...</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
          {/* Statistics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Στατιστικά Δοκιμών</Text>
            <View style={styles.statsGrid}>
              {renderStatsCard('Συνολικές Δοκιμές', stats.totalTrialUsers, '#007AFF', 'people')}
              {renderStatsCard('Ενεργές Δοκιμές', stats.activeTrials, '#52C41A', 'checkmark-circle')}
              {renderStatsCard('Ληγμένες Δοκιμές', stats.expiredTrials, '#FF4D4F', 'close-circle')}
              {renderStatsCard('Λήγουν Σύντομα (≤10 ημ)', stats.expiringSoon, '#FF7A00', 'warning')}
            </View>
          </View>

          {/* Trial Users */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Χρήστες Δοκιμής</Text>
              <TouchableOpacity onPress={loadTrialData} style={styles.refreshButton}>
                <Ionicons name="refresh" size={20} color="#007AFF" />
              </TouchableOpacity>
            </View>
            
            {trialUsers.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="people-outline" size={48} color="#CCC" />
                <Text style={styles.emptyTitle}>Δεν υπάρχουν χρήστες δοκιμής</Text>
                <Text style={styles.emptySubtitle}>
                  Όταν οι χρήστες εγγραφούν, θα εμφανιστούν εδώ με δωρεάν δοκιμή 30 ημερών.
                </Text>
              </View>
            ) : (
              <View style={styles.trialUsersList}>
                {trialUsers.map(renderTrialUser)}
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 20,
    color: '#007AFF',
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  accessDeniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  accessDeniedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF4D4F',
    marginTop: 16,
    marginBottom: 8,
  },
  accessDeniedText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    padding: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: '48%',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    marginLeft: 12,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statsTitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  trialUsersList: {
    gap: 12,
  },
  trialUserCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  trialUserHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  trialUserInfo: {
    flex: 1,
  },
  trialUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  trialUserEmail: {
    fontSize: 14,
    color: '#666',
  },
  trialStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  trialStatusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  trialUserDetails: {
    gap: 8,
  },
  trialDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trialDetailLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    marginRight: 8,
    minWidth: 60,
  },
  trialDetailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
});
