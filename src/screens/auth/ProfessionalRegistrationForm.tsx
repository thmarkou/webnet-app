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
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/auth/authStore';
import * as ImagePicker from 'expo-image-picker';

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
    profilePhoto: null,
    
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
    country: 'Ελλάδα',
    city: '',
    
    // Step 4: Service Information
    serviceName: '',
    serviceDescription: '',
    duration: '',
    price: '',
  });

  const professions = [
    { name: 'Ηλεκτρολόγος', icon: '⚡' },
    { name: 'Υδραυλικός', icon: '🔧' },
    { name: 'Δικηγόρος', icon: '⚖️' },
    { name: 'Καθαριστής', icon: '🧹' },
    { name: 'Μηχανικός', icon: '🔩' },
    { name: 'Γιατρός', icon: '🩺' }
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
    // Validate required fields for Step 4
    if (!formData.serviceName || !formData.serviceDescription) {
      Alert.alert(
        'Ατελές Στοιχείο', 
        'Παρακαλώ συμπληρώστε το όνομα και την περιγραφή της υπηρεσίας.'
      );
      return;
    }

    // Validate all required fields from all steps
    const requiredFields = [
      { field: 'firstName', label: 'Όνομα' },
      { field: 'lastName', label: 'Επώνυμο' },
      { field: 'phone', label: 'Τηλέφωνο' },
      { field: 'password', label: 'Κωδικός' },
      { field: 'businessName', label: 'Όνομα Επιχείρησης' },
      { field: 'profession', label: 'Επάγγελμα' },
      { field: 'vatNumber', label: 'ΑΦΜ' },
      { field: 'number', label: 'Αριθμός' },
      { field: 'area', label: 'Περιοχή' },
      { field: 'postalCode', label: 'Ταχυδρομικός Κώδικας' },
      { field: 'country', label: 'Χώρα' },
      { field: 'city', label: 'Πόλη' }
    ];

    for (const { field, label } of requiredFields) {
      if (!formData[field]) {
        Alert.alert(
          'Ατελές Στοιχείο', 
          `Παρακαλώ συμπληρώστε το πεδίο: ${label}`
        );
        return;
      }
    }

    try {
      await register({
        ...formData,
        role: 'professional'
      });
      // Navigation will be handled by RootNavigator
    } catch (error) {
      Alert.alert('Σφάλμα', 'Η εγγραφή απέτυχε');
    }
  };

  const [showAvatarSelection, setShowAvatarSelection] = useState(false);

  const avatars = [
    { id: '1', emoji: '👨‍🔧', name: 'Άνδρας Ηλεκτρολόγος' },
    { id: '2', emoji: '👩‍🔧', name: 'Γυναίκα Υδραυλικός' },
    { id: '3', emoji: '👨‍🎨', name: 'Άνδρας Μαραγκός' },
    { id: '4', emoji: '👩‍🎨', name: 'Γυναίκα Ζωγράφος' },
    { id: '5', emoji: '👨‍💼', name: 'Άνδρας Επαγγελματίας' },
    { id: '6', emoji: '👩‍💼', name: 'Γυναίκα Επαγγελματίας' },
    { id: '7', emoji: '👨‍⚕️', name: 'Άνδρας Γιατρός' },
    { id: '8', emoji: '👩‍⚕️', name: 'Γυναίκα Γιατρός' },
    { id: '9', emoji: '👨‍🍳', name: 'Άνδρας Μάγειρας' },
    { id: '10', emoji: '👩‍🍳', name: 'Γυναίκα Μάγειρας' },
    { id: '11', emoji: '👨‍🏫', name: 'Άνδρας Δάσκαλος' },
    { id: '12', emoji: '👩‍🏫', name: 'Γυναίκα Δασκάλα' },
    { id: '13', emoji: '👨‍💻', name: 'Άνδρας Προγραμματιστής' },
    { id: '14', emoji: '👩‍💻', name: 'Γυναίκα Προγραμματίστρια' },
    { id: '15', emoji: '👨‍🔬', name: 'Άνδρας Επιστήμονας' },
    { id: '16', emoji: '👩‍🔬', name: 'Γυναίκα Επιστήμονας' },
  ];

  const selectAvatar = (avatar) => {
    setFormData(prev => ({
      ...prev,
      profilePhoto: avatar.emoji
    }));
    setShowAvatarSelection(false);
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
          Το email είναι προαιρετικό. Αν δεν δοθεί, θα χρησιμοποιήσουμε το τηλέφωνό σας για τη διαχείριση του λογαριασμού.
        </Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Τηλέφωνο *</Text>
        <TextInput
          style={styles.input}
          placeholder="Εισάγετε τον αριθμό τηλεφώνου"
          value={formData.phone}
          onChangeText={(value) => handleInputChange('phone', value)}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Avatar Προφίλ (Προαιρετικό)</Text>
        <TouchableOpacity style={styles.photoUploadButton} onPress={() => setShowAvatarSelection(true)}>
          {formData.profilePhoto ? (
            <View style={styles.avatarPreview}>
              <Text style={styles.avatarEmoji}>{formData.profilePhoto}</Text>
            </View>
          ) : (
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoPlaceholderText}>👤</Text>
              <Text style={styles.photoPlaceholderLabel}>Επιλέξτε Avatar</Text>
            </View>
          )}
        </TouchableOpacity>
        <Text style={styles.helpText}>
          Επιλέξτε ένα avatar που αντιπροσωπεύει το επάγγελμά σας.
        </Text>
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
    </View>
  );

  const renderAvatarSelection = () => (
    <View style={styles.avatarModal}>
      <View style={styles.avatarModalContent}>
        <Text style={styles.avatarModalTitle}>Επιλέξτε Avatar</Text>
        <View style={styles.avatarGrid}>
          {avatars.map((avatar) => (
            <TouchableOpacity
              key={avatar.id}
              style={styles.avatarOption}
              onPress={() => selectAvatar(avatar)}
            >
              <Text style={styles.avatarOptionEmoji}>{avatar.emoji}</Text>
              <Text style={styles.avatarOptionName}>{avatar.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={styles.avatarModalClose}
          onPress={() => setShowAvatarSelection(false)}
        >
          <Text style={styles.avatarModalCloseText}>Κλείσιμο</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Επιχειρηματικές Πληροφορίες</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Όνομα Επιχείρησης *</Text>
        <TextInput
          style={styles.input}
          placeholder="Εισάγετε το όνομα της επιχείρησης"
          value={formData.businessName}
          onChangeText={(value) => handleInputChange('businessName', value)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Επάγγελμα *</Text>
        <TouchableOpacity 
          style={styles.dropdown}
          onPress={() => setShowProfessionDropdown(!showProfessionDropdown)}
        >
          <Text style={styles.dropdownText}>
            {formData.profession ? 
              professions.find(p => p.name === formData.profession)?.icon + ' ' + formData.profession : 
              'Επιλέξτε το επάγγελμά σας'
            }
          </Text>
          <Text style={styles.dropdownArrow}>
            {showProfessionDropdown ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>
        {showProfessionDropdown && (
          <View style={styles.dropdownOptions}>
            {professions.map((prof) => (
              <TouchableOpacity
                key={prof.name}
                style={[
                  styles.option,
                  formData.profession === prof.name && styles.selectedOption
                ]}
                onPress={() => {
                  handleInputChange('profession', prof.name);
                  setShowProfessionDropdown(false);
                }}
              >
                <Text style={[
                  styles.optionText,
                  formData.profession === prof.name && styles.selectedOptionText
                ]}>
                  {prof.icon} {prof.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>ΑΦΜ *</Text>
        <TextInput
          style={styles.input}
          placeholder="Εισάγετε τον ΑΦΜ"
          value={formData.vatNumber}
          onChangeText={(value) => handleInputChange('vatNumber', value)}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Ιστοσελίδα (Προαιρετικό)</Text>
        <TextInput
          style={styles.input}
          placeholder="Εισάγετε τη διεύθυνση της ιστοσελίδας σας (προαιρετικό)"
          value={formData.website}
          onChangeText={(value) => handleInputChange('website', value)}
          keyboardType="url"
          autoCapitalize="none"
        />
        <Text style={styles.helpText}>
          Προσθέστε την ιστοσελίδα σας για να βοηθήσετε τους πελάτες να μάθουν περισσότερα για τις υπηρεσίες σας
        </Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Σχετικά (Προαιρετικό)</Text>
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
        <Text style={styles.label}>Αριθμός *</Text>
        <TextInput
          style={styles.input}
          placeholder="Εισάγετε τον αριθμό οδού"
          value={formData.number}
          onChangeText={(value) => handleInputChange('number', value)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Περιοχή *</Text>
        <TextInput
          style={styles.input}
          placeholder="Εισάγετε την περιοχή"
          value={formData.area}
          onChangeText={(value) => handleInputChange('area', value)}
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

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Χώρα *</Text>
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
                formData.country === 'Ελλάδα' && styles.selectedOption
              ]}
              onPress={() => {
                handleInputChange('country', 'Ελλάδα');
                setShowCountryDropdown(false);
              }}
            >
              <Text style={[
                styles.optionText,
                formData.country === 'Ελλάδα' && styles.selectedOptionText
              ]}>
                Ελλάδα
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Πόλη *</Text>
        <TouchableOpacity 
          style={styles.dropdown}
          onPress={() => setShowCityDropdown(!showCityDropdown)}
        >
          <Text style={styles.dropdownText}>
            {formData.city || 'Επιλέξτε την πόλη σας'}
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
      <Text style={styles.stepTitle}>Πληροφορίες Υπηρεσιών</Text>
      <Text style={styles.helpText}>
        Προσθέστε τις υπηρεσίες που παρέχετε. Η διάρκεια και οι τιμές μπορούν να οριστούν αργότερα.
      </Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Όνομα Υπηρεσίας *</Text>
        <TextInput
          style={styles.input}
          placeholder="π.χ., Επισκευή Υδραυλικών, Ηλεκτρικές Εγκαταστάσεις"
          value={formData.serviceName}
          onChangeText={(value) => handleInputChange('serviceName', value)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Περιγραφή *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Περιγράψτε τι περιλαμβάνει αυτή η υπηρεσία"
          value={formData.serviceDescription}
          onChangeText={(value) => handleInputChange('serviceDescription', value)}
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Διάρκεια (λεπτά) - Προαιρετικό</Text>
        <TextInput
          style={styles.input}
          placeholder="0"
          value={formData.duration}
          onChangeText={(value) => handleInputChange('duration', value)}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Τιμή (€) - Προαιρετικό</Text>
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
            <Text style={styles.previousButtonText}>← Προηγούμενο</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={handleNext}
          disabled={isLoading}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === 4 ? 'Δημιουργ. Λογαριασμού' : 'Επόμενο →'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {showAvatarSelection && renderAvatarSelection()}
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
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
  photoUploadButton: {
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  photoPreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  photoPlaceholder: {
    alignItems: 'center',
  },
  photoPlaceholderText: {
    fontSize: 32,
    marginBottom: 8,
  },
  photoPlaceholderLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  avatarPreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  avatarEmoji: {
    fontSize: 40,
  },
  avatarModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  avatarModalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    maxHeight: '80%',
    width: '90%',
  },
  avatarModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  avatarOption: {
    width: '22%',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  avatarOptionEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  avatarOptionName: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
  },
  avatarModalClose: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  avatarModalCloseText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});