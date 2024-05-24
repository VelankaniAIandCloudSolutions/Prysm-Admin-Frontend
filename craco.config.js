const webpack = require("webpack");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        crypto: require.resolve("crypto-browserify"),
        buffer: require.resolve("buffer/"),
        stream: require.resolve("stream-browserify"),
      };
      webpackConfig.plugins = [
        ...(webpackConfig.plugins || []),
        new webpack.ProvidePlugin({
          Buffer: ["buffer", "Buffer"],
        }),
      ];
      return webpackConfig;
    },
  },
};
