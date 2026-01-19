const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const config = getDefaultConfig(__dirname);
config.cacheStores = [];
config.resetCache = true;
config.resolver.unstable_enablePackageExports = false;
config.transformer.minifierConfig = {
  keep_quotes: true,
};
config.resolver.sourceExts.push('css');
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: false,
  },
});
module.exports = withNativeWind(config, { input: './global.css' });
