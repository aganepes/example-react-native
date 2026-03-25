const { getDefaultConfig } = require("expo/metro-config");
const { FileStore } = require('@expo/metro-config/file-store');


/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);
// Add wasm asset support
config.resolver.assetExts.push('wasm');
 
// Add COEP and COOP headers to support SharedArrayBuffer
config.server.enhanceMiddleware = (middleware) => {
  return (req, res, next) => {
    res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    middleware(req, res, next);
  };
};
config.cacheStores = [
  new FileStore({
    root: '/path/to/custom/cache',
  }),
];
config.resolver.unstable_enablePackageExports = false;
module.exports = config;