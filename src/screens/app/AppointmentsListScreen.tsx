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

export default function AppointmentsListScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [appointments, setAppointments] = useState([]);

  const tabs = [
    { id: 'upcoming', title: 'Επερχόμενα' },
    { id: 'pending', title: 'Εκκρεμή' },
    { id: 'past', title: 'Παρελθόντα' }
  ];

  const mockAppointments = [
    {
      id: '1',
      professional: 'George Papadopoulos',
      phone: '+30 123 456 7890',
      profession: 'Υδραυλικός',
      day: 'Δευτέρα, 15/01/2024',
      time: '10:00',
      service: 'Επισκευή Υδραυλικών',
      repair: 'Επισκευή διαρροής νεροχύτη κουζίνας',
      town: 'Αθήνα',
      country: 'Ελλάδα',
      duration: '60 λεπτά',
      price: '€80',
      status: 'pending',
      notes: 'Διαρροή νεροχύτη κουζίνας'
    },
    {
      id: '2',
      professional: 'Maria Konstantinou',
      phone: '+30 987 654 3210',
      profession: 'Ηλεκτρολόγος',
      day: 'Τρίτη, 16/01/2024',
      time: '14:00',
      service: 'Ηλεκτρικές Εγκαταστάσεις',
      repair: 'Εγκατάσταση έξυπνου συστήματος σπιτιού',
      town: 'Αθήνα',
      country: 'Ελλάδα',
      duration: '120 λεπτά',
      price: '€150',
      status: 'confirmed',
      notes: 'Χρειάζεται εγκατάσταση έξυπνων διακοπτών'
    }
  ];

  useEffect(() => {
    setAppointments(mockAppointments);
  }, []);

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
        <Text style={styles.title}>Τα Ραντεβού Μου</Text>
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
              <Text style={[styles.tabPillText, { color: getTabColor(tab.id) }]}>
                {getTabIcon(tab.id)} {tab.title}
              </Text>
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
    textAlign: 'center',
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
  tabPillText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    numberOfLines: 1,
  },
  listContainer: {
    padding: 16,
  },
  appointmentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f3f4',
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
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  phoneNumber: {
    fontSize: 14,
    color: '#6b7280',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailIcon: {
    fontSize: 16,
    marginRight: 12,
    width: 20,
  },
  detailValue: {
    fontSize: 14,
    color: '#1f2937',
    flex: 1,
  },
  notesSection: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f3f4',
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  statusBannerIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  statusBannerText: {
    fontSize: 14,
    color: '#92400e',
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});