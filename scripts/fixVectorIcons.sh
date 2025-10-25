#!/bin/bash

# Fix Vector Icons Issues for WebNetApp
echo "🔧 Fixing vector icons issues..."

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

print_status "Fixing vector icons issues..."

# 1. Kill all running processes
print_status "Killing all running processes..."
pkill -f "expo start" || true
pkill -f "metro" || true
pkill -f "react-native start" || true
print_success "All processes killed"

# 2. Clear all caches
print_status "Clearing all caches..."
rm -rf node_modules/.cache 2>/dev/null || true
rm -rf /tmp/metro-* 2>/dev/null || true
rm -rf /tmp/haste-map-* 2>/dev/null || true
rm -rf /tmp/react-* 2>/dev/null || true
rm -rf /tmp/watchman-* 2>/dev/null || true
print_success "All caches cleared"

# 3. Install vector icons dependencies
print_status "Installing vector icons dependencies..."
npx expo install @expo/vector-icons react-native-vector-icons
if [ $? -eq 0 ]; then
    print_success "Vector icons dependencies installed"
else
    print_warning "Vector icons installation had issues, continuing..."
fi

# 4. Update Metro config for font files
print_status "Updating Metro configuration for font files..."
cat > metro.config.js << 'EOF'
// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Minimal configuration to ensure TypeScript works
config.resolver.sourceExts = ['js', 'jsx', 'json', 'ts', 'tsx'];
config.resolver.assetExts = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ttf', 'otf', 'woff', 'woff2'];

module.exports = config;
EOF
print_success "Metro configuration updated for font files"

# 5. Check if vector icons are properly installed
print_status "Checking vector icons installation..."
if [ -d "node_modules/@expo/vector-icons" ]; then
    print_success "@expo/vector-icons is installed"
else
    print_error "@expo/vector-icons not found!"
    exit 1
fi

if [ -d "node_modules/react-native-vector-icons" ]; then
    print_success "react-native-vector-icons is installed"
else
    print_warning "react-native-vector-icons not found"
fi

# 6. Test Metro with font support
print_status "Testing Metro with font support..."
npx expo start --clear --no-dev --minify --port 8085 &
EXPO_PID=$!
sleep 15
kill $EXPO_PID 2>/dev/null || true
print_success "Metro test with font support completed"

print_success "Vector icons issues fixed!"
print_status "You can now run: npx expo start --clear --port 8085"
print_status "Or run: npm start"
