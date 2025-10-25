#!/bin/bash

# Android Development Setup Script for WebNetApp
echo "🤖 Setting up Android development environment..."

# Check if Android SDK is installed
if [ -z "$ANDROID_HOME" ]; then
    echo "❌ ANDROID_HOME not set. Please install Android Studio and set ANDROID_HOME"
    echo "   Add to your shell profile (~/.bashrc, ~/.zshrc):"
    echo "   export ANDROID_HOME=\$HOME/Library/Android/sdk  # macOS"
    echo "   export ANDROID_HOME=\$HOME/Android/Sdk          # Linux"
    echo "   export PATH=\$PATH:\$ANDROID_HOME/emulator"
    echo "   export PATH=\$PATH:\$ANDROID_HOME/platform-tools"
    echo "   export PATH=\$PATH:\$ANDROID_HOME/tools"
    exit 1
fi

echo "✅ ANDROID_HOME is set to: $ANDROID_HOME"

# Check if required tools are available
echo "🔍 Checking required tools..."

# Check adb
if command -v adb &> /dev/null; then
    echo "✅ ADB is available"
else
    echo "❌ ADB not found. Please install Android SDK Platform Tools"
    exit 1
fi

# Check emulator
if command -v emulator &> /dev/null; then
    echo "✅ Android Emulator is available"
else
    echo "❌ Android Emulator not found. Please install via Android Studio"
fi

# Check Java
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | cut -d'.' -f1)
    if [ "$JAVA_VERSION" -ge 11 ]; then
        echo "✅ Java $JAVA_VERSION is available"
    else
        echo "❌ Java 11+ required. Current version: $JAVA_VERSION"
        exit 1
    fi
else
    echo "❌ Java not found. Please install Java 11 or higher"
    exit 1
fi

# Install required NDK version
echo "📦 Installing required NDK version..."
$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager "ndk;25.1.8937393"

# Clean and prepare build
echo "🧹 Cleaning previous builds..."
cd android
./gradlew clean
cd ..

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check Expo CLI
if command -v expo &> /dev/null; then
    echo "✅ Expo CLI is available"
else
    echo "📦 Installing Expo CLI..."
    npm install -g @expo/cli
fi

echo "🎉 Android development environment is ready!"
echo ""
echo "📱 Next steps:"
echo "1. Start Android emulator or connect device"
echo "2. Run: npm run android"
echo "3. Or run: npx expo run:android"
echo ""
echo "🔧 Troubleshooting:"
echo "- If build fails, try: cd android && ./gradlew clean"
echo "- If emulator issues, check: adb devices"
echo "- If NDK issues, ensure NDK 25.1.8937393 is installed"
