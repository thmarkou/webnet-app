import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function UserNotificationsScreen() {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');

  const mockNotifications = [
    {
      id: '1',
      type: 'appointment_confirmed',
      title: 'Ραντεβού Επιβεβαιώθηκε',
      message: 'Το ραντεβού σας με τον Γιάννη Παπαδόπουλο έχει επιβεβαιωθεί για Δευτέρα 10:00',
      timestamp: '2 ώρες πριν',
      isRead: false,
      icon: '✅'
    },
    {
      id: '2',
      type: 'friend_request',
      title: 'Νέα Αίτηση Φιλίας',
      message: 'Ο Νίκος Αντωνίου σας έστειλε αίτηση φιλίας',
      timestamp: '1 ημέρα πριν',
      isRead: false,
      icon: '👥'
    },
    {
      id: '3',
      type: 'appointment_reminder',
      title: 'Υπενθύμιση Ραντεβού',
      message: 'Έχετε ραντεβού αύριο με την Μαρία Κωνσταντίνου στις 14:00',
      timestamp: '2 ημέρες πριν',
      isRead: true,
      icon: '⏰'
    },
    {
      id: '4',
      type: 'review_request',
      title: 'Αξιολόγηση Υπηρεσίας',
      message: 'Παρακαλώ αξιολογήστε την υπηρεσία του Γιάννη Παπαδόπουλου',
      timestamp: '3 ημέρες πριν',
      isRead: true,
      icon: '⭐'
    }
  ];

  useEffect(() => {
    setNotifications(mockNotifications);
  }, []);

  const filters = [
    { id: 'all', title: 'Όλες' },
    { id: 'unread', title: 'Αδιάβαστες' },
    { id: 'appointments', title: 'Ραντεβού' },
    { id: 'friends', title: 'Φίλοι' }
  ];

  const getFilteredNotifications = () => {
    switch (activeFilter) {
      case 'unread':
        return notifications.filter(notif => !notif.isRead);
      case 'appointments':
        return notifications.filter(notif => 
          notif.type.includes('appointment') || notif.type.includes('review')
        );
      case 'friends':
        return notifications.filter(notif => notif.type.includes('friend'));
      default:
        return notifications;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'appointment_confirmed':
        return '#28a745';
      case 'friend_request':
        return '#007bff';
      case 'appointment_reminder':
        return '#ffc107';
      case 'review_request':
        return '#17a2b8';
      default:
        return '#6c757d';
    }
  };

  const handleNotificationPress = (notification) => {
    // Mark as read
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notification.id 
          ? { ...notif, isRead: true }
          : notif
      )
    );

    // Navigate based on notification type
    switch (notification.type) {
      case 'appointment_confirmed':
      case 'appointment_reminder':
        navigation.navigate('AppointmentsList');
        break;
      case 'friend_request':
        navigation.navigate('Friends');
        break;
      case 'review_request':
        navigation.navigate('AddReview');
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
    >
      <View style={styles.notificationHeader}>
        <Text style={styles.notificationIcon}>{item.icon}</Text>
        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationTimestamp}>{item.timestamp}</Text>
        </View>
        {!item.isRead && <View style={styles.unreadDot} />}
      </View>
      <Text style={styles.notificationMessage}>{item.message}</Text>
    </TouchableOpacity>
  );

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Πίσω</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Ειδοποιήσεις</Text>
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>

      <View style={styles.filterContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterButton,
              activeFilter === filter.id && styles.activeFilterButton
            ]}
            onPress={() => setActiveFilter(filter.id)}
          >
            <Text style={[
              styles.filterText,
              activeFilter === filter.id && styles.activeFilterText
            ]}>
              {filter.title}
            </Text>
          </TouchableOpacity>
        ))}
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007bff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  badge: {
    backgroundColor: '#dc3545',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  activeFilterButton: {
    backgroundColor: '#007bff',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 15,
  },
  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  notificationIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  notificationTimestamp: {
    fontSize: 12,
    color: '#666',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007bff',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});
