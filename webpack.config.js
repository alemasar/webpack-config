const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const parts = require("./webpack.parts");
const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');
const CleanWebpackPlugin = require("clean-webpack-plugin");


let p = {}
p['./js/main'] = './src/index.js';
p['./css/style'] = './src/scss/main.scss';

const commonConfig = merge({
    entry: p,
    plugins: [
        new HtmlWebpackPlugin({
            title: "Webpack demo",
            excludeAssets: [/style.js/]
        }),
        new HtmlWebpackExcludeAssetsPlugin()
    ],
});

const PATHS = {
    app: path.join(__dirname, "src"),
    build: path.join(__dirname, "dist"),
};

const productionConfig = merge([
    parts.clean(PATHS.build),
    parts.extractCSS({
        use: ["css-loader", "sass-loader"]
    }, false),
    parts.attachRevision(),
]);

const developmentConfig = merge([
    parts.devServer({
        // Customize host/port here if needed
        host: process.env.HOST,
        port: process.env.PORT,
    }),
    parts.extractCSS({
        use: ["css-loader", "sass-loader"]
    }, true),
]);

module.exports = mode => {
    if (mode === "production") {
        return merge(commonConfig, productionConfig, { mode });
    }

    return merge(commonConfig, developmentConfig, { mode });
};
