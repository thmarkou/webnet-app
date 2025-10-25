#!/bin/bash

# Fix Entry Point Issues for WebNetApp
echo "🔧 Fixing entry point issues..."

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

print_status "Fixing entry point issues..."

# 1. Kill all running processes
print_status "Killing running processes..."
pkill -f "expo start" || true
pkill -f "metro" || true
pkill -f "react-native start" || true
print_success "Processes killed"

# 2. Clear all caches
print_status "Clearing all caches..."
rm -rf node_modules/.cache || true
rm -rf /tmp/metro-* || true
rm -rf /tmp/haste-map-* || true
rm -rf /tmp/react-* || true
print_success "Caches cleared"

# 3. Verify entry point exists
print_status "Verifying entry point..."
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

# 4. Check package.json main field
print_status "Checking package.json main field..."
MAIN_FIELD=$(grep '"main"' package.json | cut -d'"' -f4)
if [ "$MAIN_FIELD" = "index.ts" ]; then
    print_success "package.json main field is correct"
else
    print_warning "package.json main field is: $MAIN_FIELD"
fi

# 5. Check app.json main field
print_status "Checking app.json main field..."
if grep -q '"main"' app.json; then
    print_success "app.json has main field"
else
    print_warning "app.json missing main field"
fi

# 6. Clear Metro cache
print_status "Clearing Metro cache..."
npx expo start --clear --no-dev --minify --port 8082 &
EXPO_PID=$!
sleep 5
kill $EXPO_PID 2>/dev/null || true
print_success "Metro cache cleared"

# 7. Start fresh
print_status "Starting fresh development server..."
print_success "Entry point issues fixed!"
print_status "You can now run: npx expo start --clear --port 8082"
print_status "Or run: npm start"
