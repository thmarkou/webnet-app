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
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import { useAuthStore } from '../../store/auth/authStore';
import { getDatabaseStatistics } from '../../services/firebase/firestore';
import { importProfessionalsFromExcel } from '../../services/import/excelImportService';

export default function DatabaseManagementScreen() {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [databaseStats, setDatabaseStats] = useState({
    users: 0,
    professionals: 0,
    appointments: 0,
    reviews: 0,
  });

  // Fetch database statistics
  useEffect(() => {
    const fetchStats = async () => {
      if (user?.role === 'admin') {
        try {
          setStatsLoading(true);
          const stats = await getDatabaseStatistics();
          setDatabaseStats(stats);
        } catch (error) {
          console.error('Error fetching database statistics:', error);
          // Keep default values (0) on error
        } finally {
          setStatsLoading(false);
        }
      }
    };

    fetchStats();
  }, [user?.role]);

  // Check if user is admin
  if (user?.role !== 'admin') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Διαχείριση Βάσης Δεδομένων</Text>
            <Text style={styles.userName}>{user?.name || 'Χρήστη'}</Text>
          </View>
        </View>

        <View style={styles.accessDeniedContainer}>
          <Text style={styles.accessDeniedIcon}>🚫</Text>
          <Text style={styles.accessDeniedTitle}>Πρόσβαση Απαγορευμένη</Text>
          <Text style={styles.accessDeniedText}>
            Μόνο οι διαχειριστές έχουν πρόσβαση σε αυτή τη σελίδα.
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

  const handleImportData = async () => {
    Alert.alert(
      'Εισαγωγή Επαγγελματιών',
      'Επιλέξτε Excel file (.xlsx) για μαζική εισαγωγή επαγγελματιών.\n\nΤο Excel πρέπει να έχει columns: Όνομα, Email, Τηλέφωνο, Επάγγελμα, Πόλη, Οδός, κλπ.',
      [
        { text: 'Ακύρωση', style: 'cancel' },
        { 
          text: 'Επιλογή Excel File',
          onPress: async () => {
            try {
              setIsLoading(true);
              
              // Pick Excel file
              const result = await DocumentPicker.getDocumentAsync({
                type: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'],
                copyToCacheDirectory: true,
              });
              
              if (result.canceled) {
                setIsLoading(false);
                return;
              }
              
              const fileUri = result.assets[0].uri;
              
              // Import professionals
              const importResult = await importProfessionalsFromExcel(
                fileUri,
                (current, total) => {
                  console.log(`Importing ${current}/${total}...`);
                }
              );
              
              setIsLoading(false);
              
              // Show results
              if (importResult.success) {
                Alert.alert(
                  '✅ Επιτυχία',
                  `Εισήχθηκαν ${importResult.imported} επαγγελματίες επιτυχώς!`,
                  [{ text: 'OK', onPress: () => {
                    // Refresh statistics
                    const fetchStats = async () => {
                      try {
                        const stats = await getDatabaseStatistics();
                        setDatabaseStats(stats);
                      } catch (error) {
                        console.error('Error refreshing stats:', error);
                      }
                    };
                    fetchStats();
                  }}]
                );
              } else {
                const errorMessage = importResult.errors.length > 0
                  ? `Εισήχθηκαν ${importResult.imported} από ${importResult.imported + importResult.failed}.\n\nΣφάλματα:\n${importResult.errors.slice(0, 5).map(e => `Row ${e.row}: ${e.error}`).join('\n')}${importResult.errors.length > 5 ? '\n...' : ''}`
                  : `Εισήχθηκαν ${importResult.imported} επαγγελματίες, απέτυχαν ${importResult.failed}`;
                
                Alert.alert('⚠️ Εισαγωγή Ολοκληρώθηκε', errorMessage);
              }
            } catch (error: any) {
              setIsLoading(false);
              Alert.alert(
                'Σφάλμα',
                error.message || 'Παρουσιάστηκε σφάλμα κατά την εισαγωγή. Παρακαλώ ελέγξτε ότι το Excel file είναι σωστό.'
              );
            }
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
      title: 'Εισαγωγή Επαγγελματιών',
      description: 'Μαζική εισαγωγή επαγγελματιών από Excel file (.xlsx)',
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
    {
      id: 'trial',
      title: 'Διαχείριση Δοκιμών',
      description: 'Διαχείριση δωρεάν δοκιμών χρηστών',
      icon: '⏰',
      color: '#10b981',
      onPress: () => navigation.navigate('TrialManagement'),
    },
    {
      id: 'recommendations',
      title: 'Διαχείριση Συστάσεων',
      description: 'Διαχείριση συστάσεων επαγγελματιών από φίλους',
      icon: '👥',
      color: '#8b5cf6',
      onPress: () => navigation.navigate('RecommendationManagement'),
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
        <View style={styles.headerContent}>
          <Text style={styles.title}>Διαχείριση Βάσης Δεδομένων</Text>
          <Text style={styles.userName}>{user?.name || 'Χρήστη'}</Text>
        </View>
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
          
          {statsLoading ? (
            <View style={styles.statsLoadingContainer}>
              <ActivityIndicator size="small" color="#3b82f6" />
              <Text style={styles.statsLoadingText}>Φόρτωση...</Text>
            </View>
          ) : (
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{databaseStats.users}</Text>
                <Text style={styles.statLabel}>Χρήστες</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{databaseStats.professionals}</Text>
                <Text style={styles.statLabel}>Επαγγελματίες</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{databaseStats.appointments}</Text>
                <Text style={styles.statLabel}>Ραντεβού</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{databaseStats.reviews}</Text>
                <Text style={styles.statLabel}>Αξιολογήσεις</Text>
              </View>
            </View>
          )}
        </View>

        {/* Management Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Λειτουργίες Διαχείρισης</Text>
          {managementActions.map(renderAction)}
        </View>

        {/* Admin Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Διαχείριση Περιεχομένου</Text>
          <TouchableOpacity
            style={styles.adminManagementCard}
            onPress={() => navigation.navigate('AdminManagement')}
          >
            <View style={styles.adminManagementContent}>
              <Text style={styles.adminManagementIcon}>⚙️</Text>
              <View style={styles.adminManagementInfo}>
                <Text style={styles.adminManagementTitle}>Διαχείριση Επαγγελμάτων & Πόλεων</Text>
                <Text style={styles.adminManagementDescription}>
                  Προσθήκη, επεξεργασία και διαγραφή επαγγελμάτων και πόλεων
                </Text>
              </View>
              <Text style={styles.adminManagementArrow}>→</Text>
            </View>
          </TouchableOpacity>
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
  statsLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  statsLoadingText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#6b7280',
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
  adminManagementCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  adminManagementContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminManagementIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  adminManagementInfo: {
    flex: 1,
  },
  adminManagementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  adminManagementDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  adminManagementArrow: {
    fontSize: 18,
    color: '#3b82f6',
    fontWeight: '600',
  },
});
