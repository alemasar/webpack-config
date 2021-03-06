const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const parts = require("./webpack.parts");
const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

let p = {}
p['./js/main'] = './src/index.js';
p['./css/style'] = './src/scss/main.scss';

const commonConfig = merge({
    entry: p,
    devtool: 'source-map',
    plugins: [
        new HtmlWebpackPlugin({
            title: "Webpack demo",
            excludeAssets: [/style.js/],
            template: './src/index.html'
        }),
        new HtmlWebpackExcludeAssetsPlugin(),
        new HtmlWebpackHarddiskPlugin()
    ],
});

const PATHS = {
    app: path.join(__dirname, "src"),
    build: path.join(__dirname, "dist"),
};

const productionConfig = merge([
    parts.clean(PATHS.build),
    parts.loadHTML({}),
    parts.extractCSS({
        use: [
            {
                loader: 'css-loader',
                options: {
                    url: true,
                }
            }, 'resolve-url-loader', {
                loader: 'sass-loader',
                options: {}
            }
        ]
    }, false),
    //    parts.attachRevision(),
    parts.loadImages({}),
    parts.onFinished()
]);

const developmentConfig = merge([
    parts.devServer({
        // Customize host/port here if needed
        host: process.env.HOST,
        port: process.env.PORT,
    }),
    parts.loadHTML({}),
    parts.extractCSS({
        use: ["css-loader", "sass-loader"]
    }, true),
    parts.loadImages({}),
    parts.onFinished()
]);

module.exports = mode => {
    if (mode === "production") {
        return merge(commonConfig, productionConfig, { mode });
    }

    return merge(commonConfig, developmentConfig, { mode });
};
