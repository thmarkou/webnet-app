import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/auth/authStore';

export default function ProfessionalRegistrationForm() {
  const navigation = useNavigation();
  const { register, isLoading } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [showProfessionDropdown, setShowProfessionDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    
    // Step 2: Business Information
    businessName: '',
    profession: '',
    vatNumber: '',
    website: '',
    about: '',
    
    // Step 3: Address Information
    number: '',
    area: '',
    postalCode: '',
    country: 'Greece',
    city: '',
    
    // Step 4: Service Information
    serviceName: '',
    serviceDescription: '',
    duration: '',
    price: '',
  });

  const professions = [
    'Electrician',
    'Plumber',
    'Lawyer',
    'Cleaner',
    'Mechanic',
    'Doctor'
  ];

  const cities = [
    'Athens',
    'Thessaloniki',
    'Patras',
    'Heraklion',
    'Larissa',
    'Volos'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    // Close all dropdowns
    setShowProfessionDropdown(false);
    setShowCityDropdown(false);
    setShowCountryDropdown(false);
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    // Close all dropdowns
    setShowProfessionDropdown(false);
    setShowCityDropdown(false);
    setShowCountryDropdown(false);
    
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
      Alert.alert('Error', 'Registration failed');
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Personal Information</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>First Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your first name"
          value={formData.firstName}
          onChangeText={(value) => handleInputChange('firstName', value)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Last Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your last name"
          value={formData.lastName}
          onChangeText={(value) => handleInputChange('lastName', value)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email (optional)"
          value={formData.email}
          onChangeText={(value) => handleInputChange('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text style={styles.helpText}>
          Email is optional. If not provided, we'll use your phone number for account management.
        </Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your phone number"
          value={formData.phone}
          onChangeText={(value) => handleInputChange('phone', value)}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          value={formData.password}
          onChangeText={(value) => handleInputChange('password', value)}
          secureTextEntry
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Business Information</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Business Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your business name"
          value={formData.businessName}
          onChangeText={(value) => handleInputChange('businessName', value)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Profession *</Text>
        <TouchableOpacity 
          style={styles.dropdown}
          onPress={() => setShowProfessionDropdown(!showProfessionDropdown)}
        >
          <Text style={styles.dropdownText}>
            {formData.profession || 'Select your profession'}
          </Text>
          <Text style={styles.dropdownArrow}>
            {showProfessionDropdown ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>
        {showProfessionDropdown && (
          <View style={styles.dropdownOptions}>
            {professions.map((prof) => (
              <TouchableOpacity
                key={prof}
                style={[
                  styles.option,
                  formData.profession === prof && styles.selectedOption
                ]}
                onPress={() => {
                  handleInputChange('profession', prof);
                  setShowProfessionDropdown(false);
                }}
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
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>VAT number *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your VAT number"
          value={formData.vatNumber}
          onChangeText={(value) => handleInputChange('vatNumber', value)}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Website (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your website URL (optional)"
          value={formData.website}
          onChangeText={(value) => handleInputChange('website', value)}
          keyboardType="url"
          autoCapitalize="none"
        />
        <Text style={styles.helpText}>
          Add your website to help customers learn more about your services
        </Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>About (Optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe your experience and services"
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
      <Text style={styles.stepTitle}>Address Information</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter street number"
          value={formData.number}
          onChangeText={(value) => handleInputChange('number', value)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Area *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter area"
          value={formData.area}
          onChangeText={(value) => handleInputChange('area', value)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Postal Code *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter postal code"
          value={formData.postalCode}
          onChangeText={(value) => handleInputChange('postalCode', value)}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Country *</Text>
        <TouchableOpacity 
          style={styles.dropdown}
          onPress={() => setShowCountryDropdown(!showCountryDropdown)}
        >
          <Text style={styles.dropdownText}>
            {formData.country}
          </Text>
          <Text style={styles.dropdownArrow}>
            {showCountryDropdown ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>
        {showCountryDropdown && (
          <View style={styles.dropdownOptions}>
            <TouchableOpacity
              style={[
                styles.option,
                formData.country === 'Greece' && styles.selectedOption
              ]}
              onPress={() => {
                handleInputChange('country', 'Greece');
                setShowCountryDropdown(false);
              }}
            >
              <Text style={[
                styles.optionText,
                formData.country === 'Greece' && styles.selectedOptionText
              ]}>
                Greece
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>City *</Text>
        <TouchableOpacity 
          style={styles.dropdown}
          onPress={() => setShowCityDropdown(!showCityDropdown)}
        >
          <Text style={styles.dropdownText}>
            {formData.city || 'Select your city'}
          </Text>
          <Text style={styles.dropdownArrow}>
            {showCityDropdown ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>
        {showCityDropdown && (
          <View style={styles.dropdownOptions}>
            {cities.map((city) => (
              <TouchableOpacity
                key={city}
                style={[
                  styles.option,
                  formData.city === city && styles.selectedOption
                ]}
                onPress={() => {
                  handleInputChange('city', city);
                  setShowCityDropdown(false);
                }}
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
        )}
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Service Information</Text>
      <Text style={styles.helpText}>
        Add the services you provide. Duration and pricing can be set later.
      </Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Service Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Plumbing Repair, Electrical Installation"
          value={formData.serviceName}
          onChangeText={(value) => handleInputChange('serviceName', value)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe what this service includes"
          value={formData.serviceDescription}
          onChangeText={(value) => handleInputChange('serviceDescription', value)}
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Duration (minutes) - Optional</Text>
        <TextInput
          style={styles.input}
          placeholder="0"
          value={formData.duration}
          onChangeText={(value) => handleInputChange('duration', value)}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Price (€) - Optional</Text>
        <TextInput
          style={styles.input}
          placeholder="0"
          value={formData.price}
          onChangeText={(value) => handleInputChange('price', value)}
          keyboardType="numeric"
        />
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
        <Text style={styles.title}>Εγγραφή Επαγγελματία</Text>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Step {currentStep} of 4</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(currentStep / 4) * 100}%` }]} />
        </View>
      </View>

      <ScrollView style={styles.content}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </ScrollView>

      <View style={styles.buttonContainer}>
        {currentStep > 1 && (
          <TouchableOpacity style={styles.previousButton} onPress={handlePrevious}>
            <Text style={styles.previousButtonText}>← Previous</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={handleNext}
          disabled={isLoading}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === 4 ? 'Create Account' : 'Next →'}
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
    color: '#1f2937',
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
    textAlign: 'center',
  },
  progressContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  progressText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 2,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  stepContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f3f4',
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#1f2937',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  helpText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    fontStyle: 'italic',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#1f2937',
    flex: 1,
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#6b7280',
  },
  dropdownOptions: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    marginTop: -8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  selectedOption: {
    backgroundColor: '#dbeafe',
  },
  optionText: {
    fontSize: 16,
    color: '#1f2937',
  },
  selectedOptionText: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f3f4',
    gap: 12,
  },
  previousButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  previousButtonText: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});