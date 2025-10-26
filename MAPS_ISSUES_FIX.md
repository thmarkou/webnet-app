# 🗺️ Maps Issues - Complete Fix Guide

## 🚨 **Issues Identified:**

### **📱 iOS Issue:**

- **Problem**: Map shows but wrong location (Ag. Dimitriou instead of Ιωνίας 71)
- **Root Cause**: Using generic city center coordinates (40.6401, 22.9444) instead of actual street address coordinates

### **📱 Android Issue:**

- **Problem**: Map doesn't load at all
- **Root Cause**: Google Maps API key not configured (currently shows "YOUR_GOOGLE_MAPS_API_KEY")

---

## 🔧 **Solution 1: Fix iOS Coordinates**

### **Problem:**

The coordinates for "Ιωνίας 71, 54453 Θεσσαλονίκη" are currently pointing to the city center instead of the actual street address.

### **How to Get Correct Coordinates:**

**Option 1: Use Google Maps (Recommended)**

1. Go to [Google Maps](https://www.google.com/maps)
2. Search for: **"Ιωνίας 71, 54453 Θεσσαλονίκη, Ελλάδα"**
3. Right-click on the exact location
4. Click "What's here?"
5. Copy the coordinates (format: latitude, longitude)

**Option 2: Use Geocoding Service**

```bash
# Using Google Geocoding API
curl "https://maps.googleapis.com/maps/api/geocode/json?address=Ιωνίας+71,+54453+Θεσσαλονίκη,+Ελλάδα&key=YOUR_API_KEY"
```

### **Expected Coordinates:**

- **Ιωνίας 71, Θεσσαλονίκη**: approximately `40.6371, 22.9413` (example - verify with Google Maps)
- **Μακροχωρίου 7, Αθήνα**: approximately `37.9872, 23.7283` (example - verify with Google Maps)

### **Update in Code:**

File: `src/screens/app/FindProfessionalsScreen.tsx`

```typescript
// Άννα Παπίδου - Line 373-376
coordinates: {
  latitude: 40.6371,  // Update with actual coordinates from Google Maps
  longitude: 22.9413
}

// Άρης Μάρκου - Line 398-401
coordinates: {
  latitude: 37.9872,  // Update with actual coordinates from Google Maps
  longitude: 23.7283
}
```

---

## 🔧 **Solution 2: Fix Android Maps**

### **Step 1: Get Google Maps API Key**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the following APIs:

   - **Maps SDK for Android**
   - **Maps SDK for iOS** (for iOS support)
   - **Geocoding API** (for address lookups)
   - **Directions API** (for directions feature)

4. Create API Key:

   - Go to: **APIs & Services** → **Credentials**
   - Click: **Create Credentials** → **API Key**
   - Copy the API key

5. Restrict the API Key (Important for security):
   - Click on the API key to edit
   - Under **Application restrictions**, select **Android apps**
   - Add package name: `com.fmarkou.webnetapp`
   - Under **API restrictions**, select **Restrict key**
   - Choose the APIs you enabled above

### **Step 2: Add API Key to Android**

**File:** `android/app/src/main/res/values/google_maps_api.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="google_maps_key" templateMergeStrategy="preserve" translatable="false">
        AIzaSyABCDEFGH-EXAMPLE-KEY-1234567890
    </string>
</resources>
```

Replace `AIzaSyABCDEFGH-EXAMPLE-KEY-1234567890` with your actual API key.

### **Step 3: Add API Key to iOS**

**File:** `ios/webnetapp/Info.plist`

Add this inside the `<dict>` tag:

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>This app needs access to your location to show nearby professionals</string>
<key>NSLocationAlwaysUsageDescription</key>
<string>This app needs access to your location to show nearby professionals</string>
<key>GMSApiKey</key>
<string>AIzaSyABCDEFGH-EXAMPLE-KEY-1234567890</string>
```

### **Step 4: Environment Variable (Recommended)**

For better security, use environment variables:

**File:** `.env.development`

```env
GOOGLE_MAPS_API_KEY=AIzaSyABCDEFGH-EXAMPLE-KEY-1234567890
```

**Update:** `android/app/src/main/res/values/google_maps_api.xml`

```xml
<string name="google_maps_key" templateMergeStrategy="preserve" translatable="false">
    ${GOOGLE_MAPS_API_KEY}
</string>
```

---

## 🧪 **Testing**

### **Test on iOS:**

```bash
npx expo start
# Scan QR code with iPhone
# Navigate to a professional profile
# Verify map shows correct address
```

### **Test on Android:**

```bash
cd android
./gradlew clean
./gradlew assembleDebug
adb install app/build/outputs/apk/debug/app-debug.apk

# Or using Expo
npx expo run:android
```

---

## 📋 **Checklist:**

### **For iOS Fix:**

- [ ] Get actual coordinates from Google Maps for "Ιωνίας 71, 54453 Θεσσαλονίκη"
- [ ] Get actual coordinates from Google Maps for "Μακροχωρίου 7, 11363 Αθήνα"
- [ ] Update coordinates in `FindProfessionalsScreen.tsx`
- [ ] Test on iOS device/simulator
- [ ] Verify map pin shows correct location

### **For Android Fix:**

- [ ] Get Google Maps API key from Google Cloud Console
- [ ] Enable required APIs (Maps SDK for Android, Geocoding, Directions)
- [ ] Restrict API key to your app package name
- [ ] Update `google_maps_api.xml` with actual API key
- [ ] Clean and rebuild Android app
- [ ] Test on Android device/emulator
- [ ] Verify map loads and shows correctly

---

## ⚠️ **Important Notes:**

1. **Never commit real API keys** to public repositories
2. **Use environment variables** for production
3. **Monitor API usage** in Google Cloud Console to avoid overages
4. **Test on real devices** for best results
5. **Enable billing** in Google Cloud Console (required for production)

---

## 🆘 **Need Help?**

If you need me to:

1. **Get the coordinates**: Share the exact addresses and I'll help find the correct coordinates
2. **Update the code**: Once you have the API key, I can update the configuration files
3. **Troubleshoot**: Share any error messages you encounter

Just let me know! 🚀
