import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/auth/authStore';

export default function AdminDashboardScreen() {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', title: 'Επισκόπηση', icon: '📊' },
    { id: 'users', title: 'Χρήστες', icon: '👥' },
    { id: 'professionals', title: 'Επαγγελματίες', icon: '🔧' },
    { id: 'appointments', title: 'Ραντεβού', icon: '📅' },
    { id: 'reports', title: 'Αναφορές', icon: '📈' },
  ];

  const overviewStats = [
    { title: 'Συνολικοί Χρήστες', value: '1,247', change: '+12%', color: '#3b82f6' },
    { title: 'Επαγγελματίες', value: '89', change: '+5%', color: '#059669' },
    { title: 'Ραντεβού Αυτό το Μήνα', value: '342', change: '+18%', color: '#8b5cf6' },
    { title: 'Εσόδος Αυτό το Μήνα', value: '€12,450', change: '+23%', color: '#f59e0b' },
  ];

  const recentUsers = [
    { id: '1', name: 'Μαρία Παπαδοπούλου', email: 'maria@example.com', role: 'user', joinDate: '15 Ιαν 2024' },
    { id: '2', name: 'Γιάννης Κωστόπουλος', email: 'giannis@example.com', role: 'professional', joinDate: '14 Ιαν 2024' },
    { id: '3', name: 'Ελένη Δημητρίου', email: 'eleni@example.com', role: 'user', joinDate: '13 Ιαν 2024' },
  ];

  const recentAppointments = [
    { id: '1', user: 'Μαρία Παπαδοπούλου', professional: 'Γιάννης Κωστόπουλος', service: 'Επισκευή Ηλεκτρικών', date: '16 Ιαν 2024', status: 'confirmed' },
    { id: '2', user: 'Ελένη Δημητρίου', professional: 'Πέτρος Νικολάου', service: 'Συντήρηση Θέρμανσης', date: '15 Ιαν 2024', status: 'pending' },
  ];

  const renderStatCard = (stat) => (
    <View key={stat.title} style={[styles.statCard, { borderLeftColor: stat.color }]}>
      <Text style={styles.statValue}>{stat.value}</Text>
      <Text style={styles.statTitle}>{stat.title}</Text>
      <Text style={[styles.statChange, { color: stat.color }]}>{stat.change}</Text>
    </View>
  );

  const renderUser = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <View style={styles.userAvatar}>
          <Text style={styles.userAvatarText}>{item.name.charAt(0)}</Text>
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
          <Text style={styles.userRole}>
            {item.role === 'professional' ? 'Επαγγελματίας' : 'Χρήστης'}
          </Text>
        </View>
      </View>
      <Text style={styles.joinDate}>{item.joinDate}</Text>
    </View>
  );

  const renderAppointment = ({ item }) => (
    <View style={styles.appointmentCard}>
      <View style={styles.appointmentHeader}>
        <Text style={styles.appointmentService}>{item.service}</Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.status === 'confirmed' ? '#dcfce7' : '#fef3c7' }
        ]}>
          <Text style={[
            styles.statusText,
            { color: item.status === 'confirmed' ? '#166534' : '#92400e' }
          ]}>
            {item.status === 'confirmed' ? 'Επιβεβαιωμένο' : 'Εκκρεμές'}
          </Text>
        </View>
      </View>
      <Text style={styles.appointmentUsers}>
        {item.user} → {item.professional}
      </Text>
      <Text style={styles.appointmentDate}>{item.date}</Text>
    </View>
  );

  const renderTab = (tab) => (
    <TouchableOpacity
      key={tab.id}
      style={[styles.tab, activeTab === tab.id && styles.activeTab]}
      onPress={() => setActiveTab(tab.id)}
    >
      <Text style={styles.tabIcon}>{tab.icon}</Text>
      <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
        {tab.title}
      </Text>
    </TouchableOpacity>
  );

  const renderOverview = () => (
    <View>
      <Text style={styles.sectionTitle}>Στατιστικά Επισκόπησης</Text>
      <View style={styles.statsGrid}>
        {overviewStats.map(renderStatCard)}
      </View>
      
      <Text style={styles.sectionTitle}>Πρόσφατοι Χρήστες</Text>
      <FlatList
        data={recentUsers}
        renderItem={renderUser}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />
    </View>
  );

  const renderUsers = () => (
    <View>
      <Text style={styles.sectionTitle}>Διαχείριση Χρηστών</Text>
      <FlatList
        data={recentUsers}
        renderItem={renderUser}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />
    </View>
  );

  const renderAppointments = () => (
    <View>
      <Text style={styles.sectionTitle}>Πρόσφατα Ραντεβού</Text>
      <FlatList
        data={recentAppointments}
        renderItem={renderAppointment}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />
    </View>
  );

  const renderReports = () => (
    <View>
      <Text style={styles.sectionTitle}>Αναφορές</Text>
      <View style={styles.reportsGrid}>
        <TouchableOpacity style={styles.reportCard}>
          <Text style={styles.reportIcon}>📊</Text>
          <Text style={styles.reportTitle}>Μηνιαία Αναφορά</Text>
          <Text style={styles.reportDescription}>Στατιστικά για τον τρέχοντα μήνα</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.reportCard}>
          <Text style={styles.reportIcon}>👥</Text>
          <Text style={styles.reportTitle}>Αναφορά Χρηστών</Text>
          <Text style={styles.reportDescription}>Στοιχεία εγγραφών και δραστηριότητας</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.reportCard}>
          <Text style={styles.reportIcon}>💰</Text>
          <Text style={styles.reportTitle}>Οικονομική Αναφορά</Text>
          <Text style={styles.reportDescription}>Εσόδων και χρεώσεων</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.reportCard}>
          <Text style={styles.reportIcon}>⭐</Text>
          <Text style={styles.reportTitle}>Αναφορά Αξιολογήσεων</Text>
          <Text style={styles.reportDescription}>Στατιστικά αξιολογήσεων</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'users': return renderUsers();
      case 'appointments': return renderAppointments();
      case 'reports': return renderReports();
      default: return renderOverview();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Διαχείριση Συστήματος</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map(renderTab)}
        </ScrollView>
      </View>

      <ScrollView style={styles.content}>
        {renderContent()}
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
  settingsButton: {
    padding: 8,
  },
  settingsIcon: {
    fontSize: 20,
  },
  tabContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
    paddingVertical: 12,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  tabText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 16,
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
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  statChange: {
    fontSize: 12,
    fontWeight: '600',
  },
  userCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userAvatarText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
  joinDate: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'right',
  },
  appointmentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  appointmentService: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  appointmentUsers: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  appointmentDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  reportsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  reportCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
  },
  reportIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  reportDescription: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 16,
  },
});
