import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db } from './config';
import { useNotificationStore } from '../../store/notifications/notificationStore';

export interface NotificationData {
  id: string;
  type: 'appointment_request' | 'appointment_confirmed' | 'appointment_rejected' | 'appointment_reminder' | 'friend_request' | 'review_request' | 'payment_received' | 'message';
  title: string;
  message: string;
  recipientId: string;
  senderId?: string;
  appointmentId?: string;
  isRead: boolean;
  createdAt: Timestamp;
  icon: string;
  iconColor: string;
}

// Create a new notification
export const createNotification = async (notificationData: Omit<NotificationData, 'id' | 'createdAt'>) => {
  try {
    const notification = {
      ...notificationData,
      createdAt: Timestamp.now(),
    };
    
    const docRef = await addDoc(collection(db, 'notifications'), notification);
    
    // Add to local store
    useNotificationStore.getState().addNotification({
      type: notificationData.type,
      title: notificationData.title,
      message: notificationData.message,
      timestamp: new Date().toLocaleDateString('el-GR'),
      isRead: notificationData.isRead,
      icon: notificationData.icon,
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Get notifications for a specific user
export const getUserNotifications = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('recipientId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    
    const querySnapshot = await getDocs(q);
    const notifications: NotificationData[] = [];
    
    querySnapshot.forEach((doc) => {
      notifications.push({
        id: doc.id,
        ...doc.data()
      } as NotificationData);
    });
    
    return notifications;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId: string) => {
  try {
    await updateDoc(doc(db, 'notifications', notificationId), {
      isRead: true
    });
    
    // Update local store
    useNotificationStore.getState().markAsRead(notificationId);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// Mark all notifications as read for a user
export const markAllNotificationsAsRead = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('recipientId', '==', userId),
      where('isRead', '==', false)
    );
    
    const querySnapshot = await getDocs(q);
    const updatePromises = querySnapshot.docs.map(doc => 
      updateDoc(doc.ref, { isRead: true })
    );
    
    await Promise.all(updatePromises);
    
    // Update local store
    useNotificationStore.getState().markAllAsRead();
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

// Delete notification
export const deleteNotification = async (notificationId: string) => {
  try {
    await deleteDoc(doc(db, 'notifications', notificationId));
    
    // Update local store
    useNotificationStore.getState().removeNotification(notificationId);
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

// Real-time notification listener
export const subscribeToUserNotifications = (userId: string, callback: (notifications: NotificationData[]) => void) => {
  const q = query(
    collection(db, 'notifications'),
    where('recipientId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(50)
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const notifications: NotificationData[] = [];
    querySnapshot.forEach((doc) => {
      notifications.push({
        id: doc.id,
        ...doc.data()
      } as NotificationData);
    });
    callback(notifications);
  });
};

// Notification triggers for appointment events
export const triggerAppointmentNotification = async (
  type: 'appointment_request' | 'appointment_confirmed' | 'appointment_rejected',
  appointmentData: any,
  recipientId: string,
  senderId?: string
) => {
  const notificationConfigs = {
    appointment_request: {
      title: 'Νέο Αίτημα Ραντεβού',
      message: `${appointmentData.professionalName} έχει ζητήσει ραντεβού για ${appointmentData.serviceName} στις ${appointmentData.date}`,
      icon: '📅',
      iconColor: '#6b7280'
    },
    appointment_confirmed: {
      title: 'Ραντεβού Επιβεβαιώθηκε',
      message: `Το ραντεβού σας με ${appointmentData.professionalName} επιβεβαιώθηκε για ${appointmentData.date}`,
      icon: '✅',
      iconColor: '#10b981'
    },
    appointment_rejected: {
      title: 'Ραντεβού Απορρίφθηκε',
      message: `Το αίτημα ραντεβού με ${appointmentData.professionalName} απορρίφθηκε. Παρακαλώ δοκιμάστε με άλλον επαγγελματία.`,
      icon: '❌',
      iconColor: '#ef4444'
    }
  };
  
  const config = notificationConfigs[type];
  
  await createNotification({
    type,
    title: config.title,
    message: config.message,
    recipientId,
    senderId,
    appointmentId: appointmentData.id,
    isRead: false,
    icon: config.icon,
    iconColor: config.iconColor,
  });
};

// Friend request notification
export const triggerFriendRequestNotification = async (
  recipientId: string,
  senderId: string,
  senderName: string
) => {
  await createNotification({
    type: 'friend_request',
    title: 'Νέο Αίτημα Φιλίας',
    message: `${senderName} σας έστειλε αίτημα φιλίας`,
    recipientId,
    senderId,
    isRead: false,
    icon: '👥',
    iconColor: '#3b82f6',
  });
};

// Review request notification
export const triggerReviewRequestNotification = async (
  recipientId: string,
  appointmentId: string,
  professionalName: string
) => {
  await createNotification({
    type: 'review_request',
    title: 'Αξιολόγηση Υπηρεσίας',
    message: `Παρακαλώ αξιολογήστε την υπηρεσία του ${professionalName}`,
    recipientId,
    appointmentId,
    isRead: false,
    icon: '⭐',
    iconColor: '#f59e0b',
  });
};

// Payment notification
export const triggerPaymentNotification = async (
  recipientId: string,
  amount: number,
  serviceName: string
) => {
  await createNotification({
    type: 'payment_received',
    title: 'Πληρωμή Λήφθηκε',
    message: `Λάβατε €${amount} για την υπηρεσία: ${serviceName}`,
    recipientId,
    isRead: false,
    icon: '💳',
    iconColor: '#3b82f6',
  });
};

// Message notification
export const triggerMessageNotification = async (
  recipientId: string,
  senderId: string,
  senderName: string,
  messagePreview: string
) => {
  await createNotification({
    type: 'message',
    title: `Μήνυμα από ${senderName}`,
    message: messagePreview,
    recipientId,
    senderId,
    isRead: false,
    icon: '💬',
    iconColor: '#8b5cf6',
  });
};
