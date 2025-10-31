import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function AddReviewScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { professional } = route.params || {};
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleRatingPress = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleSubmitReview = () => {
    if (rating === 0) {
      Alert.alert('Σφάλμα', 'Παρακαλώ επιλέξτε αξιολόγηση');
      return;
    }

    if (!comment.trim()) {
      Alert.alert('Σφάλμα', 'Παρακαλώ γράψτε σχόλιο');
      return;
    }

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
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          style={styles.starButton}
          onPress={() => handleRatingPress(i)}
        >
          <Text style={[
            styles.star,
            i <= rating && styles.selectedStar
          ]}>
            {i <= rating ? '⭐' : '☆'}
          </Text>
        </TouchableOpacity>
      );
    }
    return stars;
  };

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Αξιολόγηση</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.professionalInfo}>
          <Text style={styles.professionalName}>
            {professional?.name || 'Γιάννης Παπαδόπουλος'}
          </Text>
          <Text style={styles.profession}>
            {professional?.profession || 'Ηλεκτρολόγος'}
          </Text>
        </View>

        <View style={styles.ratingSection}>
          <Text style={styles.sectionTitle}>Πώς θα αξιολογούσατε την υπηρεσία;</Text>
          
          <View style={styles.starsContainer}>
            {renderStars()}
          </View>
          
          <Text style={styles.ratingText}>{getRatingText()}</Text>
        </View>

        <View style={styles.commentSection}>
          <Text style={styles.sectionTitle}>Σχόλιο (προαιρετικό)</Text>
          <TextInput
            style={styles.commentInput}
            placeholder="Περιγράψτε την εμπειρία σας..."
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.guidelinesSection}>
          <Text style={styles.guidelinesTitle}>Οδηγίες Αξιολόγησης</Text>
          <View style={styles.guidelineItem}>
            <Text style={styles.guidelineText}>• Να είστε ειλικρινείς και αντικειμενικοί</Text>
          </View>
          <View style={styles.guidelineItem}>
            <Text style={styles.guidelineText}>• Αποφύγετε προσωπικές επιθέσεις</Text>
          </View>
          <View style={styles.guidelineItem}>
            <Text style={styles.guidelineText}>• Περιγράψτε την εμπειρία σας με λεπτομέρεια</Text>
          </View>
          <View style={styles.guidelineItem}>
            <Text style={styles.guidelineText}>• Αυτή η αξιολόγηση θα είναι ορατή σε άλλους χρήστες</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmitReview}
        >
          <Text style={styles.submitButtonText}>Υποβολή Αξιολόγησης</Text>
        </TouchableOpacity>
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
    fontSize: 20,
    color: '#007AFF',
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  professionalInfo: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  professionalName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  profession: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '600',
  },
  ratingSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  starButton: {
    padding: 5,
  },
  star: {
    fontSize: 40,
    color: '#ddd',
  },
  selectedStar: {
    color: '#ffa500',
  },
  ratingText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  commentSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    height: 120,
    textAlignVertical: 'top',
  },
  guidelinesSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  guidelinesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  guidelineItem: {
    marginBottom: 8,
  },
  guidelineText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
