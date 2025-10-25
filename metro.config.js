// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Fix Metro resolver issues
config.resolver.sourceExts = ['js', 'jsx', 'json', 'ts', 'tsx'];
config.resolver.assetExts = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'];

// Add watch folders to include node_modules
config.watchFolders = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(__dirname, 'src'),
];

// Configure resolver to handle React Native modules properly
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Disable blocklist for problematic modules
config.resolver.blockList = [];

// Enable symlinks for better module resolution
config.resolver.unstable_enableSymlinks = true;

module.exports = config;
