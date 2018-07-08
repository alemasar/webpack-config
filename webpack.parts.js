const path = require("path");
const webpack = require("webpack");

exports.devServer = ({ host, port } = {}) => ({
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    host, // Defaults to `localhost`
    port, // Defaults to 8080
    open: true,
    overlay: true,
    watchOptions: {
      // Delay the rebuild after the first change
      aggregateTimeout: 300,

      // Poll using interval (in ms, accepts boolean too)
      poll: 1000,
    },
    historyApiFallback:true,
  },
  plugins: [
    // Ignore node_modules so CPU usage with poll
    // watching drops significantly.
    new webpack.WatchIgnorePlugin([
      path.join(__dirname, "node_modules")
    ]),
  ]
});

const ExtractCssChunks = require("extract-css-chunks-webpack-plugin")

exports.loadCSS = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.scss$/,
        include,
        exclude,

        use: [ExtractCssChunks.loader, "css-loader", "sass-loader"],
      },
    ],
  },
});

const MiniCssExtractPlugin = require("extract-css-chunks-webpack-plugin");

exports.extractCSS = ({ include, exclude, use = [] }) => {
  // Output extracted CSS to a file
  const plugin = new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    filename: "[name].css",
    chunkFilename: "[id].css",
    hot: true // optional as the plugin cannot automatically detect if you are using HOT, not for production use
  });

  return {
    module: {
      rules: [
        {
          test: /\.scss$/,
          include,
          exclude,

          use: [
            MiniCssExtractPlugin.loader
          ].concat(use),
        },
      ],
    },
    plugins: [plugin],
  };
};
