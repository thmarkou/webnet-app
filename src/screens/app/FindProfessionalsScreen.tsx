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
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuthStore } from '../../store/auth/authStore';
import { recommendationService } from '../../services/recommendations/recommendationService';
import { ProfessionalRecommendation } from '../../types/recommendations';
import { getProfessions, getCities, initializeTables } from '../../services/storage/tableManager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProfessionals } from '../../services/firebase/firestore';

export default function FindProfessionalsScreen() {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [minRating, setMinRating] = useState(0); // 0 = all, 1-5 stars
  const [sortBy, setSortBy] = useState('rating'); // rating, distance, price
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [friendRecommendations, setFriendRecommendations] = useState<ProfessionalRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  useEffect(() => {
    initializeTables();
    loadCategoriesAndCities();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      filterProfessionals();
    }, [searchQuery, selectedCategory, selectedCity, minRating, sortBy, user?.id])
  );

  const loadCategoriesAndCities = async () => {
    try {
      const [professionsData, citiesData] = await Promise.all([
        getProfessions(),
        getCities()
      ]);
      setCategories(professionsData);
      setCities(citiesData);
      
      // Debug: Check if Νέα Μουδανιά is in the list
      const hasNeaMoudania = citiesData.some(c => c.name === 'Νέα Μουδανιά');
      console.log('🔍 Cities loaded:', citiesData.length);
      console.log(hasNeaMoudania ? '✅ Νέα Μουδανιά IS in the list' : '❌ Νέα Μουδανιά NOT in the list');
      console.log('Sample cities:', citiesData.slice(0, 5).map(c => c.name));
    } catch (error) {
      console.error('Error loading categories and cities:', error);
    }
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedCity('');
    setMinRating(0);
    setSortBy('rating');
    setShowCategoryDropdown(false);
    setShowCityDropdown(false);
  };

  const handleContact = (professional: any) => {
    // For now, we'll show an alert with contact options
    // In a real app, this could open a phone dialer, email client, or chat
    Alert.alert(
      `Επικοινωνία με ${professional.name}`,
      `Επιλέξτε τρόπο επικοινωνίας:`,
      [
        {
          text: '📞 Τηλέφωνο',
          onPress: () => {
            // In a real app, this would open the phone dialer
            Alert.alert('Τηλέφωνο', `Θα καλέσετε τον ${professional.name} στο ${professional.phone || '+30 210 1234567'}`);
          }
        },
        {
          text: '✉️ Email',
          onPress: () => {
            // In a real app, this would open the email client
            Alert.alert('Email', `Θα στείλετε email στον ${professional.name} στο ${professional.email || 'professional@example.com'}`);
          }
        },
        {
          text: '💬 Chat',
          onPress: () => {
            // Navigate to chat screen
            navigation.navigate('Chat', { 
              senderId: professional.id, 
              professionalName: professional.name 
            });
          }
        },
        {
          text: 'Ακύρωση',
          style: 'cancel'
        }
      ]
    );
  };

  const filterProfessionals = async () => {
    setIsLoading(true);
    
      try {
        // Load professionals from Firestore - only for current user
        let filtered: any[] = [];
        
        // Only load professionals if user is logged in
        if (!user?.id) {
          console.log('⚠️ No user ID - cannot load professionals');
          setProfessionals([]);
          setIsLoading(false);
          return;
        }
        
        try {
          // Get professionals:
          // - Admin users see all professionals
          // - Regular users see only their own + professionals without createdBy (backward compatibility)
          const firestoreProfessionals = await getProfessionals(
            user.role === 'admin' ? undefined : { createdBy: user.id }
          );
          console.log(`✅ Loaded professionals from Firestore (${user.role === 'admin' ? 'all' : 'user own'}):`, firestoreProfessionals.length);
          filtered = firestoreProfessionals;
      } catch (error) {
        console.error('Error loading professionals from Firestore:', error);
        // Fallback to AsyncStorage if Firestore fails (for migration period)
        try {
          const customProfessionalsJson = await AsyncStorage.getItem('customProfessionals');
          if (customProfessionalsJson) {
            const customProfessionals = JSON.parse(customProfessionalsJson);
            console.log('⚠️ Fallback: Loaded from AsyncStorage:', customProfessionals.length);
            filtered = customProfessionals;
          }
        } catch (storageError) {
          console.error('Error loading from AsyncStorage fallback:', storageError);
        }
      }
      
      // Filter by search query
      if (searchQuery) {
        filtered = filtered.filter(prof => 
          prof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prof.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (prof.services || []).some(service => {
            const serviceName = typeof service === 'string' ? service : (service?.name || service?.id || String(service));
            return serviceName.toLowerCase().includes(searchQuery.toLowerCase());
          })
        );
      }
      
      // Filter by category
      if (selectedCategory) {
        filtered = filtered.filter(prof => prof.category === selectedCategory);
      }
      
      // Filter by city
      if (selectedCity) {
        // Normalize city comparison - handle both old format (city names) and new format (city IDs)
        const selectedCityName = cities.find(c => c.id === selectedCity)?.name.toLowerCase().replace(/\s+/g, '_') || selectedCity;
        filtered = filtered.filter(prof => {
          // Skip if city is missing
          if (!prof.city) return false;
          
          // Try matching by ID first
          if (prof.city === selectedCity) return true;
          
          // Then try matching by normalized name (handle both string and object formats)
          const profCityValue = typeof prof.city === 'string' ? prof.city : (prof.cityName || prof.city?.name || String(prof.city));
          if (!profCityValue) return false;
          
          const profCityNormalized = profCityValue.toLowerCase().replace(/\s+/g, '_');
          return profCityNormalized === selectedCityName;
        });
      }
      
      // Filter by minimum rating
      if (minRating > 0) {
        filtered = filtered.filter(prof => prof.rating >= minRating);
      }
      
      // Get friend recommendations for current search
      // Load real friends from database instead of mock list
      let friendsList: string[] = [];
      try {
        // TODO: Load friends from Firestore friendRelationships collection
        // For now, use empty list - no mock data
      } catch (error) {
        console.error('Error loading friends list:', error);
      }
      
      // Always get ALL friend recommendations first
      const allFriendRecs = recommendationService.getFriendsRecommendationsForUser(
        user?.id || 'user1',
        friendsList
      );
      
      // Then filter them based on the current search results
      const friendRecs = allFriendRecs.filter(rec => 
        filtered.some(prof => prof.id === rec.professionalId)
      );
      
      setFriendRecommendations(friendRecs);
      
      // Debug logging
      console.log('Friend recommendations found:', friendRecs.length);
      friendRecs.forEach(rec => {
        console.log(`Friend ${rec.recommenderName} recommends ${rec.professionalName} (ID: ${rec.professionalId})`);
      });
      
      // Sort results with friend recommendations first, then by selected criteria
      filtered.sort((a, b) => {
        const aIsRecommended = friendRecs.some(rec => rec.professionalId === a.id);
        const bIsRecommended = friendRecs.some(rec => rec.professionalId === b.id);
        
        // Friend recommendations ALWAYS come first (regardless of sorting)
        if (aIsRecommended && !bIsRecommended) return -1;
        if (!aIsRecommended && bIsRecommended) return 1;
        
        // If both are friend recommendations, sort them by selected criteria
        if (aIsRecommended && bIsRecommended) {
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
        }
        
        // If neither are friend recommendations, sort by selected criteria
        if (!aIsRecommended && !bIsRecommended) {
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
        }
        
        return 0;
      });
      
      setProfessionals(filtered);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading professionals:', error);
      setProfessionals([]); // No fallback - empty array
      setIsLoading(false);
    }
  };

  const renderProfessional = ({ item }) => {
    // Check if this professional is recommended by friends
    const friendRecommendation = friendRecommendations.find(rec => rec.professionalId === item.id);
    
    // Debug logging
    if (friendRecommendation) {
      console.log(`Professional ${item.name} is recommended by ${friendRecommendation.recommenderName}`);
    }
    
    return (
      <TouchableOpacity
        style={[styles.professionalCard, friendRecommendation && styles.recommendedCard]}
        onPress={() => navigation.navigate('ProfessionalDetails', { professional: item })}
      >
        {friendRecommendation && (
          <View style={styles.recommendationBadge}>
            <Text style={styles.recommendationText}>
              👥 Συνιστάται από {friendRecommendation.recommenderName}
            </Text>
          </View>
        )}
        
        <View style={styles.professionalHeader}>
          <View style={styles.professionalInfo}>
            <Text style={styles.professionalImage}>{item.image}</Text>
            <View style={styles.professionalDetails}>
              <View style={styles.nameRow}>
                <Text style={styles.professionalName}>{item.name}</Text>
                {item.verified && <Text style={styles.verifiedBadge}>✓</Text>}
                {friendRecommendation && <Text style={styles.friendBadge}>👥</Text>}
              </View>
              <Text style={styles.professionalProfession}>{item.profession}</Text>
              <View style={styles.ratingRow}>
                <Text style={styles.rating}>⭐ {item.rating}</Text>
                <Text style={styles.reviewCount}>({item.reviewCount} αξιολογήσεις)</Text>
              </View>
              {friendRecommendation && friendRecommendation.reason && (
                <Text style={styles.recommendationReason}>
                  💬 "{friendRecommendation.reason}"
                </Text>
              )}
            </View>
          </View>
          <View style={styles.professionalMeta}>
            <Text style={styles.distance}>📍 {item.distance}</Text>
            <Text style={styles.price}>{item.price}</Text>
          </View>
        </View>
      
      <Text style={styles.description}>{item.description}</Text>
      
      <View style={styles.servicesContainer}>
        {(item.services || []).slice(0, 3).map((service, index) => {
          // Handle both string and object formats
          const serviceName = typeof service === 'string' ? service : (service?.name || service?.id || String(service));
          return (
            <View key={`service-${item.id}-${index}-${serviceName}`} style={styles.serviceTag}>
              <Text style={styles.serviceText}>{serviceName}</Text>
            </View>
          );
        })}
        {item.services && item.services.length > 3 && (
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
        <TouchableOpacity 
          style={styles.contactButton}
          onPress={() => handleContact(item)}
        >
          <Text style={styles.contactButtonText}>Επικοινωνία</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        }} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Βρείτε Επαγγελματίες</Text>
          <Text style={styles.userName}>{user?.name || 'Χρήστη'}</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Αναζήτηση..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9ca3af"
          />
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchButtonText}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.clearFiltersIconButton}
            onPress={clearAllFilters}
          >
            <Text style={styles.clearFiltersIconText}>🗑️</Text>
          </TouchableOpacity>
        </View>

        {/* Categories Dropdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Επάγγελμα</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
          >
            <Text style={styles.dropdownButtonText}>
              {selectedCategory ? 
                categories.find(cat => cat.id === selectedCategory)?.name || 'Επιλέξτε επάγγελμα' :
                'Επιλέξτε επάγγελμα'
              }
            </Text>
            <Text style={styles.dropdownArrow}>
              {showCategoryDropdown ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>
          
          {showCategoryDropdown && (
            <View style={styles.dropdownList}>
              <ScrollView style={styles.dropdownScrollView} nestedScrollEnabled={true}>
                {categories.map((category, index) => (
                  <TouchableOpacity
                    key={category.id ? `cat-${category.id}` : `cat-${index}-${category.name || ''}`}
                    style={[
                      styles.dropdownItem,
                      selectedCategory === category.id && styles.selectedDropdownItem
                    ]}
                    onPress={() => {
                      setSelectedCategory(category.id);
                      setShowCategoryDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemIcon}>{category.icon}</Text>
                    <Text style={[
                      styles.dropdownItemText,
                      selectedCategory === category.id && styles.selectedDropdownItemText
                    ]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* City Dropdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Πόλη</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowCityDropdown(!showCityDropdown)}
          >
            <Text style={styles.dropdownButtonText}>
              {selectedCity ? 
                cities.find(city => city.id === selectedCity)?.name || 'Επιλέξτε πόλη' :
                'Επιλέξτε πόλη'
              }
            </Text>
            <Text style={styles.dropdownArrow}>
              {showCityDropdown ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>
          
          {showCityDropdown && (
            <View style={styles.dropdownList}>
              <ScrollView style={styles.dropdownScrollView} nestedScrollEnabled={true}>
                {cities.map((city, index) => (
                  <TouchableOpacity
                    key={city.id || city.name || `city-${index}`}
                    style={[
                      styles.dropdownItem,
                      selectedCity === city.id && styles.selectedDropdownItem
                    ]}
                    onPress={() => {
                      setSelectedCity(city.id);
                      setShowCityDropdown(false);
                    }}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      selectedCity === city.id && styles.selectedDropdownItemText
                    ]}>
                      {city.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Ελάχιστη Αξιολόγηση:</Text>
            <View style={styles.ratingFilterContainer}>
              {[0, 1, 2, 3, 4, 5].map(rating => (
                <TouchableOpacity
                  key={rating}
                  style={[
                    styles.ratingButton,
                    minRating === rating && styles.selectedRating
                  ]}
                  onPress={() => setMinRating(rating)}
                >
                  <Text style={[
                    styles.ratingButtonText,
                    minRating === rating && styles.selectedRatingText
                  ]}>
                    {rating === 0 ? 'Όλα' : `${rating}+ ⭐`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
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
      
      {/* Floating Action Button for Adding Professional */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('ProfessionalRegistration')}
      >
        <Text style={styles.fabIcon}>+</Text>
        <Text style={styles.fabText}>Επαγγελματίας</Text>
      </TouchableOpacity>
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
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  userName: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
    marginTop: 2,
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
  clearFiltersIconButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  clearFiltersIconText: {
    fontSize: 16,
    color: '#ffffff',
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
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
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
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
  ratingFilterContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  ratingButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  selectedRating: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
  ratingButtonText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  selectedRatingText: {
    color: '#ffffff',
  },
  dropdownContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 8,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 4,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 8,
  },
  dropdownList: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownScrollView: {
    maxHeight: 200,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  selectedDropdownItem: {
    backgroundColor: '#eff6ff',
  },
  dropdownItemIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  selectedDropdownItemText: {
    color: '#1d4ed8',
    fontWeight: '600',
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
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 8,
  },
  fabText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  // Friend recommendation styles
  recommendedCard: {
    borderColor: '#10B981',
    borderWidth: 2,
    backgroundColor: '#F0FDF4',
  },
  recommendationBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginBottom: 8,
  },
  recommendationText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  friendBadge: {
    fontSize: 16,
    marginLeft: 8,
  },
  recommendationReason: {
    fontSize: 12,
    color: '#059669',
    fontStyle: 'italic',
    marginTop: 4,
    lineHeight: 16,
  },
});
