#!/bin/bash

# Metro Bundler Fix Script for WebNetApp
echo "🔧 Fixing Metro bundler issues..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

print_status "Starting Metro bundler fixes..."

# 1. Clear Metro cache
print_status "Clearing Metro cache..."
npx expo start --clear --no-dev --minify
if [ $? -eq 0 ]; then
    print_success "Metro cache cleared"
else
    print_warning "Metro cache clear had issues, continuing..."
fi

# 2. Clear npm cache
print_status "Clearing npm cache..."
npm cache clean --force
if [ $? -eq 0 ]; then
    print_success "npm cache cleared"
else
    print_warning "npm cache clear had issues, continuing..."
fi

# 3. Clear node_modules and reinstall
print_status "Clearing node_modules..."
rm -rf node_modules
if [ $? -eq 0 ]; then
    print_success "node_modules removed"
else
    print_warning "node_modules removal had issues, continuing..."
fi

# 4. Reinstall dependencies
print_status "Reinstalling dependencies..."
npm install
if [ $? -eq 0 ]; then
    print_success "Dependencies reinstalled"
else
    print_error "Dependency installation failed"
    exit 1
fi

# 5. Clear watchman cache (if available)
if command -v watchman &> /dev/null; then
    print_status "Clearing watchman cache..."
    watchman watch-del-all
    if [ $? -eq 0 ]; then
        print_success "Watchman cache cleared"
    else
        print_warning "Watchman cache clear had issues, continuing..."
    fi
else
    print_warning "Watchman not found, skipping watchman cache clear"
fi

# 6. Clear React Native cache
print_status "Clearing React Native cache..."
npx react-native start --reset-cache
if [ $? -eq 0 ]; then
    print_success "React Native cache cleared"
else
    print_warning "React Native cache clear had issues, continuing..."
fi

# 7. Clear Expo cache
print_status "Clearing Expo cache..."
npx expo install --fix
if [ $? -eq 0 ]; then
    print_success "Expo cache cleared"
else
    print_warning "Expo cache clear had issues, continuing..."
fi

# 8. Kill any running Metro processes
print_status "Killing running Metro processes..."
pkill -f "expo start" || true
pkill -f "metro" || true
pkill -f "react-native start" || true
print_success "Metro processes killed"

# 9. Clear temporary files
print_status "Clearing temporary files..."
rm -rf /tmp/metro-* || true
rm -rf /tmp/haste-map-* || true
rm -rf /tmp/react-* || true
print_success "Temporary files cleared"

print_success "Metro bundler fixes completed!"
print_status "You can now run: npm start"
print_status "Or run: npx expo start --clear"

echo ""
print_status "🔧 Metro bundler is ready!"
print_status "If issues persist, try:"
print_status "1. Restart your terminal"
print_status "2. Run: npm run android:clean"
print_status "3. Run: npm start"
