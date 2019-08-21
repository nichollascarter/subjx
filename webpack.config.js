const path = require("path");
const webpack = require('webpack');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

let libraryName = "subjx";

const env = process.env.NODE_ENV || 'production';

if (env === 'production') {
    libraryName = "subjx";
} else {
    libraryName = "subjx.dev";
}

const config = {
    entry: "./src/js/index.js",
    //devtool: "source-map",
    module: {
        rules: [{
            test: /\.js?$/,
            enforce: "pre",
            loader: "eslint-loader",
            exclude: /node_modules/,
            options: {
                emitWarning: true,
                configFile: "./.eslintrc.js"
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
                        publicPath: "./src"
                    }
                },
                "css-loader"
            ]
        }]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "style/subjx.css",
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(env)
            }
        })   
    ],
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: false
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    }
}

const umdConfig = {
    ...config,
    output: {
        library: "subjx",
        libraryTarget: "umd",
        libraryExport: "default",
        path: path.resolve(__dirname, "dist"),
        filename: `js/${libraryName}.js`
    }
};

const commonjs2Config = {
    ...config,
    output: {
        library: "subjx",
        libraryTarget: "commonjs2",
        path: path.resolve(__dirname, "dist"),
        filename: `js/${libraryName}.common.js`
    }
}

module.exports = [
    umdConfig,
    commonjs2Config
];