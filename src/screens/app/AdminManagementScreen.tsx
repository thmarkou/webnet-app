import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  Alert,
  FlatList,
  Modal
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/auth/authStore';

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface City {
  id: string;
  name: string;
  country: string;
  region: string;
}

export default function AdminManagementScreen() {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('professions');
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Category | City | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    description: '',
    country: '',
    region: ''
  });

  // Check if user is authenticated
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Διαχείριση Επαγγελματιών & Πόλεων</Text>
          </View>
        </View>

        <View style={styles.accessDeniedContainer}>
          <Text style={styles.accessDeniedIcon}>🚫</Text>
          <Text style={styles.accessDeniedTitle}>Πρόσβαση Απαγορευμένη</Text>
          <Text style={styles.accessDeniedText}>
            Πρέπει να είστε συνδεδεμένοι για να έχετε πρόσβαση σε αυτή τη σελίδα.
          </Text>
          <TouchableOpacity 
            style={styles.backToHomeButton}
            onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
          >
            <Text style={styles.backToHomeButtonText}>Επιστροφή στην Αρχική</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load from Firestore (via tableManager which uses Firestore)
      const { getProfessions, getCities } = await import('../../services/storage/tableManager');
      
      const [professionsData, citiesData] = await Promise.all([
        getProfessions(),
        getCities()
      ]);

      // Map professions to Category format
      const categoriesData: Category[] = professionsData
        .filter(prof => prof.id) // Filter out empty/default entries
        .map(prof => ({
          id: prof.id || '',
          name: prof.name || '',
          icon: prof.icon || '🔧',
          description: '' // Add description field if needed in future
        }));

      // Map cities to City format
      const citiesMapped: City[] = citiesData
        .filter(city => city.id && city.name) // Filter out default "Όλες οι Πόλεις"
        .map(city => ({
          id: city.id || '',
          name: city.name || '',
          country: 'Ελλάδα', // Default, can be extended later
          region: '' // Can be added to cities collection if needed
        }));

      setCategories(categoriesData);
      setCities(citiesMapped);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Σφάλμα', 'Δεν ήταν δυνατή η φόρτωση των δεδομένων');
      setCategories([]);
      setCities([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      icon: '',
      description: '',
      country: '',
      region: ''
    });
    setShowAddModal(true);
  };

  const handleEdit = (item: Category | City) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      icon: 'icon' in item ? item.icon : '',
      description: 'description' in item ? item.description : '',
      country: 'country' in item ? item.country : '',
      region: 'region' in item ? item.region : ''
    });
    setShowAddModal(true);
  };

  const handleDelete = async (item: Category | City) => {
    Alert.alert(
      'Διαγραφή',
      `Είστε σίγουροι ότι θέλετε να διαγράψετε το "${item.name}";`,
      [
        { text: 'Ακύρωση', style: 'cancel' },
        {
          text: 'Διαγραφή',
          style: 'destructive',
          onPress: async () => {
            try {
              const { deleteProfession, deleteCity } = await import('../../services/storage/tableManager');
              
              if (activeTab === 'professions') {
                await deleteProfession(item.id);
              } else {
                await deleteCity(item.id);
              }
              
              // Reload data from Firestore
              await loadData();
              
              Alert.alert('Επιτυχία', 'Το στοιχείο διαγράφηκε επιτυχώς');
            } catch (error) {
              console.error('Error deleting:', error);
              Alert.alert('Σφάλμα', 'Δεν ήταν δυνατή η διαγραφή. Παρακαλώ δοκιμάστε ξανά.');
            }
          }
        }
      ]
    );
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Σφάλμα', 'Το όνομα είναι υποχρεωτικό');
      return;
    }

    try {
      const { addProfession, updateProfession, addCity, updateCity } = await import('../../services/storage/tableManager');

      if (activeTab === 'professions') {
        if (!formData.icon.trim()) {
          Alert.alert('Σφάλμα', 'Το εικονίδιο είναι υποχρεωτικό');
          return;
        }

        if (editingItem) {
          // Update existing profession
          await updateProfession(editingItem.id, {
            name: formData.name,
            icon: formData.icon
          });
          Alert.alert('Επιτυχία', 'Η κατηγορία ενημερώθηκε επιτυχώς');
        } else {
          // Add new profession
          await addProfession({
            name: formData.name,
            icon: formData.icon
          });
          Alert.alert('Επιτυχία', 'Η κατηγορία προστέθηκε επιτυχώς');
        }
      } else {
        if (!formData.country.trim()) {
          Alert.alert('Σφάλμα', 'Η χώρα είναι υποχρεωτική');
          return;
        }

        if (editingItem) {
          // Update existing city
          await updateCity(editingItem.id, {
            name: formData.name
          });
          Alert.alert('Επιτυχία', 'Η πόλη ενημερώθηκε επιτυχώς');
        } else {
          // Add new city
          await addCity({
            name: formData.name
          });
          Alert.alert('Επιτυχία', 'Η πόλη προστέθηκε επιτυχώς');
        }
      }

      // Reload data from Firestore
      await loadData();
      
      setShowAddModal(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving:', error);
      Alert.alert('Σφάλμα', 'Δεν ήταν δυνατή η αποθήκευση. Παρακαλώ δοκιμάστε ξανά.');
    }
  };

  const renderCategory = ({ item }: { item: Category }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemIcon}>{item.icon}</Text>
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDescription}>{item.description}</Text>
        </View>
      </View>
      <View style={styles.itemActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEdit(item)}
        >
          <Text style={styles.editButtonText}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item)}
        >
          <Text style={styles.deleteButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCity = ({ item }: { item: City }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemIcon}>🏙️</Text>
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDescription}>{item.region}, {item.country}</Text>
        </View>
      </View>
      <View style={styles.itemActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEdit(item)}
        >
          <Text style={styles.editButtonText}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item)}
        >
          <Text style={styles.deleteButtonText}>🗑️</Text>
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
        <View style={styles.headerContent}>
          <Text style={styles.title}>Διαχείριση Επαγγελματιών & Πόλεων</Text>
          <Text style={styles.userName}>{user?.name || 'Χρήστη'}</Text>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'professions' && styles.activeTab]}
          onPress={() => setActiveTab('professions')}
        >
          <Text style={[styles.tabText, activeTab === 'professions' && styles.activeTabText]}>
            Επαγγέλματα
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'cities' && styles.activeTab]}
          onPress={() => setActiveTab('cities')}
        >
          <Text style={[styles.tabText, activeTab === 'cities' && styles.activeTabText]}>
            Πόλεις
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.headerActions}>
          <Text style={styles.sectionTitle}>
            {activeTab === 'professions' ? 'Επαγγέλματα' : 'Πόλεις'}
          </Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
            <Text style={styles.addButtonText}>+ Προσθήκη</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Φόρτωση...</Text>
          </View>
        ) : (
          <FlatList
            data={activeTab === 'professions' ? categories : cities}
            keyExtractor={(item) => item.id}
            renderItem={activeTab === 'professions' ? renderCategory : renderCity}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  Δεν υπάρχουν {activeTab === 'professions' ? 'επαγγέλματα' : 'πόλεις'}
                </Text>
              </View>
            }
          />
        )}
      </View>

      {/* Add/Edit Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.cancelButton}>Ακύρωση</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingItem ? 'Επεξεργασία' : 'Προσθήκη'} {activeTab === 'professions' ? 'Επαγγέλματος' : 'Πόλης'}
            </Text>
            <TouchableOpacity onPress={handleSave}>
              <Text style={styles.saveButton}>Αποθήκευση</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Όνομα *</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                placeholder={`Εισάγετε ${activeTab === 'professions' ? 'επάγγελμα' : 'πόλη'}`}
              />
            </View>

            {activeTab === 'professions' && (
              <>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Εικονίδιο *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.icon}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, icon: text }))}
                    placeholder="Εισάγετε εικονίδιο (π.χ. 🔧)"
                  />
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Περιγραφή</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={formData.description}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                    placeholder="Εισάγετε περιγραφή"
                    multiline
                    numberOfLines={3}
                  />
                </View>
              </>
            )}

            {activeTab === 'cities' && (
              <>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Χώρα *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.country}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, country: text }))}
                    placeholder="Εισάγετε χώρα"
                  />
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Περιοχή</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.region}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, region: text }))}
                    placeholder="Εισάγετε περιοχή"
                  />
                </View>
              </>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  userName: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
    marginTop: 2,
  },
  accessDeniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  accessDeniedIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  accessDeniedTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#dc2626',
    marginBottom: 12,
    textAlign: 'center',
  },
  accessDeniedText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  backToHomeButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backToHomeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  addButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  itemCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  itemDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    padding: 8,
    marginRight: 8,
  },
  editButtonText: {
    fontSize: 18,
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    fontSize: 18,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  cancelButton: {
    fontSize: 16,
    color: '#6b7280',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  saveButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
});
