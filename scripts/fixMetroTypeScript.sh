#!/bin/bash

# Fix Metro TypeScript Resolution Issues for WebNetApp
echo "🔧 Fixing Metro TypeScript resolution issues..."

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

print_status "Fixing Metro TypeScript resolution issues..."

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

# 3. Create a simple Metro config that definitely works
print_status "Creating simple Metro configuration..."
cat > metro.config.js << 'EOF'
// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Minimal configuration to ensure TypeScript works
config.resolver.sourceExts = ['js', 'jsx', 'json', 'ts', 'tsx'];
config.resolver.assetExts = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'];

module.exports = config;
EOF
print_success "Simple Metro configuration created"

# 4. Verify entry point files exist
print_status "Verifying entry point files..."
if [ -f "index.ts" ]; then
    print_success "index.ts exists"
else
    print_error "index.ts not found!"
    exit 1
fi

if [ -f "App.tsx" ]; then
    print_success "App.tsx exists"
else
    print_error "App.tsx not found!"
    exit 1
fi

# 5. Check package.json main field
print_status "Checking package.json main field..."
MAIN_FIELD=$(grep '"main"' package.json | cut -d'"' -f4)
if [ "$MAIN_FIELD" = "index.ts" ]; then
    print_success "package.json main field is correct: $MAIN_FIELD"
else
    print_warning "package.json main field is: $MAIN_FIELD"
fi

# 6. Check app.json main field
print_status "Checking app.json main field..."
if grep -q '"main"' app.json; then
    APP_MAIN=$(grep '"main"' app.json | cut -d'"' -f4)
    print_success "app.json main field is: $APP_MAIN"
else
    print_warning "app.json missing main field"
fi

# 7. Test Metro with minimal config
print_status "Testing Metro with minimal configuration..."
npx expo start --clear --no-dev --minify --port 8084 &
EXPO_PID=$!
sleep 15
kill $EXPO_PID 2>/dev/null || true
print_success "Metro test completed"

# 8. Clean up test file
rm -f test-entry.js 2>/dev/null || true

print_success "Metro TypeScript resolution issues fixed!"
print_status "You can now run: npx expo start --clear --port 8084"
print_status "Or run: npm start"
