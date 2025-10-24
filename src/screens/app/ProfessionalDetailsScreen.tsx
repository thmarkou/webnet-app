import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function ProfessionalDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { professional } = route.params || {};
  const [reviews, setReviews] = useState([]);

  const mockReviews = [
    {
      id: '1',
      user: 'Μαρία Κ.',
      rating: 5,
      comment: 'Εξαιρετική εργασία! Πολύ επαγγελματικός και γρήγορος.',
      date: '15 Οκτωβρίου 2024'
    },
    {
      id: '2',
      user: 'Γιάννης Π.',
      rating: 4,
      comment: 'Καλή εργασία, λίγο αργός αλλά ικανοποιημένος.',
      date: '10 Οκτωβρίου 2024'
    }
  ];

  useEffect(() => {
    setReviews(mockReviews);
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text key={i} style={styles.star}>
          {i <= rating ? '⭐' : '☆'}
        </Text>
      );
    }
    return stars;
  };

  const renderReview = (review) => (
    <View key={review.id} style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Text style={styles.reviewUser}>{review.user}</Text>
        <View style={styles.reviewRating}>
          {renderStars(review.rating)}
        </View>
      </View>
      <Text style={styles.reviewComment}>{review.comment}</Text>
      <Text style={styles.reviewDate}>{review.date}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Πίσω</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Λεπτομέρειες Επαγγελματία</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.professionalCard}>
          <View style={styles.professionalHeader}>
            <View style={styles.professionalInfo}>
              <Text style={styles.professionalName}>
                {professional?.name || 'Γιάννης Παπαδόπουλος'}
              </Text>
              <Text style={styles.profession}>
                {professional?.profession || 'Ηλεκτρολόγος'}
              </Text>
              <View style={styles.ratingContainer}>
                <View style={styles.stars}>
                  {renderStars(professional?.rating || 4.8)}
                </View>
                <Text style={styles.ratingText}>
                  {professional?.rating || 4.8} ({professional?.reviews || 24} αξιολογήσεις)
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.contactInfo}>
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>📍 Τοποθεσία:</Text>
              <Text style={styles.contactValue}>
                {professional?.city || 'Αθήνα'}, Ελλάδα
              </Text>
            </View>
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>📞 Τηλέφωνο:</Text>
              <Text style={styles.contactValue}>+30 210 1234567</Text>
            </View>
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>🌐 Website:</Text>
              <Text style={styles.contactValue}>www.electrician.gr</Text>
            </View>
          </View>

          <View style={styles.aboutSection}>
            <Text style={styles.sectionTitle}>Σχετικά</Text>
            <Text style={styles.aboutText}>
              Ειδικευμένος ηλεκτρολόγος με 15+ χρόνια εμπειρίας. 
              Εξειδικεύομαι σε ηλεκτρικές εγκαταστάσεις, συντήρηση 
              και επισκευές. Πιστοποιημένος με όλα τα απαραίτητα 
              δικαιολογητικά.
            </Text>
          </View>

          <View style={styles.servicesSection}>
            <Text style={styles.sectionTitle}>Υπηρεσίες</Text>
            <View style={styles.serviceItem}>
              <Text style={styles.serviceText}>• Ηλεκτρικές εγκαταστάσεις</Text>
            </View>
            <View style={styles.serviceItem}>
              <Text style={styles.serviceText}>• Συντήρηση ηλεκτρικών συστημάτων</Text>
            </View>
            <View style={styles.serviceItem}>
              <Text style={styles.serviceText}>• Επισκευή ηλεκτρικών συσκευών</Text>
            </View>
            <View style={styles.serviceItem}>
              <Text style={styles.serviceText}>• Αντικατάσταση πρίζων και διακόπτων</Text>
            </View>
          </View>

          <View style={styles.reviewsSection}>
            <Text style={styles.sectionTitle}>Αξιολογήσεις</Text>
            {reviews.map(renderReview)}
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.bookButton}
              onPress={() => navigation.navigate('BookAppointment', { professional })}
            >
              <Text style={styles.bookButtonText}>Κλείσε Ραντεβού</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.reviewButton}
              onPress={() => navigation.navigate('AddReview', { professional })}
            >
              <Text style={styles.reviewButtonText}>Αξιολόγηση</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007bff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  professionalCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  professionalHeader: {
    marginBottom: 20,
  },
  professionalInfo: {
    alignItems: 'center',
  },
  professionalName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  profession: {
    fontSize: 18,
    color: '#007bff',
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  ratingContainer: {
    alignItems: 'center',
  },
  stars: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  star: {
    fontSize: 20,
    marginHorizontal: 2,
  },
  ratingText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  contactInfo: {
    marginBottom: 20,
  },
  contactRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  contactLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    width: 120,
  },
  contactValue: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  aboutSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  aboutText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  servicesSection: {
    marginBottom: 20,
  },
  serviceItem: {
    marginBottom: 8,
  },
  serviceText: {
    fontSize: 16,
    color: '#666',
  },
  reviewsSection: {
    marginBottom: 20,
  },
  reviewCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewUser: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewComment: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    lineHeight: 20,
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  bookButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  reviewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
