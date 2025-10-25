import { create } from 'zustand';
import { SubscriptionPlan, UserSubscription, SubscriptionFeature, PaymentMethod, SubscriptionState } from '../../types/subscription';
import { trialService, TrialUser, TrialNotification } from '../../services/subscription/trialService';

interface SubscriptionActions {
  // Subscription Plans
  fetchAvailablePlans: () => Promise<void>;
  selectPlan: (planId: string) => void;
  
  // User Subscription
  fetchUserSubscription: (userId: string) => Promise<void>;
  subscribeToPlan: (planId: string, paymentMethodId: string) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  renewSubscription: () => Promise<void>;
  
  // Payment Methods
  fetchPaymentMethods: (userId: string) => Promise<void>;
  addPaymentMethod: (paymentMethod: Omit<PaymentMethod, 'id'>) => Promise<void>;
  removePaymentMethod: (paymentMethodId: string) => Promise<void>;
  setDefaultPaymentMethod: (paymentMethodId: string) => Promise<void>;
  
  // Features
  fetchFeatures: () => Promise<void>;
  checkFeatureAccess: (featureId: string) => boolean;
  
  // Trial Management
  initializeTrial: (userId: string, email: string, name: string) => UserSubscription;
  checkTrialExpirations: () => TrialNotification[];
  getTrialUser: (userId: string) => TrialUser | null;
  convertTrialToPaid: (userId: string, planId: string, paymentMethodId: string) => UserSubscription;
  getTrialNotifications: (userId: string) => TrialNotification[];
  isTrialExpired: (userId: string) => boolean;
  getTrialDaysRemaining: (userId: string) => number;
  
  // Utility
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useSubscriptionStore = create<SubscriptionState & SubscriptionActions>((set, get) => ({
  // State
  currentPlan: null,
  userSubscription: null,
  availablePlans: [],
  features: [],
  paymentMethods: [],
  isLoading: false,
  error: null,

  // Actions
  fetchAvailablePlans: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Mock subscription plans
      const mockPlans: SubscriptionPlan[] = [
        {
          id: 'free',
          name: 'Δωρεάν',
          description: '3 μήνες απεριόριστη πρόσβαση',
          price: 0,
          currency: 'EUR',
          interval: 'monthly',
          duration: 90, // 90 days (3 months)
          features: [
            'Απεριόριστα ραντεβού',
            'Αναζήτηση επαγγελματιών',
            'Αξιολογήσεις και κριτικές',
            'Ειδοποιήσεις εφαρμογής',
            '3 μήνες δωρεάν πρόσβαση'
          ],
          icon: '🆓'
        },
        {
          id: 'premium',
          name: 'Premium',
          description: 'Απεριόριστη πρόσβαση με €9.99/μήνα',
          price: 9.99,
          currency: 'EUR',
          interval: 'monthly',
          features: [
            'Απεριόριστα ραντεβού',
            'Αναζήτηση επαγγελματιών',
            'Αξιολογήσεις και κριτικές',
            'Ειδοποιήσεις εφαρμογής',
            'Προτεραιότητα στην αναζήτηση',
            'Αποκλειστικές προσφορές',
            'Συμβουλευτική υποστήριξη'
          ],
          isPopular: true,
          icon: '⭐'
        }
      ];
      
      set({ availablePlans: mockPlans, isLoading: false });
    } catch (error) {
      set({ 
        error: 'Σφάλμα κατά τη φόρτωση των συνδρομών', 
        isLoading: false 
      });
    }
  },

  selectPlan: (planId: string) => {
    const { availablePlans } = get();
    const selectedPlan = availablePlans.find(plan => plan.id === planId);
    if (selectedPlan) {
      set({ currentPlan: selectedPlan });
    }
  },

  fetchUserSubscription: async (userId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Check if user is on trial first
      const trialUser = trialService.getTrialUser(userId);
      let mockSubscription: UserSubscription;
      
      if (trialUser) {
        // User is on trial
        mockSubscription = {
          id: `trial_${userId}`,
          userId: userId,
          planId: 'free',
          status: trialUser.isExpired ? 'trial_expired' : 'active',
          startDate: trialUser.trialStartDate,
          endDate: trialUser.trialEndDate,
          autoRenew: false,
          paymentMethod: 'trial',
          lastPaymentDate: trialUser.trialStartDate,
          nextPaymentDate: trialUser.trialEndDate,
          amount: 0,
          currency: 'EUR',
          isTrialUser: true,
          trialStartDate: trialUser.trialStartDate,
          trialEndDate: trialUser.trialEndDate,
          trialExpirationNotified: trialUser.expirationNotified,
        };
      } else {
        // Initialize trial for new user
        const { user } = useAuthStore.getState();
        if (user) {
          const trialSubscription = trialService.initializeTrial(userId, user.email, user.name);
          mockSubscription = trialSubscription;
        } else {
          // Fallback for demo users
          mockSubscription = {
            id: `sub_${userId}`,
            userId: userId,
            planId: 'free',
            status: 'active',
            startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            autoRenew: false,
            paymentMethod: 'none',
            lastPaymentDate: new Date(),
            nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            amount: 0,
            currency: 'EUR'
          };
        }
      }
      
      set({ userSubscription: mockSubscription, isLoading: false });
    } catch (error) {
      set({ 
        error: 'Σφάλμα κατά τη φόρτωση της συνδρομής', 
        isLoading: false 
      });
    }
  },

