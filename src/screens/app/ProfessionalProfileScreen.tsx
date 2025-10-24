import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/auth/authStore';

export default function ProfessionalProfileScreen() {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  
  const [profileData, setProfileData] = useState({
    firstName: 'Γιάννης',
    lastName: 'Παπαδόπουλος',
    email: 'giannis@example.com',
    phone: '+30 210 1234567',
    profession: 'Ηλεκτρολόγος',
    businessName: 'Ηλεκτρολογικές Επισκευές Παπαδόπουλος',
    vatNumber: '123456789',
    website: 'www.giannis-electric.gr',
    about: 'Εξειδικευμένος ηλεκτρολόγος με 15+ χρόνια εμπειρίας. Ειδικεύομαι σε οικιακές και εμπορικές ηλεκτρολογικές εγκαταστάσεις.',
    address: {
      number: '15',
      area: 'Κέντρο',
      postalCode: '10678',
      city: 'Αθήνα',
      country: 'Ελλάδα'
    },
    services: [
      { name: 'Επισκευή Ηλεκτρικών', price: '€50', duration: '2 ώρες' },
      { name: 'Εγκατάσταση Φωτισμού', price: '€80', duration: '3 ώρες' },
      { name: 'Συντήρηση Ηλεκτρικού', price: '€30', duration: '1 ώρα' }
    ]
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSaveProfile = () => {
    Alert.alert('Επιτυχία', 'Το προφίλ σας ενημερώθηκε επιτυχώς!');
    setIsEditing(false);
  };

  const handleAddService = () => {
    Alert.alert('Προσθήκη Υπηρεσίας', 'Η λειτουργία προσθήκης νέας υπηρεσίας θα προστεθεί σύντομα.');
  };

  const handleEditService = (serviceId) => {
    Alert.alert('Επεξεργασία Υπηρεσίας', `Επεξεργασία υπηρεσίας ${serviceId}`);
  };

  const handleDeleteService = (serviceId) => {
    Alert.alert(
      'Διαγραφή Υπηρεσίας',
      'Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή την υπηρεσία;',
      [
        { text: 'Ακύρωση', style: 'cancel' },
        { text: 'Διαγραφή', style: 'destructive', onPress: () => {
          setProfileData(prev => ({
            ...prev,
            services: prev.services.filter(service => service.name !== serviceId)
          }));
        }}
      ]
    );
  };

  const renderService = (service, index) => (
    <View key={index} style={styles.serviceCard}>
      <View style={styles.serviceHeader}>
        <Text style={styles.serviceName}>{service.name}</Text>
        <View style={styles.serviceActions}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => handleEditService(service.name)}
          >
            <Text style={styles.editButtonText}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => handleDeleteService(service.name)}
          >
            <Text style={styles.deleteButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.serviceDetails}>
        <Text style={styles.servicePrice}>Τιμή: {service.price}</Text>
        <Text style={styles.serviceDuration}>Διάρκεια: {service.duration}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Προφίλ Επαγγελματία</Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Text style={styles.editButtonText}>{isEditing ? 'Αποθήκευση' : 'Επεξεργασία'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Profile Photo */}
        <View style={styles.photoSection}>
          <View style={styles.photoContainer}>
            <Text style={styles.photoPlaceholder}>📷</Text>
          </View>
          {isEditing && (
            <TouchableOpacity style={styles.changePhotoButton}>
              <Text style={styles.changePhotoText}>Αλλαγή Φωτογραφίας</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Προσωπικές Πληροφορίες</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Όνομα *</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={profileData.firstName}
              onChangeText={(text) => setProfileData(prev => ({ ...prev, firstName: text }))}
              editable={isEditing}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Επώνυμο *</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={profileData.lastName}
              onChangeText={(text) => setProfileData(prev => ({ ...prev, lastName: text }))}
              editable={isEditing}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={profileData.email}
              onChangeText={(text) => setProfileData(prev => ({ ...prev, email: text }))}
              editable={isEditing}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Τηλέφωνο *</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={profileData.phone}
              onChangeText={(text) => setProfileData(prev => ({ ...prev, phone: text }))}
              editable={isEditing}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Business Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Επαγγελματικές Πληροφορίες</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Επάγγελμα *</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={profileData.profession}
              onChangeText={(text) => setProfileData(prev => ({ ...prev, profession: text }))}
              editable={isEditing}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Όνομα Επιχείρησης *</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={profileData.businessName}
              onChangeText={(text) => setProfileData(prev => ({ ...prev, businessName: text }))}
              editable={isEditing}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>ΑΦΜ *</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={profileData.vatNumber}
              onChangeText={(text) => setProfileData(prev => ({ ...prev, vatNumber: text }))}
              editable={isEditing}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ιστοσελίδα</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={profileData.website}
              onChangeText={(text) => setProfileData(prev => ({ ...prev, website: text }))}
              editable={isEditing}
              placeholder="https://example.com"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Σχετικά με εσάς</Text>
            <TextInput
              style={[styles.textArea, !isEditing && styles.inputDisabled]}
              value={profileData.about}
              onChangeText={(text) => setProfileData(prev => ({ ...prev, about: text }))}
              editable={isEditing}
              multiline
              numberOfLines={4}
              placeholder="Περιγράψτε την εμπειρία και τις υπηρεσίες σας..."
            />
          </View>
        </View>

        {/* Address Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Διεύθυνση</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Αριθμός *</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={profileData.address.number}
              onChangeText={(text) => setProfileData(prev => ({ 
                ...prev, 
                address: { ...prev.address, number: text } 
              }))}
              editable={isEditing}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Περιοχή *</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={profileData.address.area}
              onChangeText={(text) => setProfileData(prev => ({ 
                ...prev, 
                address: { ...prev.address, area: text } 
              }))}
              editable={isEditing}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ταχυδρομικός Κώδικας *</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={profileData.address.postalCode}
              onChangeText={(text) => setProfileData(prev => ({ 
                ...prev, 
                address: { ...prev.address, postalCode: text } 
              }))}
              editable={isEditing}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Πόλη *</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={profileData.address.city}
              onChangeText={(text) => setProfileData(prev => ({ 
                ...prev, 
                address: { ...prev.address, city: text } 
              }))}
              editable={isEditing}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Χώρα *</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={profileData.address.country}
              onChangeText={(text) => setProfileData(prev => ({ 
                ...prev, 
                address: { ...prev.address, country: text } 
              }))}
              editable={isEditing}
            />
          </View>
        </View>

        {/* Services */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Υπηρεσίες</Text>
            {isEditing && (
              <TouchableOpacity style={styles.addServiceButton} onPress={handleAddService}>
                <Text style={styles.addServiceText}>+ Προσθήκη Υπηρεσίας</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {profileData.services.map(renderService)}
        </View>

        {/* Action Buttons */}
        {isEditing && (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
              <Text style={styles.saveButtonText}>Αποθήκευση Αλλαγών</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => setIsEditing(false)}
            >
              <Text style={styles.cancelButtonText}>Ακύρωση</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
  editButton: {
    padding: 8,
  },
  editButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  photoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  photoPlaceholder: {
    fontSize: 40,
  },
  changePhotoButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  changePhotoText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  inputDisabled: {
    backgroundColor: '#f9fafb',
    color: '#6b7280',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#ffffff',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  serviceCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  serviceActions: {
    flexDirection: 'row',
  },
  editButton: {
    padding: 4,
    marginRight: 8,
  },
  deleteButton: {
    padding: 4,
  },
  editButtonText: {
    fontSize: 16,
  },
  deleteButtonText: {
    fontSize: 16,
  },
  serviceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  servicePrice: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '600',
  },
  serviceDuration: {
    fontSize: 14,
    color: '#6b7280',
  },
  addServiceButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addServiceText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtons: {
    marginTop: 24,
    marginBottom: 32,
  },
  saveButton: {
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
