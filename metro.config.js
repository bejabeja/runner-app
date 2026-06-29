const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure all packages (including react/react-native internals) go through Babel transform
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
