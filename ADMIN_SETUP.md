# Admin Setup Guide

## Admin Code Configuration

Το admin code είναι ρυθμισμένο στο file `src/services/auth/adminAuth.ts`:

```typescript
const ADMIN_SECRET_CODE = process.env.EXPO_PUBLIC_ADMIN_CODE || 'WEBNET_ADMIN_2024_SECRET';
```

**⚠️ ΣΗΜΑΝΤΙΚΟ:** Αλλάξε το default code πριν το deployment!

### Πώς να αλλάξετε τον Admin Code:

1. **Μέθοδος 1: Environment Variable (Συνιστάται)**
   - Δημιουργήστε `.env` file στο root του project
   - Προσθέστε: `EXPO_PUBLIC_ADMIN_CODE=your_secret_admin_code_here`
   - Το `.env` file πρέπει να είναι στο `.gitignore`

2. **Μέθοδος 2: Direct Change**
   - Επεξεργαστείτε `src/services/auth/adminAuth.ts`
   - Αλλάξτε το `ADMIN_SECRET_CODE` constant

## Firebase Security Rules

Το file `firestore.rules` περιέχει τους κανόνες ασφαλείας. Για να τα deploy-άρετε:

```bash
firebase deploy --only firestore:rules
```

### Προστασία από Διαγραφή:

- **categories**: Μόνο admin μπορεί να διαγράψει
- **cities**: Μόνο admin μπορεί να διαγράψει  
- **professionals**: Μόνο admin μπορεί να διαγράψει
- **users**: Μόνο admin μπορεί να διαγράψει

### Προστασία από Malicious Operations:

1. **Firestore Security Rules** - Προστατεύουν την βάση στο Firebase level
2. **Admin Authentication** - Προστατεύει sensitive operations στο app level
3. **One User Per Installation** - Κάθε installation έχει ένα μοναδικό user ID

## One User Per Installation

Κάθε installation της εφαρμογής θα έχει έναν μοναδικό user:
- Το app δημιουργεί ένα `installationId` που αποθηκεύεται local
- Κάθε user registration συνδέεται με το `installationId`
- Αυτό εμποδίζει multiple registrations από την ίδια installation

## Testing Admin Functions

Για να δοκιμάσετε admin functions:

1. Login ως normal user
2. Προσπαθήστε να διαγράψετε professional/city/category
3. Θα εμφανιστεί admin authentication prompt
4. Εισάγετε τον admin code
5. Η λειτουργία θα εκτελεστεί

## Security Best Practices

1. **Never commit admin code** στο git
2. **Use environment variables** για secrets
3. **Deploy Firestore Rules** πριν το production
4. **Monitor admin operations** στο Firebase Console
5. **Rotate admin code** περιοδικά

