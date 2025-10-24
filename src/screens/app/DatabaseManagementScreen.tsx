import React, { useState } from 'react';
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

export default function DatabaseManagementScreen() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const handleInitializeData = async () => {
    setIsLoading(true);
    
    // Simulate data initialization
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Επιτυχία',
        'Τα δεδομένα αρχικοποιήθηκαν επιτυχώς!\n\n• 10 Χρήστες\n• 5 Επαγγελματίες\n• 20 Ραντεβού\n• 15 Αξιολογήσεις',
        [{ text: 'Εντάξει' }]
      );
    }, 2000);
  };

  const handleClearData = () => {
    Alert.alert(
      'Επιβεβαίωση',
      'Είστε σίγουροι ότι θέλετε να διαγράψετε όλα τα δεδομένα;\n\nΑυτή η ενέργεια δεν μπορεί να αναιρεθεί.',
      [
        { text: 'Ακύρωση', style: 'cancel' },
        { 
          text: 'Διαγραφή', 
          style: 'destructive',
          onPress: () => {
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
              Alert.alert('Επιτυχία', 'Όλα τα δεδομένα διαγράφηκαν.');
            }, 1500);
          }
        }
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Εξαγωγή Δεδομένων',
      'Τα δεδομένα θα εξαχθούν σε μορφή JSON.\n\nΘα εμφανιστεί ένα αρχείο με όλα τα δεδομένα της εφαρμογής.',
      [
        { text: 'Ακύρωση', style: 'cancel' },
        { 
          text: 'Εξαγωγή',
          onPress: () => {
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
              Alert.alert('Επιτυχία', 'Τα δεδομένα εξήχθησαν επιτυχώς!');
            }, 1500);
          }
        }
      ]
    );
  };

  const handleImportData = () => {
    Alert.alert(
      'Εισαγωγή Δεδομένων',
      'Επιλέξτε ένα αρχείο JSON για να εισάγετε δεδομένα στην εφαρμογή.',
      [
        { text: 'Ακύρωση', style: 'cancel' },
        { 
          text: 'Επιλογή Αρχείου',
          onPress: () => {
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
              Alert.alert('Επιτυχία', 'Τα δεδομένα εισήχθησαν επιτυχώς!');
            }, 1500);
          }
        }
      ]
    );
  };

  const handleResetApp = () => {
    Alert.alert(
      'Επαναφορά Εφαρμογής',
      'Αυτή η ενέργεια θα επαναφέρει την εφαρμογή στην αρχική κατάσταση και θα διαγράψει όλα τα δεδομένα.',
      [
        { text: 'Ακύρωση', style: 'cancel' },
        { 
          text: 'Επαναφορά', 
          style: 'destructive',
          onPress: () => {
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
              Alert.alert('Επιτυχία', 'Η εφαρμογή επαναφέρθηκε στην αρχική κατάσταση.');
            }, 2000);
          }
        }
      ]
    );
  };

  const managementActions = [
    {
      id: 'initialize',
      title: 'Αρχικοποίηση Δεδομένων',
      description: 'Δημιουργία δοκιμαστικών δεδομένων για την εφαρμογή',
      icon: '🚀',
      color: '#059669',
      onPress: handleInitializeData,
    },
    {
      id: 'export',
      title: 'Εξαγωγή Δεδομένων',
      description: 'Εξαγωγή όλων των δεδομένων σε αρχείο JSON',
      icon: '📤',
      color: '#3b82f6',
      onPress: handleExportData,
    },
    {
      id: 'import',
      title: 'Εισαγωγή Δεδομένων',
      description: 'Εισαγωγή δεδομένων από αρχείο JSON',
      icon: '📥',
      color: '#8b5cf6',
      onPress: handleImportData,
    },
    {
      id: 'clear',
      title: 'Διαγραφή Δεδομένων',
      description: 'Διαγραφή όλων των δεδομένων από τη βάση',
      icon: '🗑️',
      color: '#ef4444',
      onPress: handleClearData,
    },
    {
      id: 'reset',
      title: 'Επαναφορά Εφαρμογής',
      description: 'Επαναφορά της εφαρμογής στην αρχική κατάσταση',
      icon: '🔄',
      color: '#f59e0b',
      onPress: handleResetApp,
    },
  ];

  const renderAction = (action) => (
    <TouchableOpacity
      key={action.id}
      style={[styles.actionCard, { borderLeftColor: action.color }]}
      onPress={action.onPress}
      disabled={isLoading}
    >
      <View style={styles.actionHeader}>
        <Text style={styles.actionIcon}>{action.icon}</Text>
        <View style={styles.actionContent}>
          <Text style={styles.actionTitle}>{action.title}</Text>
          <Text style={styles.actionDescription}>{action.description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Διαχείριση Βάσης Δεδομένων</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Warning Section */}
        <View style={styles.warningSection}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={styles.warningTitle}>Προσοχή</Text>
          <Text style={styles.warningText}>
            Αυτές οι λειτουργίες επηρεάζουν τα δεδομένα της εφαρμογής. 
            Βεβαιωθείτε ότι γνωρίζετε τι κάνετε πριν προχωρήσετε.
          </Text>
        </View>

        {/* Database Statistics */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Στατιστικά Βάσης Δεδομένων</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>25</Text>
              <Text style={styles.statLabel}>Χρήστες</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Επαγγελματίες</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>48</Text>
              <Text style={styles.statLabel}>Ραντεβού</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>35</Text>
              <Text style={styles.statLabel}>Αξιολογήσεις</Text>
            </View>
          </View>
        </View>

        {/* Management Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Λειτουργίες Διαχείρισης</Text>
          {managementActions.map(renderAction)}
        </View>

        {/* Information Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Πληροφορίες</Text>
          <Text style={styles.infoText}>
            • <Text style={styles.infoBold}>Αρχικοποίηση:</Text> Δημιουργεί δοκιμαστικά δεδομένα για την εφαρμογή
          </Text>
          <Text style={styles.infoText}>
            • <Text style={styles.infoBold}>Εξαγωγή:</Text> Αποθηκεύει όλα τα δεδομένα σε αρχείο JSON
          </Text>
          <Text style={styles.infoText}>
            • <Text style={styles.infoBold}>Εισαγωγή:</Text> Φορτώνει δεδομένα από αρχείο JSON
          </Text>
          <Text style={styles.infoText}>
            • <Text style={styles.infoBold}>Διαγραφή:</Text> Διαγράφει όλα τα δεδομένα από τη βάση
          </Text>
          <Text style={styles.infoText}>
            • <Text style={styles.infoBold}>Επαναφορά:</Text> Επαναφέρει την εφαρμογή στην αρχική κατάσταση
          </Text>
        </View>
      </ScrollView>

      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingIcon}>⏳</Text>
            <Text style={styles.loadingText}>Επεξεργασία...</Text>
          </View>
        </View>
      )}
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  warningSection: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  warningIcon: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 8,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400e',
    textAlign: 'center',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#92400e',
    textAlign: 'center',
    lineHeight: 20,
  },
  statsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  actionsSection: {
    marginBottom: 24,
  },
  actionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  infoSection: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  infoBold: {
    fontWeight: '600',
    color: '#374151',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  loadingIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
});
