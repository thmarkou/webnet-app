import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "your-api-key",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "your-app-id"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface DatabaseStats {
  users: number;
  professionals: number;
  appointments: number;
  reviews: number;
  notifications: number;
  categories: number;
  cities: number;
  messages: number;
  friends: number;
}

async function validateDatabase() {
  try {
    console.log('🔍 Validating Firebase database...\n');
    
    const stats: DatabaseStats = {
      users: 0,
      professionals: 0,
      appointments: 0,
      reviews: 0,
      notifications: 0,
      categories: 0,
      cities: 0,
      messages: 0,
      friends: 0
    };
    
    // Check each collection
    const collections = [
      { name: 'users', key: 'users' as keyof DatabaseStats },
      { name: 'professionals', key: 'professionals' as keyof DatabaseStats },
      { name: 'appointments', key: 'appointments' as keyof DatabaseStats },
      { name: 'reviews', key: 'reviews' as keyof DatabaseStats },
      { name: 'notifications', key: 'notifications' as keyof DatabaseStats },
      { name: 'categories', key: 'categories' as keyof DatabaseStats },
      { name: 'cities', key: 'cities' as keyof DatabaseStats },
      { name: 'messages', key: 'messages' as keyof DatabaseStats },
      { name: 'friends', key: 'friends' as keyof DatabaseStats }
    ];
    
    for (const collection of collections) {
      try {
        const snapshot = await getDocs(collection(db, collection.name));
        stats[collection.key] = snapshot.size;
        console.log(`✅ ${collection.name}: ${snapshot.size} documents`);
      } catch (error) {
        console.log(`❌ ${collection.name}: Error accessing collection`);
        stats[collection.key] = 0;
      }
    }
    
    // Validate specific data
    console.log('\n🔍 Validating specific data...');
    
    // Check demo users
    const demoUsers = ['user1', 'user2', 'user3'];
    for (const userId of demoUsers) {
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log(`✅ Demo user ${userId}: ${userData.name} (${userData.role})`);
        } else {
          console.log(`❌ Demo user ${userId}: Not found`);
        }
      } catch (error) {
        console.log(`❌ Demo user ${userId}: Error accessing`);
      }
    }
    
    // Check demo professionals
    const demoProfessionals = ['pro1', 'pro2'];
    for (const proId of demoProfessionals) {
      try {
        const proDoc = await getDoc(doc(db, 'professionals', proId));
        if (proDoc.exists()) {
          const proData = proDoc.data();
          console.log(`✅ Demo professional ${proId}: ${proData.name} (${proData.profession})`);
        } else {
          console.log(`❌ Demo professional ${proId}: Not found`);
        }
      } catch (error) {
        console.log(`❌ Demo professional ${proId}: Error accessing`);
      }
    }
    
    // Summary
    console.log('\n📊 Database Summary:');
    console.log(`👥 Users: ${stats.users}`);
    console.log(`👨‍💼 Professionals: ${stats.professionals}`);
    console.log(`📅 Appointments: ${stats.appointments}`);
    console.log(`⭐ Reviews: ${stats.reviews}`);
    console.log(`🔔 Notifications: ${stats.notifications}`);
    console.log(`📂 Categories: ${stats.categories}`);
    console.log(`🏙️ Cities: ${stats.cities}`);
    console.log(`💬 Messages: ${stats.messages}`);
    console.log(`👫 Friends: ${stats.friends}`);
    
    // Validation results
    const totalDocuments = Object.values(stats).reduce((sum, count) => sum + count, 0);
    
    if (totalDocuments > 0) {
      console.log('\n✅ Database validation completed successfully!');
      console.log(`📈 Total documents: ${totalDocuments}`);
      
      if (stats.users >= 3 && stats.professionals >= 2) {
        console.log('🎉 Demo data is properly set up!');
      } else {
        console.log('⚠️ Demo data might be incomplete. Run initRealData.ts to populate.');
      }
    } else {
      console.log('\n❌ Database appears to be empty.');
      console.log('💡 Run the initialization script to populate with data.');
    }
    
  } catch (error) {
    console.error('❌ Database validation failed:', error);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Check your Firebase configuration');
    console.log('2. Verify your internet connection');
    console.log('3. Make sure Firebase project is active');
    console.log('4. Check Firebase security rules');
  }
}

// Run validation
validateDatabase()
  .then(() => {
    console.log('\n✅ Database validation completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Database validation failed:', error);
    process.exit(1);
  });
