#!/bin/bash

# Android Build Script for WebNetApp
echo "🤖 Building WebNetApp for Android..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Check if Android SDK is available
if [ -z "$ANDROID_HOME" ]; then
    print_error "ANDROID_HOME not set. Please install Android Studio and set ANDROID_HOME"
    exit 1
fi

print_status "Android SDK found at: $ANDROID_HOME"

# Parse command line arguments
BUILD_TYPE="debug"
INSTALL_APP=false
CLEAN_BUILD=false
DEVICE_ID=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --release)
            BUILD_TYPE="release"
            shift
            ;;
        --install)
            INSTALL_APP=true
            shift
            ;;
        --clean)
            CLEAN_BUILD=true
            shift
            ;;
        --device)
            DEVICE_ID="$2"
            shift 2
            ;;
        --help)
            echo "Usage: $0 [options]"
            echo "Options:"
            echo "  --release     Build release version"
            echo "  --install     Install app after build"
            echo "  --clean       Clean build before compiling"
            echo "  --device ID   Install on specific device"
            echo "  --help        Show this help"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

print_status "Build type: $BUILD_TYPE"
print_status "Install app: $INSTALL_APP"
print_status "Clean build: $CLEAN_BUILD"

# Clean build if requested
if [ "$CLEAN_BUILD" = true ]; then
    print_status "Cleaning previous builds..."
    cd android
    ./gradlew clean
    cd ..
    print_success "Clean completed"
fi

# Check for connected devices
if [ "$INSTALL_APP" = true ]; then
    print_status "Checking for connected devices..."
    
    if [ -n "$DEVICE_ID" ]; then
        # Check specific device
        if adb devices | grep -q "$DEVICE_ID"; then
            print_success "Device $DEVICE_ID is connected"
        else
            print_error "Device $DEVICE_ID not found"
            exit 1
        fi
    else
        # Check for any connected devices
        DEVICE_COUNT=$(adb devices | grep -v "List of devices" | grep -c "device$")
        if [ "$DEVICE_COUNT" -eq 0 ]; then
            print_warning "No devices connected. Starting emulator..."
            # Try to start emulator
            if command -v emulator &> /dev/null; then
                emulator -avd Pixel_4_API_33 &
                sleep 10
            else
                print_error "No devices connected and emulator not available"
                print_status "Please connect a device or start an emulator"
                exit 1
            fi
        else
            print_success "Found $DEVICE_COUNT connected device(s)"
        fi
    fi
fi

# Build the app
print_status "Building Android app..."

if [ "$BUILD_TYPE" = "release" ]; then
    print_status "Building release version..."
    cd android
    ./gradlew assembleRelease
    BUILD_RESULT=$?
    cd ..
    
    if [ $BUILD_RESULT -eq 0 ]; then
        print_success "Release build completed successfully!"
        print_status "APK location: android/app/build/outputs/apk/release/app-release.apk"
    else
        print_error "Release build failed"
        exit 1
    fi
else
    print_status "Building debug version..."
    cd android
    ./gradlew assembleDebug
    BUILD_RESULT=$?
    cd ..
    
    if [ $BUILD_RESULT -eq 0 ]; then
        print_success "Debug build completed successfully!"
        print_status "APK location: android/app/build/outputs/apk/debug/app-debug.apk"
    else
        print_error "Debug build failed"
        exit 1
    fi
fi

# Install app if requested
if [ "$INSTALL_APP" = true ] && [ $BUILD_RESULT -eq 0 ]; then
    print_status "Installing app on device..."
    
    if [ "$BUILD_TYPE" = "release" ]; then
        APK_PATH="android/app/build/outputs/apk/release/app-release.apk"
    else
        APK_PATH="android/app/build/outputs/apk/debug/app-debug.apk"
    fi
    
    if [ -n "$DEVICE_ID" ]; then
        adb -s "$DEVICE_ID" install -r "$APK_PATH"
    else
        adb install -r "$APK_PATH"
    fi
    
    if [ $? -eq 0 ]; then
        print_success "App installed successfully!"
    else
        print_error "App installation failed"
        exit 1
    fi
fi

print_success "Android build process completed!"
print_status "Build type: $BUILD_TYPE"
print_status "APK ready for distribution"

# Show APK info
if [ -f "$APK_PATH" ]; then
    APK_SIZE=$(du -h "$APK_PATH" | cut -f1)
    print_status "APK size: $APK_SIZE"
    print_status "APK path: $APK_PATH"
fi

echo ""
print_status "🎉 WebNetApp is ready for Android!"
