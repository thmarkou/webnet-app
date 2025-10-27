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
      completionRate: '98%',
      phone: '+30 210 1234567',
      email: 'giannis.papadopoulos@example.com',
      address: 'Πανεπιστημίου 15, Αθήνα 10679',
      coordinates: {
        latitude: 37.9755,
        longitude: 23.7348
      }
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
      completionRate: '100%',
      phone: '+30 210 2345678',
      email: 'maria.kostopoulou@example.com',
      address: 'Σταδίου 8, Αθήνα 10564',
      coordinates: {
        latitude: 37.9755,
        longitude: 23.7348
      }
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
      completionRate: '95%',
      phone: '+30 210 3456789',
      email: 'petros.nikolaou@example.com',
      address: 'Ακαδημίας 12, Αθήνα 10671',
      coordinates: {
        latitude: 37.9755,
        longitude: 23.7348
      }
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
    },
    {
      id: '6',
      name: 'Σπύρος Δημητρίου',
      profession: 'Κλειδαράς',
      category: 'locksmith',
      city: 'athens',
      rating: 4.9,
      reviewCount: 234,
      price: '€60-120',
      distance: '1.8 km',
      availability: 'Διαθέσιμος',
      services: ['Αντικατάσταση Κλειδιών', 'Ξεκλείδωμα', 'Σύστημα Ασφαλείας'],
      description: 'Επαγγελματίας κλειδαράς με 20+ χρόνια εμπειρία. Γρήγορη εξυπηρέτηση 24/7 για όλες τις κλειδαρικές ανάγκες.',
      image: '🔐',
      verified: true,
      responseTime: '30 λεπτά',
      completionRate: '100%'
    },
    {
      id: '7',
      name: 'Ελένη Παπαδοπούλου',
      profession: 'Θερμοσίφωνας',
      category: 'hvac',
      city: 'thessaloniki',
      rating: 4.7,
      reviewCount: 156,
      price: '€80-150',
      distance: '3.5 km',
      availability: 'Διαθέσιμος',
      services: ['Επισκευή Θερμοσίφωνα', 'Συντήρηση', 'Εγκατάσταση'],
      description: 'Ειδικευμένη τεχνικός θερμοσίφωνα με πιστοποίηση. Επισκευές και συντήρηση όλων των μοντέλων.',
      image: '🔥',
      verified: true,
      responseTime: '2 ώρες',
      completionRate: '98%'
    },
    {
      id: '8',
      name: 'Μιχάλης Κωνσταντίνου',
      profession: 'Παρκέ',
      category: 'flooring',
      city: 'athens',
      rating: 4.3,
      reviewCount: 89,
      price: '€25-45',
      distance: '2.1 km',
      availability: 'Διαθέσιμος',
      services: ['Τοποθέτηση Παρκέ', 'Συντήρηση', 'Ανάκτηση'],
      description: 'Επαγγελματίας παρκετζής με εμπειρία σε όλα τα είδη ξύλου. Ποιότητα και ακρίβεια στην εργασία.',
      image: '🏠',
      verified: false,
      responseTime: '1 ώρα',
      completionRate: '95%'
    },
    {
      id: '9',
      name: 'Αννα Γεωργίου',
      profession: 'Συσκευές',
      category: 'appliance',
      city: 'patras',
      rating: 4.6,
      reviewCount: 167,
      price: '€40-80',
      distance: '1.9 km',
      availability: 'Διαθέσιμος',
      services: ['Επισκευή Ψυγείου', 'Πλυντήριο', 'Φούρνος'],
      description: 'Ειδικευμένη τεχνικός συσκευών με γνώσεις σε όλες τις μάρκες. Γρήγορη και αξιόπιστη εξυπηρέτηση.',
      image: '🔌',
      verified: true,
      responseTime: '45 λεπτά',
      completionRate: '97%'
    },
    {
      id: '10',
      name: 'Γιώργος Παπαγιάννης',
      profession: 'Ασφάλεια',
      category: 'security',
      city: 'athens',
      rating: 4.8,
      reviewCount: 198,
      price: '€100-200',
      distance: '2.7 km',
      availability: 'Διαθέσιμος',
      services: ['Συστήματα Ασφαλείας', 'Καμερες', 'Αντιασφάλεια'],
      description: 'Ειδικευμένος τεχνικός συστημάτων ασφαλείας. Εγκαταστάσεις και συντήρηση για σπίτια και επιχειρήσεις.',
      image: '🛡️',
      verified: true,
      responseTime: '1 ώρα',
      completionRate: '99%'
    },
    {
      id: '11',
      name: 'Νίκος Ξυλουργός',
      profession: 'Ξυλουργός',
      category: 'carpenter',
      city: 'athens',
      rating: 4.6,
      reviewCount: 78,
      price: '€45-75',
      distance: '3.2 km',
      availability: 'Διαθέσιμος',
      services: ['Έπιπλα', 'Συντήρηση', 'Επισκευή'],
      description: 'Εξειδικευμένος ξυλουργός με 12+ χρόνια εμπειρίας. Ειδικεύομαι σε κατασκευή και επισκευή επίπλων.',
      image: '🔨',
      verified: true,
      responseTime: '2 ώρες',
      completionRate: '97%',
      phone: '+30 210 3456789',
      email: 'nikos.xylourgou@example.com'
    },
    {
      id: '12',
      name: 'Πέτρος Μηχανικός',
      profession: 'Υδραυλικός',
      category: 'plumber',
      city: 'patras',
      rating: 4.8,
      reviewCount: 92,
      price: '€60-100',
      distance: '4.1 km',
      availability: 'Διαθέσιμος',
      services: ['Επισκευή Σωλήνων', 'Εγκατάσταση Μπάνιου', 'Συντήρηση'],
      description: 'Επαγγελματίας υδραυλικός με εξειδίκευση σε επισκευές και εγκαταστάσεις. Γρήγορη και αξιόπιστη εξυπηρέτηση στην Πάτρα.',
      image: '🚰',
      verified: true,
      responseTime: '1.5 ώρες',
      completionRate: '99%',
      phone: '+30 210 4567890',
      email: 'petros.ydraulikos@example.com'
    },
    {
      id: '13',
      name: 'Ελένη Δημοσιογράφος',
      profession: 'Υδραυλικός',
      category: 'plumber',
      city: 'larissa',
      rating: 4.5,
      reviewCount: 45,
      price: '€80-120',
      distance: '2.8 km',
      availability: 'Διαθέσιμος',
      services: ['Επισκευή Σωλήνων', 'Εγκατάσταση Μπάνιου', 'Συντήρηση'],
      description: 'Επαγγελματίας υδραυλικός με εμπειρία σε επισκευές και εγκαταστάσεις. Εξειδικεύομαι σε υδραυλικές εγκαταστάσεις στην Λάρισα.',
      image: '🚰',
      verified: true,
      responseTime: '3 ώρες',
      completionRate: '95%',
      phone: '+30 210 5678901',
      email: 'eleni.ydraulikos@example.com'
    },
    {
      id: '14',
      name: 'Άννα Παπίδου',
      profession: 'Ηλεκτρολόγος',
      category: 'electrician',
      city: 'thessaloniki',
      rating: 4.7,
      reviewCount: 143,
      price: '€55-85',
      distance: '2.8 km',
      availability: 'Διαθέσιμος',
      services: ['Επισκευή Ηλεκτρικών', 'Εγκατάσταση Φωτισμού', 'Συντήρηση'],
      description: 'Εξειδικευμένη ηλεκτρολόγος με 18+ χρόνια εμπειρίας. Ειδικεύομαι σε οικιακές και εμπορικές ηλεκτρολογικές εγκαταστάσεις στη Θεσσαλονίκη.',
      image: '👩‍🔧',
      verified: true,
      responseTime: '45 λεπτά',
      completionRate: '98%',
      phone: '+30 231 1234567',
      email: 'anna.papidou@example.com',
      address: 'Ιωνίας 71, 54453 Θεσσαλονίκη, Ελλάδα',
      coordinates: {
        latitude: 40.608796, // Exact coordinates for Ionias 71, Thessaloniki
        longitude: 22.970381
      }
    },
    {
      id: '15',
      name: 'Άρης Μάρκου',
      profession: 'Μαραγκός',
      category: 'painter',
      city: 'athens',
      rating: 4.9,
      reviewCount: 201,
      price: '€40-70',
      distance: '1.5 km',
      availability: 'Διαθέσιμος',
      services: ['Βάψιμο Δωματίων', 'Εξωτερικά Χρώματα', 'Αντισηπτικά'],
      description: 'Επαγγελματίας μάστορας με εμπειρία σε εσωτερικά και εξωτερικά χρώματα. Χρήση υψηλής ποιότητας υλικών και προσεκτική εργασία.',
      image: '👨‍🎨',
      verified: true,
      responseTime: '1 ώρα',
      completionRate: '100%',
      phone: '+30 210 9876543',
      email: 'aris.markou@example.com',
      address: 'Μακροχωρίου 7, 11363 Αθήνα, Ελλάδα',
      coordinates: {
        latitude: 37.99811,
        longitude: 23.74883
      }
    }
  ];

  useEffect(() => {
    initializeTables();
    loadCategoriesAndCities();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      filterProfessionals();
    }, [searchQuery, selectedCategory, selectedCity, minRating, sortBy])
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
            // Navigate to chat (disabled for now)
            Alert.alert('Chat', 'Η λειτουργία chat θα προστεθεί σύντομα');
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
      // Load custom professionals from AsyncStorage
      let filtered = [...mockProfessionals];
      try {
        const customProfessionalsJson = await AsyncStorage.getItem('customProfessionals');
        if (customProfessionalsJson) {
          const customProfessionals = JSON.parse(customProfessionalsJson);
          console.log('Loaded custom professionals:', customProfessionals.length);
          filtered = [...mockProfessionals, ...customProfessionals];
        }
      } catch (error) {
        console.error('Error loading custom professionals:', error);
      }
      
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
        // Normalize city comparison - handle both old format (city names) and new format (city IDs)
        const selectedCityName = cities.find(c => c.id === selectedCity)?.name.toLowerCase().replace(/\s+/g, '_') || selectedCity;
        filtered = filtered.filter(prof => {
          // Try matching by ID first
          if (prof.city === selectedCity) return true;
          // Then try matching by normalized name
          const profCityNormalized = prof.city.toLowerCase().replace(/\s+/g, '_');
          return profCityNormalized === selectedCityName;
        });
      }
      
      // Filter by minimum rating
      if (minRating > 0) {
        filtered = filtered.filter(prof => prof.rating >= minRating);
      }
      
      // Get friend recommendations for current search
      const mockFriendsList = ['user2', 'user3', '1', '3']; // Mock friends list (Μαρία, Γιάννης, Άννα, Λίζα)
      
      // Always get ALL friend recommendations first
      const allFriendRecs = recommendationService.getFriendsRecommendationsForUser(
        user?.id || 'user1',
        mockFriendsList
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
      setProfessionals(mockProfessionals); // Fallback to mock data
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
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
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
                {categories.map(category => (
                  <TouchableOpacity
                    key={category.id}
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
                {cities.map(city => (
                  <TouchableOpacity
                    key={city.id}
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
