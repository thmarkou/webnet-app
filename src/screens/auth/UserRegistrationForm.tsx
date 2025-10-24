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

export default function UserRegistrationForm() {
  const navigation = useNavigation();
  const { register, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    occupation: '',
    location: '',
    notifications: true,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      Alert.alert('Σφάλμα', 'Παρακαλώ συμπληρώστε όλα τα απαραίτητα πεδία');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Σφάλμα', 'Οι κωδικοί δεν ταιριάζουν');
      return;
    }

    try {
      await register({
        ...formData,
        role: 'user'
      });
      // Navigation will be handled by RootNavigator
    } catch (error) {
      Alert.alert('Σφάλμα', 'Σφάλμα κατά την εγγραφή');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Εγγραφή Χρήστη</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Προσωπικές Πληροφορίες</Text>
          
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
            <Text style={styles.label}>Επάγγελμα</Text>
            <TextInput
              style={styles.input}
              placeholder="Εισάγετε το επάγγελμά σας (προαιρετικό)"
              value={formData.occupation}
              onChangeText={(value) => handleInputChange('occupation', value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Τοποθεσία</Text>
            <TextInput
              style={styles.input}
              placeholder="Εισάγετε την τοποθεσία σας (προαιρετικό)"
              value={formData.location}
              onChangeText={(value) => handleInputChange('location', value)}
            />
          </View>

          <Text style={styles.sectionTitle}>Ασφάλεια</Text>
          
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

          <Text style={styles.sectionTitle}>Προτιμήσεις</Text>
          
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => handleInputChange('notifications', !formData.notifications)}
            >
              <Text style={styles.checkboxText}>
                {formData.notifications ? '☑️' : '☐'} Επιθυμώ να λαμβάνω ειδοποιήσεις
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.registerButton} 
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.registerButtonText}>
            {isLoading ? 'Εγγραφή...' : 'Δημιουργία Λογαριασμού'}
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
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
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
    marginTop: 20,
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
  checkboxContainer: {
    marginBottom: 20,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  registerButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
