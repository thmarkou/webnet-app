import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { triggerAppointmentNotification } from '../../services/notifications/mockNotifications';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function BookAppointmentScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { professional } = route.params || {};
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [service, setService] = useState('');
  const [repair, setRepair] = useState('');
  const [notes, setNotes] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('el-GR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleBookAppointment = async () => {
    if (!selectedTime || !service || !repair) {
      Alert.alert('Σφάλμα', 'Παρακαλώ συμπληρώστε όλα τα απαραίτητα πεδία');
      return;
    }

    // Trigger appointment request notification
    await triggerAppointmentNotification(
      'appointment_request',
      {
        id: Date.now().toString(),
        professionalName: professional?.name || 'Επαγγελματίας',
        serviceName: service,
        date: `${formatDate(selectedDate)} στις ${selectedTime}`
      },
      professional?.id || 'pro1', // Professional's ID
      'user1' // User's ID
    );

    Alert.alert(
      'Επιτυχία',
      'Το ραντεβού σας έχει κλείσει επιτυχώς!',
      [
        {
          text: 'Εντάξει',
          onPress: () => navigation.navigate('AppointmentsList')
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Κλείσε Ραντεβού</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.professionalInfo}>
          <Text style={styles.professionalName}>
            {professional?.name || 'Γιάννης Παπαδόπουλος'}
          </Text>
          <Text style={styles.profession}>
            {professional?.profession || 'Ηλεκτρολόγος'}
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Ημερομηνία & Ώρα</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ημερομηνία *</Text>
              <TouchableOpacity 
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  {formatDate(selectedDate)}
                </Text>
                <Text style={styles.dateButtonIcon}>📅</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                />
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ώρα *</Text>
              <View style={styles.timeSlotsContainer}>
                {timeSlots.map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.timeSlot,
                      selectedTime === time && styles.selectedTimeSlot
                    ]}
                    onPress={() => setSelectedTime(time)}
                  >
                    <Text style={[
                      styles.timeSlotText,
                      selectedTime === time && styles.selectedTimeSlotText
                    ]}>
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Λεπτομέρειες Υπηρεσίας</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Τύπος Υπηρεσίας *</Text>
              <TextInput
                style={styles.input}
                placeholder="π.χ. Συντήρηση, Επισκευή, Εγκατάσταση"
                value={service}
                onChangeText={setService}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Επισκευή/Εργασία *</Text>
              <TextInput
                style={styles.input}
                placeholder="π.χ. Αντικατάσταση πρίζας, Συντήρηση πάνελ"
                value={repair}
                onChangeText={setRepair}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Σημειώσεις</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Επιπλέον πληροφορίες..."
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>

          <View style={styles.summarySection}>
            <Text style={styles.sectionTitle}>Σύνοψη Ραντεβού</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Επαγγελματίας:</Text>
                <Text style={styles.summaryValue}>
                  {professional?.name || 'Γιάννης Παπαδόπουλος'}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Ημερομηνία:</Text>
                <Text style={styles.summaryValue}>{formatDate(selectedDate)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Ώρα:</Text>
                <Text style={styles.summaryValue}>{selectedTime || 'Δεν επιλέχθηκε'}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Υπηρεσία:</Text>
                <Text style={styles.summaryValue}>{service || 'Δεν συμπληρώθηκε'}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Επισκευή:</Text>
                <Text style={styles.summaryValue}>{repair || 'Δεν συμπληρώθηκε'}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.bookButton}
            onPress={handleBookAppointment}
          >
            <Text style={styles.bookButtonText}>Κλείσε Ραντεβού</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
    padding: 15,
  },
  professionalInfo: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  professionalName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  profession: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '600',
  },
  formContainer: {
    flex: 1,
  },
  formSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeSlot: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedTimeSlot: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  timeSlotText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedTimeSlotText: {
    color: '#fff',
  },
  summarySection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  bookButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#f9f9f9',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  dateButtonIcon: {
    fontSize: 18,
  },
});
