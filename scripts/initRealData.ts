import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, writeBatch } from 'firebase/firestore';

// Firebase configuration - replace with your actual config
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

// Real data for the app
const categories = [
  { id: 'plumber', name: 'Υδραυλικός', icon: '🔧', description: 'Επισκευές υδραυλικών, σωλήνες, μπάνια' },
  { id: 'electrician', name: 'Ηλεκτρολόγος', icon: '⚡', description: 'Ηλεκτρικές εγκαταστάσεις, επισκευές' },
  { id: 'painter', name: 'Ελαιοχρωματιστής', icon: '🎨', description: 'Βάψιμο σπιτιών, εξωτερικά, εσωτερικά' },
  { id: 'gardener', name: 'Κηπουρός', icon: '🌱', description: 'Κηπουρικές εργασίες, φύτευση, κλάδεμα' },
  { id: 'carpenter', name: 'Ξυλουργός', icon: '🔨', description: 'Ξύλινα έπιπλα, επισκευές, κατασκευές' },
  { id: 'hvac', name: 'Τεχνικός Θέρμανσης', icon: '🌡️', description: 'Συστήματα θέρμανσης και κλιματισμού' },
  { id: 'cleaning', name: 'Καθαρισμός', icon: '✨', description: 'Καθαριστικές υπηρεσίες σπιτιών και γραφείων' },
  { id: 'security', name: 'Ασφάλεια', icon: '🔒', description: 'Συστήματα ασφαλείας, κάμερες, αλαρμ' },
  { id: 'appliance', name: 'Συσκευές', icon: '🔌', description: 'Επισκευές ηλεκτρικών συσκευών' },
  { id: 'roofing', name: 'Στέγες', icon: '🏠', description: 'Επισκευές και κατασκευές στέγων' }
];

const cities = [
  { id: 'athens', name: 'Αθήνα', country: 'Ελλάδα', region: 'Αττική' },
  { id: 'thessaloniki', name: 'Θεσσαλονίκη', country: 'Ελλάδα', region: 'Κεντρική Μακεδονία' },
  { id: 'patras', name: 'Πάτρα', country: 'Ελλάδα', region: 'Δυτική Ελλάδα' },
  { id: 'heraklion', name: 'Ηράκλειο', country: 'Ελλάδα', region: 'Κρήτη' },
  { id: 'larissa', name: 'Λάρισα', country: 'Ελλάδα', region: 'Θεσσαλία' },
  { id: 'volos', name: 'Βόλος', country: 'Ελλάδα', region: 'Θεσσαλία' },
  { id: 'ioannina', name: 'Ιωάννινα', country: 'Ελλάδα', region: 'Ήπειρος' },
  { id: 'kavala', name: 'Καβάλα', country: 'Ελλάδα', region: 'Ανατολική Μακεδονία' },
  { id: 'nicosia', name: 'Λευκωσία', country: 'Κύπρος', region: 'Λευκωσία' },
  { id: 'limassol', name: 'Λεμεσός', country: 'Κύπρος', region: 'Λεμεσός' }
];

const realUsers = [
  {
    id: 'user1',
    email: 'user@demo.com',
    name: 'Μιχάλης Σκαλτσουνάκης',
    role: 'user',
    phone: '+30 210 123 4567',
    location: 'Αθήνα',
    occupation: 'Προγραμματιστής',
    isVerified: true,
    avatar: '👨‍💻',
    joinedDate: new Date('2023-01-15'),
    preferences: {
      notifications: true,
      language: 'el'
    }
  },
  {
    id: 'user2',
    email: 'maria@demo.com',
    name: 'Μαρία Παπαδοπούλου',
    role: 'user',
    phone: '+30 210 987 6543',
    location: 'Θεσσαλονίκη',
    occupation: 'Δασκάλα',
    isVerified: true,
    avatar: '👩‍🏫',
    joinedDate: new Date('2023-02-20'),
    preferences: {
      notifications: true,
      language: 'el'
    }
  },
  {
    id: 'user3',
    email: 'alex@demo.com',
    name: 'Αλέξης Ιωάννου',
    role: 'user',
    phone: '+30 210 555 1234',
    location: 'Πάτρα',
    occupation: 'Μηχανικός',
    isVerified: true,
    avatar: '👨‍🔧',
    joinedDate: new Date('2023-03-10'),
    preferences: {
      notifications: true,
      language: 'el'
    }
  }
];

const realProfessionals = [
  {
    id: 'pro1',
    email: 'pro@demo.com',
    name: 'Χάρης Σκαλτσουνάκης',
    role: 'professional',
    phone: '+30 210 111 2222',
    location: 'Αθήνα',
    profession: 'Ασφαλιστής',
    businessName: 'Σκαλτσουνάκης Ασφαλιστική',
    rating: 4.8,
    reviewsCount: 25,
    isVerified: true,
    avatar: '👨‍💼',
    joinedDate: new Date('2023-01-01'),
    services: ['Ασφάλειες Αυτοκινήτου', 'Ασφάλειες Σπιτιού', 'Ασφάλειες Υγείας'],
    description: 'Επαγγελματίας ασφαλιστής με 15+ χρόνια εμπειρίας. Εξειδικευμένος σε όλους τους τομείς ασφαλειών.',
    website: 'https://skaltsounakis-insurance.gr',
    workingHours: '09:00-17:00',
    languages: ['Ελληνικά', 'Αγγλικά']
  },
  {
    id: 'pro2',
    email: 'admin@demo.com',
    name: 'Θεοφάης Μάρκου',
    role: 'admin',
    phone: '+30 210 333 4444',
    location: 'Αθήνα',
    profession: 'Chief Technology Officer',
    businessName: 'WebNet Solutions',
    rating: 5.0,
    reviewsCount: 1,
    isVerified: true,
    avatar: '👨‍💻',
    joinedDate: new Date('2023-01-01'),
    services: ['Τεχνολογικές Λύσεις', 'Διαχείριση Συστημάτων'],
    description: 'CTO και ιδρυτής της WebNet Solutions. Εξειδικευμένος σε τεχνολογικές λύσεις και διαχείριση συστημάτων.',
    website: 'https://webnet-solutions.gr',
    workingHours: '09:00-18:00',
    languages: ['Ελληνικά', 'Αγγλικά', 'Γερμανικά']
  }
];

