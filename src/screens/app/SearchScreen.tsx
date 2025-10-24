import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  TextInput, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
  StatusBar 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SearchScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [professionals, setProfessionals] = useState([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState([]);

  const categories = [
    'Electrician',
    'Plumber', 
    'Lawyer',
    'Cleaner',
    'Mechanic',
    'Doctor'
  ];

  const cities = [
    'Athens',
    'Thessaloniki',
    'Patras',
    'Heraklion',
    'Larissa',
    'Volos'
  ];

  const ratings = [
    '5.0',
    '4.5+',
    '4.0+',
    '3.5+'
  ];

  const mockProfessionals = [
    {
      id: '1',
      name: 'Jane Smith',
      profession: 'Electrician',
      city: 'Athens',
      rating: 5.0,
      reviews: 36,
      description: 'Certified electrician specializing in home electrical systems and smart home installations.',
      verified: true,
      icon: '⚡'
    },
    {
      id: '2', 
      name: 'Maria Kokkinou',
      profession: 'Lawyer',
      city: 'Athens',
      rating: 4.9,
      reviews: 42,
      description: 'Experienced lawyer specializing in family and property law.',
      verified: true,
      icon: '⚖️'
    },
    {
      id: '3',
      name: 'George Papadopoulos',
      profession: 'Plumber',
      city: 'Athens',
      rating: 4.8,
      reviews: 28,
      description: 'Professional plumber with 10+ years experience in residential and commercial plumbing.',
      verified: true,
      icon: '💧'
    }
  ];

  useEffect(() => {
    setProfessionals(mockProfessionals);
    setFilteredProfessionals(mockProfessionals);
  }, []);

  useEffect(() => {
    filterProfessionals();
  }, [searchQuery, selectedCategory, selectedCity, selectedRating]);

  const filterProfessionals = () => {
    let filtered = professionals;

    if (searchQuery) {
      filtered = filtered.filter(prof => 
        prof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prof.profession.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(prof => prof.profession === selectedCategory);
    }

    if (selectedCity) {
      filtered = filtered.filter(prof => prof.city === selectedCity);
    }

    if (selectedRating) {
      const minRating = parseFloat(selectedRating);
      filtered = filtered.filter(prof => prof.rating >= minRating);
    }

    setFilteredProfessionals(filtered);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }
    if (hasHalfStar) {
      stars.push('☆');
    }
    return stars.join('');
  };

  const renderProfessional = ({ item }) => (
    <TouchableOpacity 
      style={styles.professionalCard}
      onPress={() => navigation.navigate('ProfessionalDetails', { professional: item })}
      activeOpacity={0.8}
    >
      <View style={styles.professionalHeader}>
        <Text style={styles.professionalName}>{item.name}</Text>
        {item.verified && (
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>✓ Verified</Text>
          </View>
        )}
      </View>
      
      <View style={styles.professionRow}>
        <Text style={styles.professionIcon}>{item.icon}</Text>
        <Text style={styles.profession}>{item.profession}</Text>
      </View>
      
      <Text style={styles.description}>{item.description}</Text>
      
      <View style={styles.ratingRow}>
        <Text style={styles.starIcon}>★</Text>
        <Text style={styles.rating}>{item.rating}</Text>
        <Text style={styles.reviews}>({item.reviews} Reviews)</Text>
      </View>
      
      <View style={styles.locationRow}>
        <Text style={styles.locationIcon}>📍</Text>
        <Text style={styles.location}>{item.city}</Text>
      </View>
      
      <TouchableOpacity style={styles.viewDetailsButton}>
        <Text style={styles.viewDetailsText}>View Details</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Αναζήτηση Επαγγελματιών</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Prof.</Text>
        </TouchableOpacity>
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
        </View>

        {/* Filter Buttons */}
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterIcon}>⊞</Text>
              <Text style={styles.filterText}>Κατηγορία</Text>
              <Text style={styles.filterArrow}>▼</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterIcon}>📍</Text>
              <Text style={styles.filterText}>Πόλη</Text>
              <Text style={styles.filterArrow}>▼</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterIcon}>★</Text>
              <Text style={styles.filterText}>Βαθμολογία</Text>
              <Text style={styles.filterArrow}>▼</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Results */}
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Professionals</Text>
          <FlatList
            data={filteredProfessionals}
            renderItem={renderProfessional}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Δεν βρέθηκαν επαγγελματίες</Text>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
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
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f9fafb',
    color: '#1f2937',
  },
  filtersContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  filterScroll: {
    paddingHorizontal: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterIcon: {
    fontSize: 16,
    color: '#6b7280',
    marginRight: 6,
  },
  filterText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    marginRight: 6,
  },
  filterArrow: {
    fontSize: 12,
    color: '#6b7280',
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  professionalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f3f4',
  },
  professionalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  professionalName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  verifiedBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  professionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  professionIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  profession: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  starIcon: {
    fontSize: 16,
    color: '#fbbf24',
    marginRight: 4,
  },
  rating: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '600',
    marginRight: 4,
  },
  reviews: {
    fontSize: 14,
    color: '#6b7280',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationIcon: {
    fontSize: 14,
    color: '#6b7280',
    marginRight: 6,
  },
  location: {
    fontSize: 14,
    color: '#6b7280',
  },
  viewDetailsButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  viewDetailsText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
  },
});