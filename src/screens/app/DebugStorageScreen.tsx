import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DebugStorageScreen() {
  const navigation = useNavigation();
  const [customProfessionals, setCustomProfessionals] = useState<any[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load customProfessionals
      const customJson = await AsyncStorage.getItem('customProfessionals');
      if (customJson) {
        setCustomProfessionals(JSON.parse(customJson));
      }

      // Load app_users
      const usersJson = await AsyncStorage.getItem('app_users');
      if (usersJson) {
        const users = JSON.parse(usersJson);
        const professionals = users.filter((u: any) => u.role === 'professional');
        setRegisteredUsers(professionals);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const clearData = () => {
    Alert.alert(
      'Εκκαθάριση Δεδομένων',
      'Είστε σίγουροι ότι θέλετε να διαγράψετε όλα τα δεδομένα;',
      [
        { text: 'Ακύρωση', style: 'cancel' },
        {
          text: 'Διαγραφή',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('customProfessionals');
              await AsyncStorage.removeItem('app_users');
              setCustomProfessionals([]);
              setRegisteredUsers([]);
              Alert.alert('Επιτυχία', 'Τα δεδομένα διαγράφηκαν.');
            } catch (error) {
              Alert.alert('Σφάλμα', 'Αδυναμία διαγραφής δεδομένων.');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Profile')} 
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Debug Storage</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Custom Professionals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Custom Professionals: {customProfessionals.length}
          </Text>
          {customProfessionals.map((prof, index) => (
            <View key={index} style={styles.item}>
              <Text style={styles.itemTitle}>{prof.name}</Text>
              <Text style={styles.itemText}>City: {prof.city}</Text>
              <Text style={styles.itemText}>Email: {prof.email}</Text>
            </View>
          ))}
        </View>

        {/* Registered Users */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Registered Professionals: {registeredUsers.length}
          </Text>
          {registeredUsers.map((user, index) => (
            <View key={index} style={styles.item}>
              <Text style={styles.itemTitle}>{user.name}</Text>
              <Text style={styles.itemText}>Email: {user.email}</Text>
              <Text style={styles.itemText}>Profession: {user.profession}</Text>
            </View>
          ))}
        </View>

        {/* Actions */}
        <TouchableOpacity style={styles.clearButton} onPress={clearData}>
          <Text style={styles.clearButtonText}>Clear All Data</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.reloadButton} onPress={loadData}>
          <Text style={styles.reloadButtonText}>Reload Data</Text>
        </TouchableOpacity>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
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
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  item: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  clearButton: {
    backgroundColor: '#ff3b30',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  clearButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  reloadButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  reloadButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

