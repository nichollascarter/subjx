const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = {
    entry: "./src/js/index.js",
    output: {
        library: 'subjx',
        libraryTarget: 'window',
        libraryExport: 'default',
        path: path.resolve(__dirname, "dist"),
        filename: "js/subjx.js",
    },
    devtool: "source-map",
    module: {
        rules: [{
            test: /\.js?$/,
            enforce: "pre",
            loader: "eslint-loader",
            exclude: /node_modules/,
            options: {
                emitWarning: true,
                configFile: './.eslintrc.js'
            }
        },
        {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: "babel-loader",
                options: {
                    presets: ["@babel/preset-env"]
                }
            }
        },
        {
            test: /\.css$/,
            use: [
                {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: './src'
                    }
                },
                'css-loader'
            ]
        }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "style/subjx.css",
        })
    ],
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true // set to true if you want JS source maps
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    }
}