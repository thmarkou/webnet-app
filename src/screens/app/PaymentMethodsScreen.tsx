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
import { PaymentMethod } from '../../types/subscription';

export default function PaymentMethodsScreen() {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const {
    paymentMethods,
    isLoading,
    error,
    fetchPaymentMethods,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
    clearError
  } = useSubscriptionStore();

  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchPaymentMethods(user.id);
    }
  }, [user?.id]);

  const handleRemovePaymentMethod = (paymentMethodId: string) => {
    Alert.alert(
      'Διαγραφή Μεθόδου Πληρωμής',
      'Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή τη μέθοδο πληρωμής;',
      [
        { text: 'Όχι', style: 'cancel' },
        {
          text: 'Ναι, Διαγραφή',
          style: 'destructive',
          onPress: () => removePaymentMethod(paymentMethodId)
        }
      ]
    );
  };

  const handleSetDefault = (paymentMethodId: string) => {
    setDefaultPaymentMethod(paymentMethodId);
    Alert.alert('Επιτυχία', 'Η προεπιλεγμένη μέθοδος πληρωμής άλλαξε');
  };

  const handleAddPaymentMethod = () => {
    // Mock adding a new payment method
    const newPaymentMethod: Omit<PaymentMethod, 'id'> = {
      type: 'card',
      last4: '1234',
      brand: 'Visa',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: paymentMethods.length === 0
    };

    addPaymentMethod(newPaymentMethod);
    setShowAddForm(false);
    Alert.alert('Επιτυχία', 'Η μέθοδος πληρωμής προστέθηκε επιτυχώς');
  };

  const getCardIcon = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return '💳';
      case 'mastercard':
        return '💳';
      case 'amex':
        return '💳';
      default:
        return '💳';
    }
  };

  const getPaymentMethodType = (type: string) => {
    switch (type) {
      case 'card':
        return 'Κάρτα';
      case 'paypal':
        return 'PayPal';
      case 'apple_pay':
        return 'Apple Pay';
      case 'google_pay':
        return 'Google Pay';
      default:
        return 'Άγνωστο';
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Μέθοδοι Πληρωμής</Text>
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
        <Text style={styles.title}>Μέθοδοι Πληρωμής</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Payment Methods List */}
        <View style={styles.paymentMethodsContainer}>
          {paymentMethods.map((method) => (
            <View key={method.id} style={styles.paymentMethodCard}>
              <View style={styles.paymentMethodHeader}>
                <View style={styles.paymentMethodInfo}>
                  <Text style={styles.paymentMethodIcon}>
                    {getCardIcon(method.brand)}
                  </Text>
                  <View style={styles.paymentMethodDetails}>
                    <Text style={styles.paymentMethodType}>
                      {getPaymentMethodType(method.type)}
                    </Text>
                    <Text style={styles.paymentMethodNumber}>
                      **** **** **** {method.last4}
                    </Text>
                    <Text style={styles.paymentMethodExpiry}>
                      Λήγει: {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.paymentMethodActions}>
                  {method.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultBadgeText}>Προεπιλογή</Text>
                    </View>
                  )}
                  
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleSetDefault(method.id)}
                    disabled={method.isDefault}
                  >
                    <Text style={[
                      styles.actionButtonText,
                      method.isDefault && styles.disabledButtonText
                    ]}>
                      {method.isDefault ? 'Προεπιλογή' : 'Ορισμός'}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemovePaymentMethod(method.id)}
                  >
                    <Text style={styles.removeButtonText}>Διαγραφή</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Add Payment Method */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddForm(true)}
        >
          <Text style={styles.addButtonIcon}>+</Text>
          <Text style={styles.addButtonText}>Προσθήκη Μεθόδου Πληρωμής</Text>
        </TouchableOpacity>

        {/* Add Payment Method Form */}
        {showAddForm && (
          <View style={styles.addFormContainer}>
            <Text style={styles.addFormTitle}>Προσθήκη Νέας Κάρτας</Text>
            <Text style={styles.addFormDescription}>
              Προσθέστε μια νέα κάρτα για τις πληρωμές σας
            </Text>
            
            <View style={styles.addFormActions}>
              <TouchableOpacity
                style={styles.cancelFormButton}
                onPress={() => setShowAddForm(false)}
              >
                <Text style={styles.cancelFormButtonText}>Ακύρωση</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.confirmFormButton}
                onPress={handleAddPaymentMethod}
              >
                <Text style={styles.confirmFormButtonText}>Προσθήκη</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <Text style={styles.securityIcon}>🔒</Text>
          <Text style={styles.securityText}>
            Όλες οι πληρωμές είναι ασφαλείς και κρυπτογραφημένες. 
            Δεν αποθηκεύουμε τα στοιχεία της κάρτας σας.
          </Text>
        </View>
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
  paymentMethodsContainer: {
    marginBottom: 24,
  },
  paymentMethodCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  paymentMethodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  paymentMethodDetails: {
    flex: 1,
  },
  paymentMethodType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  paymentMethodNumber: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  paymentMethodExpiry: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  paymentMethodActions: {
    alignItems: 'flex-end',
  },
  defaultBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  defaultBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 8,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  disabledButtonText: {
    color: '#9ca3af',
  },
  removeButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  removeButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  addButtonIcon: {
    fontSize: 20,
    color: '#007AFF',
    marginRight: 8,
  },
  addButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  addFormContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  addFormTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  addFormDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  addFormActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelFormButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  cancelFormButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  confirmFormButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  confirmFormButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  securityNotice: {
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  securityIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  securityText: {
    fontSize: 12,
    color: '#0369a1',
    flex: 1,
    lineHeight: 16,
  },
});
