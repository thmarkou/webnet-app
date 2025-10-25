import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar,
  ScrollView 
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function ProfessionalDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { professional } = route.params || {};

  // Use the professional data passed from navigation, or fallback to mock data
  const professionalData = professional ? {
    name: professional.name,
    profession: professional.profession,
    rating: professional.rating,
    reviews: professional.reviewCount,
    location: professional.city === 'athens' ? 'Αθήνα, Ελλάδα' : 
              professional.city === 'thessaloniki' ? 'Θεσσαλονίκη, Ελλάδα' :
              professional.city === 'patras' ? 'Πάτρα, Ελλάδα' : 'Ελλάδα',
    phone: '+30 6923456789',
    email: `${professional.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    about: professional.description,
    verified: professional.verified
  } : {
    name: 'Γιάννη Σμιθ',
    profession: 'Ηλεκτρολόγος',
    rating: 5.0,
    reviews: 36,
    location: 'Αθήνα, Ελλάδα',
    phone: '+30 6923456789',
    email: 'gianni.smith@example.com',
    about: 'Πιστοποιημένη ηλεκτρολόγος με εξειδίκευση σε οικιακά ηλεκτρικά συστήματα και εγκαταστάσεις έξυπνων σπιτιών.',
    verified: true
  };

  const mockReviews = [
    {
      id: '1',
      reviewer: 'Γιώργος Δημητρίου',
      rating: 5,
      comment: 'Η Γιάννη έκανε εξαιρετική δουλειά στην εγκατάσταση του νέου συστήματος φωτισμού μας. Πολύ επαγγελματική και γνώστης.',
      date: '5.7.2023',
      type: 'positive'
    },
    {
      id: '2',
      reviewer: 'Μαρία Παπαδοπούλου',
      rating: 5,
      comment: 'Εξαιρετική εξυπηρέτηση και πολύ αξιόπιστη. Συνιστώ ανεπιφύλακτα!',
      date: '3.7.2023',
      type: 'positive'
    }
  ];

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Text key={i} style={styles.star}>
          {i < rating ? '★' : '☆'}
        </Text>
      );
    }
    return stars;
  };

  const handleAddReview = () => {
    navigation.navigate('AddReview', { professional: professionalData });
  };

  const handleBookAppointment = () => {
    navigation.navigate('BookAppointment', { professional: professionalData });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Βρείτε Επαγγελματίες</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Professional Profile */}
        <View style={styles.profileSection}>
          <View style={styles.profileImage}>
            <Text style={styles.profileImageText}>👩‍🔧</Text>
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.professionalName}>{professionalData.name}</Text>
            <Text style={styles.professionalProfession}>{professionalData.profession}</Text>
            
            <View style={styles.ratingContainer}>
              {renderStars(professionalData.rating)}
              <Text style={styles.ratingText}>{professionalData.rating}</Text>
              <Text style={styles.reviewsText}>({professionalData.reviews})</Text>
            </View>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.contactSection}>
          <View style={styles.contactItem}>
            <Text style={styles.contactIcon}>📍</Text>
            <Text style={styles.contactText}>{professionalData.location}</Text>
          </View>
          
          <View style={styles.contactItem}>
            <Text style={styles.contactIcon}>📞</Text>
            <Text style={styles.contactText}>{professionalData.phone}</Text>
          </View>
          
          <View style={styles.contactItem}>
            <Text style={styles.contactIcon}>✉️</Text>
            <Text style={styles.contactText}>{professionalData.email}</Text>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.aboutSection}>
          <Text style={styles.sectionTitle}>Σχετικά</Text>
          <Text style={styles.aboutText}>{professionalData.about}</Text>
        </View>

        {/* Reviews Section */}
        <View style={styles.reviewsSection}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Αξιολογήσεις</Text>
            <TouchableOpacity style={styles.addReviewButton} onPress={handleAddReview}>
              <Text style={styles.addReviewIcon}>+</Text>
              <Text style={styles.addReviewText}>Προσθήκη Αξιολόγησης</Text>
            </TouchableOpacity>
          </View>

          {mockReviews.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewerAvatar}>
                  <Text style={styles.reviewerAvatarText}>
                    {review.reviewer.charAt(0)}
                  </Text>
                </View>
                <View style={styles.reviewerInfo}>
                  <Text style={styles.reviewerName}>{review.reviewer}</Text>
                  <View style={styles.reviewRating}>
                    {renderStars(review.rating)}
                  </View>
                </View>
              </View>
              
              <Text style={styles.reviewComment}>{review.comment}</Text>
              
              <View style={styles.reviewFooter}>
                <TouchableOpacity style={styles.positiveButton}>
                  <Text style={styles.positiveIcon}>👍</Text>
                  <Text style={styles.positiveText}>Θετική</Text>
                </TouchableOpacity>
                <Text style={styles.reviewDate}>{review.date}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Book Appointment Button */}
        <TouchableOpacity style={styles.bookButton} onPress={handleBookAppointment}>
          <Text style={styles.bookButtonText}>Κλείστε Ραντεβού</Text>
        </TouchableOpacity>
      </ScrollView>
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
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImageText: {
    fontSize: 48,
  },
  profileInfo: {
    alignItems: 'center',
  },
  professionalName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  professionalProfession: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    fontSize: 20,
    color: '#fbbf24',
    marginRight: 2,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 8,
  },
  reviewsText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  contactSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f3f4',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactIcon: {
    fontSize: 16,
    marginRight: 12,
    width: 20,
  },
  contactText: {
    fontSize: 14,
    color: '#1f2937',
    flex: 1,
  },
  aboutSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  reviewsSection: {
    marginBottom: 24,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addReviewIcon: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 4,
  },
  addReviewText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  reviewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f3f4',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reviewerAvatarText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewComment: {
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 20,
    marginBottom: 12,
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  positiveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  positiveIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  positiveText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  reviewDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  bookButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});