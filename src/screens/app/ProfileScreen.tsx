import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar,
  Alert 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/auth/authStore';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Αποσύνδεση',
      'Είστε σίγουροι ότι θέλετε να αποσυνδεθείτε;',
      [
        { text: 'Ακύρωση', style: 'cancel' },
        { 
          text: 'Αποσύνδεση', 
          style: 'destructive',
          onPress: () => logout()
        }
      ]
    );
  };

  const actionItems = [
    {
      id: 'professional-profile',
      title: 'Προφίλ Επαγγελματία',
      icon: '👨‍🔧',
      onPress: () => navigation.navigate('ProfessionalProfile')
    },
    {
      id: 'professional-notifications',
      title: 'Ειδοποιήσεις Επαγγελματία',
      icon: '🔔',
      onPress: () => navigation.navigate('ProfessionalNotifications')
    },
    {
      id: 'rate-professional',
      title: 'Αξιολόγηση Επαγγελματία',
      icon: '⭐',
      onPress: () => navigation.navigate('RateProfessional', { 
        professional: { name: 'Γιάννης Παπαδόπουλος', profession: 'Ηλεκτρολόγος' },
        appointment: { date: '15 Ιανουαρίου 2024' }
      })
    },
    {
      id: 'update-service',
      title: 'Ενημέρωση Υπηρεσίας',
      icon: '🔧',
      onPress: () => navigation.navigate('UpdateServiceDetails', {
        appointment: { 
          date: '15 Ιανουαρίου 2024', 
          time: '10:00',
          service: 'Επισκευή Ηλεκτρικών',
          repair: 'Επισκευή φωτισμού'
        }
      })
    },
    {
      id: 'admin-dashboard',
      title: 'Διαχείριση Συστήματος',
      icon: '👨‍💼',
      onPress: () => navigation.navigate('AdminDashboard')
    },
    {
      id: 'settings',
      title: 'Ρυθμίσεις',
      icon: '⚙️',
      onPress: () => console.log('Settings pressed')
    },
    {
      id: 'help',
      title: 'Βοήθεια & Υποστήριξη',
      icon: '❓',
      onPress: () => console.log('Help pressed')
    },
    {
      id: 'about',
      title: 'Σχετικά',
      icon: 'ℹ️',
      onPress: () => console.log('About pressed')
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <Text style={styles.userName}>{user?.name || 'John Doe'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'user@demo.com'}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>ΧΡΗΣΤΗΣ</Text>
          </View>
        </View>

        {/* Account Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Πληροφορίες Λογαριασμού</Text>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>✉️</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email || 'user@demo.com'}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>👤</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Όνομα</Text>
              <Text style={styles.infoValue}>{user?.name || 'John Doe'}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>🛡️</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Ρόλος</Text>
              <Text style={styles.infoValue}>{user?.role || 'user'}</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ενέργειες</Text>
          
          {actionItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.actionItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <Text style={styles.actionIcon}>{item.icon}</Text>
              <Text style={styles.actionText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    color: '#ffffff',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 12,
  },
  roleBadge: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  roleText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 16,
    width: 24,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  actionIcon: {
    fontSize: 20,
    marginRight: 16,
    width: 24,
  },
  actionText: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 32,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoutIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});