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
