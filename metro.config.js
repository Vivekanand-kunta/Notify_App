const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const { getSentryExpoConfig } = require("@sentry/react-native/metro");

let config = getDefaultConfig(__dirname);

// Add Sentry
config = getSentryExpoConfig(__dirname, config);

// Add NativeWind
config = withNativeWind(config, { input: "./app/global.css" });

module.exports = config;