  subscribeToPlan: async (planId: string, paymentMethodId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const { availablePlans } = get();
      const selectedPlan = availablePlans.find(plan => plan.id === planId);
      
      if (selectedPlan) {
        const newSubscription: UserSubscription = {
          id: `sub_${Date.now()}`,
          userId: 'user1', // This should come from auth store
          planId: planId,
          status: 'active',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          autoRenew: true,
          paymentMethod: paymentMethodId,
          lastPaymentDate: new Date(),
          nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          amount: selectedPlan.price,
          currency: selectedPlan.currency
        };
        
        set({ userSubscription: newSubscription, isLoading: false });
      }
    } catch (error) {
      set({ 
        error: 'Σφάλμα κατά την εγγραφή στη συνδρομή', 
        isLoading: false 
      });
    }
  },

  cancelSubscription: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { userSubscription } = get();
      if (userSubscription) {
        const updatedSubscription = {
          ...userSubscription,
          status: 'cancelled' as const,
          autoRenew: false
        };
        
        set({ userSubscription: updatedSubscription, isLoading: false });
      }
    } catch (error) {
      set({ 
        error: 'Σφάλμα κατά την ακύρωση της συνδρομής', 
        isLoading: false 
      });
    }
  },

  renewSubscription: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { userSubscription } = get();
      if (userSubscription) {
        const updatedSubscription = {
          ...userSubscription,
          status: 'active' as const,
          autoRenew: true,
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        };
        
        set({ userSubscription: updatedSubscription, isLoading: false });
      }
    } catch (error) {
      set({ 
        error: 'Σφάλμα κατά την ανανέωση της συνδρομής', 
        isLoading: false 
      });
    }
  },

  fetchPaymentMethods: async (userId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Mock payment methods
      const mockPaymentMethods: PaymentMethod[] = [
        {
          id: 'card_123',
          type: 'card',
          last4: '4242',
          brand: 'Visa',
          expiryMonth: 12,
          expiryYear: 2025,
          isDefault: true
        },
        {
          id: 'card_456',
          type: 'card',
          last4: '5555',
          brand: 'Mastercard',
          expiryMonth: 8,
          expiryYear: 2026,
          isDefault: false
        }
      ];
      
      set({ paymentMethods: mockPaymentMethods, isLoading: false });
    } catch (error) {
      set({ 
        error: 'Σφάλμα κατά τη φόρτωση των μεθόδων πληρωμής', 
        isLoading: false 
      });
    }
  },

  addPaymentMethod: async (paymentMethod: Omit<PaymentMethod, 'id'>) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPaymentMethod: PaymentMethod = {
        ...paymentMethod,
        id: `card_${Date.now()}`
      };
      
      const { paymentMethods } = get();
      set({ 
        paymentMethods: [...paymentMethods, newPaymentMethod], 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: 'Σφάλμα κατά την προσθήκη της μεθόδου πληρωμής', 
        isLoading: false 
      });
    }
  },

  removePaymentMethod: async (paymentMethodId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { paymentMethods } = get();
      const updatedMethods = paymentMethods.filter(method => method.id !== paymentMethodId);
      
      set({ paymentMethods: updatedMethods, isLoading: false });
    } catch (error) {
      set({ 
        error: 'Σφάλμα κατά τη διαγραφή της μεθόδου πληρωμής', 
        isLoading: false 
      });
    }
  },

  setDefaultPaymentMethod: async (paymentMethodId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { paymentMethods } = get();
      const updatedMethods = paymentMethods.map(method => ({
        ...method,
        isDefault: method.id === paymentMethodId
      }));
      
      set({ paymentMethods: updatedMethods, isLoading: false });
    } catch (error) {
      set({ 
        error: 'Σφάλμα κατά την αλλαγή της προεπιλεγμένης μεθόδου πληρωμής', 
        isLoading: false 
      });
    }
  },

  fetchFeatures: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Mock subscription features
      const mockFeatures: SubscriptionFeature[] = [
        {
          id: 'unlimited_appointments',
          name: 'Απεριόριστα Ραντεβού',
          description: 'Κλείστε όσα ραντεβού θέλετε χωρίς περιορισμούς',
          icon: '📅',
          isPremium: true
        },
        {
          id: 'advanced_search',
          name: 'Προηγμένη Αναζήτηση',
          description: 'Φίλτρα αναζήτησης για να βρείτε τον ιδανικό επαγγελματία',
          icon: '🔍',
          isPremium: true
        },
        {
          id: 'priority_support',
          name: 'Προτεραιότητα Υποστήριξης',
          description: 'Γρήγορη και αποκλειστική υποστήριξη',
          icon: '🎯',
          isPremium: true
        },
        {
          id: 'exclusive_offers',
          name: 'Αποκλειστικές Προσφορές',
          description: 'Ειδικές εκπτώσεις και προσφορές μόνο για εσάς',
          icon: '🎁',
          isPremium: true
        },
        {
          id: 'analytics',
          name: 'Αναλυτικά Στοιχεία',
          description: 'Στατιστικά και αναφορές για τη χρήση σας',
          icon: '📊',
          isPremium: true
        },
        {
          id: 'customer_management',
          name: 'Διαχείριση Πελατών',
          description: 'Οργανώστε τους πελάτες σας και τα ραντεβού τους',
          icon: '👥',
          isPremium: true
        }
      ];
      
      set({ features: mockFeatures, isLoading: false });
    } catch (error) {
      set({ 
        error: 'Σφάλμα κατά τη φόρτωση των λειτουργιών', 
        isLoading: false 
      });
    }
  },

  checkFeatureAccess: (featureId: string) => {
    const { userSubscription, features } = get();
    
    if (!userSubscription || userSubscription.status !== 'active') {
      return false;
    }
    
    const feature = features.find(f => f.id === featureId);
    if (!feature) {
      return false;
    }
    
    // Check if user's plan includes this feature
    const { availablePlans } = get();
    const userPlan = availablePlans.find(plan => plan.id === userSubscription.planId);
    
    if (!userPlan) {
      return false;
    }
    
    // Free plan has limited access
    if (userPlan.id === 'free') {
      return false;
    }
    
    return true;
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },

  // Trial Management
  initializeTrial: (userId: string, email: string, name: string) => {
    const trialSubscription = trialService.initializeTrial(userId, email, name);
    set({ userSubscription: trialSubscription });
    return trialSubscription;
  },

  checkTrialExpirations: () => {
    return trialService.checkTrialExpirations();
  },

  getTrialUser: (userId: string) => {
    return trialService.getTrialUser(userId);
  },

  convertTrialToPaid: (userId: string, planId: string, paymentMethodId: string) => {
    const paidSubscription = trialService.convertTrialToPaid(userId, planId, paymentMethodId);
    set({ userSubscription: paidSubscription });
    return paidSubscription;
  },

  getTrialNotifications: (userId: string) => {
    return trialService.getTrialNotifications(userId);
  },

  isTrialExpired: (userId: string) => {
    const trialUser = trialService.getTrialUser(userId);
    return trialUser ? trialUser.isExpired : false;
  },

  getTrialDaysRemaining: (userId: string) => {
    const trialUser = trialService.getTrialUser(userId);
    return trialUser ? trialUser.daysRemaining : 0;
  }
}));
