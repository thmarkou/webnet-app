import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function PreSignUpScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Ionicons name="business" size={64} color="#3b82f6" />
          <Text style={styles.logoText}>WebNetApp</Text>
        </View>

        <Text style={styles.title}>Επιλέξτε τύπο λογαριασμού</Text>
        <Text style={styles.subtitle}>Πώς θέλετε να συνεχίσετε;</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.userButton]}
            onPress={() => navigation.navigate('Register' as never, { role: 'user' } as never)}
          >
            <Ionicons name="person" size={32} color="white" />
            <Text style={styles.buttonText}>Λογαριασμός Χρήστη</Text>
            <Text style={styles.buttonSubtext}>Βρείτε επαγγελματίες</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.professionalButton]}
            onPress={() => navigation.navigate('Register' as never, { role: 'professional' } as never)}
          >
            <Ionicons name="briefcase" size={32} color="white" />
            <Text style={styles.buttonText}>Λογαριασμός Επαγγελματία</Text>
            <Text style={styles.buttonSubtext}>Προσφέρετε υπηρεσίες</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login' as never)}
        >
          <Text style={styles.loginText}>Έχετε ήδη λογαριασμό; Συνδεθείτε</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    gap: 20,
  },
  button: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userButton: {
    backgroundColor: '#3b82f6',
  },
  professionalButton: {
    backgroundColor: '#10b981',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  buttonSubtext: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
  },
  loginLink: {
    marginTop: 40,
  },
  loginText: {
    color: '#3b82f6',
    fontSize: 16,
    textAlign: 'center',
  },
});
