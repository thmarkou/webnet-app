/**
 * Script to create placeholder documents in empty collections
 * This makes them visible in Firestore Console
 * Run: node scripts/createEmptyCollections.js
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, query, limit, Timestamp } = require('firebase/firestore');

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

async function createEmptyCollections() {
  try {
    console.log('🔄 Creating placeholder documents in empty collections...\n');
    
    const collections = [
      {
        name: 'reviews',
        placeholder: {
          note: 'Collection for professional reviews',
          description: 'This collection stores reviews/ratings for professionals',
          createdAt: Timestamp.now(),
          placeholder: true
        }
      },
      {
        name: 'friendRequests',
        placeholder: {
          note: 'Collection for friend requests',
          description: 'This collection stores pending friend requests between users',
          createdAt: Timestamp.now(),
          placeholder: true
        }
      },
      {
        name: 'friendRelationships',
        placeholder: {
          note: 'Collection for accepted friend relationships',
          description: 'This collection stores accepted friend relationships',
          createdAt: Timestamp.now(),
          placeholder: true
        }
      },
      {
        name: 'appointments',
        placeholder: {
          note: 'Collection for appointments',
          description: 'This collection stores appointments between users and professionals',
          createdAt: Timestamp.now(),
          placeholder: true
        }
      },
      {
        name: 'notifications',
        placeholder: {
          note: 'Collection for notifications',
          description: 'This collection stores user notifications',
          createdAt: Timestamp.now(),
          placeholder: true
        }
      },
      {
        name: 'professionalRecommendations',
        placeholder: {
          note: 'Collection for professional recommendations',
          description: 'This collection stores friend recommendations for professionals',
          createdAt: Timestamp.now(),
          placeholder: true
        }
      }
    ];
    
    for (const coll of collections) {
      try {
        // Check if collection has any documents
        const q = query(collection(db, coll.name), limit(1));
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
          // Collection is empty, add placeholder
          const docRef = await addDoc(collection(db, coll.name), coll.placeholder);
          console.log(`✅ Created placeholder in "${coll.name}" collection (ID: ${docRef.id})`);
          console.log(`   You can delete this placeholder document after verifying the collection exists\n`);
        } else {
          console.log(`⏭️  "${coll.name}": Already has documents, skipping\n`);
        }
      } catch (error) {
        console.error(`❌ Error with "${coll.name}":`, error.message);
      }
    }
    
    console.log('✅ Done! All collections should now be visible in Firestore Console');
    console.log('📝 Note: You can delete the placeholder documents after verifying');
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

async function main() {
  try {
    await createEmptyCollections();
    process.exit(0);
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

main();

