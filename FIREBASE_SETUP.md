# 🔥 Firebase Setup Guide

## Πώς να βρεις τα Firebase Credentials

### Βήμα 1: Άνοιξε το Firebase Console
1. Πήγαινε στο: https://console.firebase.google.com
2. Επίλεξε το project: **webnetapp-dev**

### Βήμα 2: Βρες τα Configuration Values
1. Κάνε click στο ⚙️ **Settings** (Ρυθμίσεις)
2. Κάνε scroll κάτω στο "Your apps"
3. Αν δεν υπάρχει Web app:
   - Κάνε click "Add app" → "Web" (</> icon)
   - Όνομα: `webnetapp`
   - Κάνε click "Register app"
4. Αν υπάρχει ήδη, κάνε click στο Web app

### Βήμα 3: Αντιγράψε τα Credentials
Θα δεις ένα config object που μοιάζει με:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "webnetapp-dev.firebaseapp.com",
  projectId: "webnetapp-dev",
  storageBucket: "webnetapp-dev.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
```

### Βήμα 4: Δημιούργησε το .env file
Στο root directory του project, δημιούργησε ένα αρχείο `.env`:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy... (το apiKey από πάνω)
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=webnetapp-dev.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=webnetapp-dev
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=webnetapp-dev.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123def456
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Βήμα 5: Ενεργοποίησε Firestore
1. Στο Firebase Console, πήγαινε στο "Firestore Database"
2. Αν δεν έχεις δημιουργήσει βάση:
   - Κάνε "Create database"
   - Επίλεξε "Start in test mode" (για development)
   - Επίλεξε location (π.χ. `europe-west1` για Ελλάδα)

## ✅ Τι άλλαξε

- ✅ Όλοι οι επαγγελματίες αποθηκεύονται στο Firestore (κοινή βάση)
- ✅ Όλοι οι χρήστες βλέπουν τους ίδιους επαγγελματίες
- ✅ Create, Read, Update, Delete λειτουργούν με Firestore

## ⚠️ Σημαντικό

Μετά την προσθήκη του `.env` file, **restart το Expo**:
```bash
npm start -- --clear
```

