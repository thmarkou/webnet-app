/**
 * Script to add Ελπίδα Τσαι professional to Firestore
 * Run: node scripts/addElpidaTsai.js
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, query, where, Timestamp } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyDtu2OcFaIQ6WbcSuUBjXznZeCZvii-V28",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "webnetapp-dev.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "webnetapp-dev",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "webnetapp-dev.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "270224209631",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:270224209631:web:4148c7d04048a2f1c29b6a",
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-VBHXL8YDP7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function addElpidaTsai() {
  try {
    console.log('🔄 Adding Ελπίδα Τσαι professional...\n');
    
    // Check if already exists
    const existingQuery = query(
      collection(db, 'professionals'),
      where('name', '==', 'Ελπίδα Τσαι')
    );
    const existingSnapshot = await getDocs(existingQuery);
    
    if (!existingSnapshot.empty) {
      console.log('✅ Ελπίδα Τσαι already exists');
      existingSnapshot.forEach(doc => {
        console.log(`   ID: ${doc.id}`);
        console.log(`   Profession: ${doc.data().profession || 'N/A'}`);
      });
      return;
    }
    
    // Get city ID for Νέα Μουδανιά
    let cityId = 'nea_moudania'; // Default
    try {
      const citiesQuery = query(
        collection(db, 'cities'),
        where('name', '==', 'Νέα Μουδανιά')
      );
      const citiesSnapshot = await getDocs(citiesQuery);
      if (!citiesSnapshot.empty) {
        cityId = citiesSnapshot.docs[0].id;
      }
    } catch (error) {
      console.log('⚠️  Could not find city, using default ID');
    }
    
    // Professional data
    const professionalData = {
      name: 'Ελπίδα Τσαι',
      profession: 'Κηπουρός',
      category: 'κηπουρός',
      city: cityId,
      cityName: 'Νέα Μουδανιά',
      area: 'Χαλκιδική',
      rating: 0,
      reviewCount: 0,
      price: '€0-0',
      distance: '0 km',
      availability: 'Διαθέσιμος',
      services: ['Κηπουρικά', 'Καλλιέργεια'],
      serviceDuration: 60,
      description: 'Επαγγελματίας Κηπουρός στην περιοχή Νέα Μουδανιά, Χαλκιδική',
      image: '👨‍💼',
      verified: false,
      responseTime: '2 ώρες',
      completionRate: '0%',
      phone: '', // Add phone when available
      email: '', // Add email when available
      address: 'Νέα Μουδανιά, Χαλκιδική', // Update with full address
      coordinates: {
        latitude: 40.2400, // Νέα Μουδανιά approximate coordinates
        longitude: 23.2800,
      },
      createdBy: 'system',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    
    // Add to Firestore
    const docRef = await addDoc(collection(db, 'professionals'), professionalData);
    
    console.log('✅ Ελπίδα Τσαι added successfully!');
    console.log(`   ID: ${docRef.id}`);
    console.log(`   Name: ${professionalData.name}`);
    console.log(`   Profession: ${professionalData.profession}`);
    console.log(`   City: ${professionalData.cityName}`);
    console.log('\n📝 Note: Update phone, email, and full address in the app');
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

async function main() {
  try {
    await addElpidaTsai();
    process.exit(0);
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

main();

