import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getCities, addCity, updateCity, deleteCity } from '../../services/storage/tableManager';

export default function CitiesManagementScreen() {
  const navigation = useNavigation();
  const [cities, setCities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCity, setEditingCity] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: ''
  });

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    setIsLoading(true);
    try {
      const data = await getCities();
      setCities(data);
    } catch (error) {
      Alert.alert('Σφάλμα', 'Αδυναμία φόρτωσης πόλεων');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Σφάλμα', 'Παρακαλώ εισάγετε όνομα πόλης');
      return;
    }

    try {
      await addCity(formData);
      setFormData({ name: '' });
      setShowAddForm(false);
      loadCities();
      Alert.alert('Επιτυχία', 'Η πόλη προστέθηκε επιτυχώς');
    } catch (error) {
      Alert.alert('Σφάλμα', 'Αδυναμία προσθήκης πόλης');
    }
  };

  const handleEdit = (city: any) => {
    setEditingCity(city);
    setFormData({ name: city.name });
    setShowAddForm(true);
  };

  const handleUpdate = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Σφάλμα', 'Παρακαλώ εισάγετε όνομα πόλης');
      return;
    }

    try {
      await updateCity(editingCity.id, formData);
      setFormData({ name: '' });
      setEditingCity(null);
      setShowAddForm(false);
      loadCities();
      Alert.alert('Επιτυχία', 'Η πόλη ενημερώθηκε επιτυχώς');
    } catch (error) {
      Alert.alert('Σφάλμα', 'Αδυναμία ενημέρωσης πόλης');
    }
  };

  const handleDelete = (city: any) => {
    if (city.id === '') {
      Alert.alert('Σφάλμα', 'Δεν μπορείτε να διαγράψετε την επιλογή "Όλες οι Πόλεις"');
      return;
    }

    Alert.alert(
      'Διαγραφή Πόλης',
      `Θέλετε να διαγράψετε την πόλη "${city.name}";`,
      [
        { text: 'Ακύρωση', style: 'cancel' },
        {
          text: 'Διαγραφή',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCity(city.id);
              loadCities();
              Alert.alert('Επιτυχία', 'Η πόλη διαγράφηκε');
            } catch (error) {
              Alert.alert('Σφάλμα', 'Αδυναμία διαγραφής πόλης');
            }
          }
        }
      ]
    );
  };

  const renderCity = ({ item }: { item: any }) => (
    <View style={styles.cityItem}>
      <View style={styles.cityInfo}>
        <Text style={styles.cityIcon}>🏙️</Text>
        <Text style={styles.cityName}>{item.name}</Text>
      </View>
      <View style={styles.cityActions}>
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
        <Text style={styles.title}>Διαχείριση Πόλεων</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setEditingCity(null);
            setFormData({ name: '' });
            setShowAddForm(true);
          }}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {showAddForm && (
        <View style={styles.addForm}>
          <Text style={styles.formTitle}>
            {editingCity ? 'Επεξεργασία Πόλης' : 'Νέα Πόλη'}
          </Text>
          
          <TextInput
            style={styles.input}
            placeholder="Όνομα πόλης"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />
          
          <View style={styles.formActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setShowAddForm(false);
                setEditingCity(null);
                setFormData({ name: '' });
              }}
            >
              <Text style={styles.cancelButtonText}>Ακύρωση</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.saveButton}
              onPress={editingCity ? handleUpdate : handleAdd}
            >
              <Text style={styles.saveButtonText}>
                {editingCity ? 'Ενημέρωση' : 'Προσθήκη'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <FlatList
        data={cities}
        keyExtractor={(item) => item.id}
        renderItem={renderCity}
        style={styles.list}
        refreshing={isLoading}
        onRefresh={loadCities}
      />
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 20,
    color: '#007AFF',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  addForm: {
    backgroundColor: '#ffffff',
    margin: 20,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  cancelButtonText: {
    textAlign: 'center',
    color: '#666',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
  },
  saveButtonText: {
    textAlign: 'center',
    color: '#ffffff',
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  cityItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cityIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  cityName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  cityActions: {
    flexDirection: 'row',
  },
  editButton: {
    padding: 8,
    marginRight: 5,
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
});
