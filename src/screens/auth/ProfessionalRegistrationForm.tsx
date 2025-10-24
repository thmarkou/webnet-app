import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/auth/authStore';

export default function ProfessionalRegistrationForm() {
  const navigation = useNavigation();
  const { register, isLoading } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    
    // Step 2: Business Information
    businessName: '',
    profession: '',
    vatNumber: '',
    website: '',
    about: '',
    
    // Step 3: Address Information
    country: 'Ελλάδα',
    city: '',
    address: '',
    postalCode: '',
  });

  const professions = [
    'Ηλεκτρολόγος',
    'Υδραυλικός',
    'Καθαριστής',
    'Μαθηματικός',
    'Φυσικός',
    'Χημικός'
  ];

  const cities = [
    'Αθήνα',
    'Θεσσαλονίκη',
    'Πάτρα',
    'Ηράκλειο',
    'Λάρισα',
    'Βόλος'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      await register({
        ...formData,
        role: 'professional'
      });
      // Navigation will be handled by RootNavigator
    } catch (error) {
      Alert.alert('Σφάλμα', 'Σφάλμα κατά την εγγραφή');
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Προσωπικές Πληροφορίες</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Όνομα *</Text>
        <TextInput
          style={styles.input}
          placeholder="Εισάγετε το όνομά σας"
          value={formData.firstName}
          onChangeText={(value) => handleInputChange('firstName', value)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Επώνυμο *</Text>
        <TextInput
          style={styles.input}
          placeholder="Εισάγετε το επώνυμό σας"
          value={formData.lastName}
          onChangeText={(value) => handleInputChange('lastName', value)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email *</Text>
        <TextInput
          style={styles.input}
          placeholder="Εισάγετε το email σας"
          value={formData.email}
          onChangeText={(value) => handleInputChange('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Τηλέφωνο *</Text>
        <TextInput
          style={styles.input}
          placeholder="Εισάγετε το τηλέφωνό σας"
          value={formData.phone}
          onChangeText={(value) => handleInputChange('phone', value)}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Κωδικός *</Text>
        <TextInput
          style={styles.input}
          placeholder="Εισάγετε τον κωδικό σας"
          value={formData.password}
          onChangeText={(value) => handleInputChange('password', value)}
          secureTextEntry
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Επιβεβαίωση Κωδικού *</Text>
        <TextInput
          style={styles.input}
          placeholder="Επιβεβαιώστε τον κωδικό σας"
          value={formData.confirmPassword}
          onChangeText={(value) => handleInputChange('confirmPassword', value)}
          secureTextEntry
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Πληροφορίες Επιχείρησης</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Όνομα Επιχείρησης *</Text>
        <TextInput
          style={styles.input}
          placeholder="Εισάγετε το όνομα της επιχείρησής σας"
          value={formData.businessName}
          onChangeText={(value) => handleInputChange('businessName', value)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Επάγγελμα *</Text>
        <View style={styles.dropdown}>
          <Text style={styles.dropdownText}>
            {formData.profession || 'Επιλέξτε το επάγγελμά σας'}
          </Text>
        </View>
        {professions.map((prof) => (
          <TouchableOpacity
            key={prof}
            style={[
              styles.option,
              formData.profession === prof && styles.selectedOption
            ]}
            onPress={() => handleInputChange('profession', prof)}
          >
            <Text style={[
              styles.optionText,
              formData.profession === prof && styles.selectedOptionText
            ]}>
              {prof}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>ΑΦΜ *</Text>
        <TextInput
          style={styles.input}
          placeholder="Εισάγετε τον ΑΦΜ σας"
          value={formData.vatNumber}
          onChangeText={(value) => handleInputChange('vatNumber', value)}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Website</Text>
        <TextInput
          style={styles.input}
          placeholder="Εισάγετε το URL του website σας (προαιρετικό)"
          value={formData.website}
          onChangeText={(value) => handleInputChange('website', value)}
          keyboardType="url"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Σχετικά με εσάς</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Περιγράψτε την εμπειρία και τις υπηρεσίες σας"
          value={formData.about}
          onChangeText={(value) => handleInputChange('about', value)}
          multiline
          numberOfLines={4}
        />
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Πληροφορίες Διεύθυνσης</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Χώρα *</Text>
        <TextInput
          style={styles.input}
          value={formData.country}
          editable={false}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Πόλη *</Text>
        <View style={styles.dropdown}>
          <Text style={styles.dropdownText}>
            {formData.city || 'Επιλέξτε την πόλη σας'}
          </Text>
        </View>
        {cities.map((city) => (
          <TouchableOpacity
            key={city}
            style={[
              styles.option,
              formData.city === city && styles.selectedOption
            ]}
            onPress={() => handleInputChange('city', city)}
          >
            <Text style={[
              styles.optionText,
              formData.city === city && styles.selectedOptionText
            ]}>
              {city}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Διεύθυνση *</Text>
        <TextInput
          style={styles.input}
          placeholder="Εισάγετε τη διεύθυνσή σας"
          value={formData.address}
          onChangeText={(value) => handleInputChange('address', value)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Ταχυδρομικός Κώδικας *</Text>
        <TextInput
          style={styles.input}
          placeholder="Εισάγετε τον ταχυδρομικό κώδικα"
          value={formData.postalCode}
          onChangeText={(value) => handleInputChange('postalCode', value)}
          keyboardType="numeric"
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Πίσω</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Εγγραφή Επαγγελματία</Text>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Βήμα {currentStep} από 3</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(currentStep / 3) * 100}%` }]} />
        </View>
      </View>

      <ScrollView style={styles.content}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </ScrollView>

      <View style={styles.buttonContainer}>
        {currentStep > 1 && (
          <TouchableOpacity style={styles.previousButton} onPress={handlePrevious}>
            <Text style={styles.previousButtonText}>Προηγούμενο</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={handleNext}
          disabled={isLoading}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === 3 ? 'Δημιουργία Λογαριασμού' : 'Επόμενο'}
          </Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 16,
    color: '#007bff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  progressContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  progressText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007bff',
    borderRadius: 2,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  stepContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
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
  dropdown: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedOption: {
    backgroundColor: '#e3f2fd',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  previousButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginRight: 10,
  },
  previousButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginLeft: 10,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
