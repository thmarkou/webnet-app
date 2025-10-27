import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { geocodingService } from '../../services/geocoding/geocodingService';

interface ProfessionalFormData {
  firstName: string;
  lastName: string;
  profession: string;
  streetName: string;
  streetNumber: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  description: string;
}

export default function AddProfessionalScreen() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProfessionalFormData>({
    firstName: '',
    lastName: '',
    profession: '',
    streetName: '',
    streetNumber: '',
    postalCode: '',
    city: '',
    country: 'Ελλάδα',
    phone: '',
    email: '',
    description: '',
  });

  const handleInputChange = (field: keyof ProfessionalFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    const requiredFields: (keyof ProfessionalFormData)[] = [
      'firstName',
      'lastName',
      'profession',
      'streetName',
      'streetNumber',
      'postalCode',
      'city',
      'phone',
      'email',
    ];

    for (const field of requiredFields) {
      if (!formData[field].trim()) {
        Alert.alert('Σφάλμα', `Το πεδίο ${getFieldLabel(field)} είναι υποχρεωτικό.`);
        return false;
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Σφάλμα', 'Παρακαλώ εισάγετε ένα έγκυρο email.');
      return false;
    }

    // Validate phone format (Greek phone numbers)
    const phoneRegex = /^(\+30|0030)?[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      Alert.alert('Σφάλμα', 'Παρακαλώ εισάγετε ένα έγκυρο τηλέφωνο.');
      return false;
    }

    return true;
  };

  const getFieldLabel = (field: keyof ProfessionalFormData): string => {
    const labels: { [key in keyof ProfessionalFormData]: string } = {
      firstName: 'Όνομα',
      lastName: 'Επώνυμο',
      profession: 'Επάγγελμα',
      streetName: 'Οδός',
      streetNumber: 'Αριθμός',
      postalCode: 'Ταχυδρομικός Κώδικας',
      city: 'Πόλη',
      country: 'Χώρα',
      phone: 'Τηλέφωνο',
      email: 'Email',
      description: 'Περιγραφή',
    };
    return labels[field];
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Construct full address from separate fields
      const fullAddress = `${formData.streetName} ${formData.streetNumber}`;
      
      // Get coordinates from address using geocoding
      const geocodingResult = await geocodingService.geocodeAddress(
        fullAddress,
        formData.postalCode,
        formData.city,
        formData.country
      );

      if (!geocodingResult.success) {
        Alert.alert('Σφάλμα', 'Δεν ήταν δυνατή η εύρεση των συντεταγμένων της διεύθυνσης.');
        setIsLoading(false);
        return;
      }

      // Create professional object
      const newProfessional = {
        id: Date.now().toString(), // Simple ID generation
        name: `${formData.firstName} ${formData.lastName}`,
        profession: formData.profession,
        category: formData.profession.toLowerCase().replace(/\s+/g, '_'),
        city: formData.city.toLowerCase(),
        rating: 0, // New professional starts with 0 rating
        reviewCount: 0,
        price: '€0-0', // To be set later
        distance: '0 km',
        availability: 'Διαθέσιμος',
        services: [formData.profession], // Default service
        description: formData.description || `Επαγγελματίας ${formData.profession}`,
        image: '👨‍💼', // Default icon
        verified: false, // New professionals are not verified initially
        responseTime: '2 ώρες', // Default response time
        completionRate: '0%', // New professional starts with 0%
        phone: formData.phone,
        email: formData.email,
        address: `${formData.streetName} ${formData.streetNumber}, ${formData.postalCode} ${formData.city}, ${formData.country}`,
        coordinates: {
          latitude: geocodingResult.latitude,
          longitude: geocodingResult.longitude,
        },
      };

      // Save to AsyncStorage
      try {
        const existingProfessionals = await AsyncStorage.getItem('customProfessionals');
        const professionalsArray = existingProfessionals ? JSON.parse(existingProfessionals) : [];
        professionalsArray.push(newProfessional);
        await AsyncStorage.setItem('customProfessionals', JSON.stringify(professionalsArray));
        console.log('Professional saved to AsyncStorage:', newProfessional.name);
      } catch (storageError) {
        console.error('Error saving to AsyncStorage:', storageError);
      }

      Alert.alert(
        '✅ Επιτυχής Καταχώρηση',
        `Ο επαγγελματίας "${newProfessional.name}" καταχωρήθηκε επιτυχώς στη βάση δεδομένων!\n\nΟ επαγγελματίας εμφανίζεται στη λίστα επαγγελματιών.`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setFormData({
                firstName: '',
                lastName: '',
                profession: '',
                streetName: '',
                streetNumber: '',
                postalCode: '',
                city: '',
                country: 'Ελλάδα',
                phone: '',
                email: '',
                description: '',
              });
              // Navigate to FindProfessionalsScreen to see the new professional
              navigation.navigate('FindProfessionals');
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error adding professional:', error);
      Alert.alert(
        '❌ Σφάλμα Καταχώρησης',
        `Η καταχώρηση του επαγγελματία απέτυχε.\n\nΠαρακαλώ ελέγξτε τα στοιχεία και δοκιμάστε ξανά.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Προσθήκη Επαγγελματία</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Προσωπικά Στοιχεία</Text>
          
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Όνομα *</Text>
              <TextInput
                style={styles.input}
                value={formData.firstName}
                onChangeText={(value) => handleInputChange('firstName', value)}
                placeholder="Εισάγετε το όνομά σας"
              />
            </View>
            
            <View style={styles.halfInput}>
              <Text style={styles.label}>Επώνυμο *</Text>
              <TextInput
                style={styles.input}
                value={formData.lastName}
                onChangeText={(value) => handleInputChange('lastName', value)}
                placeholder="Εισάγετε το επώνυμό σας"
              />
            </View>
          </View>

          <Text style={styles.label}>Επάγγελμα *</Text>
          <TextInput
            style={styles.input}
            value={formData.profession}
            onChangeText={(value) => handleInputChange('profession', value)}
            placeholder="π.χ. Ηλεκτρολόγος, Υδραυλικός"
          />
        </View>

        {/* Address Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Διεύθυνση</Text>
          
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Οδός *</Text>
              <TextInput
                style={styles.input}
                value={formData.streetName}
                onChangeText={(value) => handleInputChange('streetName', value)}
                placeholder="π.χ. Ιωνίας"
              />
            </View>
            
            <View style={styles.halfInput}>
              <Text style={styles.label}>Αριθμός *</Text>
              <TextInput
                style={styles.input}
                value={formData.streetNumber}
                onChangeText={(value) => handleInputChange('streetNumber', value)}
                placeholder="π.χ. 71"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Ταχυδρομικός Κώδικας *</Text>
              <TextInput
                style={styles.input}
                value={formData.postalCode}
                onChangeText={(value) => handleInputChange('postalCode', value)}
                placeholder="π.χ. 54453"
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.halfInput}>
              <Text style={styles.label}>Πόλη *</Text>
              <TextInput
                style={styles.input}
                value={formData.city}
                onChangeText={(value) => handleInputChange('city', value)}
                placeholder="π.χ. Θεσσαλονίκη"
              />
            </View>
          </View>

          <Text style={styles.label}>Χώρα</Text>
          <TextInput
            style={styles.input}
            value={formData.country}
            onChangeText={(value) => handleInputChange('country', value)}
            placeholder="Ελλάδα"
          />
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Στοιχεία Επικοινωνίας</Text>
          
          <Text style={styles.label}>Τηλέφωνο *</Text>
          <TextInput
            style={styles.input}
            value={formData.phone}
            onChangeText={(value) => handleInputChange('phone', value)}
            placeholder="π.χ. +30 210 1234567"
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            placeholder="π.χ. example@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Περιγραφή</Text>
          <Text style={styles.label}>Περιγραφή Επαγγέλματος</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={(value) => handleInputChange('description', value)}
            placeholder="Περιγράψτε την εμπειρία και τις υπηρεσίες σας..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.submitButtonText}>Προσθήκη Επαγγελματία</Text>
          )}
        </TouchableOpacity>

        {/* Info Text */}
        <Text style={styles.infoText}>
          * Τα συντεταγμένες θα υπολογιστούν αυτόματα από τη διεύθυνση που εισάγετε.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 5,
  },
  backButtonIcon: {
    fontSize: 20,
    color: '#007AFF',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 30,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 15,
    paddingBottom: 100,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
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
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 1,
    marginRight: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  textArea: {
    height: 100,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
