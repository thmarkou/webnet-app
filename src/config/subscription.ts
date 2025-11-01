/**
 * Subscription System Configuration
 * 
 * This file controls whether the subscription system is active or disabled.
 * 
 * For Development: Set to false to disable subscription features
 * For Production: Set to true to enable subscription features
 */

export const SUBSCRIPTION_SYSTEM_ENABLED = false; // Set to true for production deployment

export const SUBSCRIPTION_CONFIG = {
  // Trial period settings
  TRIAL_DURATION_DAYS: 90, // 3 months
  NOTIFICATION_DAYS: [10, 5, 1], // Days before expiry to send notifications
  
  // Subscription plans
  // Note: Free and Premium have the SAME features - the only difference is duration
  // Free: 3 months (90 days), Premium: Monthly subscription
  PLANS: {
    FREE: {
      id: 'free',
      name: 'Δωρεάν',
      price: 0,
      duration: 90, // days (3 months)
      features: ['Όλες οι λειτουργίες', 'Αναζήτηση επαγγελματιών', 'Κλείσιμο ραντεβού', 'Στατιστικά', 'Απεριόριστα ραντεβού']
    },
    PREMIUM: {
      id: 'premium',
      name: 'Premium',
      price: 9.99,
      duration: 30, // days (monthly)
      features: ['Όλες οι λειτουργίες', 'Αναζήτηση επαγγελματιών', 'Κλείσιμο ραντεβού', 'Στατιστικά', 'Απεριόριστα ραντεβού']
    }
  },
  
  // Currency
  CURRENCY: 'EUR',
  
  // Payment methods (for future implementation)
  PAYMENT_METHODS: ['credit_card', 'paypal', 'apple_pay', 'google_pay']
};

/**
 * Check if subscription system is enabled
 */
export const isSubscriptionEnabled = (): boolean => {
  return SUBSCRIPTION_SYSTEM_ENABLED;
};

/**
 * Get subscription configuration
 */
export const getSubscriptionConfig = () => {
  return SUBSCRIPTION_CONFIG;
};
