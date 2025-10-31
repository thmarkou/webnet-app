/**
 * Script to check what collections exist in Firestore
 * Run: node scripts/checkFirestoreCollections.js
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, listCollections } = require('firebase/firestore');

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

async function checkCollections() {
  try {
    console.log('🔍 Checking Firestore collections...\n');
    
    // Note: listCollections requires admin SDK, so we'll try to query each collection instead
    const collectionsToCheck = [
      'reviews',
      'friendRequests',
      'friendRelationships',
      'users',
      'professionals',
      'appointments',
      'categories',
      'cities',
      'notifications',
      'professionalRecommendations'
    ];
    
    const { collection, getDocs, query, limit } = require('firebase/firestore');
    
    console.log('📋 Checking collections:\n');
    
    for (const collectionName of collectionsToCheck) {
      try {
        const q = query(collection(db, collectionName), limit(1));
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
          console.log(`❌ ${collectionName}: EXISTS but EMPTY (no documents)`);
        } else {
          const count = await getDocs(collection(db, collectionName));
          let docCount = 0;
          count.forEach(() => docCount++);
          console.log(`✅ ${collectionName}: EXISTS with ${docCount} document(s)`);
        }
      } catch (error) {
        if (error.code === 'permission-denied' || error.message?.includes('permission')) {
          console.log(`⚠️  ${collectionName}: EXISTS (permission to count denied, but collection exists)`);
        } else {
          console.log(`❌ ${collectionName}: NOT FOUND or ERROR - ${error.message}`);
        }
      }
    }
    
    console.log('\n✅ Collection check complete');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

async function main() {
  try {
    await checkCollections();
    process.exit(0);
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

main();

