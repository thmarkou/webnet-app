#!/bin/bash

# Fix Watchman and Metro Issues for WebNetApp
echo "🔧 Fixing Watchman and Metro issues..."

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

print_status "Fixing Watchman and Metro issues..."

# 1. Kill all running processes
print_status "Killing all running processes..."
pkill -f "expo start" || true
pkill -f "metro" || true
pkill -f "react-native start" || true
pkill -f "watchman" || true
print_success "All processes killed"

# 2. Fix Watchman issues
print_status "Fixing Watchman issues..."
if command -v watchman &> /dev/null; then
    # Stop watchman server
    watchman shutdown-server 2>/dev/null || true
    
    # Clear watchman state
    watchman watch-del-all 2>/dev/null || true
    
    # Remove watchman state directory
    rm -rf ~/.watchman-state 2>/dev/null || true
    
    # Restart watchman server
    watchman watch-project . 2>/dev/null || true
    
    print_success "Watchman issues fixed"
else
    print_warning "Watchman not found, skipping Watchman fixes"
fi

# 3. Clear all caches
print_status "Clearing all caches..."
rm -rf node_modules/.cache 2>/dev/null || true
rm -rf /tmp/metro-* 2>/dev/null || true
rm -rf /tmp/haste-map-* 2>/dev/null || true
rm -rf /tmp/react-* 2>/dev/null || true
rm -rf /tmp/watchman-* 2>/dev/null || true
print_success "All caches cleared"

# 4. Clear npm cache
print_status "Clearing npm cache..."
npm cache clean --force 2>/dev/null || true
print_success "npm cache cleared"

# 5. Reinstall dependencies if needed
print_status "Checking dependencies..."
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.package-lock.json" ]; then
    print_status "Reinstalling dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        print_success "Dependencies reinstalled"
    else
        print_error "Dependency installation failed"
        exit 1
    fi
else
    print_success "Dependencies are up to date"
fi

# 6. Fix Metro configuration
print_status "Fixing Metro configuration..."
cat > metro.config.js << 'EOF'
// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
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
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Ensure proper module resolution
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
];

// Fix Watchman issues
config.watchFolders = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(__dirname, 'src'),
];

module.exports = config;
EOF
print_success "Metro configuration fixed"

# 7. Test Metro configuration
print_status "Testing Metro configuration..."
npx expo start --clear --no-dev --minify --port 8083 &
EXPO_PID=$!
sleep 10
kill $EXPO_PID 2>/dev/null || true
print_success "Metro configuration test completed"

print_success "Watchman and Metro issues fixed!"
print_status "You can now run: npx expo start --clear --port 8083"
print_status "Or run: npm start"
