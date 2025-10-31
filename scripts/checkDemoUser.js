/**
 * Script to check demo user in Firestore
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where, updateDoc, doc } = require('firebase/firestore');

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

async function checkAndFixDemoUser() {
  try {
    console.log('🔍 Checking user@demo.com in Firestore...\n');
    
    const q = query(collection(db, 'users'), where('email', '==', 'user@demo.com'));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log('❌ user@demo.com not found in Firestore');
      console.log('📝 Run: npm run seed:demo-users to add it');
      return;
    }
    
    for (const docSnap of snapshot.docs) {
      const userData = docSnap.data();
      console.log('📋 Current user data:');
      console.log(`   ID: ${docSnap.id}`);
      console.log(`   Name: ${userData.name || 'NOT SET'}`);
      console.log(`   Email: ${userData.email}`);
      console.log(`   Role: ${userData.role || 'NOT SET'}`);
      console.log(`   Password: ${userData.password ? 'SET' : 'NOT SET'}`);
      
      // Update if name is wrong or password is missing
      const needsUpdate = !userData.name || 
                         userData.name !== 'Μιχάλης Σκαλτσουνάκης' || 
                         !userData.password || 
                         userData.password !== 'demo';
      
      if (needsUpdate) {
        console.log('\n🔄 Updating user data...');
        await updateDoc(doc(db, 'users', docSnap.id), {
          name: 'Μιχάλης Σκαλτσουνάκης',
          firstName: 'Μιχάλης',
          lastName: 'Σκαλτσουνάκης',
          password: 'demo', // Add password
          phone: '+30 210 1234567',
          role: 'user',
          updatedAt: new Date(),
        });
        console.log('✅ User updated successfully');
      } else {
        console.log('\n✅ User data is correct');
      }
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkAndFixDemoUser().then(() => process.exit(0)).catch(() => process.exit(1));

