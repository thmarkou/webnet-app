# 🗺️ Complete Maps Fix Guide

## 🚨 **Current Issues:**

1. **iOS**: Wrong marker location for Άννα Παπίδου
2. **Android**: Map not appearing (missing API key)

## ✅ **What I Fixed:**

### **📍 iOS Marker Location:**

- Updated coordinates from `40.6435, 22.9418` to `40.6442, 22.9405`
- Updated both mock data and geocoding service
- Should now point to more accurate location

### **📱 Android Map Issue:**

- **Root Cause**: Missing Google Maps API Key
- **Current Status**: `YOUR_GOOGLE_MAPS_API_KEY` placeholder in `google_maps_api.xml`

## 🔧 **To Fix Android Map:**

### **Step 1: Get Google Maps API Key**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Maps SDK for Android" API
4. Create credentials → API Key
5. Restrict the key to your app's package name: `com.fmarkou.webnetapp`

### **Step 2: Update API Key**

1. Open: `android/app/src/main/res/values/google_maps_api.xml`
2. Replace `YOUR_GOOGLE_MAPS_API_KEY` with your actual API key:
   ```xml
   <string name="google_maps_key" templateMergeStrategy="preserve" translatable="false">
       YOUR_ACTUAL_API_KEY_HERE
   </string>
   ```

### **Step 3: Test Android**

1. Clean build: `cd android && ./gradlew clean`
2. Build: `./gradlew assembleDebug`
3. Install APK on Android device

## 🎯 **For iOS Marker Accuracy:**

**If the marker is still wrong, please:**

1. Go to Google Maps
2. Search: "Ιωνίας 71, Θεσσαλονίκη, Ελλάδα"
3. Right-click on exact location
4. Tell me the coordinates that appear

## 📱 **Expected Results:**

### **iOS:**

- Map should appear with marker
- Marker should point to correct street location
- "Οδηγίες" button should work

### **Android:**

- Map should appear (after API key setup)
- Marker should point to correct location
- All map functionality should work

## 🚀 **Next Steps:**

1. **Test iOS**: Check if marker is now accurate
2. **Get API Key**: For Android map to work
3. **Update API Key**: In `google_maps_api.xml`
4. **Test Android**: Verify map appears

## 💡 **Production Ready:**

- iOS: Should work with current setup
- Android: Needs Google Maps API key
- Both: Will work perfectly with real API key
