const webpack = require('webpack');
const path = require('path');

module.exports = function override(config, env) {
    // Add Buffer polyfill
    config.resolve.fallback = {
        ...config.resolve.fallback,
        buffer: require.resolve('buffer/'), // Polyfill for buffer
    };

    // Provide Buffer automatically
    config.plugins = [
        ...config.plugins,
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'], // Automatically provide Buffer
        }),
    ];

    // Add alias for '@' to point to the 'src' directory
    config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, 'src'), // Alias '@' to 'src' directory
    };

    // Ignore source map warnings for third-party libraries
    config.ignoreWarnings = [/Failed to parse source map/];

    return config;
};