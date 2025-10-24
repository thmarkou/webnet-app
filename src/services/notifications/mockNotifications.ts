// Mock notification service - no Firebase dependencies
export interface NotificationData {
  id: string;
  type: 'appointment_request' | 'appointment_confirmed' | 'appointment_rejected' | 'appointment_reminder' | 'friend_request' | 'review_request' | 'payment_received' | 'message';
  title: string;
  message: string;
  recipientId: string;
  senderId?: string;
  appointmentId?: string;
  isRead: boolean;
  createdAt: Date;
  icon: string;
  iconColor: string;
}

// Mock notifications storage
let mockNotifications: NotificationData[] = [
  {
    id: '1',
    type: 'appointment_request',
    title: 'Νέο Αίτημα Ραντεβού',
    message: 'Γιάννης Παπαδόπουλος έχει ζητήσει ραντεβού για υδραυλικές επισκευές στις 15 Ιανουαρίου 2024 στις 10:00',
    recipientId: 'pro1',
    senderId: 'user1',
    appointmentId: 'apt1',
    isRead: false,
    createdAt: new Date(),
    icon: '📅',
    iconColor: '#6b7280'
  },
  {
    id: '2',
    type: 'appointment_confirmed',
    title: 'Ραντεβού Επιβεβαιώθηκε',
    message: 'Το ραντεβού σας με Γιάννη Παπαδόπουλο επιβεβαιώθηκε για 15 Ιανουαρίου 2024',
    recipientId: 'user1',
    senderId: 'pro1',
    appointmentId: 'apt1',
    isRead: false,
    createdAt: new Date(),
    icon: '✅',
    iconColor: '#10b981'
  },
  {
    id: '3',
    type: 'friend_request',
    title: 'Νέο Αίτημα Φιλίας',
    message: 'Μαρία Κωνσταντίνου σας έστειλε αίτημα φιλίας',
    recipientId: 'user1',
    senderId: 'user2',
    isRead: false,
    createdAt: new Date(),
    icon: '👥',
    iconColor: '#3b82f6'
  },
  {
    id: '4',
    type: 'payment_received',
    title: 'Πληρωμή Λήφθηκε',
    message: 'Λάβατε €150 για την υπηρεσία επισκευής υδραυλικών',
    recipientId: 'pro1',
    isRead: true,
    createdAt: new Date(),
    icon: '💳',
    iconColor: '#3b82f6'
  }
];

// Mock notification functions
export const createNotification = async (notificationData: Omit<NotificationData, 'id' | 'createdAt'>) => {
  const notification: NotificationData = {
    ...notificationData,
    id: Date.now().toString(),
    createdAt: new Date(),
  };
  
  mockNotifications.unshift(notification);
  return notification.id;
};

export const getUserNotifications = async (userId: string): Promise<NotificationData[]> => {
  return mockNotifications.filter(notif => notif.recipientId === userId);
};

export const markNotificationAsRead = async (notificationId: string) => {
  const notification = mockNotifications.find(notif => notif.id === notificationId);
  if (notification) {
    notification.isRead = true;
  }
};

export const markAllNotificationsAsRead = async (userId: string) => {
  mockNotifications.forEach(notif => {
    if (notif.recipientId === userId && !notif.isRead) {
      notif.isRead = true;
    }
  });
};

export const deleteNotification = async (notificationId: string) => {
  mockNotifications = mockNotifications.filter(notif => notif.id !== notificationId);
};

// Real-time simulation with setInterval
export const subscribeToUserNotifications = (userId: string, callback: (notifications: NotificationData[]) => void) => {
  const updateNotifications = () => {
    const userNotifications = mockNotifications.filter(notif => notif.recipientId === userId);
    callback(userNotifications);
  };
  
  // Initial call
  updateNotifications();
  
  // Simulate real-time updates every 5 seconds
  const interval = setInterval(updateNotifications, 5000);
  
  // Return unsubscribe function
  return () => clearInterval(interval);
};

// Notification triggers
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
