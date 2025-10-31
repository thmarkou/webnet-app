// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Minimal configuration to ensure TypeScript works
// Add .cjs extension support for idb package
config.resolver.sourceExts = ['js', 'jsx', 'json', 'ts', 'tsx', 'cjs', 'mjs'];
config.resolver.assetExts = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ttf', 'otf', 'woff', 'woff2'];

// Ensure proper resolver main fields
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Fix Firebase "idb" module resolution issue in React Native
// We've already replaced the nested idb/index.cjs file with a mock
// So we just need to ensure Metro can resolve .cjs files properly

module.exports = config;
