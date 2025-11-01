import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/auth/authStore';
import { useNotificationStore } from '../../store/notifications/notificationStore';
import { getUnreadMessageCount } from '../../services/messaging/mockMessaging';
import { fetchUserNotifications } from '../../services/notifications/mockNotifications';
import { isSubscriptionEnabled } from '../../config/subscription';
import TrialNotification from '../../components/TrialNotification';
import { getAppointments, getUserReviews } from '../../services/firebase/firestore';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { user, logout } = useAuthStore();
  const { unreadCount, setNotifications } = useNotificationStore();
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [overviewMetrics, setOverviewMetrics] = useState([
    { label: 'Κλεισμένα Ραντεβού', value: '0', color: '#3b82f6' },
    { label: 'Αυτό το Μήνα', value: '0', color: '#3b82f6' },
    { label: 'Μέση Αξιολόγηση', value: '0', color: '#3b82f6' },
    { label: 'Ξοδεύτηκε', value: '€0', color: '#3b82f6' }
  ]);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (user?.id) {
        try {
          const notifications = await fetchUserNotifications(user.id);
          setNotifications(notifications);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      }
    };

    fetchNotifications();
    
    // Update every 5 seconds to simulate real-time updates
    const interval = setInterval(fetchNotifications, 5000);
    
    return () => clearInterval(interval);
  }, [user?.id, setNotifications]);

  // Fetch unread message count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (user?.id) {
        try {
          const count = await getUnreadMessageCount(user.id);
          setUnreadMessageCount(count);
        } catch (error) {
          console.error('Error fetching unread message count:', error);
        }
      }
    };

    fetchUnreadCount();
    
    // Update every 5 seconds to simulate real-time updates
    const interval = setInterval(fetchUnreadCount, 5000);
    
    return () => clearInterval(interval);
  }, [user?.id]);

  // Fetch real statistics
  useEffect(() => {
    const fetchStatistics = async () => {
      if (!user?.id) return;

      try {
        // Get all appointments
        const allAppointments = await getAppointments(user.id);
        const completedAppointments = allAppointments.filter((apt: any) => apt.status === 'completed');
        
        // Get current month start
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const thisMonthAppointments = completedAppointments.filter((apt: any) => {
          const aptDate = apt.date?.toDate ? apt.date.toDate() : new Date(apt.date);
          return aptDate >= currentMonthStart;
        });

        // Get user reviews (reviews made by the user)
        const userReviews = await getUserReviews(user.id);
        const averageRating = userReviews.length > 0
          ? (userReviews.reduce((sum: number, review: any) => sum + (review.rating || 0), 0) / userReviews.length).toFixed(1)
          : '0';

        // Calculate total spent
        const totalSpent = completedAppointments.reduce((sum: number, apt: any) => {
          const price = apt.price || apt.servicePrice || 0;
          return sum + (typeof price === 'number' ? price : parseFloat(price) || 0);
        }, 0);

        // Format total spent
        const formattedSpent = totalSpent > 0 ? `€${totalSpent.toLocaleString('el-GR')}` : '€0';

        setOverviewMetrics([
          { label: 'Κλεισμένα Ραντεβού', value: completedAppointments.length.toString(), color: '#3b82f6' },
          { label: 'Αυτό το Μήνα', value: thisMonthAppointments.length.toString(), color: '#3b82f6' },
          { label: 'Μέση Αξιολόγηση', value: averageRating, color: '#3b82f6' },
          { label: 'Ξοδεύτηκε', value: formattedSpent, color: '#3b82f6' }
        ]);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStatistics();
  }, [user?.id]);

  const actionCards = [
    {
      id: 'appointments',
      title: 'Τα Ραντεβού Μου',
      description: 'Δείτε τα επερχόμενα και προηγούμενα ραντεβού σας',
      icon: '📅',
      screen: 'AppointmentsList'
    },
    {
      id: 'notifications',
      title: 'Ειδοποιήσεις',
      description: 'Δείτε ενημερώσεις και επιβεβαιώσεις ραντεβού',
      icon: '🔔',
      screen: 'UserNotifications'
    },
    {
      id: 'find',
      title: 'Βρείτε Επαγγελματίες',
      description: 'Αναζητήστε τις υπηρεσίες που χρειάζεστε',
      icon: '🔍',
      screen: 'FindProfessionals'
    },
    {
      id: 'friends',
      title: 'Φίλοι',
      description: 'Συνδεθείτε με άλλους χρήστες',
      icon: '👥',
      screen: 'Friends'
    },
    {
      id: 'database',
      title: 'Διαχείριση Βάσης',
      description: 'Διαχείριση δεδομένων και αρχικοποίηση',
      icon: '🗄️',
      screen: 'DatabaseManagement'
    }
  ];


  const handleLogout = () => {
    logout();
    // Navigation will be handled automatically by the RootNavigator
    // when isAuthenticated becomes false
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* User Header */}
      <View style={styles.userHeader}>
        <Text style={styles.welcomeText}>Καλώς ήρθατε,</Text>
        <Text style={styles.userName}>{user?.name || 'Χρήστη'}</Text>
      </View>
      
      {/* Trial Notification - Only show if subscription system is enabled */}
      {isSubscriptionEnabled() && (
        <TrialNotification onUpgradePress={() => navigation.navigate('Subscription')} />
      )}
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Action Cards */}
        <View style={styles.actionCardsContainer}>
          {actionCards.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={styles.actionCard}
              onPress={() => navigation.navigate(card.screen)}
              activeOpacity={0.8}
            >
              <View style={styles.actionCardContent}>
                <View style={styles.actionIcon}>
                  <Text style={styles.actionIconText}>{card.icon}</Text>
                  {/* Notification Badge for Notifications card */}
                  {card.id === 'notifications' && unreadCount > 0 && (
                    <View style={styles.notificationBadge}>
                      <Text style={styles.notificationBadgeText}>
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </Text>
                    </View>
                  )}
                  {/* Chat Badge for Friends card */}
                  {card.id === 'friends' && unreadMessageCount > 0 && (
                    <View style={styles.chatBadge}>
                      <Text style={styles.chatBadgeText}>
                        {unreadMessageCount > 99 ? '99+' : unreadMessageCount}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={styles.actionText}>
                  <Text style={styles.actionTitle}>{card.title}</Text>
                  <Text style={styles.actionDescription}>{card.description}</Text>
                </View>
                <Text style={styles.actionArrow}>→</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Overview Section */}
        <View style={styles.overviewContainer}>
          <Text style={styles.overviewTitle}>Overview</Text>
          <View style={styles.overviewGrid}>
            {overviewMetrics.map((metric, index) => (
              <View key={index} style={styles.overviewCard}>
                <Text style={[styles.overviewValue, { color: metric.color }]}>
                  {metric.value}
                </Text>
                <Text style={styles.overviewLabel}>{metric.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={styles.logoutText}>Αποσύνδεση</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  userHeader: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  welcomeText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    color: '#1f2937',
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  actionCardsContainer: {
    padding: 16,
  },
  actionCard: {
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
  actionCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  actionIconText: {
    fontSize: 24,
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  notificationBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  chatBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#10b981',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  chatBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  actionText: {
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
  actionArrow: {
    fontSize: 20,
    color: '#3b82f6',
    fontWeight: '600',
  },
  overviewContainer: {
    padding: 16,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  overviewCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f3f4',
  },
  overviewValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  logoutContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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