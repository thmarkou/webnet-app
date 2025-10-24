import { create } from 'zustand';

interface Notification {
  id: string;
  type: 'appointment_confirmed' | 'appointment_reminder' | 'friend_request' | 'review_request';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  icon: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
}

interface NotificationActions {
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
  updateUnreadCount: () => void;
}

export const useNotificationStore = create<NotificationState & NotificationActions>((set, get) => ({
  // State
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  // Actions
  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
    };
    
    set((state) => ({
      notifications: [newNotification, ...state.notifications],
    }));
    
    get().updateUnreadCount();
  },

  markAsRead: (notificationId) => {
    set((state) => ({
      notifications: state.notifications.map(notif =>
        notif.id === notificationId
          ? { ...notif, isRead: true }
          : notif
      ),
    }));
    
    get().updateUnreadCount();
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map(notif => ({
        ...notif,
        isRead: true,
      })),
    }));
    
    get().updateUnreadCount();
  },

  removeNotification: (notificationId) => {
    set((state) => ({
      notifications: state.notifications.filter(notif => notif.id !== notificationId),
    }));
    
    get().updateUnreadCount();
  },

  clearAllNotifications: () => {
    set({ notifications: [], unreadCount: 0 });
  },

  updateUnreadCount: () => {
    const state = get();
    const unreadCount = state.notifications.filter(notif => !notif.isRead).length;
    set({ unreadCount });
  },
}));
