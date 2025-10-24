// Simple database status checker
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

async function checkDatabaseStatus() {
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log('🔍 Checking database status...');
    
    // Check if users exist
    const usersSnapshot = await getDocs(collection(db, 'users'));
    console.log(`👥 Users: ${usersSnapshot.size} found`);
    
    // Check if professionals exist
    const professionalsSnapshot = await getDocs(collection(db, 'professionals'));
    console.log(`👨‍💼 Professionals: ${professionalsSnapshot.size} found`);
    
    // Check if categories exist
    const categoriesSnapshot = await getDocs(collection(db, 'categories'));
    console.log(`📂 Categories: ${categoriesSnapshot.size} found`);
    
    // Check if cities exist
    const citiesSnapshot = await getDocs(collection(db, 'cities'));
    console.log(`🏙️ Cities: ${citiesSnapshot.size} found`);
    
    // Check if countries exist
    const countriesSnapshot = await getDocs(collection(db, 'countries'));
    console.log(`🌍 Countries: ${countriesSnapshot.size} found`);
    
    // Check if appointments exist
    const appointmentsSnapshot = await getDocs(collection(db, 'appointments'));
    console.log(`📅 Appointments: ${appointmentsSnapshot.size} found`);
    
    // Check if reviews exist
    const reviewsSnapshot = await getDocs(collection(db, 'reviews'));
    console.log(`⭐ Reviews: ${reviewsSnapshot.size} found`);
    
    console.log('\n📊 Database Status Summary:');
    console.log(`- Users: ${usersSnapshot.size > 0 ? '✅' : '❌'}`);
    console.log(`- Professionals: ${professionalsSnapshot.size > 0 ? '✅' : '❌'}`);
    console.log(`- Categories: ${categoriesSnapshot.size > 0 ? '✅' : '❌'}`);
    console.log(`- Cities: ${citiesSnapshot.size > 0 ? '✅' : '❌'}`);
    console.log(`- Countries: ${countriesSnapshot.size > 0 ? '✅' : '❌'}`);
    console.log(`- Appointments: ${appointmentsSnapshot.size > 0 ? '✅' : '❌'}`);
    console.log(`- Reviews: ${reviewsSnapshot.size > 0 ? '✅' : '❌'}`);
    
    const totalCollections = [usersSnapshot, professionalsSnapshot, categoriesSnapshot, citiesSnapshot, countriesSnapshot, appointmentsSnapshot, reviewsSnapshot];
    const hasData = totalCollections.some(snapshot => snapshot.size > 0);
    
    if (hasData) {
      console.log('\n✅ Database has data - setup appears complete!');
    } else {
      console.log('\n❌ Database is empty - needs initialization!');
      console.log('💡 You can initialize the database through the app:');
      console.log('   1. Open the app');
      console.log('   2. Go to the Search tab');
      console.log('   3. Look for "Data Management" option');
      console.log('   4. Click "Initialize Data"');
    }
    
  } catch (error) {
    console.error('❌ Error checking database:', error.message);
  }
}

checkDatabaseStatus();
