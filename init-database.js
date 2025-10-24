// Simple database initialization script
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc } = require('firebase/firestore');

// Load environment variables
require('dotenv').config({ path: '.env.development' });

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

async function initializeDatabase() {
  try {
    console.log('🚀 Initializing Firebase database...');
    
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    // 1. Create Categories
    console.log('📂 Creating categories...');
    const categories = [
      { id: 'plumber', name: 'Υδραυλικός', icon: 'wrench' },
      { id: 'electrician', name: 'Ηλεκτρολόγος', icon: 'flash' },
      { id: 'painter', name: 'Ελαιοχρωματιστής', icon: 'brush' },
      { id: 'gardener', name: 'Κηπουρός', icon: 'leaf' },
      { id: 'carpenter', name: 'Ξυλουργός', icon: 'hammer' },
      { id: 'hvac', name: 'Τεχνικός Θέρμανσης/Κλιματισμού', icon: 'thermometer' },
      { id: 'landscaper', name: 'Κηπουρός', icon: 'leaf' },
      { id: 'appliance', name: 'Συσκευές', icon: 'hardware-chip' },
      { id: 'roofing', name: 'Στέγες', icon: 'home' },
      { id: 'flooring', name: 'Παρκέ', icon: 'square' },
      { id: 'cleaning', name: 'Καθαρισμός', icon: 'sparkles' },
      { id: 'security', name: 'Ασφάλεια', icon: 'shield' }
    ];
    
    for (const category of categories) {
      await setDoc(doc(db, 'categories', category.id), {
        ...category,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    console.log('✅ Categories created');
    
    // 2. Create Countries
    console.log('🌍 Creating countries...');
    const countries = [
      { id: 'greece', name: 'Ελλάδα', code: 'GR' },
      { id: 'cyprus', name: 'Κύπρος', code: 'CY' },
      { id: 'germany', name: 'Γερμανία', code: 'DE' },
      { id: 'france', name: 'Γαλλία', code: 'FR' },
      { id: 'italy', name: 'Ιταλία', code: 'IT' },
      { id: 'spain', name: 'Ισπανία', code: 'ES' },
      { id: 'uk', name: 'Ηνωμένο Βασίλειο', code: 'GB' },
      { id: 'usa', name: 'Ηνωμένες Πολιτείες', code: 'US' },
      { id: 'canada', name: 'Καναδάς', code: 'CA' },
      { id: 'netherlands', name: 'Ολλανδία', code: 'NL' },
      { id: 'sweden', name: 'Σουηδία', code: 'SE' }
    ];
    
    for (const country of countries) {
      await setDoc(doc(db, 'countries', country.id), {
        ...country,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    console.log('✅ Countries created');
    
    // 3. Create Cities
    console.log('🏙️ Creating cities...');
    const cities = [
      { id: 'athens', name: 'Αθήνα', countryId: 'greece' },
      { id: 'thessaloniki', name: 'Θεσσαλονίκη', countryId: 'greece' },
      { id: 'patras', name: 'Πάτρα', countryId: 'greece' },
      { id: 'heraklion', name: 'Ηράκλειο', countryId: 'greece' },
      { id: 'larissa', name: 'Λάρισα', countryId: 'greece' },
      { id: 'volos', name: 'Βόλος', countryId: 'greece' },
      { id: 'ioannina', name: 'Ιωάννινα', countryId: 'greece' },
      { id: 'kavala', name: 'Καβάλα', countryId: 'greece' },
      { id: 'nicosia', name: 'Λευκωσία', countryId: 'cyprus' },
      { id: 'limassol', name: 'Λεμεσός', countryId: 'cyprus' },
      { id: 'larnaca', name: 'Λάρνακα', countryId: 'cyprus' },
      { id: 'paphos', name: 'Πάφος', countryId: 'cyprus' }
    ];
    
    for (const city of cities) {
      await setDoc(doc(db, 'cities', city.id), {
        ...city,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    console.log('✅ Cities created');
    
    // 4. Create Test Users
    console.log('👥 Creating test users...');
    const users = [
      {
        id: 'user1',
        email: 'user@demo.com',
        name: 'John Doe',
        role: 'user',
        phone: '+30 210 123 4567',
        location: 'Athens, Greece',
        occupation: 'Software Engineer',
        isVerified: true,
        joinedDate: '2023-01-15'
      },
      {
        id: 'user2',
        email: 'maria.papadopoulou@demo.com',
        name: 'Maria Papadopoulou',
        role: 'user',
        phone: '+30 210 987 6543',
        location: 'Athens, Greece',
        occupation: 'Marketing Manager',
        isVerified: true,
        joinedDate: '2023-02-20'
      },
      {
        id: 'user3',
        email: 'alex@demo.com',
        name: 'Alex Johnson',
        role: 'user',
        phone: '+30 210 555 1234',
        location: 'Thessaloniki, Greece',
        occupation: 'Teacher',
        isVerified: true,
        joinedDate: '2023-03-10'
      }
    ];
    
    for (const user of users) {
      await setDoc(doc(db, 'users', user.id), {
        ...user,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    console.log('✅ Test users created');
    
    // 5. Create Test Professionals
    console.log('👨‍💼 Creating test professionals...');
    const professionals = [
      {
        id: 'prof1',
        email: 'george.papadopoulos@demo.com',
        name: 'George Papadopoulos',
        role: 'professional',
        phone: '+30 210 111 2222',
        location: 'Athens, Greece',
        profession: 'plumber',
        businessName: 'George Plumbing Services',
        rating: 4.8,
        reviewsCount: 25,
        isVerified: true,
        joinedDate: '2023-01-01'
      },
      {
        id: 'prof2',
        email: 'maria.konstantinou@demo.com',
        name: 'Maria Konstantinou',
        role: 'professional',
        phone: '+30 210 333 4444',
        location: 'Athens, Greece',
        profession: 'electrician',
        businessName: 'Maria Electrical Solutions',
        rating: 4.6,
        reviewsCount: 18,
        isVerified: true,
        joinedDate: '2023-01-15'
      },
      {
        id: 'prof3',
        email: 'dimitris.nikolaou@demo.com',
        name: 'Dimitris Nikolaou',
        role: 'professional',
        phone: '+30 210 555 6666',
        location: 'Thessaloniki, Greece',
        profession: 'painter',
        businessName: 'Dimitris Painting Co.',
        rating: 4.7,
        reviewsCount: 22,
        isVerified: true,
        joinedDate: '2023-02-01'
      }
    ];
    
    for (const professional of professionals) {
      await setDoc(doc(db, 'professionals', professional.id), {
        ...professional,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    console.log('✅ Test professionals created');
    
    console.log('\n🎉 Database initialization completed successfully!');
    console.log('📊 Summary:');
    console.log(`- ${categories.length} categories created`);
    console.log(`- ${countries.length} countries created`);
    console.log(`- ${cities.length} cities created`);
    console.log(`- ${users.length} test users created`);
    console.log(`- ${professionals.length} test professionals created`);
    console.log('\n✅ Your app is now ready to use!');
    
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Check your internet connection');
    console.log('2. Verify Firebase configuration in .env.development');
    console.log('3. Make sure Firebase project is active');
  }
}

initializeDatabase();