const realAppointments = [
  {
    id: 'apt1',
    userId: 'user1',
    professionalId: 'pro1',
    date: '2024-01-15',
    time: '10:00',
    service: 'Ασφάλεια Αυτοκινήτου',
    status: 'confirmed',
    notes: 'Ανανέωση ασφάλειας αυτοκινήτου',
    duration: 60,
    price: 150,
    location: 'Αθήνα',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: 'apt2',
    userId: 'user2',
    professionalId: 'pro1',
    date: '2024-01-20',
    time: '14:00',
    service: 'Ασφάλεια Σπιτιού',
    status: 'pending',
    notes: 'Νέα ασφάλεια για το σπίτι',
    duration: 90,
    price: 200,
    location: 'Θεσσαλονίκη',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12')
  }
];

const realReviews = [
  {
    id: 'rev1',
    userId: 'user1',
    professionalId: 'pro1',
    rating: 5,
    comment: 'Εξαιρετική εξυπηρέτηση! Πολύ επαγγελματικός και γρήγορος.',
    createdAt: new Date('2024-01-16'),
    helpful: 3
  },
  {
    id: 'rev2',
    userId: 'user2',
    professionalId: 'pro1',
    rating: 4,
    comment: 'Καλή εξυπηρέτηση, αλλά λίγο αργή η διαδικασία.',
    createdAt: new Date('2024-01-18'),
    helpful: 1
  }
];

const realNotifications = [
  {
    id: 'notif1',
    userId: 'user1',
    type: 'appointment_confirmed',
    title: 'Ραντεβού Επιβεβαιώθηκε',
    message: 'Το ραντεβού σας με τον Χάρη Σκαλτσουνάκη επιβεβαιώθηκε για 15/01/2024 στις 10:00',
    isRead: false,
    createdAt: new Date('2024-01-10T10:00:00Z')
  },
  {
    id: 'notif2',
    userId: 'user2',
    type: 'appointment_reminder',
    title: 'Υπενθύμιση Ραντεβού',
    message: 'Έχετε ραντεβού αύριο με τον Χάρη Σκαλτσουνάκη στις 14:00',
    isRead: false,
    createdAt: new Date('2024-01-19T09:00:00Z')
  }
];

async function initializeRealData() {
  try {
    console.log('🚀 Initializing Firebase with real data...');
    
    const batch = writeBatch(db);
    
    // 1. Categories
    console.log('📂 Creating categories...');
    for (const category of categories) {
      const categoryRef = doc(db, 'categories', category.id);
      batch.set(categoryRef, {
        ...category,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    // 2. Cities
    console.log('🏙️ Creating cities...');
    for (const city of cities) {
      const cityRef = doc(db, 'cities', city.id);
      batch.set(cityRef, {
        ...city,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    // 3. Users
    console.log('👥 Creating users...');
    for (const user of realUsers) {
      const userRef = doc(db, 'users', user.id);
      batch.set(userRef, {
        ...user,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    // 4. Professionals
    console.log('👨‍💼 Creating professionals...');
    for (const professional of realProfessionals) {
      const professionalRef = doc(db, 'professionals', professional.id);
      batch.set(professionalRef, {
        ...professional,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    // 5. Appointments
    console.log('📅 Creating appointments...');
    for (const appointment of realAppointments) {
      const appointmentRef = doc(db, 'appointments', appointment.id);
      batch.set(appointmentRef, {
        ...appointment,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    // 6. Reviews
    console.log('⭐ Creating reviews...');
    for (const review of realReviews) {
      const reviewRef = doc(db, 'reviews', review.id);
      batch.set(reviewRef, {
        ...review,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    // 7. Notifications
    console.log('🔔 Creating notifications...');
    for (const notification of realNotifications) {
      const notificationRef = doc(db, 'notifications', notification.id);
      batch.set(notificationRef, {
        ...notification,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    // Commit all changes
    await batch.commit();
    
    console.log('\n🎉 Real data initialization completed successfully!');
    console.log('📊 Summary:');
    console.log(`- ${categories.length} categories created`);
    console.log(`- ${cities.length} cities created`);
    console.log(`- ${realUsers.length} users created`);
    console.log(`- ${realProfessionals.length} professionals created`);
    console.log(`- ${realAppointments.length} appointments created`);
    console.log(`- ${realReviews.length} reviews created`);
    console.log(`- ${realNotifications.length} notifications created`);
    console.log('\n✅ Your app now has real data!');
    
  } catch (error) {
    console.error('❌ Error initializing real data:', error);
    throw error;
  }
}

// Run the initialization
initializeRealData()
  .then(() => {
    console.log('✅ Database initialization completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  });
