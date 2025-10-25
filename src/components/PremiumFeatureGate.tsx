import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { usePremiumFeatures } from '../hooks/usePremiumFeatures';

interface PremiumFeatureGateProps {
  featureId: string;
  children: React.ReactNode;
  fallbackComponent?: React.ReactNode;
  showUpgradePrompt?: boolean;
}

export default function PremiumFeatureGate({
  featureId,
  children,
  fallbackComponent,
  showUpgradePrompt = true
}: PremiumFeatureGateProps) {
  const navigation = useNavigation();
  const { hasFeatureAccess, isPremiumUser, getPlanName } = usePremiumFeatures();
  const [showModal, setShowModal] = React.useState(false);

  const hasAccess = hasFeatureAccess(featureId);

  const handleUpgrade = () => {
    setShowModal(false);
    navigation.navigate('Subscription' as never);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallbackComponent) {
    return <>{fallbackComponent}</>;
  }

  if (!showUpgradePrompt) {
    return null;
  }

  const getFeatureName = (featureId: string) => {
    switch (featureId) {
      case 'unlimited_appointments':
        return 'Απεριόριστα Ραντεβού';
      case 'advanced_search':
        return 'Προηγμένη Αναζήτηση';
      case 'analytics':
        return 'Αναλυτικά Στοιχεία';
      case 'customer_management':
        return 'Διαχείριση Πελατών';
      case 'priority_support':
        return 'Προτεραιότητα Υποστήριξης';
      case 'exclusive_offers':
        return 'Αποκλειστικές Προσφορές';
      default:
        return 'Premium Λειτουργία';
    }
  };

  const getFeatureDescription = (featureId: string) => {
    switch (featureId) {
      case 'unlimited_appointments':
        return 'Κλείστε όσα ραντεβού θέλετε χωρίς περιορισμούς';
      case 'advanced_search':
        return 'Χρησιμοποιήστε προηγμένα φίλτρα για να βρείτε τον ιδανικό επαγγελματία';
      case 'analytics':
        return 'Δείτε αναλυτικά στοιχεία και στατιστικά για τη χρήση σας';
      case 'customer_management':
        return 'Οργανώστε τους πελάτες σας και τα ραντεβού τους';
      case 'priority_support':
        return 'Λάβετε γρήγορη και αποκλειστική υποστήριξη';
      case 'exclusive_offers':
        return 'Αποκτήστε πρόσβαση σε αποκλειστικές προσφορές και εκπτώσεις';
      default:
        return 'Αυτή η λειτουργία είναι διαθέσιμη μόνο για Premium χρήστες';
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.gateContainer}
        onPress={() => setShowModal(true)}
      >
        <View style={styles.gateContent}>
          <Text style={styles.gateIcon}>🔒</Text>
          <View style={styles.gateText}>
            <Text style={styles.gateTitle}>{getFeatureName(featureId)}</Text>
            <Text style={styles.gateDescription}>
              {getFeatureDescription(featureId)}
            </Text>
          </View>
          <Text style={styles.gateArrow}>→</Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
          
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Premium Λειτουργία</Text>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.featureHeader}>
              <Text style={styles.featureIcon}>⭐</Text>
              <Text style={styles.featureTitle}>{getFeatureName(featureId)}</Text>
            </View>
            
            <Text style={styles.featureDescription}>
              {getFeatureDescription(featureId)}
            </Text>

            <View style={styles.currentPlanContainer}>
              <Text style={styles.currentPlanLabel}>Τρέχον Σχέδιο:</Text>
              <Text style={styles.currentPlanName}>{getPlanName()}</Text>
            </View>

            <View style={styles.benefitsContainer}>
              <Text style={styles.benefitsTitle}>Με Premium συνδρομή θα έχετε:</Text>
              <View style={styles.benefitItem}>
                <Text style={styles.benefitIcon}>✓</Text>
                <Text style={styles.benefitText}>Απεριόριστα ραντεβού</Text>
              </View>
              <View style={styles.benefitItem}>
                <Text style={styles.benefitIcon}>✓</Text>
                <Text style={styles.benefitText}>Προηγμένη αναζήτηση</Text>
              </View>
              <View style={styles.benefitItem}>
                <Text style={styles.benefitIcon}>✓</Text>
                <Text style={styles.benefitText}>Αναλυτικά στοιχεία</Text>
              </View>
              <View style={styles.benefitItem}>
                <Text style={styles.benefitIcon}>✓</Text>
                <Text style={styles.benefitText}>Προτεραιότητα υποστήριξης</Text>
              </View>
              <View style={styles.benefitItem}>
                <Text style={styles.benefitIcon}>✓</Text>
                <Text style={styles.benefitText}>Αποκλειστικές προσφορές</Text>
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.upgradeButton}
                onPress={handleUpgrade}
              >
                <Text style={styles.upgradeButtonText}>
                  Αναβάθμιση σε Premium
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleClose}
              >
                <Text style={styles.cancelButtonText}>Αργότερα</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  gateContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
  },
  gateContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gateIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  gateText: {
    flex: 1,
  },
  gateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  gateDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  gateArrow: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  closeButton: {
    marginRight: 16,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#6b7280',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
    textAlign: 'center',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  featureHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  featureIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  currentPlanContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  currentPlanLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  currentPlanName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  benefitsContainer: {
    marginBottom: 32,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitIcon: {
    fontSize: 16,
    color: '#10b981',
    marginRight: 12,
    fontWeight: 'bold',
  },
  benefitText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  modalActions: {
    gap: 12,
  },
  upgradeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
});
