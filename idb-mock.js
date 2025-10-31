// Mock module for idb (IndexedDB) - not needed in React Native
// Firebase tries to use this browser-only package, but React Native doesn't support IndexedDB

// Export empty functions that match idb API
const noop = () => Promise.resolve({});
const noopObj = () => ({});

// Default export
const idbMock = {
  openDB: noop,
  deleteDB: noop,
  openKeyval: noop,
  unwrap: noopObj,
};

// CommonJS export
module.exports = idbMock;
// ES6 default export
module.exports.default = idbMock;
// Named exports
module.exports.openDB = noop;
module.exports.deleteDB = noop;
module.exports.openKeyval = noop;
module.exports.unwrap = noopObj;
