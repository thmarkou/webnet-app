import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function FindProfessionalsScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [sortBy, setSortBy] = useState('rating'); // rating, distance, price
  const [professionals, setProfessionals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    { id: '', name: 'Όλες οι Κατηγορίες', icon: '🔧' },
    { id: 'electrician', name: 'Ηλεκτρολόγος', icon: '⚡' },
    { id: 'plumber', name: 'Υδραυλικός', icon: '🚰' },
    { id: 'painter', name: 'Μαραγκός', icon: '🎨' },
    { id: 'carpenter', name: 'Ξυλουργός', icon: '🔨' },
    { id: 'cleaner', name: 'Καθαριστής', icon: '🧹' },
    { id: 'gardener', name: 'Κηπουρός', icon: '🌱' },
    { id: 'mechanic', name: 'Μηχανικός', icon: '🔧' },
  ];

  const cities = [
    { id: '', name: 'Όλες οι Πόλεις' },
    { id: 'athens', name: 'Αθήνα' },
    { id: 'thessaloniki', name: 'Θεσσαλονίκη' },
    { id: 'patras', name: 'Πάτρα' },
    { id: 'heraklion', name: 'Ηράκλειο' },
    { id: 'larissa', name: 'Λάρισα' },
    { id: 'volos', name: 'Βόλος' },
  ];

  const mockProfessionals = [
    {
      id: '1',
      name: 'Γιάννης Παπαδόπουλος',
      profession: 'Ηλεκτρολόγος',
      category: 'electrician',
      city: 'athens',
      rating: 4.8,
      reviewCount: 127,
      price: '€50-80',
      distance: '2.3 km',
      availability: 'Διαθέσιμος',
      services: ['Επισκευή Ηλεκτρικών', 'Εγκατάσταση Φωτισμού', 'Συντήρηση'],
      description: 'Εξειδικευμένος ηλεκτρολόγος με 15+ χρόνια εμπειρίας. Ειδικεύομαι σε οικιακές και εμπορικές ηλεκτρολογικές εγκαταστάσεις.',
      image: '👨‍🔧',
      verified: true,
      responseTime: '1 ώρα',
      completionRate: '98%'
    },
    {
      id: '2',
      name: 'Μαρία Κωστόπουλου',
      profession: 'Υδραυλικός',
      category: 'plumber',
      city: 'athens',
      rating: 4.9,
      reviewCount: 89,
      price: '€40-70',
      distance: '1.8 km',
      availability: 'Διαθέσιμος',
      services: ['Επισκευή Σωλήνων', 'Εγκατάσταση Μπάνιου', 'Συντήρηση'],
      description: 'Επαγγελματίας υδραυλικός με εξειδίκευση σε επισκευές και εγκαταστάσεις. Γρήγορη εξυπηρέτηση και ανταγωνιστικές τιμές.',
      image: '👩‍🔧',
      verified: true,
      responseTime: '30 λεπτά',
      completionRate: '100%'
    },
    {
      id: '3',
      name: 'Πέτρος Νικολάου',
      profession: 'Μαραγκός',
      category: 'painter',
      city: 'athens',
      rating: 4.7,
      reviewCount: 156,
      price: '€35-60',
      distance: '3.1 km',
      availability: 'Διαθέσιμος',
      services: ['Βάψιμο Δωματίων', 'Εξωτερικά Χρώματα', 'Αντισηπτικά'],
      description: 'Επαγγελματίας μάστορας με εμπειρία σε εσωτερικά και εξωτερικά χρώματα. Χρήση υψηλής ποιότητας υλικών.',
      image: '👨‍🎨',
      verified: true,
      responseTime: '2 ώρες',
      completionRate: '95%'
    },
    {
      id: '4',
      name: 'Ελένη Δημητρίου',
      profession: 'Καθαριστής',
      category: 'cleaner',
      city: 'athens',
      rating: 4.6,
      reviewCount: 203,
      price: '€25-45',
      distance: '1.2 km',
      availability: 'Διαθέσιμος',
      services: ['Καθαρισμός Σπιτιού', 'Γραφείου', 'Μετά από Μετακόμιση'],
      description: 'Επαγγελματικός καθαρισμός σπιτιών και γραφείων. Αξιόπιστη και προσεκτική στην εργασία της.',
      image: '👩‍💼',
      verified: true,
      responseTime: '45 λεπτά',
      completionRate: '99%'
    },
    {
      id: '5',
      name: 'Νίκος Αντωνίου',
      profession: 'Κηπουρός',
      category: 'gardener',
      city: 'athens',
      rating: 4.5,
      reviewCount: 78,
      price: '€30-50',
      distance: '4.2 km',
      availability: 'Διαθέσιμος',
      services: ['Κηπουρική', 'Καθαρισμός Κήπου', 'Φυτεύσεις'],
      description: 'Ειδικευμένος κηπουρός με γνώσεις σε τοπικά φυτά και κηπουρικές τεχνικές. Συντήρηση κήπων και φυτεύσεις.',
      image: '👨‍🌾',
      verified: false,
      responseTime: '1.5 ώρες',
      completionRate: '92%'
    }
  ];

  useEffect(() => {
    filterProfessionals();
  }, [searchQuery, selectedCategory, selectedCity, sortBy]);

  const filterProfessionals = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      let filtered = [...mockProfessionals];
      
      // Filter by search query
      if (searchQuery) {
        filtered = filtered.filter(prof => 
          prof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prof.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prof.services.some(service => service.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }
      
      // Filter by category
      if (selectedCategory) {
        filtered = filtered.filter(prof => prof.category === selectedCategory);
      }
      
      // Filter by city
      if (selectedCity) {
        filtered = filtered.filter(prof => prof.city === selectedCity);
      }
      
      // Sort results
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'rating':
            return b.rating - a.rating;
          case 'distance':
            return parseFloat(a.distance) - parseFloat(b.distance);
          case 'price':
            return parseFloat(a.price.replace(/[€-]/g, '')) - parseFloat(b.price.replace(/[€-]/g, ''));
          default:
            return 0;
        }
      });
      
      setProfessionals(filtered);
      setIsLoading(false);
    }, 500);
  };

  const renderProfessional = ({ item }) => (
    <TouchableOpacity
      style={styles.professionalCard}
      onPress={() => navigation.navigate('ProfessionalDetails', { professional: item })}
    >
      <View style={styles.professionalHeader}>
        <View style={styles.professionalInfo}>
          <Text style={styles.professionalImage}>{item.image}</Text>
          <View style={styles.professionalDetails}>
            <View style={styles.nameRow}>
              <Text style={styles.professionalName}>{item.name}</Text>
              {item.verified && <Text style={styles.verifiedBadge}>✓</Text>}
            </View>
            <Text style={styles.professionalProfession}>{item.profession}</Text>
            <View style={styles.ratingRow}>
              <Text style={styles.rating}>⭐ {item.rating}</Text>
              <Text style={styles.reviewCount}>({item.reviewCount} αξιολογήσεις)</Text>
            </View>
          </View>
        </View>
        <View style={styles.professionalMeta}>
          <Text style={styles.distance}>📍 {item.distance}</Text>
          <Text style={styles.price}>{item.price}</Text>
        </View>
      </View>
      
      <Text style={styles.description}>{item.description}</Text>
      
      <View style={styles.servicesContainer}>
        {item.services.slice(0, 3).map((service, index) => (
          <View key={index} style={styles.serviceTag}>
            <Text style={styles.serviceText}>{service}</Text>
          </View>
        ))}
        {item.services.length > 3 && (
          <View style={styles.serviceTag}>
            <Text style={styles.serviceText}>+{item.services.length - 3} άλλα</Text>
          </View>
        )}
      </View>
      
      <View style={styles.professionalFooter}>
        <View style={styles.availabilityContainer}>
          <Text style={styles.availabilityText}>🟢 {item.availability}</Text>
          <Text style={styles.responseTime}>⏱️ {item.responseTime}</Text>
        </View>
        <TouchableOpacity style={styles.contactButton}>
          <Text style={styles.contactButtonText}>Επικοινωνία</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderCategory = (category) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryButton,
        selectedCategory === category.id && styles.selectedCategory
      ]}
      onPress={() => setSelectedCategory(category.id)}
    >
      <Text style={styles.categoryIcon}>{category.icon}</Text>
      <Text style={[
        styles.categoryText,
        selectedCategory === category.id && styles.selectedCategoryText
      ]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Βρείτε Επαγγελματίες</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Αναζήτηση επαγγελματιών..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9ca3af"
          />
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchButtonText}>🔍</Text>
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Κατηγορίες</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoriesContainer}>
              {categories.map(renderCategory)}
            </View>
          </ScrollView>
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Πόλη:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterOptions}>
                {cities.map(city => (
                  <TouchableOpacity
                    key={city.id}
                    style={[
                      styles.filterButton,
                      selectedCity === city.id && styles.selectedFilter
                    ]}
                    onPress={() => setSelectedCity(city.id)}
                  >
                    <Text style={[
                      styles.filterButtonText,
                      selectedCity === city.id && styles.selectedFilterText
                    ]}>
                      {city.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
          
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Ταξινόμηση:</Text>
            <View style={styles.sortOptions}>
              <TouchableOpacity
                style={[styles.sortButton, sortBy === 'rating' && styles.selectedSort]}
                onPress={() => setSortBy('rating')}
              >
                <Text style={[styles.sortButtonText, sortBy === 'rating' && styles.selectedSortText]}>
                  ⭐ Αξιολόγηση
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sortButton, sortBy === 'distance' && styles.selectedSort]}
                onPress={() => setSortBy('distance')}
              >
                <Text style={[styles.sortButtonText, sortBy === 'distance' && styles.selectedSortText]}>
                  📍 Απόσταση
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sortButton, sortBy === 'price' && styles.selectedSort]}
                onPress={() => setSortBy('price')}
              >
                <Text style={[styles.sortButtonText, sortBy === 'price' && styles.selectedSortText]}>
                  💰 Τιμή
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Results */}
        <View style={styles.resultsContainer}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>
              {professionals.length} Επαγγελματίες
            </Text>
            {isLoading && <Text style={styles.loadingText}>Φόρτωση...</Text>}
          </View>
          
          <FlatList
            data={professionals}
            renderItem={renderProfessional}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>🔍</Text>
                <Text style={styles.emptyTitle}>Δεν βρέθηκαν επαγγελματίες</Text>
                <Text style={styles.emptyMessage}>
                  Δοκιμάστε να αλλάξετε τα κριτήρια αναζήτησης
                </Text>
              </View>
            }
          />
        </View>
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
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#ffffff',
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    fontSize: 18,
    color: '#ffffff',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  categoriesContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectedCategory: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#ffffff',
  },
  filtersContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  filterRow: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  selectedFilter: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#6b7280',
  },
  selectedFilterText: {
    color: '#ffffff',
  },
  sortOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  selectedSort: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  sortButtonText: {
    fontSize: 12,
    color: '#6b7280',
  },
  selectedSortText: {
    color: '#ffffff',
  },
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  loadingText: {
    fontSize: 14,
    color: '#6b7280',
  },
  professionalCard: {
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
  professionalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  professionalInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  professionalImage: {
    fontSize: 32,
    marginRight: 12,
  },
  professionalDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  professionalName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginRight: 8,
  },
  verifiedBadge: {
    fontSize: 12,
    color: '#059669',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  professionalProfession: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: '#f59e0b',
    fontWeight: '600',
    marginRight: 8,
  },
  reviewCount: {
    fontSize: 12,
    color: '#9ca3af',
  },
  professionalMeta: {
    alignItems: 'flex-end',
  },
  distance: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  serviceTag: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  serviceText: {
    fontSize: 12,
    color: '#6b7280',
  },
  professionalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  availabilityContainer: {
    flex: 1,
  },
  availabilityText: {
    fontSize: 12,
    color: '#059669',
    marginBottom: 2,
  },
  responseTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  contactButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  contactButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});
