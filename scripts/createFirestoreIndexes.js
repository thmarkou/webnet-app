/**
 * Script to create Firebase Firestore composite indexes
 * 
 * Run this to get the Firebase console URLs for creating indexes
 * The actual indexes must be created manually in Firebase Console
 */

const indexes = [
  {
    collection: 'appointments',
    fields: [
      { field: 'userId', order: 'ASCENDING' },
      { field: 'createdAt', order: 'DESCENDING' }
    ],
    description: 'Query appointments by userId ordered by createdAt'
  },
  {
    collection: 'appointments',
    fields: [
      { field: 'userId', order: 'ASCENDING' },
      { field: 'status', order: 'ASCENDING' },
      { field: 'createdAt', order: 'DESCENDING' }
    ],
    description: 'Query appointments by userId and status ordered by createdAt'
  },
  {
    collection: 'reviews',
    fields: [
      { field: 'userId', order: 'ASCENDING' },
      { field: 'createdAt', order: 'DESCENDING' }
    ],
    description: 'Query reviews by userId ordered by createdAt'
  },
  {
    collection: 'notifications',
    fields: [
      { field: 'userId', order: 'ASCENDING' },
      { field: 'createdAt', order: 'DESCENDING' }
    ],
    description: 'Query notifications by userId ordered by createdAt'
  }
];

console.log('📋 Firebase Firestore Composite Indexes Required:');
console.log('='.repeat(60));
console.log('\n');

indexes.forEach((index, idx) => {
  console.log(`${idx + 1}. Collection: ${index.collection}`);
  console.log(`   Fields: ${index.fields.map(f => `${f.field} (${f.order})`).join(', ')}`);
  console.log(`   Description: ${index.description}`);
  console.log('\n');
});

console.log('📝 Instructions:');
console.log('1. Go to Firebase Console: https://console.firebase.google.com');
console.log('2. Select project: webnetapp-dev');
console.log('3. Navigate to: Firestore Database → Indexes');
console.log('4. Click "Create Index"');
console.log('5. For each index above:');
console.log('   - Select the collection');
console.log('   - Add fields in order');
console.log('   - Set field order (Ascending/Descending)');
console.log('   - Click "Create"');
console.log('\n');

// Generate Firebase console URLs (these won't work directly, but show the format)
console.log('🔗 Alternative: Use Firebase CLI');
console.log('Run: firebase deploy --only firestore:indexes');
console.log('\n');

// Generate firestore.indexes.json format
const firestoreIndexes = {
  indexes: indexes.map(index => ({
    collectionGroup: index.collection,
    queryScope: 'COLLECTION',
    fields: index.fields.map(f => ({
      fieldPath: f.field,
      order: f.order
    }))
  }))
};

console.log('💾 Save this as firestore.indexes.json:');
console.log(JSON.stringify(firestoreIndexes, null, 2));
console.log('\n');
console.log('✅ Then run: firebase deploy --only firestore:indexes');

