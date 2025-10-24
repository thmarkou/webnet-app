import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/auth/authStore';
import { useNotificationStore } from '../../store/notifications/notificationStore';
import { 
  getUserNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  subscribeToUserNotifications 
} from '../../services/notifications/mockNotifications';

export default function ProfessionalNotificationsScreen() {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const { notifications, setNotifications, setLoading, markAsRead } = useNotificationStore();
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      
      // Subscribe to real-time notifications
      const unsubscribe = subscribeToUserNotifications(user.id, (realTimeNotifications) => {
        const formattedNotifications = realTimeNotifications.map(notif => ({
          id: notif.id,
          type: notif.type,
          title: notif.title,
          message: notif.message,
          timestamp: notif.createdAt.toLocaleDateString('el-GR'),
          isRead: notif.isRead,
          icon: notif.icon,
          iconColor: notif.iconColor,
          recipientId: notif.recipientId,
          senderId: notif.senderId,
          appointmentId: notif.appointmentId,
        }));
        
        setNotifications(formattedNotifications);
        setLoading(false);
      });
      
      return () => unsubscribe();
    }
  }, [user?.id]);

  const filters = [
    { id: 'all', title: 'Όλες', icon: '📋', color: '#6b7280' },
    { id: 'appointment_request', title: 'Αιτήματα Ραντεβού', icon: '📅', color: '#3b82f6' },
    { id: 'payment_received', title: 'Πληρωμές', icon: '💳', color: '#059669' },
    { id: 'review_request', title: 'Αξιολογήσεις', icon: '⭐', color: '#f59e0b' },
  ];

  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === 'all') return true;
    return notification.type === activeFilter;
  });

  const handleNotificationPress = async (notification) => {
    // Mark as read in Firebase
    try {
      await markNotificationAsRead(notification.id);
      markAsRead(notification.id);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }

    // Navigate based on notification type
    switch (notification.type) {
      case 'appointment_request':
        navigation.navigate('MainTabs', { screen: 'Appointments' });
        break;
      case 'payment_received':
        navigation.navigate('MainTabs', { screen: 'Profile' });
        break;
      case 'review_request':
        navigation.navigate('AddReview', { appointmentId: notification.appointmentId });
        break;
      default:
        break;
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead(user?.id || 'pro1');
      // Update local store
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        !item.isRead && styles.unreadNotification
      ]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.notificationHeader}>
        <View style={styles.notificationIcon}>
          <Text style={styles.iconText}>{item.icon}</Text>
        </View>
        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationMessage}>{item.message}</Text>
          <Text style={styles.notificationTime}>{item.timestamp}</Text>
        </View>
        {!item.isRead && <View style={styles.unreadDot} />}
      </View>
    </TouchableOpacity>
  );

  const renderFilter = (filter) => (
    <TouchableOpacity
      key={filter.id}
      style={[
        styles.filterButton,
        activeFilter === filter.id && styles.activeFilter
      ]}
      onPress={() => setActiveFilter(filter.id)}
    >
      <Text style={styles.filterIcon}>{filter.icon}</Text>
      <Text style={[
        styles.filterText,
        activeFilter === filter.id && styles.activeFilterText
      ]}>
        {filter.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Ειδοποιήσεις Επαγγελματία</Text>
        <TouchableOpacity style={styles.markAllButton} onPress={handleMarkAllAsRead}>
          <Text style={styles.markAllText}>Όλες</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filters.map(renderFilter)}
        </ScrollView>
      </View>

      <FlatList
        data={filteredNotifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.notificationsList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyTitle}>Δεν υπάρχουν ειδοποιήσεις</Text>
            <Text style={styles.emptyMessage}>
              Όταν λάβετε νέες ειδοποιήσεις, θα εμφανιστούν εδώ
            </Text>
          </View>
        }
      />
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
  markAllButton: {
    padding: 8,
  },
  markAllText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  filtersContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
    paddingVertical: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  activeFilter: {
    backgroundColor: '#007AFF',
  },
  filterIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  filterText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#ffffff',
  },
  notificationsList: {
    padding: 16,
  },
  notificationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f3f4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    backgroundColor: '#f8fafc',
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 20,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
    marginLeft: 8,
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});
