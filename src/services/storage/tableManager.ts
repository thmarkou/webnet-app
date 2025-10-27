import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const PROFESSIONS_KEY = 'app_professions';
const CITIES_KEY = 'app_cities';

// Default data
const DEFAULT_PROFESSIONS = [
  { id: 'plumber', name: 'Υδραυλικός', icon: '🔧' },
  { id: 'electrician', name: 'Ηλεκτρολόγος', icon: '⚡' },
  { id: 'mechanic', name: 'Μηχανικός', icon: '🔩' },
  { id: 'painter', name: 'Βαφέας', icon: '🎨' },
  { id: 'carpenter', name: 'Ξυλουργός', icon: '🪚' },
  { id: 'gardener', name: 'Κηπουρός', icon: '🌱' },
  { id: 'cleaner', name: 'Καθαριστής', icon: '🧽' },
  { id: 'cook', name: 'Μαγείρας', icon: '👨‍🍳' },
  { id: 'driver', name: 'Οδηγός', icon: '🚗' },
  { id: 'teacher', name: 'Δάσκαλος', icon: '👨‍🏫' },
  { id: 'doctor', name: 'Γιατρός', icon: '👨‍⚕️' },
  { id: 'lawyer', name: 'Δικηγόρος', icon: '⚖️' },
  { id: 'accountant', name: 'Λογιστής', icon: '📊' },
  { id: 'architect', name: 'Αρχιτέκτονας', icon: '🏗️' },
  { id: 'engineer', name: 'Μηχανικός', icon: '⚙️' },
  { id: 'designer', name: 'Σχεδιαστής', icon: '🎨' },
  { id: 'photographer', name: 'Φωτογράφος', icon: '📸' },
  { id: 'hairdresser', name: 'Κομμωτής', icon: '💇‍♂️' },
  { id: 'massage', name: 'Μασέρ', icon: '💆‍♂️' },
  { id: 'personal_trainer', name: 'Προσωπικός Γυμναστής', icon: '💪' },
  { id: 'psychologist', name: 'Ψυχολόγος', icon: '🧠' },
  { id: 'dentist', name: 'Οδοντίατρος', icon: '🦷' },
  { id: 'veterinarian', name: 'Κτηνίατρος', icon: '🐕' },
  { id: 'translator', name: 'Μεταφραστής', icon: '🌐' },
  { id: 'programmer', name: 'Προγραμματιστής', icon: '💻' },
  { id: 'marketing', name: 'Μάρκετινγκ', icon: '📈' },
  { id: 'sales', name: 'Πωλήσεις', icon: '💰' },
  { id: 'customer_service', name: 'Εξυπηρέτηση Πελατών', icon: '🎧' },
  { id: 'security', name: 'Ασφάλεια', icon: '🛡️' },
  { id: 'delivery', name: 'Παράδοση', icon: '📦' },
  { id: 'car_mechanic', name: 'Μηχανικός Αυτοκινήτων', icon: '🚗' },
  { id: 'journalist', name: 'Δημοσιογράφος', icon: '📺' },
];

const DEFAULT_CITIES = [
  { id: '', name: 'Όλες οι Πόλεις' },
  { id: 'athens', name: 'Αθήνα' },
  { id: 'thessaloniki', name: 'Θεσσαλονίκη' },
  { id: 'patras', name: 'Πάτρα' },
  { id: 'heraklion', name: 'Ηράκλειο' },
  { id: 'larissa', name: 'Λάρισα' },
  { id: 'volos', name: 'Βόλος' },
  { id: 'ioannina', name: 'Ιωάννινα' },
  { id: 'kavala', name: 'Καβάλα' },
  { id: 'komotini', name: 'Κομοτηνή' },
  { id: 'serres', name: 'Σέρρες' },
  { id: 'drama', name: 'Δράμα' },
  { id: 'xanthi', name: 'Ξάνθη' },
  { id: 'alexandroupoli', name: 'Αλεξανδρούπολη' },
  { id: 'kalamata', name: 'Καλαμάτα' },
  { id: 'nea_moudania', name: 'Νέα Μουδανιά' },
  { id: 'tripoli', name: 'Τρίπολη' },
  { id: 'sparti', name: 'Σπάρτη' },
  { id: 'corinth', name: 'Κόρινθος' },
  { id: 'argos', name: 'Άργος' },
  { id: 'nafplio', name: 'Ναύπλιο' },
  { id: 'rhodes', name: 'Ρόδος' },
  { id: 'mykonos', name: 'Μύκονος' },
  { id: 'santorini', name: 'Σαντορίνη' },
  { id: 'crete', name: 'Κρήτη' },
  { id: 'lesvos', name: 'Λέσβος' },
  { id: 'chios', name: 'Χίος' },
  { id: 'samos', name: 'Σάμος' },
  { id: 'zakynthos', name: 'Ζάκυνθος' },
  { id: 'kefalonia', name: 'Κεφαλονιά' },
];

