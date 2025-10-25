import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSubscriptionStore } from '../../store/subscription/subscriptionStore';
import { useAuthStore } from '../../store/auth/authStore';
import { trialService } from '../../services/subscription/trialService';

export default function SubscriptionScreen() {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const {
    availablePlans,
    userSubscription,
    isLoading,
    error,
    fetchAvailablePlans,
    fetchUserSubscription,
    selectPlan,
    subscribeToPlan,
    cancelSubscription,
    renewSubscription,
    clearError
  } = useSubscriptionStore();

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [trialUser, setTrialUser] = useState<any>(null);
  const [trialDaysRemaining, setTrialDaysRemaining] = useState(0);

  useEffect(() => {
    fetchAvailablePlans();
    if (user?.id) {
      fetchUserSubscription(user.id);
      
      // Check if user is on trial
      const trial = trialService.getTrialUser(user.id);
      if (trial) {
        setTrialUser(trial);
        setTrialDaysRemaining(trial.daysRemaining);
      }
    }
  }, [user?.id]);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
    selectPlan(planId);
  };

  const handleSubscribe = async () => {
    if (!selectedPlanId) {
      Alert.alert('Σφάλμα', 'Παρακαλώ επιλέξτε ένα σχέδιο συνδρομής');
      return;
    }

    try {
      await subscribeToPlan(selectedPlanId, 'card_123'); // Mock payment method
      Alert.alert('Επιτυχία', 'Η συνδρομή σας ενεργοποιήθηκε επιτυχώς!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Σφάλμα', 'Παρουσιάστηκε σφάλμα κατά την εγγραφή στη συνδρομή');
    }
  };

  const handleCancelSubscription = () => {
    Alert.alert(
      'Ακύρωση Συνδρομής',
      'Είστε σίγουροι ότι θέλετε να ακυρώσετε τη συνδρομή σας;',
      [
        { text: 'Όχι', style: 'cancel' },
        {
          text: 'Ναι, Ακύρωση',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelSubscription();
              Alert.alert('Επιτυχία', 'Η συνδρομή σας ακυρώθηκε');
            } catch (error) {
              Alert.alert('Σφάλμα', 'Παρουσιάστηκε σφάλμα κατά την ακύρωση');
            }
          }
        }
      ]
    );
  };

  const handleRenewSubscription = async () => {
    try {
      await renewSubscription();
      Alert.alert('Επιτυχία', 'Η συνδρομή σας ανανεώθηκε επιτυχώς!');
    } catch (error) {
      Alert.alert('Σφάλμα', 'Παρουσιάστηκε σφάλμα κατά την ανανέωση');
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('el-GR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Συνδρομές</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Φόρτωση...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Συνδρομές</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Subscription */}
        {userSubscription && (
          <View style={styles.currentSubscriptionContainer}>
            <Text style={styles.sectionTitle}>Τρέχουσα Συνδρομή</Text>
            <View style={styles.subscriptionCard}>
              <View style={styles.subscriptionHeader}>
                <Text style={styles.subscriptionIcon}>⭐</Text>
                <View style={styles.subscriptionInfo}>
                  <Text style={styles.subscriptionName}>Premium</Text>
                  <Text style={styles.subscriptionStatus}>
                    {userSubscription.status === 'active' ? 'Ενεργή' : 'Ανενεργή'}
                  </Text>
                </View>
                <View style={styles.subscriptionPrice}>
                  <Text style={styles.priceAmount}>€{userSubscription.amount}</Text>
                  <Text style={styles.priceInterval}>/μήνα</Text>
                </View>
              </View>
              
              <View style={styles.subscriptionDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Ημερομηνία έναρξης:</Text>
                  <Text style={styles.detailValue}>{formatDate(userSubscription.startDate)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Ημερομηνία λήξης:</Text>
                  <Text style={styles.detailValue}>{formatDate(userSubscription.endDate)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Αυτόματη ανανέωση:</Text>
                  <Text style={styles.detailValue}>
                    {userSubscription.autoRenew ? 'Ενεργή' : 'Ανενεργή'}
                  </Text>
                </View>
              </View>

              <View style={styles.subscriptionActions}>
                {userSubscription.status === 'active' ? (
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleCancelSubscription}
                  >
                    <Text style={styles.cancelButtonText}>Ακύρωση Συνδρομής</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.renewButton}
                    onPress={handleRenewSubscription}
                  >
                    <Text style={styles.renewButtonText}>Ανανέωση Συνδρομής</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Available Plans */}
        {/* Trial Information */}
        {trialUser && (
          <View style={styles.trialInfoContainer}>
            <Text style={styles.trialInfoTitle}>
              {trialUser.isExpired ? 'Η δωρεάν δοκιμή σας έχει λήξει' : 'Δωρεάν Δοκιμή'}
            </Text>
            <Text style={styles.trialInfoText}>
              {trialUser.isExpired 
                ? 'Παρακαλώ επιλέξτε το πρόγραμμα Premium (€9.99/μήνα) για να συνεχίσετε.'
                : `Απομένουν ${trialDaysRemaining} ημέρες από τη δωρεάν δοκιμή σας (90 ημέρες).`
              }
            </Text>
            <View style={styles.trialProgressContainer}>
              <View style={styles.trialProgressBar}>
                <View 
                  style={[
                    styles.trialProgressFill, 
                    { 
                      width: `${Math.max(0, (90 - trialDaysRemaining) / 90 * 100)}%`,
                      backgroundColor: trialUser.isExpired ? '#FF4D4F' : '#007AFF'
                    }
                  ]} 
                />
              </View>
              <Text style={styles.trialProgressText}>
                {trialUser.isExpired ? 'Λήξει' : `${90 - trialDaysRemaining}/90 ημέρες`}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.plansContainer}>
          <Text style={styles.sectionTitle}>Διαθέσιμα Σχέδια</Text>
          
          {availablePlans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                selectedPlanId === plan.id && styles.selectedPlan,
                plan.isPopular && styles.popularPlan
              ]}
              onPress={() => handleSelectPlan(plan.id)}
            >
              {plan.isPopular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularBadgeText}>Δημοφιλές</Text>
                </View>
              )}
              
              <View style={styles.planHeader}>
                <Text style={styles.planIcon}>{plan.icon}</Text>
                <View style={styles.planInfo}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <Text style={styles.planDescription}>{plan.description}</Text>
                </View>
                <View style={styles.planPrice}>
                  <Text style={styles.planPriceAmount}>€{plan.price}</Text>
                  <Text style={styles.planPriceInterval}>
                    {plan.price === 0 ? '' : `/${plan.interval === 'monthly' ? 'μήνα' : 'έτος'}`}
                  </Text>
                </View>
              </View>

              <View style={styles.planFeatures}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Text style={styles.featureIcon}>✓</Text>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Subscribe Button */}
        {selectedPlanId && (
          <TouchableOpacity
            style={styles.subscribeButton}
            onPress={handleSubscribe}
          >
            <Text style={styles.subscribeButtonText}>
              Εγγραφή στη Συνδρομή
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 20,
    color: '#007AFF',
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  currentSubscriptionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  subscriptionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  subscriptionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  subscriptionInfo: {
    flex: 1,
  },
  subscriptionName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  subscriptionStatus: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '500',
  },
  subscriptionPrice: {
    alignItems: 'flex-end',
  },
  priceAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  priceInterval: {
    fontSize: 12,
    color: '#6b7280',
  },
  subscriptionDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  subscriptionActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  renewButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  renewButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  plansContainer: {
    marginBottom: 24,
  },
  planCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    position: 'relative',
  },
  selectedPlan: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  popularPlan: {
    borderColor: '#f59e0b',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: 16,
    backgroundColor: '#f59e0b',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  planIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  planDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  planPrice: {
    alignItems: 'flex-end',
  },
  planPriceAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  planPriceInterval: {
    fontSize: 12,
    color: '#6b7280',
  },
  planFeatures: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureIcon: {
    fontSize: 16,
    color: '#10b981',
    marginRight: 8,
    fontWeight: 'bold',
  },
  featureText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  subscribeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  subscribeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  trialInfoContainer: {
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#91D5FF',
  },
  trialInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0056B3',
    marginBottom: 8,
  },
  trialInfoText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
    lineHeight: 20,
  },
  trialProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trialProgressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginRight: 12,
  },
  trialProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  trialProgressText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
});
