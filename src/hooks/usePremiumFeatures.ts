import { useSubscriptionStore } from '../store/subscription/subscriptionStore';

export const usePremiumFeatures = () => {
  const { checkFeatureAccess, userSubscription } = useSubscriptionStore();

  const isPremiumUser = () => {
    return userSubscription?.status === 'active' && userSubscription?.planId !== 'free';
  };

  const hasFeatureAccess = (featureId: string) => {
    return checkFeatureAccess(featureId);
  };

  const getSubscriptionStatus = () => {
    if (!userSubscription) {
      return 'no_subscription';
    }
    
    return userSubscription.status;
  };

  const getPlanName = () => {
    if (!userSubscription) {
      return 'Δωρεάν';
    }
    
    switch (userSubscription.planId) {
      case 'free':
        return 'Δωρεάν';
      case 'premium':
        return 'Premium';
      case 'professional':
        return 'Professional';
      case 'enterprise':
        return 'Enterprise';
      default:
        return 'Άγνωστο';
    }
  };

  const getRemainingDays = () => {
    if (!userSubscription || userSubscription.status !== 'active') {
      return 0;
    }
    
    const now = new Date();
    const endDate = new Date(userSubscription.endDate);
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  };

  const isExpiringSoon = () => {
    const remainingDays = getRemainingDays();
    return remainingDays > 0 && remainingDays <= 7;
  };

  const canBookUnlimitedAppointments = () => {
    return hasFeatureAccess('unlimited_appointments');
  };

  const canUseAdvancedSearch = () => {
    return hasFeatureAccess('advanced_search');
  };

  const canAccessAnalytics = () => {
    return hasFeatureAccess('analytics');
  };

  const canManageCustomers = () => {
    return hasFeatureAccess('customer_management');
  };

  const canGetPrioritySupport = () => {
    return hasFeatureAccess('priority_support');
  };

  const canAccessExclusiveOffers = () => {
    return hasFeatureAccess('exclusive_offers');
  };

  return {
    isPremiumUser: isPremiumUser(),
    hasFeatureAccess,
    getSubscriptionStatus,
    getPlanName,
    getRemainingDays,
    isExpiringSoon: isExpiringSoon(),
    canBookUnlimitedAppointments: canBookUnlimitedAppointments(),
    canUseAdvancedSearch: canUseAdvancedSearch(),
    canAccessAnalytics: canAccessAnalytics(),
    canManageCustomers: canManageCustomers(),
    canGetPrioritySupport: canGetPrioritySupport(),
    canAccessExclusiveOffers: canAccessExclusiveOffers()
  };
};
