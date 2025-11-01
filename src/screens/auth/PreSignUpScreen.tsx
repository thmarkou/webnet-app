import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PreSignUpScreen = () => {
  const navigation = useNavigation();

  const handleUserSignUp = () => {
    navigation.navigate('Register', { role: 'user' });
  };

  const handleProfessionalSignUp = () => {
    navigation.navigate('Register', { role: 'professional' });
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../../assets/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>WebNet</Text>
          <Text style={styles.tagline}>Συνδεθείτε στο WebNet</Text>
        </View>

        {/* Role Selection Cards */}
        <View style={styles.cardsContainer}>
          {/* User Account Card */}
          <TouchableOpacity style={styles.card} onPress={handleUserSignUp} activeOpacity={0.8}>
            <View style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>👤</Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>Λογαριασμός Χρήστη</Text>
                <Text style={styles.cardDescription}>
                  Βρείτε και κλείστε ραντεβού με επαληθευμένους επαγγελματίες
                </Text>
              </View>
              <Text style={styles.arrow}>→</Text>
            </View>
          </TouchableOpacity>

          {/* Professional Account Card */}
          <TouchableOpacity style={styles.card} onPress={handleProfessionalSignUp} activeOpacity={0.8}>
            <View style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>💼</Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>Λογαριασμός Επαγγελματία</Text>
                <Text style={styles.cardDescription}>
                  Αναπτύξτε την επιχείρησή σας και φτάστε σε περισσότερους πελάτες
                </Text>
              </View>
              <Text style={styles.arrow}>→</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>
            Έχετε Λογαριασμό{' '}
            <Text style={styles.loginLink} onPress={handleLogin}>
              Σύνδεση
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

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
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '400',
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#f1f3f4',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  icon: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
    fontWeight: '400',
  },
  arrow: {
    fontSize: 20,
    color: '#007AFF',
    fontWeight: '600',
  },
  loginContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '400',
  },
  loginLink: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default PreSignUpScreen;