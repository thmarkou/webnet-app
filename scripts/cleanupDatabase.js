/**
 * Script to cleanup database - keep only Ελπίδα Τσαι professional
 * Deletes all other professionals, appointments, reviews, recommendations, friend requests
 * Run: node scripts/cleanupDatabase.js
 */

const { initializeApp } = require('firebase/app');
const { 
  getFirestore, 
  collection, 
  getDocs, 
  deleteDoc, 
  doc,
  query,
  where 
} = require('firebase/firestore');

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

const KEEP_PROFESSIONAL_NAME = 'Ελπίδα Τσαι';
const KEEP_PROFESSIONAL_PROFESSION = 'Κηπουρός';

async function deleteAllFromCollection(collectionName) {
  try {
    const snapshot = await getDocs(collection(db, collectionName));
    let deleted = 0;
    
    for (const docSnap of snapshot.docs) {
      await deleteDoc(doc(db, collectionName, docSnap.id));
      deleted++;
    }
    
    return deleted;
  } catch (error) {
    console.error(`❌ Error deleting from ${collectionName}:`, error);
    throw error;
  }
}

async function cleanupDatabase() {
  try {
    console.log('🔄 Starting database cleanup...\n');
    
    // Step 1: Find and keep only Ελπίδα Τσαι professional
    console.log('📋 Step 1: Finding Ελπίδα Τσαι professional...');
    const professionalsSnapshot = await getDocs(collection(db, 'professionals'));
    
    let keepProfessionalId = null;
    let professionalsToDelete = [];
    
    for (const docSnap of professionalsSnapshot.docs) {
      const data = docSnap.data();
      const name = data.name || '';
      const profession = data.profession || '';
      
      if (name.includes('Ελπίδα') && name.includes('Τσαι') && profession === 'Κηπουρός') {
        keepProfessionalId = docSnap.id;
        console.log(`✅ Found professional to keep: ${name} (ID: ${keepProfessionalId})`);
      } else {
        professionalsToDelete.push({ id: docSnap.id, name: name || 'Unknown' });
      }
    }
    
    if (!keepProfessionalId) {
      console.log('⚠️  Warning: Ελπίδα Τσαι not found. Proceeding to delete all professionals...');
    }
    
    // Step 2: Delete all other professionals
    console.log(`\n🗑️  Step 2: Deleting ${professionalsToDelete.length} professionals...`);
    let deletedProfessionals = 0;
    for (const prof of professionalsToDelete) {
      await deleteDoc(doc(db, 'professionals', prof.id));
      deletedProfessionals++;
      console.log(`   Deleted: ${prof.name}`);
    }
    console.log(`✅ Deleted ${deletedProfessionals} professionals\n`);
    
    // Step 3: Delete all appointments
    console.log('🗑️  Step 3: Deleting all appointments...');
    const deletedAppointments = await deleteAllFromCollection('appointments');
    console.log(`✅ Deleted ${deletedAppointments} appointments\n`);
    
    // Step 4: Delete all reviews
    console.log('🗑️  Step 4: Deleting all reviews...');
    const deletedReviews = await deleteAllFromCollection('reviews');
    console.log(`✅ Deleted ${deletedReviews} reviews\n`);
    
    // Step 5: Delete all professional recommendations
    console.log('🗑️  Step 5: Deleting all professional recommendations...');
    const deletedRecommendations = await deleteAllFromCollection('professionalRecommendations');
    console.log(`✅ Deleted ${deletedRecommendations} professional recommendations\n`);
    
    // Step 6: Delete all friend requests
    console.log('🗑️  Step 6: Deleting all friend requests...');
    const deletedFriendRequests = await deleteAllFromCollection('friendRequests');
    console.log(`✅ Deleted ${deletedFriendRequests} friend requests\n`);
    
    // Step 7: Delete all friend relationships
    console.log('🗑️  Step 7: Deleting all friend relationships...');
    const deletedFriends = await deleteAllFromCollection('friendRelationships');
    console.log(`✅ Deleted ${deletedFriends} friend relationships\n`);
    
    // Summary
    console.log('📊 Cleanup Summary:');
    console.log(`   - Professionals kept: ${keepProfessionalId ? 1 : 0}`);
    console.log(`   - Professionals deleted: ${deletedProfessionals}`);
    console.log(`   - Appointments deleted: ${deletedAppointments}`);
    console.log(`   - Reviews deleted: ${deletedReviews}`);
    console.log(`   - Recommendations deleted: ${deletedRecommendations}`);
    console.log(`   - Friend requests deleted: ${deletedFriendRequests}`);
    console.log(`   - Friend relationships deleted: ${deletedFriends}`);
    
    console.log('\n✅ Database cleanup complete!');
    console.log('🎯 Database is now clean and ready for testing');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  }
}

async function main() {
  try {
    await cleanupDatabase();
    process.exit(0);
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

main();

