import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar,
  Alert 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/auth/authStore';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login, isLoading, error } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Σφάλμα', 'Παρακαλώ συμπληρώστε όλα τα πεδία');
      return;
    }

    try {
      await login(email, password);
    } catch (error) {
      Alert.alert('Αποτυχία Σύνδεσης', 'Μη έγκυρα στοιχεία');
    }
  };

  const handleDemoLogin = (role: string) => {
    const demoCredentials = {
      user: { email: 'user@demo.com', password: 'demo' },
      professional: { email: 'pro@demo.com', password: 'demo' },
      admin: { email: 'admin@demo.com', password: 'demo' }
    };

    const credentials = demoCredentials[role as keyof typeof demoCredentials];
    setEmail(credentials.email);
    setPassword(credentials.password);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Σύνδεση</Text>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Εισάγετε το email σας"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Κωδικός</Text>
            <TextInput
              style={styles.input}
              placeholder="Εισάγετε τον κωδικό σας"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
            />
          </View>

          <TouchableOpacity 
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Σύνδεση...' : 'Σύνδεση'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Ξεχάσατε τον κωδικό;</Text>
          </TouchableOpacity>
        </View>

        {/* Demo Login Buttons */}
        <View style={styles.demoContainer}>
          <Text style={styles.demoTitle}>Demo Λογαριασμοί</Text>
          
          <TouchableOpacity 
            style={[styles.demoButton, styles.userDemoButton]}
            onPress={() => handleDemoLogin('user')}
          >
            <Text style={styles.demoButtonText}>👤 Demo Χρήστη</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.demoButton, styles.professionalDemoButton]}
            onPress={() => handleDemoLogin('professional')}
          >
            <Text style={styles.demoButtonText}>💼 Demo Επαγγελματία</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.demoButton, styles.adminDemoButton]}
            onPress={() => handleDemoLogin('admin')}
          >
            <Text style={styles.demoButtonText}>⚙️ Demo Διαχειριστή</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Up Link */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>
            Δεν έχετε λογαριασμό;{' '}
            <Text 
              style={styles.signupLink}
              onPress={() => navigation.navigate('PreSignUp')}
            >
              Εγγραφή
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
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
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    flex: 1,
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 40,
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
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#1f2937',
  },
  loginButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 16,
  },
  forgotPasswordText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '500',
  },
  demoContainer: {
    marginBottom: 40,
  },
  demoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  demoButton: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
  },
  userDemoButton: {
    backgroundColor: '#f0f9ff',
    borderColor: '#0ea5e9',
  },
  professionalDemoButton: {
    backgroundColor: '#f0fdf4',
    borderColor: '#22c55e',
  },
  adminDemoButton: {
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b',
  },
  demoButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  signupContainer: {
    alignItems: 'center',
  },
  signupText: {
    fontSize: 16,
    color: '#6b7280',
  },
  signupLink: {
    color: '#3b82f6',
    fontWeight: '600',
  },
});