/**
 * Script to seed demo users into Firestore
 * Run: node scripts/seedDemoUsers.js
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, query, where } = require('firebase/firestore');

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

const DEMO_USERS = [
  {
    email: 'user@demo.com',
    password: 'demo',
    name: 'Μιχάλης Σκαλτσουνάκης',
    phone: '+30 210 1234567',
    role: 'user',
    firstName: 'Μιχάλης',
    lastName: 'Σκαλτσουνάκης',
    notifications: true,
  },
  {
    email: 'pro@demo.com',
    password: 'demo',
    name: 'Χάρης Σκαλτσουνάκης',
    phone: '+30 210 1234567',
    role: 'professional',
    profession: 'Ασφαλιστής',
    firstName: 'Χάρης',
    lastName: 'Σκαλτσουνάκης',
    notifications: true,
  },
  {
    email: 'admin@demo.com',
    password: 'demo',
    name: 'Fabio Marcoulini',
    phone: '+30 210 1234567',
    role: 'admin',
    profession: 'Chief Technology Officer',
    firstName: 'Fabio',
    lastName: 'Marcoulini',
    notifications: true,
  },
];

async function seedDemoUsers() {
  try {
    console.log('🔄 Seeding demo users to Firestore...\n');
    
    let added = 0;
    let skipped = 0;
    
    for (const demoUser of DEMO_USERS) {
      // Check if user already exists
      const existingQuery = query(
        collection(db, 'users'),
        where('email', '==', demoUser.email)
      );
      const existingSnapshot = await getDocs(existingQuery);
      
      if (!existingSnapshot.empty) {
        console.log(`⏭️  Skipping ${demoUser.email} (already exists)`);
        skipped++;
        continue;
      }
      
      // Add to Firestore
      await addDoc(collection(db, 'users'), {
        ...demoUser,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      console.log(`✅ Added ${demoUser.name} (${demoUser.email}) to Firestore`);
      added++;
    }
    
    console.log(`\n✅ Seeding complete: ${added} added, ${skipped} skipped`);
    console.log('📝 Demo users are now in Firestore and can be used for login');
  } catch (error) {
    console.error('❌ Error seeding demo users:', error);
    throw error;
  }
}

async function main() {
  try {
    await seedDemoUsers();
    process.exit(0);
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

main();

