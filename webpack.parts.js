const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("extract-css-chunks-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const GitRevisionPlugin = require("git-revision-webpack-plugin");
const EventHooksPlugin = require('event-hooks-webpack-plugin');

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
    historyApiFallback: true,
  },
  plugins: [
    // Ignore node_modules so CPU usage with poll
    // watching drops significantly.
    new webpack.WatchIgnorePlugin([
      path.join(__dirname, "node_modules")
    ])
  ]
});

exports.extractCSS = ({ include, exclude, use, hot = [] }) => {
  // Output extracted CSS to a file
  const plugin = new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    filename: "[name].css",
    chunkFilename: "[id].css",
    hot: hot, // optional as the plugin cannot automatically detect if you are using HOT, not for production use
    allChunks: true,
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

exports.clean = path => ({
  plugins: [new CleanWebpackPlugin([path])],
});

exports.attachRevision = () => ({
  plugins: [
    new webpack.BannerPlugin({
      banner: new GitRevisionPlugin().version(),
    }),
  ],
});

exports.onFinished = () => ({
  plugins: [

    new EventHooksPlugin({
      'done': () => {
        console.log("As you can see the compiling is finished")
      }
    })
  ],
});

exports.loadImages = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|svg)$/,
        include,
        exclude,
        use: {
          loader: "file-loader",
          options: {
            name: '[name].[ext]',
            useRelativePath: true,
            outputPath: '../dist/',
            publicPath: '../images/'
          }
        },
      },
    ],
  },
});

exports.loadHTML = ({ } = {}) => ({
  module: {
    rules: [
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader'
        }
      },
    ],
  },
});