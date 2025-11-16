# 🔒 Firestore Security Rules - Deployment Guide

## ✅ Τι Έγινε

Το αρχείο `firestore.rules` ενημερώθηκε με **πλήρεις κανόνες ασφαλείας** που καλύπτουν όλες τις collections της εφαρμογής.

## 📋 Collections που Προστατεύονται

1. ✅ **users** - Μόνο ο owner μπορεί να update, admin μόνο delete
2. ✅ **professionals** - Public read, authenticated create/update, owner/admin delete
3. ✅ **appointments** - Μόνο involved parties (userId/professionalId)
4. ✅ **reviews** - Public read, owner update/delete
5. ✅ **notifications** - Μόνο owner
6. ✅ **messages** - Μόνο sender/recipient
7. ✅ **chatRooms** - Μόνο participants
8. ✅ **friendRequests** - Μόνο sender/recipient
9. ✅ **friendRelationships** - Μόνο participants
10. ✅ **professionalRecommendations** - Public read, owner update/delete
11. ✅ **categories** - Public read, authenticated write
12. ✅ **cities** - Public read, authenticated write
13. ✅ **subscriptions** - Μόνο owner
14. ✅ **admin** - Μόνο admin users

## 🚀 Πώς να Deploy-άρετε τους Κανόνες

### Μέθοδος 1: Firebase Console (Συνιστάται - Πιο Απλή)

1. **Ανοίξτε το Firebase Console:**
   - Πηγαίνετε στο: https://console.firebase.google.com/
   - Επιλέξτε το project σας: `webnetapp-dev`

2. **Πηγαίνετε στο Firestore Database:**
   - Στο αριστερό menu, κάντε click στο **"Firestore Database"**
   - Κάντε click στο tab **"Rules"** (στο πάνω μέρος)

3. **Αντιγράψτε τους Κανόνες:**
   - Ανοίξτε το αρχείο `firestore.rules` από το project σας
   - Αντιγράψτε **όλο το περιεχόμενο**
   - Επικολλήστε το στο Firebase Console Rules editor

4. **Publish:**
   - Κάντε click στο κουμπί **"Publish"** (πάνω δεξιά)
   - Περιμένετε 1-2 λεπτά για να εφαρμοστούν οι κανόνες

### Μέθοδος 2: Firebase CLI (Αν έχετε εγκατεστημένο)

```bash
# 1. Εγκαταστήστε το Firebase CLI (αν δεν το έχετε)
npm install -g firebase-tools

# 2. Login στο Firebase
firebase login

# 3. Initialize Firebase (μόνο την πρώτη φορά)
firebase init firestore

# 4. Deploy τους κανόνες
firebase deploy --only firestore:rules
```

## ⚠️ Σημαντικά Σημεία

### Admin Detection
Οι κανόνες χρησιμοποιούν το `role` field από το user document για να προσδιορίσουν admin:
```javascript
function isAdmin() {
  return isAuthenticated() && 
         exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
}
```

**Βεβαιωθείτε ότι:**
- Οι admin users έχουν `role: 'admin'` στο user document τους
- Το field `role` υπάρχει και είναι string

### Data Ownership
- **Professionals**: Μόνο ο creator (`createdBy` field) μπορεί να διαγράψει
- **Appointments**: Μόνο ο user ή ο professional που είναι involved
- **Messages**: Μόνο ο sender ή recipient
- **Reviews**: Μόνο ο creator μπορεί να update/delete

### Default Deny
Οι κανόνες ακολουθούν **"deny by default"** - αν μια collection δεν καλύπτεται, θα είναι blocked.

## 🧪 Testing

Μετά το deployment, ελέγξτε ότι:

1. ✅ Users μπορούν να login και να βλέπουν τα δικά τους δεδομένα
2. ✅ Professionals μπορούν να δημιουργηθούν από authenticated users
3. ✅ Appointments μπορούν να δημιουργηθούν μόνο από τον owner
4. ✅ Messages μπορούν να διαβαστούν μόνο από sender/recipient
5. ✅ Admin users μπορούν να διαγράψουν οποιοδήποτε user/professional

## 🔍 Troubleshooting

### "Permission denied" errors
- Ελέγξτε ότι ο user είναι authenticated (`request.auth != null`)
- Ελέγξτε ότι ο user έχει το σωστό `role` field (για admin operations)
- Ελέγξτε ότι τα fields που χρησιμοποιούνται στους κανόνες (π.χ. `createdBy`, `userId`) υπάρχουν στα documents

### Rules not updating
- Περιμένετε 1-2 λεπτά μετά το publish
- Κάντε hard refresh στο Firebase Console
- Ελέγξτε τα Firebase Console logs για errors

### Admin not working
- Ελέγξτε ότι το user document έχει `role: 'admin'`
- Ελέγξτε ότι το user document υπάρχει και είναι accessible

## 📝 Notes

- Οι κανόνες είναι **production-ready** και ακολουθούν best practices
- Όλες οι collections καλύπτονται
- Security by default (deny all, allow specific)
- Owner-based access control για sensitive data
- Admin override για management operations

---

**Status:** ✅ Rules Updated - Ready for Deployment  
**Last Updated:** November 1, 2025

