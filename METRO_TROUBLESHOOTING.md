# 🔧 Metro Bundler Troubleshooting Guide

This guide helps you fix common Metro bundler issues in WebNetApp.

## 🚨 Common Metro Errors

### **1. SHA-1 Error**
```
ERROR Error: Failed to get the SHA-1 for: /path/to/file.js
```

**Solution:**
```bash
# Clear Metro cache
npx expo start --clear

# Or use the fix script
npm run fix:metro
```

### **2. File Not Watched**
```
The file is not watched. Ensure it is under the configured `projectRoot` or `watchFolders`.
```

**Solution:**
- Check `metro.config.js` has correct `watchFolders`
- Ensure file is in project directory
- Restart Metro bundler

### **3. BlockList Issues**
```
Check `blockList` in your metro.config.js and make sure it isn't excluding the file path.
```

**Solution:**
- Clear `blockList` in `metro.config.js`
- Restart Metro bundler

### **4. Module Resolution Issues**
```
Unable to resolve module `@react-native/normalize-colors`
```

**Solution:**
```bash
# Clear and reinstall dependencies
rm -rf node_modules
npm install

# Clear Metro cache
npx expo start --clear
```

## 🛠️ Quick Fixes

### **1. Basic Metro Reset**
```bash
# Stop Metro
# Press Ctrl+C in terminal

# Clear cache and restart
npx expo start --clear
```

### **2. Complete Metro Reset**
```bash
# Use the fix script
npm run fix:metro

# Or manually:
rm -rf node_modules
npm install
npx expo start --clear
```

### **3. Nuclear Option**
```bash
# Kill all processes
pkill -f "expo start"
pkill -f "metro"
pkill -f "react-native start"

# Clear everything
rm -rf node_modules
rm -rf /tmp/metro-*
rm -rf /tmp/haste-map-*
rm -rf /tmp/react-*

# Reinstall
npm install
npx expo start --clear
```

## 🔍 Diagnostic Commands

### **Check Metro Status**
```bash
# Check if Metro is running
ps aux | grep metro

# Check Metro logs
npx expo start --verbose
```

### **Check Dependencies**
```bash
# Check for missing dependencies
npm run android:setup

# Check for version conflicts
npx expo install --check
```

### **Check File Permissions**
```bash
# Check if files are readable
ls -la src/
ls -la node_modules/

# Fix permissions if needed
chmod -R 755 src/
chmod -R 755 node_modules/
```

## 🐛 Specific Issues

### **1. React Native Modules**
```bash
# Clear React Native cache
npx react-native start --reset-cache

# Reinstall React Native
npm uninstall react-native
npm install react-native@0.81.5
```

### **2. Expo Modules**
```bash
# Clear Expo cache
npx expo install --fix

# Reinstall Expo
npm uninstall expo
npm install expo@latest
```

### **3. Node Modules**
```bash
# Clear npm cache
npm cache clean --force

# Reinstall all modules
rm -rf node_modules package-lock.json
npm install
```

### **4. Watchman Issues**
```bash
# Clear watchman cache
watchman watch-del-all

# Restart watchman
watchman shutdown-server
watchman start-server
```

## 📱 Platform-Specific Issues

### **Android Metro Issues**
```bash
# Clear Android build cache
cd android
./gradlew clean
cd ..

# Restart Metro for Android
npx expo run:android
```

### **iOS Metro Issues**
```bash
# Clear iOS build cache
cd ios
xcodebuild clean
cd ..

# Restart Metro for iOS
npx expo run:ios
```

## 🔧 Metro Configuration

### **Current metro.config.js**
```javascript
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Fix Metro resolver issues
config.resolver.sourceExts = ['js', 'jsx', 'json', 'ts', 'tsx'];
config.resolver.assetExts = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'];

// Add watch folders
config.watchFolders = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(__dirname, 'src'),
];

// Configure resolver
config.resolver.platforms = ['ios', 'android', 'native', 'web'];
config.resolver.blockList = [];
config.resolver.unstable_enableSymlinks = true;

module.exports = config;
```

### **If Issues Persist**
```javascript
// Add to metro.config.js
config.resolver.unstable_enableSymlinks = false;
config.resolver.unstable_enablePackageExports = false;
```

## 🚀 Prevention

### **1. Regular Maintenance**
```bash
# Weekly cache clearing
npm run fix:metro

# Monthly dependency updates
npx expo install --check
```

### **2. Development Best Practices**
- Don't modify `node_modules` directly
- Use `npm install` instead of `yarn`
- Clear cache before major changes
- Keep dependencies updated

### **3. Environment Setup**
```bash
# Set up environment variables
export NODE_ENV=development
export EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0

# Use consistent Node.js version
nvm use 18
```

## 📞 Getting Help

### **1. Check Logs**
```bash
# Verbose Metro logs
npx expo start --verbose

# Check for specific errors
npx expo start 2>&1 | grep -i error
```

### **2. Common Solutions**
1. **Restart everything**: Terminal, Metro, device
2. **Clear all caches**: Metro, npm, watchman
3. **Reinstall dependencies**: Clean install
4. **Check file permissions**: Ensure files are readable
5. **Update dependencies**: Use latest compatible versions

### **3. When to Use Nuclear Option**
- Multiple Metro errors
- Persistent SHA-1 issues
- Module resolution failures
- Cache corruption
- After major dependency updates

## ✅ Success Indicators

### **Metro is Working When:**
- No SHA-1 errors in console
- Files are being watched
- Modules resolve correctly
- App loads on device/emulator
- Hot reload works

### **Metro is Fixed When:**
- `npx expo start` runs without errors
- App builds successfully
- All screens load properly
- No console errors related to Metro

---

**🔧 Metro bundler should now work smoothly!**
