import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { triggerAppointmentNotification } from '../../services/notifications/mockNotifications';

export default function ProfessionalAppointmentsScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('pending');
  const [appointments, setAppointments] = useState([]);

  const tabs = [
    { id: 'pending', title: 'Εκκρεμή' },
    { id: 'confirmed', title: 'Επιβεβαιωμένα' },
    { id: 'completed', title: 'Ολοκληρωμένα' }
  ];

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      // TODO: Load appointments from Firestore for professional
      // const appointmentsData = await getProfessionalAppointments(user?.id);
      // setAppointments(appointmentsData);
      setAppointments([]); // Empty for now - no mock data
    } catch (error) {
      console.error('Error loading appointments:', error);
      setAppointments([]);
    }
  };

  const filteredAppointments = appointments.filter(apt => apt.status === activeTab);

  const handleAppointmentAction = (appointmentId: string, action: 'accept' | 'reject' | 'complete') => {
    // Handle appointment actions
    console.log(`Appointment ${appointmentId} ${action}ed`);
  };

  const renderAppointment = ({ item }) => (
    <View style={styles.appointmentCard}>
      <View style={styles.appointmentHeader}>
        <Text style={styles.userName}>{item.user}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <View style={styles.appointmentDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Email:</Text>
          <Text style={styles.detailValue}>{item.userEmail}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Τηλέφωνο:</Text>
          <Text style={styles.detailValue}>{item.userPhone}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Ημέρα:</Text>
          <Text style={styles.detailValue}>{item.day}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Ώρα:</Text>
          <Text style={styles.detailValue}>{item.time}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Υπηρεσία:</Text>
          <Text style={styles.detailValue}>{item.service}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Επισκευή:</Text>
          <Text style={styles.detailValue}>{item.repair}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Πόλη:</Text>
          <Text style={styles.detailValue}>{item.town}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Χώρα:</Text>
          <Text style={styles.detailValue}>{item.country}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Διάρκεια:</Text>
          <Text style={styles.detailValue}>{item.duration}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Τιμή:</Text>
          <Text style={styles.detailValue}>{item.price}</Text>
        </View>

        {item.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>Σημειώσεις:</Text>
            <Text style={styles.notesText}>{item.notes}</Text>
          </View>
        )}
      </View>

      {item.status === 'pending' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.acceptButton}
            onPress={() => handleAppointmentAction(item.id, 'accept')}
          >
            <Text style={styles.acceptButtonText}>Αποδοχή</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.rejectButton}
            onPress={() => handleAppointmentAction(item.id, 'reject')}
          >
            <Text style={styles.rejectButtonText}>Απόρριψη</Text>
          </TouchableOpacity>
        </View>
      )}

      {item.status === 'confirmed' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.completeButton}
            onPress={() => handleAppointmentAction(item.id, 'complete')}
          >
            <Text style={styles.completeButtonText}>Ολοκλήρωση</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffa500';
      case 'confirmed': return '#4caf50';
      case 'completed': return '#2196f3';
      default: return '#666';
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

  const handleAppointmentAction = async (appointmentId, action) => {
    // Update appointment status
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: action === 'accept' ? 'confirmed' : 'rejected' }
          : apt
      )
    );

    // Trigger notification to user
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (appointment) {
      await triggerAppointmentNotification(
        action === 'accept' ? 'appointment_confirmed' : 'appointment_rejected',
        {
          id: appointmentId,
          professionalName: 'Επαγγελματίας',
          serviceName: appointment.service,
          date: `${appointment.day} στις ${appointment.time}`
        },
        appointment.userId || 'user1', // User's ID
        'pro1' // Professional's ID
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Πίσω</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Τα Ραντεβού Μου</Text>
      </View>

      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredAppointments}
        renderItem={renderAppointment}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Δεν υπάρχουν ραντεβού</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 15,
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
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#007bff',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 15,
  },
  appointmentCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  appointmentDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  notesContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  notesLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginBottom: 5,
  },
  notesText: {
    fontSize: 14,
    color: '#333',
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 10,
  },
  acceptButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    flex: 1,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  rejectButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    flex: 1,
    alignItems: 'center',
  },
  rejectButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  completeButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    flex: 1,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});
