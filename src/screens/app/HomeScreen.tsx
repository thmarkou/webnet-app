import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);

  const quickActions = [
    {
      id: 'book',
      title: 'Κλείσε Ραντεβού',
      icon: '📅',
      screen: 'BookAppointment'
    },
    {
      id: 'find',
      title: 'Βρες Επαγγελματίες',
      icon: '🔍',
      screen: 'Search'
    },
    {
      id: 'appointments',
      title: 'Τα Ραντεβού Μου',
      icon: '📋',
      screen: 'AppointmentsList'
    },
    {
      id: 'friends',
      title: 'Φίλοι',
      icon: '👥',
      screen: 'Friends'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Καλώς ήρθες!</Text>
          <Text style={styles.subtitle}>Τι θα θέλατε να κάνετε σήμερα;</Text>
        </View>

        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Γρήγορες Ενέργειες</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.quickActionButton}
                onPress={() => navigation.navigate(action.screen)}
              >
                <Text style={styles.quickActionIcon}>{action.icon}</Text>
                <Text style={styles.quickActionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.overviewContainer}>
          <Text style={styles.sectionTitle}>Επισκόπηση</Text>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewText}>Επόμενο Ραντεβού: Δεν υπάρχει</Text>
            <Text style={styles.overviewText}>Ενεργά Ραντεβού: 0</Text>
            <Text style={styles.overviewText}>Συνολικές Αξιολογήσεις: 0</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  quickActionsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    fontSize: 30,
    marginBottom: 10,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  overviewContainer: {
    padding: 20,
  },
  overviewCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  overviewText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
});
