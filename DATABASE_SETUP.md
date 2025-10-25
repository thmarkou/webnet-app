# 🗄️ Database Setup Guide

This guide will help you set up the Firebase database with real data for the WebNetApp.

## 📋 Prerequisites

1. **Firebase Project**: Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. **Node.js**: Ensure Node.js is installed
3. **Environment Variables**: Set up your Firebase configuration

## 🔧 Firebase Configuration

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Enter project name: `webnet-app`
4. Enable Google Analytics (optional)
5. Create project

### 2. Enable Firestore Database
1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location (choose closest to your users)

### 3. Get Firebase Configuration
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" → Web app
4. Register app with name: `webnet-app`
5. Copy the configuration object

### 4. Set Environment Variables
Create a `.env.development` file in the project root:

```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key-here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 🚀 Database Initialization

### Option 1: Initialize with Real Data (Recommended)
```bash
npm run db:init
```

This will create:
- ✅ 10 categories (professions)
- ✅ 10 cities (Greek cities)
- ✅ 3 demo users
- ✅ 2 demo professionals
- ✅ 2 sample appointments
- ✅ 2 sample reviews
- ✅ 2 sample notifications

### Option 2: Basic Setup
```bash
npm run db:setup
```

### Option 3: Validate Database
```bash
npm run db:validate
```

## 📊 Database Structure

### Collections Created:

#### 👥 Users Collection
```typescript
{
  id: string;
  email: string;
  name: string;
  role: 'user' | 'professional' | 'admin';
  phone: string;
  location: string;
  occupation: string;
  isVerified: boolean;
  avatar: string;
  joinedDate: Date;
  preferences: {
    notifications: boolean;
    language: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

#### 👨‍💼 Professionals Collection
```typescript
{
  id: string;
  email: string;
  name: string;
  role: 'professional';
  phone: string;
  location: string;
  profession: string;
  businessName: string;
  rating: number;
  reviewsCount: number;
  isVerified: boolean;
  avatar: string;
  joinedDate: Date;
  services: string[];
  description: string;
  website: string;
  workingHours: string;
  languages: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

#### 📅 Appointments Collection
```typescript
{
  id: string;
  userId: string;
  professionalId: string;
  date: string;
  time: string;
  service: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes: string;
  duration: number;
  price: number;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### ⭐ Reviews Collection
```typescript
{
  id: string;
  userId: string;
  professionalId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  helpful: number;
}
```

#### 🔔 Notifications Collection
```typescript
{
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}
```

## 🔒 Security Rules

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Professionals can read/write their own data
    match /professionals/{professionalId} {
      allow read, write: if request.auth != null && request.auth.uid == professionalId;
    }
    
    // Appointments are readable by involved parties
    match /appointments/{appointmentId} {
      allow read, write: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         resource.data.professionalId == request.auth.uid);
    }
    
    // Reviews are readable by all, writable by authenticated users
    match /reviews/{reviewId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Notifications are readable by the user
    match /notifications/{notificationId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Categories and cities are readable by all
    match /categories/{categoryId} {
      allow read: if true;
    }
    
    match /cities/{cityId} {
      allow read: if true;
    }
  }
}
```

## 🧪 Testing Database

### 1. Validate Database
```bash
npm run db:validate
```

### 2. Check Specific Collections
```bash
npm run db:check
```

### 3. Test in Firebase Console
1. Go to Firebase Console → Firestore Database
2. Check if all collections are created
3. Verify data structure and content

## 🚨 Troubleshooting

### Common Issues:

#### 1. "Permission denied" errors
- Check Firestore security rules
- Ensure user is authenticated
- Verify user has proper permissions

#### 2. "Firebase not initialized" errors
- Check environment variables
- Verify Firebase configuration
- Ensure Firebase project is active

#### 3. "Network error" issues
- Check internet connection
- Verify Firebase project status
- Check Firebase quotas

#### 4. "Collection not found" errors
- Run database initialization
- Check collection names
- Verify data was written successfully

## 📈 Next Steps

1. **Test the app** with real data
2. **Add more realistic data** as needed
3. **Set up production database** for deployment
4. **Configure security rules** for production
5. **Set up monitoring** and analytics

## 🎯 Success Criteria

✅ Database is accessible  
✅ All collections are created  
✅ Demo data is populated  
✅ Security rules are configured  
✅ App can read/write data  
✅ No permission errors  

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Verify Firebase configuration
3. Check Firebase Console for errors
4. Review security rules
5. Test with Firebase Console

---

**🎉 Once completed, your database will be ready for the WebNetApp!**
