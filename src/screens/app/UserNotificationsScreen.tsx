import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar 
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

export default function UserNotificationsScreen() {
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
    { id: 'pending', title: 'Εκκρεμεί', icon: '⏳', color: '#f59e0b' },
    { id: 'confirmed', title: 'Επιβεβαιωμένα', icon: '✅', color: '#10b981' },
    { id: 'rejected', title: 'Απορριφθέντα', icon: '❌', color: '#ef4444' },
    { id: 'new_request', title: 'Νέα Αίτηση', icon: '➕', color: '#3b82f6' }
  ];

  const getFilteredNotifications = () => {
    switch (activeFilter) {
      case 'unread':
        return notifications.filter(notif => !notif.isRead);
      case 'appointments':
        return notifications.filter(notif => 
          notif.type.includes('appointment') || notif.type.includes('payment')
        );
      case 'friends':
        return notifications.filter(notif => notif.type.includes('friend'));
      case 'pending':
        return notifications.filter(notif => 
          notif.type === 'appointment_request' || 
          notif.type === 'friend_request' ||
          notif.title.toLowerCase().includes('αίτημα') ||
          notif.title.toLowerCase().includes('request') ||
          notif.title.toLowerCase().includes('εκκρεμεί') ||
          notif.title.toLowerCase().includes('pending')
        );
      case 'confirmed':
        return notifications.filter(notif => 
          notif.type === 'appointment_confirmed' || 
          notif.type === 'friend_request_accepted' ||
          notif.title.toLowerCase().includes('επιβεβαιωμένο') ||
          notif.title.toLowerCase().includes('confirmed')
        );
      case 'rejected':
        return notifications.filter(notif => 
          notif.type === 'appointment_rejected' || 
          notif.type === 'friend_request_rejected' ||
          notif.title.toLowerCase().includes('απορριφθέν') ||
          notif.title.toLowerCase().includes('rejected')
        );
      default:
        return notifications;
    }
  };

  const handleNewRequest = () => {
    // Navigate to Find Professionals screen to make a new request
    navigation.navigate('FindProfessionals');
  };

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
      case 'appointment_confirmed':
      case 'appointment_rejected':
      case 'appointment_reminder':
        navigation.navigate('MainTabs', { screen: 'Appointments' });
        break;
      case 'friend_request':
        navigation.navigate('MainTabs', { screen: 'Friends' });
        break;
      case 'review_request':
        navigation.navigate('AddReview', { appointmentId: notification.appointmentId });
        break;
      case 'message':
        // Navigate to chat/messaging screen
        navigation.navigate('Chat', { senderId: notification.senderId });
        break;
      default:
        break;
    }
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        !item.isRead && styles.unreadNotification
      ]}
      onPress={() => handleNotificationPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.notificationContent}>
        <View style={[styles.notificationIcon, { backgroundColor: item.iconColor + '20' }]}>
          <Text style={styles.notificationIconText}>{item.icon}</Text>
        </View>
        <View style={styles.notificationText}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationMessage}>{item.message}</Text>
          <Text style={styles.notificationTimestamp}>{item.timestamp}</Text>
        </View>
        {!item.isRead && <View style={styles.unreadDot} />}
      </View>
    </TouchableOpacity>
  );

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Ειδοποιήσεις</Text>
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>

      {/* Filter Pills */}
      <View style={styles.filterPillsContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[styles.filterPill, { backgroundColor: filter.color + '20' }]}
            onPress={filter.id === 'new_request' ? handleNewRequest : () => setActiveFilter(filter.id)}
          >
            <Text style={[styles.filterPillText, { color: filter.color }]}>
              {filter.icon} {filter.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, activeFilter === 'all' && styles.activeFilterButton]}
          onPress={() => setActiveFilter('all')}
        >
          <Text style={[styles.filterText, activeFilter === 'all' && styles.activeFilterText]}>
            Όλες
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, activeFilter === 'unread' && styles.activeFilterButton]}
          onPress={() => setActiveFilter('unread')}
        >
          <Text style={[styles.filterText, activeFilter === 'unread' && styles.activeFilterText]}>
            Διαβάστηκαν ({unreadCount})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.markAllButton}>
          <Text style={styles.markAllText}>Σημείωση όλων ως διαβασμένες</Text>
          <Text style={styles.markAllIcon}>✓</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={getFilteredNotifications()}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Δεν υπάρχουν ειδοποιήσεις</Text>
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
  badge: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  filterPillsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
    alignItems: 'center',
  },
  filterButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  activeFilterButton: {
    backgroundColor: '#3b82f6',
  },
  filterText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  markAllText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
    marginRight: 4,
  },
  markAllIcon: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  notificationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f3f4',
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationIconText: {
    fontSize: 20,
  },
  notificationText: {
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
  notificationTimestamp: {
    fontSize: 12,
    color: '#9ca3af',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
    marginLeft: 8,
    marginTop: 4,
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
});