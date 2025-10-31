/**
 * Script to cleanup all users except 3 specific ones and ensure they exist
 * Run: node scripts/cleanupAndSetupUsers.js
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, query, where, updateDoc } = require('firebase/firestore');

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

const REQUIRED_USERS = [
  {
    email: 'theofanis.markou@gmail.com',
    password: 'demo', // You should change this!
    name: 'Αριστείδης Μάρκου',
    firstName: 'Αριστείδης',
    lastName: 'Μάρκου',
    phone: '+30 210 1234567',
    role: 'user',
    notifications: true,
  },
  {
    email: 'xarilaos.skaltsounakis@gmail.com',
    password: 'demo', // You should change this!
    name: 'Χάρης Σκαλτσουνάκης',
    firstName: 'Χάρης',
    lastName: 'Σκαλτσουνάκης',
    phone: '+30 210 1234567',
    role: 'professional',
    profession: 'Ασφαλιστής',
    notifications: true,
  },
  {
    email: 'fabiomarcoulini@gmail.com',
    password: 'demo', // You should change this!
    name: 'Fabio Marcoulini',
    firstName: 'Fabio',
    lastName: 'Marcoulini',
    phone: '+30 210 1234567',
    role: 'admin',
    profession: 'Chief Technology Officer',
    notifications: true,
  },
];

async function cleanupAndSetupUsers() {
  try {
    console.log('🔄 Starting user cleanup and setup...\n');
    
    // Get all users
    const allUsersSnapshot = await getDocs(collection(db, 'users'));
    const requiredEmails = REQUIRED_USERS.map(u => u.email);
    
    console.log(`📦 Found ${allUsersSnapshot.docs.length} users in Firestore\n`);
    
    let deleted = 0;
    let kept = 0;
    
    // Delete all users except the required ones
    for (const userDoc of allUsersSnapshot.docs) {
      const userData = userDoc.data();
      const email = userData.email;
      
      if (requiredEmails.includes(email)) {
        console.log(`✅ Keeping: ${userData.name} (${email})`);
        kept++;
      } else {
        console.log(`🗑️  Deleting: ${userData.name || 'Unknown'} (${email})`);
        await deleteDoc(doc(db, 'users', userDoc.id));
        deleted++;
      }
    }
    
    console.log(`\n📊 Cleanup: ${deleted} deleted, ${kept} kept\n`);
    
    // Now ensure all required users exist with correct data
    console.log('🔄 Setting up required users...\n');
    
    for (const requiredUser of REQUIRED_USERS) {
      // Check if user exists
      const existingQuery = query(
        collection(db, 'users'),
        where('email', '==', requiredUser.email)
      );
      const existingSnapshot = await getDocs(existingQuery);
      
      if (!existingSnapshot.empty) {
        // Update existing user
        const userDoc = existingSnapshot.docs[0];
        const existingData = userDoc.data();
        
        // Check if update is needed
        const needsUpdate = 
          existingData.name !== requiredUser.name ||
          existingData.role !== requiredUser.role ||
          !existingData.password ||
          existingData.password !== requiredUser.password;
        
        if (needsUpdate) {
          await updateDoc(doc(db, 'users', userDoc.id), {
            ...requiredUser,
            updatedAt: new Date(),
          });
          console.log(`✅ Updated: ${requiredUser.name} (${requiredUser.email})`);
        } else {
          console.log(`⏭️  Already correct: ${requiredUser.name} (${requiredUser.email})`);
        }
      } else {
        // Create new user
        await addDoc(collection(db, 'users'), {
          ...requiredUser,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log(`✅ Created: ${requiredUser.name} (${requiredUser.email})`);
      }
    }
    
    console.log('\n✅ Setup complete!');
    console.log('\n📝 Final users in Firestore:');
    const finalSnapshot = await getDocs(collection(db, 'users'));
    finalSnapshot.forEach(doc => {
      const data = doc.data();
      console.log(`   - ${data.name} (${data.email}) - ${data.role}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

async function main() {
  try {
    await cleanupAndSetupUsers();
    process.exit(0);
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

main();

