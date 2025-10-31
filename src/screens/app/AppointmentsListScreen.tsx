import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/auth/authStore';

export default function AppointmentsListScreen() {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [appointments, setAppointments] = useState([]);

  const tabs = [
    { id: 'upcoming', title: 'Επερχόμενα' },
    { id: 'pending', title: 'Εκκρεμή' },
    { id: 'past', title: 'Παρελθόντα' }
  ];

  useEffect(() => {
    // TODO: Load appointments from Firestore
    // For now, load from database instead of mock data
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      // TODO: Implement getAppointments from Firestore
      // const appointmentsData = await getAppointments(user?.id);
      // setAppointments(appointmentsData);
      setAppointments([]); // Empty for now - no mock data
    } catch (error) {
      console.error('Error loading appointments:', error);
      setAppointments([]);
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    if (activeTab === 'upcoming') return apt.status === 'confirmed';
    if (activeTab === 'pending') return apt.status === 'pending';
    if (activeTab === 'past') return apt.status === 'completed';
    return false;
  });

  const renderAppointment = ({ item }) => (
    <View style={styles.appointmentCard}>
      <View style={styles.appointmentHeader}>
        <View style={styles.professionalInfo}>
          <Text style={styles.professionalName}>{item.professional}</Text>
          <Text style={styles.phoneNumber}>{item.phone}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ΣΤΟΙΧΕΙΑ ΕΠΑΓΓΕΛΜΑΤΙΑ</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>👤</Text>
          <Text style={styles.detailValue}>{item.professional}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>📞</Text>
          <Text style={styles.detailValue}>{item.phone}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>💼</Text>
          <Text style={styles.detailValue}>{item.profession}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ΣΤΟΙΧΕΙΑ ΡΑΝΤΕΒΟΥ</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>📅</Text>
          <Text style={styles.detailValue}>{item.day}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>🕐</Text>
          <Text style={styles.detailValue}>{item.time}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>🔧</Text>
          <Text style={styles.detailValue}>{item.service}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>🔨</Text>
          <Text style={styles.detailValue}>{item.repair}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ΤΟΠΟΘΕΣΙΑ</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>📍</Text>
          <Text style={styles.detailValue}>{item.town}, {item.country}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ΣΤΟΙΧΕΙΑ ΥΠΗΡΕΣΙΑΣ</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>⏱️</Text>
          <Text style={styles.detailValue}>{item.duration}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>💰</Text>
          <Text style={styles.detailValue}>{item.price}</Text>
        </View>
      </View>

      {item.notes && (
        <View style={styles.notesSection}>
          <Text style={styles.notesLabel}>Σημειώσεις:</Text>
          <Text style={styles.notesText}>{item.notes}</Text>
        </View>
      )}

      {item.status === 'pending' && (
        <View style={styles.statusBanner}>
          <Text style={styles.statusBannerIcon}>⏳</Text>
          <Text style={styles.statusBannerText}>Αναμονή επιβεβαίωσης ραντεβού από τον επαγγελματία.</Text>
        </View>
      )}
    </View>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'confirmed': return '#10b981';
      case 'completed': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Εκκρεμές';
      case 'confirmed': return 'Επιβεβαιωμένο';
      case 'completed': return 'Ολοκληρωμένο';
      default: return 'Άγνωστο';
    }
  };

  const getTabColor = (tabId) => {
    switch (tabId) {
      case 'upcoming': return '#3b82f6'; // Blue
      case 'pending': return '#f59e0b'; // Orange
      case 'past': return '#6b7280'; // Gray
      default: return '#6b7280';
    }
  };

  const getTabIcon = (tabId) => {
    switch (tabId) {
      case 'upcoming': return '📅';
      case 'pending': return '⏳';
      case 'past': return '✅';
      default: return '📅';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Τα Ραντεβού Μου</Text>
          <Text style={styles.userName}>{user?.name || 'Χρήστη'}</Text>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <View style={styles.tabRow}>
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabPill, 
                { 
                  backgroundColor: getTabColor(tab.id) + '20',
                  flex: 1,
                  marginHorizontal: 4
                }
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <View style={styles.tabPillContent}>
                <Text style={styles.tabPillIcon}>{getTabIcon(tab.id)}</Text>
                <Text style={[styles.tabPillText, { color: getTabColor(tab.id) }]}>
                  {tab.title}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredAppointments}
        renderItem={renderAppointment}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyTitle}>Δεν υπάρχουν επερχόμενα ραντεβού.</Text>
            <Text style={styles.emptySubtitle}>Δεν έχετε επερχόμενα ραντεβού.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backButtonText: {
    fontSize: 20,
    color: '#007AFF',
    fontWeight: '600',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  userName: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
    marginTop: 2,
  },
  tabContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  tabPillContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabPillIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  tabPillText: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    numberOfLines: 1,
  },
  listContainer: {
    padding: 16,
  },
  appointmentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  professionalInfo: {
    flex: 1,
  },
  professionalName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  phoneNumber: {
    fontSize: 15,
    color: '#6b7280',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 2,
  },
  detailIcon: {
    fontSize: 18,
    marginRight: 14,
    width: 24,
    textAlign: 'center',
  },
  detailValue: {
    fontSize: 15,
    color: '#1f2937',
    flex: 1,
    fontWeight: '500',
  },
  notesSection: {
    marginTop: 12,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#f3f4f6',
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
  },
  notesLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 6,
  },
  notesText: {
    fontSize: 15,
    color: '#6b7280',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#fbbf24',
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusBannerIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  statusBannerText: {
    fontSize: 15,
    color: '#92400e',
    flex: 1,
    fontWeight: '600',
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 24,
    opacity: 0.8,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: 28,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
});