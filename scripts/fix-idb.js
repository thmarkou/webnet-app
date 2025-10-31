#!/usr/bin/env node

/**
 * Post-install script to fix Firebase idb module for React Native
 * This replaces the idb/index.cjs file with a mock since idb is browser-only
 */

const fs = require('fs');
const path = require('path');

const idbMockContent = `// Mock module for idb - replaced to fix Metro bundler in React Native
const noop = () => Promise.resolve({});
const noopObj = () => ({});

const idbMock = {
  openDB: noop,
  deleteDB: noop,
  openKeyval: noop,
  unwrap: noopObj,
};

module.exports = idbMock;
module.exports.default = idbMock;
module.exports.openDB = noop;
module.exports.deleteDB = noop;
module.exports.openKeyval = noop;
module.exports.unwrap = noopObj;
`;

const idbPaths = [
  'node_modules/@firebase/app/node_modules/idb/build/index.cjs',
  'node_modules/idb/build/index.cjs',
];

let fixed = false;

idbPaths.forEach(relPath => {
  const fullPath = path.resolve(__dirname, '..', relPath);
  const dir = path.dirname(fullPath);
  
  if (fs.existsSync(dir)) {
    try {
      fs.writeFileSync(fullPath, idbMockContent, 'utf8');
      console.log(`✅ Fixed: ${relPath}`);
      fixed = true;
    } catch (error) {
      console.warn(`⚠️  Could not fix ${relPath}:`, error.message);
    }
  }
});

if (fixed) {
  console.log('✅ idb mock files created successfully');
} else {
  console.log('ℹ️  No idb packages found to fix');
}

