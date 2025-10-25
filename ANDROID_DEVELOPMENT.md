# 🤖 Android Development Guide

Complete guide for building and deploying WebNetApp on Android devices.

## 🚀 Quick Start

### **1. Setup Environment**
```bash
# Run the setup script
npm run android:setup

# Or manually:
./scripts/setupAndroid.sh
```

### **2. Build and Run**
```bash
# Development build
npm run android

# Production build
npm run android:release

# Build and install
npm run android:install
```

## 📋 Prerequisites

### **Required Software**
- **Node.js** (v18+)
- **Android Studio** (Latest)
- **Java** (v11+)
- **Expo CLI** (`npm install -g @expo/cli`)

### **Environment Variables**
Add to your shell profile (`~/.bashrc`, `~/.zshrc`):
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
export ANDROID_HOME=$HOME/Android/Sdk          # Linux
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
```

## 🔧 Build Commands

### **Development Commands**
```bash
# Start Metro bundler
npm start

# Run on Android (development)
npm run android

# Build debug APK
npm run android:build

# Clean build
npm run android:clean
```

### **Production Commands**
```bash
# Build release APK
npm run android:release

# Build and install release
npm run android:release -- --install
```

### **Advanced Commands**
```bash
# Build for specific device
./scripts/buildAndroid.sh --device DEVICE_ID

# Clean and build
./scripts/buildAndroid.sh --clean --release

# Build and install
./scripts/buildAndroid.sh --install --release
```

## 📱 Testing

### **1. Android Emulator**
```bash
# Start Android Studio
# Tools → AVD Manager → Create Virtual Device
# Choose device (e.g., Pixel 6) → Download system image
# Start emulator

# Run on emulator
npm run android
```

### **2. Physical Device**
```bash
# Enable Developer Options
# Settings → About Phone → Tap "Build Number" 7 times
# Settings → Developer Options → Enable "USB Debugging"

# Connect device via USB
adb devices  # Should show your device

# Run on device
npm run android
```

### **3. Device Selection**
```bash
# List connected devices
adb devices

# Run on specific device
npx expo run:android --device DEVICE_ID
```

## 🏗️ Build Configuration

### **App Configuration (app.json)**
```json
{
  "expo": {
    "name": "WebNetApp",
    "slug": "webnetapp",
    "version": "1.0.0",
    "android": {
      "package": "com.fmarkou.webnetapp",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    }
  }
}
```

### **Build Settings**
- **Package Name**: `com.fmarkou.webnetapp`
- **Version Code**: 1
- **Version Name**: 1.0.0
- **Target SDK**: 34
- **Min SDK**: 21
- **NDK Version**: 25.1.8937393

## 📦 APK Generation

### **Debug APK**
```bash
# Generate debug APK
cd android
./gradlew assembleDebug
# APK location: android/app/build/outputs/apk/debug/app-debug.apk
```

### **Release APK**
```bash
# Generate release APK (requires signing)
cd android
./gradlew assembleRelease
# APK location: android/app/build/outputs/apk/release/app-release.apk
```

## 🔐 App Signing

### **Debug Signing**
- Uses debug keystore (already configured)
- For development and testing only

### **Release Signing**
1. Generate keystore:
```bash
keytool -genkey -v -keystore webnetapp-release-key.keystore -alias webnetapp -keyalg RSA -keysize 2048 -validity 10000
```

2. Update `android/app/build.gradle`:
```gradle
signingConfigs {
    release {
        storeFile file('webnetapp-release-key.keystore')
        storePassword 'your-store-password'
        keyAlias 'webnetapp'
        keyPassword 'your-key-password'
    }
}
```

## 🚀 Deployment

### **1. Direct APK Distribution**
- Share APK file directly
- Install via "Unknown Sources"
- No app store required

### **2. Google Play Store**
- Create developer account ($25 one-time fee)
- Upload AAB file
- Follow Play Store guidelines
- App review process

### **3. Alternative Stores**
- **Samsung Galaxy Store**
- **Amazon Appstore**
- **Huawei AppGallery**

## 🧪 Testing Checklist

### **Functionality Tests**
- [ ] App launches successfully
- [ ] Login/Registration works
- [ ] Navigation between screens
- [ ] Database operations (Firebase)
- [ ] Notifications work
- [ ] Camera/Image picker
- [ ] Date/Time pickers
- [ ] All forms and inputs

### **Performance Tests**
- [ ] App startup time
- [ ] Screen transitions
- [ ] Memory usage
- [ ] Battery consumption
- [ ] Network requests

### **Device Compatibility**
- [ ] Different screen sizes
- [ ] Different Android versions
- [ ] Different device manufacturers
- [ ] Portrait/landscape orientation

## 🐛 Troubleshooting

### **Common Issues**

#### **1. Build Failures**
```bash
# Clean build
cd android
./gradlew clean
cd ..
npm run android
```

#### **2. Metro Bundler Issues**
```bash
# Reset Metro cache
npx expo start --clear
```

#### **3. Android SDK Issues**
```bash
# Check Android SDK path
echo $ANDROID_HOME
# Should point to Android SDK location
```

#### **4. Device Connection Issues**
```bash
# Check connected devices
adb devices

# Restart ADB server
adb kill-server
adb start-server
```

#### **5. NDK Issues**
```bash
# Install correct NDK version
$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager "ndk;25.1.8937393"
```

### **Build Errors**

#### **"SDK location not found"**
- Set `ANDROID_HOME` environment variable
- Install Android SDK via Android Studio

#### **"Gradle build failed"**
- Check Java version (should be 11+)
- Clean Gradle cache: `./gradlew clean`

#### **"Metro bundler not found"**
- Install dependencies: `npm install`
- Start Metro: `npx expo start`

#### **"NDK not found"**
- Install NDK 25.1.8937393 via Android Studio
- Update `android/build.gradle` with correct NDK version

## 📊 Build Optimization

### **APK Size Optimization**
```bash
# Enable ProGuard (in android/app/build.gradle)
buildTypes {
    release {
        minifyEnabled true
        proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
    }
}
```

### **Performance Optimization**
- Use Hermes JavaScript engine (enabled by default)
- Optimize images and assets
- Remove unused dependencies
- Enable R8 code shrinking

## 🎯 Production Checklist

### **Before Release**
- [ ] Test on multiple devices
- [ ] Optimize app performance
- [ ] Set up crash reporting
- [ ] Configure analytics
- [ ] Test offline functionality
- [ ] Verify all features work
- [ ] Check memory usage
- [ ] Test battery consumption

### **Security Checklist**
- [ ] Remove debug logs
- [ ] Secure API endpoints
- [ ] Validate user inputs
- [ ] Implement proper authentication
- [ ] Use HTTPS for all requests
- [ ] Secure local storage

## 📱 Distribution

### **Internal Testing**
1. Generate signed APK
2. Share with testers
3. Collect feedback
4. Fix issues
5. Iterate

### **Public Release**
1. Create Google Play Console account
2. Upload AAB file
3. Fill store listing
4. Submit for review
5. Publish when approved

## 🎉 Success!

Once you complete these steps, your WebNetApp will be ready for Android devices!

### **Next Steps**
1. Test thoroughly on multiple devices
2. Optimize performance and size
3. Prepare for app store submission
4. Set up analytics and crash reporting
5. Plan marketing and user acquisition

---

**🚀 Your Android app is ready to go!**
