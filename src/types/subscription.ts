export interface SubscriptionPlan {
  id: 'free' | 'premium';
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: string[];
  isPopular?: boolean;
  icon: string;
  duration?: number; // Duration in days for free plan
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'inactive' | 'cancelled' | 'expired' | 'pending' | 'trial_expired';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  paymentMethod: string;
  lastPaymentDate: Date;
  nextPaymentDate: Date;
  amount: number;
  currency: string;
  isTrialUser?: boolean;
  trialStartDate?: Date;
  trialEndDate?: Date;
  trialExpirationNotified?: boolean;
}

export interface SubscriptionFeature {
  id: string;
  name: string;
  description: string;
  icon: string;
  isPremium: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'apple_pay' | 'google_pay';
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

export interface SubscriptionState {
  currentPlan: SubscriptionPlan | null;
  userSubscription: UserSubscription | null;
  availablePlans: SubscriptionPlan[];
  features: SubscriptionFeature[];
  paymentMethods: PaymentMethod[];
  isLoading: boolean;
  error: string | null;
}
