// webpack.config.js
module.exports = {
  // Other configuration options...
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader', // Adds styles to the DOM
          'css-loader',   // Translates CSS into CommonJS
          'sass-loader'   // Compiles Sass to CSS
        ],
      },
    ],
  },
};