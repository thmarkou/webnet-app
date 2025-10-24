import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function UpdateServiceDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { appointment } = route.params || {};
  
  const [serviceDetails, setServiceDetails] = useState({
    duration: appointment?.duration || '',
    price: appointment?.price || '',
    notes: appointment?.notes || '',
    materials: appointment?.materials || '',
    completionDate: appointment?.completionDate || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveDetails = async () => {
    if (!serviceDetails.duration || !serviceDetails.price) {
      Alert.alert('Σφάλμα', 'Παρακαλώ συμπληρώστε τη διάρκεια και την τιμή');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Επιτυχία',
        'Οι λεπτομέρειες υπηρεσίας ενημερώθηκαν επιτυχώς!',
        [
          {
            text: 'Εντάξει',
            onPress: () => navigation.goBack()
          }
        ]
      );
    }, 1500);
  };

  const handleInputChange = (field, value) => {
    setServiceDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Λεπτομέρειες Υπηρεσίας</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Appointment Info */}
        <View style={styles.appointmentCard}>
          <Text style={styles.cardTitle}>Πληροφορίες Ραντεβού</Text>
          <View style={styles.appointmentInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ημερομηνία:</Text>
              <Text style={styles.infoValue}>{appointment?.date || '15 Ιανουαρίου 2024'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ώρα:</Text>
              <Text style={styles.infoValue}>{appointment?.time || '10:00'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Υπηρεσία:</Text>
              <Text style={styles.infoValue}>{appointment?.service || 'Επισκευή Ηλεκτρικών'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Περιγραφή:</Text>
              <Text style={styles.infoValue}>{appointment?.repair || 'Επισκευή φωτισμού'}</Text>
            </View>
          </View>
        </View>

        {/* Service Details Form */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Λεπτομέρειες Υπηρεσίας</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Διάρκεια Εργασίας *</Text>
            <TextInput
              style={styles.input}
              value={serviceDetails.duration}
              onChangeText={(value) => handleInputChange('duration', value)}
              placeholder="π.χ. 2 ώρες"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Τιμή Υπηρεσίας (€) *</Text>
            <TextInput
              style={styles.input}
              value={serviceDetails.price}
              onChangeText={(value) => handleInputChange('price', value)}
              placeholder="π.χ. 150"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ημερομηνία Ολοκλήρωσης</Text>
            <TextInput
              style={styles.input}
              value={serviceDetails.completionDate}
              onChangeText={(value) => handleInputChange('completionDate', value)}
              placeholder="π.χ. 15 Ιανουαρίου 2024"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Υλικά που Χρησιμοποιήθηκαν</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={serviceDetails.materials}
              onChangeText={(value) => handleInputChange('materials', value)}
              placeholder="π.χ. Καλώδια, διακόπτες, πρίζες..."
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Σημειώσεις Εργασίας</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={serviceDetails.notes}
              onChangeText={(value) => handleInputChange('notes', value)}
              placeholder="Περιγράψτε την εργασία που εκτελέστηκε..."
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        {/* Guidelines */}
        <View style={styles.guidelinesSection}>
          <Text style={styles.guidelinesTitle}>Οδηγίες Συμπλήρωσης</Text>
          
          <View style={styles.guidelineItem}>
            <Text style={styles.guidelineIcon}>⏱️</Text>
            <Text style={styles.guidelineText}>
              <Text style={styles.guidelineBold}>Διάρκεια:</Text> Συμπληρώστε την πραγματική διάρκεια της εργασίας
            </Text>
          </View>
          
          <View style={styles.guidelineItem}>
            <Text style={styles.guidelineIcon}>💰</Text>
            <Text style={styles.guidelineText}>
              <Text style={styles.guidelineBold}>Τιμή:</Text> Η τελική τιμή που χρεώθηκε στον πελάτη
            </Text>
          </View>
          
          <View style={styles.guidelineItem}>
            <Text style={styles.guidelineIcon}>📅</Text>
            <Text style={styles.guidelineText}>
              <Text style={styles.guidelineBold}>Ημερομηνία:</Text> Πότε ολοκληρώθηκε η εργασία
            </Text>
          </View>
          
          <View style={styles.guidelineItem}>
            <Text style={styles.guidelineIcon}>🔧</Text>
            <Text style={styles.guidelineText}>
              <Text style={styles.guidelineBold}>Υλικά:</Text> Τα υλικά που χρησιμοποιήθηκαν
            </Text>
          </View>
          
          <View style={styles.guidelineItem}>
            <Text style={styles.guidelineIcon}>📝</Text>
            <Text style={styles.guidelineText}>
              <Text style={styles.guidelineBold}>Σημειώσεις:</Text> Λεπτομέρειες για την εργασία που εκτελέστηκε
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.submitContainer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            isSubmitting && styles.submitButtonDisabled
          ]}
          onPress={handleSaveDetails}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Αποθήκευση...' : 'Αποθήκευση Λεπτομερειών'}
          </Text>
        </TouchableOpacity>
      </View>
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
  content: {
    flex: 1,
    padding: 16,
  },
  appointmentCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  appointmentInfo: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  guidelinesSection: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  guidelinesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  guidelineIcon: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  guidelineText: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
    lineHeight: 20,
  },
  guidelineBold: {
    fontWeight: '600',
    color: '#374151',
  },
  submitContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f3f4',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
