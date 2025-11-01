import { UserSubscription } from '../../types/subscription';
import { SUBSCRIPTION_CONFIG } from '../../config/subscription';

export interface TrialUser {
  userId: string;
  email: string;
  name: string;
  trialStartDate: Date;
  trialEndDate: Date;
  isExpired: boolean;
  expirationNotified: number[]; // Array of days (e.g., [10, 5, 1]) that notifications have been sent
  daysRemaining: number;
}

export interface TrialNotification {
  userId: string;
  type: 'trial_expiring' | 'trial_expired' | 'trial_reminder';
  message: string;
  daysRemaining?: number;
  createdAt: Date;
}

class TrialService {
  private trialUsers: TrialUser[] = [];
  private notifications: TrialNotification[] = [];

  // Initialize trial for new user
  initializeTrial(userId: string, email: string, name: string): UserSubscription {
    const now = new Date();
    const trialEndDate = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000); // 90 days (3 months) from now

    const trialUser: TrialUser = {
      userId,
      email,
      name,
      trialStartDate: now,
      trialEndDate,
      isExpired: false,
      expirationNotified: [], // Array to track which notification days have been sent
      daysRemaining: 90,
    };

    this.trialUsers.push(trialUser);

    // Create trial subscription
    const trialSubscription: UserSubscription = {
      id: `trial_${userId}_${Date.now()}`,
      userId,
      planId: 'free',
      status: 'active',
      startDate: now,
      endDate: trialEndDate,
      autoRenew: false,
      paymentMethod: 'trial',
      lastPaymentDate: now,
      nextPaymentDate: trialEndDate,
      amount: 0,
      currency: 'EUR',
      isTrialUser: true,
      trialStartDate: now,
      trialEndDate,
      trialExpirationNotified: false,
    };

    return trialSubscription;
  }

  // Check trial expiration and send notifications
  checkTrialExpirations(): TrialNotification[] {
    const now = new Date();
    const newNotifications: TrialNotification[] = [];

    this.trialUsers.forEach(trialUser => {
      const daysRemaining = Math.ceil((trialUser.trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      // Update days remaining
      trialUser.daysRemaining = daysRemaining;

      // Check if trial has expired
      if (now > trialUser.trialEndDate && !trialUser.isExpired) {
        trialUser.isExpired = true;
        
        const notification: TrialNotification = {
          userId: trialUser.userId,
          type: 'trial_expired',
          message: `Η δωρεάν δοκιμή σας έχει λήξει. Παρακαλώ επιλέξτε το πρόγραμμα Premium (€9.99/μήνα) για να συνεχίσετε.`,
          createdAt: now,
        };

        newNotifications.push(notification);
        this.notifications.push(notification);
      }
      // Check if trial is expiring soon (notifications at 10, 5, 1 days before expiry)
      else if (daysRemaining > 0 && daysRemaining <= 10) {
        // Get notification days from config (default: [10, 5, 1])
        const notificationDays = SUBSCRIPTION_CONFIG.NOTIFICATION_DAYS;
        
        // Check if current days remaining matches a notification day and hasn't been sent yet
        if (notificationDays.includes(daysRemaining) && !trialUser.expirationNotified.includes(daysRemaining)) {
          let notificationType: 'trial_expiring' | 'trial_reminder';
          let message: string;

          if (daysRemaining === 10) {
            notificationType = 'trial_expiring';
            message = `Η δωρεάν δοκιμή σας λήγει σε 10 ημέρες. Επιλέξτε το πρόγραμμα Premium (€9.99/μήνα) για να συνεχίσετε.`;
          } else if (daysRemaining === 5) {
            notificationType = 'trial_reminder';
            message = `Η δωρεάν δοκιμή σας λήγει σε 5 ημέρες. Επιλέξτε το πρόγραμμα Premium (€9.99/μήνα) τώρα!`;
          } else if (daysRemaining === 1) {
            notificationType = 'trial_reminder';
            message = `Η δωρεάν δοκιμή σας λήγει αύριο! Επιλέξτε το πρόγραμμα Premium (€9.99/μήνα) για να αποφύγετε την απώλεια πρόσβασης.`;
          } else {
            // Generic message for other notification days
            notificationType = 'trial_reminder';
            message = `Η δωρεάν δοκιμή σας λήγει σε ${daysRemaining} ημέρες. Επιλέξτε το πρόγραμμα Premium (€9.99/μήνα) για να συνεχίσετε.`;
          }

          const notification: TrialNotification = {
            userId: trialUser.userId,
            type: notificationType,
            message,
            daysRemaining,
            createdAt: now,
          };

          newNotifications.push(notification);
          this.notifications.push(notification);
          
          // Mark this notification day as sent
          trialUser.expirationNotified.push(daysRemaining);
        }
      }
    });

    return newNotifications;
  }

  // Get trial user info
  getTrialUser(userId: string): TrialUser | null {
    return this.trialUsers.find(user => user.userId === userId) || null;
  }

  // Get all trial users
  getAllTrialUsers(): TrialUser[] {
    return this.trialUsers;
  }

  // Get expired trial users
  getExpiredTrialUsers(): TrialUser[] {
    return this.trialUsers.filter(user => user.isExpired);
  }

  // Get trial users expiring soon (within 10 days)
  getTrialUsersExpiringSoon(): TrialUser[] {
    const now = new Date();
    return this.trialUsers.filter(user => {
      const daysRemaining = Math.ceil((user.trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return daysRemaining <= 10 && daysRemaining > 0 && !user.isExpired;
    });
  }

  // Convert trial user to paid subscription
  convertTrialToPaid(userId: string, planId: string, paymentMethodId: string): UserSubscription {
    const trialUser = this.getTrialUser(userId);
    if (!trialUser) {
      throw new Error('Trial user not found');
    }

    const now = new Date();
    const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

    // Remove from trial users
    this.trialUsers = this.trialUsers.filter(user => user.userId !== userId);

    // Create paid subscription
    const paidSubscription: UserSubscription = {
      id: `paid_${userId}_${Date.now()}`,
      userId,
      planId,
      status: 'active',
      startDate: now,
      endDate,
      autoRenew: true,
      paymentMethod: paymentMethodId,
      lastPaymentDate: now,
      nextPaymentDate: endDate,
      amount: this.getPlanPrice(planId),
      currency: 'EUR',
      isTrialUser: false,
    };

    return paidSubscription;
  }

  // Get plan price
  private getPlanPrice(planId: string): number {
    const prices: { [key: string]: number } = {
      'free': 0,
      'premium': 9.99,
      'professional': 19.99,
      'enterprise': 49.99,
    };
    return prices[planId] || 0;
  }

  // Get trial notifications for user
  getTrialNotifications(userId: string): TrialNotification[] {
    return this.notifications.filter(notification => notification.userId === userId);
  }

  // Mark notification as read
  markNotificationAsRead(userId: string, notificationId: string): void {
    // In a real app, this would update the database
    console.log(`Marked notification ${notificationId} as read for user ${userId}`);
  }

  // Get trial statistics
  getTrialStatistics(): {
    totalTrialUsers: number;
    activeTrials: number;
    expiredTrials: number;
    expiringSoon: number;
  } {
    const now = new Date();
    const activeTrials = this.trialUsers.filter(user => !user.isExpired);
    const expiredTrials = this.trialUsers.filter(user => user.isExpired);
    const expiringSoon = this.getTrialUsersExpiringSoon().length;

    return {
      totalTrialUsers: this.trialUsers.length,
      activeTrials: activeTrials.length,
      expiredTrials: expiredTrials.length,
      expiringSoon,
    };
  }
}

export const trialService = new TrialService();
