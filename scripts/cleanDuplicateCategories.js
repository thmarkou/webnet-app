/**
 * Script to clean duplicate categories from Firestore
 * Run: node scripts/cleanDuplicateCategories.js
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, deleteDoc, doc, query, orderBy } = require('firebase/firestore');

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

async function cleanDuplicateCategories() {
  try {
    console.log('🔄 Cleaning duplicate categories from Firestore...\n');
    
    // Get all categories
    const categoriesSnapshot = await getDocs(query(collection(db, 'categories'), orderBy('name', 'asc')));
    const categories = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    console.log(`📦 Found ${categories.length} categories total`);
    
    // Group by name
    const nameGroups = {};
    categories.forEach(cat => {
      if (!nameGroups[cat.name]) {
        nameGroups[cat.name] = [];
      }
      nameGroups[cat.name].push(cat);
    });
    
    // Find duplicates
    let duplicatesFound = 0;
    let duplicatesDeleted = 0;
    
    for (const [name, group] of Object.entries(nameGroups)) {
      if (group.length > 1) {
        duplicatesFound++;
        console.log(`\n⚠️ Found ${group.length} entries with name "${name}":`);
        
        // Keep the first one (oldest), delete the rest
        const toKeep = group[0];
        const toDelete = group.slice(1);
        
        console.log(`   ✅ Keeping: ${toKeep.id} (created: ${toKeep.createdAt?.toDate?.() || 'unknown'})`);
        
        for (const duplicate of toDelete) {
          try {
            await deleteDoc(doc(db, 'categories', duplicate.id));
            console.log(`   🗑️  Deleted: ${duplicate.id}`);
            duplicatesDeleted++;
          } catch (error) {
            console.error(`   ❌ Error deleting ${duplicate.id}:`, error.message);
          }
        }
      }
    }
    
    if (duplicatesFound === 0) {
      console.log('\n✅ No duplicates found! All categories are unique.');
    } else {
      console.log(`\n✅ Cleanup complete:`);
      console.log(`   - ${duplicatesFound} duplicate groups found`);
      console.log(`   - ${duplicatesDeleted} duplicate entries deleted`);
    }
  } catch (error) {
    console.error('❌ Error cleaning duplicates:', error);
    throw error;
  }
}

async function main() {
  try {
    await cleanDuplicateCategories();
    process.exit(0);
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

main();

