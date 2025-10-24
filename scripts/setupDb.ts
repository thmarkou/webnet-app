import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const categories = [
  { id: '1', name: 'Υδραυλικός', icon: 'wrench', order: 1 },
  { id: '2', name: 'Ηλεκτρολόγος', icon: 'flash', order: 2 },
  { id: '3', name: 'Ελαιοχρωματιστής', icon: 'brush', order: 3 },
  { id: '4', name: 'Κηπουρός', icon: 'leaf', order: 4 },
  { id: '5', name: 'Ξυλουργός', icon: 'hammer', order: 5 },
];

const countries = [
  { id: '1', name: 'Ελλάδα', code: 'GR' },
  { id: '2', name: 'Κύπρος', code: 'CY' },
];

const cities = [
  { id: '1', name: 'Αθήνα', countryId: '1' },
  { id: '2', name: 'Θεσσαλονίκη', countryId: '1' },
  { id: '3', name: 'Πάτρα', countryId: '1' },
  { id: '4', name: 'Ηράκλειο', countryId: '1' },
  { id: '5', name: 'Λευκωσία', countryId: '2' },
  { id: '6', name: 'Λεμεσός', countryId: '2' },
];

async function setupDatabase() {
  try {
    // Categories
    for (const category of categories) {
      await setDoc(doc(db, 'categories', category.id), {
        ...category,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    console.log('Categories created');

    // Countries
    for (const country of countries) {
      await setDoc(doc(db, 'countries', country.id), {
        ...country,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    console.log('Countries created');

    // Cities
    for (const city of cities) {
      await setDoc(doc(db, 'cities', city.id), {
        ...city,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    console.log('Cities created');

    console.log('Database setup completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();
