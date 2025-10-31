import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function RateProfessionalScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { professional, appointment } = route.params || {};
  
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stars = [1, 2, 3, 4, 5];

  const handleStarPress = (starRating) => {
    setRating(starRating);
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      Alert.alert('Σφάλμα', 'Παρακαλώ επιλέξτε αξιολόγηση');
      return;
    }

    if (review.trim().length < 10) {
      Alert.alert('Σφάλμα', 'Η κριτική πρέπει να έχει τουλάχιστον 10 χαρακτήρες');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Επιτυχία',
        'Η αξιολόγησή σας υποβλήθηκε επιτυχώς!',
        [
          {
            text: 'Εντάξει',
            onPress: () => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else {
                navigation.navigate('FindProfessionals');
              }
            }
          }
        ]
      );
    }, 1500);
  };

  const renderStar = (starNumber) => (
    <TouchableOpacity
      key={starNumber}
      style={styles.star}
      onPress={() => handleStarPress(starNumber)}
    >
      <Text style={[
        styles.starText,
        starNumber <= rating && styles.starFilled
      ]}>
        ⭐
      </Text>
    </TouchableOpacity>
  );

  const getRatingText = () => {
    switch (rating) {
      case 1: return 'Πολύ Κακό';
      case 2: return 'Κακό';
      case 3: return 'Μέτριο';
      case 4: return 'Καλό';
      case 5: return 'Εξαιρετικό';
      default: return 'Επιλέξτε αξιολόγηση';
    }
  };

  const getRatingColor = () => {
    switch (rating) {
      case 1: return '#ef4444';
      case 2: return '#f97316';
      case 3: return '#eab308';
      case 4: return '#22c55e';
      case 5: return '#059669';
      default: return '#6b7280';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Αξιολόγηση Επαγγελματία</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Professional Info */}
        <View style={styles.professionalCard}>
          <View style={styles.professionalInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {professional?.name?.charAt(0) || 'Ε'}
              </Text>
            </View>
            <View style={styles.professionalDetails}>
              <Text style={styles.professionalName}>
                {professional?.name || 'Επαγγελματίας'}
              </Text>
              <Text style={styles.professionalProfession}>
                {professional?.profession || 'Επάγγελμα'}
              </Text>
              <Text style={styles.appointmentDate}>
                Ραντεβού: {appointment?.date || 'Ημερομηνία'}
              </Text>
            </View>
          </View>
        </View>

        {/* Rating Section */}
        <View style={styles.ratingSection}>
          <Text style={styles.sectionTitle}>Πώς θα αξιολογούσατε την υπηρεσία;</Text>
          
          <View style={styles.starsContainer}>
            {stars.map(renderStar)}
          </View>
          
          <Text style={[
            styles.ratingText,
            { color: getRatingColor() }
          ]}>
            {getRatingText()}
          </Text>
        </View>

        {/* Review Section */}
        <View style={styles.reviewSection}>
          <Text style={styles.sectionTitle}>Γράψτε μια κριτική (προαιρετικό)</Text>
          <Text style={styles.sectionSubtitle}>
            Μοιραστείτε την εμπειρία σας με άλλους χρήστες
          </Text>
          
          <TextInput
            style={styles.reviewInput}
            value={review}
            onChangeText={setReview}
            placeholder="Περιγράψτε την εμπειρία σας με τον επαγγελματία..."
            multiline
            numberOfLines={6}
            maxLength={500}
          />
          
          <Text style={styles.characterCount}>
            {review.length}/500 χαρακτήρες
          </Text>
        </View>

        {/* Rating Guidelines */}
        <View style={styles.guidelinesSection}>
          <Text style={styles.guidelinesTitle}>Οδηγίες Αξιολόγησης</Text>
          
          <View style={styles.guidelineItem}>
            <Text style={styles.guidelineIcon}>⭐</Text>
            <Text style={styles.guidelineText}>
              <Text style={styles.guidelineBold}>5 αστέρια:</Text> Εξαιρετική υπηρεσία, υπερέβαλε τις προσδοκίες
            </Text>
          </View>
          
          <View style={styles.guidelineItem}>
            <Text style={styles.guidelineIcon}>⭐</Text>
            <Text style={styles.guidelineText}>
              <Text style={styles.guidelineBold}>4 αστέρια:</Text> Καλή υπηρεσία, ικανοποιητική
            </Text>
          </View>
          
          <View style={styles.guidelineItem}>
            <Text style={styles.guidelineIcon}>⭐</Text>
            <Text style={styles.guidelineText}>
              <Text style={styles.guidelineBold}>3 αστέρια:</Text> Μέτρια υπηρεσία, οκ
            </Text>
          </View>
          
          <View style={styles.guidelineItem}>
            <Text style={styles.guidelineIcon}>⭐</Text>
            <Text style={styles.guidelineText}>
              <Text style={styles.guidelineBold}>2 αστέρια:</Text> Κακή υπηρεσία, απογοητευτική
            </Text>
          </View>
          
          <View style={styles.guidelineItem}>
            <Text style={styles.guidelineIcon}>⭐</Text>
            <Text style={styles.guidelineText}>
              <Text style={styles.guidelineBold}>1 αστέρι:</Text> Πολύ κακή υπηρεσία, αποφυγή
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.submitContainer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            (rating === 0 || isSubmitting) && styles.submitButtonDisabled
          ]}
          onPress={handleSubmitReview}
          disabled={rating === 0 || isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Υποβολή...' : 'Υποβολή Αξιολόγησης'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backButtonText: {
    fontSize: 20,
    color: '#007AFF',
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  professionalCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  professionalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '600',
  },
  professionalDetails: {
    flex: 1,
  },
  professionalName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  professionalProfession: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  appointmentDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  ratingSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  star: {
    padding: 8,
  },
  starText: {
    fontSize: 32,
    color: '#d1d5db',
  },
  starFilled: {
    color: '#fbbf24',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  reviewSection: {
    marginBottom: 24,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  characterCount: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'right',
  },
  guidelinesSection: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  guidelinesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  guidelineIcon: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  guidelineText: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
    lineHeight: 20,
  },
  guidelineBold: {
    fontWeight: '600',
    color: '#374151',
  },
  submitContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f3f4',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
