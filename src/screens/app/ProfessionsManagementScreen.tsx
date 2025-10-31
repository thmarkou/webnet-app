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
import { getProfessions, addProfession, updateProfession, deleteProfession } from '../../services/storage/tableManager';

export default function ProfessionsManagementScreen() {
  const navigation = useNavigation();
  const [professions, setProfessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProfession, setEditingProfession] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: '🔧'
  });

  useEffect(() => {
    loadProfessions();
  }, []);

  const loadProfessions = async () => {
    setIsLoading(true);
    try {
      const data = await getProfessions();
      setProfessions(data);
    } catch (error) {
      Alert.alert('Σφάλμα', 'Αδυναμία φόρτωσης επαγγελμάτων');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Σφάλμα', 'Παρακαλώ εισάγετε όνομα επαγγέλματος');
      return;
    }

    try {
      await addProfession(formData);
      setFormData({ name: '', icon: '🔧' });
      setShowAddForm(false);
      loadProfessions();
      Alert.alert('Επιτυχία', 'Το επάγγελμα προστέθηκε επιτυχώς');
    } catch (error) {
      Alert.alert('Σφάλμα', 'Αδυναμία προσθήκης επαγγέλματος');
    }
  };

  const handleEdit = (profession: any) => {
    setEditingProfession(profession);
    setFormData({ name: profession.name, icon: profession.icon });
    setShowAddForm(true);
  };

  const handleUpdate = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Σφάλμα', 'Παρακαλώ εισάγετε όνομα επαγγέλματος');
      return;
    }

    try {
      await updateProfession(editingProfession.id, formData);
      setFormData({ name: '', icon: '🔧' });
      setEditingProfession(null);
      setShowAddForm(false);
      loadProfessions();
      Alert.alert('Επιτυχία', 'Το επάγγελμα ενημερώθηκε επιτυχώς');
    } catch (error) {
      Alert.alert('Σφάλμα', 'Αδυναμία ενημέρωσης επαγγέλματος');
    }
  };

  const handleDelete = (profession: any) => {
    Alert.alert(
      'Διαγραφή Επαγγέλματος',
      `Θέλετε να διαγράψετε το επάγγελμα "${profession.name}";`,
      [
        { text: 'Ακύρωση', style: 'cancel' },
        {
          text: 'Διαγραφή',
          style: 'destructive',
          onPress: async () => {
            // Check admin auth before delete
            const { isAdminAuthenticated } = await import('../../services/auth/adminAuth');
            const isAuth = await isAdminAuthenticated();
            
            if (!isAuth) {
              Alert.alert(
                'Admin Authentication',
                'Η διαγραφή επαγγέλματος απαιτεί admin κωδικό. Παρακαλώ εισάγετε τον κωδικό:',
                [
                  { text: 'Ακύρωση', style: 'cancel' },
                  {
                    text: 'Συνέχεια',
                    onPress: async () => {
                      Alert.alert(
                        'Admin Required',
                        'Παρακαλώ χρησιμοποιήστε την Admin Authentication από το Profile για να επαληθεύσετε τον κωδικό σας.',
                        [{ text: 'OK' }]
                      );
                    }
                  }
                ]
              );
              return;
            }
            
            try {
              await deleteProfession(profession.id);
              loadProfessions();
              Alert.alert('Επιτυχία', 'Το επάγγελμα διαγράφηκε');
            } catch (error: any) {
              if (error.message?.includes('ADMIN_REQUIRED')) {
                Alert.alert(
                  'Admin Required',
                  'Παρακαλώ χρησιμοποιήστε την Admin Authentication από το Profile.'
                );
              } else {
                Alert.alert('Σφάλμα', 'Αδυναμία διαγραφής επαγγέλματος');
              }
            }
          }
        }
      ]
    );
  };

  const renderProfession = ({ item }: { item: any }) => (
    <View style={styles.professionItem}>
      <View style={styles.professionInfo}>
        <Text style={styles.professionIcon}>{item.icon}</Text>
        <Text style={styles.professionName}>{item.name}</Text>
      </View>
      <View style={styles.professionActions}>
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
        <Text style={styles.title}>Διαχείριση Επαγγελμάτων</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setEditingProfession(null);
            setFormData({ name: '', icon: '🔧' });
            setShowAddForm(true);
          }}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {showAddForm && (
        <View style={styles.addForm}>
          <Text style={styles.formTitle}>
            {editingProfession ? 'Επεξεργασία Επαγγέλματος' : 'Νέο Επάγγελμα'}
          </Text>
          
          <TextInput
            style={styles.input}
            placeholder="Όνομα επαγγέλματος"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Εικονίδιο (emoji)"
            value={formData.icon}
            onChangeText={(text) => setFormData({ ...formData, icon: text })}
          />
          
          <View style={styles.formActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setShowAddForm(false);
                setEditingProfession(null);
                setFormData({ name: '', icon: '🔧' });
              }}
            >
              <Text style={styles.cancelButtonText}>Ακύρωση</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.saveButton}
              onPress={editingProfession ? handleUpdate : handleAdd}
            >
              <Text style={styles.saveButtonText}>
                {editingProfession ? 'Ενημέρωση' : 'Προσθήκη'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <FlatList
        data={professions}
        keyExtractor={(item) => item.id}
        renderItem={renderProfession}
        style={styles.list}
        refreshing={isLoading}
        onRefresh={loadProfessions}
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
  professionItem: {
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
  professionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  professionIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  professionName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  professionActions: {
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
