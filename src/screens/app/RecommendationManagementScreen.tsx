import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/auth/authStore';
import { recommendationService } from '../../services/recommendations/recommendationService';
import { ProfessionalRecommendation, RecommendationStats } from '../../types/recommendations';
import { Ionicons } from '@expo/vector-icons';

export default function RecommendationManagementScreen() {
  const navigation = useNavigation();
  const { user } = useAuthStore();

  const [recommendations, setRecommendations] = useState<ProfessionalRecommendation[]>([]);
  const [stats, setStats] = useState<RecommendationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecommendationData();
  }, []);

  const loadRecommendationData = async () => {
    setIsLoading(true);
    try {
      const allRecommendations = recommendationService.getAllRecommendations();
      const recommendationStats = recommendationService.getRecommendationStats();
      
      setRecommendations(allRecommendations);
      setStats(recommendationStats);
    } catch (error) {
      console.error('Error loading recommendation data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('el-GR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleRemoveRecommendation = (recommendationId: string) => {
    Alert.alert(
      'Αφαίρεση Σύστασης',
      'Είστε σίγουροι ότι θέλετε να αφαιρέσετε αυτή τη σύσταση;',
      [
        { text: 'Ακύρωση', style: 'cancel' },
        {
          text: 'Αφαίρεση',
          style: 'destructive',
          onPress: () => {
            const success = recommendationService.removeRecommendation(recommendationId);
            if (success) {
              loadRecommendationData();
              Alert.alert('Επιτυχία', 'Η σύσταση αφαιρέθηκε επιτυχώς.');
            } else {
              Alert.alert('Σφάλμα', 'Δεν ήταν δυνατή η αφαίρεση της σύστασης.');
            }
          },
        },
      ]
    );
  };

  const renderRecommendation = (recommendation: ProfessionalRecommendation) => (
    <View key={recommendation.id} style={styles.recommendationCard}>
      <View style={styles.recommendationHeader}>
        <View style={styles.recommendationInfo}>
          <Text style={styles.professionalName}>{recommendation.professionalName}</Text>
          <Text style={styles.profession}>{recommendation.profession}</Text>
          <Text style={styles.location}>📍 {recommendation.city}</Text>
        </View>
        <View style={styles.recommendationMeta}>
          <Text style={styles.rating}>⭐ {recommendation.rating}</Text>
          <Text style={styles.date}>{formatDate(recommendation.createdAt)}</Text>
        </View>
      </View>
      
      <View style={styles.recommendationDetails}>
        <Text style={styles.recommenderText}>
          👤 Συνιστάται από: <Text style={styles.recommenderName}>{recommendation.recommenderName}</Text>
        </Text>
        {recommendation.reason && (
          <Text style={styles.reasonText}>
            💬 "{recommendation.reason}"
          </Text>
        )}
      </View>
      
      <View style={styles.recommendationActions}>
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => handleRemoveRecommendation(recommendation.id)}
        >
          <Ionicons name="trash" size={16} color="#EF4444" />
          <Text style={styles.removeButtonText}>Αφαίρεση</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStatsCard = (title: string, value: number | string, color: string, icon: string) => (
    <View style={[styles.statsCard, { borderLeftColor: color }]}>
      <View style={styles.statsContent}>
        <Ionicons name={icon as any} size={24} color={color} />
        <View style={styles.statsText}>
          <Text style={styles.statsValue}>{value}</Text>
          <Text style={styles.statsTitle}>{title}</Text>
        </View>
      </View>
    </View>
  );

  if (user?.role !== 'admin') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Διαχείριση Συστάσεων</Text>
        </View>
        <View style={styles.accessDeniedContainer}>
          <Ionicons name="lock-closed" size={48} color="#FF4D4F" />
          <Text style={styles.accessDeniedTitle}>Πρόσβαση Απαγορευμένη</Text>
          <Text style={styles.accessDeniedText}>
            Μόνο οι διαχειριστές μπορούν να έχουν πρόσβαση σε αυτή τη σελίδα.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Διαχείριση Συστάσεων</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Φόρτωση δεδομένων συστάσεων...</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
          {/* Statistics */}
          {stats && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Στατιστικά Συστάσεων</Text>
              <View style={styles.statsGrid}>
                {renderStatsCard('Συνολικές Συστάσεις', stats.totalRecommendations, '#007AFF', 'people')}
                {renderStatsCard('Κατηγορίες', Object.keys(stats.recommendationsByCategory).length, '#10B981', 'list')}
                {renderStatsCard('Συνιστώντες', stats.topRecommenders.length, '#F59E0B', 'star')}
              </View>
            </View>
          )}

          {/* Top Recommenders */}
          {stats && stats.topRecommenders.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Κορυφαίοι Συνιστώντες</Text>
              <View style={styles.topRecommendersContainer}>
                {stats.topRecommenders.map((recommender, index) => (
                  <View key={recommender.userId} style={styles.topRecommenderCard}>
                    <Text style={styles.rankText}>#{index + 1}</Text>
                    <View style={styles.recommenderInfo}>
                      <Text style={styles.recommenderName}>{recommender.name}</Text>
                      <Text style={styles.recommenderCount}>{recommender.count} συστάσεις</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Recommendations List */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Όλες οι Συστάσεις</Text>
              <TouchableOpacity onPress={loadRecommendationData} style={styles.refreshButton}>
                <Ionicons name="refresh" size={20} color="#007AFF" />
              </TouchableOpacity>
            </View>
            
            {recommendations.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="people-outline" size={48} color="#CCC" />
                <Text style={styles.emptyTitle}>Δεν υπάρχουν συστάσεις</Text>
                <Text style={styles.emptySubtitle}>
                  Όταν οι φίλοι αρχίσουν να συνιστούν επαγγελματίες, θα εμφανιστούν εδώ.
                </Text>
              </View>
            ) : (
              <View style={styles.recommendationsList}>
                {recommendations.map(renderRecommendation)}
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  accessDeniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  accessDeniedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF4D4F',
    marginTop: 16,
    marginBottom: 8,
  },
  accessDeniedText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    padding: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: '48%',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    marginLeft: 12,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statsTitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  topRecommendersContainer: {
    gap: 12,
  },
  topRecommenderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rankText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginRight: 16,
    minWidth: 30,
  },
  recommenderInfo: {
    flex: 1,
  },
  recommenderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  recommenderCount: {
    fontSize: 14,
    color: '#666',
  },
  recommendationsList: {
    gap: 12,
  },
  recommendationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recommendationInfo: {
    flex: 1,
  },
  professionalName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  profession: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  location: {
    fontSize: 12,
    color: '#999',
  },
  recommendationMeta: {
    alignItems: 'flex-end',
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F59E0B',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  recommendationDetails: {
    marginBottom: 12,
  },
  recommenderText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  recommenderName: {
    fontWeight: '600',
    color: '#007AFF',
  },
  reasonText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    lineHeight: 16,
  },
  recommendationActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  removeButtonText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
});
