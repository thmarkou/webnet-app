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
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProfessionalRegistration {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profession: string;
  businessName: string;
  createdAt?: string;
}

export default function ProfessionalRegistrationsManagementScreen() {
  const navigation = useNavigation();
  const [registrations, setRegistrations] = useState<ProfessionalRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRegistrations();
  }, []);

  const loadRegistrations = async () => {
    try {
      setIsLoading(true);
      const usersJson = await AsyncStorage.getItem('app_users');
      if (usersJson) {
        const users = JSON.parse(usersJson);
        // Filter only professional registrations
        const allProfessionals = users
          .filter((user: any) => user.role === 'professional')
          .map((user: any) => ({
            id: user.id,
            firstName: user.name.split(' ')[0] || '',
            lastName: user.name.split(' ').slice(1).join(' ') || '',
            email: user.email || '',
            phone: user.phone || '',
            profession: user.profession || '',
            businessName: user.businessName || '',
            createdAt: user.createdAt || '',
          }));
        
        // Remove duplicates based on email (since email should be unique)
        const uniqueProfessionals = allProfessionals.filter((prof, index, self) =>
          index === self.findIndex((p) => p.email === prof.email)
        );
        
        console.log(`Loaded ${allProfessionals.length} professionals, ${uniqueProfessionals.length} unique`);
        setRegistrations(uniqueProfessionals);
      }
    } catch (error) {
      console.error('Error loading registrations:', error);
      Alert.alert('Σφάλμα', 'Δεν ήταν δυνατή η φόρτωση των εγγραφών.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Διαγραφή Εγγραφής',
      'Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή την εγγραφή;',
      [
        { text: 'Ακύρωση', style: 'cancel' },
        {
          text: 'Διαγραφή',
          style: 'destructive',
          onPress: async () => {
            try {
              const usersJson = await AsyncStorage.getItem('app_users');
              if (usersJson) {
                const users = JSON.parse(usersJson);
                const updatedUsers = users.filter((user: any) => user.id !== id);
                await AsyncStorage.setItem('app_users', JSON.stringify(updatedUsers));
                Alert.alert('Επιτυχία', 'Η εγγραφή διαγράφηκε επιτυχώς.');
                loadRegistrations();
              }
            } catch (error) {
              Alert.alert('Σφάλμα', 'Η διαγραφή απέτυχε.');
            }
          }
        }
      ]
    );
  };

  const handleView = (registration: ProfessionalRegistration) => {
    Alert.alert(
      'Πληροφορίες Εγγραφής',
      `Όνομα: ${registration.firstName} ${registration.lastName}\n\nEmail: ${registration.email}\nΤηλέφωνο: ${registration.phone}\nΕπάγγελμα: ${registration.profession}\nΕπιχείρηση: ${registration.businessName}`,
      [{ text: 'OK' }]
    );
  };

  const renderRegistration = ({ item }: { item: ProfessionalRegistration }) => (
    <View style={styles.registrationCard}>
      <View style={styles.registrationHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.firstName?.[0] || '👤'}
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
          <Text style={styles.profession}>{item.profession}</Text>
          <Text style={styles.email}>{item.email}</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.button, styles.viewButton]}
          onPress={() => handleView(item)}
        >
          <Text style={styles.viewButtonText}>Προβολή</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.deleteButtonText}>Διαγραφή</Text>
        </TouchableOpacity>
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
        <Text style={styles.title}>Διαχείριση Εγγραφών</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          Σύνολο Εγγραφών: {registrations.length}
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Φόρτωση...</Text>
        </View>
      ) : registrations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>Δεν υπάρχουν εγγραφές</Text>
          <Text style={styles.emptyMessage}>
            Όταν καταχωρήσετε νέους επαγγελματίες, θα εμφανιστούν εδώ.
          </Text>
        </View>
      ) : (
        <FlatList
          data={registrations}
          renderItem={renderRegistration}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={<View style={{ height: 20 }} />}
        />
      )}
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
  headerRight: {
    width: 30,
  },
  statsContainer: {
    padding: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  statsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  listContent: {
    padding: 15,
  },
  registrationCard: {
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
  registrationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  profession: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 2,
  },
  email: {
    fontSize: 12,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewButton: {
    backgroundColor: '#007AFF',
  },
  viewButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

