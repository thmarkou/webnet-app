import { trialService } from './trialService';
import { useSubscriptionStore } from '../../store/subscription/subscriptionStore';

class TrialBackgroundService {
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;

  // Start the background service
  start() {
    if (this.isRunning) {
      console.log('Trial background service is already running');
      return;
    }

    console.log('Starting trial background service...');
    this.isRunning = true;

    // Check trial expirations every 5 minutes
    this.intervalId = setInterval(() => {
      this.checkTrialExpirations();
    }, 5 * 60 * 1000); // 5 minutes

    // Also check immediately on start
    this.checkTrialExpirations();
  }

  // Stop the background service
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('Trial background service stopped');
  }

  // Check trial expirations and send notifications
  private checkTrialExpirations() {
    try {
      console.log('Checking trial expirations...');
      
      // Get notifications from trial service
      const notifications = trialService.checkTrialExpirations();
      
      if (notifications.length > 0) {
        console.log(`Found ${notifications.length} trial expiration notifications`);
        
        // In a real app, you would:
        // 1. Send push notifications to users
        // 2. Send email notifications
        // 3. Update the database
        // 4. Trigger in-app notifications
        
        notifications.forEach(notification => {
          console.log(`Trial notification for user ${notification.userId}: ${notification.message}`);
          
          // Here you would integrate with your notification system
          // For example, send to Firebase Cloud Messaging, email service, etc.
          this.sendTrialNotification(notification);
        });
      } else {
        console.log('No trial expiration notifications found');
      }
    } catch (error) {
      console.error('Error checking trial expirations:', error);
    }
  }

  // Send trial notification (mock implementation)
  private sendTrialNotification(notification: any) {
    // In a real app, this would:
    // 1. Send push notification via FCM
    // 2. Send email notification
    // 3. Update user's notification list
    // 4. Trigger in-app notification
    
    console.log(`Sending trial notification to user ${notification.userId}:`, {
      type: notification.type,
      message: notification.message,
      daysRemaining: notification.daysRemaining,
      createdAt: notification.createdAt
    });

    // Mock implementation - in real app, integrate with your notification system
    this.mockSendNotification(notification);
  }

  // Mock notification sending
  private mockSendNotification(notification: any) {
    // This is a mock implementation
    // In a real app, you would:
    // - Send push notification via Firebase Cloud Messaging
    // - Send email via SendGrid, Mailgun, etc.
    // - Update the user's notification list in the database
    // - Trigger in-app notification
    
    const notificationData = {
      userId: notification.userId,
      type: 'trial_notification',
      title: this.getNotificationTitle(notification.type),
      message: notification.message,
      data: {
        trialType: notification.type,
        daysRemaining: notification.daysRemaining,
        action: 'upgrade_subscription'
      },
      timestamp: new Date().toISOString()
    };

    console.log('Mock notification sent:', notificationData);
    
    // In a real app, you would store this in the database
    // and trigger the appropriate notification channels
  }

  // Get notification title based on type
  private getNotificationTitle(type: string): string {
    switch (type) {
      case 'trial_expiring':
        return 'Η δωρεάν δοκιμή σας λήγει σύντομα';
      case 'trial_expired':
        return 'Η δωρεάν δοκιμή σας έχει λήξει';
      case 'trial_reminder':
        return 'Υπενθύμιση δωρεάν δοκιμής';
      default:
        return 'Ειδοποίηση δωρεάν δοκιμής';
    }
  }

  // Get service status
  getStatus() {
    return {
      isRunning: this.isRunning,
      intervalId: this.intervalId !== null
    };
  }

  // Force check trial expirations (for testing)
  forceCheck() {
    console.log('Force checking trial expirations...');
    this.checkTrialExpirations();
  }
}

// Create singleton instance
export const trialBackgroundService = new TrialBackgroundService();

// Auto-start the service when the module is imported
// In a real app, you would start this in your app initialization
trialBackgroundService.start();
