const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = {
    entry: "./src/js/index.js",
    output: {
        library: 'Subj',
        libraryTarget: 'window',
        libraryExport: 'default',
        path: path.resolve(__dirname, "dist"),
        filename: "js/subj.js",
    },
    //devtool: "source-map",
    module: {
        rules: [{
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
          filename: "style/subj.css",
          //chunkFilename: "_subj_.css"
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