// Initialize tables with default data
export const initializeTables = async () => {
  try {
    // Force update cities every time to ensure latest data
    await AsyncStorage.removeItem(CITIES_KEY); // Clear old data
    await AsyncStorage.setItem(CITIES_KEY, JSON.stringify(DEFAULT_CITIES));
    console.log('✅ Cities table initialized with latest data including Νέα Μουδανιά');

    // Initialize professions only if not exists
    const existingProfessions = await AsyncStorage.getItem(PROFESSIONS_KEY);
    if (!existingProfessions) {
      await AsyncStorage.setItem(PROFESSIONS_KEY, JSON.stringify(DEFAULT_PROFESSIONS));
      console.log('Initialized professions table');
    }
    
    // Log for debugging
    const cities = await AsyncStorage.getItem(CITIES_KEY);
    const parsedCities = cities ? JSON.parse(cities) : [];
    const neaMoudaniaExists = parsedCities.some(c => c.name === 'Νέα Μουδανιά');
    console.log(neaMoudaniaExists ? '✅ Νέα Μουδανιά found in cities' : '❌ Νέα Μουδανιά NOT found in cities');
    console.log('Total cities:', parsedCities.length);
  } catch (error) {
    console.error('Error initializing tables:', error);
  }
};

// Professions CRUD operations
export const getProfessions = async () => {
  try {
    const professionsJson = await AsyncStorage.getItem(PROFESSIONS_KEY);
    return professionsJson ? JSON.parse(professionsJson) : DEFAULT_PROFESSIONS;
  } catch (error) {
    console.error('Error getting professions:', error);
    return DEFAULT_PROFESSIONS;
  }
};

export const addProfession = async (profession: { name: string; icon?: string }) => {
  try {
    const professions = await getProfessions();
    const newProfession = {
      id: `prof_${Date.now()}`,
      name: profession.name,
      icon: profession.icon || '🔧'
    };
    professions.push(newProfession);
    await AsyncStorage.setItem(PROFESSIONS_KEY, JSON.stringify(professions));
    console.log('Added new profession:', newProfession.name);
    return newProfession;
  } catch (error) {
    console.error('Error adding profession:', error);
    throw new Error('Αδυναμία προσθήκης επαγγέλματος');
  }
};

// Cities CRUD operations
export const getCities = async () => {
  try {
    const citiesJson = await AsyncStorage.getItem(CITIES_KEY);
    return citiesJson ? JSON.parse(citiesJson) : DEFAULT_CITIES;
  } catch (error) {
    console.error('Error getting cities:', error);
    return DEFAULT_CITIES;
  }
};

export const addCity = async (city: { name: string }) => {
  try {
    const cities = await getCities();
    const newCity = {
      id: `city_${Date.now()}`,
      name: city.name
    };
    cities.push(newCity);
    await AsyncStorage.setItem(CITIES_KEY, JSON.stringify(cities));
    console.log('Added new city:', newCity.name);
    return newCity;
  } catch (error) {
    console.error('Error adding city:', error);
    throw new Error('Αδυναμία προσθήκης πόλης');
  }
};

// Update existing records
export const updateProfession = async (id: string, updates: { name?: string; icon?: string }) => {
  try {
    const professions = await getProfessions();
    const index = professions.findIndex(p => p.id === id);
    if (index !== -1) {
      professions[index] = { ...professions[index], ...updates };
      await AsyncStorage.setItem(PROFESSIONS_KEY, JSON.stringify(professions));
      console.log('Updated profession:', professions[index].name);
      return professions[index];
    }
    throw new Error('Profession not found');
  } catch (error) {
    console.error('Error updating profession:', error);
    throw error;
  }
};

export const updateCity = async (id: string, updates: { name?: string }) => {
  try {
    const cities = await getCities();
    const index = cities.findIndex(c => c.id === id);
    if (index !== -1) {
      cities[index] = { ...cities[index], ...updates };
      await AsyncStorage.setItem(CITIES_KEY, JSON.stringify(cities));
      console.log('Updated city:', cities[index].name);
      return cities[index];
    }
    throw new Error('City not found');
  } catch (error) {
    console.error('Error updating city:', error);
    throw error;
  }
};

// Delete records
export const deleteProfession = async (id: string) => {
  try {
    const professions = await getProfessions();
    const filtered = professions.filter(p => p.id !== id);
    await AsyncStorage.setItem(PROFESSIONS_KEY, JSON.stringify(filtered));
    console.log('Deleted profession with id:', id);
    return true;
  } catch (error) {
    console.error('Error deleting profession:', error);
    throw error;
  }
};

export const deleteCity = async (id: string) => {
  try {
    const cities = await getCities();
    const filtered = cities.filter(c => c.id !== id);
    await AsyncStorage.setItem(CITIES_KEY, JSON.stringify(filtered));
    console.log('Deleted city with id:', id);
    return true;
  } catch (error) {
    console.error('Error deleting city:', error);
    throw error;
  }
};
