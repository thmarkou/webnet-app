# 🚨 Expo Crash Troubleshooting Guide

This guide helps you fix Expo crashes and Metro bundler issues in WebNetApp.

## 🚨 Common Expo Crashes

### **1. Watchman Recrawl Issues**
```
Recrawled this watch 7 times, most recently because:
MustScanSubDirs UserDroppedTo resolve, please review the information on
https://facebook.github.io/watchman/docs/troubleshooting.html#recrawl
```

**Solution:**
```bash
# Fix Watchman issues
npm run fix:watchman

# Or manually:
watchman watch-del '/Users/fanis/4.TM/AI Coding/cursor/webnetapp'
watchman watch-project '/Users/fanis/4.TM/AI Coding/cursor/webnetapp'
```

### **2. Metro Bundler Crashes**
```
Metro Bundler crashed
Unable to resolve module ./index.ts
```

**Solution:**
```bash
# Fix entry point issues
npm run fix:entry

# Fix Metro issues
npm run fix:metro
```

### **3. Port Conflicts**
```
Port 8081 is running this app in another window
Input is required, but 'npx expo' is in non-interactive mode.
```

**Solution:**
```bash
# Use different port
npx expo start --clear --port 8083

# Or kill conflicting processes
pkill -f "expo start"
npx expo start --clear
```

## 🛠️ Quick Fixes

### **1. Complete Reset**
```bash
# Nuclear option - fixes most issues
npm run fix:watchman
```

### **2. Metro-Only Fix**
```bash
# Fix Metro bundler issues
npm run fix:metro
```

### **3. Entry Point Fix**
```bash
# Fix entry point resolution
npm run fix:entry
```

### **4. Manual Fix**
```bash
# Kill all processes
pkill -f "expo start"
pkill -f "metro"
pkill -f "watchman"

# Clear caches
rm -rf /tmp/metro-*
rm -rf /tmp/haste-map-*
rm -rf /tmp/react-*
rm -rf /tmp/watchman-*

# Restart
npx expo start --clear --port 8083
```

## 🔍 Diagnostic Commands

### **Check Running Processes**
```bash
# Check for conflicting processes
ps aux | grep expo
ps aux | grep metro
ps aux | grep watchman

# Kill specific processes
pkill -f "expo start"
pkill -f "metro"
pkill -f "watchman"
```

### **Check Port Usage**
```bash
# Check which ports are in use
lsof -i :8081
lsof -i :8082
lsof -i :8083

# Kill processes on specific ports
kill -9 $(lsof -t -i:8081)
kill -9 $(lsof -t -i:8082)
```

### **Check Watchman Status**
```bash
# Check Watchman status
watchman get-config
watchman watch-list

# Reset Watchman
watchman shutdown-server
watchman watch-project .
```

## 🐛 Specific Issues

### **1. Watchman Recrawl Loop**
```bash
# Symptoms: Metro keeps recrawling, Expo crashes
# Solution:
watchman watch-del-all
watchman shutdown-server
watchman watch-project .
```

### **2. Metro Cache Corruption**
```bash
# Symptoms: Metro can't resolve modules
# Solution:
rm -rf /tmp/metro-*
rm -rf /tmp/haste-map-*
npx expo start --clear
```

### **3. Node Modules Issues**
```bash
# Symptoms: Module resolution failures
# Solution:
rm -rf node_modules
npm install
npx expo start --clear
```

### **4. Port Conflicts**
```bash
# Symptoms: Port already in use
# Solution:
pkill -f "expo start"
npx expo start --clear --port 8083
```

## 📱 Platform-Specific Issues

### **iOS Expo Crashes**
```bash
# iOS-specific fixes
npx expo run:ios --clear
```

### **Android Expo Crashes**
```bash
# Android-specific fixes
npx expo run:android --clear
```

## 🔧 Prevention

### **1. Regular Maintenance**
```bash
# Weekly cleanup
npm run fix:watchman

# Before major changes
npm run fix:metro
```

### **2. Development Best Practices**
- Use different ports for different projects
- Clear caches before switching branches
- Don't modify `node_modules` directly
- Keep dependencies updated

### **3. Environment Setup**
```bash
# Set up environment variables
export EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0
export NODE_ENV=development

# Use consistent Node.js version
nvm use 18
```

## 🚀 Recovery Steps

### **1. Emergency Recovery**
```bash
# If Expo completely crashes
npm run fix:watchman
npx expo start --clear --port 8083
```

### **2. Full Reset**
```bash
# If nothing else works
rm -rf node_modules
rm -rf /tmp/metro-*
rm -rf /tmp/haste-map-*
rm -rf /tmp/react-*
rm -rf /tmp/watchman-*
npm install
npx expo start --clear --port 8083
```

### **3. Nuclear Option**
```bash
# Complete system reset
pkill -f "expo"
pkill -f "metro"
pkill -f "watchman"
pkill -f "react-native"
rm -rf node_modules
rm -rf /tmp/*
npm install
npx expo start --clear --port 8083
```

## ✅ Success Indicators

### **Expo is Working When:**
- No Watchman recrawl warnings
- Metro bundler starts without errors
- App loads on device/simulator
- Hot reload works
- No port conflicts

### **Expo is Fixed When:**
- `npx expo start` runs without crashes
- No recrawl warnings in console
- App builds successfully
- All screens load properly

## 📞 Getting Help

### **1. Check Logs**
```bash
# Verbose Expo logs
npx expo start --verbose

# Check for specific errors
npx expo start 2>&1 | grep -i error
```

### **2. Common Solutions**
1. **Restart everything**: Terminal, Expo, device
2. **Clear all caches**: Metro, npm, watchman
3. **Reinstall dependencies**: Clean install
4. **Check file permissions**: Ensure files are readable
5. **Update dependencies**: Use latest compatible versions

### **3. When to Use Nuclear Option**
- Multiple Expo crashes
- Persistent Watchman issues
- Metro bundler failures
- Cache corruption
- After major dependency updates

---

**🔧 Expo should now run smoothly without crashes!**
